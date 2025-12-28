import React from "react";
import { Carousel } from "flowbite-react"; // Import component từ thư viện
import { mockDataBanner } from "../../data/mockData";

export default function HomeCarousel() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 w-full">
      <Carousel slideInterval={3000}>
        {/* Map dữ liệu từ file mockData */}
        {mockDataBanner.map((banner) => {
          return (
            <div key={banner.maBanner} className="relative w-full h-full">
              <img
                src={banner.hinhAnh}
                alt="..."
                className="absolute top-0 left-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}
