import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { api } from "../../services/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";

export default function Detail() {
  const { id } = useParams();

  // Chứa toàn bộ info phim + lịch chiếu
  const [movie, setMovie] = useState(null);
  // Hệ thống rạp đang chọn
  const [activeSystem, setActiveSystem] = useState(null);

  // Logic chọn ngày
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // Gọi api lấy chi tiết phim và lịch chiếu
    api
      .get(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${id}`)
      .then((res) => {
        const data = res.data.content;
        setMovie(data);

        const allDates = [];

        // Duyệt qua tất cả hệ thống rạp -> cụm rạp -> lịch chiếu để gom ngày
        if (!data.heThongRapChieu) return;

        data.heThongRapChieu.forEach((htr) => {
          htr.cumRapChieu.forEach((cr) => {
            cr.lichChieuPhim.forEach((lich) => {
              const date = dayjs(lich.ngayChieuGioChieu).format("YYYY-MM-DD");
              if (!allDates.includes(date)) {
                allDates.push(date);
              }
            });
          });
        });

        // Sắp xếp ngày tăng dần
        allDates.sort((a, b) => dayjs(a).diff(dayjs(b)));

        // Tạo cấu trúc cho thanh Tab
        const listDaysFromApi = allDates.slice(0, 7).map((date) => {
          const d = dayjs(date).locale("vi");
          return {
            dateFull: date,
            dayName: d.format("dddd"),
            dayNumber: d.format("DD/MM"),
          };
        });

        // Cập nhật State
        setDays(listDaysFromApi);
        if (listDaysFromApi.length > 0) {
          setSelectedDate(listDaysFromApi[0].dateFull);
        }

        if (data.heThongRapChieu && data.heThongRapChieu.length > 0) {
          setActiveSystem(data.heThongRapChieu[0]);
        }
      })
      .catch((err) => console.log("Lỗi lấy chi tiết phim:", err));
  }, []);

  if (!movie)
    return (
      <div className="text-white text-center mt-20">
        Đang tải thông tin phim...
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* --- PHẦN 1: HERO SECTION (THÔNG TIN PHIM) --- */}
      <div className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
          style={{ backgroundImage: `url(${movie.hinhAnh})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

        {/* Nội dung chính */}
        <div className="relative container mx-auto px-4 py-16 flex flex-col md:flex-row gap-8 items-center md:items-start z-10">
          {/* Cột Trái: Poster */}
          <div className="w-64 h-96 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-lg overflow-hidden group relative">
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
            {/* Nút Play khi hover */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer">
              <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cột Phải: Thông tin */}
          <div className="flex-1 text-white space-y-4 text-center md:text-left">
            <p className="text-gray-300 font-medium text-sm">
              Khởi chiếu: {dayjs(movie.ngayKhoiChieu).format("DD.MM.YYYY")}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                C18
              </span>
              <h1 className="text-4xl font-bold">{movie.tenPhim}</h1>
            </div>

            <p className="text-gray-300 text-sm md:w-2/3 leading-relaxed">
              {movie.moTa}
            </p>

            <div className="flex flex-col md:flex-row gap-8 mt-6">
              {/* Chi tiết nhỏ */}
              <div className="space-y-2 text-sm text-gray-400">
                <p>
                  Đạo diễn:{" "}
                  <span className="text-white">Christopher Nolan</span>
                </p>
                <p>
                  Diễn viên:{" "}
                  <span className="text-white">
                    Leonardo DiCaprio, Cillian Murphy
                  </span>
                </p>
                <p>
                  Thể loại:{" "}
                  <span className="text-white">Hành động, Viễn tưởng</span>
                </p>
                <p>
                  Định dạng: <span className="text-white">2D/Digital</span>
                </p>
                <p>
                  Quốc Gia: <span className="text-white">Mỹ</span>
                </p>
              </div>

              {/* Vòng tròn điểm số (Style giống ảnh) */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 rounded-full border-[6px] border-green-500 flex items-center justify-center bg-black/40">
                  <span className="text-2xl font-bold">{movie.danhGia}</span>
                </div>
                <div className="flex text-yellow-400 mt-2 gap-1 text-xs">
                  {[...Array(Math.min(5, Math.floor(movie.danhGia / 2)))].map(
                    (_, i) => (
                      <span key={i}>★</span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Các nút bấm */}
            <div className="mt-8 flex gap-4 justify-center md:justify-start">
              <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition uppercase">
                Mua vé ngay
              </button>
              <button className="px-8 py-3 border border-gray-400 hover:border-white hover:text-white text-gray-300 font-bold rounded transition uppercase">
                Xem Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: LỊCH CHIẾU (TAB LỊCH) --- */}
      <div className="bg-white py-12" id="lich-chieu">
        <div className="container mx-auto px-4">
          {/* Khung chứa chính */}
          <div className="bg-white rounded shadow-2xl border border-gray-200 flex flex-col md:flex-row min-h-[600px]">
            {/* CỘT 1: Logo Hệ thống rạp (Tab dọc) */}
            <div className="w-full md:w-28 border-r border-gray-200 bg-gray-50 flex md:flex-col items-center py-4">
              {movie.heThongRapChieu?.map((sys) => (
                <button
                  key={sys.maHeThongRap}
                  onClick={() => setActiveSystem(sys)}
                  className={`p-4 w-full flex justify-center transition border-b border-transparent relative opacity-60 hover:opacity-100 ${
                    activeSystem.maHeThongRap === sys.maHeThongRap
                      ? "opacity-100"
                      : ""
                  }`}
                >
                  <img
                    src={sys.logo}
                    alt={sys.tenHeThongRap}
                    className="w-12 h-12"
                  />
                  {/* Đường gạch đỏ bên phải khi active */}
                  {activeSystem.maHeThongRap === sys.maHeThongRap && (
                    <span className="absolute right-0 top-0 bottom-0 w-1 bg-red-600"></span>
                  )}
                </button>
              ))}
            </div>

            {/* CỘT 2: Nội dung Lịch chiếu */}
            <div className="flex-1 flex flex-col">
              {/* Hàng trên: Chọn Ngày (Tab ngang) */}
              <div className="flex overflow-x-auto border-b border-gray-200 custom-scrollbar">
                {days.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day.dateFull)}
                    className={`flex-shrink-0 px-8 py-4 text-center cursor-pointer transition ${
                      selectedDate === day.dateFull
                        ? "text-red-600 font-bold border-b-2 border-red-600"
                        : "text-black font-medium hover:text-red-500"
                    }`}
                  >
                    <div className="text-xs uppercase mb-1">{day.dayName}</div>
                    <div className="text-xl">{day.dayNumber}</div>
                  </button>
                ))}
              </div>

              {/* Danh sách rạp và giờ chiếu */}
              <div className="p-6 overflow-y-auto max-h-[500px] custom-scrollbar">
                {activeSystem ? (
                  activeSystem.cumRapChieu?.map((rap, index) => {
                    // LỌC LỊCH CHIẾU: Chỉ lấy suất chiếu trùng với ngày selectedDate
                    const currentShowtimes = rap.lichChieuPhim?.filter(
                      (lich) =>
                        dayjs(lich.ngayChieuGioChieu).format("YYYY-MM-DD") ===
                        selectedDate
                    );

                    // Nếu rạp này không có suất chiếu ngày hôm đó thì ẩn đi
                    if (currentShowtimes.length === 0) return null;

                    return (
                      <div
                        key={index}
                        className="mb-8 border-b border-gray-100 pb-6 last:border-0 last:mb-0"
                      >
                        <div className="flex gap-4">
                          {/* Logo rạp nhỏ */}
                          <img
                            src={
                              rap.hinhAnh || "https://via.placeholder.com/50"
                            }
                            className="w-12 h-12 rounded"
                            alt="rap-logo"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50";
                            }}
                          />

                          <div className="flex-1">
                            <h3 className="text-green-600 font-bold text-lg mb-1">
                              {rap.tenCumRap}
                            </h3>
                            <p className="text-gray-400 text-xs mb-3">
                              {rap.diaChi}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                              {currentShowtimes.map((lich, i) => (
                                <NavLink
                                  key={i}
                                  to={`/booking/${lich.maLichChieu}`} // Link sang trang đặt vé
                                  className="bg-gray-100 border border-gray-200 rounded px-4 py-2 text-center hover:bg-white hover:border-green-500 hover:text-green-600 transition group shadow-sm"
                                >
                                  <span className="text-base text-green-600 font-bold group-hover:text-green-700 block">
                                    {dayjs(lich.ngayChieuGioChieu).format(
                                      "HH:mm"
                                    )}
                                  </span>
                                  <span className="text-[10px] text-gray-400 block">
                                    ~{" "}
                                    {dayjs(lich.ngayChieuGioChieu)
                                      .add(2, "hour")
                                      .format("HH:mm")}
                                  </span>
                                </NavLink>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-400 mt-10">
                    Vui lòng chọn hệ thống rạp
                  </div>
                )}

                {/* Thông báo nếu không tìm thấy suất chiếu nào trong ngày đã chọn */}
                {activeSystem &&
                  activeSystem.cumRapChieu?.every(
                    (rap) =>
                      rap.lichChieuPhim?.filter(
                        (lich) =>
                          dayjs(lich.ngayChieuGioChieu).format("YYYY-MM-DD") ===
                          selectedDate
                      ).length === 0
                  ) && (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                      <svg
                        className="w-12 h-12 mb-2 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p>
                        Không có suất chiếu nào vào ngày{" "}
                        {dayjs(selectedDate).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
