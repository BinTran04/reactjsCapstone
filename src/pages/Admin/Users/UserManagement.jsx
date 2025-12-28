import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function UserManagement() {
  // 1. Mock Data (Dữ liệu giả lập)
  const [users, setUsers] = useState([
    {
      taiKhoan: "admin_super",
      hoTen: "Nguyễn Quản Trị",
      email: "admin@cyber.com",
      soDt: "0901234567",
      maLoaiNguoiDung: "QuanTri", // Quản trị
    },
    {
      taiKhoan: "user123",
      hoTen: "Trần Khách Hàng",
      email: "khachhang@gmail.com",
      soDt: "0909888777",
      maLoaiNguoiDung: "KhachHang", // Khách hàng
    },
    {
      taiKhoan: "binhutlk",
      hoTen: "Bình Admin",
      email: "binh@gmail.com",
      soDt: "0366465549",
      maLoaiNguoiDung: "QuanTri",
    },
    {
      taiKhoan: "nguoidung_moi",
      hoTen: "Lê Văn Mới",
      email: "moi@yahoo.com",
      soDt: "0123456789",
      maLoaiNguoiDung: "KhachHang",
    },
  ]);

  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (taiKhoan) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng "${taiKhoan}"?`)) {
      setUsers(users.filter((user) => user.taiKhoan !== taiKhoan));
      alert("Đã xóa thành công!");
    }
  };

  // Helper render loại người dùng (Badge màu)
  const renderUserType = (type) => {
    if (type === "QuanTri") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
          Quản Trị
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600 border border-green-200">
        Khách Hàng
      </span>
    );
  };

  return (
    <div className="container mx-auto">
      {/* 1. Header Trang */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-bold text-gray-800">Quản Lý Người Dùng</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition duration-200 font-medium flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Thêm Người Dùng
        </button>
      </div>

      {/* 2. Thanh Tìm Kiếm */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        {/* Thêm items-center để căn giữa trục dọc */}
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            {/* Icon kính lúp: Dùng absolute và inset-y-0 để luôn nằm giữa theo chiều dọc */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <input
              type="text"
              // QUAN TRỌNG: Thêm h-11 (44px) để cố định chiều cao, bỏ p-3 cũ đi
              className="block w-full h-11 pl-10 pr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Nhập tài khoản hoặc họ tên người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            // QUAN TRỌNG: Thêm h-11 để chiều cao BẰNG input, thêm flex items-center justify-center để chữ nằm giữa
            className="h-11 px-6 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors flex items-center justify-center whitespace-nowrap"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* 3. Bảng Danh Sách (Table) */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4">
                STT
              </th>
              <th scope="col" className="px-6 py-4">
                Tài Khoản
              </th>
              <th scope="col" className="px-6 py-4">
                Họ Tên
              </th>
              <th scope="col" className="px-6 py-4">
                Email
              </th>
              <th scope="col" className="px-6 py-4">
                Số ĐT
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Loại Người Dùng
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                (u) =>
                  u.taiKhoan.includes(searchTerm) ||
                  u.hoTen.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user, index) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {user.taiKhoan}
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-600">
                    {user.hoTen}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.soDt}</td>
                  <td className="px-6 py-4 text-center">
                    {renderUserType(user.maLoaiNguoiDung)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      {/* Nút Edit */}
                      <button
                        className="font-medium text-blue-600 hover:underline p-2 hover:bg-blue-100 rounded-full transition"
                        title="Chỉnh sửa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>

                      {/* Nút Delete */}
                      <button
                        onClick={() => handleDelete(user.taiKhoan)}
                        className="font-medium text-red-600 hover:underline p-2 hover:bg-red-100 rounded-full transition"
                        title="Xóa người dùng"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {/* Hiển thị khi không tìm thấy */}
            {users.length > 0 &&
              users.filter((u) => u.taiKhoan.includes(searchTerm)).length ===
                0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Không tìm thấy người dùng nào phù hợp
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Phân trang (Giao diện tĩnh) */}
      <div className="flex justify-end mt-4">
        <nav aria-label="Page navigation">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Previous
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
