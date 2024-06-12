import React, { ReactNode } from "react";
import "../index.scss";
import BreadcrumbMenu from "./breadcumb-menu";

interface ConfigureProps {
  children?: ReactNode;
  searchParams?: any;
}

const Configure: React.FC<ConfigureProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full items-center max-w-[748px] flex-grow max-h-full">
      <BreadcrumbMenu />
      <div className={`float-left clear-both flex w-full md-lt:flex-wrap`}>
        <div className="float-left mb-5 flex w-full flex-col md:max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Configure;
