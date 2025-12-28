import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State để quản lý việc đóng/mở menu con của "Quản lý Phim"
  // Mặc định cho mở nếu đường dẫn hiện tại đang nằm trong cụm này
  const isMovieGroupActive =
    location.pathname.includes("/admin/films") ||
    location.pathname.includes("/admin/showtime");
  const [isMovieMenuOpen, setIsMovieMenuOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("USER_INFO");
    navigate("/");
    window.location.reload();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    } `;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-10 shrink-0">
        {/* Logo / Brand */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700 bg-gray-900">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            CyberAdmin
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {/* === GROUP 1: QUẢN LÝ PHIM (Cha) === */}
          <div>
            <button
              onClick={() => setIsMovieMenuOpen(!isMovieMenuOpen)}
              className="w-full flex items-center justify-between p-3 rounded text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3 font-semibold">
                {/* Icon Phim */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 19.818 6 20.25v.75m0-1.5v-13.5m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125M6 5.25v1.5h1.5C7.996 6.75 8.5 6.246 8.5 5.25v-.75m0 .75h1.5C10.496 6.75 11 6.246 11 5.25v-.75m0 .75h1.5C12.996 6.75 13.5 6.246 13.5 5.25v-.75m0 .75h1.5C15.496 6.75 16 6.246 16 5.25v-.75m0 .75h1.5C17.996 6.75 18.5 6.246 18.5 5.25v-.75m0 .75h-.375c.621 0 1.125.504 1.125 1.125v13.5m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v.75m-1.125-1.5h-1.5c-.621 0-1.125.504-1.125 1.125v.75"
                  />
                </svg>
                Quản lý Phim
              </div>
              {/* Icon Mũi tên xoay */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMovieMenuOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {/* Menu Con (Dropdown) */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isMovieMenuOpen
                  ? "max-h-48 opacity-100 mt-1"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col space-y-1 pl-4 border-l-2 border-gray-700 ml-4">
                {/* Con 1: Danh sách phim */}
                <NavLink to="/admin/films" end className={linkClass}>
                  <span className="text-sm">● Danh sách phim</span>
                </NavLink>

                {/* Con 2: Thêm phim */}
                <NavLink to="/admin/films/add" className={linkClass}>
                  <span className="text-sm">● Thêm phim mới</span>
                </NavLink>

                {/* Con 3: Tạo lịch chiếu */}
                <NavLink to="/admin/showtime" className={linkClass}>
                  <span className="text-sm">● Tạo lịch chiếu</span>
                </NavLink>
              </div>
            </div>
          </div>
          {/* === END GROUP 1 === */}

          {/* === GROUP 2: QUẢN LÝ USER === */}
          <NavLink to="/admin/users" className={linkClass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
            <span className="font-semibold">Quản lý User</span>
          </NavLink>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full p-2 rounded hover:bg-red-900/20 transition"
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
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT (Bên phải) --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar nhỏ (Nếu muốn hiển thị tên admin ở đây) */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-end px-8 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
            <span className="text-gray-700 font-medium">Administrator</span>
          </div>
        </div>

        {/* Khu vực nội dung thay đổi */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminTemplate;
