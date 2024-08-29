import React, { useEffect, useState } from "react";
import AddBtn from "../../assets/images/MenuButton.png";
import BackBtn from "../../assets/images/back.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Row, Table, Form, Modal, Card, Button, Tabs, Tab, FormGroup } from "react-bootstrap";
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
    listOfDesignation,
    listOfShifts,
    listOfEmployee,
    TeamLeaders,
    createTeamAllocation,
} from "@/services/api_functions";
import moment from "moment";
import { isActionExist, getEmployeeCharwise } from "../../helpers/constants";
import { WithUserPermission } from "../../helpers/WithUserPermission";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ResponseModal from "../../components/ResponseModal";
import CustomDateInputs from "../../components/CustomDateInputs";
import CustomSelect from "../../components/CustomSelect";
import { Input } from "postcss";
import { deleteTeamAllocation, getTeamAllocation, listOfTeamAllocation, updateTeamAllocation } from "../../services/api_functions";
// import { getTeamAllocationUrl } from "../../services/api";

function TeamAllocation(props) {
    const location = useLocation();
    const pathArray = location.pathname.split("/"); // Split the path into an array
    const name = pathArray[pathArray.length - 1]; // Get the last element of the array

    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const [showModalEdit, setShowModalEdit] = useState(false); // State to control the modal visibility
    const [showModalTeamAllocate, setShowModalTeamAllocate] = useState(false); // State to control the modal visibility
    const [showModalCasualEmployee, setShowModalCasualEmployee] = useState(false);// State to control the modal visibility
    const [teamObject, setTeamObject] = useState([]);
    const [team, setTeam] = useState([]);
    const [filteredTeam, setFilteredTeam] = useState([]);
    const [teamLeader, setTeamLeader] = useState([]);
    const [filteredTeamLeader, setFilteredTeamLeader] = useState([]);
    const [team_opt, setTeam_opt] = useState([]);
    const [branch_opt, setBranch_opt] = useState([]);
    const [designation_opt, setDesignation_opt] = useState([]);
    const [shift_opt, setShift_opt] = useState([]);
    const [employee_opt, setEmployeeOptData] = useState([]);
    const [TeamAllocationInit, setTeamAllocationInit] = useState([]);
    const [DeleteConfirmation, setDeleteConfirmation] = useState();
    const [Val, setVal] = useState([])


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
    const openModalForDelete = (val) => {
        debugger
        setVal(val);
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

    const handleAddNewTeamAllocate = () => {
        setShowModalTeamAllocate(true);
    };

    const handleCloseModalTeamAllocate = () => {
        setShowModalTeamAllocate(false);
    };

    const handleAddNewCasualEmployee = () => {
        setShowModalCasualEmployee(true);
    };

    const handleCloseModalCasualEmployee = () => {
        setShowModalCasualEmployee(false);
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
        getTeamOptions();
        getDesignationOptions();
        getShiftOptions();
        getEmployeeList();
        getTeamLeaders();
        getEmployeeListOpt();
        getBranchOptions();
    }, []);

    //List API Function
    const getTeamList = () => {
        listOfTeamAllocation({ "isOwner": true })
            .then((response) => {
                let res = response.data;
                if (res.responseStatus === 200) {
                    console.log('resTeamList: ', res);
                    setTeam(res.response);
                    setFilteredTeam(res.response);
                }

                // if (response.status == 200) {
                //     let response_data = response.data.data;
                //     let init_val = {
                //       teamId: getValue(teamOpt, response_data.teamId),
                //       dbteamLeaderId: response_data.teamLeaderId,
                //       teamLeaderId: getValue(teamLeaderOpt, response_data.teamLeaderId),
                //       members: response_data.members.map((e) => {
                //         let v = getValue(memberOpt, e);
                //         return v;
                //       }),
                //     };
                //     seteditselectedList(response_data.members);
                //     setEditInitVal(init_val);
                //     setEditModalShow(true);
                //   }
            })
            .catch((error) => {
                setTeam([]);
                setFilteredTeam([]);
                openModal(error, "error");
            });
    }

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
                openModal(error, "error");
            })
    }

    //Before Editing Finding the record by Id
    const handleAddNewEdit = (status, id, rowIndex, teamLeaderId) => {
        if (status && teamLeaderId) {
            setcurrentIndex(rowIndex);
            let reqData = { teamId: id, teamLeaderId: teamLeaderId };

            getTeamAllocation(reqData)
                .then((response) => {
                    // debugger

                    console.log('response: ', response);
                    if (response.data.responseStatus === 200) {
                        getTeamList()
                        setTeamObject(response.data.data);
                        setcurrentIndex(0);
                        setShowModalEdit(status);
                        // setShowModalEdit(true);
                        setselectedList(JSON.parse(response.data.data.members));


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
                    setEmployeeOptData(options);
                }
            })
            .catch((error) => {
                openModal(error, "error");
            });
    };
    const [memberOpt, setMemberOpt] = useState([]);
    const getEmployeeListOpt = () => {
        listOfEmployee()
            .then((response) => {
                console.log("response", response);
                if (response.data.responseStatus === 200) {
                    // debugger
                    let employee = response.data;
                    console.log('employee: ', employee);
                    let memberOptions = employee.response.map(function (values) {
                        return {
                            value: values.id,
                            label: values.firstName + " " + values.lastName,
                        };
                    });


                    setMemberOpt(memberOptions);
                    let final_lst = getEmployeeCharwise(memberOptions);
                    // console.log("final_lst", final_lst);
                    setOrgList(final_lst);
                    setKey(final_lst[0]["char"]);
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };


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


    //get Designation List for selection and send the id in request
    const getDesignationOptions = () => {
        TeamLeaders()
            .then((response) => {
                // console.log("i am in ", response.data.response)
                // debugger
                let res = response.data;
                if (res.responseStatus == 200) {
                    // let options = res.response.map(function (data) {
                    //     return {
                    //         value: data.id,
                    //         label: data.designationName,
                    //     };
                    // });
                    let teamLeaderOptions = res.response.map(function (values) {
                        return {
                            value: values.id,
                            label: values.teamLeadName + " ",
                            // label: values.firstName + " " + values.lastName,
                        };
                    });
                    setDesignation_opt(teamLeaderOptions);
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

    //Delete API Function
    const onDelete = (val) => {

        let requestData = {
            teamId: val.teamId,
            teamLeaderId: val.teamLeaderId,
        }
        deleteTeamAllocation(requestData).then((response) => {
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

    const [OrgList, setOrgList] = useState([]);
    const [searchList, setsearchList] = useState([]);
    const [selectedList, setselectedList] = useState([]);
    const [key, setKey] = useState();

    const HandleOnChange = (value, status) => {
        // debugger
        console.log({ value, status });
        let currentSelectedList = selectedList;
        if (status == true) {
            var index = currentSelectedList.indexOf(parseInt(value));
            if (index == -1) {
                currentSelectedList = [...currentSelectedList, parseInt(value)];
            }

            setselectedList(currentSelectedList);
        } else {
            const list = [...selectedList];
            var index = list.indexOf(parseInt(value));
            if (index > -1) {
                list.splice(index, 1);
            }

            setselectedList(list);

        }
    };

    const HandleSearch = (e) => {
        // console.log("e", e.target.value);
        let searchText = e.target.value;
        if (searchText != "") {
            // console.log({ searchText });
            // console.log({ key });
            let finalSearchList = OrgList.filter((v) => {
                return v.char == key;
            }).map((vi) => {
                // console.log("vi", vi);
                return vi.lst.filter((vk) => {
                    // console.log({ vk });
                    return vk.label.toLowerCase().includes(searchText.toLowerCase());
                });
            });
            setsearchList(finalSearchList);
        } else {
            setsearchList([]);
        }
    };

    const getTabInfo = () => {
        return (
            <div>
                {/* {JSON.stringify(OrgList, undefined, 2)} */}
                {/* <Form.Group style={{ marginTop: "10px" }}>
                    <input
                        type="text"
                        placeholder="Search Employee"
                        name="SearchName"
                        onChange={(e) => {
                            HandleSearch(e);
                        }}
                    />
                </Form.Group> */}

                <div class="textOnInput" style={{ marginTop: "50px" }}>
                    <CustomInput
                        className={`form-control }`}
                        type="text"
                        label="Search Employee"
                        id="SearchName"
                        name="SearchName"
                        // value={values.teamName}
                        onChange={(e) => {
                            HandleSearch(e);
                        }}
                    // inputError={errors.teamName}
                    />
                </div>
                <div className="card " style={{ marginTop: "36px", width: "1080px", height: "100px", padding: "10px", margin: "5px" }}>
                    <div className="empnm row">
                        {searchList.length == 0 &&
                            OrgList.map((v) => {
                                if (v.char == key) {
                                    return v.lst.map((m) => {
                                        return (

                                            <div className="col-lg-3 m-1">
                                                <Form.Group check>
                                                    <Form.Label check>
                                                        <input
                                                            type="checkbox"
                                                            value={m.value}
                                                            checked={
                                                                selectedList.indexOf(m.value) > -1 ? true : false
                                                            }
                                                            onChange={(e) => {
                                                                HandleOnChange(e.target.value, e.target.checked);
                                                            }}
                                                        />
                                                        <span>{m.label}</span>
                                                    </Form.Label>
                                                </Form.Group>
                                            </div>
                                        );
                                    });
                                }
                            })}
                        {/* {JSON.stringify(searchList)} */}
                        {searchList.length > 0 &&
                            searchList.map((v) => {
                                return (
                                    <>
                                        {v.map((m) => {
                                            return (
                                                <div className="col-lg-3 m-1">
                                                    <Form.Group check>
                                                        <Form.Label check>
                                                            <input
                                                                type="checkbox"
                                                                value={m.value}
                                                                checked={
                                                                    selectedList.indexOf(m.value) > -1 ? true : false
                                                                }
                                                                onChange={(e) => {
                                                                    HandleOnChange(e.target.value, e.target.checked);
                                                                }}
                                                            />
                                                            <span>{m.label}</span>
                                                        </Form.Label>
                                                    </Form.Group>
                                                </div>
                                            );
                                        })}
                                    </>
                                );
                            })}
                    </div>
                </div>
            </div>
        );
    };
    const getTabsValues = () => {
        return (
            <div>
                <Tabs
                    id="uncontrolled-tab-example"
                    activeKey={key}
                    onSelect={(k) => {
                        setKey(k);
                    }}
                >
                    {OrgList.map((v) => {
                        return <Tab eventKey={v.char} title={v.char}></Tab>;
                    })}
                </Tabs>
                {getTabInfo()}
            </div>
        );
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

            <DeleteConfirmationModal
                DeleteConfirmationModal={DeleteConfirmation}
                onRequestClose={closeModal}
                onConfirm={() => onDelete(Val)}
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
                        overlay={<Tooltip id="tooltip" className="tooltip-add-btn-team-allocation1">Assign Employee to Team</Tooltip>}
                    >
                        {isActionExist("team-allocation", "create", props.userPermissions) && (
                            <div className="col-lg-1 header-add-btn-team-allocation-mdl1" onClick={handleAddNewTeamAllocate}  >
                                <img src={AddBtn} alt="" className="btn-add " />
                            </div>
                        )}
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip id="tooltip" className="tooltip-add-btn-team-allocation2">Add Team</Tooltip>}
                    >
                        {isActionExist("team-allocation", "create", props.userPermissions) && (
                            <div className="col-lg-1 header-add-btn-team-allocation-mdl2" onClick={handleAddNew}  >
                                <img src={AddBtn} alt="" className="btn-add " />
                            </div>
                        )}
                    </OverlayTrigger>

                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip id="tooltip" className="tooltip-add-btn-team-allocation3">Quick Add Employee</Tooltip>}
                    >
                        {isActionExist("team-allocation", "create", props.userPermissions) && (

                            <div className="col-lg-1 header-add-btn-team-allocation-mdl3"
                            // onClick={handleAddNewCasualEmployee}
                            >
                                <Link to="/Dashboard/Master/employee-create">
                                    <img src={AddBtn} alt="" className="btn-add " />
                                </Link>

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
                                        <th className="table-th text-light">Team Name</th>
                                        <th className="table-th text-light">Team Leader Name</th>
                                        <th className="table-th text-light">Actions</th>
                                    </tr>
                                </thead>

                                <tbody style={{ maxHeight: "300px", overflowY: "auto" }}
                                >
                                    {filteredTeam.length > 0 ? (
                                        filteredTeam.map((v, i, record) => (
                                            <tr style={{ backgroundColor: "D9D9D9" }} onDoubleClick={() => handleAddNewEdit(true, v.teamId, i, v.teamLeaderId)}  >
                                                {console.log('v: ', v)}
                                                <td>{i + 1}</td>
                                                <td>{v.teamName}</td>
                                                <td>{v.teamLeaderName}</td>

                                                <td align="left">
                                                    {isActionExist(
                                                        "team-allocation",
                                                        "delete",
                                                        props.userPermissions
                                                    ) && (
                                                            <img
                                                                src={Delete}
                                                                alt=""
                                                                className="img-delete"
                                                                onClick={() => openModalForDelete(v)}

                                                            />
                                                        )}
                                                    {isActionExist(
                                                        "team-allocation",
                                                        "edit",
                                                        props.userPermissions
                                                    ) && (
                                                            <img
                                                                src={edit}
                                                                alt=""
                                                                className="img-edit"
                                                                onClick={() => handleAddNewEdit(true, v.teamId, i)}
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
                                        // debugger
                                        getTeamList();
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
            <Modal show={showModalEdit} onHide={handleCloseModalEdit} centered size="xl">
                <Modal.Header >
                    <div className="pagePathLayout-modal row" >
                        <span className="bold">  <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip id="tooltip" className="tooltip-back-btn">Back</Tooltip>}
                        >

                            <img src={BackBtn} alt="" className="modal-header-backbtn" onClick={handleCloseModalTeamAllocate} />

                        </OverlayTrigger><span className="modal-header-span">{location.pathname} Edit</span></span>

                    </div>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    <div className=" ">
                        <div className="modal-content  " >
                            {/* <Modal.Header className='pb-0' > */}
                            {console.log('teamObject: ', teamObject)}
                            {/*  */}

                            <Formik
                                validateOnBlur={false}
                                validateOnChange={false}
                                initialValues={{
                                    teamId: teamObject.teamId ? teamObject.teamId : "",
                                    teamName: parseInt(teamObject.teamId) ? parseInt(teamObject.teamId) : "",
                                    teamLeader: parseInt(teamObject.teamLeaderId) ? parseInt(teamObject.teamLeaderId) : "",
                                    dbteamLeaderId: teamObject.teamLeaderId ? teamObject.teamLeaderId : "",
                                    teamMembers: teamObject.teamMembers ? teamObject.teamMembers : "",
                                }}
                                validationSchema={Yup.object().shape({
                                    teamName: Yup.string().required("Team is required").test('is-not-select', 'Team must not be "Select"', value => value !== 'Select'),
                                    teamLeader: Yup.string().required("Team Leader is required").test('is-not-select', 'Team must not be "Select"', value => value !== 'Select'),

                                })}
                                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                                    console.log('values: ', values);
                                    console.log('selectedList: ', selectedList);
                                    // return false
                                    // debugger
                                    // setStatus();
                                    // console.log("values", values);
                                    // console.log("SelectedList", selectedList);
                                    // let member_list = values.members;
                                    // let member_result = member_list.map(function (values) {
                                    //   return values.value;
                                    // });
                                    let requestData = {
                                        teamId: parseInt(values.teamName),
                                        teamLeaderId: parseInt(values.teamLeader),
                                        dbteamLeaderId: parseInt(values.dbteamLeaderId),
                                        members: selectedList,
                                    };
                                    // return false
                                    updateTeamAllocation(requestData)
                                        .then((response) => {
                                            // debugger
                                            // console.log("response", response);
                                            if (response.data.responseStatus === 200) {
                                                openModal(response.data.message, "cnf");
                                                getTeamList();
                                                setShowModalTeamAllocate(false)
                                                setShowModalEdit(false)
                                                setSubmitting(false);
                                                // toast.success("✔ " + response.data.message);
                                                resetForm();
                                                // onAddModalShow(false);
                                                // setRefresh(true);
                                                setselectedList([]);
                                            } else {
                                                setSubmitting(false);
                                                // toast.error("✘ " + response.data.message);
                                            }
                                        })
                                        .catch((error) => {
                                            setSubmitting(false);
                                            // toast.error("✘ " + error);
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
                                            {console.log('values.teamName: ', values)}
                                            <div className="col-lg-4">
                                                <div class="textOnInput">
                                                    {/* <CustomSelect
                                                        label="Team Name"
                                                        placeholder="Enter Team Name"
                                                        className={`form-control ${errors.teamName
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="teamName"
                                                        name="teamName"
                                                        data={team_opt}
                                                        value={values.teamName}
                                                        onChange={handleChange}
                                                    /> */}

                                                    <CustomSelect
                                                        label="Team Name"
                                                        className={`form-control ${touched.teamName && errors.teamName ? "is-invalid" : ""
                                                            }`}
                                                        id="teamName"
                                                        name="teamName"
                                                        data={team_opt}
                                                        value={values.teamName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4">
                                                <div class="textOnInput">
                                                    <CustomSelect
                                                        label="Team Leader"
                                                        placeholder="Enter Team Leader"
                                                        className={`form-control ${errors.teamLeader
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="teamLeader"
                                                        name="teamLeader"
                                                        data={designation_opt}
                                                        value={values.teamLeader}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* <div className="col-lg-4">
                                            <div class="textOnInput">
                                                <CustomSelect
                                                    label="Select Employee"
                                                    placeholder="Enter Employee"
                                                    className={`form-control ${errors.employee
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="employee"
                                                    name="employee"
                                                    data={employee_opt}
                                                    value={values.employee}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div> */}

                                        </div>


                                        <div className="modal-fields-row row">


                                            <div className="col-lg-4">

                                                {/* <Label htmlFor="members">Select Employees</Label> */}
                                                <FormGroup>

                                                    <Row>
                                                        <Col md="12">
                                                            {/* <pre>{JSON.stringify(memberOpt, undefined, 2)}</pre> */}
                                                            <div className="alphabate">{getTabsValues()}</div>
                                                        </Col>
                                                    </Row>

                                                    {selectedList.length > 0 && (
                                                        <>
                                                            <h6 style={{ marginTop: "20px" }}>
                                                                Selected Employees
                                                            </h6>
                                                            <div className="empcheck">
                                                                {/* {JSON.stringify(selectedList)} */}
                                                                {OrgList.length > 0 &&
                                                                    OrgList.map((v) => {
                                                                        return v.lst.map((vi) => {
                                                                            if (selectedList.includes(vi.value)) {
                                                                                return <li>{vi.label}</li>;
                                                                            }
                                                                        });
                                                                    })}
                                                            </div>
                                                        </>
                                                    )}
                                                </FormGroup>


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
                                            <Col lg="9">
                                            </Col>
                                            <Col lg="2">
                                                <Button
                                                    className="modal-btn mb-3"
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
                </Modal.Body>
            </Modal>

            {/* Add Allocate Team Modal */}
            <Modal show={showModalTeamAllocate} onHide={handleCloseModalTeamAllocate} centered size="xl" >
                <Modal.Header >
                    <div className="pagePathLayout-modal row" >
                        <span className="bold">  <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip id="tooltip" className="tooltip-back-btn">Back</Tooltip>}
                        >

                            <img src={BackBtn} alt="" className="modal-header-backbtn" onClick={handleCloseModalTeamAllocate} />

                        </OverlayTrigger><span className="modal-header-span">{location.pathname}</span></span>

                    </div>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    <div className=" ">
                        <div className="modal-content  " >
                            {/* <Modal.Header className='pb-0' > */}
                            {/*  */}

                            <Formik
                                validateOnBlur={false}
                                validateOnChange={false}
                                initialValues={{
                                    teamName: "",
                                    teamLeaderId: "",
                                }}
                                validationSchema={Yup.object().shape({
                                    // teamName: Yup.object().required("Team is required"),
                                    // teamLeader: Yup.object().required("Team leader is required"),
                                    teamName: Yup.string().required("Team is required"),
                                    teamLeader: Yup.string().required("Team leader is required"),

                                })}
                                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                                    console.log('values: ', values);
                                    console.log('selectedList: ', selectedList);
                                    // debugger
                                    // setStatus();
                                    // console.log("values", values);
                                    // console.log("SelectedList", selectedList);
                                    // let member_list = values.members;
                                    // let member_result = member_list.map(function (values) {
                                    //   return values.value;
                                    // });
                                    let requestData = {
                                        teamId: parseInt(values.teamName),
                                        teamLeaderId: parseInt(values.teamLeader),
                                        members: selectedList,
                                    };

                                    createTeamAllocation(requestData)
                                        .then((response) => {
                                            // debugger
                                            // console.log("response", response);
                                            if (response.data.responseStatus === 200) {
                                                openModal(response.data.message, "cnf");
                                                getTeamList();
                                                setShowModalTeamAllocate(false)
                                                setShowModalEdit(false)
                                                setShowModalTeamAllocate(false)
                                                setSubmitting(false);
                                                // toast.success("✔ " + response.data.message);
                                                resetForm();
                                                // onAddModalShow(false);
                                                // setRefresh(true);
                                                setselectedList([]);
                                            } else {
                                                setSubmitting(false);
                                                // toast.error("✘ " + response.data.message);
                                            }
                                        })
                                        .catch((error) => {
                                            setSubmitting(false);
                                            // toast.error("✘ " + error);
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
                                        <div className="modal-fields-row1 row p-3 mt-3">


                                            <div className="col-lg-4">
                                                <div class="textOnInput">
                                                    <CustomSelect
                                                        label="Team Name"
                                                        placeholder="Enter Team Name"
                                                        className={`form-control ${errors.teamName
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="teamName"
                                                        name="teamName"
                                                        data={team_opt}
                                                        value={values.teamName}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4">
                                                <div class="textOnInput">
                                                    <CustomSelect
                                                        label="Team Leader"
                                                        placeholder="Enter Team Leader"
                                                        className={`form-control ${errors.teamLeader
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="teamLeader"
                                                        name="teamLeader"
                                                        data={designation_opt}
                                                        value={values.teamLeader}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* <div className="col-lg-4">
                                            <div class="textOnInput">
                                                <CustomSelect
                                                    label="Select Employee"
                                                    placeholder="Enter Employee"
                                                    className={`form-control ${errors.employee
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="employee"
                                                    name="employee"
                                                    data={employee_opt}
                                                    value={values.employee}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div> */}

                                        </div>


                                        <div className="modal-fields-row row p-3">


                                            <div className="col-lg-4">

                                                {/* <Label htmlFor="members">Select Employees</Label> */}
                                                <FormGroup>

                                                    <Row>
                                                        <Col md="12">
                                                            {/* <pre>{JSON.stringify(memberOpt, undefined, 2)}</pre> */}
                                                            <div className="alphabate">{getTabsValues()}</div>
                                                        </Col>
                                                    </Row>

                                                    {selectedList.length > 0 && (
                                                        <>
                                                            <h6 style={{ marginTop: "20px" }}>
                                                                Selected Employees
                                                            </h6>
                                                            <div className="empcheck">
                                                                {/* {JSON.stringify(selectedList)} */}
                                                                {OrgList.length > 0 &&
                                                                    OrgList.map((v) => {
                                                                        return v.lst.map((vi) => {
                                                                            if (selectedList.includes(vi.value)) {
                                                                                return <li>{vi.label}</li>;
                                                                            }
                                                                        });
                                                                    })}
                                                            </div>
                                                        </>
                                                    )}
                                                </FormGroup>


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
                                            <Col lg="9">
                                            </Col>
                                            <Col lg="2">
                                                <Button
                                                    className="modal-btn mb-3"
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
                </Modal.Body>
            </Modal>
            {/* Add Quick Add Casual Employee Modal */}
            <Modal show={showModalCasualEmployee} onHide={handleCloseModalCasualEmployee} className="custom-modal" centered>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content modal-height-width " >
                        {/* <Modal.Header className='pb-0' > */}
                        {/*  */}
                        <div className="pagePathLayout-modal row" >
                            <span className="bold">  <OverlayTrigger style={{}}
                                placement="right"
                                overlay={<Tooltip id="tooltip" className="tooltip-back-btn">Back</Tooltip>}
                            >

                                <img src={BackBtn} alt="" className="modal-header-backbtn" onClick={handleCloseModalCasualEmployee} />

                            </OverlayTrigger><span className="modal-header-span">{location.pathname}</span></span>

                        </div>
                        <Formik
                            initialValues={{
                                firstName: "",
                                lastName: "",
                                designation: "",
                                shift: "",
                                salary: "",
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    firstName: Yup.string().trim().required(" "),
                                    lastName: Yup.string().trim().required(" "),
                                    designation: Yup.string().trim().required(" "),
                                    shift: Yup.string().trim().required(" "),
                                    salary: Yup.string().trim().required(" "),
                                })
                            }
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                let requestData = {
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    designation: values.designation,
                                    shift: values.shift,
                                    salary: values.salary,
                                }
                                createTeam(requestData).then((response) => {
                                    if (response.data.responseStatus === 200) {
                                        setSubmitting(false);
                                        openModal(response.data.message, "cnf");
                                        resetForm();
                                        setShowModalCasualEmployee(false)
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
                                                <CustomInput
                                                    className={`form-control ${touched.firstName && errors.firstName ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    label="First Name"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={values.firstName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    inputError={errors.firstName}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                                <CustomInput
                                                    className={`form-control ${touched.lastName && errors.lastName ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    label="Last Name"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={values.lastName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    inputError={errors.lastName}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                                <CustomSelect
                                                    label="Designation"
                                                    placeholder="Enter Designation"
                                                    className={`form-control ${errors.designation
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="designation"
                                                    name="designation"
                                                    data={designation_opt}
                                                    value={values.designation}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="modal-fields-row2 row">
                                        <div className="col-lg-4">
                                            <div class="textOnInput">
                                                <CustomSelect
                                                    label="Shift"
                                                    placeholder="Enter Shift"
                                                    className={`form-control ${errors.shift
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="shift"
                                                    name="shift"
                                                    data={shift_opt}
                                                    value={values.shift}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-4" >
                                            <div class="textOnInput">
                                                <CustomInput
                                                    className={`form-control ${touched.salary && errors.salary ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    placeholder="Enter Salary"
                                                    label="Salary"
                                                    id="salary"
                                                    name="salary"
                                                    value={values.salary}
                                                    //Only Numbers
                                                    onChange={(e) => {
                                                        const inputValue = e.target.value;
                                                        // Check if the input is a valid number
                                                        if (!isNaN(inputValue)) {
                                                            handleChange(e);
                                                        }
                                                        // Ignore the input if it's not a number
                                                    }}
                                                    onBlur={handleBlur}
                                                    inputError={errors.salary}
                                                />
                                            </div>
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

        </div>
    );
}

export default WithUserPermission(TeamAllocation);