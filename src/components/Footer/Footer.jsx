import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cột 1: Logo & Text */}
        <div>
          <div className="text-2xl font-bold text-white mb-4">CyberMovie</div>
          <p className="text-sm">
            Hệ thống đặt vé xem phim online số 1 Việt Nam. Trải nghiệm điện ảnh
            đỉnh cao ngay tại nhà.
          </p>
        </div>

        {/* Cột 2: Điều khoản */}
        <div>
          <h4 className="text-white font-bold mb-4">Điều khoản</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Thỏa thuận sử dụng
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Quy chế hoạt động
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Đối tác */}
        <div>
          <h4 className="text-white font-bold mb-4">Đối tác</h4>
          <div className="grid grid-cols-3 gap-4">
            <img
              src="https://movienew.cybersoft.edu.vn/hinhanh/cgv.png"
              className="w-8 h-8 rounded-full bg-white"
            />
            <img
              src="https://movienew.cybersoft.edu.vn/hinhanh/bhd-star-cineplex.png"
              className="w-8 h-8 rounded-full bg-white"
            />
            <img
              src="https://movienew.cybersoft.edu.vn/hinhanh/cinestar.png"
              className="w-8 h-8 rounded-full bg-white"
            />
          </div>
        </div>

        {/* Cột 4: Social */}
        <div>
          <h4 className="text-white font-bold mb-4">Kết nối</h4>
          <div className="flex space-x-4">
            {/* Icon Facebook, Youtube giả lập */}
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white cursor-pointer">
              F
            </div>
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white cursor-pointer">
              Y
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
