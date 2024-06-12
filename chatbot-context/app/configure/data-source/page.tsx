"use client";
import React, { useState, useEffect } from "react";
import URLUpload from "./url-upload";
import FileUpload from "./file-upload";
import YtUrlUpload from "./yt-url-upload";
import AudioUpload from "./audio-upload";
import GithubUpload from "./github-upload";
import CSVUpload from "./csv-upload";
import Configure from "../page";
import Loader from "../../common/loader";

export default function DataSource() {
  const [selectedTab, setSelectedTab] = useState("url");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Configure>
      <Loader loading={loading} />
      <div
        className={`flex flex-col ${
          loading ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <div className="flex gap-7">
          <div className="my-2 flex items-center">
            <label className="float-left flex items-center">
              <input
                name="url"
                value={"url"}
                disabled={loading}
                checked={selectedTab === "url"}
                onChange={() => {
                  setSelectedTab("url");
                  setShowSuccessMessage(false);
                }}
                className="peer hidden"
                type="checkbox"
              />
              <span
                className={`chkbox-icon border-ab-disabled float-left mr-2 h-5 w-5 flex-shrink-0 cursor-pointer rounded border bg-white`}
              />
            </label>
            <p className="text-xs tracking-tight text-black font-semibold">
              Website URL
            </p>
          </div>
          <div className="my-2 flex items-center">
            <label className="float-left flex items-center">
              <input
                name="yt-url"
                value={"yt-url"}
                disabled={loading}
                checked={selectedTab === "yt-url"}
                onChange={() => {
                  setSelectedTab("yt-url");
                  setShowSuccessMessage(false);
                }}
                className="peer hidden"
                type="checkbox"
              />
              <span
                className={`chkbox-icon border-ab-disabled float-left mr-2 h-5 w-5 flex-shrink-0 cursor-pointer rounded border bg-white`}
              />
            </label>
            <p className="text-xs tracking-tight text-black font-semibold">
              Youtube URL
            </p>
          </div>
          <div className="my-2 flex items-center">
            <label className="float-left flex items-center">
              <input
                name="github-url"
                value={"github-url"}
                disabled={loading}
                checked={selectedTab === "github-url"}
                onChange={() => {
                  setSelectedTab("github-url");
                  setShowSuccessMessage(false);
                }}
                className="peer hidden"
                type="checkbox"
              />
              <span
                className={`chkbox-icon border-ab-disabled float-left mr-2 h-5 w-5 flex-shrink-0 cursor-pointer rounded border bg-white`}
              />
            </label>
            <p className="text-xs tracking-tight text-black font-semibold">
              Github URL
            </p>
          </div>
          <div className="my-2 flex items-center">
            <label className="float-left flex items-center">
              <input
                name="file"
                value={"file"}
                disabled={loading}
                checked={selectedTab === "file"}
                onChange={() => {
                  setSelectedTab("file");
                  setShowSuccessMessage(false);
                }}
                className="peer hidden"
                type="checkbox"
              />
              <span
                className={`chkbox-icon border-ab-disabled float-left mr-2 h-5 w-5 flex-shrink-0 cursor-pointer rounded border bg-white`}
              />
            </label>
            <p className="text-xs tracking-tight text-black font-semibold">
              File Upload
            </p>
          </div>
          <div className="my-2 flex items-center">
            <label className="float-left flex items-center">
              <input
                name="csv"
                value={"csv"}
                disabled={loading}
                checked={selectedTab === "csv"}
                onChange={() => {
                  setSelectedTab("csv");
                  setShowSuccessMessage(false);
                }}
                className="peer hidden"
                type="checkbox"
              />
              <span
                className={`chkbox-icon border-ab-disabled float-left mr-2 h-5 w-5 flex-shrink-0 cursor-pointer rounded border bg-white`}
              />
            </label>
            <p className="text-xs tracking-tight text-black font-semibold">
              CSV Upload
            </p>
          </div>
          <div className="my-2 flex items-center">
            <label className="float-left flex items-center">
              <input
                name="audio"
                value={"audio"}
                disabled={loading}
                checked={selectedTab === "audio"}
                onChange={() => {
                  setSelectedTab("audio");
                  setShowSuccessMessage(false);
                }}
                className="peer hidden"
                type="checkbox"
              />
              <span
                className={`chkbox-icon border-ab-disabled float-left mr-2 h-5 w-5 flex-shrink-0 cursor-pointer rounded border bg-white`}
              />
            </label>
            <p className="text-xs tracking-tight text-black font-semibold">
              Audio Upload
            </p>
          </div>
        </div>
        <div className="float-left mb-5 w-full mt-4">
          {showSuccessMessage && (
            <div className="mt-6 text-base text-ab-black">
              File/URL Uploaded Successfully
            </div>
          )}
          {!showSuccessMessage && selectedTab === "url" && (
            <URLUpload
              handleSuccessMessagePage={() => setShowSuccessMessage(true)}
              handleLoading={(input: boolean) => setLoading(input)}
              loading={loading}
            />
          )}
          {!showSuccessMessage && selectedTab === "yt-url" && (
            <YtUrlUpload
              handleSuccessMessagePage={() => setShowSuccessMessage(true)}
              handleLoading={(input: boolean) => setLoading(input)}
              loading={loading}
            />
          )}
          {!showSuccessMessage && selectedTab === "github-url" && (
            <GithubUpload
              handleSuccessMessagePage={() => setShowSuccessMessage(true)}
              handleLoading={(input: boolean) => setLoading(input)}
              loading={loading}
            />
          )}
          {!showSuccessMessage && selectedTab === "file" && (
            <FileUpload
              handleSuccessMessagePage={() => setShowSuccessMessage(true)}
              handleLoading={(input: boolean) => setLoading(input)}
              loading={loading}
            />
          )}
          {!showSuccessMessage && selectedTab === "csv" && (
            <CSVUpload
              handleSuccessMessagePage={() => setShowSuccessMessage(true)}
              handleLoading={(input: boolean) => setLoading(input)}
              loading={loading}
            />
          )}
          {!showSuccessMessage && selectedTab === "audio" && (
            <AudioUpload
              handleSuccessMessagePage={() => setShowSuccessMessage(true)}
              handleLoading={(input: boolean) => setLoading(input)}
              loading={loading}
            />
          )}
        </div>
      </div>
    </Configure>
  );
}
