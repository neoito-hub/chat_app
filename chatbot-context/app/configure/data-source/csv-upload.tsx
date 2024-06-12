import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import FileInputButton from "../../common/file-upload-button";
import apiHelper from "../../common/apiHelper";

interface CSVUploadProps {
  handleSuccessMessagePage: () => void;
  handleLoading: (input: boolean) => void;
  loading: boolean;
}

const CSVUpload: React.FC<CSVUploadProps> = ({
  handleSuccessMessagePage,
  handleLoading,
  loading,
}) => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id")?.toString();
  const csvUploadApiUrl = `/api/upload_csv?project_id=${projectId}`;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    // Check if each file is not already present in the array and is a CSV file
    if (files) {
      const uniqueCSVFiles = Array.from(files).filter(
        (file) =>
          !selectedFiles.some(
            (existingFile) => existingFile.name === file.name
          ) && file.type === "text/csv"
      );

      if (uniqueCSVFiles.length > 0) {
        // Use the functional form of setState with type assertion
        setSelectedFiles((prevFiles) => [...prevFiles, ...uniqueCSVFiles]);
      } else {
        // Alert if no CSV files were added
        alert("Please select a CSV file");
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
      subUrl: csvUploadApiUrl,
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

export default CSVUpload;
