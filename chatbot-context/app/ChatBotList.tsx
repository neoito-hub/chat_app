"use client";
import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import dayjs from "dayjs";
import Link from "next/link";
// import Image from "next/image";
// import ChatIcon from "../app/assets/img/icons/chat.svg";
// import LogIcon from "../app/assets/img/icons/log.svg";
import apiHelper from "./common/apiHelper";
import Loader from "./common/loader";

const ChatBotList = ({ tabActive }: any) => {
  const getProjectListApiUrl = "api/list_projects";

  const [searchText, setSearchText] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiHelper({
        baseUrl: process.env.BACKEND_BASE_URL,
        subUrl: getProjectListApiUrl,
        value: {
          context_status: tabActive === "inprogress" ? 1 : 2,
          search_string: searchText,
        },
        apiType: "post",
      });
      setLoading(false);
      setProjectList(res?.data?.projects);
    })();
  }, [searchText]);

  const handler = useCallback(
    debounce((text: any) => {
      setSearchText(text);
    }, 1000),
    []
  );

  const onSearchTextChange = (e: any) => {
    handler(e.target.value);
  };

  return (
    <>
      <Loader loading={loading} />
      <div className="bg-ab-black-medium float-left mt-5 flex w-full justify-between space-x-3">
        <div className="float-left flex-grow overflow-hidden">
          <input
            type="text"
            className="search-input-white border-ab-gray-dark text-ab-black h-9 w-full rounded-md border !bg-[length:14px_auto] px-2 pl-8 text-sm focus:outline-none"
            placeholder="Search Project"
            onChange={onSearchTextChange}
          />
        </div>
        <Link
          href={"/configure/basic-info"}
          className="btn-primary text-ab-sm disabled:bg-ab-disabled inline-flex flex-shrink-0 items-center rounded px-5 py-2.5 font-bold leading-tight text-white transition-all"
        >
          <svg
            className="mr-2.5"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.00033 0.666748V11.3334M0.666992 6.00008H11.3337"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          New Project
        </Link>
      </div>
      <div className="float-left w-full overflow-x-hidden py-3 mt-2">
        <div className="float-left w-full">
          {!loading && !projectList.length && (
            <p className="text-ab-black float-left w-full py-10 text-center text-sm">
              No Projects Found!
            </p>
          )}
          <div className="grid grid-cols-3 gap-3">
            {projectList?.map((project: any) => (
              <Link
                href={`/configure/basic-info/?project_id=${project.id}`}
                key={project?.id}
                className="border-ab-gray-dark/60 float-left flex w-full flex-col border bg-white p-3 cursor-pointer"
              >
                <div className="float-left w-full">
                  <p className="text-xl text-ab-black overflow-hidden text-ellipsis font-semibold">
                    {project?.name}
                  </p>
                  <div className="text-ab-black/60 info-group mt-1.5 flex flex-wrap text-xs font-medium">
                    <span>{project?.category}</span>
                    <span>
                      {dayjs(project?.created_at).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>
                <div className="float-left flex w-full items-center mt-2">
                  <p className="py-1 text-sm text-ab-black font-medium">
                    {project?.description}
                  </p>
                </div>
                {/* <div className="border-ab-dark text-ab-black float-left mt-1 flex w-full flex-wrap items-center border-t pt-1 font-medium">
              <p className="mt-2 mr-4 flex items-center text-xs">
                <Image
                  className="mr-1"
                  src={ChatIcon}
                  width="16"
                  height="16"
                  alt="Chat"
                />
                Chat
              </p>
              <p className="mt-2 flex items-center text-xs">
                <Image
                  className="mr-1"
                  src={LogIcon}
                  width="12"
                  height="14"
                  alt="Log"
                />
                Training Logs
              </p>
            </div> */}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBotList;
