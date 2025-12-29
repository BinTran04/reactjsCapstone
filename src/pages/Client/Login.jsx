import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/QuanLyNguoiDung/DangNhap", formData);

      const userInfo = response.data.content; // Lấy thông tin user

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(userInfo));

      alert("Đăng nhập thành công!");

      // --- KIỂM TRA QUYỀN ĐỂ CHUYỂN HƯỚNG ---
      if (userInfo.maLoaiNguoiDung === "QuanTri") {
        // Nếu là Admin -> Vào trang quản lý phim
        navigate("/admin/films");
      } else {
        // Nếu là Khách -> Về trang chủ
        navigate("/");
      }
    } catch (error) {
      console.log("Lỗi đăng nhập:", error);
      const message = error.response?.data?.content || "Đăng nhập thất bại!";
      alert(message);
    }
  };

  // Class style chung (giống trang Register)
  const inputClass =
    "w-full bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-gray-700 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden font-sans">
      {/* 1. HÌNH NỀN (Giống trang Register) */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://movienew.cybersoft.edu.vn/hinhanh/avengers-endgame.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* 2. FORM ĐĂNG NHẬP */}
      <div className="relative z-10 bg-black/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
            Đăng Nhập
          </h2>
          <p className="text-gray-400 text-sm mt-2">Chào mừng trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tài khoản */}
          <div>
            <input
              type="text"
              name="taiKhoan"
              placeholder="Tài khoản"
              value={formData.taiKhoan}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <input
              type="password"
              name="matKhau"
              placeholder="Mật khẩu"
              value={formData.matKhau}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Nút Đăng Nhập */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition duration-200"
          >
            ĐĂNG NHẬP
          </button>

          {/* Chuyển qua Đăng ký */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600/50">
            <span className="text-gray-400 text-sm">Chưa có tài khoản?</span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-orange-500 hover:text-orange-400 font-bold text-sm transition underline decoration-transparent hover:decoration-orange-400"
            >
              Đăng ký ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
