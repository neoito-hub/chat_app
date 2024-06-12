"use client";

import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
// import { Message } from "@/types/message";
// import DataSource from "./data-source";

const BreadcrumbMenu = () => {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id")?.toString();

  // const [loading, setLoading] = useState<boolean>(false);
  const [subTabActive, setSubTabActive] = useState<string>(
    path.includes("data-source")
      ? "data-source"
      : path.includes("basic-info")
      ? "basic-info"
      : path.includes("widget")
      ? "widget"
      : ""
  );

  return (
    <>
      <div className="breadcrumb mt-3 flex w-full flex-wrap text-sm  items-center">
        <Link href={"/"} className="cursor-pointer text-black/50">
          Chatbots
        </Link>
        <a className="cursor-pointer text-black">
          {`${projectId ? "Update Project" : "New Project"}`}
        </a>
      </div>
      <div className="flex w-full flex-wrap items-center text-black text-2xl mt-6">
        {`${projectId ? "Update Project" : "Create New Project"}`}
      </div>
      <div className="float-left clear-both flex w-full flex-wrap md:max-w-3xl mt-6">
        <ul className="breadcrumb-triangle float-left mb-7 flex w-full space-x-1">
          <li
            onClick={() =>
              router.push(
                `/configure/basic-info${
                  projectId ? `?project_id=${projectId}` : ""
                }`
              )
            }
            className={`relative flex flex-col w-1/3 cursor-pointer space-y-0.5 rounded bg-[#dfe1ef] py-2.5 px-6 text-xs ${
              subTabActive === "basic-info"
                ? "active-breadcrumb"
                : "text-[#3D4EAC]"
            }`}
          >
            <b>Step 1</b>
            <p className="truncate font-medium leading-normal">Basic Info</p>
          </li>
          <li
            onClick={() =>
              projectId &&
              router.push(
                `/configure/data-source${
                  projectId ? `?project_id=${projectId}` : ""
                }`
              )
            }
            className={`relative flex flex-col w-1/3 cursor-pointer space-y-0.5 rounded bg-[#dfe1ef] py-2.5 px-6 pl-10 text-xs ${
              subTabActive === "data-source"
                ? "active-breadcrumb"
                : "text-[#3D4EAC]"
            }`}
          >
            <b>Step 2</b>
            <p className="truncate font-medium leading-normal">
              Add Data Source
            </p>
          </li>
          <li
            onClick={() =>
              projectId &&
              router.push(
                `/configure/widget${
                  projectId ? `?project_id=${projectId}` : ""
                }`
              )
            }
            className={`relative flex w-1/3 cursor-pointer flex-col space-y-0.5 rounded bg-[#dfe1ef] py-2.5 px-6 pl-10 text-xs ${
              subTabActive === "widget" ? "active-breadcrumb" : "text-[#3D4EAC]"
            }`}
          >
            <b>Step 3</b>
            <p className="truncate font-medium leading-normal">Embed Widget</p>
          </li>
          {/* <li
            className={`relative flex w-1/3 cursor-pointer flex-col space-y-0.5 rounded bg-[#dfe1ef] py-2.5 px-6 pl-10 text-xs ${
              subTabActive === "configure-behaviour"
                ? "active-breadcrumb"
                : "text-[#3D4EAC]"
            }`}
          >
            <b>Step 3</b>
            <p className="truncate font-medium leading-normal">
              Configure Behaviour
            </p>
          </li>
          <li
            // onClick={() => handleTabSwitch(versionsFormikRef, "version", [])}
            className={`relative flex w-1/3 cursor-pointer flex-col space-y-0.5 rounded bg-[#dfe1ef] py-2.5 px-6 pl-10 text-xs ${
              subTabActive === "personalisation"
                ? "active-breadcrumb"
                : "text-[#3D4EAC]"
            }`}
          >
            <b>Step 4</b>
            <p className="truncate font-medium leading-normal">
              Personalisation
            </p>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default BreadcrumbMenu;
