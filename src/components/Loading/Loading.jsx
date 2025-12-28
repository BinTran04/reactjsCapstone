import React from "react";
import { Spinner } from "flowbite-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90">
      <div className="text-center">
        <Spinner aria-label="Center-aligned spinner" size="xl" color="info" />
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-semibold animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    </div>
  );
};

export default Loading;
