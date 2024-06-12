// components/Loader.tsx
import React, { FC } from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface LoaderProps {
  loading: boolean;
}

const Loader: FC<LoaderProps> = ({ loading }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-white bg-opacity-40 z-50 ${
        loading ? "" : "hidden"
      }`}
    >
      <div className="h-screen flex items-center justify-center">
        <ClipLoader color="#5E5EDD" size={50} />
      </div>
    </div>
  );
};

export default Loader;
