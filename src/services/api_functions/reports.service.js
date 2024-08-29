import {
  getEmpMonthlyPresentyURL,
  employeeReportListURL,
  attendanceReportEmployeeURL,
  attendanceReportBranchURL,
  leaveReportListURL,
  listOfAbsentURL,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function getEmpMonthlyPresenty(values) {
  return axios({
    url: getEmpMonthlyPresentyURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function employeeReportList(values) {
  return axios({
    url: employeeReportListURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function attendanceReportEmployee(values) {
  return axios({
    url: attendanceReportEmployeeURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function attendanceReportBranch(values) {
  return axios({
    url: attendanceReportBranchURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function leaveReportList(values) {
  return axios({
    url: leaveReportListURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function listOfAbsent(values) {
  return axios({
    url: listOfAbsentURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
