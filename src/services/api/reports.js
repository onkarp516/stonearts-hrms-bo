import config from "config";

export function getEmpMonthlyPresentyURL() {
  return `${config.apiUrl}/getEmpMonthlyPresenty`;
}

export function employeeReportListURL() {
  return `${config.apiUrl}/employeeReportList`;
}

export function attendanceReportEmployeeURL() {
  return `${config.apiUrl}/attendanceReportEmployee`;
}

export function attendanceReportBranchURL() {
  return `${config.apiUrl}/attendanceReportBranch`;
}

export function leaveReportListURL() {
  return `${config.apiUrl}/leaveReportList`;
}

export function listOfAbsentURL() {
  return `${config.apiUrl}/listOfAbsent`;
}
