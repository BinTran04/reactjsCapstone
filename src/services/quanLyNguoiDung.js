import { BaseService } from "./baseService";

export class QuanLyNguoiDungService extends BaseService {
  constructor() {
    super();
  }

  dangKy = (thongTinDangKy) => {
    return this.post(`/QuanLyNguoiDung/DangKy`, thongTinDangKy);
  };

  dangNhap = (thongTinDangNhap) => {
    return this.post(`/QuanLyNguoiDung/DangNhap`, thongTinDangNhap);
  };
}

export const quanLyNguoiDungService = new QuanLyNguoiDungService();
