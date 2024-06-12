import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import apiHelper from "../../common/apiHelper";

interface GithubUploadProps {
  handleSuccessMessagePage: () => void;
  handleLoading: (input: boolean) => void;
  loading: boolean;
}

const GithubUpload: React.FC<GithubUploadProps> = ({
  handleSuccessMessagePage,
  handleLoading,
  loading,
}) => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id")?.toString();
  const githubUploadApiUrl = `/api/github_upload?project_id=${projectId}`;

  const [url, setUrl] = useState("");
  const [branchName, setBranchName] = useState("main");

  const isValidUrl = (inputUrl: string) => {
    const urlRegex =
      /^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9-]+)(\/[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)*)?\/?$/;
    return urlRegex.test(inputUrl);
  };

  const handleSubmit = async () => {
    if (!isValidUrl(url)) {
      alert("Invalid Github URL");
      return;
    } else if (!branchName) {
      alert("Branch name is required");
      return;
    }

    handleLoading(true);
    const res = await apiHelper({
      baseUrl: process.env.BACKEND_BASE_URL,
      subUrl: githubUploadApiUrl,
      value: { url: url, branch_name: branchName },
    });
    handleLoading(false);
    res && handleSuccessMessagePage();
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col float-left w-full">
        <label className="text-ab-sm float-left mb-2 font-medium text-black">
          URL(s)
        </label>
        <input
          type="text"
          name="url"
          placeholder="e.g., https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`text-ab-sm bg-ab-gray-light float-left w-full rounded-md border py-3.5 px-4 focus:outline-none`}
        />
      </div>
      <div className="flex flex-col float-left w-full mt-5">
        <label className="text-ab-sm float-left mb-2 font-medium text-black">
          Branch Name
        </label>
        <input
          type="text"
          name="branch_name"
          placeholder="e.g., main"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          className={`text-ab-sm bg-ab-gray-light float-left w-full rounded-md border py-3.5 px-4 focus:outline-none`}
        />
      </div>
      <div className="float-left mb-5 flex w-full items-center mt-8">
        <button
          type="button"
          disabled={!url || !branchName || loading}
          onClick={handleSubmit}
          className="btn-primary text-ab-sm disabled:bg-ab-disabled mr-4 rounded px-5 py-2.5 font-bold leading-tight text-white transition-all"
        >
          Save
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => setUrl("")}
          className="text-ab-disabled hover:text-ab-black text-ab-sm rounded px-3 py-1 font-bold leading-tight"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GithubUpload;
