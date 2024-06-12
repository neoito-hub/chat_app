import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import AudioInputButton from "../../common/audio-upload-button";
import apiHelper from "../../common/apiHelper";

interface AudioUploadProps {
  handleSuccessMessagePage: () => void;
  handleLoading: (input: boolean) => void;
  loading: boolean;
}

const AudioUpload: React.FC<AudioUploadProps> = ({
  handleSuccessMessagePage,
  handleLoading,
  loading,
}) => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id")?.toString();
  const audioUploadApiUrl = `/api/upload_audio?project_id=${projectId}`;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    // Check if each file is not already present in the array and is an audio file
    if (files) {
      const uniqueAudioFiles = Array.from(files).filter(
        (file) =>
          !selectedFiles.some(
            (existingFile) => existingFile.name === file.name
          ) && file.type.startsWith("audio/")
      );

      if (uniqueAudioFiles.length > 0) {
        // Use the functional form of setState with type assertion
        setSelectedFiles((prevFiles) => [...prevFiles, ...uniqueAudioFiles]);
      } else {
        // Alert if no audio files were added
        alert("Please select an audio file");
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
      subUrl: audioUploadApiUrl,
      value: formData,
    });
    res && handleSuccessMessagePage();
    handleLoading(false);
  };

  return (
    <div className="flex flex-col">
      <AudioInputButton
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
          onClick={() => setSelectedFiles([])}
          disabled={loading}
          className="text-ab-disabled hover:text-ab-black text-ab-sm rounded px-3 py-1 font-bold leading-tight"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AudioUpload;
