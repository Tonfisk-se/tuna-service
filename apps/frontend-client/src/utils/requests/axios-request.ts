import axios from "axios";
import { HttpMethodTypes } from "../types/enums/http-method-types";

interface AxiosRequestProps {
  url: string;
  method: HttpMethodTypes;
  body?: { lat: string; long: string };
}

export async function axiosRequest(props: AxiosRequestProps) {
  const options = {
    url: props.url,
    method: props.method,
    data: props.body,
  };
  const response = await axios(options);
  return response;
}
