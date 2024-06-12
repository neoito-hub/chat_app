import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import Link from "next/link";
import axios from "axios";
// import useOnclickOutside from "react-cool-onclickoutside";
import Image from "next/image";
import Logo from "./assets/img/logo.png";
import LogoTxt from "./assets/img/logo-txt.svg";
import DiscordIcon from "./assets/img/icons/discord-icon.svg";

let shield: any;
if (typeof window !== "undefined") {
  // Only import @appblocks/js-sdk if running on the client side
  const AppBlocksJsSdk = require("@appblocks/js-sdk");
  shield = AppBlocksJsSdk.shield;
}

export default function Header() {
  const [responsiveView, setResponsiveView] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [profDropdown, setProfDropdown] = useState(false);

  // const profDropContainer = useOnclickOutside(() => {
  //   setProfDropdown(false);
  // });

  const getUserDetailsApiUrl = "get-user-details";

  const apiHelper = async (
    baseUrl: string | undefined,
    subUrl: string | undefined,
    value = null,
    apiType = "post"
  ) => {
    const token = shield.tokenStore.getToken();
    try {
      const { data } = await axios({
        method: apiType,
        url: `${baseUrl}${subUrl}`,
        data: value && value,
        headers: token && {
          Authorization: `Bearer ${token}`,
        },
      });
      return data?.data;
    } catch (err) {
      console.log("msg", err);
      // if (err.response.status === 401) shield.logout();
    }
  };

  useEffect(() => {
    (async () => {
      const res = await apiHelper(
        process.env.SHIELD_AUTH_URL,
        getUserDetailsApiUrl,
        null,
        "get"
      );
      setUserDetails(res);
    })();
  }, []);

  const signOut = async () => {
    setProfDropdown(false);
    localStorage.clear();
    await shield.logout();
  };

  useEffect(() => {
    const handleOutsideClick: any = (event: {
      target: { closest: (arg0: string) => null };
    }) => {
      // Check if the click is outside the modal
      if (profDropdown && event.target.closest(".modal") === null) {
        setProfDropdown(false);
      }
    };

    // Attach event listener to the document body
    document.body.addEventListener("click", handleOutsideClick);

    // Clean up the event listener on component unmount
    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, [profDropdown]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setResponsiveView(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="border-ab-gray-medium fixed top-0 left-0 z-[999] w-full border-b bg-white">
      <div className="flex h-16 w-full px-4 md:items-center md:justify-between md:space-x-4 md:px-6 xl:px-12">
        <div className="flex flex-grow items-center py-2">
          <div className="flex w-full items-center">
            <Link
              href={"/"}
              className="flex flex-shrink-0 items-center focus:outline-none cursor-pointer"
            >
              <Image className="max-w-[48px]" src={Logo} alt="" />
              <Image className="lg-lt:hidden ml-3" src={LogoTxt} alt="" />
            </Link>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center">
          <div
            id="navbar-responsive"
            className={`nav-menu-wrapper custom-scroll-primary md-lt:bg-white md-lt:py-1.5 md-lt:shadow-lg ${
              !responsiveView ? "md-lt:-right-64" : "md-lt:right-0"
            }`}
          >
            <ul className="text-ab-black text-ab-sm my-3 flex flex-col items-center md:my-0 md:flex-row md:space-x-4 md-lt:items-start md-lt:space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    window.open(process.env.DOCS_PUBLIC_PATH, "_blank");
                  }}
                  className="block hover:underline cursor-pointer font-semibold focus:outline-none"
                >
                  Docs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    window.open(process.env.APPBLOCKS_DISCORD_URL, "_blank");
                  }}
                  className="text-primary flex items-center cursor-pointer font-semibold focus:outline-none rounded transition-all bg-primary/10 hover:bg-primary/20 px-4 py-2"
                >
                  <Image className="mr-2" src={DiscordIcon} alt="Discord" />
                  Join Discord
                </button>
              </li>
            </ul>
            {userDetails && (
              <span className="text-[#D9D9D9] ml-4 md-lt:hidden">|</span>
            )}
            {userDetails && (
              <div className="my-3 flex flex-col text-sm md:my-0 md:ml-4 md:flex-row md:items-center md:space-x-4 md-lt:items-start md-lt:space-y-3">
                <div
                  className="relative float-left flex-shrink-0 md-lt:w-full modal"
                  // ref={profDropContainer}
                >
                  <div
                    onClick={() =>
                      !responsiveView && setProfDropdown(!profDropdown)
                    }
                    className="flex h-8 cursor-pointer select-none items-center space-x-1.5"
                  >
                    <span className="bg-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white capitalize">
                      {userDetails && userDetails?.full_name
                        ? userDetails?.full_name[0]
                        : userDetails?.email[0]}
                    </span>
                    <p className="text-ab-black w-full truncate text-xs font-semibold md:hidden">
                      {userDetails && userDetails?.full_name
                        ? userDetails?.full_name
                        : userDetails?.email}
                    </p>
                  </div>
                  <div
                    className={`border-ab-medium shadow-box dropDownFade top-12 right-0 z-10 bg-white py-3 md:absolute md:min-w-[260px] md:border md:px-4 md-lt:w-full ${
                      profDropdown ? "" : "md:hidden"
                    }`}
                  >
                    {userDetails?.email && (
                      <div className="mb-2">
                        <p>Signed in as</p>
                        <span className=" font-semibold ">
                          {userDetails && userDetails?.full_name
                            ? userDetails?.full_name
                            : userDetails?.email}
                        </span>
                      </div>
                    )}
                    <ul>
                      <li key="signout" onClick={signOut} className="py-2">
                        <span className="text-ab-red cursor-pointer text-sm hover:underline">
                          Log out
                        </span>
                      </li>
                    </ul>
                    {/* <div className="border-ab-gray-medium my-2 border-t" />
                    <ul>
                      <li className="py-2 md:hidden">
                        <button
                          type="button"
                          onClick={() => {
                            window.open(process.env.DOCS_PUBLIC_PATH, "_blank");
                          }}
                          className="text-ab-black cursor-pointer text-sm hover:underline"
                        >
                          Docs
                        </button>
                      </li>
                    </ul> */}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center">
            <button
              type="button"
              onClick={() => setResponsiveView(!responsiveView)}
              className="ml-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center focus:outline-none md:hidden"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <span
                className={`hamburger-icon ${
                  responsiveView ? "active-hamburger" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
