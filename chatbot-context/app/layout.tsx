"use client";

import React, { useState, useEffect } from "react";
// import { ErrorBoundary } from "react-error-boundary";
// import { useLocation } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Header from "./header";
// import FallbackUI from "./fallback-ui";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let shield: any;
  if (typeof window !== "undefined") {
    // Only import @appblocks/js-sdk if running on the client side
    const AppBlocksJsSdk = require("@appblocks/js-sdk");
    shield = AppBlocksJsSdk.shield;
  }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      await shield.init(process.env.BLOCK_ENV_URL_CLIENT_ID);
      if (!isLoggedIn) {
        const isLoggedinn = await shield.verifyLogin();
        setIsLoggedIn(isLoggedinn);
      }
      // }
    })();
  }, [isLoggedIn]);

  // const handleError = (error: any, errorInfo: any) => {
  //   console.log("Error occured in ", errorInfo.componentStack.split(" ")[5]);
  // };

  const Loader = (
    <div className="h-screen w-full flex items-center justify-center">
      <ClipLoader color="#5E5EDD" size={50} />
    </div>
  );

  return (
    // <React.StrictMode>
    //   <ErrorBoundary
    //     FallbackComponent={FallbackUI}
    //     onError={handleError}
    //     onReset={() => {
    //       // reset the state of your app so the error doesn't happen again
    //     }}
    //   >
    <html lang="en">
      <body className={inter.className}>
        {isLoggedIn ? (
          <div className="w-full">
            <Header />
            <div className="w-full md:px-6 xl:px-12">
              <div
                className="items-center bg-white p-6 flex flex-col pt-16 mt-8"
                style={{ height: "calc(100vh - 120px)" }}
              >
                {children}
              </div>
            </div>
          </div>
        ) : (
          <>{Loader} </>
        )}
      </body>
    </html>
  );
}
