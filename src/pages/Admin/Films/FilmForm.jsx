import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
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

  // 1. LẤY THÔNG TIN PHIM KHI Ở CHẾ ĐỘ EDIT
  // --- THAY THẾ ĐOẠN useEffect CŨ BẰNG ĐOẠN NÀY ---
  useEffect(() => {
    if (isEdit) {
      const fetchFilmDetail = async () => {
        try {
          console.log("1. Bắt đầu lấy dữ liệu phim ID:", id);

          const result = await axios.get(
            `https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`
          );

          console.log("2. Kết quả API trả về:", result.data);

          const filmData = result.data.content;

          if (!filmData) {
            console.error(
              "3. Lỗi: Không tìm thấy data trong result.data.content"
            );
            return;
          }

          console.log("3. Dữ liệu phim tìm thấy:", filmData);

          // Cập nhật State
          setFormData({
            tenPhim: filmData.tenPhim || "",
            trailer: filmData.trailer || "",
            moTa: filmData.moTa || "",
            // Kiểm tra kỹ ngày tháng
            ngayKhoiChieu: filmData.ngayKhoiChieu
              ? moment(filmData.ngayKhoiChieu).format("YYYY-MM-DD")
              : "",
            dangChieu: filmData.dangChieu || false,
            sapChieu: filmData.sapChieu || false,
            hot: filmData.hot || false,
            danhGia: filmData.danhGia || 0,
            hinhAnh: null,
          });

          // Set ảnh preview
          setImgPreview(filmData.hinhAnh);
          console.log("4. Đã setFormData thành công!");
        } catch (error) {
          console.error("❌ Lỗi khi gọi API:", error);
          if (error.response && error.response.status === 404) {
            alert("Phim này không tồn tại hoặc đã bị xóa!");
            navigate("/admin/films"); // Quay về danh sách nếu lỗi
          }
        }
      };

      fetchFilmDetail();
    }
  }, [isEdit, id]);

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

  // 2. LOGIC SUBMIT (PHÂN BIỆT THÊM & SỬA)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo FormData
    const data = new FormData();
    data.append("tenPhim", formData.tenPhim);
    data.append("trailer", formData.trailer);
    data.append("moTa", formData.moTa);
    data.append("maNhom", "GP01"); // Mã nhóm cố định
    data.append(
      "ngayKhoiChieu",
      moment(formData.ngayKhoiChieu).format("DD/MM/YYYY")
    );
    data.append("sapChieu", formData.sapChieu);
    data.append("dangChieu", formData.dangChieu);
    data.append("hot", formData.hot);
    data.append("danhGia", formData.danhGia);

    // Xử lý File ảnh
    if (formData.hinhAnh) {
      // Nếu có chọn file mới -> gửi file
      data.append("File", formData.hinhAnh, formData.hinhAnh.name);
    } else if (isEdit) {
      // TRƯỜNG HỢP KHÓ:
      // Nếu đang edit mà không chọn ảnh mới, API CapNhatPhimUpload thường VẪN ĐÒI có file.
      // Nếu backend hỗ trợ giữ ảnh cũ thì không sao, nhưng nếu bắt buộc:
      // Bạn có thể cần fetch ảnh cũ về convert sang Blob (nâng cao),
      // hoặc đơn giản là nhắc user chọn lại ảnh nếu API báo lỗi.
      // Ở đây tạm thời ta không append 'File' nếu không có file mới.
    }

    try {
      if (isEdit) {
        // --- LOGIC CẬP NHẬT ---
        // API yêu cầu thêm maPhim vào body khi update
        data.append("maPhim", id);

        await axios.post(
          "https://movienew.cybersoft.edu.vn/api/QuanLyPhim/CapNhatPhimUpload",
          data
        );
        alert("Cập nhật phim thành công!");
      } else {
        // --- LOGIC THÊM MỚI ---
        await axios.post(
          "https://movienew.cybersoft.edu.vn/api/QuanLyPhim/ThemPhimUploadHinh",
          data
        );
        alert("Thêm phim mới thành công!");
      }

      navigate("/admin/films");
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert(error.response?.data?.content || "Có lỗi xảy ra!");
    }
  };

  const getSizeClass = () => {
    if (componentSize === "small") return "p-2 text-sm";
    if (componentSize === "large") return "p-4 text-lg";
    return "p-3 text-base";
  };

  const getLabelSize = () => {
    if (componentSize === "small") return "text-xs mb-1";
    if (componentSize === "large") return "text-base mb-3";
    return "text-sm mb-2";
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Chỉnh Sửa Phim" : "Thêm Phim Mới"}
        </h3>
        <NavLink
          to="/admin/films"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          <span className="font-medium text-sm">Quay lại danh sách</span>
        </NavLink>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Size Switcher */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="font-semibold text-gray-700 text-sm">
            Form Size:
          </span>
          {["small", "default", "large"].map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => setComponentSize(size)}
              className={`px-3 py-1 text-sm rounded border capitalize transition ${
                componentSize === size
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* --- CÁC INPUT --- */}
        <div>
          <label
            className={`block font-semibold text-gray-700 ${getLabelSize()}`}
          >
            Tên phim
          </label>
          <input
            name="tenPhim"
            value={formData.tenPhim}
            onChange={handleChange}
            className={`w-full rounded border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition ${getSizeClass()}`}
          />
        </div>

        <div>
          <label
            className={`block font-semibold text-gray-700 ${getLabelSize()}`}
          >
            Trailer
          </label>
          <input
            name="trailer"
            value={formData.trailer}
            onChange={handleChange}
            className={`w-full rounded border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition ${getSizeClass()}`}
          />
        </div>

        <div>
          <label
            className={`block font-semibold text-gray-700 ${getLabelSize()}`}
          >
            Mô tả
          </label>
          <textarea
            name="moTa"
            value={formData.moTa}
            onChange={handleChange}
            rows={4}
            className={`w-full rounded border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition ${getSizeClass()}`}
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label
              className={`block font-semibold text-gray-700 ${getLabelSize()}`}
            >
              Ngày khởi chiếu
            </label>
            <input
              type="date"
              name="ngayKhoiChieu"
              value={formData.ngayKhoiChieu}
              onChange={handleChange}
              className={`w-full rounded border border-gray-300 text-gray-900 focus:border-blue-500 outline-none ${getSizeClass()}`}
            />
          </div>
          <div>
            <label
              className={`block font-semibold text-gray-700 ${getLabelSize()}`}
            >
              Đánh giá (Sao)
            </label>
            <input
              type="number"
              name="danhGia"
              value={formData.danhGia}
              onChange={handleChange}
              min="1"
              max="10"
              className={`w-full rounded border border-gray-300 text-gray-900 focus:border-blue-500 outline-none ${getSizeClass()}`}
            />
          </div>
        </div>

        {/* Trạng thái */}
        <div>
          <label
            className={`block font-semibold text-gray-700 mb-2 ${getLabelSize()}`}
          >
            Trạng thái
          </label>
          <div className="flex space-x-8 items-center bg-gray-50 p-4 rounded border border-gray-200">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="dangChieu"
                checked={formData.dangChieu}
                onChange={handleChange}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="text-gray-700 text-sm">Đang chiếu</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="sapChieu"
                checked={formData.sapChieu}
                onChange={handleChange}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="text-gray-700 text-sm">Sắp chiếu</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="hot"
                checked={formData.hot}
                onChange={handleChange}
                className="accent-red-500 w-5 h-5"
              />
              <span className="text-gray-700 text-sm font-bold">HOT</span>
            </label>
          </div>
        </div>

        {/* Upload Ảnh */}
        <div>
          <label
            className={`block font-semibold text-gray-700 mb-2 ${getLabelSize()}`}
          >
            Hình ảnh poster
          </label>
          <div className="flex flex-col items-start gap-4">
            <div className="w-40 h-52 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shadow-sm">
              {imgPreview ? (
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="file"
                id="upload-photo"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <label
                htmlFor="upload-photo"
                className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded font-medium transition duration-200 inline-flex items-center w-max mb-2"
              >
                Chọn file ảnh
              </label>
              <div className="text-sm text-gray-500 italic">
                {isEdit
                  ? "* Lưu ý: Chọn ảnh mới sẽ thay thế ảnh cũ"
                  : "* Dung lượng dưới 10MB"}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm hover:shadow transition duration-200"
          >
            {isEdit ? "Cập Nhật Phim" : "Thêm Phim Mới"}
          </button>
        </div>
      </form>
    </div>
  );
}
