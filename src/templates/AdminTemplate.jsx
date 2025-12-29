import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminTemplate() {
  // State để quản lý việc đóng/mở menu "Quản lý Phim"
  const [openPhim, setOpenPhim] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-gray-900 text-gray-300 flex flex-col transition-all duration-300">
        {/* Logo / Header Sidebar */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800 font-bold text-xl text-white">
          Cyber Movie
        </div>

        {/* Menu List */}
        <nav className="flex-1 py-4 space-y-2">
          {/* --- MENU CẤP 1: QUẢN LÝ PHIM (Có Dropdown) --- */}
          <div>
            <button
              onClick={() => setOpenPhim(!openPhim)}
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-800 hover:text-white transition-colors focus:outline-none"
            >
              <span className="flex items-center gap-3">
                {/* Icon Film */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
                <span className="font-medium">Quản lý Phim</span>
              </span>

              {/* Icon Mũi tên (Xoay khi đóng mở) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-200 ${
                  openPhim ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* --- SUB-MENU (Hiện ra khi openPhim = true) --- */}
            {openPhim && (
              <div className="bg-gray-800 py-1">
                {/* 1. Danh sách phim */}
                <NavLink
                  to="/admin/films"
                  end // Dùng end để không active nhầm khi vào trang con
                  className={({ isActive }) =>
                    `block pl-14 pr-4 py-2 text-sm hover:text-white transition-colors ${
                      isActive ? "text-blue-400 font-semibold" : "text-gray-400"
                    }`
                  }
                >
                  Danh sách phim
                </NavLink>

                {/* 2. Thêm phim mới */}
                <NavLink
                  to="/admin/films/add"
                  className={({ isActive }) =>
                    `block pl-14 pr-4 py-2 text-sm hover:text-white transition-colors ${
                      isActive ? "text-blue-400 font-semibold" : "text-gray-400"
                    }`
                  }
                >
                  Thêm phim mới
                </NavLink>
              </div>
            )}
          </div>

          {/* --- MENU KHÁC: QUẢN LÝ USER --- */}
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 hover:bg-gray-800 hover:text-white transition-colors ${
                isActive
                  ? "bg-gray-800 text-white border-r-4 border-blue-500"
                  : ""
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="font-medium">Quản lý User</span>
          </NavLink>

          {/* --- ĐĂNG XUẤT --- */}
          <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-800 hover:text-white transition-colors text-left mt-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Đăng xuất</span>
          </button>
        </nav>
      </div>

      {/* --- CONTENT AREA (Nơi hiển thị FilmForm) --- */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
        {/* Outlet là nơi render các route con (FilmList, FilmForm) */}
      </div>
    </div>
  );
}
