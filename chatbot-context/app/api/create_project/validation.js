import Validator from "validator";

// const { Validator } = pkg
import utils from "../../../utils/index.js";

function validateProjectInput(data) {
  let errors = {};

  data.project_name = !utils.isEmpty(data.project_name)
    ? data.project_name
    : "";
  data.category = !utils.isEmpty(data.category) ? data.category : "";
  data.domains = data?.domains ?? [];

  if (Validator.isEmpty(data.project_name)) {
    errors.project_name = "Proejct name field is required";
  }

  if (Validator.isEmpty(data.category)) {
    errors.category = "Category field is required";
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }

  if (data.domains.length === 0) {
    errors.email = "domains field is invalid";
  }

  if (!utils.isEmpty(errors)) {
    throw { errorCode: 400, message: errors };
  }
}

export default validateProjectInput;
