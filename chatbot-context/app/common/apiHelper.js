import axios from "axios";
import { shield } from "@appblocks/js-sdk";

const apiHelper = async ({
  baseUrl,
  subUrl,
  value = null || {},
  apiType = "post",
  //   spaceId = null,
  // eslint-disable-next-line consistent-return
}) => {
  const token = shield.tokenStore.getToken();
  try {
    const { data } = await axios({
      method: apiType,
      url: `${baseUrl}${subUrl}`,
      data: value && value,
      headers: token && {
        Authorization: `Bearer ${token}`,
        // ...(spaceId && { space_id: spaceId }),
      },
    });
    return data;
  } catch (err) {
    console.log("msg", err);
    alert(err.message);
    // if (err.response.status === 401) shield.logout();
  }
};

export default apiHelper;
