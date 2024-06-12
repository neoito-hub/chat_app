import Validator from "validator";

// const { Validator } = pkg
import utils from "../../../utils/index.js";

function validateProjectInput(data) {
  let errors = {};

  data.id = !utils.isEmpty(data.id)
    ? data.id
    : "";


  if (Validator.isEmpty(data.id)) {
    errors.id = "Project id field is required";
  }


  

  if (!utils.isEmpty(errors)) {
    throw { errorCode: 400, message: errors };
  }
}

export default validateProjectInput;
