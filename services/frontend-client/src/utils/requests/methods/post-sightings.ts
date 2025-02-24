import { HttpMethodTypes } from "src/utils/types/enums/http-method-types";
import { axiosRequest } from "../axios-request";
import { BACKEND_URL } from "src/utils/constants";

export async function postSightings() {
  const body = {
    long: "1",
    lat: "1",
    comment: "I saw a two tunas in folkets park",
  };
  const response = await axiosRequest({
    method: HttpMethodTypes.POST,
    url: `${BACKEND_URL}/sighting`,
    body,
  });
  return response;
}
