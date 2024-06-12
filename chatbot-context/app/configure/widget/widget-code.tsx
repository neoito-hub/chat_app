"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

const WidgetCode = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id")?.toString();
  const [widgetCode, setWidgetCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const generateWidgetCode = () => {
    const api_url = "http://localhost:3011/api/chat";

    // Replace this with the actual widget script generation logic
    const widgetScript = `<script
    id="chatbot-widget"
    src="http://localhost:3000/chat.js"
    data-api-url="${api_url}"
    data-project-id="${projectId}"
    defer
  ></script>`;

    // Update the state with the full code
    setWidgetCode(widgetScript);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(widgetCode);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="w-full p-8 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">
        Widget Embed Code Generator
      </h2>
      <button
        onClick={generateWidgetCode}
        className="bg-primary text-white py-2 px-4 rounded-md cursor-pointer"
      >
        Generate Widget Code
      </button>
      {widgetCode && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Embed this code in your project:
          </h3>
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-2 bg-gray-600 rounded-t-md">
              <span className="text-gray-100">html</span>
              <button
                onClick={copyToClipboard}
                className="text-gray-100 px-2 py-1 rounded-md hover:text-white"
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-gray-800 p-4 rounded-b-md text-white overflow-x-auto relative text-base">
              <code>{widgetCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetCode;
