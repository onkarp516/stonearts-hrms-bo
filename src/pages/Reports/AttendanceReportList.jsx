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
    Table,
} from "react-bootstrap";

import moment from "moment";
import { Tab, Tabs } from "react-bootstrap";
// import Step1 from "./Steps/Step1";
// import Step2 from "./Steps/Step2";
// import Step3 from "./Steps/Step3";
// import Step4 from "./Steps/Step4";
// import Step5 from "./Steps/Step5";

import { EMAILREGEXP, MPINREGEXP, SUPPORTED_FORMATS_PDF } from "@/helpers";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import {
    listOfEmployee,
    attendanceReportEmployee,
    attendanceReportBranch,
    listOfBranch
} from "@/services/api_functions";
import ResponseModal from "../../components/ResponseModal";
import CustomDateInputs from "../../components/CustomDateInputs";
import CustomSelect from "../../components/CustomSelect";
import CustomInput from "../../components/CustomInputs";


export default function PunchIn(props) {
    const location = useLocation();
    const pathArray = location.pathname.split("/"); // Split the path into an array
    const name = pathArray[pathArray.length - 1]; // Get the last element of the array
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [ResModal, setResModal] = useState(false);
    const [ResText, setResText] = useState("");
    const [LogoType, setLogoType] = useState("");
    const [rowId, setrowId] = useState();
    const [employeeOptData, setEmployeeOptData] = useState([]);
    const [attendanceDataEmployee, setAttendanceDataEmployee] = useState([]);
    const [branchOptData, setBranchOptData] = useState([]);
    const [attendanceDataBranch, setAttendanceDataBranch] = useState([]);
    const [employeeId, setEmployeeId] = useState("");
    const [yo, setyo] = useState([""]);

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
        // navigate("/Dashboard/Master/employee");
    };

    // Function to handle form submission with confirmation
    const handleConfirmSubmit = () => {
        // handleSubmit();
        // onDelete(rowId)
        closeModal(); // Close the modal after submission
    };
    // ... (other methods)




    useEffect(() => {
        getEmployeeList();
        getBranchOptions();
    }, []);

    //get Employee List for selection 
    const getEmployeeList = () => {
        listOfEmployee()
            .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                    let result = res.response;
                    let options = [
                        {
                            value: "all",
                            label: "All",
                        },
                    ];

                    result.forEach((data) => {
                        options.push({
                            value: data.id,
                            label: data.employeeName,
                        });
                    });
                    setEmployeeOptData(options);
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
                let res = response.data;
                if (res.responseStatus == 200) {

                    let result = res.response;
                    let options = [
                        {
                            value: "all",
                            label: "All",
                        },
                    ];

                    result.forEach((data) => {
                        options.push({
                            value: data.id,
                            label: data.branchName,
                        });
                    });
                    setBranchOptData(options);
                }
            })
            .catch((error) => {
                openModal(error, "error");
            });
    };

    //this function blocks the next coming date and gives option to select todays and previous dates only
    const getFormattedMaxDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getAllAttendanceOfEmployee = (values) => {
        let requestData = {
            fromDate: values.fromDate,
            employeeId: values.employeeId === "all" ? "" : values.employeeId,
            attStatus: values.attStatus,
            toDate: values.toDate
        };

        setyo(requestData);
        attendanceReportEmployee(requestData)
            .then((response) => {
                var result = response.data;

                if (result.responseStatus === 200) {
                    setAttendanceDataEmployee(result.response);
                } else {
                    openModal("No Data Found", "error");
                }
            })
            .catch((error) => {
                openModal(error + "error");
            });
    }

    const getAllAttendanceOfBranch = (values) => {
        let requestData = {
            fromDate: values.fromDate,
            branchId: values.branchId === "all" ? "" : values.branchId,
            attStatus: values.attStatus,
            toDate: values.toDate
        };

        setyo(requestData);
        attendanceReportBranch(requestData)
            .then((response) => {
                var result = response.data;

                if (result.responseStatus === 200) {
                    setAttendanceDataBranch(result.response);
                } else {
                    openModal("No Data Found", "error");
                }
            })
            .catch((error) => {
                openModal(error + "error");
            });
    }


    return (


        <div
            className="content-wrapper scrollable-div"
            style={{ position: "fixed", width: "96%" }}
        >
            {/* Reusable Modal */}
            <ResponseModal
                isOpen={ResModal}
                onRequestClose={closeModal}
                onConfirm={() => handleConfirmSubmit()}
                text={`${ResText}`}
                LogoType={`${LogoType}`}
            />
            <Formik
                enableReinitialize={true}
                // initialValues={init_val}
                // validationSchema={VALIDATION[step]}
                onSubmit={(values, bug) => {
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
                    <div className="empcreate-pg" onSubmit={handleSubmit}>
                        <div className="pagePathLayout row">
                            <div className="col-lg-11 header-title">
                                <span className="bold">{location.pathname}</span>
                            </div>
                            {/* <div className="col-lg-1">
                  <Link to="/Dashboard/Master/company-create">
                    <img src={AddBtn} alt="" className="btn-add " />
                  </Link>
                </div> */}
                        </div>
                        <div className="col-lg-12 path-label">
                            <span>{name}</span>
                        </div>
                        <div className="col-lg-12 path-label2">
                            <span>Manage All {name} Related Information</span>
                        </div>

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
                                title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Employee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                            >
                                <div>

                                    {/* Reusable Modal */}
                                    <ResponseModal
                                        isOpen={ResModal}
                                        onRequestClose={closeModal}
                                        onConfirm={() => handleConfirmSubmit()}
                                        text={`${ResText}`}
                                        LogoType={`${LogoType}`}
                                    />
                                    <div>
                                        <Formik
                                            validateOnBlur={false}
                                            validateOnChange={false}
                                            initialValues={{
                                                fromDate: "",
                                                employeeId: "",
                                                attStatus: "",
                                                toDate: ""
                                            }}
                                            validationSchema={Yup.object().shape({
                                                fromDate: Yup.string().trim().required(" "),
                                                toDate: Yup.string().trim().required(" "),
                                                employeeId: Yup.string().required(" "),
                                            })}
                                            onSubmit={(values, { setSubmitting }) => {
                                                getAllAttendanceOfEmployee(values)
                                            }}
                                            render={({ errors, status, touched, isSubmitting, handleChange, handleSubmit, setFieldValue, values, handleBlur }) => (
                                                <Form onSubmit={handleSubmit}>
                                                    <Row className="list-heading">
                                                        <div className="col-lg-2 list-head-fields" >
                                                            <div class="textOnInput">
                                                                <CustomDateInputs className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`}
                                                                    type="date"
                                                                    id="fromDate"
                                                                    label="From Date"
                                                                    name="fromDate"
                                                                    value={values.fromDate}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    max={getFormattedMaxDate()} // Set the max attribute to block future dates
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 list-head-fields" >
                                                            <div class="textOnInput">
                                                                <CustomDateInputs className={`form-control ${errors.toDate ? 'is-invalid' : ''}`}
                                                                    type="date"
                                                                    id="toDate"
                                                                    label="To Date"
                                                                    name="toDate"
                                                                    value={values.toDate}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    max={getFormattedMaxDate()} // Set the max attribute to block future dates
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-2 list-head-fields" >
                                                            <div class="textOnInput">
                                                                <CustomSelect className={`form-control ${errors.employeeId ? 'is-invalid' : ''}`}
                                                                    type="text"
                                                                    id="employeeId"
                                                                    name="employeeId"
                                                                    data={employeeOptData}
                                                                    label="Employee Name"
                                                                    value={values.employeeId}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isSearchable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-1">
                                                            <div class="textOnInput">

                                                                <Button
                                                                    style={{ marginTop: '30px' }}
                                                                    className="modal-submit-btn"
                                                                    type="submit"
                                                                >
                                                                    Show
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                </Form>
                                            )}
                                        />
                                    </div>
                                    <div
                                            className="scrollable-div-page-tabs"
                                        >
                                            <Row>
                                                <Col className="list-table">
                                                    <Table className="table-hover">
                                                        <thead className="list-thead">
                                                            <tr>
                                                                {/* <th className="table-th text-light"></th> */}
                                                                <th className="table-th text-light">Sr.No.</th>
                                                                <th className="table-th text-light">Employee Name</th>
                                                                <th className="table-th text-light">Designation</th>
                                                                <th className="table-th text-light">Level</th>
                                                                <th className="table-th text-light">Company</th>
                                                                <th className="table-th text-light">Branch Name</th>
                                                                <th className="table-th text-light">Attendance Date</th>
                                                                <th className="table-th text-light">In Time</th>
                                                                <th className="table-th text-light">P-In Status</th>
                                                                <th className="table-th text-light">Out Time</th>
                                                                <th className="table-th text-light">P-Out Status</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                            {attendanceDataEmployee.length > 0 ? (attendanceDataEmployee &&
                                                                attendanceDataEmployee.map((v, i) => {
                                                                    return (
                                                                        <>
                                                                            <tr>
                                                                                <td>{i + 1}</td>
                                                                                <td>{v.employeeName}</td>
                                                                                <td>{v.designation}</td>
                                                                                <td>{v.level}</td>
                                                                                <td>{v.company}</td>
                                                                                <td>{v.branch}</td>
                                                                                <td>{v.attendanceDate}</td>
                                                                                <td>{v.checkInTime != "" ? (
                                                                                    <>
                                                                                        {moment(v.checkInTime).format("HH:mm:ss")}
                                                                                    </>
                                                                                ) : (
                                                                                    ""
                                                                                )}</td>
                                                                                <td>{v.punchInStatus}</td>
                                                                                <td> {v.checkOutTime != "" ? (
                                                                                    <>
                                                                                        {moment(v.checkOutTime).format("HH:mm:ss")}
                                                                                    </>
                                                                                ) : (
                                                                                    ""
                                                                                )}</td>
                                                                                <td>{v.punchOutStatus}</td>
                                                                            </tr>
                                                                        </>
                                                                    );
                                                                })
                                                            ) : <tr>
                                                                <td colSpan={14} className="text-center">
                                                                    No Data Found
                                                                </td>
                                                            </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </div>

                                    {/* <div
                                        className="content-wrapper scrollable-div"
                                        style={{ position: "fixed", width: "92%", marginLeft: "20px", marginTop: "0px" }}
                                    >
                                        
                                    </div> */}
                                </div>
                            </Tab>
                            <Tab
                                eventKey="2"
                                className="customeTab"
                                title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Branch&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                            >
                                <div>

                                    {/* Reusable Modal */}
                                    <ResponseModal
                                        isOpen={ResModal}
                                        onRequestClose={closeModal}
                                        onConfirm={() => handleConfirmSubmit()}
                                        text={`${ResText}`}
                                        LogoType={`${LogoType}`}
                                    />
                                    <div>
                                        <Formik
                                            validateOnBlur={false}
                                            validateOnChange={false}
                                            initialValues={{
                                                fromDate: "",
                                                branchId: "",
                                                attStatus: "",
                                                toDate: ""
                                            }}
                                            validationSchema={Yup.object().shape({
                                                fromDate: Yup.string().trim().required(" "),
                                                toDate: Yup.string().trim().required(" "),
                                                branchId: Yup.string().required(" "),
                                            })}
                                            onSubmit={(values, { setSubmitting }) => {
                                                getAllAttendanceOfBranch(values)
                                            }}
                                            render={({ errors, status, touched, isSubmitting, handleChange, handleSubmit, setFieldValue, values, handleBlur }) => (
                                                <Form onSubmit={handleSubmit}>
                                                    <Row className="list-heading">
                                                        <div className="col-lg-2 list-head-fields" >
                                                            <div class="textOnInput">
                                                                <CustomDateInputs className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`}
                                                                    type="date"
                                                                    id="fromDate"
                                                                    label="From Date"
                                                                    name="fromDate"
                                                                    value={values.fromDate}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    max={getFormattedMaxDate()} // Set the max attribute to block future dates
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 list-head-fields" >
                                                            <div class="textOnInput">
                                                                <CustomDateInputs className={`form-control ${errors.toDate ? 'is-invalid' : ''}`}
                                                                    type="date"
                                                                    id="toDate"
                                                                    label="To Date"
                                                                    name="toDate"
                                                                    value={values.toDate}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    max={getFormattedMaxDate()} // Set the max attribute to block future dates
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-2 list-head-fields" >
                                                            <div class="textOnInput">
                                                                <CustomSelect className={`form-control ${errors.branchId ? 'is-invalid' : ''}`}
                                                                    type="text"
                                                                    id="branchId"
                                                                    name="branchId"
                                                                    data={branchOptData}
                                                                    label="Branch"
                                                                    value={values.branchId}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isSearchable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-1">
                                                            <div class="textOnInput">

                                                                <Button
                                                                    style={{ marginTop: '30px' }}
                                                                    className="modal-submit-btn"
                                                                    type="submit"
                                                                >
                                                                    Show
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                </Form>
                                            )}
                                        />
                                    </div>
                                    <div
                                            className="scrollable-div-page-tabs"
                                        >
                                            <Row>
                                                <Col className="list-table">
                                                    <Table className="table-hover">
                                                        <thead className="list-thead">
                                                            <tr>
                                                                {/* <th className="table-th text-light"></th> */}
                                                                <th className="table-th text-light">Sr.No.</th>
                                                                <th className="table-th text-light">Employee Name</th>
                                                                <th className="table-th text-light">Designation</th>
                                                                <th className="table-th text-light">Level</th>
                                                                <th className="table-th text-light">Company</th>
                                                                <th className="table-th text-light">Branch Name</th>
                                                                <th className="table-th text-light">Attendance Date</th>
                                                                <th className="table-th text-light">In Time</th>
                                                                <th className="table-th text-light">P-In Status</th>
                                                                <th className="table-th text-light">Out Time</th>
                                                                <th className="table-th text-light">P-Out Status</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                            {attendanceDataBranch.length > 0 ? (attendanceDataBranch &&
                                                                attendanceDataBranch.map((v, i) => {
                                                                    return (
                                                                        <>
                                                                            <tr>
                                                                                <td>{i + 1}</td>
                                                                                <td>{v.employeeName}</td>
                                                                                <td>{v.designation}</td>
                                                                                <td>{v.level}</td>
                                                                                <td>{v.company}</td>
                                                                                <td>{v.branch}</td>
                                                                                <td>{v.attendanceDate}</td>
                                                                                <td>{v.checkInTime != "" ? (
                                                                                    <>
                                                                                        {moment(v.checkInTime).format("HH:mm:ss")}
                                                                                    </>
                                                                                ) : (
                                                                                    ""
                                                                                )}</td>
                                                                                <td>{v.punchInStatus}</td>
                                                                                <td> {v.checkOutTime != "" ? (
                                                                                    <>
                                                                                        {moment(v.checkOutTime).format("HH:mm:ss")}
                                                                                    </>
                                                                                ) : (
                                                                                    ""
                                                                                )}</td>
                                                                                <td>{v.punchOutStatus}</td>
                                                                            </tr>
                                                                        </>
                                                                    );
                                                                })
                                                            ) : <tr>
                                                                <td colSpan={14} className="text-center">
                                                                    No Data Found
                                                                </td>
                                                            </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </div>

                                    {/* <div
                                        className="content-wrapper scrollable-div"
                                        style={{ position: "fixed", width: "92%", marginLeft: "20px", marginTop: "0px" }}
                                    >
                                        
                                    </div> */}
                                </div>
                            </Tab>

                        </Tabs>
                    </div>
                )}
            </Formik>
        </div>

    );
}
