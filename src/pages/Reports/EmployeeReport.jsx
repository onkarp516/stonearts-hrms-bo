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
    employeeReportList,
} from "../../services/api_functions";
import ResponseModal from "../../components/ResponseModal";
import CustomSelect from "../../components/CustomSelect";

function EmployeeReport(props) {
    const location = useLocation();
    const pathArray = location.pathname.split("/"); // Split the path into an array
    const name = pathArray[pathArray.length - 1]; // Get the last element of the array
    const [employeReportList, setEmployeeReportList] = useState([]);
    const [filteredEmployeeReportList, setFilteredEmployeeReportList] = useState([]);
    const navigate = useNavigate();
    const [designation_opt, setDesignation_Opt] = useState([]);

    const [ResModal, setResModal] = useState(false);
    const [ResText, setResText] = useState(false);
    const [LogoType, setLogoType] = useState("");
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
    const getemployeeReportList = (values) => {
        let resquestdata = {
            designation: values.designation,
        };
        employeeReportList(resquestdata)
            .then((response) => {
                let res = response.data;
                if (res.responseStatus === 200) {
                    setEmployeeReportList(res.response);
                    setFilteredEmployeeReportList(res.response);
                }
            })
            .catch((error) => {
                openModal(error, "error");
                setEmployeeReportList([]);
                setFilteredEmployeeReportList([]);
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
                            yearMonth: "",
                        }}
                        validationSchema={Yup.object().shape({
                            designation: Yup.string().required(" "),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            getemployeeReportList(values);
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
                                    <div className="col-lg-2 list-head-fields">
                                        <div class="textOnInput">
                                            <CustomSelect
                                                label="Designation"
                                                className={`form-control ${errors.designation
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                id="designation"
                                                name="designation"
                                                data={designation_opt}
                                                value={values.designation}
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
                                        <th className="table-th text-light">Employee ID</th>
                                        <th className="table-th text-light">Employee Name</th>
                                        <th className="table-th text-light">Mobile Number</th>
                                        <th className="table-th text-light">Designation</th>
                                        <th className="table-th text-light">Level</th>
                                        {/* <th className="table-th text-light">Employee Type</th> */}
                                        <th className="table-th text-light">Joining Date</th>
                                        <th className="table-th text-light">Basic Salary</th>
                                        <th className="table-th text-light">Date of Birth</th>
                                        {/* <th className="table-th text-light">Company Type</th> */}
                                    </tr>
                                </thead>

                                <tbody style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    {filteredEmployeeReportList.length > 0 ? (
                                        filteredEmployeeReportList.map((v, i) => (
                                            <tr style={{ backgroundColor: "D9D9D9" }}>
                                                <td>{i + 1}</td>
                                                <td>{v.employeeId}</td>
                                                <td>{v.employeeName}</td>
                                                <td>{v.mobileNumber}</td>
                                                <td>{v.designation}</td>
                                                <td>{v.level}</td>
                                                {/* <td>{v.employeeType != "undefined" ? v.employeeType : ""}</td> */}
                                                <td>{v.joiningDate}</td>
                                                <td>{v.basicSalary}</td>
                                                <td>{v.dob}</td>
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

export default WithUserPermission(EmployeeReport);
