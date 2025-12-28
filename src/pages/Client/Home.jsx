import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../../services/api";

export default function Home() {
  // STATE DỮ LIỆU TỪ API
  const [banners, setBanners] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemaSystems, setCinemaSystems] = useState([]);

  // State cho logic giao diện
  const [activeSystem, setActiveSystem] = useState(null);
  const [activeBranch, setActiveBranch] = useState(null);

  // State cho logic Slider Banner
  const [currBanner, setCurrBanner] = useState(0);

  // Gọi API khi load trang
  useEffect(() => {
    // Lấy danh sách Banner
    api
      .get("/QuanLyPhim/LayDanhSachBanner")
      .then((res) => {
        setBanners(res.data.content);
      })
      .catch((err) => console.log("Lỗi Banner:", err));

    api
      .get("/QuanLyPhim/LayDanhSachPhim?maNhom=GP01")
      .then((res) => {
        setMovies(res.data.content);
      })
      .catch((err) => console.log("Lỗi Phim:", err));

    // Lấy thông tin Lịch Chiếu Hệ Thống Rạp (maNhom)
    api
      .get("/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP01")
      .then((res) => {
        const data = res.data.content;
        setCinemaSystems(data);
        // Mặc định chọn hệ thống đầu tiên và chi nhánh đầu tiên
        if (data.length > 0) {
          setActiveSystem(data[0]);
          if (data[0].lstCumRap?.length > 0) {
            setActiveBranch(data[0].lstCumRap[0]);
          }
        }
      })
      .catch((err) => console.log("Lỗi Rạp:", err));
  }, []);

  // Logic auto slide
  useEffect(() => {
    if (banners.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrBanner((curr) => (curr === banners.length - 1 ? 0 : curr + 1));
    }, 4000);
    return () => clearInterval(slideInterval);
  }, [banners]);

  // Hàm chuyển slide thủ công (Next/Prev)
  const nextSlide = () => {
    setCurrBanner(currBanner === banners.length - 1 ? 0 : currBanner + 1);
  };

  const prevSlide = () => {
    setCurrBanner(currBanner === 0 ? banners.length - 1 : currBanner - 1);
  };

  // Logic chọn rap
  const handleSelectSystem = (system) => {
    setActiveSystem(system);
    if (system.lstCumRap?.length > 0) {
      setActiveBranch(system.lstCumRap[0]);
    } else {
      setActiveBranch(null);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white pb-20">
      {/* 1. CAROUSEL (BANNER) - CÓ AUTO SLIDE */}
      <div className="relative w-full h-[600px] overflow-hidden group">
        {banners.length > 0 && (
          // Slider Track
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currBanner * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div key={index} className="w-full flex-shrink-0 relative h-full">
                <img
                  src={banner.hinhAnh}
                  alt="Banner"
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=CyberMovie";
                  }}
                />
                {/* Nút Play ở giữa */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-black/30 hover:bg-black/60 hover:scale-110 transition backdrop-blur-sm shadow-lg group-hover:animate-pulse">
                    <svg
                      className="w-10 h-10 text-white translate-x-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                {/* Gradient bóng đổ bên dưới */}
                <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
              </div>
            ))}
          </div>
        )}

        {/* Nút Prev (Ẩn, hiện khi hover vào banner) */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-white hover:text-black transition opacity-0 group-hover:opacity-100"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Nút Next */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-white hover:text-black transition opacity-0 group-hover:opacity-100"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dots Indicator (Dấu chấm tròn ở dưới) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {banners.map((__, idx) => (
            <button
              key={idx}
              onClick={() => setCurrBanner(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currBanner === idx
                  ? "bg-red-600 w-8"
                  : "bg-gray-400 hover:bg-white"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/*DANH SÁCH PHIM*/}
      <div className="container mx-auto px-4 mt-12" id="lich-chieu">
        <div className="flex justify-center space-x-8 mb-8 text-xl font-bold">
          <button className="text-red-500 border-b-2 border-red-500 pb-2">
            Đang Chiếu
          </button>
          <button className="text-gray-400 hover:text-white transition pb-2">
            Sắp Chiếu
          </button>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {movies.slice(0, 8).map((movie) => (
              <div
                key={movie.maPhim}
                className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
              >
                <div className="h-80 overflow-hidden relative">
                  <img
                    src={movie.hinhAnh}
                    alt={movie.tenPhim}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x450?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <NavLink
                      to={`/detail/${movie.maPhim}`}
                      className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition"
                    >
                      <svg
                        className="w-6 h-6 translate-x-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </NavLink>
                    <NavLink
                      to={`/detail/${movie.maPhim}`}
                      className="mt-4 bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700 text-white"
                    >
                      MUA VÉ
                    </NavLink>
                  </div>
                </div>
                <div className="p-4 relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg truncate w-3/4">
                      {movie.tenPhim}
                    </h3>
                    <span className="bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded flex items-center">
                      {movie.danhGia}{" "}
                      <span className="text-[10px] ml-0.5">★</span>
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">120 phút</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Đang tải danh sách phim...
          </p>
        )}
        <div className="text-center mt-8">
          <button className="border border-gray-500 text-gray-300 px-8 py-2 rounded hover:bg-gray-800 transition">
            XEM THÊM
          </button>
        </div>
      </div>

      {/* CỤM RẠP & LỊCH CHIẾU - Dùng dữ liệu 'cinemaSystems' */}
      <div className="container mx-auto px-4 mt-20" id="cum-rap">
        <div className="bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row h-[600px] border border-gray-200">
          {/* Cột 1 */}
          <div className="w-full md:w-24 border-r border-gray-200 flex md:flex-col items-center py-4 overflow-y-auto custom-scrollbar bg-white">
            {cinemaSystems.map((sys) => (
              <button
                key={sys.maHeThongRap}
                onClick={() => handleSelectSystem(sys)}
                className={`p-4 transition w-full flex justify-center border-b border-transparent ${
                  activeSystem.maHeThongRap === sys.maHeThongRap
                    ? "opacity-100 border-r-4 border-r-red-500 bg-gray-50"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={sys.logo}
                  alt={sys.tenHeThongRap}
                  className="w-12 h-12"
                />
              </button>
            ))}
          </div>
          {/* Cột 2 */}
          <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto custom-scrollbar bg-white">
            {activeSystem?.lstCumRap?.length > 0 ? (
              activeSystem.lstCumRap.map((branch, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveBranch(branch)}
                  className={`p-5 cursor-pointer border-b border-gray-100 transition flex gap-3 items-center ${
                    activeBranch === branch ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={activeSystem.logo}
                    className="w-12 h-12 rounded"
                    alt="logo"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm">
                      {branch.tenCumRap}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {branch.diaChi}
                    </p>
                    <span className="text-[10px] text-red-500 font-semibold">
                      [Chi tiết]
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-gray-400 text-center">
                Hệ thống này chưa có rạp
              </div>
            )}
          </div>
          {/* Cột 3 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-white">
            {activeBranch ? (
              activeBranch.danhSachPhim &&
              activeBranch.danhSachPhim.length > 0 ? (
                activeBranch.danhSachPhim.map((phim, index) => (
                  <div
                    key={index}
                    className="mb-6 border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div className="flex gap-4">
                      <img
                        src={phim.hinhAnh}
                        className="w-16 h-20 object-cover rounded shadow-sm"
                        alt={phim.tenPhim}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-600 text-white text-[10px] font-bold px-1 rounded">
                            2D
                          </span>
                          <h3 className="font-bold text-lg text-gray-800">
                            {phim.tenPhim}
                          </h3>
                        </div>
                        <p className="text-gray-400 text-xs mb-3 font-medium">
                          100 phút - IMDb 8.5
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {phim.lstLichChieuTheoPhim.map((lich, i) => {
                            const time = new Date(
                              lich.ngayChieuGioChieu
                            ).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                            const endTime = new Date(
                              new Date(lich.ngayChieuGioChieu).getTime() +
                                120 * 60000
                            ).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                            return (
                              <NavLink
                                key={i}
                                to={`/booking/${lich.maLichChieu}`}
                                className="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-center hover:bg-white hover:border-green-500 hover:text-green-600 transition group"
                              >
                                <span className="text-green-600 font-bold text-sm group-hover:text-green-600">
                                  {time}
                                </span>
                                <span className="text-gray-400 text-xs ml-1">
                                  ~ {endTime}
                                </span>
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Không có suất chiếu nào.
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Vui lòng chọn rạp để xem lịch chiếu
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
