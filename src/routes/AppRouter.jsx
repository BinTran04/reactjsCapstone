import React from "react";
import { Routes, Route } from "react-router-dom";

// --- Import các Page và Template ---
import Home from "../pages/Client/Home";
import HomeTemplate from "../templates/HomeTemplate";
import Detail from "../pages/Client/Detail";
import Booking from "../pages/Client/Booking";
import Register from "../pages/Client/Register";
import Login from "../pages/Client/Login";
import UserInfo from "../pages/Client/User/UserInfo";

// --- Import phần Admin ---
import AdminGuard from "../HOC/AdminGuard";
import AdminTemplate from "../templates/AdminTemplate";
import FilmForm from "../pages/Admin/Films/FilmForm";
import FilmManagement from "../pages/Admin/Films/FilmManagement";
import Showtime from "../pages/Admin/Showtime/Showtime";
import UserManagement from "../pages/Admin/Users/UserManagement";

const AppRouter = () => {
  return (
    <Routes>
      {/* --- CLIENT ROUTES --- */}
      <Route path="" element={<HomeTemplate />}>
        <Route path="" element={<Home />} />
        <Route path="detail/:id" element={<Detail />} />
        <Route path="booking/:maLichChieu" element={<Booking />} />
        <Route path="profile" element={<UserInfo />} />
      </Route>

      {/* --- AUTH ROUTES --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- ADMIN ROUTES --- */}
      {/* 1. Bảo vệ bằng AdminGuard (kiểm tra đăng nhập/quyền) */}
      <Route path="/admin" element={<AdminTemplate />}>
        {/* Mặc định vào /admin sẽ hiện danh sách phim */}
        <Route index element={<FilmManagement />} />

        {/* Quản lý danh sách phim */}
        <Route path="films" element={<FilmManagement />} />

        {/* Thêm phim mới */}
        <Route path="films/add" element={<FilmForm />} />

        {/* Chỉnh sửa phim */}
        <Route path="films/edit/:id" element={<FilmForm />} />

        {/* Tạo lịch chiếu */}
        <Route path="showtime/:id/:tenPhim" element={<Showtime />} />

        {/* Quản lý user */}
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Trang 404 */}
      <Route path="*" element={<div>Trang không tồn tại</div>} />
    </Routes>
  );
};

export default AppRouter;
