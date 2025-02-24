import { HttpMethodTypes } from "src/utils/types/enums/http-method-types";
import { axiosRequest } from "../axios-request";
import { BACKEND_URL } from "src/utils/constants";

export async function getSightings() {
  console.log("BACKEND_URL", BACKEND_URL);
  const response = axiosRequest({
    method: HttpMethodTypes.GET,
    url: `${BACKEND_URL}/sightings`,
  });
  return response;
}
