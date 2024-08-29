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
import {
    faCheck,
    faXmark,
    faArrowRight,
    faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import edit from "../../assets/images/edit.png";
import Delete from "../../assets/images/delete.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    listOfAbsent,
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
    employeeLeave,
    updateEmployeeLeaveStatus,
} from "../../services/api_functions";
import ResponseModal from "../../components/ResponseModal";

function LeaveReport(props) {
    const location = useLocation();
    const pathArray = location.pathname.split("/"); // Split the path into an array
    const name = pathArray[pathArray.length - 1]; // Get the last element of the array
    const [absent, setAbsent] = useState([]);
    const [filteredAbsent, setFilteredAbsent] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const [showModalReject, setShowModalReject] = useState(false);
    const [RowId, setRowId] = useState([]);
    const [rowamt, setRowAmt] = useState([]);

    const [initVal, setInitVal] = useState("");
    const [Bankaccmodal, setBankaccmodal] = useState(false);
    const [SundryCreditorLst, setSundryCreditorLst] = useState([]);
    const [CashAcbankLst, setCashAcbankLst] = useState([]);
    const [resLst, setresLst] = useState([]);

    const [ResModal, setResModal] = useState(false);
    const [ResText, setResText] = useState(false);
    const [LogoType, setLogoType] = useState("");
    const [rowId, setrowId] = useState();
    const [MainData, setMainData] = useState();

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
        // getAbsentList();
    }, []);

    // List API Function
    const getAbsentList = (values) => {
        let resquestdata = {
            fromDate: values.fromDate,
            toDate: values.toDate,
        };
        listOfAbsent(resquestdata)
            .then((response) => {
                let res = response.data;
                if (res.responseStatus === 200) {
                    setAbsent(res.response.data);
                    setFilteredAbsent(res.response.data);
                }
            })
            .catch((error) => {
                openModal(error, "error");
                setAbsent([]);
                setFilteredAbsent([]);
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
                        }}
                        validationSchema={Yup.object().shape({
                            fromDate: Yup.string().trim().required(" "),
                            toDate: Yup.string().trim().required(" "),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            getAbsentList(values);
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
                                            <CustomDateInputs
                                                className={`form-control ${touched.fromDate && errors.fromDate
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                type="date"
                                                id="fromDate"
                                                label="From Date"
                                                name="fromDate"
                                                value={values.fromDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                max={getFormattedMaxDate()} 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-2 list-head-fields">
                                        <div class="textOnInput">
                                            <CustomDateInputs
                                                className={`form-control ${touched.toDate && errors.toDate
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                type="date"
                                                id="toDate"
                                                label="To Date"
                                                name="toDate"
                                                value={values.toDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                max={getFormattedMaxDate()} 
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
                        <Col className="tbl-list-absentemployee">
                            <Table className="table-hover">
                                <thead className="list-thead">
                                    <tr> <th className="table-th text-light"></th>
                                        <th className="table-th text-light">SR NO</th>
                                        <th className="table-th text-light">Date</th>
                                    </tr>
                                </thead>
                                { }
                                <tbody style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    {console.log("i am in", filteredAbsent)}
                                    {filteredAbsent.length > 0 ? (
                                        filteredAbsent.map((v, i) => (
                                            <>
                                                <tr style={{ backgroundColor: "D9D9D9" }}>
                                                    {v.emp_data && v.emp_data.length > 0 ? (
                                                        <td style={{ width: "2%" }}>
                                                            <div
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (parseInt(MainData) == parseInt(i))
                                                                        setMainData("");
                                                                    else {
                                                                        setMainData(i);
                                                                    }
                                                                    setShowModal(false);
                                                                }}
                                                                className="btn-arrow-style"
                                                            >
                                                                {parseInt(MainData) == parseInt(i) ? (
                                                                    <FontAwesomeIcon
                                                                        icon={faArrowDown}
                                                                    />
                                                                ) : (
                                                                    <FontAwesomeIcon
                                                                            icon={faArrowRight}
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <td>{""}</td>
                                                    )}
                                                    <td>{i + 1}</td>
                                                    <td>{v.date}</td>
                                                </tr>
                                                {v.emp_data != "" ? (
                                                    <tr>
                                                        <td
                                                            colSpan={24}
                                                            className="bg-white inner-tbl-td"
                                                        // style={{ padding: "0px" }}
                                                        >
                                                            <Table
                                                                bordered
                                                                responsive
                                                                size="sm"
                                                                className={`${parseInt(MainData) == parseInt(i)
                                                                    ? "mb-0"
                                                                    : "mb-0 d-none"
                                                                    }`}
                                                            >
                                                                <thead
                                                                    style={{
                                                                        background: "#FBF3D0",
                                                                    }}
                                                                    className="datastyle-head"
                                                                >
                                                                    <tr className="text-center">
                                                                        <th>Employee Id</th>
                                                                        <th>Employee Name</th>
                                                                        <th>Designation</th>
                                                                        <th>Level</th>
                                                                        <th>Mobile Number</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody
                                                                    style={{
                                                                        background: "#FEFCF3",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {v.emp_data &&
                                                                        v.emp_data.map((vi, ii) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>{vi.employeeId}</td>
                                                                                    <td>{vi.employeeName}</td>
                                                                                    <td>{vi.designation}</td>
                                                                                    <td>{vi.level}</td>
                                                                                    <td>{vi.mobileNumber}</td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                </tbody>
                                                            </Table>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    ""
                                                )}
                                            </>
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

export default WithUserPermission(LeaveReport);
