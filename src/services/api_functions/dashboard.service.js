import {
  dashboardAttendanceDataUrl,
  employeeLeaveDataUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function dashboardAttendanceData() {
  return axios({
    url: dashboardAttendanceDataUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function employeeLeaveData(values) {
  return axios({
    url: employeeLeaveDataUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
