import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";

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

  useEffect(() => {
    if (isEdit) {
      setFormData({
        tenPhim: "Mỹ Nhân Ngư",
        trailer: "https://youtube.com/example",
        moTa: "Phim hài...",
        ngayKhoiChieu: "2024-01-01",
        dangChieu: true,
        sapChieu: false,
        hot: true,
        danhGia: 8,
        hinhAnh: null,
      });
      setImgPreview(
        "https://movienew.cybersoft.edu.vn/hinhanh/my-nhan-ngu_gp01.jpg"
      );
    }
  }, [isEdit]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu submit:", formData);
    alert(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
    navigate("/admin/films");
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
          {/* Icon Mũi tên */}
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

        {/* --- CÁC INPUT (ĐÃ THÊM text-gray-900 ĐỂ HIỆN CHỮ ĐEN) --- */}

        {/* Tên Phim */}
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

        {/* Trailer */}
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

        {/* Mô tả */}
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

        {/* Ngày chiếu & Đánh giá */}
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
            {/* Đang chiếu */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="dangChieu"
                  checked={formData.dangChieu}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-gray-700 text-sm">Đang chiếu</span>
            </label>

            {/* Sắp chiếu */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="sapChieu"
                  checked={formData.sapChieu}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-gray-700 text-sm">Sắp chiếu</span>
            </label>

            {/* Hot */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="hot"
                  checked={formData.hot}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
              </div>
              <span className="text-gray-700 text-sm font-bold">HOT</span>
            </label>
          </div>
        </div>

        {/* Upload Ảnh - SỬA LẠI LAYOUT (Dọc) */}
        <div>
          <label
            className={`block font-semibold text-gray-700 mb-2 ${getLabelSize()}`}
          >
            Hình ảnh poster
          </label>

          {/* Đổi từ space-x-6 (ngang) thành space-y-3 (dọc) và bỏ flex-row */}
          <div className="flex flex-col items-start gap-4">
            {/* 1. Khung Preview */}
            <div className="w-40 h-40 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shadow-sm">
              {imgPreview ? (
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg
                    className="w-10 h-10 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>

            {/* 2. Nút chọn file & Info (Nằm bên dưới khung ảnh) */}
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
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Chọn file ảnh
              </label>

              <div className="text-sm text-gray-500">
                <p className="italic">* Dung lượng dưới 10MB</p>
                <p className="italic">* Định dạng: JPG, PNG, GIF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm hover:shadow transition duration-200"
          >
            {isEdit ? "Cập Nhật" : "Thêm Phim"}
          </button>
        </div>
      </form>
    </div>
  );
}
