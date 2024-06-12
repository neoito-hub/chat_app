"use client";

import React, { useRef, useEffect, RefObject } from "react";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { useSearchParams, useRouter } from "next/navigation";
import { BasicInfoValidationSchema } from "../../common/validation";
import { BasicInfoInitialValues } from "../../common/interface";
import apiHelper from "@/app/common/apiHelper";
import EmailMultiselect from "./email-multiselect";
import Link from "next/link";

const basicInfoInitialValues = {
  name: "",
  category: "Technology",
  description: "",
  domains: [],
};

const BasicInfoForm = () => {
  const createProjectUrl = "api/create_project";
  const updateProjectUrl = "api/update_project";
  const getProjectUrl = "api/get_project";
  const formikRef = useRef<FormikHelpers<BasicInfoInitialValues> | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get("project_id")?.toString();

  useEffect(() => {
    (async () => {
      if (projectId) {
        const getProjectResponse = await apiHelper({
          baseUrl: process.env.BACKEND_BASE_URL,
          subUrl: getProjectUrl,
          value: { id: projectId },
          apiType: "post",
        });
        if (formikRef.current) {
          formikRef?.current.setFieldValue(
            "name",
            getProjectResponse?.data?.name
          );
          formikRef?.current.setFieldValue(
            "domains",
            getProjectResponse?.data?.domains
          );
          formikRef?.current.setFieldValue(
            "description",
            getProjectResponse?.data?.description
          );
        }
      }
    })();
  }, []);

  const onSubmit: any = async (values: any, errors: any) => {
    if (!projectId) {
      const createProjectRes = await apiHelper({
        baseUrl: process.env.BACKEND_BASE_URL,
        subUrl: createProjectUrl,
        value: {
          project_name: values?.name,
          category: values?.category,
          domains: values?.domains,
          description: values?.description,
        },
      });
      router.push(
        `/configure/data-source${
          createProjectRes?.data
            ? `?project_id=${createProjectRes?.data?.id}`
            : ""
        }`
      );
    } else {
      const updateProjectRes = await apiHelper({
        baseUrl: process.env.BACKEND_BASE_URL,
        subUrl: updateProjectUrl,
        value: {
          id: projectId,
          project_name: values?.name,
          category: values?.category,
          domains: values?.domains,
          description: values?.description,
        },
      });
      router.push(
        `/configure/data-source${projectId ? `?project_id=${projectId}` : ""}`
      );
    }
  };

  return (
    <Formik
      innerRef={formikRef as RefObject<FormikProps<BasicInfoInitialValues>>}
      initialValues={basicInfoInitialValues}
      onSubmit={onSubmit}
      validationSchema={BasicInfoValidationSchema}
      validateOnMount
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ handleSubmit, values, setFieldValue, errors, touched }) => (
        <div className="flex flex-col">
          <div className="float-left mb-5 mt-3 grid w-full grid-cols-1 gap-7 md:grid-cols-2">
            <div className="flex flex-col float-left w-full">
              <label className="text-ab-sm float-left mb-2 font-medium text-black">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={(e) => {
                  setFieldValue("name", e.target.value);
                }}
                // disabled
                // onChange={onChange}
                placeholder="Please enter a name"
                className={`text-ab-sm ${
                  touched.name && errors.name
                    ? "border-ab-red"
                    : "border-ab-gray-light focus:border-primary"
                } bg-ab-gray-light float-left w-full rounded-md border py-3.5 px-4 focus:outline-none`}
              />
              <p className="text-xs text-ab-red left-0 mt-0.5">
                {touched.name && errors.name}
              </p>
            </div>
            <div className="flex flex-col float-left w-full">
              <label className="text-ab-sm float-left mb-2 font-medium text-black">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={values.category}
                readOnly={true}
                // onChange={onChange}
                className={`text-ab-sm 
            ${
              touched.category && errors.category
                ? "border-ab-red"
                : "border-ab-gray-light focus:border-primary"
            } bg-ab-gray-light float-left w-full rounded-md border py-3.5 px-4 focus:outline-none`}
              />
              <p className="text-xs text-ab-red left-0 mt-0.5">
                {touched.category && errors.category}
              </p>
            </div>
          </div>
          <div className="flex flex-col float-left w-full mb-5">
            <label className="text-ab-sm float-left mb-2 font-medium text-black">
              Domain
            </label>
            <EmailMultiselect
              values={values}
              setFieldValue={setFieldValue}
              touched={touched}
              errors={errors}
            />
            <p className="text-xs text-ab-red left-0 mt-0.5">
              {touched.domains && errors.domains}
            </p>
          </div>
          {/* <div className="flex flex-col float-left w-full">
                <label className="text-ab-sm float-left mb-2 font-medium text-black">
                  Domain
                </label>
                <input
                  type="text"
                  name="domain"
                  placeholder="e.g., https://example.com"
                  value={values?.domain}
                  onChange={(e) => {
                    setFieldValue("domain", e.target.value);
                  }}
                  className={`text-ab-sm bg-ab-gray-light float-left w-full rounded-md border py-3.5 px-4 focus:outline-none ${
                    touched.domain && errors.domain
                      ? "border-ab-red"
                      : "border-ab-gray-light focus:border-primary"
                  }`}
                />
                <p className="text-xs text-ab-red left-0 mt-0.5">
                  {touched.domain && errors.domain}
                </p>
              </div> */}
          <div className="flex flex-col float-left w-full col-span-2">
            <label className="text-ab-sm float-left mb-2 font-medium text-black">
              Description
            </label>
            <textarea
              name="description"
              value={values.description}
              onChange={(e) => {
                setFieldValue("description", e.target.value);
              }}
              placeholder="Please enter a description"
              className={`text-ab-sm ${
                touched.description && errors.description
                  ? "border-ab-red"
                  : "border-ab-gray-light focus:border-primary"
              } bg-ab-gray-light float-left w-full rounded-md border py-3.5 px-4 focus:outline-none`}
            />
            <p className="text-xs text-ab-red left-0 mt-0.5">
              {touched.description && errors.description}
            </p>
          </div>
          <div className="float-left mb-5 flex w-full items-center mt-8">
            <button
              type="submit"
              onClick={() => handleSubmit()}
              // disabled={!selectedFiles?.length}
              className="btn-primary text-ab-sm disabled:bg-ab-disabled mr-4 rounded px-5 py-2.5 font-bold leading-tight text-white transition-all"
            >
              Save
            </button>
            <Link
              href="/"
              className="text-ab-disabled hover:text-ab-black text-ab-sm rounded px-3 py-1 font-bold leading-tight"
            >
              Cancel
            </Link>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default BasicInfoForm;
