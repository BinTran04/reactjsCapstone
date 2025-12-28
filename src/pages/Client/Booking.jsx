import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockDataPhongVe } from "./../../data/mockData";

export default function Booking() {
  const { maLichChieu } = useParams();
  const navigate = useNavigate();

  // State dữ liệu
  const [roomInfo, setRoomInfo] = useState(mockDataPhongVe);
  const { thongTinPhim, danhSachGhe } = roomInfo;

  // State ghế đang chọn
  const [selectedSeats, setSelectedSeats] = useState([]);

  // State mã giảm giá
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // State đồng hồ đếm ngược
  const [timeLeft, setTimeLeft] = useState(300);

  // Logic đếm ngược
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Hết thời gian giữ ghế!");
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Logic chọn ghế
  const handleSelectSeat = (seat) => {
    // 1. Chặn ghế đã đặt hoặc ghế người khác đang chọn
    if (seat.daDat || seat.taiKhoanNguoiDat) return;

    const index = selectedSeats.findIndex((s) => s.maGhe === seat.maGhe);
    if (index !== -1) {
      const newList = [...selectedSeats];
      newList.splice(index, 1);
      setSelectedSeats(newList);
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Logic áp dụng mã giảm giá
  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "CYBER50") {
      setDiscountAmount(50000); // Giảm 50k
      alert("Áp dụng mã CYBER50 thành công!");
    } else if (discountCode.toUpperCase() === "FREE10") {
      setDiscountAmount(
        selectedSeats.reduce((total, s) => total + s.giaVe, 0) * 0.1
      ); // Giảm 10%
      alert("Áp dụng mã giảm 10% thành công!");
    } else {
      setDiscountAmount(0);
      alert("Mã giảm giá không hợp lệ!");
    }
  };

  // Tính tiền
  const tempAmount = selectedSeats.reduce(
    (total, seat) => total + seat.giaVe,
    0
  );
  const finalAmount = Math.max(0, tempAmount - discountAmount); // Không để âm tiền

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế!");
      return;
    }
    if (
      window.confirm(`Xác nhận thanh toán: ${finalAmount.toLocaleString()} đ?`)
    ) {
      alert("Đặt vé thành công!");
      navigate("/");
    }
  };

  // --- RENDER HÀNG GHẾ (Logic Mới) ---
  const renderRows = () => {
    // Gom nhóm ghế theo hàng (A, B, C...)
    // Giả sử mỗi hàng 10 ghế
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const rowChar = String.fromCharCode(65 + i); // A, B, C...
      const seatsInRow = danhSachGhe.slice(i * 10, (i + 1) * 10);
      rows.push({ rowChar, seats: seatsInRow });
    }

    return rows.map((row, rowIndex) => (
      <div
        key={rowIndex}
        className="flex items-center justify-center gap-2 mb-2"
      >
        {/* Chữ cái đầu dòng */}
        <span className="w-6 text-gray-400 font-bold text-center select-none">
          {row.rowChar}
        </span>

        {/* Danh sách ghế trong hàng */}
        {row.seats.map((seat, index) => {
          let classSeat = "bg-gray-600 cursor-pointer hover:brightness-125"; // 1. Thường
          let disabled = false;

          // 2. VIP
          if (seat.loaiGhe === "Vip") {
            classSeat =
              "bg-orange-500 shadow-[0_0_10px_orange] border border-orange-400";
          }

          // 3. Đã đặt
          if (seat.daDat) {
            classSeat =
              "bg-gray-800 cursor-not-allowed text-gray-600 border border-gray-700";
            disabled = true;
          }

          // 4. Người khác đang chọn (Realtime fake)
          if (seat.taiKhoanNguoiDat) {
            classSeat =
              "bg-pink-600 cursor-not-allowed shadow-[0_0_10px_#db2777] border border-pink-400 animate-pulse";
            disabled = true;
          }

          // 5. Đang chọn (Mình chọn)
          const isSelected = selectedSeats.find((s) => s.maGhe === seat.maGhe);
          if (isSelected) {
            classSeat =
              "bg-green-500 shadow-[0_0_15px_#22c55e] text-white border border-green-400";
          }

          return (
            <button
              key={index}
              disabled={disabled}
              onClick={() => handleSelectSeat(seat)}
              className={`
                            ${classSeat}
                            w-8 h-8 md:w-10 md:h-10 rounded-lg transition-all duration-200
                            flex items-center justify-center font-bold text-xs md:text-sm
                            text-white relative
                        `}
            >
              {seat.daDat ? "X" : seat.tenGhe.substring(1)}

              {/* Icon người khác đang chọn (tùy chọn) */}
              {seat.taiKhoanNguoiDat && !seat.daDat && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex flex-col pt-16">
      {/* Background mờ */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 blur-md opacity-30"
        style={{ backgroundImage: `url(${thongTinPhim.hinhAnh})` }}
      ></div>

      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row gap-6 h-full flex-1 py-6">
        {/* --- CỘT TRÁI: SƠ ĐỒ GHẾ --- */}
        <div className="flex-1 flex flex-col items-center">
          {/* Header Info */}
          <div className="w-full flex justify-between items-center mb-4 px-4">
            <div>
              <p className="text-orange-500 font-bold text-lg">
                {thongTinPhim.tenCumRap}
              </p>
              <p className="text-gray-400 text-sm">
                {thongTinPhim.ngayChieu} - {thongTinPhim.gioChieu} -{" "}
                {thongTinPhim.tenRap}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">Giữ ghế trong</p>
              <p className="text-red-500 text-3xl font-bold font-mono">
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>

          {/* Màn hình */}
          <div className="w-full max-w-3xl mb-10 perspective-1000">
            <div className="w-full h-4 bg-gradient-to-b from-white to-transparent opacity-50 shadow-[0_20px_50px_rgba(255,255,255,0.3)] rounded-[50%] mb-2 transform rotateX(-5deg)"></div>
            <div className="w-full text-center text-gray-500 text-xs tracking-[0.5em] uppercase">
              Màn hình
            </div>
          </div>

          {/* LƯỚI GHẾ (Render theo hàng) */}
          <div className="w-full max-w-4xl overflow-x-auto custom-scrollbar flex flex-col items-center">
            {renderRows()}
          </div>

          {/* CHÚ THÍCH 5 TRẠNG THÁI */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gray-600"></div>
              <span className="text-gray-400 text-xs">Thường</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-orange-500"></div>
              <span className="text-gray-400 text-xs">VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-green-500"></div>
              <span className="text-gray-400 text-xs">Đang chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gray-800 border border-gray-600 flex items-center justify-center text-[10px]">
                X
              </div>
              <span className="text-gray-400 text-xs">Đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-pink-600 border border-pink-400"></div>
              <span className="text-gray-400 text-xs">Người khác chọn</span>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: HÓA ĐƠN --- */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-black/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-6 h-full flex flex-col">
            <h3 className="text-2xl font-bold text-center text-white mb-6 pb-4 border-b border-gray-600">
              {thongTinPhim.tenPhim}
            </h3>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rạp:</span>
                <span className="text-white">{thongTinPhim.tenCumRap}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Suất chiếu:</span>
                <span className="text-orange-400 font-bold">
                  {thongTinPhim.gioChieu}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-600 pt-4">
                <span className="text-red-500 font-semibold mb-2 block">
                  Ghế chọn:
                </span>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((s, i) => (
                      <span key={i} className="text-green-400 font-bold">
                        {s.tenGhe}
                        {i < selectedSeats.length - 1 && ","}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic text-sm">
                      Chưa chọn ghế
                    </span>
                  )}
                </div>
              </div>

              {/* --- ƯU ĐÃI (MỚI) --- */}
              <div className="border-t border-dashed border-gray-600 pt-4">
                <label className="text-gray-400 text-sm mb-2 block">
                  Mã ưu đãi (VD: CYBER50):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Nhập mã..."
                    className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm focus:border-green-500 outline-none uppercase"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition"
                  >
                    Áp dụng
                  </button>
                </div>
                {discountAmount > 0 && (
                  <p className="text-green-500 text-xs mt-1 italic">
                    Đã giảm: -{discountAmount.toLocaleString()} đ
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-600">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400">Tổng tiền:</span>
                <span className="text-3xl font-bold text-green-500">
                  {finalAmount.toLocaleString()} đ
                </span>
              </div>
              <button
                onClick={handleBooking}
                className={`w-full py-3 rounded-lg font-bold text-lg uppercase tracking-wide shadow-lg transition ${
                  selectedSeats.length > 0
                    ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                ĐẶT VÉ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
