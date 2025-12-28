import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminGuard = () => {
  // 1. Lấy thông tin user từ LocalStorage lên kiểm tra
  const userLoc = localStorage.getItem("USER_INFO");

  // Kiểm tra xem có dữ liệu không
  if (!userLoc) {
    alert("Vui lòng đăng nhập để vào trang này!");
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(userLoc);

  // 2. Kiểm tra vai trò (QuanTri = Admin)
  if (user.maLoaiNguoiDung !== "QuanTri") {
    alert("Bạn không có quyền truy cập vào trang Admin!");
    return <Navigate to="/" />; // Đá về trang chủ
  }

  // 3. Nếu đúng là Admin, cho phép hiển thị các trang con bên trong (Outlet)
  return <Outlet />;
};

export default AdminGuard;
