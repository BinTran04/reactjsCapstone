import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // --- 1. KIỂM TRA ĐĂNG NHẬP KHI LOAD TRANG ---
  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const userString = localStorage.getItem("user");
    if (userString) {
      // Nếu có, chuyển từ chuỗi JSON sang Object và lưu vào state
      setUser(JSON.parse(userString));
    }
  }, []);

  // --- 2. HÀM ĐĂNG XUẤT ---
  const handleLogout = () => {
    // Xóa khỏi localStorage
    localStorage.removeItem("user");
    // Cập nhật state để giao diện render lại ngay lập tức
    setUser(null);
    // Chuyển hướng về trang chủ
    navigate("/");
  };

  return (
    <header className="bg-black/90 text-white py-4 fixed w-full z-50 transition-all border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 font-bold text-2xl">
          <img
            src="https://cyberlearn.vn/wp-content/uploads/2020/03/cyberlearn-min-new-opt2.png"
            alt="Logo"
            className="h-10"
          />
          <span>CyberMovie</span>
        </NavLink>

        {/* Menu (Giữ nguyên menu của bạn) */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <NavLink to="/" className="hover:text-orange-500 transition">
            Trang chủ
          </NavLink>
          <a href="#lich-chieu" className="hover:text-orange-500 transition">
            Lịch chiếu
          </a>
          <a href="#cum-rap" className="hover:text-orange-500 transition">
            Cụm rạp
          </a>
        </nav>

        {/* --- 3. KHU VỰC TÀI KHOẢN (SỬA ĐOẠN NÀY) --- */}
        <div className="flex items-center space-x-4">
          {user ? (
            // === NẾU ĐÃ ĐĂNG NHẬP ===
            <div className="flex items-center gap-3">
              <span className="text-gray-300">
                Hi,{" "}
                <span className="text-orange-500 font-bold">{user.hoTen}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded transition"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            // === NẾU CHƯA ĐĂNG NHẬP ===
            <>
              <NavLink
                to="/login"
                className="text-gray-300 hover:text-white font-medium transition"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/register"
                className="bg-white text-black hover:bg-orange-500 hover:text-white px-4 py-2 rounded font-bold transition"
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
