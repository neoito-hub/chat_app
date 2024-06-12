// pages/ChatbotConfigure.js

import React, { useState } from "react";
const ChatbotConfigure = () => {
  return (
    <div className="w-full float-left flex flex-col gap-y-8">
      <div className="w-full float-left flex flex-col gap-y-7">
        <div className="flex flex-col gap-y-1">
          <h5 className="text-sm font-medium text-black">Training Model</h5>
          <p className="text-xs text-ab-black font-normal">
            Train LLMs using OpenAI, open source, or custom models, depending on
            needs and resources
          </p>
        </div>
        <div className="flex flex-col items-start gap-y-4">
          <label className="flex gap-x-3 cursor-pointer">
            <input type="radio" name="t-model" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-full border-[#C2C2C2] peer-checked:border-primary"></span>
            <div className="flex flex-col gap-y-1">
              <h5 className="text-xs font-medium text-black">Training Model</h5>
              <p className="text-xs text-ab-black font-normal">
                Train LLMs using OpenAI, open source, or custom models,
                depending on needs and resources
              </p>
            </div>
          </label>
          <label className="flex gap-x-3 cursor-pointer">
            <input type="radio" name="t-model" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-full border-[#C2C2C2] peer-checked:border-primary"></span>
            <div className="flex flex-col gap-y-1">
              <h5 className="text-xs font-medium text-black">
                Use Open Source LLM
              </h5>
              <p className="text-xs text-ab-black font-normal">
                Train your chatbot with a number of open source LLMs available
              </p>
            </div>
          </label>
          <label className="flex gap-x-3 cursor-pointer">
            <input type="radio" name="t-model" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-full border-[#C2C2C2] peer-checked:border-primary"></span>
            <div className="flex flex-col gap-y-1">
              <h5 className="text-xs font-medium text-black">
                Use your own LLM
              </h5>
              <p className="text-xs text-ab-black font-normal">
                Train your chatbot with your own custom LLM
              </p>
            </div>
          </label>
        </div>
      </div>
      <div className="w-full float-left flex flex-col gap-y-7">
        <div className="flex flex-col gap-y-1">
          <h5 className="text-sm font-medium text-black">Privacy type</h5>
          <p className="text-xs text-ab-black font-normal">
            Lorem ipsum the chatbot's training is limited to the content
            available on the specific URL provided. Hyperlinks and sub-domains
            will not be scanned.
          </p>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input type="radio" name="t-model" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-full border-[#C2C2C2] peer-checked:border-primary"></span>
            <p className="text-xs font-medium text-black">Public</p>
          </label>
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input type="radio" name="t-model" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-full border-[#C2C2C2] peer-checked:border-primary"></span>
            <p className="text-xs font-medium text-black">Private</p>
          </label>
        </div>
      </div>
      <div className="w-full float-left flex flex-col gap-y-7">
        <div className="flex flex-col gap-y-1">
          <h5 className="text-sm font-medium text-black">Content Filtering</h5>
          <p className="text-xs text-ab-black font-normal">
            Lorem ipsum the chatbot's training is limited to the content
            available on the specific URL provided. Hyperlinks and sub-domains
            will not be scanned.
          </p>
        </div>
        <div className="flex flex-wrap max-w-sm w-full gap-6">
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input type="radio" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-md border-[#C2C2C2] peer-checked:border-primary"></span>
            <p className="text-xs font-medium text-black">
              Hate or Threatening
            </p>
          </label>
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input type="radio" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-md border-[#C2C2C2] peer-checked:border-primary"></span>
            <p className="text-xs font-medium text-black">Sexual</p>
          </label>
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input type="radio" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-md border-[#C2C2C2] peer-checked:border-primary"></span>
            <p className="text-xs font-medium text-black">Minors</p>
          </label>
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input type="radio" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-md border-[#C2C2C2] peer-checked:border-primary"></span>
            <p className="text-xs font-medium text-black">Self harm</p>
          </label>
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input type="radio" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-md border-[#C2C2C2] peer-checked:border-primary"></span>
            <p className="text-xs font-medium text-black">Sexual/Minors</p>
          </label>
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input type="radio" className="hidden peer" />
            <span className="chkbox-tick flex-shrink-0 w-5 h-5 border rounded-md border-[#C2C2C2] peer-checked:border-primary"></span>
            <p className="text-xs font-medium text-black">Violence/Graphic</p>
          </label>
        </div>
      </div>
      <div className="w-full float-left flex flex-col gap-y-7">
        <div className="w-full float-left flex flex-col gap-y-1">
          <label className="text-sm font-medium text-black">
            Restricted Terms
          </label>
          <input
            type="text"
            placeholder="Enter restricted terms"
            className="px-4 py-3 text-sm placeholder:font-medium foucs:!outline-none border border-transparent focus:border-primary focus:!outline-none rounded w-full float-left bg-[#F8F8F8]"
          />
        </div>
        <div className="w-full float-left flex flex-col gap-y-1">
          <label className="text-sm font-medium text-black">
            Behaviour Instruction
          </label>
          <input
            type="text"
            placeholder="Enter instructions"
            className="px-4 py-3 text-sm placeholder:font-medium foucs:!outline-none border border-transparent focus:border-primary focus:!outline-none rounded w-full float-left bg-[#F8F8F8]"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotConfigure;
