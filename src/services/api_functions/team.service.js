import {
  createTeamUrl,
  listOfTeamUrl,
  updateTeamUrl,
  deleteTeamUrl,
  findTeamUrl,
  TeamLeadersUrl,
  createTeamAllocationUrl,
} from "@/services/api";
import { getHeader } from "@/helpers";
import axios from "axios";
import { approveTodayPunchInAndPunchOutForTeamUrl, deleteTeamAllocationUrl, disapproveTodayPunchInAndPunchOutForTeamUrl, findTeamByBranchUrl, getPunchInListUrl, getPunchOutListUrl, getTeamAllocationUrl, getTodayAttendancePunchInSiteWiseListUrl, getTodayAttendancePunchOutSiteWiseListUrl, listOfTeamAllocationUrl, updateTeamAllocationUrl } from "../api/team";
// import { createEmployeeAllocationUrl } from "../api/team";

export function createTeam(values) {
  console.log("getHeader>>", getHeader(), values);
  return axios({
    url: createTeamUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function createTeamAllocation(values) {
  console.log("getHeader>>", getHeader(), values);
  return axios({
    url: createTeamAllocationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function listOfTeam() {
  return axios({
    url: listOfTeamUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function findTeam(values) {
  return axios({
    url: findTeamUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function listOfTeamAllocation() {
  return axios({
    url: listOfTeamAllocationUrl(),
    method: "GET",
    headers: getHeader(),
    // data: values,
  });
}

export function updateTeam(values) {
  return axios({
    url: updateTeamUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteTeam(values) {
  return axios({
    url: deleteTeamUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function deleteTeamAllocation(values) {
  return axios({
    url: deleteTeamAllocationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getTeamAllocation(values) {
  return axios({
    url: getTeamAllocationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}


export function TeamLeaders() {
  return axios({
    url: TeamLeadersUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function updateTeamAllocation(values) {
  return axios({
    url: updateTeamAllocationUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findTeamByBranch(values) {
  return axios({
    url: findTeamByBranchUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getTodayAttendancePunchOutSiteWiseList(values) {
  return axios({
    url: getTodayAttendancePunchOutSiteWiseListUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getTodayAttendancePunchInSiteWiseList(values) {
  return axios({
    url: getTodayAttendancePunchInSiteWiseListUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getPunchInList(values) {
  return axios({
    url: getPunchInListUrl(),
    method: "GET",
    headers: getHeader(),
    // data: values,
  });
}

export function getPunchOutList(values) {
  return axios({
    url: getPunchOutListUrl(),
    method: "GET",
    headers: getHeader(),
    // data: values,
  });
}

export function approveTodayPunchInAndPunchOutForTeam(values) {
  return axios({
    url: approveTodayPunchInAndPunchOutForTeamUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function disapproveTodayPunchInAndPunchOutForTeam(values) {
  return axios({
    url: disapproveTodayPunchInAndPunchOutForTeamUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}