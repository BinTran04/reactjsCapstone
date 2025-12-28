import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.taiKhoan.trim()) {
      newErrors.taiKhoan = "Tài khoản không được để trống";
      isValid = false;
    }

    if (!formData.matKhau.trim()) {
      newErrors.matKhau = "Mật khẩu không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // --- GIẢ LẬP DỮ LIỆU TỪ API TRẢ VỀ ---
      // Nếu tài khoản là "admin" thì cho làm Quản trị, ngược lại là Khách hàng
      const userType = formData.taiKhoan === "admin" ? "QuanTri" : "KhachHang";

      const userInfo = {
        ...formData,
        maLoaiNguoiDung: userType, // Đây là cái cờ quan trọng nhất
        accessToken: "token_gia_lap_123456",
      };

      // 1. Lưu xuống LocalStorage để dùng ở mọi nơi
      localStorage.setItem("USER_INFO", JSON.stringify(userInfo));

      alert(`Đăng nhập thành công với vai trò: ${userType}`);

      // 2. Điều hướng: Admin thì vào trang admin, User thì về trang chủ
      if (userType === "QuanTri") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
      <form
        onSubmit={handleSubmit}
        className="bg-black/75 p-10 rounded-xl w-96 shadow-2xl"
      >
        <h2 className="text-white text-3xl font-bold mb-8 text-center uppercase">
          Đăng nhập
        </h2>
        <div className="mb-6">
          <input
            name="taiKhoan"
            placeholder="Tài khoản"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {errors.taiKhoan && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.taiKhoan}
            </p>
          )}
        </div>
        <div className="mb-8">
          <input
            type="password"
            name="matKhau"
            placeholder="Mật khẩu"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {errors.matKhau && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.matKhau}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-300 transform hover:scale-105"
        >
          Đăng nhập
        </button>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">Chưa có tài khoản? </span>
          <NavLink
            to="/register"
            className="text-blue-500 hover:text-blue-400 font-semibold transition-colors"
          >
            Đăng ký ngay
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Login;
