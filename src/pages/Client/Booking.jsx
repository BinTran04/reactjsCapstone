import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api"; // Import api
// import { mockDataPhongVe } from "../../mockData"; // Bỏ dòng này

export default function Booking() {
  const { maLichChieu } = useParams();
  const navigate = useNavigate();

  // 1. State dữ liệu (Để null ban đầu để chờ API)
  const [roomInfo, setRoomInfo] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);

  // 2. GỌI API LẤY DANH SÁCH GHẾ
  useEffect(() => {
    api
      .get(`/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`)
      .then((res) => {
        setRoomInfo(res.data.content);
      })
      .catch((err) => {
        console.log("Lỗi lấy phòng vé:", err);
      });
  }, [maLichChieu]);

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

  const handleSelectSeat = (seat, fullLabel) => {
    // Chặn nếu ghế đã đặt hoặc có người khác đang đặt
    if (seat.daDat || seat.taiKhoanNguoiDat) return;

    const index = selectedSeats.findIndex((s) => s.maGhe === seat.maGhe);
    if (index !== -1) {
      const newList = [...selectedSeats];
      newList.splice(index, 1);
      setSelectedSeats(newList);
    } else {
      setSelectedSeats([...selectedSeats, { ...seat, label: fullLabel }]);
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "CYBER50") {
      setDiscountAmount(50000);
      alert("Áp dụng mã CYBER50 thành công!");
    } else if (discountCode.toUpperCase() === "FREE10") {
      setDiscountAmount(
        selectedSeats.reduce((total, s) => total + s.giaVe, 0) * 0.1
      );
      alert("Áp dụng mã giảm 10% thành công!");
    } else {
      setDiscountAmount(0);
      alert("Mã giảm giá không hợp lệ!");
    }
  };

  // 3. Hiệu ứng Loading khi chưa có dữ liệu
  if (!roomInfo)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-xl font-bold animate-pulse">
          Đang tải sơ đồ ghế...
        </div>
      </div>
    );

  const { thongTinPhim, danhSachGhe } = roomInfo;
  const tempAmount = selectedSeats.reduce(
    (total, seat) => total + seat.giaVe,
    0
  );
  const finalAmount = Math.max(0, tempAmount - discountAmount);

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế!");
      return;
    }
    // Dữ liệu đặt vé gửi lên API (Structure chuẩn)
    const bookingData = {
      maLichChieu: maLichChieu,
      danhSachVe: selectedSeats.map((seat) => ({
        maGhe: seat.maGhe,
        giaVe: seat.giaVe,
      })),
    };

    if (
      window.confirm(`Xác nhận thanh toán: ${finalAmount.toLocaleString()} đ?`)
    ) {
      console.log("Gửi API Đặt vé:", bookingData);
      // api.post("/QuanLyDatVe/DatVe", bookingData)...
      alert("Đặt vé thành công!");
      navigate("/");
    }
  };

  // --- RENDER HÀNG GHẾ (Logic chia 16 cột chuẩn rạp) ---
  const renderRows = () => {
    const seatsPerRow = 16; // Số ghế mỗi hàng
    const rows = [];

    // Chia danhSachGhe thành các hàng
    for (let i = 0; i < danhSachGhe.length; i += seatsPerRow) {
      const seatsInRow = danhSachGhe.slice(i, i + seatsPerRow);
      const rowChar = String.fromCharCode(65 + i / seatsPerRow); // A, B, C...
      rows.push({ rowChar, seats: seatsInRow });
    }

    return rows.map((row, rowIndex) => (
      <div
        key={rowIndex}
        className="flex items-center justify-center gap-2 mb-2"
      >
        {/* Tên hàng (A, B, C) */}
        <span className="w-6 text-gray-400 font-bold text-center select-none">
          {row.rowChar}
        </span>

        {/* Danh sách ghế */}
        {row.seats.map((seat, index) => {
          const seatNumber = (index + 1).toString().padStart(2, "0"); // Tạo số 01, 02...
          const fullLabel = `${row.rowChar}${seatNumber}`; // Ghép thành A01, B02...
          // --- XÁC ĐỊNH LOẠI GHẾ ---
          let classSeat = "bg-gray-600 cursor-pointer hover:brightness-125"; // 1. Thường
          let disabled = false;

          // 2. VIP (Màu cam)
          if (seat.loaiGhe === "Vip") {
            classSeat =
              "bg-orange-500 shadow-[0_0_10px_orange] border border-orange-400";
          }

          // 3. Đã đặt (Màu xám tối, bị cấm)
          if (seat.daDat) {
            classSeat =
              "bg-gray-800 cursor-not-allowed text-gray-600 border border-gray-700";
            disabled = true;
          }

          // 4. Người khác đang đặt (Màu hồng/đỏ - API trả về taiKhoanNguoiDat)
          // Lưu ý: API CyberSoft đôi khi trả về daDat=true cho ghế đã bán,
          // nên ta ưu tiên check taiKhoanNguoiDat nếu muốn hiện màu khác.
          if (seat.taiKhoanNguoiDat) {
            classSeat =
              "bg-pink-600 cursor-not-allowed shadow-[0_0_10px_#db2777] border border-pink-400";
            disabled = true;
          }

          // 5. Đang chọn (Màu xanh lá - Quan trọng nhất)
          const isSelected = selectedSeats.find((s) => s.maGhe === seat.maGhe);
          if (isSelected) {
            classSeat =
              "bg-green-500 shadow-[0_0_15px_#22c55e] text-white border border-green-400 transform scale-110";
          }

          return (
            <button
              key={index}
              disabled={disabled}
              onClick={() => handleSelectSeat(seat, fullLabel)}
              className={`
                  ${classSeat}
                  w-7 h-7 md:w-9 md:h-9 rounded-md transition-all duration-200
                  flex items-center justify-center font-bold text-[10px] md:text-xs
                  text-white relative group
              `}
            >
              {seat.daDat ? "X" : seatNumber}
            </button>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex flex-col pt-16">
      <div
        className="fixed inset-0 bg-cover bg-center z-0 blur-none opacity-30"
        style={{ backgroundImage: `url(${thongTinPhim.hinhAnh})` }}
      ></div>

      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row gap-6 h-full flex-1 py-6">
        {/* CỘT TRÁI: SƠ ĐỒ */}
        <div className="flex-1 flex flex-col items-center">
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

          <div className="w-full max-w-4xl mb-10 perspective-1000">
            <div className="w-full h-4 bg-gradient-to-b from-white to-transparent opacity-50 shadow-[0_20px_50px_rgba(255,255,255,0.3)] rounded-[50%] mb-2 transform rotateX(-5deg)"></div>
            <div className="w-full text-center text-gray-500 text-xs tracking-[0.5em] uppercase">
              Màn hình
            </div>
          </div>

          <div className="w-full max-w-5xl overflow-x-auto custom-scrollbar flex flex-col items-center">
            {renderRows()}
          </div>

          {/* CHÚ THÍCH 5 LOẠI GHẾ */}
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
              <span className="text-gray-400 text-xs">Người khác đặt</span>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: HÓA ĐƠN --- */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-black/10 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-6 h-full flex flex-col">
            <h3 className="text-2xl font-bold text-center text-white mb-6 pb-4 border-b border-gray-600">
              {thongTinPhim.tenPhim}
            </h3>

            <div className="flex-1 space-y-4">
              {/* 1. NGÀY GIỜ CHIẾU */}
              <div className="flex justify-between text-sm border-b border-gray-600 pb-2">
                <span className="text-gray-400">Ngày giờ chiếu:</span>
                <div className="text-right">
                  <span className="block text-yellow-500 font-bold">
                    {thongTinPhim.ngayChieu}
                  </span>
                  <span className="block text-orange-500 text-xs font-bold">
                    {thongTinPhim.gioChieu}
                  </span>
                </div>
              </div>

              {/* 2. CỤM RẠP */}
              <div className="flex justify-between text-sm border-b border-gray-600 pb-2">
                <span className="text-gray-400">Cụm rạp:</span>
                <span className="text-white text-right font-medium">
                  {thongTinPhim.tenCumRap}
                </span>
              </div>

              {/* 3. TÊN RẠP */}
              <div className="flex justify-between text-sm border-b border-gray-600 pb-2">
                <span className="text-gray-400">Rạp:</span>
                <span className="text-white font-bold">
                  {thongTinPhim.tenRap}
                </span>
              </div>

              {/* 4. GHẾ CHỌN (Hiện dãy ghế A01, B02...) */}
              <div className="border-t border-dashed border-gray-600 pt-4">
                <span className="text-red-500 font-semibold mb-2 block">
                  Ghế chọn:
                </span>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((s, i) => (
                      <span key={i} className="text-green-400 font-bold">
                        {/* Hiển thị label đã lưu ở Bước 1 */}
                        {s.label}
                        {i < selectedSeats.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic text-sm">
                      Chưa chọn ghế
                    </span>
                  )}
                </div>
              </div>

              {/* 5. MÃ ƯU ĐÃI (Giữ nguyên) */}
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

            {/* TỔNG TIỀN & NÚT ĐẶT VÉ (Giữ nguyên) */}
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
