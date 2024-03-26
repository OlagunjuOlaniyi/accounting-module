import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Cancel from "../../../icons/Cancel";
import { Imodal } from "../../../types/types";
import TextInput from "../../Input/TextInput";
import TextInputCustom from "../../Input/TextInputCustom";
import "../Inventory/inventory.scss";
// import "./BillsAndFees.scss";

import Cash from "../../../icons/Cash";
import Bank from "../../../icons/Bank";

import toast from "react-hot-toast";

import { useQueryClient } from "react-query";

import { useGetBankList } from "../../../hooks/queries/banks";
import Credit from "../../../icons/Credit";
import TouchAppIcon from "../../../assets/icon.png";

import { useNavigate, useParams } from "react-router";
import { useRunPayroll } from "../../../hooks/mutations/payroll";
import { useStaffDetails } from "../../../hooks/queries/SchoolQuery";
import { useGetStudentsBills } from "../../../hooks/queries/billsAndFeesMgt";
import Button from "../../Button/Button";
import { waiveBill } from "../../../services/billsServices";
import { useWaiveBill } from "../../../hooks/mutations/billsAndFeesMgt";
import AddCircleBlue from "../../../icons/AddCircleBlue";

const ApplyOverPayment = ({ modalIsOpen, closeModal, id, studentNo }: any) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<any>([]);
  const [selectedTypes, setSelectedTypes] = useState<any>([]);

  const { data } = useGetStudentsBills(studentNo || "");

  // useEffect(() => {}, [data]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "40%",
      height: "95vh",
      textAlign: "center",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0px",
    },
  };

  //toggle dropdown selection
  const toggleOption = (option: any) => {
    setSelected((prevSelected: any) => {
      // if it's in, remove
      const newArray = [...prevSelected];
      if (newArray.filter((e) => e.id === option.id).length > 0) {
        return newArray.filter((item) => item.id != option.id);
        // else, add
      } else {
        newArray.push(option);
        return newArray;
      }
    });
  };
  const toggleTypesOption = (option: any) => {
    setSelectedTypes((prevSelected: any) => {
      // if it's in, remove
      const newArray = [...prevSelected];
      if (newArray.filter((e) => e.id === option.id).length > 0) {
        return newArray.filter((item) => item.id != option.id);
        // else, add
      } else {
        newArray.push(option);
        return newArray;
      }
    });
  };

  const close = () => {
    closeModal(true);
  };

  type StateProps = {
    paymentMethod: any;
    amount: string;
    description: string;
    dateOfTransaction: string;
    bank: string;
    quantity: string;
    name: string;
    product_group_name: string;
    product_category_name: string;
    reOrderLevel: string;
    size: string;
    ppu: string;
    spu: string;
    total: string;
  };

  let todaysDate = new Date().toISOString().substring(0, 10);

  const [fields, setFields] = useState({
    studentName: "",
    amount: 0,
  });

  const [errors, setErrors] = useState({
    quantity: "",
    paymentMethod: "",
    amount: "",
    description: "",
    dateOfTransaction: "",
    bank: "",
    name: "",
    product_group_name: "",
    product_category_name: "",
    reOrderLevel: "",
    size: "",
    ppu: "",
    spu: "",
    total: "",
  });

  //component states

  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [bankId, setBankId] = useState("");

  //set error on input blur
  const handleBlur = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;

    if (!value) {
      setErrors({
        ...errors,
        [evt.target.name]: `Field cannot be empty`,
      });
    } else {
      setErrors({
        ...errors,
        [evt.target.name]: ``,
      });
    }
  };

  const { mutate, isLoading } = useRunPayroll(id || "");
  const { mutate: waiveBill } = useWaiveBill(id || "");

  const { data: bank_accounts } = useGetBankList();
  const { data: staffData } = useStaffDetails();

  const formattedBankAccounts = bank_accounts?.data?.map(
    (b: { id: any; account_name: any }) => ({
      id: b.id,
      name: b.account_name,
    })
  );

  // select value from dropdown
  //   const selectValue = (option: string, name: string, id: string) => {
  //     setFields({ ...fields, [name]: option });
  //     setSelectedGroupId(id);
  //     if (name === "bank") {
  //       setBankId(id);
  //     }
  //   };
  const [selectedStudent, setSelectedStudent] = useState<any>([]);

  const toggleStudent = (option: any) => {
    setSelectedStudent((prevSelected: any) => {
      // if it's in, remove
      const newArray = [...prevSelected];
      //   newArray.push(option);
      //   return newArray;

      if (newArray.filter((e) => e.id === option.id).length > 0) {
        return newArray.filter((item) => item.id != option.id);
        // else, add
      } else {
        newArray.push(option);
        return newArray;
      }
    });
  };

  const [addStudent, setAddStudent] = useState<boolean>(false);
  const [student, setStudent] = useState([
    {
      name: "",
      amount: 0,
    },
  ]);

  const selectValue = (option: string, name: string, id: any) => {
    console.log(option.props.children);
    const updatedStudent = student.map((stud, i) =>
      i === id
        ? {
            ...stud,

            name: option.props.children,
          }
        : stud
    );
    setStudent(updatedStudent);

    // setFields({ ...fields, [name]: option });
    // setSelectedGroupId(id);
    // if (name === "bank") {
    //   setBankId(id);
    // }
  };

  //handle field change
  const handleChange2 = (evt: any, index) => {
    const value = evt.target.value;

    const updatedStudent = student.map((stud, i) =>
      i === index
        ? {
            ...stud,
            // discount_amount: discountedAmount,
            [evt.target.name]: value,
          }
        : stud
    );
    setStudent(updatedStudent);

    // setFields({
    //   ...fields,
    //   [evt.target.name]: value,
    // });
  };
  const handleChange = (evt: any) => {
    const value = evt.target.value;

    setFields({
      ...fields,
      [evt.target.name]: value,
    });
  };

  console.log("data", student);

  const handleAddStudent = () => {
    const newStudent = {
      name: "",
      amount: 0,
    };

    setStudent([...student, newStudent]);
  };

  const waive = () => {
    let dataToSend = {
      admission_number: studentNo,
    };

    waiveBill(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success(res?.detail);
        queryClient.invalidateQueries({
          queryKey: `waive-bill`,
        });
      },

      onError: (e) => {
        toast.error("Error Waiving bill");
      },
    });
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="">
        <div>
          <div style={{ background: "#FBFDFE", textAlign: "left" }}>
            <div className="record-income__cancel">
              <button className="record-income__cancel__btn" onClick={close}>
                <Cancel />
              </button>
            </div>
            <div className="record-income__heading">
              <h4>Apply Overpayment</h4>
              <p>
                Select the student name, amount, and date of transaction of the
                bill you want
                <br /> to settle
              </p>
            </div>
          </div>
        </div>

        <div className="record-income__body">
          <div className="record-income__body__title">
            <h2>Parent Name</h2>
          </div>

          <div style={{ textAlign: "left" }}>
            {student.length > 0 &&
              student.map((s, index) => (
                <>
                  <TextInputCustom
                    label="Student Name"
                    placeholder="Select student name"
                    className="bills_form__top__input"
                    name="studentName"
                    type="dropdown"
                    fieldClass={"input-field"}
                    errorClass={"error-msg"}
                    handleChange={(evt) => handleChange2(evt, index)}
                    value={s.name}
                    errorMessage={""}
                    id={"studentName"}
                    onSelectValue={selectValue}
                    isSearchable={true}
                    handleSearchValue={function (): void {}}
                    searchValue={""}
                    handleBlur={""}
                    multi={false}
                    toggleOption={function (a: any): void {
                      throw new Error("");
                    }}
                    selectedValues={undefined}
                    // options={[
                    //   { id: 1, name: "Second term 2023/2024" },
                    //   { id: 2, name: "Third term 2023/2024" },
                    //   { id: 3, name: "First term 2023/2024" },
                    //   { id: 4, name: "Second term 2024/2025" },
                    // ]}
                    options={[
                      {
                        id: 0,
                        name: (
                          <div className="payment-method-dropdown">
                            {/* <Timeline /> */}
                            Third term 2022/2023
                          </div>
                        ),
                      },
                      {
                        id: 1,
                        name: (
                          <div className="payment-method-dropdown">
                            {/* <Bank /> */}
                            First term 2023/2024
                          </div>
                        ),
                      },

                      {
                        id: 2,
                        name: (
                          <div className="payment-method-dropdown">
                            {/* <Credit /> */}
                            Second term 2023/2024
                          </div>
                        ),
                      },
                      {
                        id: 3,
                        name: (
                          <div className="payment-method-dropdown">
                            {/* <Credit /> */}
                            Third term 2023/2024
                          </div>
                        ),
                      },
                    ]}
                  />

                  <TextInput
                    label="Amount"
                    placeholder="Amount (NGN)"
                    className="bills_form__top__input"
                    name="amount"
                    type="text"
                    fieldClass={"input-field"}
                    errorClass={"error-msg"}
                    handleChange={(evt) => handleChange2(evt, index)}
                    value={s.amount}
                    errorMessage={""}
                    id={"amount"}
                    onSelectValue={selectValue}
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
                  />
                </>
              ))}

            <div
              onClick={handleAddStudent}
              //   onClick={() => setAddStudent(!addStudent)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
                color: "rgba(67, 154, 222, 1)",
                marginTop: "20px",
                cursor: "pointer",
              }}
            >
              <AddCircleBlue />
              Add Another Student
            </div>

            <div style={{ marginTop: "20px" }}>
              <TextInput
                label="Date of Transaction"
                placeholder="Transaction date"
                name="dueDate"
                type="date"
                errorClass={"error-msg"}
                handleChange={handleChange}
                value={""}
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
          </div>
        </div>
        {/* footer */}
        <div className="billsandFees_footer">
          {/* <button onClick={close}>No, Keep Bill</button> */}
          {/* <button onClick={() => waive()}>Yes, Waive Bill</button> */}
          <Button
            btnText="Apply"
            btnClass="btn-primary"
            width="100%"
            icon={""}
            disabled={false}
            onClick={() => waive()}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ApplyOverPayment;
