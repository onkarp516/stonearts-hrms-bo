import React, { useEffect, useState } from "react";
import AddBtn from "../../assets/images/MenuButton.png";
import BackBtn from "../../assets/images/back.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Row, Table, Form, Modal, Card, Button } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import moment from "moment";
import { isActionExist } from "../../helpers/constants";
import ResponseModal from "../../components/ResponseModal";
import { WithUserPermission } from "../../helpers/WithUserPermission";
import { listOfTeamAttendance } from "@/services/api_functions";

function Self(props) {
    const location = useLocation();
    const pathArray = location.pathname.split("/"); // Split the path into an array
    const name = pathArray[pathArray.length - 1]; // Get the last element of the array
    const [team, setTeam] = useState([]);
    const [filteredTeam, setFilteredTeam] = useState([]);


    const [ResModal, setResModal] = useState(false);
    const [ResText, setResText] = useState(false);
    const [LogoType, setLogoType] = useState("");

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
        getTeamList();
    }, []);

    const getTeamList = () => {
        listOfTeamAttendance().then((response) => {
            let res = response.data;
            if (res.responseStatus === 200) {
                setTeam(res.response);
                setFilteredTeam(res.response);
            }
        })
            .catch((error) => {
                openModal(error, "error");
                setTeam([]);
                setFilteredTeam([]);
            })
    }

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

                <div
                    className=" scrollable-div-page"
                >
                    <Row>
                        <Col className="list-table">
                            <Table className="table-hover">
                                <thead className="list-thead">
                                    <tr>
                                        <th className="table-th text-light">SR NO</th>
                                        <th className="table-th text-light">Designation</th>
                                        <th className="table-th text-light">Level</th>
                                        <th className="table-th text-light">Employee Name</th>
                                        <th className="table-th text-light">Attendance Date</th>
                                        <th className="table-th text-light">In Time</th>
                                        <th className="table-th text-light">P-In Image</th>
                                        <th className="table-th text-light">P-In Approve</th>
                                        <th className="table-th text-light">Out Time</th>
                                        <th className="table-th text-light">P-Out Image</th>
                                        <th className="table-th text-light">P-Out Approve</th>
                                    </tr>
                                </thead>
                                <tbody style={{ maxHeight: "300px", overflowY: "auto" }}
                                >
                                    {filteredTeam.length > 0 ? (
                                        filteredTeam.map((v, i, record) => (
                                            <tr style={{ backgroundColor: "D9D9D9" }} >
                                                <td>{i + 1}</td>
                                                <td>{v.designation}</td>
                                                <td>{v.level}</td>
                                                <td>{v.employeeName}</td>
                                                <td>
                                                    {/* {v.createdDate} */}
                                                    {moment(v.attendanceDate).format("DD-MM-yyyy")}
                                                </td>
                                                <td>{v.punchInTime != "NA" ? moment(v.punchInTime).format("HH:mm:ss") : ""}</td>
                                                <td>
                                                    {v.punchInImage !== "NA" && (
                                                        <img src={v.punchInImage} alt="Punch In" style={{ maxWidth: "100px" }} />
                                                    )}
                                                </td>
                                                <td>{v.pInApprove}</td>
                                                <td>{v.punchOutTime != "NA" ? moment(v.punchOutTime).format("HH:mm:ss") : null}</td>
                                                <td>
                                                    {v.punchOutImage !== "NA" && (
                                                        <img src={v.punchOutImage} alt="Punch Out" style={{ maxWidth: "100px" }} />
                                                    )}
                                                </td>
                                                <td>{v.pOutApprove}</td>
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

export default WithUserPermission(Self);
