import React, { useEffect, useState } from "react";
import AddBtn from "../../assets/images/MenuButton.png";
import BackBtn from "../../assets/images/back.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Col,
    Row,
    Table,
    Tooltip,
    Form,
    Modal,
    Card,
    Button,
} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import edit from "../../assets/images/edit.png";
import Delete from "../../assets/images/delete.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
    AdvancePaymentsList,
    ApproveAdvancePayments,
    RejectAdvancePayments,
    deletePayment,
} from "@/services/api_functions";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
// import CustomDateInputs from "../../components/CustomDateInputs";
// import CustomInput from "../../components/CustomInputs";
// import { WithUserPermission } from "/helpers/WithUserPermission";
import CustomDateInputs from "../../components/CustomDateInputs";
import CustomInput from "../../components/CustomInputs";
import { WithUserPermission } from "../../helpers/WithUserPermission";
import {
    listOfDesignation,
    leaveReportList,
} from "../../services/api_functions";
import ResponseModal from "../../components/ResponseModal";
import CustomSelect from "../../components/CustomSelect";

function LeaveReportList(props) {
    const location = useLocation();
    const pathArray = location.pathname.split("/"); // Split the path into an array
    const name = pathArray[pathArray.length - 1]; // Get the last element of the array
    const [leavReportList, setLeaveReportList] = useState([]);
    const [filteredLeaveReportList, setFilteredLeaveReportList] = useState([]);
    const navigate = useNavigate();
    const [designation_opt, setDesignation_Opt] = useState([]);

    const [ResModal, setResModal] = useState(false);
    const [ResText, setResText] = useState(false);
    const [LogoType, setLogoType] = useState("");
    const [rowId, setrowId] = useState();

    const leaveStatus = [
        {
            value: "Pending",
            label: "Pending",
        },
        {
            value: "Approved",
            label: "Approved",
        },
        {
            value: "Rejected",
            label: "Rejected",
        },
    ];
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
        getDesignation();
    }, []);

    // List API Function
    const getleaveReportList = (values) => {
        let resquestdata = {
            fromDate: values.fromDate,
            toDate: values.toDate,
            leaveStatus: values.leaveStatus,
        };
        leaveReportList(resquestdata)
            .then((response) => {
                let res = response.data;
                if (res.responseStatus === 200) {
                    setLeaveReportList(res.response);
                    setFilteredLeaveReportList(res.response);
                }
            })
            .catch((error) => {
                openModal(error, "error");
                setLeaveReportList([]);
                setFilteredLeaveReportList([]);
            });
    };

    //get Level List for selection 
    const getDesignation = () => {
        listOfDesignation()
            .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                    let options = res.response.map(function (data) {
                        return {
                            value: data.id,
                            label: data.designationName,
                        };
                    });
                    setDesignation_Opt(options);
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

    return (
        <div>
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
                        <span className="bold">{location.pathname}</span>
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
                        validateOnBlur={false}
                        validateOnChange={false}
                        initialValues={{
                            fromDate: "",
                            toDate: "",
                            leaveStatus: ""
                        }}
                        validationSchema={Yup.object().shape({
                            fromDate: Yup.string().required(" "),
                            toDate: Yup.string().required(" "),
                            leaveStatus: Yup.string().required(" "),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            getleaveReportList(values);
                        }}
                        render={({
                            errors,
                            status,
                            touched,
                            isSubmitting,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                            values,
                            handleBlur,
                        }) => (
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
                                            <CustomSelect
                                                label="Select Leave Status"
                                                className={`form-control ${touched.leaveStatus && errors.leaveStatus
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                id="leaveStatus"
                                                name="leaveStatus"
                                                data={leaveStatus}
                                                value={values.leaveStatus}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-1">
                                        <div class="textOnInput">
                                            <Button
                                                style={{ marginTop: "30px" }}
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

                <div className=" scrollable-div-page">
                    <Row>
                        <Col className="list-table">
                            <Table className="table-hover">
                                <thead className="list-thead">
                                    <tr>
                                        <th className="table-th text-light">SR NO</th>
                                        <th className="table-th text-light">Employee Leave</th>
                                        <th className="table-th text-light">From Date</th>
                                        <th className="table-th text-light">To Date</th>
                                        <th className="table-th text-light">Total Days</th>
                                        <th className="table-th text-light">Leave Status</th>
                                        {/* <th className="table-th text-light">Employee Type</th> */}
                                        <th className="table-th text-light">Applied On</th>
                                        <th className="table-th text-light">Leave Tpe</th>
                                        <th className="table-th text-light">Reason</th>
                                        {/* <th className="table-th text-light">Company Type</th> */}
                                    </tr>
                                </thead>

                                <tbody style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    {filteredLeaveReportList.length > 0 ? (
                                        filteredLeaveReportList.map((v, i) => (
                                            <tr style={{ backgroundColor: "D9D9D9" }}>
                                                <td>{i + 1}</td>
                                                <td>{v.employeeName}</td>
                                                <td>{v.fromDate}</td>
                                                <td>{v.toDate}</td>
                                                <td>{v.totalDays}</td>
                                                <td>{v.leaveStatus}</td>
                                                {/* <td>{v.employeeType != "undefined" ? v.employeeType : ""}</td> */}
                                                <td>{v.appliedOn}</td>
                                                <td>{v.leaveType}</td>
                                                <td>{v.reason}</td>
                                                {/* <td>{v.companyType}</td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={12} className="text-center">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </Table>
                        </Col>
                    </Row>
                </div>
            </div>

        </div>
    );
}

export default WithUserPermission(LeaveReportList);
