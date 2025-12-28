import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// 1. Import Ant Design và Dayjs
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Kích hoạt plugin format cho dayjs
dayjs.extend(customParseFormat);

export default function Showtime() {
  const [state, setState] = useState({
    heThongRap: "",
    cumRap: "",
    maPhim: "",
    ngayChieu: "",
    gioChieu: "",
    giaVe: 75000,
  });

  const heThongRapList = [
    { maHeThongRap: "BHD", tenHeThongRap: "BHD Star Cineplex" },
    { maHeThongRap: "CGV", tenHeThongRap: "CGV Cinema" },
    { maHeThongRap: "Lotte", tenHeThongRap: "Lotte Cinema" },
  ];

  const [cumRapList, setCumRapList] = useState([]);

  const movies = [
    { maPhim: 1314, tenPhim: "Mỹ Nhân Ngư" },
    { maPhim: 1329, tenPhim: "Bố Già" },
    { maPhim: 1344, tenPhim: "Avengers: Endgame" },
  ];

  const handleChangeHeThongRap = (e) => {
    const maHeThong = e.target.value;
    setState({ ...state, heThongRap: maHeThong, cumRap: "" });

    if (maHeThong === "BHD") {
      setCumRapList([
        { maCumRap: "bhd-3-2", tenCumRap: "BHD Star - 3/2" },
        { maCumRap: "bhd-bitexco", tenCumRap: "BHD Star - Bitexco" },
      ]);
    } else if (maHeThong === "CGV") {
      setCumRapList([
        { maCumRap: "cgv-aeon", tenCumRap: "CGV Aeon Bình Tân" },
        { maCumRap: "cgv-undo", tenCumRap: "CGV Crescent Mall" },
      ]);
    } else {
      setCumRapList([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  // 2. Hàm xử lý riêng cho DatePicker của Antd
  const onChangeDate = (date, dateString) => {
    setState({ ...state, ngayChieu: dateString });
  };

  // 3. Hàm xử lý riêng cho TimePicker của Antd
  const onChangeTime = (time, timeString) => {
    setState({ ...state, gioChieu: timeString });
  };

  // Hàm xử lý riêng cho InputNumber (Giá vé)
  const onChangeNumber = (value) => {
    setState({ ...state, giaVe: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !state.heThongRap ||
      !state.cumRap ||
      !state.maPhim ||
      !state.ngayChieu ||
      !state.gioChieu
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    console.log("Dữ liệu gửi đi:", state);
    alert("Tạo lịch chiếu thành công!");
  };

  // Class style cho Input thường
  const inputClass =
    "w-full p-3 rounded border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition";
  const labelClass = "block font-semibold text-gray-700 mb-2";

  return (
    <div className="max-w-4xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Tạo Lịch Chiếu</h3>

        <NavLink
          to="/admin/films"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          <span className="font-medium text-sm">Quay lại</span>
        </NavLink>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hàng 1: Hệ thống & Cụm rạp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className={labelClass}>Hệ thống rạp</label>
            <select
              name="heThongRap"
              value={state.heThongRap}
              onChange={handleChangeHeThongRap}
              className={inputClass}
            >
              <option value="">-- Chọn hệ thống rạp --</option>
              {heThongRapList.map((ht) => (
                <option key={ht.maHeThongRap} value={ht.maHeThongRap}>
                  {ht.tenHeThongRap}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Cụm rạp</label>
            <select
              name="cumRap"
              value={state.cumRap}
              onChange={handleChange}
              className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}
              disabled={!state.heThongRap}
            >
              <option value="">-- Chọn cụm rạp --</option>
              {cumRapList.map((cr) => (
                <option key={cr.maCumRap} value={cr.maCumRap}>
                  {cr.tenCumRap}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hàng 2: Chọn Phim */}
        <div>
          <label className={labelClass}>Chọn Phim</label>
          <select
            name="maPhim"
            value={state.maPhim}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">-- Vui lòng chọn phim --</option>
            {movies.map((phim) => (
              <option key={phim.maPhim} value={phim.maPhim}>
                {phim.tenPhim}
              </option>
            ))}
          </select>
        </div>

        {/* Hàng 3: Ngày, Giờ & Giá vé (DÙNG ANT DESIGN) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* NGÀY CHIẾU */}
          <div>
            <label className={labelClass}>Ngày chiếu</label>
            <DatePicker
              format="DD/MM/YYYY" // Định dạng ngày Việt Nam
              onChange={onChangeDate}
              placeholder="Chọn ngày chiếu"
              size="large" // Kích thước lớn cho đồng bộ với ô input khác
              className="w-full" // Full width
              // Không cho chọn ngày quá khứ
              disabledDate={(current) =>
                current && current < dayjs().endOf("day")
              }
            />
          </div>

          {/* GIỜ CHIẾU */}
          <div>
            <label className={labelClass}>Giờ chiếu</label>
            <TimePicker
              format="HH:mm" // Định dạng giờ phút
              onChange={onChangeTime}
              placeholder="Chọn giờ chiếu"
              size="large"
              className="w-full"
            />
          </div>

          {/* GIÁ VÉ */}
          <div>
            <label className={labelClass}>Giá vé (VNĐ)</label>
            <input
              type="number"
              name="giaVe"
              value={state.giaVe}
              onChange={handleChange}
              step="5000"
              className={inputClass}
            />
          </div>
        </div>

        {/* Nút Submit */}
        <div className="pt-4 flex justify-start">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded shadow-sm hover:shadow-lg transition duration-200"
          >
            Tạo Lịch Chiếu
          </button>
        </div>
      </form>
    </div>
  );
}
