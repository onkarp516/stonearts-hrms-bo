import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BackBtn from "../../assets/images/back.png";

import {
    Card,
    CardBody,
    CardTitle,
    Button,
    Row,
    Col,
    Spinner,
    Form,
    Table,
    Modal,
    OverlayTrigger,
    Tooltip,
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
import { Formik } from "formik";
import {
    listOfBranch,
    listOfTeam,
} from "@/services/api_functions";
import ResponseModal from "../../components/ResponseModal";
import CustomDateInputs from "../../components/CustomDateInputs";
import CustomSelect from "../../components/CustomSelect";
import CustomInput from "../../components/CustomInputs";
import { approveTodayPunchInAndPunchOutForTeam, disapproveTodayPunchInAndPunchOutForTeam, findTeamByBranch, getPunchInList, getTodayAttendancePunchInSiteWiseList, getTodayAttendancePunchOutSiteWiseList } from "../../services/api_functions/team.service";


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
    const [branch_opt, setBranch_opt] = useState([]);
    const [team_opt, setTeam_opt] = useState([]);
    const [FilteredTeam, setFilteredTeam] = useState([]);
    const [imageShow, setImageShow] = useState(false);
    const [CheckList, setCheckList] = useState([]);

    const [attendanceData, setAttendanceData] = useState([]);
    const [attendanceData2, setAttendanceData2] = useState([]);
    let [mainData, setMainData] = useState("");
    const [mainInnerData, setMainInnerData] = useState("");
    const [breakData, setBreakData] = useState([]);
    const [breakInnerData, setBreakInnerData] = useState("");
    const [machineInnerData, setMachineInnerData] = useState("");
    const [attendanceInit, setAttenanceInit] = useState({
        attendanceId: "",
        attendanceDate: "",
        employeeName: "",
        checkInTime: "",
        checkOutTime: "",
        totalTime: "",
        employeeWagesType: "",
        wagesHourBasis: 0,
        wagesPcsBasis: 0,
        breakWages: 0,
        netPcsWages: 0,
        wagesPointBasis: 0,
        wagesPerDay: 0,
    });


    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const [showModalEdit, setShowModalEdit] = useState(false); // State to control the modal visibility
    const [designationObject, setDesignationObject] = useState("");
    const [designation, setDesignation] = useState([]);
    const [filteredDesignation, setFilteredDesignation] = useState([]);
    const [LevelOptData, setLevelOptData] = useState([]);

    useEffect(() => {
        // This effect will run whenever resText changes
        if (ResText) {
            // Check if ResText is not empty, and then open the modal
            setResModal(true);
        }
    }, [ResText]);

    // const openModal = (text, logo_type, id) => {
    //     // Update the state to set the text
    //     setLogoType(logo_type);
    //     setResText(text);
    //     setrowId(id)
    // };



    const handleCloseModal = () => {
        setShowModal(false);
    };


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
        setShowModal(false)


    };

    // // Function to close the modal
    // const closeModal = () => {
    //     setResModal(false);
    //     setResText("");
    //     // navigate("/Dashboard/Master/employee");
    // };

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
        setAttendanceData([])
        closeModal(); // Close the modal after submission
    };
    // ... (other methods)

    const getPunchInListData = () => {
        getPunchInList().then((response) => {
            if (response.data.responseStatus === 200) {
                console.log('response.data.responseStatus: ', response.data);
                // setFilteredTeam(response.data.response)
                setAttendanceData2(response.data.response)
                // setSubmitting(false);
                // openModal(response.data.message,"cnf");
                // resetForm();
                // setShowModal(false);
                // getTeamList();
            } else {
                // setSubmitting(false);
                // openModal(error, "error")
            }
        }).catch((error) => {
            // setSubmitting(false);
            openModal(error, "error");
        })

    }

    useEffect(() => {
        getBranchOptions();
        getPunchInListData()
        // getTeams();
    }, []);

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
                    // let options = res.response.map(function (data) {
                    //     return {
                    //         value: data.id,
                    //         label: data.branchName,
                    //     };
                    // });
                    setBranch_opt(options);
                }
            })
            .catch((error) => {
                openModal(error, "error");
            });
    };

    const getTeams = () => {
        listOfTeam().then((response) => {
            let res = response.data;
            if (res.responseStatus === 200) {
                let option = res.response.map(function (data) {
                    return {
                        value: data.id,
                        label: data.teamName,
                    }
                })
                // setTeam_opt(option);
            }
        }).catch((error) => {
            openModal(error, "error");
        })

    }

    const handleCheckboxSelection = (
        e,
        id,
        index,
        employeeWagesType,
        wagesPerDay
    ) => {
        const { name, checked } = e.target; // Use "checked" instead of "value" for checkboxes
        // debugger
        if (name === "all") {
            let opt = [];
            // let selectedMembers = [];
            attendanceData.map((v) => {
                opt.push({
                    ...v,
                    isPunchInApproved: v.isAttendanceApproved == true ? true : checked,
                    // isPunchOutApproved: v.isAttendanceApproved == true ? true : checked,
                });
            });

            setAttendanceData(opt);
        } else {
            const list = [...attendanceData];
            // Update the specific object in the array
            list[index] = {
                ...list[index],
                isPunchInApproved: checked,
                // isPunchOutApproved: checked,
            };
            setAttendanceData(list);
        }
    };
    const handleCheckboxSelection2 = (
        e,
        id,
        index,
        employeeWagesType,
        wagesPerDay
    ) => {
        const { name, checked } = e.target; // Use "checked" instead of "value" for checkboxes
        if (name === "all") {
            let opt = [];
            attendanceData2.map((v) => {
                opt.push({
                    ...v,
                    isPunchInApproved: v.isAttendanceApproved == true ? true : checked,
                    // isPunchOutApproved: v.isAttendanceApproved == true ? true : checked,
                });
            });

            setAttendanceData2(opt);
        } else {
            const list = [...attendanceData2];
            // Update the specific object in the array
            list[index] = {
                ...list[index],
                isPunchInApproved: checked,
                // isPunchOutApproved: checked,
            };
            setAttendanceData2(list);
        }
    };


    const validateBooleanData = (data) => {
        if (data && data.length > 0) {
            var filteredData = (data.filter((v) => v.isAttendanceApproved == false || v.isAttendanceApproved == null || v.isAttendanceApproved === undefined))

        }
        return filteredData && filteredData.length > 0 ? false : true;
    };

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
                    resetForm
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

                        {/* Add Modal */}
                        <Modal show={showModal} onHide={handleCloseModal} className="custom-modal" centered>
                            <div className="modal-dialog modal-sm">
                                <div className="modal-content modal-height-width " >
                                    {/* <Modal.Header className='pb-0' > */}
                                    {/*  */}
                                    <div className="pagePathLayout-modal row" >
                                        <span className="bold">  <OverlayTrigger
                                            placement="right"
                                            overlay={<Tooltip id="tooltip" className="tooltip-back-btn">Back</Tooltip>}
                                        >

                                            <img src={BackBtn} alt="" className="modal-header-backbtn" onClick={handleCloseModal} />

                                        </OverlayTrigger><span className="modal-header-span">{location.pathname}</span></span>

                                    </div>
                                    <Formik
                                        initialValues={{
                                            remark: "",
                                            // designationCode: "",
                                            // levelName: "",

                                        }}
                                        validationSchema={
                                            Yup.object().shape({
                                                remark: Yup.string().trim().required(" "),
                                                // designationCode: Yup.string().trim().required(" "),
                                                // levelName: Yup.string().trim().required(" "),
                                            })
                                        }
                                        onSubmit={(values, { setSubmitting, resetForm }) => {
                                            // debugger
                                            const filteredArray = attendanceData.filter(
                                                (item) => item.isPunchInApproved != false && item.isAttendanceApproved != true
                                            );
                                            let options = [];

                                            filteredArray.forEach((data) => {
                                                options.push(data.attendanceId);
                                            });

                                            let date = new Date()

                                            let requestData = {
                                                selectedMembers: options,
                                                // currentdate: moment(date).format("yyyy-mm-dd"),
                                                // previousDate: "2024-02-15",
                                                remark: values.remark,

                                                atttype: "punchout"
                                            }

                                            // return false
                                            disapproveTodayPunchInAndPunchOutForTeam(requestData)
                                                .then((response) => {
                                                    if (response.data.responseStatus === 200) {

                                                        // setSubmitting(false);
                                                        openModal(response.data.message, "cnf");

                                                        resetForm();

                                                        // setShowModal(false)
                                                        // getAttendanceData();
                                                        // getAll(yo);
                                                    } else {
                                                        setSubmitting(false);
                                                        setAttendanceData([])

                                                        openModal(response.data.message, "error");
                                                    }
                                                })
                                                .catch((error) => {
                                                    openModal(error, "error");
                                                    setSubmitting(false);
                                                    setAttendanceData([])

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

                                                    <div className="col-lg-8">
                                                        <div class="textOnInput">
                                                            {/* <label for="inputText" className="common-input-label">ID</label> */}
                                                            <CustomInput
                                                                className={`form-control ${touched.remark && errors.remark ? 'is-invalid' : ''}`}
                                                                type="text"
                                                                label="Remark"
                                                                id="remark"
                                                                name="remark"
                                                                value={values.remark}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                inputError={errors.remark}

                                                            />
                                                            {/* <div className="invalid-feedback">{errors.id}</div> */}
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="modal-fields-row2 row" >

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
                                                <Row className="mt-3">
                                                    <Col lg="10">
                                                    </Col>
                                                    <Col lg="2">
                                                        <Button
                                                            className="modal-submit-btn"
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
                                title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Team&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
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
                                                branch: "",
                                                team: "",
                                            }}
                                            // validationSchema={Yup.object().shape({
                                            //     taskDate: Yup.string().required("From Date is required"),
                                            //     employeeId: Yup.object().required("Select Employee"),
                                            // })}
                                            validationSchema={Yup.object().shape({
                                                branch: Yup.string().required("Branch is required").test('is-not-select', 'Branch must not be "Select"', value => value !== 'Select'),
                                                // team: Yup.string().required("Team is required").test('is-not-select', 'Team must not be "Select"', value => value !== 'Select'),

                                            })}
                                            onSubmit={(values, { setSubmitting }) => {
                                                console.log('values: ', values);
                                                let requestData = {
                                                    siteId: values.branch,
                                                    teamId: values.team,
                                                }
                                                getTodayAttendancePunchInSiteWiseList(requestData).then((response) => {
                                                    if (response.data.responseStatus === 200) {
                                                        console.log('response.data.responseStatus: ', response.data);
                                                        // setFilteredTeam(response.data.response)
                                                        setAttendanceData(response.data.response)
                                                        // setSubmitting(false);
                                                        // openModal(response.data.message,"cnf");
                                                        resetForm();
                                                        // setShowModal(false);
                                                        // getTeamList();
                                                    } else {
                                                        // setSubmitting(false);
                                                        // openModal(error,"error")
                                                    }
                                                }).catch((error) => {
                                                    // setSubmitting(false);
                                                    // openModal(error,"error");
                                                })

                                                //   getAdvancePaymentsList(values);
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
                                                                    label="Branch"
                                                                    placeholder="Select Branch"
                                                                    className={`form-control ${errors.branch
                                                                        ? "is-invalid"
                                                                        : ""
                                                                        }`}
                                                                    id="branch"
                                                                    name="branch"
                                                                    data={branch_opt}
                                                                    value={values.branch}
                                                                    onChange={(e) => {
                                                                        setFieldValue("branch", e.target.value)
                                                                        setFieldValue("team", "Select")

                                                                        if (e.target.value == "all") {
                                                                            setTeam_opt([]);
                                                                            return false
                                                                        }
                                                                        let requestData = {
                                                                            branchId: e.target.value,
                                                                        }
                                                                        findTeamByBranch(requestData).then((response) => {
                                                                            let res = response.data;
                                                                            if (res.responseStatus === 200) {
                                                                                let option = res.response.map(function (data) {
                                                                                    return {
                                                                                        value: data.id,
                                                                                        label: data.teamName,
                                                                                    }
                                                                                })
                                                                                setTeam_opt(option);
                                                                            }
                                                                        }).catch((error) => {
                                                                            // setSubmitting(false);
                                                                            // openModal(error,"error");
                                                                        })

                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 list-head-fields">
                                                            <div class="textOnInput">
                                                                <CustomSelect
                                                                    label="Team"
                                                                    placeholder="Select Team"
                                                                    className={`form-control ${errors.team
                                                                        ? "is-invalid"
                                                                        : ""
                                                                        }`}
                                                                    id="team"
                                                                    name="team"
                                                                    data={team_opt}
                                                                    value={values.team}
                                                                    onChange={handleChange}
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

                                    <div>
                                        <Formik
                                            validateOnBlur={false}
                                            validateOnChange={false}
                                            initialValues={{
                                                fromDate: "",
                                                employeeId: "",
                                                attStatus: "",
                                                attendanceDate: "",
                                                all: "false"
                                            }}
                                            // validationSchema={Yup.object().shape({
                                            //   fromDate: Yup.string().trim().required(" "),
                                            //   attendanceDate: Yup.string().trim().required(" "),
                                            //   employeeId: Yup.string().required(" "),
                                            // })}
                                            onSubmit={(values, { setSubmitting, resetForm }) => {

                                                // approveAttendance(formData)
                                                //     .then((response) => {
                                                //         if (response.data.responseStatus === 200) {

                                                //             // setSubmitting(false);
                                                //             resetForm();
                                                //             openModal(response.data.message, "cnf");
                                                //             // setShowModal(false)
                                                //             // getAttendanceData();
                                                //             getAll(yo);
                                                //         } else {
                                                //             setSubmitting(false);
                                                //             openModal(response.data.message, "error");
                                                //         }
                                                //     })
                                                //     .catch((error) => {
                                                //         openModal(error, "error");
                                                //         setSubmitting(false);
                                                //     });

                                            }}
                                            render={({ errors, status, touched, isSubmitting, handleChange, handleSubmit, setFieldValue, values, handleBlur }) => (
                                                <Form onSubmit={handleSubmit}>
                                                    <Row className="list-heading">
                                                        <div className="col-lg-2 list-head-fields" >
                                                            <div class="textOnInput">
                                                                <Form.Label >
                                                                    <input
                                                                        name="all"
                                                                        id="all"
                                                                        type="checkbox"
                                                                        disabled={validateBooleanData(attendanceData)}
                                                                        onChange={(e) => {
                                                                            handleCheckboxSelection(
                                                                                e
                                                                                // v.id,
                                                                                // i,
                                                                                // v.employeeWagesType,
                                                                                // v.wagesPerDay,
                                                                            );
                                                                        }}
                                                                        style={{ marginTop: "25px" }}
                                                                    />
                                                                    <span style={{ marginLeft: "5px", marginBottom: "2px" }}>Select all</span>
                                                                </Form.Label>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-1">
                                                            <div class="textOnInput">

                                                                <Button
                                                                    style={{ marginTop: '30px' }}
                                                                    className="modal-submit-btn"
                                                                    // type="submit"
                                                                    disabled={validateBooleanData(attendanceData)}
                                                                    onClick={() => {
                                                                        // debugger
                                                                        const filteredArray = attendanceData.filter(
                                                                            (item) => item.isPunchInApproved == true
                                                                            // (item) => item.isPunchInApproved == true && item.isAttendanceApproved != true
                                                                        );
                                                                        let options = [];

                                                                        filteredArray.forEach((data) => {
                                                                            options.push(data.attendanceId);
                                                                        });

                                                                        let date = new Date()

                                                                        let requestData = {
                                                                            selectedMembers: options,
                                                                            // currentdate: moment(date).format("yyyy-mm-dd"),
                                                                            // previousDate: "2024-02-15",
                                                                            atttype: "punchin"
                                                                        }

                                                                        // console.log('requestData: ', requestData);

                                                                        // return false
                                                                        approveTodayPunchInAndPunchOutForTeam(requestData)
                                                                            .then((response) => {
                                                                                if (response.data.responseStatus === 200) {

                                                                                    // setSubmitting(false);
                                                                                    // resetForm();
                                                                                    openModal(response.data.message, "cnf");
                                                                                    // setShowModal(false)
                                                                                    // getAttendanceData();
                                                                                    // getAll(yo);
                                                                                } else {
                                                                                    // setSubmitting(false);
                                                                                    // openModal(response.data.message, "error");
                                                                                }
                                                                            })
                                                                            .catch((error) => {
                                                                                openModal(error, "error");
                                                                                // setSubmitting(false);
                                                                            });


                                                                    }}
                                                                >
                                                                    Approve
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-1">
                                                            <div class="textOnInput">

                                                                <Button
                                                                    style={{ marginTop: '30px' }}
                                                                    className="modal-submit-btn"
                                                                    type="submit"
                                                                    disabled={validateBooleanData(attendanceData)}
                                                                    onClick={() => {
                                                                        setShowModal(true)

                                                                    }}
                                                                >
                                                                    Disapprove
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
                                            <Col className="list-table2">
                                                    <Table className="table-hover">
                                                        <thead className="list-thead">
                                                            <tr>
                                                                <th className="table-th text-light">Select</th>
                                                                <th className="table-th text-light">SR NO</th>
                                                                <th className="table-th text-light">Designation</th>
                                                                <th className="table-th text-light">Level</th>
                                                                <th className="table-th text-light">Employee Name</th>
                                                                <th className="table-th text-light">Attendance Date</th>
                                                                <th className="table-th text-light">In Time</th>
                                                                <th className="table-th text-light">P-In Image</th>
                                                                <th className="table-th text-light">P-In Approve</th>
                                                                {/* <th className="table-th text-light">Out Time</th> */}
                                                                {/* <th className="table-th text-light">P-Out Image</th> */}
                                                                {/* <th className="table-th text-light">P-Out Approve</th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ maxHeight: "300px", overflowY: "auto" }}
                                                        >
                                                            {attendanceData.length > 0 ? (
                                                                attendanceData.map((v, i, record) => (
                                                                    <tr style={{ backgroundColor: "D9D9D9" }} >
                                                                        {console.log('v: ', v)}

                                                                        <td>
                                                                            <input
                                                                                name="isPunchInApproved"
                                                                                type="checkbox"
                                                                                checked={v.isPunchInApproved}
                                                                                disabled={v.isAttendanceApproved == true ? true : false}
                                                                                onChange={(e) => {
                                                                                    handleCheckboxSelection(
                                                                                        e,
                                                                                        v.id,
                                                                                        i,
                                                                                        v.employeeWagesType,
                                                                                        v.wagesPerDay
                                                                                    );
                                                                                }}
                                                                                style={{ marginTop: "5px" }}
                                                                            /></td>
                                                                        <td>{i + 1}</td>
                                                                        <td>{v.designation}</td>
                                                                        <td>{v.level}</td>
                                                                        <td>{v.employeeName}</td>
                                                                        <td>
                                                                            {moment(v.attendanceDate).format("DD-MM-yyyy")}
                                                                        </td>
                                                                        <td>{v.punchInTime != "NA" ? moment(v.punchInTime).format("HH:mm:ss") : ""}</td>
                                                                        <td>
                                                                            {v.punchInImage !== "NA" && (
                                                                                <img src={v.punchInImage} alt="Punch In" style={{ maxWidth: "100px" }} />
                                                                            )}
                                                                        </td>
                                                                        <td>{v.pInApprove}</td>
                                                                        {/* <td>{v.punchOutTime != "NA" ? moment(v.punchOutTime).format("HH:mm:ss") : ""}</td>
                                                                        <td>
                                                                            {v.punchOutImage !== "NA" && (
                                                                                <img src={v.punchOutImage} alt="Punch Out" style={{ maxWidth: "100px" }} />
                                                                            )}
                                                                        </td>
                                                                        <td>{v.pOutApprove}</td> */}
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
                                title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Self&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                            >
                                {/* <div
                                    className="content-wrapper scrollable-div"
                                    style={{ position: "fixed", width: "92%", marginLeft: "20px", marginTop: "0px" }}
                                > */}



                                    <div>
                                        <Formik
                                            validateOnBlur={false}
                                            validateOnChange={false}
                                            initialValues={{
                                                fromDate: "",
                                                employeeId: "",
                                                attStatus: "",
                                                attendanceDate: "",
                                                all: "false"
                                            }}
                                            // validationSchema={Yup.object().shape({
                                            //   fromDate: Yup.string().trim().required(" "),
                                            //   attendanceDate: Yup.string().trim().required(" "),
                                            //   employeeId: Yup.string().required(" "),
                                            // })}
                                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                                // debugger
                                                const filteredArray = attendanceData2.filter(
                                                    (item) => item.isPunchInApproved == true
                                                );
                                                let options;
                                                filteredArray.forEach((data) => {
                                                    options.push({
                                                        attendanceId: data.attendanceId,
                                                    });
                                                });
                                                console.log('options: ', options);
                                                let formData = new FormData();
                                                formData.append("list", JSON.stringify(filteredArray));
                                                // approveAttendance(formData)
                                                //     .then((response) => {
                                                //         if (response.data.responseStatus === 200) {

                                                //             // setSubmitting(false);
                                                //             resetForm();
                                                //             openModal(response.data.message, "cnf");
                                                //             // setShowModal(false)
                                                //             // getAttendanceData();
                                                //             getAll(yo);
                                                //         } else {
                                                //             setSubmitting(false);
                                                //             openModal(response.data.message, "error");
                                                //         }
                                                //     })
                                                //     .catch((error) => {
                                                //         openModal(error, "error");
                                                //         setSubmitting(false);
                                                //     });

                                            }}
                                            render={({ errors, status, touched, isSubmitting, handleChange, handleSubmit, setFieldValue, values, handleBlur }) => (
                                                <Form onSubmit={handleSubmit}>
                                                    <Row className="list-heading">
                                                        <div className="col-lg-2 list-head-fields" >
                                                            <div class="textOnInput">
                                                                <Form.Label >
                                                                    <input
                                                                        name="all"
                                                                        id="all"
                                                                        type="checkbox"
                                                                        disabled={validateBooleanData(attendanceData)}
                                                                        onChange={(e) => {
                                                                            handleCheckboxSelection(
                                                                                e
                                                                                // v.id,
                                                                                // i,
                                                                                // v.employeeWagesType,
                                                                                // v.wagesPerDay,
                                                                            );
                                                                        }}
                                                                        style={{ marginTop: "25px" }}
                                                                    />
                                                                    <span style={{ marginLeft: "5px", marginBottom: "2px" }}>Select all</span>
                                                                </Form.Label>
                                                            </div>
                                                        </div>


                                                        <div className="col-lg-1">
                                                            <div class="textOnInput">

                                                                <Button
                                                                    style={{ marginTop: '30px' }}
                                                                    className="modal-submit-btn"
                                                                    // type="submit"
                                                                    disabled={validateBooleanData(attendanceData2)}
                                                                    onClick={() => {
                                                                        // debugger
                                                                        const filteredArray = attendanceData2.filter(
                                                                            (item) => item.isPunchInApproved == true
                                                                        );
                                                                        let options = [];

                                                                        filteredArray.forEach((data) => {
                                                                            options.push(data.attendanceId);
                                                                        });

                                                                        let date = new Date()

                                                                        let requestData = {
                                                                            selectedMembers: options,
                                                                            // currentdate: moment(date).format("yyyy-mm-dd"),
                                                                            // previousDate: "2024-02-15",
                                                                            atttype: "punchin"
                                                                        }

                                                                        // return false
                                                                        approveTodayPunchInAndPunchOutForTeam(requestData)
                                                                            .then((response) => {
                                                                                if (response.data.responseStatus === 200) {

                                                                                    // setSubmitting(false);
                                                                                    // resetForm();
                                                                                    openModal(response.data.message, "cnf");
                                                                                    // setShowModal(false)
                                                                                    // getAttendanceData2();
                                                                                    // getAll(yo);
                                                                                } else {
                                                                                    // setSubmitting(false);
                                                                                    // openModal(response.data.message, "error");
                                                                                }
                                                                            })
                                                                            .catch((error) => {
                                                                                openModal(error, "error");
                                                                                // setSubmitting(false);
                                                                            });


                                                                    }}
                                                                >
                                                                    Approve
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-1">
                                                            <div class="textOnInput">

                                                                <Button
                                                                    style={{ marginTop: '30px' }}
                                                                    className="modal-submit-btn"
                                                                    type="submit"
                                                                    disabled={validateBooleanData(attendanceData2)}
                                                                    onClick={() => {
                                                                        // debugger
                                                                        const filteredArray = attendanceData2.filter(
                                                                            (item) => item.isPunchInApproved == true
                                                                        );
                                                                        let options = [];

                                                                        filteredArray.forEach((data) => {
                                                                            options.push(data.attendanceId);
                                                                        });

                                                                        let date = new Date()

                                                                        let requestData = {
                                                                            selectedMembers: options,
                                                                            // currentdate: moment(date).format("yyyy-mm-dd"),
                                                                            // previousDate: "2024-02-15",
                                                                            atttype: "punchin"
                                                                        }

                                                                        // return false
                                                                        disapproveTodayPunchInAndPunchOutForTeam(requestData)
                                                                            .then((response) => {
                                                                                if (response.data.responseStatus === 200) {

                                                                                    // setSubmitting(false);
                                                                                    // resetForm();
                                                                                    openModal(response.data.message, "cnf");
                                                                                    // setShowModal(false)
                                                                                    // getAttendanceData2();
                                                                                    // getAll(yo);
                                                                                } else {
                                                                                    // setSubmitting(false);
                                                                                    // openModal(response.data.message, "error");
                                                                                }
                                                                            })
                                                                            .catch((error) => {
                                                                                openModal(error, "error");
                                                                                // setSubmitting(false);
                                                                            });


                                                                    }}
                                                                >
                                                                    Disaprove
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
                                                            <th className="table-th text-light">Select</th>
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
                                                        {attendanceData2.length > 0 ? (
                                                            attendanceData2.map((v, i, record) => (
                                                                <tr style={{ backgroundColor: "D9D9D9" }} >
                                                                    <td>
                                                                        <input
                                                                            name="isPunchInApproved"
                                                                            type="checkbox"
                                                                            checked={v.isPunchInApproved}
                                                                            disabled={v.isAttendanceApproved == true ? true : false}
                                                                            onChange={(e) => {
                                                                                handleCheckboxSelection2(
                                                                                    e,
                                                                                    v.id,
                                                                                    i,
                                                                                    v.employeeWagesType,
                                                                                    v.wagesPerDay
                                                                                );
                                                                            }}
                                                                            style={{ marginTop: "5px" }}
                                                                        /></td>
                                                                    <td>{i + 1}</td>
                                                                    <td>{v.designation}</td>
                                                                    <td>{v.level}</td>
                                                                    <td>{v.employeeName}</td>
                                                                    <td>
                                                                        {moment(v.attendanceDate).format("DD-MM-yyyy")}
                                                                    </td>
                                                                    <td>{v.punchInTime != "NA" ? moment(v.punchInTime).format("HH:mm:ss") : ""}</td>
                                                                    <td>
                                                                        {v.punchInImage !== "NA" && (
                                                                            <img src={v.punchInImage} alt="Punch In" style={{ maxWidth: "100px" }} />
                                                                        )}
                                                                    </td>
                                                                    <td>{v.pInApprove}</td>
                                                                    <td>{v.punchOutTime != "NA" ? moment(v.punchOutTime).format("HH:mm:ss") : ""}</td>
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
                                {/* </div> */}

                            </Tab>

                        </Tabs>
                    </div>
                )}
            </Formik>
        </div>

    );
}
