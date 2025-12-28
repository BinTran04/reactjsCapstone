import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function FilmManagement() {
  // Dữ liệu giả (Mock Data)
  const [films, setFilms] = useState([
    {
      maPhim: 1314,
      tenPhim: "Mỹ Nhân Ngư",
      hinhAnh: "https://movienew.cybersoft.edu.vn/hinhanh/my-nhan-ngu_gp01.jpg",
      moTa: "Phim hài Châu Tinh Trì kể về nàng tiên cá...",
    },
    {
      maPhim: 1329,
      tenPhim: "Bố Già",
      hinhAnh: "https://movienew.cybersoft.edu.vn/hinhanh/bo-gia_gp01.jpg",
      moTa: "Phim tình cảm gia đình của Trấn Thành...",
    },
    {
      maPhim: 1344,
      tenPhim: "Avengers: Endgame",
      hinhAnh:
        "https://movienew.cybersoft.edu.vn/hinhanh/avengers-endgame_gp01.jpg",
      moTa: "Biệt đội siêu anh hùng chống lại Thanos...",
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phim này không?")) {
      setFilms(films.filter((film) => film.maPhim !== id));
    }
  };

  return (
    <div className="container mx-auto">
      {/* 1. Tiêu đề Trang */}
      <h3 className="text-3xl font-bold mb-6 text-gray-800">Quản Lý Phim</h3>

      {/* 2. Nút Thêm Phim */}
      <div className="mb-6">
        <NavLink
          to="/admin/films/add"
          className="bg-white border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors px-4 py-2 rounded font-semibold"
        >
          Thêm phim
        </NavLink>
      </div>

      {/* 3. Thanh Tìm Kiếm (Search Bar) */}
      <div className="relative mb-6 flex w-full">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
          placeholder="Nhập tên phim cần tìm..."
        />
        <button className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700 transition duration-200 font-medium">
          TÌM
        </button>
      </div>

      {/* 4. Bảng Danh Sách (Table) */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          {/* Header Bảng */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold leading-normal">
            <tr>
              <th className="py-3 px-6 text-left border-b border-gray-200">
                Mã Phim
              </th>
              <th className="py-3 px-6 text-left border-b border-gray-200">
                Hình ảnh
              </th>
              <th className="py-3 px-6 text-left border-b border-gray-200">
                Tên phim
              </th>
              <th className="py-3 px-6 text-left border-b border-gray-200">
                Mô tả
              </th>
              <th className="py-3 px-6 text-center border-b border-gray-200">
                Hành động
              </th>
            </tr>
          </thead>

          {/* Body Bảng */}
          <tbody className="text-gray-700 text-sm font-light">
            {films.map((film, index) => (
              <tr
                key={film.maPhim}
                className={`border-b border-gray-200 hover:bg-gray-50 transition duration-150 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                {/* Cột Mã Phim */}
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                  {film.maPhim}
                </td>

                {/* Cột Hình Ảnh */}
                <td className="py-3 px-6 text-left">
                  <div className="w-16 h-16 border rounded overflow-hidden shadow-sm">
                    <img
                      src={film.hinhAnh}
                      alt={film.tenPhim}
                      className="w-full h-full object-cover"
                      // Xử lý nếu ảnh lỗi thì hiện ảnh mặc định
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                </td>

                {/* Cột Tên Phim */}
                <td className="py-3 px-6 text-left font-bold text-blue-900">
                  {film.tenPhim}
                </td>

                {/* Cột Mô Tả (Cắt ngắn chữ) */}
                <td className="py-3 px-6 text-left">
                  <p className="w-64 truncate" title={film.moTa}>
                    {film.moTa}
                  </p>
                </td>

                {/* Cột Hành Động */}
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-4">
                    {/* Nút Edit */}
                    <NavLink
                      to={`/admin/films/edit/${film.maPhim}`}
                      className="transform hover:text-blue-500 hover:scale-110 transition duration-200"
                      title="Chỉnh sửa"
                    >
                      {/* SVG Icon Edit */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-blue-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </NavLink>

                    {/* Nút Delete */}
                    <button
                      onClick={() => handleDelete(film.maPhim)}
                      className="transform hover:text-red-500 hover:scale-110 transition duration-200"
                      title="Xóa"
                    >
                      {/* SVG Icon Trash */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>

                    {/* Nút Lịch chiếu (Tùy chọn thêm cho giống mẫu thật) */}
                    <NavLink
                      to="/admin/showtime"
                      className="transform hover:text-green-500 hover:scale-110 transition duration-200"
                      title="Tạo lịch chiếu"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                        />
                      </svg>
                    </NavLink>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
