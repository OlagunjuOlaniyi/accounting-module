import React, { useState } from "react";
import Modal from "react-modal";
import Cancel from "../../../icons/Cancel";
// import { Imodal } from "../../../types/types";
import TextInput from "../../Input/TextInput";
import "../../Modals/IncomeAndExpense/recordincome.scss";

import { useQueryClient } from "react-query";
import toast from "react-hot-toast";

import { useGetBankList, useGetBanks } from "../../../hooks/queries/banks";
import { useAddBank } from "../../../hooks/mutations/bank";
import Bank from "../../../icons/Bank";
import Cash from "../../../icons/Cash";
import Wallet from "../../../icons/Wallet";
import { useFundWallet } from "../../../hooks/queries/billsAndFeesMgt";

//modal types
export interface Imodal {
  modalIsOpen: boolean;
  closeModal: any;
  walletId: any;
}

const WalletModal = ({ modalIsOpen, closeModal, walletId }: Imodal) => {
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
    setFields({
      // account_name: "",
      paymentMethod: "",
      amount: "",
      dateOfTransaction: "",
      bank: "",
    });
  };

  type StateProps = {
    // account_name: string;
    paymentMethod: any;
    amount: string;
    dateOfTransaction: string;
    bank: string;
  };

  let todaysDate = new Date().toISOString().substring(0, 10);
  const [fields, setFields] = useState<StateProps>({
    // account_name: "",
    paymentMethod: "",
    amount: "",
    dateOfTransaction: todaysDate,
    bank: "",
  });

  const [bankId, setBankId] = useState<string>("");
  const [errors, setErrors] = useState({
    // account_name: "",
    paymentMethod: "",
    amount: "",
    dateOfTransaction: "",
    bank: "",
  });

  // select value from dropdown
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
    // setSelectedGroupId(id);
    if (name === "bank") {
      setBankId(id);
    }
  };

  //   const selectValue = (option: string, name: string, id: string) => {
  //     setFields({ ...fields, [name]: option });
  //   };

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

  const { data: bank_accounts } = useGetBankList();

  const formattedBankAccounts = bank_accounts?.data?.map(
    (b: { id: any; account_name: any }) => ({
      id: b.id,
      name: b.account_name,
    })
  );

  const { mutate, isLoading } = useFundWallet();

  const { data: banks } = useGetBanks();

  //submit form
  const submit = () => {
    let dataToSend = {
      // name: fields.bank,
      bank: bankId.toString(),
      amount: Number(fields?.amount.replace(/,/g, "")),
      payment_method:
        fields.paymentMethod.props.children[1] === "Bank"
          ? bankId
          : fields.paymentMethod.props.children[1],
      wallet_id: walletId,
    };

    // console.log("data", dataToSend);

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success("Wallet Funded successfully");
        queryClient.invalidateQueries({
          queryKey: `fund-wallet`,
        });

        setFields({
          // account_name: "",
          paymentMethod: "",
          amount: "",
          dateOfTransaction: "",
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
      <div className="record-income">
        <div style={{ background: "#FBFDFE" }}>
          <div className="record-income__cancel">
            <button className="record-income__cancel__btn" onClick={close}>
              <Cancel />
            </button>
          </div>
          <div className="record-income__heading">
            <h4>Fund wallet</h4>
            <p>Select the amount, and payment method to fund your wallet</p>
          </div>
        </div>
        <div className="record-income__body">
          <div className="record-income__body__title">
            <h2>Fund Wallet</h2>
            <div className="record-income__body__title__badge">
              APPROVAL STATUS: Approved
            </div>
          </div>

          <TextInput
            label={"Amount"}
            placeholder={"Deposit amount"}
            name="amount"
            type="text"
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.amount
              .replace(/,/g, "")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            fieldClass={errors["amount"] ? "error-field" : "input-field"}
            errorMessage={errors["amount"]}
            id={"amount"}
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

          <TextInput
            type={"dropdown"}
            name={"paymentMethod"}
            handleChange={handleChange}
            fieldClass={""}
            errorClass={""}
            errorMessage={""}
            label={"Payment Method"}
            id={""}
            placeholder={""}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={() => {}}
            searchValue={""}
            handleBlur={undefined}
            multi={false}
            value={fields.paymentMethod}
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
          {fields.paymentMethod?.props?.children[1]?.toLowerCase() ===
            "bank" && (
            <div className="record-income-amount-paid">
              {/* <h3>BANK ACCOUNTS</h3> */}

              <TextInput
                label="Bank Accounts"
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

          <TextInput
            label="Date of Transaction"
            placeholder=""
            name="dateOfTransaction"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.dateOfTransaction}
            fieldClass={
              errors["dateOfTransaction"] ? "error-field" : "input-field"
            }
            errorMessage={errors["dateOfTransaction"]}
            id={"dateOfTransaction"}
            onSelectValue={function (a: string, b: string): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={undefined}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
          />
        </div>
        <button
          className="record-income__footer-btn"
          onClick={() => {
            submit();
          }}
          disabled={
            fields.amount === "" || fields.paymentMethod === "" || isLoading
          }
        >
          {isLoading ? "Please wait..." : "Fund Wallet"}
        </button>
      </div>
    </Modal>
  );
};

export default WalletModal;
