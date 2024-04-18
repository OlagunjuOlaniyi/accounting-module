import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetClasses,
  useGetSingleBill,
} from "../../hooks/queries/billsAndFeesMgt";
import { useState } from "react";
import "./BillsandFees.scss";
import TextInput from "../../components/Input/TextInput";
import TextInputSelectAll from "../../components/Input/TextInputSelectAll";

import ToggleUnchecked from "../../icons/ToggleUnchecked";
import ToggleChecked from "../../icons/ToggleChecked";
import { useGetSchoolDetails } from "../../hooks/queries/SchoolQuery";

import Unsend from "../../icons/Unsend";
import ViewPayment from "../../icons/ViewPayment";
import Dots from "../../icons/Dots";
import { Discount, Fee } from "../../types/types";
import {
  useSendBill,
  useUnsendBill,
} from "../../hooks/mutations/billsAndFeesMgt";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import Header from "../../components/Header/Header";
import AddCircleBlue from "../../icons/AddCircleBlue";

const SingleBill = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data } = useGetSingleBill(id);
  const { data: schoolData } = useGetSchoolDetails();

  const [addDiscount, setAddDiscount] = useState<boolean>(false);

  const fees = data && data?.fees;
  useEffect(() => {
    // Calculate the total amount
    const totalAmount = fees?.reduce(
      (total: number, fee: Fee) => Number(total) + Number(fee.amount),
      0
    );
    setTotalAmount(totalAmount);
  }, [fees]);

  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      value: 0,
      description: "",
      fee_type: "",
      amount: 0,
      is_percentage: true,
      students: [],
      classes: [],
    },
  ]);

  // const formattedDiscount = data?.fees.map((fee) => ({
  //   fee_type: fee.fee_type,
  // }));

  // console.log("discount", formattedDiscount);

  let storedClasses = JSON.parse(localStorage.getItem("classes") || "");
  let formattedStoredClasses = storedClasses?.map((c: any, index: number) => ({
    // id: c.id,
    // name: c.class_name,
    id: index,
    name: c?.name,
  }));
  const [selectedClasses] = useState<any>(formattedStoredClasses);

  const { mutate: sendBill, isLoading: sendLoading } = useSendBill();
  const { mutate: unsendBill, isLoading: unsendLoading } = useUnsendBill();

  // const formattedDiscount = data?.fees?.map(
  //   (fee: any) => fee?.fee_type?.discounts
  // );

  // const formattedDiscountNew = formattedDiscount?.map((d: any) => d[0]);
  // const formattedDiscountFinal = formattedDiscountNew?.map((d: any) => ({
  //   value: d?.value,
  //   description: d?.description,
  //   fee_type: d?.fee_type,
  //   amount: d?.amount,
  //   is_percentage: d?.is_percentage,
  //   students: d?.students,
  //   classes: d?.classes,
  // }));

  // useEffect(() => {
  //   setDiscounts(formattedDiscountFinal);
  // }, [data]);

  useEffect(() => {
    if (data) {
      // Extract discounts from bill data
      const extractedDiscounts = data.fees.map((fee: any) => ({
        value: fee?.fee_type?.discounts[0]?.value,
        description: fee?.fee_type?.discounts[0]?.description,
        fee_type: fee?.fee_type?.discounts[0]?.fee_type,
        amount: fee?.fee_type.discounts[0]?.amount,
        is_percentage: fee?.fee_type?.discounts[0]?.is_percentage,
        students: fee?.fee_type?.discounts[0]?.students,
        classes: fee?.fee_type?.discounts[0]?.classes,
      }));
      setAddDiscount(extractedDiscounts[0].value ? true : false);
      setDiscounts(extractedDiscounts);
    }
  }, [data]);

  const { data: classes } = useGetClasses();
  const formattedClasses = classes?.map((c: any, index: number) => ({
    // id: c.idx,
    // name: c?.class_field,
    id: index,
    name: c?.class_id,
  }));

  const send = () => {
    sendBill(id, {
      onSuccess: (res) => {
        close();
        toast.success(res?.detail);
        queryClient.invalidateQueries({
          queryKey: `bill-single-${id}`,
        });
      },

      onError: (e) => {
        toast.error("Error sending bill");
      },
    });
  };

  const unsend = () => {
    unsendBill(id, {
      onSuccess: (res) => {
        close();
        toast.success(res?.detail);
        queryClient.invalidateQueries({
          queryKey: `bill-single-${id}`,
        });
      },

      onError: (e) => {
        toast.error("Error unsending bill");
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
        <b style={{ color: "#010c15" }}>{data?.bill_name}</b>
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
          <h2 className="bills_overview__title">{data?.bill_name}</h2>
          <h1 className="bills_overview__approval">APPROVAL STATUS: Pending</h1>
          <h1
            className={`bills_overview__status ${data?.status}`}
          >{`STATUS: ${data?.status}`}</h1>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            disabled={sendLoading || unsendLoading}
            onClick={() => (data?.status === "sent" ? unsend() : send())}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px 12px 16px",
              borderRadius: "4px",
              border: "1px solid #E4EFF9",
            }}
          >
            <span>
              <Unsend />
            </span>
            {sendLoading || unsendLoading
              ? "Please wait"
              : data?.status === "sent"
              ? "Unsend Bill"
              : "Send Bill"}
          </button>

          <button
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
            onClick={() => {
              navigate(`/payment-status/${id}?bill_name=${data?.bill_name}`);
              localStorage.setItem(
                "bills_and_fees",
                JSON.stringify({
                  owner: data?.owner,
                  bill_id: data?.id,
                })
              );
            }}
          >
            <span>
              <ViewPayment />
            </span>
            View Payment Status
          </button>

          <Dots />
        </div>
      </div>

      <div className="bills_schoolInfo">
        <div className="bills_schoolInfo__logo">
          <img src={schoolData && schoolData?.data[0]?.arm?.logo} alt="" />
        </div>
        <div className="bills_schoolInfo__details">
          {schoolData && schoolData?.data[0]?.arm?.name}
          <br /> {data?.bill_name}
          <p className="bills_schoolInfo__details__email">
            Email: {schoolData && schoolData?.data[0]?.arm?.email}
          </p>
        </div>
      </div>

      <div className="bills_form">
        <div className="bills_form__top">
          <TextInput
            label="Bill Name"
            disabled
            placeholder="Bill Name"
            className="bills_form__top__input"
            name="billName"
            type="text"
            errorClass={"error-msg"}
            handleChange={""}
            value={data && data?.bill_name}
            fieldClass={"input-field"}
            errorMessage={""}
            id={"billName"}
            onSelectValue={() => ""}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={""}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={[]}
          />

          <TextInput
            label="Bill Due Date"
            disabled
            placeholder="Bill Name"
            name="dueDate"
            type="date"
            errorClass={"error-msg"}
            handleChange={""}
            value={data && data?.due_date}
            fieldClass={"input-field"}
            errorMessage={""}
            id={"dueDate"}
            onSelectValue={function (): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={""}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={[]}
          />
        </div>
        {/* session and term */}
        <div className="bills_form__top">
          <TextInput
            label="Term"
            placeholder="Term"
            className="bills_form__top__input"
            name="term"
            type="text"
            fieldClass={"input-field"}
            errorClass={"error-msg"}
            handleChange={""}
            value={data && data?.term}
            errorMessage={""}
            id={"term"}
            onSelectValue={function (): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={""}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={[
              { id: 1, name: "Second term 2023/2024" },
              { id: 2, name: "Third term 2023/2024" },
              { id: 3, name: "First term 2023/2024" },
              { id: 4, name: "Second term 2024/2025" },
            ]}
            disabled
          />

          <TextInput
            label="Session"
            placeholder="Session"
            name="session"
            type="text"
            errorClass={"error-msg"}
            handleChange={""}
            value={data && data?.session}
            fieldClass={"input-field"}
            errorMessage={""}
            id={"session"}
            onSelectValue={function (): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={""}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={[]}
            disabled
          />
        </div>
      </div>

      <div className="bills_form__other_form">
        <div className="bills_form__other_form__header">
          <p>ASSIGNED CLASS</p>
          <p>TOTAL BILL AMOUNT</p>
        </div>

        <div className="bills_form__top">
          <TextInputSelectAll
            label=""
            placeholder="Assign Bill to class"
            name="classes"
            type="dropdown"
            errorClass={"error-msg"}
            handleChange={""}
            value={""}
            fieldClass={""}
            errorMessage={""}
            id={"classes"}
            onSelectValue={() => ""}
            isSearchable={false}
            handleSearchValue={() => ""}
            searchValue={""}
            handleBlur={""}
            multi={true}
            toggleOption={function (a: any): void {}}
            selectedValues={selectedClasses}
            options={formattedClasses}
            disabled
          />

          <TextInput
            label=""
            placeholder=""
            name="amount"
            type="text"
            errorClass={"error-msg"}
            handleChange={() => {}}
            value={totalAmount?.toLocaleString()}
            fieldClass={"input-field"}
            errorMessage={""}
            id={"amount"}
            onSelectValue={function (): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={""}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={[]}
            disabled={true}
          />
        </div>

        <div className="bills_form__other_form__addons">
          <div className="bills_form__other_form__addons__addFee">
            {fees?.map((fee: any, index: any) => {
              return (
                <div
                  key={index}
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="bills_form__other_form__addons__addFee__input">
                      <label>Fee Type</label>
                      <div className="bills_form__other_form__addons__addFee__input__wrapper">
                        <input
                          className="bills_form__other_form__addons__addFee__input__wrapper__input"
                          type="text"
                          name=""
                          id=""
                          value={fee.fee_type.name}
                          disabled
                          placeholder="type or select fee type"
                        />
                      </div>
                    </div>
                    <div className="bills_form__other_form__addons__addFee__input">
                      <div className="bills_form__other_form__addons__addFee__input__wrapper">
                        <input
                          className="bills_form__other_form__addons__addFee__input__wrapper__input"
                          type="text"
                          name=""
                          id=""
                          placeholder="Amount"
                          value={Number(fee.amount).toLocaleString()}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                    }}
                  >
                    {fee.mandatory ? (
                      <button>
                        <ToggleUnchecked />
                      </button>
                    ) : (
                      <button>
                        <ToggleChecked />
                      </button>
                    )}
                    Optional
                  </div>
                </div>
              );
            })}
            {/* <div
              key={""}
              style={{
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: "20px",
                }}
              >
                <div className="bills_form__other_form__addons__addFee__input">
                  <label>Fee Type</label>
                  <input
                    type="text"
                    name=""
                    id=""
                    // value={fee.fee_type.name}
                    // onChange={(e) =>
                    //   handleFeeTypeChange(index, "name", e.target.value)
                    // }
                    placeholder="type or select fee type"
                  />
                </div>
                <div className="bills_form__other_form__addons__addFee__input">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Amount"
                      // value={fee.amount}
                      // onChange={(e) =>
                      //   handleAmountChange(index, e.target.value)
                      // }
                    />

                    <button>
                      <DeleteRed />
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                }}
              >
                <button>
                  <ToggleUnchecked />
                </button>
                Optional
              </div>
            </div> */}
          </div>

          {/* <p onClick={() => setAddDiscount(!addDiscount)}>
            <AddCircleBlue />
            Add Discount
          </p> */}

          {discounts?.length > 0 &&
            addDiscount &&
            discounts?.map((d, index) => (
              <div className="bills_form__other_form__addons__addDiscount">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    className="bills_form__other_form__addons__addFee__input"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <label>Discount</label>
                    <div className="bills_form__other_form__addons__addFee__input__wrapper">
                      <input
                        className="bills_form__other_form__addons__addFee__input__wrapper__input"
                        type="text"
                        name=""
                        id=""
                        value={d.value}
                        // onChange={(e) =>
                        //   handleDiscountChange(index, "value", e.target.value)
                        // }
                        placeholder="type or select fee type"
                        disabled
                      />

                      <button>
                        <AddCircleBlue />
                      </button>
                    </div>
                  </div>
                  Off
                  <div style={{ position: "relative" }}>
                    <div className="bills_form__other_form__addons__addDiscount__input">
                      <input
                        type="text"
                        name=""
                        id=""
                        value={d.fee_type}
                        placeholder="Select fee type"
                        disabled
                        // onClick={() =>
                        //   setShowDiscountDropdown(!showDiscountDropdown)
                        // }
                        // onClick={(e) => {
                        //   setShowDiscountDropdown(!showDiscountDropdown);
                        //   showClassesForDiscountFeeType(index);
                        //   // setDiscountIndex(index);
                        // }}
                        // onChange={(e) => {
                        //   setDiscountIndex(index);
                        //   handleDiscountChange(
                        //     index,
                        //     "fee_type",
                        //     e.target.value
                        //   );
                        // }}
                      />
                    </div>
                  </div>
                  —
                  <div className="bills_form__other_form__addons__addDiscount__input">
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder=""
                      disabled
                      // value={discountedAmount ? discountedAmount : 0}
                      value={d.amount}
                    />
                  </div>
                  <div className="bills_form__other_form__addons__addDiscount__input">
                    <input
                      type="text"
                      name=""
                      id=""
                      value={d.description}
                      placeholder="Reason for discount"
                      disabled
                      // onChange={(e) =>
                      //   handleDiscountChange(
                      //     index,
                      //     "description",
                      //     e.target.value
                      //   )
                      // }
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                  }}
                >
                  {d.is_percentage ? (
                    <button
                    // onClick={() =>
                    //   handleDiscountChange(
                    //     index,
                    //     "is_percentage",
                    //     !d.is_percentage
                    //   )
                    // }
                    >
                      <ToggleChecked />
                    </button>
                  ) : (
                    <button
                    // onClick={() =>
                    //   handleDiscountChange(
                    //     index,
                    //     "is_percentage",
                    //     !d.is_percentage
                    //   )
                    // }
                    >
                      <ToggleUnchecked />
                    </button>
                  )}
                  Percentage
                </div>
              </div>
            ))}

          {/* {addDiscount && discount.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                      color: "rgba(67, 154, 222, 1)",
                      marginTop: "20px",
                      cursor: "pointer",
                    }}
                    // onClick={handleAddDiscount}
                  >
                    <AddCircleBlue />
                    Add Another Discount
                  </div>
                )}
              </div>
            )} */}
          {/* </div> */}
          {/* )} */}
          {/* 
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {partPayment ? (
              <button onClick={() => setPartPayment(!partPayment)}>
                <ToggleChecked />
              </button>
            ) : (
              <button onClick={() => setPartPayment(!partPayment)}>
                <ToggleUnchecked />
              </button>
            )}

            <p
              style={{
                margin: "0",
                padding: "0",
                fontSize: "14px",
                color: "black",
              }}
            >
              Click to allow part payment of school bill
            </p>
          </div> */}
        </div>

        <div className="bills_form__other_form__note">
          <label>Notes</label>
          <textarea
            name=""
            id=""
            disabled
            cols={0}
            rows={10}
            placeholder="Add Notes"
            style={{
              width: "100%",
              height: "100px",
              background: "rgba(250, 250, 250, 1)",
              padding: "20px",
              borderRadius: "5px",
              border: "1px solid rgba(1, 12, 21, 0.1)",
            }}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default SingleBill;
