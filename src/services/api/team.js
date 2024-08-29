import config from "config";

export function createTeamUrl() {
  return `${config.apiUrl}/createTeam`;
}

export function listOfTeamUrl() {
  return `${config.apiUrl}/listOfTeam`;
}

export function findTeamUrl() {
  return `${config.apiUrl}/findTeam`;
}

export function updateTeamUrl() {
  return `${config.apiUrl}/updateTeam`;
}

export function deleteTeamUrl() {
  return `${config.apiUrl}/deleteTeam`;
}
export function deleteTeamAllocationUrl() {
  return `${config.apiUrl}/deleteTeamAllocation`;
}

export function TeamLeadersUrl() {
  return `${config.apiUrl}/getTeamLeaders`;
}

export function createTeamAllocationUrl() {
  return `${config.apiUrl}/create_team_allocation`;
}

export function listOfTeamAllocationUrl() {
  return `${config.apiUrl}/listOfTeamAllocation`;
}

export function getTeamAllocationUrl() {
  return `${config.apiUrl}/getTeamAllocation`;
}

export function updateTeamAllocationUrl() {
  return `${config.apiUrl}/update_team_allocation`;
}
export function findTeamByBranchUrl() {
  return `${config.apiUrl}/findTeamByBranch`;
}

export function getTodayAttendancePunchOutSiteWiseListUrl() {
  return `${config.apiUrl}/getTodayAttendancePunchOutSiteWiseList`;
}
export function getTodayAttendancePunchInSiteWiseListUrl() {
  return `${config.apiUrl}/getTodayAttendancePunchInSiteWiseList`;
}
export function getPunchInListUrl() {
  return `${config.apiUrl}/getPunchInList`;
}
export function getPunchOutListUrl() {
  return `${config.apiUrl}/getPunchOutList`;
}
export function approveTodayPunchInAndPunchOutForTeamUrl() {
  return `${config.apiUrl}/approveTodayPunchInAndPunchOutForTeam`;
}
export function disapproveTodayPunchInAndPunchOutForTeamUrl() {
  return `${config.apiUrl}/disapproveTodayPunchInAndPunchOutForTeam`;
}
