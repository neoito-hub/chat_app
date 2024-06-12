"use client";
import React, { useState } from "react";
import ChatBotList from "./ChatBotList";

const ProjectListing = () => {
  const [tabActive, setTabActive] = useState("inprogress");
  return (
    <div className="float-left mt-6 w-full">
      <div className="md-h-scroll-primary float-left flex w-full overflow-x-auto">
        <div className="border-ab-gray-dark float-left flex w-full space-x-3 border-b">
          <div
            onClick={() => setTabActive("inprogress")}
            className={`text-sm relative -bottom-px flex cursor-pointer items-center justify-center border-b-2 px-3 py-2.5 font-medium ${
              tabActive === "inprogress"
                ? "text-primary border-primary"
                : "text-ab-black hover:text-primary border-transparent"
            }`}
          >
            <p className="whitespace-nowrap">Projects In progress</p>
          </div>
          <div
            onClick={() => setTabActive("completed")}
            className={`text-sm relative -bottom-px flex cursor-pointer items-center justify-center border-b-2 px-3 py-2.5 font-medium ${
              tabActive === "completed"
                ? "text-primary border-primary"
                : "text-ab-black hover:text-primary border-transparent"
            }`}
          >
            <p className="whitespace-nowrap">Completed Projects</p>
          </div>
        </div>
      </div>
      {tabActive === "inprogress" && <ChatBotList tabActive={tabActive} />}
      {tabActive === "completed" && <ChatBotList tabActive={tabActive} />}
    </div>
  );
};

export default ProjectListing;
