import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import FileInputButton from "../../common/file-upload-button";
import apiHelper from "../../common/apiHelper";

interface FileUploadProps {
  handleSuccessMessagePage: () => void;
  handleLoading: (input: boolean) => void;
  loading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  handleSuccessMessagePage,
  handleLoading,
  loading,
}) => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id")?.toString();
  const fileUploadApiUrl = `/api/upload_pdf?project_id=${projectId}`;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    // Check if each file is not already present in the array and is a PDF file
    if (files) {
      const uniquePdfFiles = Array.from(files).filter(
        (file) =>
          !selectedFiles.some(
            (existingFile) => existingFile.name === file.name
          ) && file.type === "application/pdf"
      );
      if (uniquePdfFiles.length > 0) {
        // Use the functional form of setState with type assertion
        setSelectedFiles((prevFiles) => [...prevFiles, ...uniquePdfFiles]);
      } else {
        // Alert if no PDF files were added
        alert("Please select a PDF file");
      }
    }
  };

  const handleSubmit = async () => {
    handleLoading(true);
    const formData = new FormData();

    for (const file of Array.from(selectedFiles)) {
      formData.append("files", file);
    }
    const res = await apiHelper({
      baseUrl: process.env.BACKEND_BASE_URL,
      subUrl: fileUploadApiUrl,
      value: formData,
    });
    res && handleSuccessMessagePage();
    handleLoading(false);
  };

  return (
    <div className="flex flex-col">
      <FileInputButton
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        selectedFiles={selectedFiles}
      />
      <div className="float-left mb-5 flex w-full items-center mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedFiles?.length || loading}
          className="btn-primary text-ab-sm disabled:bg-ab-disabled mr-4 rounded px-5 py-2.5 font-bold leading-tight text-white transition-all"
        >
          Save
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => setSelectedFiles([])}
          className="text-ab-disabled hover:text-ab-black text-ab-sm rounded px-3 py-1 font-bold leading-tight"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
