import React, { useEffect, useState } from "react";
import AddBtn from "../../assets/images/MenuButton.png";
import BackBtn from "../../assets/images/back.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Row, Table, Form, Modal, Card, Button } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";
import edit from "../../assets/images/edit.png";
import Delete from "../../assets/images/delete.png";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import CustomInput from "../../components/CustomInputs";
import CustomToggleSwitch from "../../components/CustomToggleSwitch";
import CustomTimeInputs from "../../components/CustomTimeInputs";
import {
    createTeam,
    listOfTeam,
    deleteTeam,
    updateTeam,
    findTeam,
    listOfBranch,
    TeamLeaders,
} from "@/services/api_functions";
import moment from "moment";
import { isActionExist } from "../../helpers/constants";
import { WithUserPermission } from "../../helpers/WithUserPermission";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ResponseModal from "../../components/ResponseModal";
import CustomDateInputs from "../../components/CustomDateInputs";
import CustomSelect from "../../components/CustomSelect";

function LeadSiteMapping(props) {
    const location = useLocation();
    const pathArray = location.pathname.split("/"); // Split the path into an array
    const name = pathArray[pathArray.length - 1]; // Get the last element of the array

    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const [showModalEdit, setShowModalEdit] = useState(false); // State to control the modal visibility
    const [teamObject, setTeamObject] = useState("");
    const [team, setTeam] = useState([]);
    const [filteredTeam, setFilteredTeam] = useState([]);
    const [teamLeader, setTeamLeader] = useState([]);
    const [filteredTeamLeader, setFilteredTeamLeader] = useState([]);
    const [branch_opt, setBranch_opt] = useState([]);
    const [DeleteConfirmation, setDeleteConfirmation] = useState();
    const [DeleteId, setDeleteId] = useState()


    const [ResModal, setResModal] = useState(false);
    const [ResText, setResText] = useState(false);
    const [LogoType, setLogoType] = useState("");
    const [rowId, setrowId] = useState();

    const navigate = useNavigate()
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

    //Modal for Delete
    const openModalForDelete = (id) => {
        setDeleteId(id);
        setDeleteConfirmation(true);
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

    const handleAddNew = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
    };

    // Placeholder state functions for missing definitions
    const setEditModalShow = (status) => {
        console.log("setEditModalShow: ", status);
    };

    const setcurrentIndex = (index) => {
        console.log("setcurrentIndex: ", index);
    };

    useEffect(() => {
        getTeamList();
        getBranchOptions();
        getTeamLeaders();
    }, []);

    //List API Function
    const getTeamList = () => {
        listOfTeam({ "isOwner": true })
            .then((response) => {
                let res = response.data;
                if (res.responseStatus === 200) {
                    setTeam(res.response);
                    setFilteredTeam(res.response);
                }
            })
            .catch((error) => {
                setTeam([]);
                setFilteredTeam([]);
                openModal(error, "error");
            });
    }

    const getTeamLeaders = () => {
        TeamLeaders().then((response) => {
            let res = response.data;
            if (res.responseStatus === 200) {
                setTeamLeader(res.response);
                setFilteredTeamLeader(res.response);
            }
        })
            .catch((error) => {
                setTeamLeader([]);
                setFilteredTeamLeader([]);
                openModal(error, "error")
            })
    }

    //Before Editing Finding the record by Id
    const handleAddNewEdit = (status, id, rowIndex) => {
        if (status) {
            setcurrentIndex(rowIndex);
            let reqData = { id: id };

            findTeam(reqData)
                .then((response) => {
                    if (response.data.responseStatus === 200) {
                        setTeamObject(response.data.response);
                        setcurrentIndex(0);
                        setShowModalEdit(status);
                        // setShowModalEdit(true);

                    } else {
                        openModal("No Data Found", "error");
                    }
                })
                .catch((error) => {
                    openModal(error, "error");
                });
        } else {
            setEditModalShow(status);
            setcurrentIndex(0);
        }
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

    //Delete API Function
    const onDelete = (id) => {

        let requestData = {
            id: id,
        }
        deleteTeam(requestData).then((response) => {
            if (response.data.responseStatus === 200) {
                openModal(response.data.message, "cnf");
                getTeamList();
            }
            else {
                openModal(response.data.message, "error");
            }
        })
            .catch((error) => {
                openModal(error, "error");
            });
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

            <DeleteConfirmationModal
                DeleteConfirmationModal={DeleteConfirmation}
                onRequestClose={closeModal}
                onConfirm={() => onDelete(DeleteId)}
                text={`Are you sure you want to Delete ?`}
            />

            <div
                className="content-wrapper scrollable-div"
                style={{ position: "fixed", width: "96%" }}
            >
                <div className="pagePathLayout row">
                    <div className="col-lg-11 header-title">
                        <span className="bold" >{location.pathname}</span>
                    </div>
                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip id="tooltip" className="tooltip-add-btn">Create</Tooltip>}
                    >
                        {isActionExist("lead-site-mapping", "create", props.userPermissions) && (
                            <div className="col-lg-1 header-add-btn" onClick={handleAddNew}  >
                                <img src={AddBtn} alt="" className="btn-add " />
                            </div>
                        )}
                    </OverlayTrigger>
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
                                        <th className="table-th text-light">Branch</th>
                                        <th className="table-th text-light">Team Name</th>
                                        <th className="table-th text-light">Team Leader</th>
                                        <th className="table-th text-light">Actions</th>
                                    </tr>
                                </thead>

                                <tbody style={{ maxHeight: "300px", overflowY: "auto" }}
                                >
                                    {filteredTeam.length > 0 ? (
                                        filteredTeam.map((v, i, record) => (
                                            <tr style={{ backgroundColor: "D9D9D9" }} onDoubleClick={() => handleAddNewEdit(true, v.id, i)}  >
                                                <td>{i + 1}</td>
                                                <td>{v.branch}</td>
                                                <td>{v.teamName}</td>
                                                {filteredTeamLeader.length > 0 ? (
                                                    filteredTeamLeader.map((v, i) => (
                                                        <td>{v.teamLeadName}</td>

                                                    ))
                                                ) : (
                                                    <td></td>
                                                )

                                                }
                                                <td align="left">
                                                    {isActionExist(
                                                        "lead-site-mapping",
                                                        "delete",
                                                        props.userPermissions
                                                    ) && (
                                                            <img
                                                                src={Delete}
                                                                alt=""
                                                                className="img-delete"
                                                                onClick={() => openModalForDelete(v.id)}

                                                            />
                                                        )}
                                                    {isActionExist(
                                                        "lead-site-mapping",
                                                        "edit",
                                                        props.userPermissions
                                                    ) && (
                                                            <img
                                                                src={edit}
                                                                alt=""
                                                                className="img-edit"
                                                                onClick={() => handleAddNewEdit(true, v.id, i)}
                                                            />
                                                        )}
                                                </td>
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
                </div>
            </div>

            {/* Add Modal */}
            <Modal show={showModal} onHide={handleCloseModal} className="custom-modal" centered>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content modal-height-width " >
                        {/* <Modal.Header className='pb-0' > */}
                        {/*  */}
                        <div className="pagePathLayout-modal row" >
                            <span className="bold">  <OverlayTrigger style={{}}
                                placement="right"
                                overlay={<Tooltip id="tooltip" className="tooltip-back-btn">Back</Tooltip>}
                            >

                                <img src={BackBtn} alt="" className="modal-header-backbtn" onClick={handleCloseModal} />

                            </OverlayTrigger><span className="modal-header-span">{location.pathname}</span></span>

                        </div>
                        <Formik
                            initialValues={{
                                branch: "",
                                teamName: "",
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    branch: Yup.string().trim().required(" "),
                                    teamName: Yup.string().required(" "),
                                })
                            }
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                let requestData = {
                                    teamName: values.teamName,
                                    branch: values.branch,
                                }
                                createTeam(requestData).then((response) => {
                                    if (response.data.responseStatus === 200) {
                                        setSubmitting(false);
                                        openModal(response.data.message, "cnf");
                                        resetForm();
                                        setShowModal(false)
                                        getTeamList();
                                    } else {
                                        setSubmitting(false);
                                        openModal(response.data.message, "error");
                                    }
                                })
                                    .catch((error) => {
                                        setSubmitting(false);
                                        openModal(error, "error");
                                    })
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
                                    <div className="modal-fields-row1 row">


                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                                <CustomSelect
                                                    label="Branch"
                                                    placeholder="Enter Branch"
                                                    className={`form-control ${errors.branch
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="branch"
                                                    name="branch"
                                                    data={branch_opt}
                                                    value={values.branch}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                                <CustomInput
                                                    className={`form-control ${touched.teamName && errors.teamName ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    label="Team Name"
                                                    id="teamName"
                                                    name="teamName"
                                                    value={values.teamName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    inputError={errors.teamName}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-4">

                                        </div>

                                    </div>
                                    <div className="modal-fields-row2 row">
                                        <div className="col-lg-4">
                                        </div>

                                        <div className="col-lg-4" style={{ marginTop: "18px" }}>

                                        </div>

                                        <div className="col-lg-4">
                                        </div>

                                    </div>
                                    <div className="modal-fields-row3 row">


                                        <div className="col-lg-4">
                                            <div class="textOnInput">

                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">

                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">

                                            </div>
                                        </div>

                                    </div>
                                    <div className="modal-fields-row4 row">


                                        <div className="col-lg-4">
                                            <div class="textOnInput">

                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">

                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">

                                            </div>
                                        </div>

                                    </div>

                                    <Row >
                                        <Col lg="10">
                                        </Col>
                                        <Col lg="2">
                                            <Button
                                                className="modal-btn mt-3"
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showModalEdit} onHide={handleCloseModalEdit} className="custom-modal" centered>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content modal-height-width " >
                        {/* <Modal.Header className='pb-0' > */}
                        {/*  */}
                        <div className="pagePathLayout-modal row" >
                            <span className="bold">  <OverlayTrigger style={{}}
                                placement="right"
                                overlay={<Tooltip id="tooltip" className="tooltip-back-btn">Back</Tooltip>}
                            >

                                <img src={BackBtn} alt="" className="modal-header-backbtn" onClick={handleCloseModalEdit} />

                            </OverlayTrigger><span className="modal-header-span">{location.pathname}</span></span>

                        </div>
                        <Formik
                            initialValues={{
                                branch: teamObject != null ? teamObject.branch : "",
                                teamName: teamObject != null ? teamObject.teamName : "",
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    teamName: Yup.string().trim().required(" "),
                                    branch: Yup.string().required(" "),
                                })
                            }
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                let requestData = {
                                    id: teamObject.id,
                                    teamName: values.teamName,
                                    branch: values.branch,
                                };
                                updateTeam(requestData)
                                    .then((response) => {
                                        console.log("response>>", response)
                                        if (response.data.responseStatus === 200) {
                                            setSubmitting(false);
                                            handleCloseModalEdit();
                                            openModal(response.data.message, "cnf");
                                            getTeamList();
                                        } else {
                                            setSubmitting(false);
                                            openModal(response.data.message, "error");
                                        }
                                    })
                                    .catch((error) => {
                                        openModal(error, "error");
                                        setSubmitting(false);
                                    });

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
                                    <div className="modal-fields-row1 row">


                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                                <CustomSelect
                                                    label="Branch"
                                                    placeholder="Enter Branch"
                                                    className={`form-control ${errors.branch
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="branch"
                                                    name="branch"
                                                    data={branch_opt}
                                                    value={values.branch}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                                <CustomInput
                                                    className={`form-control ${touched.teamName && errors.teamName ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    label="Team Name"
                                                    id="teamName"
                                                    name="teamName"
                                                    value={values.teamName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    inputError={errors.teamName}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-4">

                                        </div>

                                    </div>
                                    <div className="modal-fields-row2 row">
                                        <div className="col-lg-4">
                                        </div>

                                        <div className="col-lg-4" style={{ marginTop: "18px" }}>

                                        </div>

                                        <div className="col-lg-4">
                                        </div>

                                    </div>
                                    <div className="modal-fields-row3 row">


                                        <div className="col-lg-4">
                                            <div class="textOnInput">

                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">

                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">

                                            </div>
                                        </div>

                                    </div>
                                    <div className="modal-fields-row4 row">
                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                            </div>
                                        </div>
                                    </div>
                                    <Row >
                                        <Col lg="10">
                                        </Col>
                                        <Col lg="2">
                                            <Button
                                                className="modal-btn mt-3"
                                                type="submit"
                                            >
                                                Update
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default WithUserPermission(LeadSiteMapping);