import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    maNhom: "GP01",
    hoTen: "",
  });

  // State riêng cho nhập lại mật khẩu
  const [confirmPass, setConfirmPass] = useState("");

  // Hàm xử lý khi người dùng nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm xử lý Đăng Ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra mật khẩu nhập lại
    if (formData.matKhau !== confirmPass) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      // 2. Gọi API Đăng Ký
      const response = await api.post("/QuanLyNguoiDung/DangKy", formData);

      console.log("Kết quả đăng ký:", response.data);
      alert("Đăng ký thành công!");

      // 3. Chuyển hướng sang trang đăng nhập
      navigate("/login");
    } catch (error) {
      console.log("Lỗi đăng ký:", error);
      // Hiển thị lỗi từ server trả về (nếu có)
      const message = error.response?.data?.content || "Đăng ký thất bại!";
      alert(message);
    }
  };

  // Class chung cho tất cả các ô input để đồng bộ giao diện
  const inputClass =
    "w-full bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-gray-700 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden font-sans">
      {/* 1. HÌNH NỀN GIỐNG TRANG CHỦ (Có lớp phủ tối) */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          // Dùng ảnh Avengers hoặc ảnh bất kỳ làm nền
          style={{
            backgroundImage:
              "url('https://movienew.cybersoft.edu.vn/hinhanh/avengers-endgame.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* 2. FORM ĐĂNG KÝ (Hiệu ứng kính mờ) */}
      <div className="relative z-10 bg-black/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg mx-4">
        {/* Logo hoặc Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
            Đăng Ký
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Trở thành thành viên của CyberMovie
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Mật khẩu - Dùng chung class inputClass để ô vuông giống hệt các ô khác */}
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

          {/* Nhập lại mật khẩu */}
          <div>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {/* Họ tên */}
          <div>
            <input
              type="text"
              name="hoTen"
              placeholder="Họ tên đầy đủ"
              value={formData.hoTen}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <input
              type="text"
              name="soDt"
              placeholder="Số điện thoại"
              value={formData.soDt}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Nút Đăng Ký */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition duration-200 mt-4"
          >
            ĐĂNG KÝ NGAY
          </button>

          {/* 3. NÚT CHUYỂN QUA ĐĂNG NHẬP (Làm đẹp hơn) */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600/50">
            <span className="text-gray-400 text-sm">Bạn đã có tài khoản?</span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-orange-500 hover:text-orange-400 font-bold text-sm transition underline decoration-transparent hover:decoration-orange-400"
            >
              Đăng nhập tại đây
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
