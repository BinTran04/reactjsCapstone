import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header"; // Đường dẫn header của bạn
import Footer from "../components/Footer/Footer"; // Import Footer vừa tạo

const HomeTemplate = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Nội dung chính sẽ đẩy xuống dưới Header */}
      <div className="flex-1 pt-16">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default HomeTemplate;
