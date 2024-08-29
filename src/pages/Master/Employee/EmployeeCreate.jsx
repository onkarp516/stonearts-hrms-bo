import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

import moment from "moment";
import { Tab, Tabs } from "react-bootstrap";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Step5 from "./Steps/Step5";

import { EMAILREGEXP, MPINREGEXP, SUPPORTED_FORMATS_PDF } from "@/helpers";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import {
  createEmployee,
  listOfBranch,
  listOfCompany,
  listOfManagers,
  listOfDesignation,
  listOfShifts,
  listOfDocument,
  listOfDepartment,
} from "@/services/api_functions";
import ResponseModal from "../../../components/ResponseModal";

// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import LayoutCustom from "@/pages/layout/LayoutCustom";
// import ArrowBackIosSharpIcon from "@material-ui/icons/ArrowBackIosSharp";

let wagesOpt = [
  { value: "hour", label: "Hour basis" },
  { value: "day", label: "Day basis" },
];

let genderOpt = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

let maritalstatusOpt = [
  { value: "Married", label: "Married" },
  { value: "UnMarried", label: "UnMarried" },
];

let weeklyOffOpt = [
  { value: 0, label: "SUNDAY" },
  { value: 1, label: "MONDAY" },
  { value: 2, label: "TUESDAY" },
  { value: 3, label: "WEDNESDAY" },
  { value: 4, label: "THURSDAY" },
  { value: 5, label: "FRIDAY" },
  { value: 6, label: "SATURDAY" },
];

export default function EmployeeCreate(props) {
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [is_loading, setIs_loading] = useState(false);
  const [init_val, setinit_val] = useState({
    // step 1empType_opt
    fullName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    fullAddress: "",
    correspondenceAddress: "",
    mobileNumber: "",
    mobile: "",
    dob: "",
    f_dob: "",
    age: "0",
    religion: "NA",
    cast: "NA",
    reasonToJoin: "NA",
    marriageStatus: "",
    height: "NA",
    weight: "NA",
    bloodGroup: "NA",
    education: "",
    chooseFromFamilyDet: false,
    emergencyRelation: "",
    emergencyContact: "",
    document: "",
    maritalStatus: "",
    presentAddress: "",
    permanentAddress: "",
    companyType: "",
    institutionName: "",
    qualification: "",
    university: "",
    year: "",
    grade: "",
    percentage: "",
    corrAddress: "",
    gender: "",
    isSpecks: false,
    isDisability: "false",
    disabilityDetails: "NA",
    policeCaseDetails: "NA",
    isInjured: "false",
    injureDetails: "NA",
    hobbies: "false",
    f_fullName: "NA",
    f_age: "NA",
    f_relation: "NA",
    f_education: "NA",
    f_business: "NA",
    f_dob: "NA",
    e_institutionName: "NA",
    e_qualification: "NA",
    e_university: "NA",
    e_year: "NA",
    e_grade: "NA",
    e_percentage: "NA",

    // step 2
    referenceName: "NA",
    referenceAddress: "NA",
    referenceBusiness: "NA",
    referenceMobile: "NA",
    referenceOther: "NA",
    empOfGeneration: false,
    d_documentId: "",
    d_imagePath: "",

    // step 3
    canWeContactPreviousCompany: false,
    ee_duration: "NA",
    ee_designationName: "NA",
    ee_incomePerMonth: "NA",
    ee_reasonToResign: "NA",

    r_name: "NA",
    r_address: "NA",
    r_business: "NA",
    r_mobileNumber: "NA",
    r_knownFromWhen: "NA",

    isExperienceEmployee: "false",
    companyName: "",
    experience_fromMonthYear: "",
    experience_toMonthYear: "",
    experience_designationName: "",
    experience_lastDrawnSalary: "",
    experience_reasonToResign: "",

    // step4
    company: "",
    branch: "",
    designation: "",
    shift: "",
    WageType: "",
    WeeklyOffDay: "",
    expectedSalary: "",
    doj: "",
    // WagesPerDay: "",
    BankName: "",
    BranchName: "",
    AccountNumber: "",
    krapin: "",
    nssf: "",
    nhif: "",
    IFSC: "",
    pfNumber: "",
    esiNumber: "",
    PanNumber: "",
    manager: "",
    departmentId: "",

    // step5
    employeeHavePf: false,
    employeePf: "",
    employeeHaveEsi: false,
    employeeEsi: "",
    employeeHaveProfTax: false,
    showSalarySheet: false,
    payrollOptToShow: false,
  });
  const [designation_opt, setDesignation_opt] = useState([]);
  const [branch_opt, setBranch_opt] = useState([]);
  const [company_opt, setCompany_opt] = useState([]);
  const [managers_opt, setManagers_opt] = useState([]);
  const [shift_opt, setShift_opt] = useState([]);
  const [department_opt, setDepartment_opt] = useState([]);
  const [document_opt, setDocument_opt] = useState([]);

  const [salaryList, setSalaryList] = useState([]);
  const [educationlist, setEducationList] = useState([]);
  const [documentlist, setDocumentList] = useState([]);
  const [experiencelist, setExperienceList] = useState([]);
  const [referencelist, setReferenceList] = useState([]);
  const [familylist, setFamilyList] = useState([]);
  const navigate = useNavigate();
  const [openRow, setOpenRow] = useState(null);
  const [ResModal, setResModal] = useState(false);
  const [ResText, setResText] = useState("");
  const [LogoType, setLogoType] = useState("");
  const [deptList, setdeptList] = useState([]);
  const [Submitting, setSubmitting] = useState([]);
  const [rowId, setrowId] = useState();

  useEffect(() => {
    // This effect will run whenever resText changes
    if (ResText) {
      // Check if ResText is not empty, and then open the modal
      setResModal(true);
    }
  }, [ResText]);

  const openModal = (text, logo_type, id) => {
    // Update the state to set the text
    setLogoType(logo_type);
    setResText(text);
    setrowId(id)
  };

  // Function to close the modal
  const closeModal = () => {
    setResModal(false);
    setResText("");
    navigate("/Dashboard/Master/employee");
  };

  // Function to handle form submission with confirmation
  const handleConfirmSubmit = () => {
    // handleSubmit();
    // onDelete(rowId)
    closeModal(); // Close the modal after submission
  };
  // ... (other methods)

  const VALIDATION = {
    1: Yup.object().shape({
      firstName: Yup.string().trim().nullable().required(" "),
      middleName: Yup.string().trim().nullable().required(" "),
      lastName: Yup.string().trim().nullable().required(" "),
      mobileNumber: Yup.string().trim().nullable().required(" "),
      emergencyRelation: Yup.string().trim().nullable().required(" "),
      emergencyContact: Yup.string().trim().nullable().required(" "),
      // mobileNumber: Yup.string()
      //   .trim()
      //   .required("Mobile number is required")
      //   .matches(/^[0-9]{10}$/, "Invalid mobile number"),
      gender: Yup.string().trim().nullable().required(" "),
      dob: Yup.string().trim().nullable().required(" "),
      presentAddress: Yup.string().trim().nullable().required(" "),
      // 2: Yup.object().shape({
      //   firstName: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required(" "),
      // }),
      // 3: Yup.object().shape({}),
    }),
    2: Yup.object().shape({}),
    3: Yup.object().shape({}),
    4: Yup.object().shape({
      company: Yup.string().required(" "),
      branch: Yup.string().required(" "),
      designation: Yup.string().required(" "),
      shift: Yup.string().required(" "),
      WageType: Yup.string().required(" "),
      weekly: Yup.string().required(" "),
      expectedSalary: Yup.string().required(" "),
      doj: Yup.string().required(" "),
      // WagesPerDay: Yup.string().required(" "),
      BankName: Yup.string().required(" "),
      BranchName: Yup.string().required(" "),
      AccountNumber: Yup.string().required(" "),
      IFSC: Yup.string().required(" "),
      departmentId: Yup.string().required(" "),
      // pfNumber: Yup.string().required(" "),
      // esiNumber: Yup.string().required(" "),
      PanNumber: Yup.string().required(" "),
      manager: Yup.string().required(" "),
      //   company: Yup.object().nullable().required(" "),
      //   expectedSalary: Yup.object().nullable().required(" "),
      //   designationId: Yup.object().nullable().required("Select designation"),
      //   shiftId: Yup.object().nullable(),
      //   siteId: Yup.object().nullable().required("Select branch"),
      //   expectedSalary: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("Expected salary is required"),
      //   employeeWagesType: Yup.object()
      //     .nullable()
      //     .required("Select Employee Wages Type"),
      //   weeklyOffDay: Yup.object()
      //     .nullable()
      //     .required("Select Employee weekly off day"),
      //   wagesPerDay: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("Per day wages is required"),
      //   doj: Yup.string().trim().nullable().required("doj is required"),
      //   readyToWorkInThreeShift: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("Ready to work in 3 shifts Field is required"),
      //   readyToWorkInMonths: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("Ready to work in months Field is required"),
      //   bankName: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("Bank name is required"),
      //   branchName: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("Branch name is required"),
      //   accountNo: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("Account No. is required"),
      //   ifscCode: Yup.string()
      //     .trim()
      //     .nullable()
      //     .required("IFSC code is required"),
      //   pfNumber: Yup.string().trim().nullable().required("PF No. is required"),
      //   esiNumber: Yup.string().trim().nullable().required("ESI No. is required"),
      //   panNumber: Yup.string().trim().nullable().required("PAN No. is required"),
    }),

    // 5: Yup.object().shape({
    //   firstName: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("First Name is required"),
    //   middleName: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Middle name is required"),
    //   lastName: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Last name is required"),
    //   fullAddress: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Address is required"),
    //   mobileNumber: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Mobile No. is required"),
    //   gender: Yup.string().trim().nullable().required("Gender is required"),
    //   dob: Yup.string().trim().nullable().required("DOB is required"),
    //   age: Yup.string().trim().nullable().required("Required"),
    //   religion: Yup.string().trim().nullable().required("Religion is required"),
    //   cast: Yup.string().trim().nullable().required("Cast is required"),
    //   reasonToJoin: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Reason is required"),
    //   marriageStatus: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Marital status is required"),
    //   isSpecks: Yup.string().trim().nullable().required("Field is required"),
    //   isDisability: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Field is required"),
    //   disabilityDetails: Yup.string().when("isDisability", {
    //     is: (value) => value && value === "true",
    //     then: Yup.string()
    //       .trim()
    //       .nullable()
    //       .required("Disability Issue required"),
    //   }),
    //   isInjured: Yup.string().trim().nullable().required("Field is required"),
    //   injureDetails: Yup.string().when("isInjured", {
    //     is: (value) => value && value == "true",
    //     then: Yup.string()
    //       .trim()
    //       .nullable()
    //       .required("Injured Details required"),
    //   }),
    //   hobbies: Yup.string().trim().nullable().required("Hobbie is required"),
    //   policeCaseDetails: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Details is required"),
    //   companyId: Yup.object().nullable().required("Select Employee Type"),
    //   employeeWagesType: Yup.object()
    //     .nullable()
    //     .required("Select Employee Type"),
    //   weeklyOffDay: Yup.object()
    //     .nullable()
    //     .required("Select Employee weekly off day"),
    //   designationId: Yup.object().nullable().required("Select designation"),
    //   shiftId: Yup.object().nullable(),
    //   siteId: Yup.object().nullable().required("Select branch"),
    //   expectedSalary: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Expected salary is required"),
    //   // wagesPerDay: Yup.string()
    //   //   .trim()
    //   //   .nullable()
    //   //   .required("Per day wages is required"),
    //   doj: Yup.string().trim().nullable().required("doj is required"),
    //   readyToWorkInThreeShift: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Field is required"),
    //   readyToWorkInMonths: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Field is required"),
    //   bankName: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Bank name is required"),
    //   branchName: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Branch name is required"),
    //   accountNo: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("Account No. is required"),
    //   ifscCode: Yup.string()
    //     .trim()
    //     .nullable()
    //     .required("IFSC code is required"),
    //   pfNumber: Yup.string().trim().nullable().required("PF No. is required"),
    //   esiNumber: Yup.string().trim().nullable().required("ESI No. is required"),
    //   panNumber: Yup.string().trim().nullable().required("PAN No. is required"),
    // }),
  };

  useEffect(() => {
    getCompanyOptions();
    getBranchOptions();
    getDesignationOptions();
    getShiftOptions();
    getDocumentOptions();
    getReportingManagers();
    getDepartmentList();
  }, []);

  const goToNextPage = (values) => {
    setinit_val(values);
    setStep(step + 1);
  };

  const addEducationList = (education, setFieldValue) => {
    let {
      e_institutionName,
      e_qualification,
      e_university,
      e_year,
      e_grade,
      e_percentage,
    } = education;
    if (e_qualification != "" && e_year != "") {
      let prod_data = {
        institutionName: e_institutionName,
        qualification: e_qualification,
        university: e_university,
        year: e_year,
        grade: e_grade,
        percentage: e_percentage,
      };

      let old_lst = educationlist;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.institutionName === prod_data.institutionName) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...educationlist, prod_data];
      }
      setEducationList(final_state);
      setFieldValue("e_institutionName", "");
      setFieldValue("e_qualification", "");
      setFieldValue("e_university", "");
      setFieldValue("e_year", "");
      setFieldValue("e_grade", "");
      setFieldValue("e_percentage", "");
    }
  };
  // handle click event of the Remove button
  const removeEducationList = (index) => {
    const list = [...educationlist];
    list.splice(index, 1);
    setEducationList(list);
  };
  const addFamilyList = (family, setFieldValue) => {
    let { f_fullName, f_age, f_relation, f_education, f_business, f_dob } =
      family;
    if (f_fullName != "" && f_relation != "") {
      let prod_data = {
        fullName: f_fullName,
        age: f_age,
        relation: f_relation,
        education: f_education,
        business: f_business,
        dob: f_dob,
      };

      let old_lst = familylist;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.fullName === prod_data.fullName) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...familylist, prod_data];
      }
      setFamilyList(final_state);
      setFieldValue("f_fullName", "");
      setFieldValue("f_age", "");
      setFieldValue("f_relation", "");
      setFieldValue("f_education", "");
      setFieldValue("f_business", "");
      setFieldValue("f_dob", "");
    }
  };
  // handle click event of the Remove button
  const removeFamilyList = (index) => {
    const list = [...familylist];
    list.splice(index, 1);
    setFamilyList(list);
  };
  const addDocumentList = (document, setFieldValue) => {
    let { d_documentId, d_imagePath } = document;
    if (d_documentId != "" && d_imagePath != "") {
      let prod_data = {
        d_documentId: d_documentId,
        imagePath: d_imagePath,
      };

      let old_lst = [...documentlist];
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.d_documentId === prod_data.d_documentId) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...documentlist, prod_data];
      }
      setDocumentList(final_state);
      setFieldValue("d_documentId", "");
      setFieldValue("d_imagePath", "");
    }
  };
  // handle click event of the Remove button
  const removeDocumentList = (index) => {
    const list = [...documentlist];
    list.splice(index, 1);
    setDocumentList(list);
  };

  const addExperienceList = (experience, setFieldValue) => {
    let {
      experience_companyName,
      experience_fromMonthYear,
      experience_toMonthYear,
      experience_designationName,
      experience_lastDrawnSalary,
      experience_reasonToResign,
    } = experience;
    if (
      experience_companyName != "" &&
      experience_fromMonthYear != "" &&
      experience_toMonthYear != ""
    ) {
      let prod_data = {
        companyName: experience_companyName,
        fromMonthYear: experience_fromMonthYear,
        toMonthYear: experience_toMonthYear,
        designationName: experience_designationName,
        lastDrawnSalary: experience_lastDrawnSalary,
        reasonToResign: experience_reasonToResign,
      };
      let old_lst = experiencelist;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.companyName === prod_data.companyName) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...experiencelist, prod_data];
      }
      setExperienceList(final_state);
      setFieldValue("experience_companyName", "");
      setFieldValue("experience_fromMonthYear", "");
      setFieldValue("experience_toMonthYear", "");
      setFieldValue("experience_designationName", "");
      setFieldValue("experience_lastDrawnSalary", "");
      setFieldValue("experience_reasonToResign", "");
    }
  };
  // handle click event of the Remove button
  const removeExperienceList = (index) => {
    const list = [...experiencelist];
    list.splice(index, 1);
    setExperienceList(list);
  };

  const addReferenceList = (reference, setFieldValue) => {
    let { r_name, r_address, r_business, r_mobileNumber } = reference;
    if (r_name != "" && r_address != "") {
      let prod_data = {
        name: r_name,
        address: r_address,
        business: r_business,
        mobileNumber: r_mobileNumber,
      };

      let old_lst = referencelist;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.address === prod_data.address) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...referencelist, prod_data];
      }
      setReferenceList(final_state);
      setFieldValue("r_name", "");
      setFieldValue("r_address", "");
      setFieldValue("r_business", "");
      setFieldValue("r_mobileNumber", "");
    }
  };
  // handle click event of the Remove button
  const removeReferenceList = (index) => {
    const list = [...referencelist];
    list.splice(index, 1);
    setReferenceList(list);
  };

  //get Document List for selection and send the id in request
  const getDocumentOptions = () => {
    listOfDocument()
      .then((response) => {
        // console.log("i am in ", response.data.response)
        let res = response.data;
        if (res.responseStatus == 200) {
          let options = res.response.map(function (data) {
            return {
              value: parseInt(data.id),
              label: data.documentName,
            };
          });
          setDocument_opt(options);
        }
      })
      .catch((error) => {
        openModal(error, "error");
      });
  };

  //get Reporting Managers List for selection and send the id in request
  const getReportingManagers = () => {
    listOfManagers()
      .then((response) => {
        // console.log("i am in ", response.data.response)
        let res = response.data;
        if (res.responseStatus == 200) {
          let options = res.responseObject.map(function (data) {
            return {
              value: data.id,
              id: data.id,
              label: data.name,
            };
          });
          setManagers_opt(options);
        }
      })
      .catch((error) => {
        openModal(error, "error");
      });
  };

  //get Company List for selection and send the id in request
  const getCompanyOptions = () => {
    listOfCompany()
      .then((response) => {
        // console.log("i am in ", response.data.response)
        let res = response.data;
        if (res.responseStatus == 200) {
          let options = res.response.map(function (data) {
            return {
              value: data.id,
              label: data.companyName,
            };
          });
          setCompany_opt(options);
        }
      })
      .catch((error) => {
        openModal(error, "error");
      });
  };

  //get Branch List for selection and send the id in request
  const getBranchOptions = () => {
    listOfBranch()
      .then((response) => {
        // console.log("i am in ", response.data.response)
        let res = response.data;
        if (res.responseStatus == 200) {
          let options = res.response.map(function (data) {
            return {
              value: data.id,
              label: data.branchName,
            };
          });
          setBranch_opt(options);
        }
      })
      .catch((error) => {
        openModal(error, "error");
      });
  };

  //get Designation List for selection and send the id in request
  const getDesignationOptions = () => {
    listOfDesignation()
      .then((response) => {
        // console.log("i am in ", response.data.response)
        let res = response.data;
        if (res.responseStatus == 200) {
          let options = res.response.map(function (data) {
            return {
              value: data.id,
              label: data.designationName,
            };
          });
          setDesignation_opt(options);
        }
      })
      .catch((error) => {
        openModal(error, "error");
      });
  };

  //get Shift List for selection and send the id in request
  const getShiftOptions = () => {
    listOfShifts()
      .then((response) => {
        // console.log("i am in ", response.data.response)
        let res = response.data;
        if (res.responseStatus == 200) {
          let options = res.response.map(function (data) {
            return {
              value: data.id,
              label: data.shiftName,
            };
          });
          setShift_opt(options);
        }
      })
      .catch((error) => {
        openModal(error, "error");
      });
  };

  //get Department List for selection 
  const getDepartmentList = () => {
    listOfDepartment()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let options = res.response.map(function (data) {
            return {
              value: data.id,
              label: data.departmentName,
            };
          });
          setDepartment_opt(options);
        }
      })
      .catch((error) => {
        openModal(error, "error");
      });
  };

  const addSalaryList = (salaryData, setFieldValue) => {
    let { s_id, s_effectiveDate, s_salary } = salaryData;
    if (s_effectiveDate != "" && s_salary != "") {
      let prod_data = {
        s_id: s_id,
        s_effectiveDate: s_effectiveDate,
        s_salary: s_salary,
      };

      let old_lst = salaryList;
      let is_updated = false;
      let final_state;
      final_state = old_lst.map((item) => {
        if (item.s_effectiveDate === prod_data.s_effectiveDate) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...salaryList, prod_data];
      }
      setSalaryList(final_state);
      setFieldValue("s_id", "");
      setFieldValue("s_effectiveDate", "");
      setFieldValue("s_salary", "");
    }
  };

  const editSalaryList = (key, salaryData, setFieldValue) => {
    let { s_id, s_effectiveDate, s_salary } = salaryData;
    if (s_effectiveDate != "" && s_salary != "") {
      let prod_data = {
        s_id: s_id,
        s_effectiveDate: s_effectiveDate,
        s_salary: s_salary,
      };

      setFieldValue("s_id", s_id);
      setFieldValue("s_effectiveDate", s_effectiveDate);
      setFieldValue("s_salary", s_salary);
    }
  };

  // handle click event of the Remove button

  const removeSalaryList = (index) => {
    const list = [...salaryList];
    list.splice(index, 1);
    setSalaryList(list);
  };

  return (
    <div>
      {/* Reusable Modal */}
      <ResponseModal
        isOpen={ResModal}
        onRequestClose={closeModal}
        onConfirm={() => handleConfirmSubmit()}
        text={`${ResText}`}
        LogoType={`${LogoType}`}
      />
      <div
        className="content-wrapper scrollable-div"
        style={{ position: "fixed", width: "95%" }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={init_val}
          validationSchema={VALIDATION[step]}
          onSubmit={(values, bug) => {
            console.log("i am in ", values);
            if (step < 4) {
              goToNextPage(values);
            } else {
              let formdata = new FormData();
              let req_doc = document_opt.filter((v) => {
                return v.required == true;
              });

              let doc_req = [];
              documentlist.map((v) => {
                if (v.d_documentId.required == true) {
                  doc_req.push(v.d_documentId);
                }
              });
              if (req_doc.length == doc_req.length) {
                if (
                  Object.entries(req_doc).toString() ===
                  Object.entries(doc_req).toString()
                ) {
                  let keys = Object.keys(init_val);
                  keys.map((v) => {
                    // console.log("v", v);
                    if (
                      values[v] != "" &&
                      v != "companyId" &&
                      v != "employeeWagesType" &&
                      v != "weeklyOffDay" &&
                      v != "designationId" &&
                      v != "shiftId" &&
                      v != "siteId" &&
                      v != "dob" &&
                      v != "doj"
                    ) {
                      formdata.append(v, values[v]);
                    }
                  });
                  formdata.append("firstName", values.firstName);
                  formdata.append("middleName", values.middleName);
                  formdata.append("lastName", values.lastName);
                  formdata.append("fullName", values.fullName);
                  formdata.append("gender", values.gender);
                  formdata.append("presentAddress", values.presentAddress);
                  formdata.append("permanentAddress", values.permanentAddress);
                  // formdata.append("correspondenceAddress", values.correspondenceAddress)
                  // formdata.append("mobileNumber", values.mobileNumber)
                  // formdata.append("dob", values.dob)
                  // formdata.append("age", values.age)
                  // formdata.append("religion", values.religion)
                  // formdata.append("cast", values.cast)
                  // formdata.append("reasonToJoin", values.reasonToJoin)
                  // formdata.append("marriageStatus", values.marriageStatus)
                  // formdata.append("height", values.height)
                  // formdata.append("weight", values.weight)
                  // formdata.append("bloodGroup", values.bloodGroup)
                  // formdata.append("employeeType", values.employeeType)
                  // formdata.append("isExperienceEmployee", values.isExperienceEmployee)
                  // formdata.append("isDisability", values.isDisability)
                  // formdata.append("disabilityDetails", values.disabilityDetails)
                  // formdata.append("isInjured", values.isInjured)
                  // formdata.append("injureDetails", values.injureDetails)
                  // formdata.append("hobbies", values.hobbies)
                  // formdata.append("empOfGeneration", values.empOfGeneration)
                  // formdata.append("companyId", values.company)
                  // formdata.append("branchId", values.branch)
                  // formdata.append("designationId", values.designation)
                  // formdata.append("shiftId", values.shift)
                  // formdata.append("wagesOptions", values.WageType)
                  // formdata.append("weeklyOffDay", values.WeeklyOffDay)
                  // formdata.append("expectedSalary", values.expectedSalary)
                  // formdata.append("effectiveDate", values.doj)
                  // formdata.append("doj", values.doj)
                  // formdata.append("wagesPerDay", values.WagesPerDay)
                  // formdata.append("bankName", values.BankName)
                  // formdata.append("branchName", values.BranchName)
                  // formdata.append("accountNo", values.AccountNumber)
                  // formdata.append("ifscCode", values.IFSC)
                  // formdata.append("pfNumber", values.pfNumber)
                  // formdata.append("esiNumber", values.esiNumber)
                  // formdata.append("panNumber", values.PanNumber)
                  // formdata.append("employeeHavePf", values.employeeHavePf)
                  // formdata.append("employeePf", values.employeePf)
                  // formdata.append("employeeHaveEsi", values.employeeHaveEsi)
                  // formdata.append("employeeEsi", values.employeeEsi)
                  // formdata.append("employeeHaveProfTax", values.employeeHaveProfTax)
                  // formdata.append("showSalarySheet", values.showSalarySheet)
                  // formdata.append("payrollOptToShow", values.payrollOptToShow)
                  formdata.append("marriageStatus", values.maritalStatus);
                  formdata.append(
                    "emergencyRelation",
                    values.emergencyRelation
                  );
                  formdata.append("emergencyContact", values.emergencyContact);
                  formdata.append(
                    "correspondenceAddress",
                    values.correspondenceAddress
                  );
                  formdata.append("mobileNumber", values.mobileNumber);
                  formdata.append("dob", values.dob);
                  formdata.append("age", values.age);
                  formdata.append("religion", values.religion);
                  formdata.append("cast", values.cast);
                  formdata.append("reasonToJoin", values.reasonToJoin);
                  // formdata.append("marriageStatus", values.marriageStatus);
                  formdata.append("height", values.height);
                  formdata.append("weight", values.weight);
                  formdata.append("bloodGroup", values.bloodGroup);
                  formdata.append("employeeType", values.employeeType);
                  formdata.append(
                    "isExperienceEmployee",
                    values.isExperienceEmployee
                  );
                  formdata.append("isDisability", values.isDisability);
                  formdata.append(
                    "disabilityDetails",
                    values.disabilityDetails
                  );
                  formdata.append("isInjured", values.isInjured);
                  formdata.append("injureDetails", values.injureDetails);
                  formdata.append("hobbies", values.hobbies);
                  formdata.append("empOfGeneration", values.empOfGeneration);
                  formdata.append("companyId", values.company);
                  formdata.append("branchId", values.branch);
                  formdata.append("reportingManagerId", values.manager);
                  formdata.append("designationId", values.designation);
                  formdata.append("shiftId", values.shift);
                  formdata.append("employeeWagesType", values.WageType);
                  formdata.append("wagesOptions", values.WageType);
                  formdata.append("weeklyOffDay", values.weekly);
                  formdata.append("expectedSalary", values.expectedSalary);
                  formdata.append("effectiveDate", values.doj);
                  formdata.append("doj", values.doj);
                  // formdata.append("wagesPerDay", values.WagesPerDay);
                  formdata.append("bankName", values.BankName);
                  formdata.append("branchName", values.BranchName);
                  formdata.append("departmentId", values.departmentId);
                  formdata.append("accountNo", values.AccountNumber);
                  formdata.append("krapin", values.krapin);
                  formdata.append("nssf", values.nssf);
                  formdata.append("nhif", values.nhif);
                  formdata.append("ifscCode", values.IFSC);
                  formdata.append("pfNumber", values.pfNumber);
                  formdata.append("esiNumber", values.esiNumber);
                  formdata.append("panNumber", values.PanNumber);
                  formdata.append("employeeHavePf", values.employeeHavePf);
                  formdata.append("employeePf", values.employeePf);
                  formdata.append("employeeHaveEsi", values.employeeHaveEsi);
                  formdata.append("employeeEsi", values.employeeEsi);
                  formdata.append(
                    "employeeHaveProfTax",
                    values.employeeHaveProfTax
                  );
                  formdata.append("showSalarySheet", values.showSalarySheet);
                  formdata.append("payrollOptToShow", values.payrollOptToShow);
                  formdata.append("healthIssues", values.healthIssues);
                  formdata.append("family", JSON.stringify(familylist));
                  formdata.append("education", JSON.stringify(educationlist));
                  formdata.append("reference", JSON.stringify(referencelist));
                  formdata.append("experience", JSON.stringify(experiencelist));
                  formdata.append("document", JSON.stringify(documentlist));
                  formdata.append("imageLength", documentlist.length);
                  for (let i = 0; i < documentlist.length; i++) {
                    formdata.append(
                      `document${i}`,
                      documentlist[i]["imagePath"]
                    );
                  }
                  createEmployee(formdata)
                    .then((response) => {
                      if (response.data.responseStatus === 200) {
                        openModal(response.data.message, "cnf");
                      } else {
                        // setSubmitting(false);
                        openModal(response.data.message, "error");
                      }
                    })
                    .catch((error) => {
                      openModal(error, "error");
                    });
                }
              } else {
                setIs_loading(false);
                openModal("Check the required documents", "error");
              }
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            submitForm,
          }) => (
            <Form className="empcreate-pg" enctype="multipart/form-data" onSubmit={handleSubmit}>
              {/* {JSON.stringify(values, undefined, 2)}
            {JSON.stringify(errors, undefined, 2)} */}
              <Tabs
                className="emptab mt-0"
                id="controlled-tab-example"
                activeKey={step}
                onSelect={(k) => {
                  setStep(parseInt(k));
                }}
              >
                <Tab
                  eventKey="1"
                  className="customeTab"
                  title="Personal Information"
                >
                  <Step1
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    errors={errors}
                    is_edit={false}
                    //Family Details
                    familylist={familylist}
                    addFamilyList={addFamilyList}
                    removeFamilyList={removeFamilyList}
                    //Education Details
                    educationlist={educationlist}
                    addEducationList={addEducationList}
                    removeEducationList={removeEducationList}
                    //Document List
                    document_opt={document_opt}
                    maritalstatusOpt={maritalstatusOpt}
                    //Document Details
                    addDocumentList={addDocumentList}
                    documentlist={documentlist}
                    removeDocumentList={removeDocumentList}
                    onBlur={handleBlur}
                    genderOpt={genderOpt}
                  />
                </Tab>
                <Tab
                  eventKey="2"
                  className="customeTab"
                  title="Referance Details"
                >
                  <Step2
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    errors={errors}
                    is_edit={false}
                    referencelist={referencelist}
                    addReferenceList={addReferenceList}
                    removeReferenceList={removeReferenceList}
                    onBlur={handleBlur}
                  />
                </Tab>

                <Tab
                  eventKey="3"
                  className="customeTab"
                  title="Experience Details"
                >
                  <Step3
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    errors={errors}
                    is_edit={false}
                    experiencelist={experiencelist}
                    addExperienceList={addExperienceList}
                    removeExperienceList={removeExperienceList}
                    onBlur={handleBlur}
                  />
                </Tab>

                <Tab
                  eventKey="4"
                  className="customeTab"
                  title="Other Information"
                >
                  <Step4
                    // handleChange={handleChange}
                    // setFieldValue={setFieldValue}
                    // values={values}
                    // errors={errors}
                    // is_edit={false}
                    company_opt={company_opt}
                    branch_opt={branch_opt}
                    managers_opt={managers_opt}
                    designation_opt={designation_opt}
                    shift_opt={shift_opt}
                    department_opt={department_opt}
                    wagesOpt={wagesOpt}
                    weeklyOffOpt={weeklyOffOpt}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    errors={errors}
                    is_edit={false}
                    onBlur={handleBlur}
                  />
                </Tab>

                {/* <Tab eventKey="5" className="customeTab" title="Payroll Number">
                  <Step5
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    errors={errors}
                    is_edit={false}
                    onBlur={handleBlur}
                  />
                </Tab> */}
              </Tabs>

              <Row>
                {console.log('Object.keys(errors): ', Object.keys(errors))}

                <Col md="12" style={{ marginLeft: "-120px" }}>
                  {step == 4 && Object.keys(errors).length > 0 ? (
                    <>
                      {/* <div className="text-center mb-2"></div>
                      <div className={"alert alert-danger"}>
                        Please fill-up below all fields
                        {Object.values(errors).map((v) => {
                          return <p>{v}</p>;
                        })}
                      </div> */}
                    </>
                  ) : (
                    ""
                  )}
                  {step != 1 && (
                    <>
                      <Button
                        className="mainbtn1 mr-4 btn backBtn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (step != 1) {
                            setStep(step - 1);
                          }
                        }}
                      >
                        Back
                      </Button>
                    </>
                  )}
                  {step != 4 && (
                    <Button
                      type="submit"
                      className="mainbtn1 text-white nextBtn"
                    >
                      Next
                    </Button>
                  )}

                  {step == 4 &&
                    (is_loading ? (
                      <>
                        <Button
                          type="submit"
                          className="mainbtn1 text-white nextBtn"
                          disabled={true}
                        >
                          <Spinner size="sm" color="secondary" />
                          <span>Loading</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="submit"
                        className="mainbtn1 text-white nextBtn"
                        onClick={(e) => {
                          e.preventDefault();
                          submitForm();
                        }}
                      >
                        Submit
                      </Button>
                    ))}

                  {/* <Button type="submit" className="btn btn-success">
                  Submit
                </Button> */}
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
