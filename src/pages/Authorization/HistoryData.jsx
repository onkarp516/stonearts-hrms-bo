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
    ExportToExcelHistoryData,
    historyData,
} from "../../services/api_functions";
import ResponseModal from "../../components/ResponseModal";
import CustomSelect from "../../components/CustomSelect";

function HistoryData(props) {
    const location = useLocation();
    const pathArray = location.pathname.split("/"); // Split the path into an array
    const name = pathArray[pathArray.length - 1]; // Get the last element of the array
    const [historyDataList, setHistoryDataList] = useState([]);
    const [filteredHistoryDataList, setFilteredHistoryDataList] = useState([]);
    const navigate = useNavigate();

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
    }, []);

    // List API Function
    const gethistoryDataList = (values) => {
        let resquestdata = {
            fromDate: values.fromDate,
            toDate: values.toDate,
        };
        historyData(resquestdata)
            .then((response) => {
                let res = response.data;
                if (res.responseStatus === 200) {
                    setHistoryDataList(res.response);
                    setFilteredHistoryDataList(res.response);
                }
            })
            .catch((error) => {
                openModal(error, "error");
                setHistoryDataList([]);
                setFilteredHistoryDataList([]);
            });
    };
    // List API Function
    const exportToExcel = (values) => {
        let formData = new FormData();
        formData.append("fromDate", values.fromDate);
        formData.append("toDate", values.toDate);
        ExportToExcelHistoryData(formData)
            .then((response) => {
                let res = response.data;
                if (res.responseStatus === 200) {
                    // setHistoryDataList(res.response);
                    // setFilteredHistoryDataList(res.response);
                    alert("Success")
                }
            })
            .catch((error) => {
                openModal(error, "error");
                setHistoryDataList([]);
                setFilteredHistoryDataList([]);
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
                            fromDate: Yup.string().required(" "),
                            toDate: Yup.string().required(" "),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            gethistoryDataList(values);
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
                                    <div className="col-lg-2">
                                        <div class="textOnInput">
                                            <Button
                                                style={{ marginTop: "30px" }}
                                                className="modal-submit-btn"
                                                disabled={!values.fromDate || !values.toDate} // Disable if either fromDate or toDate is empty
                                                onClick={() => exportToExcel(values)}

                                            >
                                                Export to Excel
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
                                        <th className="table-th text-light">Employee Name</th>
                                        <th className="table-th text-light">Designation</th>
                                        <th className="table-th text-light">Level</th>
                                        <th className="table-th text-light">Attendance Date</th>
                                        <th className="table-th text-light">In Time</th>
                                        <th className="table-th text-light">Out Time</th>
                                    </tr>
                                </thead>

                                <tbody style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    {filteredHistoryDataList.length > 0 ? (
                                        filteredHistoryDataList.map((v, i) => (
                                            <tr style={{ backgroundColor: "D9D9D9" }}>
                                                <td>{i + 1}</td>
                                                <td>{v.employeeName}</td>
                                                <td>{v.designation}</td>
                                                <td>{v.level}</td>
                                                <td>{v.attendanceDate}</td>
                                                <td> {moment(v.inTime).format("HH:mm:ss")}</td>
                                                <td> {v.outTime != "NA" ? moment(v.outTime).format("HH:mm:ss") : "NA"}</td>
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

export default WithUserPermission(HistoryData);
