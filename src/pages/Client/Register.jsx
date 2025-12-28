import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { quanLyNguoiDungService } from "../../services/quanLyNguoiDung";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    maNhom: "GP01", // Mã nhóm mặc định của Cybersoft
    hoTen: "",
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

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }
    const phoneRegex = /^[0-9]+$/;
    if (!formData.soDt.trim()) {
      newErrors.soDt = "Số điện thoại không được để trống";
      isValid = false;
    } else if (!phoneRegex.test(formData.soDt)) {
      newErrors.soDt = "Số điện thoại phải là số";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Chặn reload trang
    if (validate()) {
      console.log("Đăng ký thành công:", formData);
      alert("Đăng ký thành công! Hãy đăng nhập ngay.");

      // Chuyển hướng sang trang Đăng nhập
      navigate("/login");
    }
  };

  const inputClass =
    "bg-gray-800/50 border border-gray-500 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3 placeholder-gray-400 mt-4";

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
      <form onSubmit={handleSubmit} className="bg-black/50 p-8 rounded-lg w-96">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          ĐĂNG KÝ
        </h2>

        {/* --- Input Tài Khoản --- */}
        <div className="mb-4">
          <input
            name="taiKhoan"
            placeholder="Tài khoản"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.taiKhoan && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.taiKhoan}
            </p>
          )}
        </div>

        {/* --- Input Mật Khẩu --- */}
        <div className="mb-4">
          <input
            type="password"
            name="matKhau"
            placeholder="Mật khẩu"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.matKhau && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.matKhau}
            </p>
          )}
        </div>

        {/* --- Input Họ Tên --- */}
        <div className="mb-4">
          <input
            name="hoTen"
            placeholder="Họ tên đầy đủ"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.hoTen && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.hoTen}
            </p>
          )}
        </div>

        {/* --- Input Email --- */}
        <div className="mb-4">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.email}
            </p>
          )}
        </div>

        {/* --- Input Số điện thoại --- */}
        <div className="mb-6">
          <input
            name="soDt"
            placeholder="Số điện thoại"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.soDt && (
            <p className="text-red-500 text-sm mt-1 text-left">{errors.soDt}</p>
          )}
        </div>

        {/* --- 5. Nút Submit --- */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-300"
        >
          Tạo tài khoản
        </button>
      </form>
    </div>
  );
};

export default Register;
