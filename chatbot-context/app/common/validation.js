import * as Yup from "yup";

const urlRegex =
  /^(http:\/\/localhost(:\d+)?|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})$/i;

export const BasicInfoValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().required("Name cannot be blank"),
    category: Yup.string().required("Category field is required"),
    description: Yup.string().required("Description cannot be blank"),
    domains: Yup.array()
      .min(1, "At least one domain is required")
      .of(
        Yup.string().test("is-url", "Invalid URL", (value) => {
          return !value || urlRegex.test(value);
        })
      )
      .nullable(true),
  });
