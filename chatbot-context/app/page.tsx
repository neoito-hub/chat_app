import React from "react";
import ProjectListing from "./project-listing";
import "./index.scss";

export default function Home() {
  return (
    <div className="float-left w-full max-w-[748px] py-6">
      <div className="float-left mt-5 flex w-full items-center justify-between">
        <p className="float-left text-2xl font-medium text-black/80">
          Chatbots
        </p>
      </div>
      <ProjectListing />
    </div>
  );
}
