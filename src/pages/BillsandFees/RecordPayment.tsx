import { useNavigate, useParams } from "react-router";
import ViewPayment from "../../icons/ViewPayment";
import "./BillsandFees.scss";
import { useGetSchoolDetails } from "../../hooks/queries/SchoolQuery";
import Dots from "../../icons/Dots";
import Export from "../../icons/Export";
import Header from "../../components/Header/Header";
import FeeItem from "../../components/FeeItem/FeeItem";
import { useGetStudentsBills } from "../../hooks/queries/billsAndFeesMgt";
import TextInput from "../../components/Input/TextInput";
import { useEffect, useState } from "react";
import Cash from "../../icons/Cash";
import Bank from "../../icons/Bank";
import Credit from "../../icons/Credit";
import Wallet from "../../icons/Wallet";
import Caution from "../../icons/Caution";
import {
  useRecordPayment,
  useSendReminder,
  useSendstudentReminder,
} from "../../hooks/mutations/billsAndFeesMgt";
import toast from "react-hot-toast";
import { useGetBankList } from "../../hooks/queries/banks";
import axios from "axios";
import { useQuery } from "react-query";
// import { fetchStudentBill } from "../../services/billsServices";

const fetchStudentBill = async (admNum: any, idxValue: any) => {
  const baseUrl = "https://edves.cloud/api/v1/payments/student_bills/";
  const queryParams = new URLSearchParams();
  queryParams.append("idx", idxValue);
  let dataToSend = { idx: idxValue };

  const url = `${baseUrl}${admNum}/`;
  // const url = `${baseUrl}${admNum}/?${idxValue}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch student bill");
  }
};

const RecordPayment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const queryParams = new URLSearchParams(location.search);

  let bill_name = queryParams.get("bill_name");
  let admNum = queryParams.get("adm_num");

  let admNumValue = JSON.parse(localStorage.getItem("adm_num") || admNum);

  const { data: schoolData } = useGetSchoolDetails();

  let info = { idx: schoolData?.data[0]?.arm?.idx, adm_num: admNumValue };
  let idxLocalValue = JSON.parse(localStorage.getItem("userDetails") || "");

  // const { data } = useGetStudentsBills(admNumValue || "");

  const idxValue = idxLocalValue?.idx || schoolData?.data[0]?.idx;
  // const { data } = useGetStudentsBills(admNumValue || "");

  const { data } = useQuery(["studentBill", admNumValue, idxValue], () =>
    fetchStudentBill(admNumValue, idxValue)
  );

  const schoolDetailsLocal = JSON.parse(
    localStorage.getItem("userDetails") || ""
  );

  // const getStudent = () => {
  //   let dataToSend = {
  //     idx: schoolData?.data[0]?.arm?.idx,
  //   };
  //   console.log("long", schoolData?.data[0]?.arm?.idx);
  //   axios
  //     .post(
  //       `https://edves.cloud/api/v1/payments/student_bills/${admNumValue}`,
  //       dataToSend
  //     )
  //     .then((res) => {
  //       console.log("response", res);
  //       // window.open(res.data.pdf_url, "_blank");
  //     });
  // };

  // useEffect(() => {
  //   getStudent();
  // }, [schoolData?.data[0]?.arm?.idx, admNumValue]);

  let bills_and_fees = JSON.parse(localStorage.getItem("bills_and_fees") || "");

  const [fields, setFields] = useState<any>({
    payment_method: "",
    amount_paid: "",
    bank: "",
  });

  const [checkedPaymentId, setCheckedPaymentId] = useState([]);

  const handleChange = (evt: any) => {
    const value = evt.target.value;

    setFields({
      ...fields,
      [evt.target.name]: value
        .replace(/,/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    });
  };

  const [bankId, setBankId] = useState("");
  const { data: bank_accounts } = useGetBankList();

  const formattedBankAccounts = bank_accounts?.data?.map(
    (b: { id: any; account_name: any }) => ({
      id: b.id,
      name: b.account_name,
    })
  );

  // download invoice
  const download = () => {
    axios
      .post(
        `https://edves.cloud/api/v1/payments/student_invoice/${admNumValue}`
      )
      .then((res) => {
        console.log("response", res);
        window.open(res.data.pdf_url, "_blank");
      })
      .catch((error) => {
        console.error("Error occurred during download:", error);
      });
  };

  // select value from dropdown
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
    // setSelectedGroupId(id);
    if (name === "bank") {
      setBankId(id);
    }
  };

  // console.log("data", data?.wallet_balance);

  const transformedArray = data?.bills?.map((item: any, index: number) => {
    const feeType = index + 1;

    return {
      // student_payment_id: item.fees[bill_name || ""]?.payment_id,
      student_payment_id: item.fees?.payment_id,
      fee_type: feeType,
      bill_id: bills_and_fees?.bill_id,

      student: data?.student_details,
      owner: bills_and_fees?.owner,
      channel: "Online Payment",
      user: null,
      fee_name: item.fees[bill_name || ""]?.fee_type_name,
      mandatory: item.fees[bill_name || ""]?.mandatory,
      discount: item.fees[bill_name || ""]?.has_discount,
      fee_amount: item.fees[bill_name || ""]?.fee_amount,
      discount_amount: item.fees[bill_name || ""]?.total_discount_amount,
    };
  });

  // const studentPaymentArray = data?.bills?.map(
  //   (item: any, index: number) => item.fees?.payment_id
  // );

  // console.log("payment id", checkedPaymentId);

  const studentBill = data?.bills?.map((item: any) => ({
    student_payment_id: item.fees?.payment_id,
    fee_name: item?.fees?.fee_type_name,
    fee_amount: item?.fees?.total_outstanding,
    amount_paid: item?.fees?.amount_paid,
    total_amount: item?.fees?.original_fee_amount,
    discount_amount: item?.fees?.total_discount_amount,
    status: item?.fees?.status,
    discount: item?.fees?.total_discount_amount,
    reason: item?.fees?.discount_reason,
    mandatory: item?.fees?.mandatory,
  }));

  const { mutate, isLoading } = useRecordPayment();

  const submit = () => {
    const updatedArray = transformedArray.map((item: any) => ({
      ...item,
      student_payment_id: checkedPaymentId,
      amount_paid: Number(fields?.amount_paid.replace(/,/g, "")),
      payment_method:
        fields.payment_method.props.children[1] === "Bank"
          ? bankId
          : fields.payment_method.props.children[1],
    }));

    if (checkedPaymentId.length === 0) {
      toast.error("Please check the fee(s) you wish to pay");
      return;
    }
    mutate(
      // { payments: updatedArray },
      {
        payments: [
          {
            student_payment_id: checkedPaymentId,
            amount_paid: Number(fields?.amount_paid.replace(/,/g, "")),
            payment_method:
              fields.payment_method.props.children[1] === "Bank"
                ? bankId
                : fields.payment_method.props.children[1].toLowerCase() ===
                  "wallet"
                ? data?.wallet_account_number
                : fields.payment_method.props.children[1],
          },
        ],
      },
      {
        onSuccess: (res) => {
          console.log(res);
          close();
          toast.success(res?.detail);

          setFields({ ...fields });
          // navigate("/bills-fees-management");
          navigate(
            `/student-bill/${id}?adm_num=${admNumValue}?bill_name=${bill_name}`
          );
        },

        onError: (e: any) => {
          toast.error(e?.response.data.detail || "error occured");
        },
      }
    );
  };

  const { mutate: sendStudentReminder, isLoading: sendLoading } =
    useSendstudentReminder(admNumValue || "");
  const onSendStudentReminder = () => {
    let dataToSend = {};

    sendStudentReminder(admNumValue, {
      onSuccess: (res) => {
        toast.success(res.details);
      },

      onError: (e) => {
        toast.error(e?.response.data.message || "error occured");
      },
    });
  };

  return (
    <div>
      <Header />
      <p
        className="sm-test"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "16px" }}
      >
        Bills and Fees Management /
        <b style={{ color: "#010c15" }}>{bill_name}</b>
      </p>
      <div
        className="bills_overview"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <h2 className="bills_overview__title">
            {/* {bill_name} */}
            {`${data?.student_details?.firstname} ${data?.student_details?.lastname}`}
          </h2>
          <h1
            className="bills_overview__approval"
            style={{ background: "#ADFF87" }}
          >
            APPROVAL STATUS: Approved
          </h1>
          <h1 className={`bills_overview__status `}>
            {`STATUS: `}
            {/* ${data?.bills[0]?.fees?.status} */}
          </h1>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px 12px 16px",
              borderRadius: "4px",
              border: "1px solid #E4EFF9",
            }}
            onClick={download}
          >
            <span>
              <Export />
            </span>
            Download
          </button>

          <button
            disabled={sendLoading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 16px 10px 16px",
              borderRadius: "4px",
              background: "#439ADE",
              color: "white",
              width: "185px",
            }}
            onClick={() => onSendStudentReminder()}
          >
            <span>
              <ViewPayment />
            </span>
            {sendLoading ? "Sending..." : "Send Reminder"}
          </button>

          <Dots />
        </div>
      </div>

      <div className="bills_schoolInfo">
        <div className="bills_schoolInfo__logo">
          <img
            src={schoolData?.data[0]?.arm?.logo || schoolDetailsLocal?.logo}
            alt=""
          />
        </div>
        <div className="bills_schoolInfo__details">
          {schoolData?.[0]?.arm?.name || schoolDetailsLocal?.name}
          <p style={{ fontSize: "22px" }}>
            {schoolData?.data[0]?.arm?.address || schoolDetailsLocal?.address}
          </p>
          {bill_name}
          <p className="bills_schoolInfo__details__email">
            Email:{" "}
            {schoolData?.data[0]?.arm?.email || schoolDetailsLocal?.contact}
          </p>
        </div>
      </div>

      <div className="record-payment-header">
        <h3 className="flex-item">FEE TYPE</h3>
        <h3 className="flex-item">DISCOUNT</h3>
        <h3 className="flex-item">REASON FOR DISCOUNT</h3>
        <h3 className="flex-item">AMOUNT PAID</h3>
        <h3 className="flex-item">AMOUNT DUE</h3>
        <h3 className="flex-item">TOTAL AMOUNT</h3>
      </div>
      {studentBill?.map((el: any, index: number) => (
        <FeeItem
          key={index}
          payment_id={el?.student_payment_id}
          name={el?.fee_name}
          mandatory={el?.mandatory}
          discount={el?.discount}
          amount={el?.fee_amount}
          amount_paid={el?.amount_paid}
          total_amount={el?.total_amount}
          reason={el?.reason}
          discount_amount={el?.discount_amount}
          status={el?.status}
          setCheckedPaymentId={setCheckedPaymentId}
          checkedPaymentId={checkedPaymentId}
          currency={schoolData?.data[0]?.currency}
          page="record"
        />
      ))}
      <div className="record-payment-footer">
        <h3>TOTAL BILL AMOUNT</h3>
        <h3>NGN {Number(data?.total_outstanding_balance)?.toLocaleString()}</h3>
      </div>
      <div className="record-payment-amount-paid">
        <h3>AMOUNT PAID</h3>
        <TextInput
          type={"text"}
          name={"amount_paid"}
          handleChange={handleChange}
          fieldClass={"input-field"}
          errorClass={""}
          errorMessage={""}
          label={""}
          id={""}
          placeholder={"Amount paid"}
          onSelectValue={selectValue}
          isSearchable={false}
          handleSearchValue={() => {}}
          searchValue={""}
          handleBlur={undefined}
          multi={false}
          toggleOption={() => {}}
          selectedValues={undefined}
          value={fields.amount_paid}
        />
      </div>
      <div className="record-payment-amount-paid">
        <h3>PAYMENT METHOD</h3>

        <TextInput
          type={"dropdown"}
          name={"payment_method"}
          handleChange={handleChange}
          fieldClass={""}
          errorClass={""}
          errorMessage={""}
          label={""}
          id={""}
          placeholder={""}
          onSelectValue={selectValue}
          isSearchable={false}
          handleSearchValue={() => {}}
          searchValue={""}
          handleBlur={undefined}
          multi={false}
          value={fields.payment_method}
          toggleOption={() => {}}
          selectedValues={undefined}
          options={[
            {
              id: 1,
              name: (
                <div className="payment-method-dropdown">
                  <Cash />
                  Cash
                </div>
              ),
            },
            {
              id: 2,
              name: (
                <div className="payment-method-dropdown">
                  <Bank />
                  Bank
                </div>
              ),
            },
            // {
            //   id: 3,
            //   name: (
            //     <div className="payment-method-dropdown">
            //       <Credit />
            //       Credit
            //     </div>
            //   ),
            // },
            {
              id: 4,
              name: (
                <div className="payment-method-dropdown">
                  <Wallet />
                  Wallet
                </div>
              ),
            },
          ]}
        />
        {fields.payment_method?.props?.children[1]?.toLowerCase() ===
          "wallet" && (
          <span
            style={{
              color: "#FFA800",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 5,
              position: "absolute",
              right: "50px",
              marginTop: "65px",
            }}
          >
            <Caution />
            You have a total of in NGN {data?.wallet_balance} <br />
            your wallet
          </span>
        )}
      </div>

      {fields.payment_method?.props?.children[1]?.toLowerCase() === "bank" && (
        <div className="record-payment-amount-paid unique">
          <h3>BANK ACCOUNTS</h3>

          <TextInput
            label=""
            placeholder="Select bank account"
            name="bank"
            type="dropdown"
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.bank}
            fieldClass={""}
            errorMessage={""}
            id={"bank"}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={undefined}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            options={formattedBankAccounts}
            selectedValues={undefined}
          />
        </div>
      )}

      <div
        className="record-payment-footer"
        style={{
          border: "none",
          borderTop: "1px solid rgba(1, 12, 21, 0.1)",
          marginTop: "32px",
          paddingTop: "32px",
        }}
      >
        <h3>Cancel</h3>
        <button
          disabled={isLoading}
          onClick={submit}
          style={{
            background: "#439ADE",
            color: "white",
            padding: "16px 20px",
            borderRadius: "5px",
          }}
        >
          {isLoading ? "Recording Payment..." : "Record Payment"}
        </button>
      </div>
    </div>
  );
};

export default RecordPayment;
