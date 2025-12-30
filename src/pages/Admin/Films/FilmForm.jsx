import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../services/api"; // Import biến api chuẩn của dự án
import axios from "axios";
import moment from "moment";

export default function FilmForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [componentSize, setComponentSize] = useState("default");
  const [imgPreview, setImgPreview] = useState("");

  const [formData, setFormData] = useState({
    tenPhim: "",
    trailer: "",
    moTa: "",
    ngayKhoiChieu: "",
    dangChieu: false,
    sapChieu: false,
    hot: false,
    danhGia: 0,
    hinhAnh: null,
  });

  // --- 1. LẤY DỮ LIỆU ---
  useEffect(() => {
    if (isEdit) {
      const fetchFilmDetail = async () => {
        try {
          // Dùng api.get (tự động gắn TokenCybersoft)
          const result = await api.get(
            `/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`
          );
          const filmData = result.data.content;

          if (filmData) {
            setFormData({
              tenPhim: filmData.tenPhim || "",
              trailer: filmData.trailer || "",
              moTa: filmData.moTa || "",
              ngayKhoiChieu: filmData.ngayKhoiChieu
                ? moment(filmData.ngayKhoiChieu).format("YYYY-MM-DD")
                : "",
              dangChieu: filmData.dangChieu || false,
              sapChieu: filmData.sapChieu || false,
              hot: filmData.hot || false,
              danhGia: filmData.danhGia || 0,
              hinhAnh: null,
            });
            setImgPreview(filmData.hinhAnh);
          }
        } catch (error) {
          console.error("Lỗi lấy chi tiết phim:", error);
        }
      };
      fetchFilmDetail();
    }
  }, [isEdit, id]);

  // --- 2. XỬ LÝ NHẬP LIỆU ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, hinhAnh: file });
      setImgPreview(URL.createObjectURL(file));
    }
  };

  // --- 3. SUBMIT FORM ---
  // ... (bên trong FilmForm.jsx)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user?.accessToken;

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    const data = new FormData();
    data.append("tenPhim", formData.tenPhim);
    data.append("trailer", formData.trailer);
    data.append("moTa", formData.moTa);
    data.append("maNhom", "GP01");
    data.append(
      "ngayKhoiChieu",
      moment(formData.ngayKhoiChieu).format("DD/MM/YYYY")
    );
    data.append("sapChieu", formData.sapChieu);
    data.append("dangChieu", formData.dangChieu);
    data.append("hot", formData.hot);
    data.append("danhGia", formData.danhGia);

    // QUAN TRỌNG: Key phải là "hinhAnh"
    if (formData.hinhAnh) {
      data.append("hinhAnh", formData.hinhAnh, formData.hinhAnh.name);
    }

    console.log("--- DỮ LIỆU GỬI ĐI ---");
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // QUAN TRỌNG: Đặt Content-Type là undefined để trình duyệt tự nhận diện FormData
          "Content-Type": undefined,
        },
      };

      // Thêm chuỗi ngẫu nhiên vào tên phim để tránh lỗi trùng tên (nguyên nhân gây lỗi 500 phổ biến)
      if (!isEdit && !formData.tenPhim.includes("Test")) {
        data.set(
          "tenPhim",
          `${formData.tenPhim} - ${Math.floor(Math.random() * 1000)}`
        );
      }

      if (isEdit) {
        data.append("maPhim", id);
        await api.post("/QuanLyPhim/CapNhatPhimUpload", data, config);
        alert("Cập nhật phim thành công!");
      } else {
        await api.post("/QuanLyPhim/ThemPhimUploadHinh", data, config);
        alert("Thêm phim mới thành công!");
      }

      navigate("/admin/films");
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert(
        error.response?.data?.content ||
          "Lỗi 500: Server sập do tên phim bị trùng hoặc file ảnh quá lớn!"
      );
    }
    append;
  };

  // Style chung cho Input: Thêm text-gray-900 và bg-white để sửa lỗi chữ trắng
  const inputClass =
    "w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-sm text-gray-900 bg-white";

  // Helper render Switch
  const renderSwitch = (name, checked, label) => (
    <div className="flex items-center mb-6">
      <label className="w-40 font-semibold text-gray-600 text-sm">
        {label}:
      </label>
      <div className="flex-1">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={!!checked}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-7xl mx-auto">
      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
        {isEdit ? `Chỉnh Sửa Phim: ${formData.tenPhim}` : "Thêm Mới Phim"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-8">
          <label className="w-40 font-semibold text-gray-600 text-sm">
            Form Size:
          </label>
          <div className="flex gap-2">
            {["Small", "Default", "Large"].map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => setComponentSize(size.toLowerCase())}
                className={`px-4 py-1 border rounded text-sm transition ${
                  componentSize === size.toLowerCase()
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center mb-6">
          <label className="w-40 font-semibold text-gray-600 text-sm">
            Tên phim:
          </label>
          <div className="flex-1">
            <input
              name="tenPhim"
              value={formData.tenPhim}
              onChange={handleChange}
              className={inputClass} // Dùng class đã fix màu chữ
            />
          </div>
        </div>

        <div className="flex items-center mb-6">
          <label className="w-40 font-semibold text-gray-600 text-sm">
            Trailer:
          </label>
          <div className="flex-1">
            <input
              name="trailer"
              value={formData.trailer}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-start mb-6">
          <label className="w-40 font-semibold text-gray-600 text-sm pt-2">
            Mô tả:
          </label>
          <div className="flex-1">
            <textarea
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center mb-6">
          <label className="w-40 font-semibold text-gray-600 text-sm">
            Ngày khởi chiếu:
          </label>
          <div className="flex-1">
            <input
              type="date"
              name="ngayKhoiChieu"
              value={formData.ngayKhoiChieu}
              onChange={handleChange}
              className={`${inputClass} w-48`}
            />
          </div>
        </div>

        {renderSwitch("dangChieu", formData.dangChieu, "Đang chiếu")}
        {renderSwitch("sapChieu", formData.sapChieu, "Sắp chiếu")}
        {renderSwitch("hot", formData.hot, "Hot")}

        <div className="flex items-center mb-6">
          <label className="w-40 font-semibold text-gray-600 text-sm">
            Số sao:
          </label>
          <div className="flex-1">
            <input
              type="number"
              name="danhGia"
              value={formData.danhGia}
              onChange={handleChange}
              min="0"
              max="10"
              className={`${inputClass} w-24`}
            />
          </div>
        </div>

        <div className="flex items-start mb-8">
          <label className="w-40 font-semibold text-gray-600 text-sm pt-2">
            Hình ảnh:
          </label>
          <div className="flex-1 flex flex-col gap-3">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 w-max"
            />
            <div className="mt-2 w-40 h-40 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative">
              {imgPreview ? (
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm text-center px-2 font-medium">
                  Chưa chọn ảnh
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label className="w-40"></label>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-8 rounded shadow transition duration-200"
          >
            {isEdit ? "CẬP NHẬT" : "THÊM MỚI"}
          </button>
        </div>
      </form>
    </div>
  );
}
