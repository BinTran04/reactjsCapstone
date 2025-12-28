import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom"; // Thêm useNavigate

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 1. Kiểm tra localStorage khi Header được load
  useEffect(() => {
    const userString = localStorage.getItem("USER_INFO");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  // 2. Hàm Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("USER_INFO"); // Xóa dữ liệu
    setUser(null); // Reset state
    navigate("/"); // Về trang chủ
    window.location.reload(); // Load lại trang để reset giao diện
  };

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-white/10 fixed w-full z-50 top-0 start-0 transition-all duration-300">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* 1. Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://cyberlearn.vn/wp-content/uploads/2020/03/cyberlearn-min-new-opt2.png"
            className="h-8"
            alt="CyberSoft Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            CyberMovie
          </span>
        </Link>

        {/* 2. Khu vực Tài khoản (Đã sửa logic) */}
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-4">
          {user ? (
            // === Nếu ĐÃ ĐĂNG NHẬP ===
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">
                Hi,{" "}
                <span className="text-yellow-400 font-bold">
                  {user.taiKhoan}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            // === Nếu CHƯA ĐĂNG NHẬP (Giữ nguyên code cũ của bạn) ===
            <div className="flex gap-2">
              <NavLink
                to="/login"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/register"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2"
              >
                Đăng ký
              </NavLink>
            </div>
          )}
        </div>

        {/* 3. Menu Chính */}
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border-0 rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 px-3 text-blue-500 font-bold bg-transparent md:p-0"
                    : "block py-2 px-3 text-white rounded hover:text-blue-500 bg-transparent md:p-0 transition-colors"
                }
              >
                Trang chủ
              </NavLink>
            </li>
            <li>
              <a
                href="#lich-chieu"
                className="block py-2 px-3 text-white rounded hover:text-blue-500 md:p-0 transition-colors"
              >
                Lịch chiếu
              </a>
            </li>
            <li>
              <a
                href="#cum-rap"
                className="block py-2 px-3 text-white rounded hover:text-blue-500 md:p-0 transition-colors"
              >
                Cụm rạp
              </a>
            </li>
            <li>
              <a
                href="#ung-dung"
                className="block py-2 px-3 text-white rounded hover:text-blue-500 md:p-0 transition-colors"
              >
                Ứng dụng
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
