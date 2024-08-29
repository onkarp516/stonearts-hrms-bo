import React, { useState, useEffect } from "react";
import moment from "moment";
import AddBtn from "../../../assets/images/MenuButton.png";
import SubstractBtn from "../../../assets/images/Frame445.png";

import Cross from "../../../assets/images/Cross.png";
import { WithUserPermission } from "../../../helpers/WithUserPermission";
import {
    Col,
    Card,
    CardBody,
    CardTitle,
    FormGroup,
    Row,
    Table,
    Tooltip,
    Button,
    OverlayTrigger,
} from "react-bootstrap";
import Select from "react-select";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
    create_payments,
    create_receipts,
    getCashACBankAccountDetails,
    getReceiptLastRecords,
    getSundryDebtorsIndirectIncome,
    get_Payment_by_id,
    getpaymentinvoicelastrecords,
    getsundrycreditorsindirectexpenses,
} from "../../../services/api_functions";
import { getSelectValue, isActionExist } from "../../../helpers/constants";
import CustomInput from "../../../components/CustomInputs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDateInputs from "../../../components/CustomDateInputs";
import ResponseModal from "../../../components/ResponseModal";

const ClearIndicatorStyles = (base, state) => ({
    ...base,
    cursor: "pointer",
    color: state.isFocused ? "blue" : "black",
});

const typeOpts = [
    { label: "Dr", value: "dr", type: "dr" },
    { label: "Cr", value: "cr", type: "cr" },
];

const ReceiptCreate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [invoice_data, setInvoiceData] = useState("");
    const [amtledgershow, setAmtLedgerShow] = useState(false);
    const [onaccountmodal, setOnAccountModal] = useState(false);
    const [LogoType, setLogoType] = useState("");
    const [ResText, setResText] = useState("");
    const [initVal, setInitVal] = useState("");
    const [ResModal, setResModal] = useState(false);
    const [Bankaccmodal, setBankaccmodal] = useState(false);
    const [SundryCreditorLst, setSundryCreditorLst] = useState([]);
    const [CashAcbankLst, setCashAcbankLst] = useState([]);
    const [resLst, setresLst] = useState([]);
    // const [Rows, setRows] = useState([]);




    const setPaymentEditData = () => {
        // const { id } = this.state.receiptEditData;
        // console.log("receivedId", id);
        // console.log("ID", this.state.receiptEditData);
        let formData = new FormData();
        console.log("id of payment edit", location.state.id);
        formData.append("payment_id", location.state.id);
        get_Payment_by_id(formData)
            .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                    // debugger
                    console.log('res.responseStatus: ', res);
                    let { perticulars } = res;
                    let initData = {
                        payment_code: res.payment_no,
                        payment_sr_no: res.payment_sr_no,
                        transaction_dt: moment(res.tranx_date).format("yyyy-MM-DD"),
                        payment_peritculars: res.payment_peritculars[0],
                    }

                    setdebRows(res.payment_peritculars[0])
                    setRows(res.payment_peritculars)

                    let options = res.payment_peritculars.map(function (v) {
                        return {
                            id: v.ledger_id,
                            type: v.type,
                            value: v.ledger_id,
                            ledger_name: v.ledger_name,
                            label: v.ledger_name,
                            billids: [],
                        };
                    });
                    setRows(options)
                    //   setEmployeeOptData(options);
                    // let arr =res.list.map((v)=>{
                    //     id: v.id,
                    //     type: v.type,
                    //     value: v.id,
                    //     ledger_name: v.ledger_name,
                    //     label: v.ledger_name,
                    //     billids: [],
                    // })
                    // let innerrow = {
                    //     id: v.id,
                    //     type: v.type,
                    //     value: v.id,
                    //     ledger_name: v.ledger_name,
                    //     label: v.ledger_name,
                    //     billids: [],
                    // };

                    setInitVal(initData);

                    // console.log("receipt_peritculars", perticulars);
                    // let initRowData = [];

                    // if (perticulars && perticulars.length > 0) {
                    //     perticulars.map((v) => {
                    //         console.log("==='''vvvv", v.type);
                    //         let per = "";
                    //         if (v.type == "cr") {
                    //             per = getSelectValue(SundryCreditorLst, v.ledger_id);
                    //         }
                    //         if (v.type == "dr") {
                    //             per = getSelectValue(CashAcbankLst, v.ledger_id);
                    //         }
                    //         console.log("per", per);

                    //         let inner_data = {
                    //             details_id: v.details_id != 0 ? v.details_id : 0,
                    //             type: v.type != null ? getSelectValue(typeOpts, v.type) : "",
                    //             perticulars: per,
                    //             paid_amt: v.type == "cr" ? v.cr : v.dr,
                    //             bank_payment_no:
                    //                 v.paymentTranxNo != null ? v.paymentTranxNo : "",
                    //             bank_payment_type:
                    //                 v.bank_payment_type != null ? v.bank_payment_type : "",
                    //             debit: v.type == "cr" ? v.cr : "",
                    //             credit: v.type == "dr" ? v.dr : "",
                    //             narration: "",
                    //         };

                    //         initRowData.push(inner_data);
                    //     });
                    // }

                    // console.log("Edit Row ==>", initRowData);

                    // setRows(initRowData)

                }
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    };

    const navigate = useNavigate()
    const location = useLocation();

    // ... (other state variables)

    const [rows, setRows] = useState([{
        type: "cr",
        perticulars: [],
        paid_amt: "",
        // bank_payment_type: "",
        // bank_payment_no: "",
        debit: "",
        credit: 0,
        // narration: "",
    }]);
    const [debRows, setdebRows] = useState([{
        type: "dr",
        perticulars: [],
        paid_amt: "",
        // bank_payment_type: "",
        // bank_payment_no: "",
        debit: "",
        credit: 0,
        // narration: "",
    }]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // setReceiptLastRecords();
        lstgetsundrydebtors_indirectexpenses();
        // lstGetsundryDebtorsIndirectExpenses();
        lstgetcashAcbankaccount();
        setPaymentEditData()
        // initRows();
    }, []);

    useEffect(() => {
        // This effect will run whenever resText changes
        if (ResText) {
            // Check if ResText is not empty, and then open the modal
            setResModal(true);
        }
    }, [ResText]);

    // useEffect(() => {
    //   // This effect will run whenever resText changes
    //   if (rows) {
    //     // Check if ResText is not empty, and then open the modal
    //     getTotalCreditAmt()
    //   }
    // }, [rows]);

    const openModal = (text, logo_type) => {
        // Update the state to set the text
        setLogoType(logo_type);
        setResText(text);
    };

    // Function to close the modal
    const closeModal = () => {
        setResModal(false);
        setResText("");
        navigate("/Dashboard/Tranx/payment");
    };

    // Function to handle form submission with confirmation
    const handleConfirmSubmit = () => {
        // handleSubmit();
        closeModal(); // Close the modal after submission
    };
    // ... (other methods)

    const handleChangeArrayElement = (element, value, index) => {
        // debugger
        // let debitBal = 0;
        // let creditBal = 0;
        console.log({ element, value, index });
        console.log('rows: ', rows);

        const newArray = [...rows];
        // Replace the item at the specified index with the new item
        newArray[index] = value;
        // Update the state with the modified array
        setRows(newArray);


        // setRows(rows)
        // console.log("rows>>>>", rows);
        // let debitamt = 0;
        // let creditamt = 0;
        // let frows = rows.map((v, i) => {
        //     if (v["type"]["value"] === "cr") {
        //         debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        //         if (v["paid_amt"] !== "")
        //             debitBal = debitBal + parseFloat(v["paid_amt"]);
        //     } else if (v["type"]["value"] === "dr") {
        //         if (v["credit"] !== "" && !isNaN(v["credit"]))
        //             creditBal = creditBal + parseFloat(v["credit"]);
        //     }
        //     if (i === index) {
        //         if (element === "debit") {
        //             v["paid_amt"] = value;
        //             console.log("Dr value", value);
        //         } else if (element === "credit") {
        //             v["paid_amt"] = value;
        //             console.log("cr value", value);
        //         }
        //         v[element] = value;
        //         return v;
        //     } else {
        //         return v;
        //     }
        // });

        // console.log("debitBal, creditBal ", { debitBal, creditBal });
        // let lastCrBal = debitBal - creditBal;
        // console.log("lastCrBal ", lastCrBal);

        // console.log("frows", { frows });

        // if (element === "perticulars") {
        //     let obj = frows.find((v, i) => i === index);

        //     if (obj.type.value === "cr") {
        //         // FetchPendingBills(obj.perticulars.id, obj.perticulars.type, obj.perticulars.balancing_method);
        //     } else if (obj.type.value === "dr") {
        //         console.log("obj", obj);
        //         frows = rows.map((vi, ii) => {
        //             if (ii === index) {
        //                 vi["credit"] = lastCrBal;
        //                 console.log("vi", vi);
        //             }
        //             return vi;
        //         });
        //         if (obj.perticulars.type === "others") {
        //         } else if (obj.perticulars.type === "bank_account") {
        //             setBankaccmodal(true);
        //         }
        //     }
        // }
        // console.log("frows", { frows });

        // setRows(frows);
        // setIndex(index);
    };


    const getTotalDebitAmt = () => {
        // let { rows } = this.state;
        // debugger
        let debitamt = 0;
        rows.map((v) => {
            if (v.type == "dr") {
                debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
            }
        });
        return isNaN(debitamt) ? 0 : debitamt;
    };



    const getTotalCreditAmt = () => {
        // let { rows } = this.state;
        // console.log("Total Credit ", rows);
        // debugger
        let creditamt = 0;
        rows.map((v) => {
            if (v.type == "cr") {
                creditamt = parseFloat(creditamt) + parseFloat(v["paid_amt"]);
            }
        });
        return isNaN(creditamt) ? 0 : creditamt;
    };

    // const initRows = () => {
    //   let newRows = [];
    //   for (let i = 0; i < 1; i++) {
    //     let innerRow = {
    //       type: "",
    //       perticulars: "",
    //       paid_amt: "",
    //       bank_payment_type: "",
    //       bank_payment_no: "",
    //       debit: "",
    //       credit: 0,
    //       narration: "",
    //     };
    //     if (i === 0) {
    //       innerRow["type"] = getSelectValue(typeOpts, "cr");
    //     }
    //     newRows.push(innerRow);
    //   }
    //   setRows(newRows);
    // };

    const setElementValue = (element, index) => {
        // debugger
        let elementCheck = rows.find((v, i) => i === index);
        return elementCheck ? elementCheck[element] : "";
    };

    const getElementObject = (index) => {
        let elementCheck = rows.find((v, i) => i === index);
        return elementCheck ? elementCheck : "";
    };

    const handleClearPayment = (index) => {
        const newRows = [...rows];
        let data = {
            paid_amt: "",
            perticulars: "",
            credit: 0,
            debit: "",
            bank_payment_type: "",
            bank_payment_no: "",
        };
        newRows[index] = data;
        setRows(newRows);
    };

    const setReceiptLastRecords = () => {
        getpaymentinvoicelastrecords()
            .then((response) => {
                // debugger

                let res = response.data;
                if (res.responseStatus == 200) {
                    const newInitVal = { ...initVal };
                    // const { initVal } = this.state;
                    //initVal['payment_sr_no'] = res.count;
                    newInitVal["payment_sr_no"] = res.payment_sr_no;
                    newInitVal["payment_code"] = res.payment_code;
                    newInitVal["transaction_dt"] = moment(new Date()).format("yyyy-MM-DD");

                    // console.log({ initVal });
                    // this.setState({ initVal: initVal });
                    setInitVal(newInitVal);
                }
            })
            .catch((error) => {
                console.log("error", error);
            });

    };

    const lstgetsundrydebtors_indirectexpenses = () => {
        getsundrycreditorsindirectexpenses()
            .then((response) => {
                console.log("response", response);
                let res = response.data ? response.data : [];
                let resLst = [];

                if (res.responseStatus == 200) {
                    if (res.list.length > 0) {
                        res.list.map((v) => {
                            let innerrow = {
                                id: v.id,
                                //ledger_id: v.ledger_id,
                                type: v.type,
                                ledger_name: v.ledger_name,
                                balancing_method: v.balancing_method,
                                value: v.id,
                                label: v.ledger_name,
                            };
                            resLst.push(innerrow);
                        });
                    }
                    // this.setState({ sundryCreditorLst: resLst });
                    setSundryCreditorLst(resLst)
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const lstgetcashAcbankaccount = () => {
        getCashACBankAccountDetails()
            .then((response) => {
                let res = response.data ? response.data : [];
                let resLst = [];

                if (res.responseStatus == 200) {
                    if (res.list.length > 0) {
                        res.list.map((v) => {
                            let innerrow = {
                                id: v.id,
                                type: v.type,
                                value: v.id,
                                ledger_name: v.name,
                                label: v.name,
                                billids: [],
                            };
                            resLst.push(innerrow);
                        });
                    }
                    // this.setState({ cashAcbankLst: resLst });
                    setCashAcbankLst(resLst)
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };


    const getCurrentOpt = (val) => {
        // debugger
        //  
        let currentObj = rows.find((v, i) => i === val);

        if (val == 1) {
            return SundryCreditorLst;
        } else if (val == 2) {
            return CashAcbankLst;

        }
        // if (currentObj.type.value === "cr") {
        //   return SundryCreditorLst;
        // } else if (currentObj.type.value === "dr") {
        //   return CashAcbankLst;
        // }

        return [];
    };


    // ... (remaining code)

    return (
        <div>
            <div
                className="content-wrapper scrollable-div"
                style={{ position: "fixed", width: "96%" }}
            >
                <ResponseModal
                    isOpen={ResModal}
                    onRequestClose={closeModal}
                    onConfirm={() => handleConfirmSubmit()}
                    text={`${ResText}`}
                    LogoType={`${LogoType}`}
                />
                <div className="pagePathLayout row">
                    <div className="col-lg-11 header-title">
                        {/* <span className="bold">{location.pathname}</span> */}
                    </div>
                    {/* <OverlayTrigger
            placement="left"
            overlay={
              <Tooltip id="tooltip" className="tooltip-add-btn">
                Create
              </Tooltip>
            }
          > */}
                    {/* {isActionExist(
              "journal",
              "create",
              props.userPermissions
            ) && (
                <div className="col-lg-1 header-add-btn">
                  <Link to="/Dashboard/Tranx/journal-create">
                    <img src={AddBtn} alt="" className="btn-add " />
                  </Link>
                </div>
              )} */}
                    {/* </OverlayTrigger> */}
                </div>

                <div className="col-lg-12 path-label">
                    {/* <span>{name}</span> */}
                </div>
                <div className="col-lg-12 path-label2">
                    {/* <span>Manage All {name} Related Information</span> */}
                </div>

                <div className="scrollable-div-page">
                    <div>
                        <Formik
                            validateOnBlur={false}
                            validateOnChange={false}
                            initialValues={initVal}
                            enableReinitialize={true}
                            validationSchema={Yup.object().shape({
                                payment_sr_no: Yup.string()
                                    .trim()
                                    .required("Receipt no is required"),
                                payment_code: Yup.string()
                                    .trim()
                                    .required("Receipt code is required"),
                                transaction_dt: Yup.string().required(
                                    "Transaction date is required"
                                ),
                                // sundryindirectid: Yup.string().required().value,
                            })}
                            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                                // debugger
                                console.log("i am in", values);
                                console.log("rows", rows);
                                let newRow = debRows.concat(rows);
                                console.log('newRow: ', newRow);

                                console.log("debRows", debRows);
                                console.log('getTotalCreditAmt(): ', getTotalCreditAmt());
                                let amtOfTotalCred = getTotalCreditAmt()

                                // return false
                                if (parseInt(values.debitTotal) != parseInt(amtOfTotalCred)) {
                                    openModal("please match the debit and credit amt", "error")
                                }
                                // setState({
                                //   isLoading: true,
                                // });
                                setIsLoading(true)
                                setStatus();
                                if (
                                    true
                                ) {
                                    let data;
                                    console.log("values--------", values);

                                    let formData = new FormData();


                                    console.log("rows", rows);

                                    formData.append(
                                        "transaction_dt",
                                        moment().format("yyyy-MM-DD")
                                    );
                                    formData.append(
                                        "payment_sr_no",
                                        values.payment_sr_no ? values.payment_sr_no : ""
                                    );
                                    formData.append(
                                        "payment_code",
                                        values.payment_code ? values.payment_code : ""
                                    );


                                    formData.append(
                                        "totalAmt",
                                        values.debitTotal ? values.debitTotal : ""
                                    );
                                    // formData.append(
                                    //   "paid_amt",
                                    //   values.debitTotal ? values.debitTotal : ""
                                    // );
                                    formData.append(
                                        "total_amt",
                                        values.debitTotal ? values.debitTotal : ""
                                    );


                                    // static data appended

                                    formData.append(
                                        "total_invoice_amt", 0);
                                    formData.append(
                                        "tota_debit_amt", 0);
                                    formData.append(
                                        "payableAmt", 0);
                                    formData.append(
                                        "selectedAmt", 0);
                                    formData.append(
                                        "remainingAmt", 0);
                                    formData.append(
                                        "isAdvance", 0);




                                    formData.append(
                                        "row", JSON.stringify(newRow)
                                    );

                                    let total_amt = getTotalDebitAmt();
                                    // formData.append("total_amt", total_amt);

                                    if (values.narration != null) {
                                        formData.append("narration", values.narration);
                                    }
                                    // console.log(formData);
                                    // for (var pair of formData.entries()) {
                                    //   console.log(pair[0] + ", " + pair[1]);
                                    // }

                                    create_payments(formData)
                                        .then((response) => {
                                            let res = response.data;
                                            if (res.responseStatus == 200) {
                                                // ("✔" + res.message);
                                                openModal("✔" + res.message, "cnf");

                                                setSubmitting(false);
                                                resetForm();
                                                // initRows();
                                                // props.history.push("/receipt");
                                            } else {
                                                setSubmitting(false);
                                                if (response.responseStatus == 409) {
                                                    // toast.error("✘ Please Select Ledger First");
                                                    openModal("✘" + res.message, "error");

                                                } else {
                                                    openModal("✘" + res.message, "error");
                                                }
                                            }
                                        })
                                        .catch((error) => {
                                            console.log("error", error);
                                            openModal("✘" + error, "error");

                                        });
                                } else {
                                }
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
                            }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className="journalStyle mx-2">
                                        <Row>
                                            <Col md="2">
                                                {console.log('values: ', values)}

                                                <FormGroup>

                                                    <CustomInput
                                                        label="Voucher Sr No"
                                                        className={`form-control ${touched.payment_sr_no && errors.payment_sr_no
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        type="text"
                                                        onChange={handleChange}
                                                        placeholder="Voucher No"
                                                        name="payment_sr_no"
                                                        id="payment_sr_no"
                                                        value={values.payment_sr_no}
                                                    // invalid={errors.mobile ? true : false}
                                                    // onChange={handleChange}
                                                    // inputError={errors.mobile}
                                                    // onBlur={onBlur}
                                                    />
                                                    <span className="text-danger">
                                                        {errors.payment_sr_no}
                                                    </span>
                                                </FormGroup>
                                            </Col>
                                            <Col md="2">
                                                <FormGroup>

                                                    <CustomInput
                                                        label="Voucher No"
                                                        className={`form-control ${touched.payment_code && errors.payment_code
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        type="text"
                                                        onChange={handleChange}
                                                        placeholder="Voucher No"
                                                        name="payment_code"
                                                        id="payment_code"
                                                        value={values.payment_code}
                                                    // invalid={errors.mobile ? true : false}
                                                    // onChange={handleChange}
                                                    // inputError={errors.mobile}
                                                    // onBlur={onBlur}
                                                    />
                                                    <span className="text-danger">
                                                        {errors.payment_code}
                                                    </span>
                                                </FormGroup>
                                            </Col>
                                            <Col md="2">
                                                <FormGroup>

                                                    <CustomDateInputs
                                                        label="Transaction Date"
                                                        className={`form-control ${touched.transaction_dt && errors.transaction_dt
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        type="date"
                                                        id="transaction_dt"
                                                        placeholder="transaction_dt"
                                                        name="transaction_dt"
                                                        dateFormat="dd/MM/yyyy"
                                                        value={values.transaction_dt}
                                                        // invalid={errors.transaction_dt ? true : false}
                                                        onChange={handleChange}
                                                    // inputError={errors.transaction_dt}
                                                    // onBlur={onBlur}
                                                    />

                                                    <span className="text-danger">
                                                        {errors.transaction_dt}
                                                    </span>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div
                                        className="journalTblStyle"
                                    // style={{ maxHeight: "67vh", height: "67vh" }}
                                    >
                                        <Table size="sm" className="tbl-font mt-2 mb-2">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "10%", textAlign: "center" }}>
                                                        Type
                                                    </th>
                                                    <th style={{ width: "70%", textAlign: "center" }}>
                                                        Particulars
                                                    </th>

                                                    <th
                                                        style={{ width: "10%", textAlign: "center" }}
                                                        className="pl-4"
                                                    >
                                                        Debit &nbsp;
                                                    </th>
                                                    <th style={{ width: "10%", textAlign: "center" }}>
                                                        Credit &nbsp;
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody style={{ borderTop: "2px solid transparent" }}>

                                                {/* <tr className="entryrow">
                                                    <td
                                                        style={{
                                                            width: "10%",
                                                        }}
                                                    >
                                                        <FormGroup>
                                                            <Select
                                                                ////isClearable={true}
                                                                // required
                                                                onChange={(v) => {
                                                                    // this.handleChangeArrayElement(
                                                                    //   "type",
                                                                    //   v,
                                                                    //   ii
                                                                    // );
                                                                }}
                                                                isDisabled={true}
                                                                value={typeOpts[0]}
                                                                placeholder="select type"
                                                                options={typeOpts}
                                                            ></Select>
                                                        </FormGroup>
                                                    </td>

                                                    <td
                                                        style={{
                                                            width: "70%",
                                                            background: "#f5f5f5",
                                                        }}
                                                    >
                                                        {console.log('debRows: ', rows)}
                                                        <FormGroup>
                                                            <Select
                                                                className="selectTo"
                                                                components={{
                                                                    DropdownIndicator: () => null,
                                                                    IndicatorSeparator: () => null,
                                                                }}
                                                                placeholder=""
                                                                //isClearable
                                                                options={getCurrentOpt(0)}
                                                                theme={(theme) => ({
                                                                    ...theme,
                                                                    height: "26px",
                                                                    borderRadius: "5px",
                                                                })}
                                                                onChange={(v, triggeredAction) => {
                                                                    console.log({ triggeredAction });
                                                                    console.log(
                                                                        "In a Particular On Change.!",
                                                                        v
                                                                    );

                                                                    if (v != null) {
                                                                        // setdebRows([debRows.perticulars, v])
                                                                        setdebRows(prevState => {
                                                                            const newState = [...prevState]; // Create a shallow copy of the state array
                                                                            newState[0].perticulars = v; // Update the particulars field of the first item
                                                                            return newState; // Return the updated state
                                                                        });
                                                                    }
                                                                    // if (v == null) {
                                                                    //   // Clear happened
                                                                    //   console.log("clear index=>", ii);
                                                                    //   this.handleClearPayment(ii);
                                                                    // } else {
                                                                    //   this.handleChangeArrayElement(
                                                                    //     "perticulars",
                                                                    //     v,
                                                                    //     ii
                                                                    //   );
                                                                    // }
                                                                }}
                                                                value={rows && rows.length > 0 ? rows[0] : null}
                                                            // value={debRows}
                                                            />
                                                        </FormGroup>
                                                    </td>

                                                    <td
                                                        style={{
                                                            width: "10%",
                                                        }}
                                                    >
                                                        <CustomInput
                                                            type="text"
                                                            // label="Debit"
                                                            className={`form-control`}
                                                            onChange={(e) => {
                                                                setFieldValue("debitTotal", e.target.value)
                                                                setdebRows(prevState => {
                                                                    const newState = [...prevState]; // Create a shallow copy of the state array
                                                                    newState[0].debit = e.target.value; // Update the particulars field of the first item
                                                                    newState[0].paid_amt = e.target.value; // Update the particulars field of the first item
                                                                    return newState; // Return the updated state
                                                                });
                                                                // let v = e.target.value;
                                                                // this.handleChangeArrayElement(
                                                                //   "debit",
                                                                //   v,
                                                                //   ii
                                                                // );
                                                            }}
                                                            style={{ textAlign: "center" }}
                                                        // value={this.setElementValue("debit", ii)}
                                                        // readOnly={
                                                        //   this.setElementValue("type", ii) &&
                                                        //     this.setElementValue("type", ii)[
                                                        //     "value"
                                                        //     ] == "dr"
                                                        //     ? false
                                                        //     : true
                                                        // }
                                                        />
                                                    </td>
                                                    <td
                                                        style={{
                                                            width: "10%",
                                                        }}
                                                    >
                                                        <CustomInput
                                                            type="text"
                                                            className={`form-control`}
                                                            // onChange={(e) => {
                                                            //   let v = e.target.value;
                                                            //   this.handleChangeArrayElement(
                                                            //     "credit",
                                                            //     v,
                                                            //     ii
                                                            //   );
                                                            // }}
                                                            style={{ textAlign: "center" }}
                                                            readOnly={true}
                                                        // value={this.setElementValue("credit", ii)}
                                                        // readOnly={
                                                        //   this.setElementValue("type", ii) &&
                                                        //     this.setElementValue("type", ii)[
                                                        //     "value"
                                                        //     ] == "cr"
                                                        //     ? false
                                                        //     : true
                                                        // }
                                                        />
                                                    </td>
                                                </tr> */}


                                                {rows.length > 0 &&
                                                    rows.map((vi, ii) => {
                                                        return (
                                                            <tr className="entryrow">
                                                                <td
                                                                    style={{
                                                                        width: "10%",
                                                                    }}
                                                                >
                                                                    <FormGroup>
                                                                        <Select
                                                                            //isClearable={true}
                                                                            // required
                                                                            onChange={(v) => {
                                                                                handleChangeArrayElement(
                                                                                    "type",
                                                                                    v,
                                                                                    ii
                                                                                );
                                                                            }}
                                                                            value={ii == 0 ? typeOpts[0] : typeOpts[1]}
                                                                            // value={setElementValue("type", ii)}
                                                                            isDisabled={true}
                                                                            placeholder="select type"
                                                                            options={typeOpts}
                                                                        ></Select>
                                                                    </FormGroup>
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        width: "70%",
                                                                        background: "#f5f5f5",
                                                                    }}
                                                                >
                                                                    <FormGroup>
                                                                        <Select
                                                                            className="selectTo"
                                                                            components={{
                                                                                DropdownIndicator: () => null,
                                                                                IndicatorSeparator: () => null,
                                                                            }}
                                                                            placeholder=""
                                                                            //isClearable
                                                                            options={getCurrentOpt(ii == 0 ? 1 : 2)}
                                                                            theme={(theme) => ({
                                                                                ...theme,
                                                                                height: "26px",
                                                                                borderRadius: "5px",
                                                                            })}
                                                                            onChange={(v, triggeredAction) => {
                                                                                // debugger
                                                                                console.log({ triggeredAction });
                                                                                console.log(
                                                                                    "In a Particular On Change.!",
                                                                                    v
                                                                                );
                                                                                if (v == null) {
                                                                                    // Clear happened
                                                                                    console.log("clear index=>", ii);
                                                                                    handleClearPayment(ii);
                                                                                } else {
                                                                                    handleChangeArrayElement(
                                                                                        "perticulars",
                                                                                        v,
                                                                                        ii
                                                                                    );
                                                                                }
                                                                            }}
                                                                            value={rows[ii]}
                                                                        />
                                                                    </FormGroup>
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        width: "10%",
                                                                    }}
                                                                >
                                                                    <CustomInput
                                                                        type="text"
                                                                        // label="debit"
                                                                        className={`form-control`}
                                                                        onChange={(e) => {
                                                                            let v = e.target.value;
                                                                            handleChangeArrayElement(
                                                                                "debit",
                                                                                v,
                                                                                ii
                                                                            );
                                                                        }}
                                                                        style={{ textAlign: "center" }}
                                                                        value={setElementValue("debit", ii)}
                                                                        readOnly={true}
                                                                    // readOnly={
                                                                    //   setElementValue("type", ii) &&
                                                                    //     setElementValue("type", ii)[
                                                                    //     "value"
                                                                    //     ] == "cr"
                                                                    //     ? false
                                                                    //     : true
                                                                    // }
                                                                    />
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        width: "10%",
                                                                    }}
                                                                >
                                                                    <CustomInput
                                                                        type="text"
                                                                        className={`form-control`}
                                                                        onChange={(e) => {
                                                                            let v = e.target.value;
                                                                            handleChangeArrayElement(
                                                                                "credit",
                                                                                v,
                                                                                ii
                                                                            );
                                                                        }}
                                                                        style={{ textAlign: "center" }}
                                                                        value={setElementValue("credit", ii)}
                                                                    // readOnly={
                                                                    //   setElementValue("type", ii) &&
                                                                    //     setElementValue("type", ii)[
                                                                    //     "value"
                                                                    //     ] == "cr"
                                                                    //     ? false
                                                                    //     : true
                                                                    // }
                                                                    />
                                                                </td>


                                                                <td
                                                                    style={{
                                                                        width: "10%",
                                                                    }}
                                                                >

                                                                    {ii != 0 && ii == rows.length - 1 ? (
                                                                        <>
                                                                            <div
                                                                                className="col-lg-1 header-add-btn "

                                                                                onClick={() => {
                                                                                    console.log('ii: ', ii);
                                                                                    let arrVal = rows.filter((index, val) => val != ii)
                                                                                    console.log('arrVal: ', arrVal);
                                                                                    setRows(arrVal)

                                                                                }}
                                                                            >
                                                                                <img
                                                                                    src={SubstractBtn}
                                                                                    alt=""
                                                                                    className="btn-add "
                                                                                />                                      </div>

                                                                        </>
                                                                    ) : null}
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        width: "10%",
                                                                    }}
                                                                >
                                                                    {ii == rows.length - 1 ? (
                                                                        <>

                                                                            <div
                                                                                className="col-lg-1 header-add-btn "

                                                                                onClick={() => {
                                                                                    // debugger
                                                                                    if (vi.credit == "") {
                                                                                        openModal("please enter the credit amt", "error");
                                                                                        return false
                                                                                    }
                                                                                    let init = {
                                                                                        type: "cr",
                                                                                        perticulars: "",
                                                                                        // paid_amt: "",
                                                                                        // bank_payment_type: "",
                                                                                        // bank_payment_no: "",
                                                                                        debit: "",
                                                                                        credit: 0,
                                                                                        // narration: "",
                                                                                    }
                                                                                    setRows([...rows, init])

                                                                                }}                                        >
                                                                                <img src={AddBtn} alt="" className="btn-add " />
                                                                            </div>
                                                                        </>
                                                                    ) : null}

                                                                </td>
                                                            </tr>
                                                        );
                                                    })}

                                            </tbody>
                                            <thead>
                                                {/* <tr style={{ width: "70%", border: "5px solid ", marginTop: "10%" }}></tr> */}

                                                <tr style={{ background: "#DDE2ED" }}>
                                                    <td
                                                        className="pr-2 qtotalqty"
                                                        style={{ width: "10%" }}
                                                    >
                                                        {" "}
                                                        Total
                                                    </td>
                                                    <td style={{ width: "70%" }}></td>
                                                    <td
                                                        style={{
                                                            width: "10 %",
                                                        }}
                                                    >
                                                        <FormGroup>
                                                            <CustomInput
                                                                className={`form-control`}
                                                                style={{
                                                                    textAlign: "center",
                                                                    // width: "8%",
                                                                    background: "transparent",
                                                                    border: "none",
                                                                }}
                                                                type="text"
                                                                placeholder=""
                                                                name={`debitTotal`}
                                                                value={values.debitTotal}
                                                                readonly
                                                            />
                                                        </FormGroup>
                                                    </td>
                                                    <td style={{ width: "10%" }}>
                                                        {" "}
                                                        <FormGroup>
                                                            <CustomInput
                                                                className={`form-control`}
                                                                style={{
                                                                    textAlign: "center",
                                                                    //width: '8%',
                                                                    background: "transparent",
                                                                    border: "none",
                                                                }}
                                                                type="text"
                                                                placeholder=""
                                                                value={getTotalCreditAmt()}
                                                                readonly
                                                            />
                                                        </FormGroup>
                                                    </td>
                                                    {/* <td></td> */}
                                                </tr>
                                            </thead>
                                        </Table>

                                        <Row className="mb-2">
                                            <Col sm={9}>
                                                <Row className="mt-2">
                                                    {/* <Col sm={1}>
                        <label className="text-label">Narration:</label>
                      </Col> */}
                                                    <Col sm={10}>
                                                        <CustomInput
                                                            label="Narration"
                                                            className={`form-control`}
                                                            type="text"
                                                            placeholder="Enter Narration"
                                                            // style={{ height: "72px", resize: "none" }}
                                                            id="narration"
                                                            onChange={handleChange}
                                                            // rows={5}
                                                            // cols={25}
                                                            name="narration"
                                                            value={values.narration}
                                                        />

                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                        {/* <Row className="mt-2">
                      <Col className="text-end">
                        <Button type="submit" className="ms-2 submitBtn">
                          Submit
                        </Button>
                      </Col>
                    </Row> */}

                                        {/* Submit and cancel buttons */}
                                        <div>
                                            <div className="row ">
                                                <div
                                                    style={{
                                                        flex: "0 0 auto",
                                                        width: "80.666667%",
                                                        color: "#4D798B",
                                                        fontSize: " 14px",
                                                        fontStyle: " normal",
                                                        fontSeight: " 500",
                                                        lineSeight: " normal",
                                                    }}
                                                >
                                                    {/* {`label`} */}
                                                </div>
                                                <div className="col-lg-1">
                                                    <Button
                                                        className="cancel-btn"
                                                        // type="submit"
                                                        onClick={() => {
                                                            navigate("/Dashboard/Tranx/payment");
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                                <div className="col-lg-1">
                                                    <Button className="submit-btn" type="submit">
                                                        Submit
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*
                <Row className="py-1">
                  <Col className="text-end">
                    <Button type="submit" className="successbtn-style me-2">
                      Submit
                    </Button>

                    <Button
                      className="cancel-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/receipt");
                      }}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row> */}
                                </Form>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithUserPermission(ReceiptCreate);
