import { listOfSelfUrl, listOfTeamAttendanceUrl } from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function listOfSelf() {
  return axios({
    url: listOfSelfUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function listOfTeamAttendance() {
  return axios({
    url: listOfTeamAttendanceUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
