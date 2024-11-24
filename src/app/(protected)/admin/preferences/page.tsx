import ThemeChangeComponent from "@/components/common/ThemeChangeCore";
import LogoutAll from "@/components/common/LogoutAll";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto p-6 space-y-10">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Tema
        </h1>
        <hr className="my-4 border-gray-300 dark:border-gray-700" />
        <div className="flex w-full justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Pilih Tema</span>
          <ThemeChangeComponent />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Akun
        </h1>
        <hr className="my-4 border-gray-300 dark:border-gray-700" />
        <div className="flex w-full justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Logout All</span>
          <LogoutAll />
        </div>
      </div>
    </div>
  );
};

export default page;
