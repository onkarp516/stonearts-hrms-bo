import React, { useEffect, useState } from "react";
import AddBtn from "../../assets/images/MenuButton.png";
import BackBtn from "../../assets/images/back.png";
import { useLocation } from "react-router-dom";
import { Col, Row, Table, Form, Modal, Card, Button } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";
import edit from "../../assets/images/edit.png";
import Delete from "../../assets/images/delete.png";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import CustomInput from "../../components/CustomInputs";
import {
    manualAttendance,
    listOfEmployee,
    ManualAttendanceReport,
    listOfTeam
} from "@/services/api_functions";
import {
    OnlyEnterNumbers,
} from "@/helpers";
import moment from "moment";
import CustomDateInputs from "../../components/CustomDateInputs";
import CustomSelect from "../../components/CustomSelect";
import { isActionExist } from "../../helpers/constants";
import { WithUserPermission } from "../../helpers/WithUserPermission";
import ResponseModal from "../../components/ResponseModal";

function ManualAttendance(props) {
    console.log(props)
    const location = useLocation();
    const pathArray = location.pathname.split("/"); // Split the path into an array
    const name = pathArray[pathArray.length - 1]; // Get the last element of the array

    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const [showModalEdit, setShowModalEdit] = useState(false); // State to control the modal visibility
    const [ManualAttendance, setManualAttendance] = useState([]);
    const [filteredManualAttendance, setFilteredManualAttendance] = useState([]);
    const [manualattendanceObject, setManualAttendanceObject] = useState("");
    const [manualAttendanceOptData, setManualAttendanceOptData] = useState([]);
    const [empOpt, setEmpOpt] = useState([]);
    const [team_opt, setTeam_opt] = useState([]);
    const [Submitting, setSubmitting] = useState([]);
    const [ResModal, setResModal] = useState(false);
    const [ResText, setResText] = useState(false);
    const [LogoType, setLogoType] = useState("");
    const [rowId, setrowId] = useState();
    const [DeleteConfirmation, setDeleteConfirmation] = useState();
    const [DeleteId, setDeleteId] = useState()

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
        setDeleteConfirmation(false);
        setResText("");
        // navigate("/Dashboard/Tranx/receipt");
    };

    // Function to handle form submission with confirmation
    const handleConfirmSubmit = () => {
        // handleSubmit();
        // onDelete(rowId)
        closeModal(); // Close the modal after submission
    };
    // ... (other methods)

    useEffect(() => {
        getTeamOptions();
        getEmployeeList();
    }, []);


    //get Team List for selection and send the id in request
    const getTeamOptions = () => {
        listOfTeam()
            .then((response) => {
                // console.log("i am in ", response.data.response)
                let res = response.data;
                if (res.responseStatus == 200) {
                    let options = res.response.map(function (data) {
                        return {
                            value: data.id,
                            label: data.teamName,
                        };
                    });
                    setTeam_opt(options);
                }
            })
            .catch((error) => {
                openModal(error, "error");
            });
    };

    //get Employee List for selection 
    const getEmployeeList = () => {
        listOfEmployee()
            .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                    let options = res.response.map(function (data) {
                        return {
                            value: data.id,
                            label: data.employeeName,
                        };
                    });
                    setManualAttendanceOptData(options);
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

    //this function blocks the next coming date and gives option to select todays and previous dates and time only
    const getFormattedMaxDateTime = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
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
                style={{ position: "fixed", width: "96%" }}
            >
                <div className="pagePathLayout row">
                    <div className="col-lg-11 header-title">
                        <span className="bold" >{location.pathname}</span>
                    </div>
                </div>
                <div className="col-lg-12 path-label">
                    <span>{name}</span>
                </div>
                <div className="col-lg-12 path-label2">
                    <span>Manage All {name} Related Information</span>
                </div>
                <div>
                    <Formik
                        initialValues={{
                            employeeId: "",
                            teamId: "",
                            attendanceDate: "",
                            checkInTime: "",
                            checkOutTime: "",
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    employeeId: Yup.string().trim().required(" "),
                                    attendanceDate: Yup.string().trim().required(" "),
                                    checkInTime: Yup.string().trim().required(" "),
                                    checkOutTime: Yup.string().trim().required(" "),
                                })
                            }
                            onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {

                                var dateTime = moment(
                                    values.attendanceDate + " " + values.checkInTime,
                                    "YYYY-MM-DD HH:mm:ss"
                                ).format("YYYY-MM-DD HH:mm:ss");

                                values.checkInTime = dateTime;

                                if (values.checkOutTime != "") {
                                    var dateTime = moment(
                                        values.attendanceDate + " " + values.checkOutTime,
                                        "YYYY-MM-DD HH:mm:ss"
                                    ).format("YYYY-MM-DD HH:mm:ss");

                                    values.checkOutTime = dateTime;
                                }

                                let requestData = {
                                    employeeId: parseInt(values.employeeId),
                                    attendanceDate: moment(values.attendanceDate).format("YYYY-MM-DD"),
                                    checkInTime: values.checkInTime,
                                    checkOutTime: values.checkOutTime,
                                };
                                if (values.teamId) {
                                    requestData.teamId = parseInt(values.teamId);
                                }
                                // if (values.checkOutTime != "" && values.checkOutTime != null) {

                                //     requestData["checkOutTime"] = moment(
                                //         values.checkOutTime
                                //     ).format("HH:mm:ss");
                                // }

                                // if (
                                //     values.checkOutTime != "" &&
                                //     values.checkOutTime != null &&
                                //     values.checkInTime > values.checkOutTime
                                // ) {
                                //     // setIsLoading(false);
                                //     openModal("Checkout time is less than Checkin time", "error");
                                //     setFieldValue("checkOutTime", "");
                                // } else {
                                    console.log("request Data >>i am", JSON.stringify(requestData));
                                    manualAttendance(requestData)
                                        .then((response) => {
                                            console.log("response>>", response)
                                            if (response.data.responseStatus === 200) {
                                                setSubmitting(false);
                                                resetForm();
                                                openModal(response.data.message, "cnf");
                                                setShowModal(false)
                                            } else {
                                                setSubmitting(false);
                                                openModal(response.data.message, "error");
                                            }
                                        })
                                        .catch((error) => {
                                            openModal(error, "error");
                                            setSubmitting(false);
                                        });
                                // }
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                setFieldValue,
                                handleChange,
                                handleSubmit,
                                isSubmitting,
                                resetForm,
                                handleBlur,
                            }) => (
                            <Form noValidate onSubmit={handleSubmit} autoComplete="off">
                                <Row className="list-heading">
                                    <div className="col-lg-2 list-head-fields">
                                            <div class="textOnInput">
                                                <CustomSelect className={`form-control ${touched.employeeId && errors.employeeId ? 'is-invalid' : ''}`} type="text" id="employeeId"
                                                    name="employeeId"
                                                    data={manualAttendanceOptData}
                                                    label="Employee Name"
                                                    value={values.employeeId}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur} />
                                            </div>
                                        </div>
                                    <div className="col-lg-2 list-head-fields">
                                        <div class="textOnInput">
                                            <CustomSelect
                                                label="Team"
                                                placeholder="Select Team"
                                                className={`form-control ${errors.teamId
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                id="teamId"
                                                name="teamId"
                                                data={team_opt}
                                                value={values.teamId}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-2 list-head-fields">
                                            <div class="textOnInput">
                                                <CustomDateInputs className={`form-control ${touched.attendanceDate && errors.attendanceDate ? 'is-invalid' : ''}`}
                                                    type="date"
                                                    id="attendanceDate"
                                                    label="Attendance Date"
                                                    name="attendanceDate"
                                                    value={values.attendanceDate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    max={getFormattedMaxDate()} // Set the max attribute to block future dates
                                                />
                                            </div>
                                        </div>
                                    <div className="col-lg-2 list-head-fields">
                                            <div class="textOnInput">
                                                <CustomDateInputs className={`form-control ${touched.checkInTime && errors.checkInTime ? 'is-invalid' : ''}`}
                                                type="time"
                                                    id="checkInTime"
                                                    name="checkInTime"
                                                label="In Time (24 hrs)"
                                                    value={values.checkInTime}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    max={getFormattedMaxDateTime()} // Set the max attribute to block future dates
                                                />
                                            </div>
                                        </div>

                                    <div className="col-lg-2 list-head-fields">
                                            <div className="textOnInput">
                                                <CustomDateInputs
                                                    className={`form-control ${touched.checkOutTime && errors.checkOutTime ? 'is-invalid' : ''}`}
                                                type="time"
                                                    id="checkOutTime"
                                                    name="checkOutTime"
                                                label="Out Time (24 hrs)"
                                                    value={values.checkOutTime}
                                                onChange={handleChange}
                                                onBlur={handleBlur}

                                                // onChange={(e) => {
                                                //     // Extract the time part from the selected checkout datetime
                                                //     const selectedTime = e.target.value.split('T')[1];
                                                //     // Extract the date part from the check-in datetime
                                                //     const checkInDate = values.checkInTime.split('T')[0];
                                                //     // Combine the date part of check-in with the selected time for checkout
                                                //     const checkOutDateTime = `${checkInDate}T${selectedTime}`;
                                                //     // Update the state with the new checkout datetime
                                                //     handleChange({
                                                //         target: {
                                                //             id: 'checkOutTime',
                                                //             value: checkOutDateTime,
                                                //         }
                                                //     });
                                                //     // You might want to call the onBlur function here if necessary
                                                // }}
                                                // onBlur={(e) => {
                                                //     calculateTime(
                                                //         {
                                                //             checkInTime: values.checkInTime,
                                                //             checkOutTime: values.checkOutTime,
                                                //         },
                                                //         setFieldValue
                                                //     );
                                                // }}
                                                // min={values.checkInTime.split('T')[0]} // Set the minimum date to the selected check-in date
                                                // max={values.checkInTime.split('T')[0]} // Set the maximum date to the selected check-in date
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
                                                Submit
                                            </Button>


                                        </div>
                                    </div>
                                    </Row>
                                </Form>
                            )}
                    </Formik>
                </div>

                {/* <div
                    className=" scrollable-div-page"
                >
                    <Row>
                        <Col className="list-table">
                            <Table className="table-hover">
                                <thead className="list-thead">
                                    <tr>
                                        <th className="table-th text-light">SR NO</th>
                                        <th className="table-th text-light">Employee Name</th>
                                        <th className="table-th text-light">Attendance Date</th>
                                        <th className="table-th text-light">Check In</th>
                                        <th className="table-th text-light">Check Out</th>
                                        <th className="table-th text-light">Created Date</th>
                                    </tr>
                                </thead>

                                <tbody style={{ maxHeight: "300px", overflowY: "auto" }}
                                >
                                    {manualattendanceObject.length > 0 ? (
                                        manualattendanceObject.map((v, i, record) => (
                                            <tr style={{ backgroundColor: "D9D9D9" }} >
                                                <td>{i + 1}</td>
                                                <td>{v.employeeName}</td>
                                                <td>{moment(v.attendanceDate).format("DD-MM-yyyy")}</td>
                                                <td>{moment(v.checkInTime).format("HH:mm:ss")}</td>
                                                <td>{moment(v.checkOutTime).format("HH:mm:ss")}</td>
                                                <td>{v.actualWorkingHoursInMinutes}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="text-center">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div > */}
            </div >

        </div >
    );
}

export default WithUserPermission(ManualAttendance);