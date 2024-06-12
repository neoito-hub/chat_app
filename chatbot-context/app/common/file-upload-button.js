import React, { useRef, useState } from "react";
import UploadFile from "../assets/img/icons/upload-file.svg";
import Image from "next/image";

const FileInputButton = ({ handleFileChange, fileInputRef, selectedFiles }) => {
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#F8F8F8] py-16">
      {selectedFiles?.length > 0 ? (
        <div className="flex flex-col my-2">
          {Object.values(selectedFiles ?? {})?.map((file) => (
            <div key={file?.name} className="font-light text-ab-sm">
              {file?.name}
            </div>
          ))}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              display: "inline-block",
            }}
          >
            <input
              style={{
                position: "absolute",
                fontSize: "100px",
                top: 0,
                right: 0,
                margin: 0,
                padding: 0,
                cursor: "pointer",
                opacity: 0,
                filter: "alpha(opacity=0)",
              }}
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple={true}
            />
            <button
              onClick={handleButtonClick}
              className="underline gap-2 text-[11px] my-2 text-primary"
            >
              Add another file
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-block",
          }}
        >
          <input
            style={{
              position: "absolute",
              fontSize: "100px",
              top: 0,
              right: 0,
              margin: 0,
              padding: 0,
              cursor: "pointer",
              opacity: 0,
              filter: "alpha(opacity=0)",
            }}
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple={true}
          />
          <button
            onClick={handleButtonClick}
            className="flex items-center border border-[#BDBDBD] gap-2 text-[15px] p-1 rounded-sm bg-[#F2F2F2]"
          >
            <Image src={UploadFile} alt="" />
            Upload Files
          </button>
        </div>
      )}
    </div>
  );
};

export default FileInputButton;
