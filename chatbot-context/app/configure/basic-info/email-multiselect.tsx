"use client";

import React, { useRef } from "react";
import { BasicInfoInitialValues } from "../../common/interface";

const urlRegex =
  /^(http:\/\/localhost(:\d+)?|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})$/i;

const EmailMultiselect = ({
  values,
  setFieldValue,
  touched,
  errors,
}: {
  values: BasicInfoInitialValues;
  setFieldValue: any;
  touched: any;
  errors: any;
}) => {
  const { domains } = values;
  const emailInputRef = useRef<any>();

  const handleEmailLabel = (e: any) => {
    let domain = e.target.value;
    if (urlRegex.test(domain) && !domains.includes(domain)) {
      domains.push(domain);
      setFieldValue("doamins", domains);
      e.target.value = "";
      e.target.focus();
    } else {
      return false;
    }
  };

  const handleRemoveEmail = (domain: string) => {
    const updatedDomains = domains.filter((item) => item !== domain);
    setFieldValue("domains", updatedDomains);
  };

  return (
    <div className="relative float-left w-full">
      <div
        onClick={() => emailInputRef.current.focus()}
        className={`${
          touched.domains && errors.domains
            ? "border-ab-red"
            : "border-ab-gray-light focus-within:border-primary "
        } bg-ab-gray-light float-left w-full select-none rounded-md border py-0.5 px-1 text-xs focus-within:outline-none `}
      >
        <div className="w-full float-left max-h-[100px] overflow-auto custom-scroll-primary px-1.5">
          {domains &&
            domains.map((domain: string) => (
              <div
                key={domain}
                className="bg-ab-disabled-yellow float-left my-1 mr-2 inline-flex max-w-full items-center space-x-2 rounded-full py-0.5 px-3"
              >
                <p className="text-ab-black truncate text-xs font-medium leading-normal">
                  {domain}
                </p>
                <svg
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => handleRemoveEmail(domain)}
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.799988 0.799805L7.19999 7.19981M0.799988 7.19981L7.19999 0.799805"
                    stroke="#484848"
                    strokeWidth="1.53333"
                  />
                </svg>
              </div>
            ))}
          <input
            type="text"
            id="searchInput"
            ref={emailInputRef}
            autoComplete="off"
            // onChange={(e) => handler(e.target.value)}
            className="text-ab-black inline-block w-auto border-0 bg-transparent py-2 align-baseline text-xs outline-none focus:border-none focus:shadow-none focus:outline-none"
            placeholder="Domain"
            onBlur={(e) => handleEmailLabel(e)}
            // onFocus={(e) => {
            //   type !== "Space" && handleEmailDropdown();
            //   type !== "Space" && onEmailChange(e.target.value);
            // }}
            onKeyPress={(e) =>
              (e.code === "Enter" || e.code === "Tab") && handleEmailLabel(e)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EmailMultiselect;
