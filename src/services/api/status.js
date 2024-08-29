import config from "config";

export function listOfSelfUrl() {
  return `${config.apiUrl}/listOfSelf`;
}

export function listOfTeamAttendanceUrl() {
  return `${config.apiUrl}/listOfTeamAttendance`;
}
