import React, { useState } from "react";
import Modal from "react-modal";
import Cancel from "../../../icons/Cancel";
import { Imodal } from "../../../types/types";
import TextInput from "../../Input/TextInput";
import "../../Modals/IncomeAndExpense/recordincome.scss";

import { useQueryClient } from "react-query";
import toast from "react-hot-toast";

import { useGetBanks } from "../../../hooks/queries/banks";
import { useAddBank } from "../../../hooks/mutations/bank";

const BankModal = ({ modalIsOpen, closeModal }: Imodal) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSearch = (evt: any) => {
    setSearchValue(evt.target.value);
  };
  const queryClient = useQueryClient();
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0px",
      width: "500px",
      height: "auto",
    },
  };

  const close = () => {
    closeModal("income");
  };

  type StateProps = {
    // account_name: string;
    account_type: string;
    account_number: string;
    bank: string;
  };

  const [fields, setFields] = useState<StateProps>({
    // account_name: "",
    account_type: "",
    account_number: "",
    bank: "",
  });

  const [bankId, setBankId] = useState<string>("");
  const [errors, setErrors] = useState({
    // account_name: "",
    account_type: "",
    account_number: "",
    bank: "",
  });

  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
    setBankId(id);
  };

  //handle field change
  const handleChange = (evt: any) => {
    const value = evt.target.value;
    setFields({
      ...fields,
      [evt.target.name]: value,
    });
  };

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

  const { mutate, isLoading } = useAddBank();

  const { data: banks } = useGetBanks();

  //submit form
  const submit = () => {
    let dataToSend = {
      // name: fields.bank,
      bank: bankId.toString(),
      account_type: fields.account_type.toUpperCase(),
      account_number: fields.account_number,
      // account_name: fields.account_name,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success("Details recorded successfully");
        queryClient.invalidateQueries({
          queryKey: `banks`,
        });

        setFields({
          // account_name: "",
          account_type: "",
          account_number: "",
          bank: "",
        });
      },

      onError: (e) => {
        toast.error(
          "Error recording transaction \nPlease make sure all fields are filled correctly"
        );
      },
    });
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={close}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="">
        <div style={{ background: "#FBFDFE" }}>
          <div className="record-income__cancel">
            <button className="record-income__cancel__btn" onClick={close}>
              <Cancel />
            </button>
          </div>
        </div>
        <div className="record-income__body">
          <TextInput
            label="Bank Name"
            placeholder="Select Bank"
            name="bank"
            type="dropdown"
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.bank}
            fieldClass={errors["bank"] ? "error-field" : "input-field"}
            errorMessage={errors["bank"]}
            id={"bank"}
            onSelectValue={selectValue}
            isSearchable={true}
            handleSearchValue={handleSearch}
            searchValue={searchValue}
            handleBlur={handleBlur}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={banks?.data}
          />

          <TextInput
            label="Account Type"
            placeholder="Account Type"
            name="account_type"
            type="dropdown"
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.account_type}
            fieldClass={errors["account_type"] ? "error-field" : "input-field"}
            errorMessage={errors["account_type"]}
            id={"account_type"}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={handleBlur}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={[
              { id: 1, name: "Current" },
              { id: 2, name: "Dormiciliary" },
              { id: 3, name: "Fixed Deposit" },
              { id: 4, name: "Savings" },
            ]}
          />

          <TextInput
            label={"Account number"}
            placeholder={"Account number"}
            name="account_number"
            type="text"
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.account_number}
            fieldClass={
              errors["account_number"] ? "error-field" : "input-field"
            }
            errorMessage={errors["account_number"]}
            id={"account_number"}
            onSelectValue={function (a: string, b: string): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={handleBlur}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
          />

          {/* <TextInput
            label="Account Name"
            placeholder="Account Name"
            name="account_name"
            type="text"
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.account_name}
            fieldClass={errors["account_name"] ? "error-field" : "input-field"}
            errorMessage={errors["account_name"]}
            id={"account_name"}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={handleBlur}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={banks?.data}
          /> */}
        </div>
        <button
          className="record-income__footer-btn"
          onClick={() => submit()}
          disabled={
            fields.account_type === "" ||
            fields.account_number === "" ||
            fields.bank === "" ||
            isLoading
          }
        >
          {isLoading ? "Please wait..." : "Record"}
        </button>
      </div>
    </Modal>
  );
};

export default BankModal;
