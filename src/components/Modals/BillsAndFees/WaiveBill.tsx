import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Cancel from "../../../icons/Cancel";
import { Imodal } from "../../../types/types";
import TextInput from "../../Input/TextInput";
import "../Inventory/inventory.scss";
import "./BillsAndFees.scss";

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

const RunWaiveBill = ({
  modalIsOpen,
  closeModal,
  id,
  studentNo,
  billName,
  paymentId,
}: any) => {
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
      height: "330px",
      textAlign: "center",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0px",
    },
  };

  const close = () => {
    closeModal(true);
  };

  //component states

  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [bankId, setBankId] = useState("");

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

  // console.log("stud id", paymentId);

  const waive = () => {
    let dataToSend = {
      admission_number: studentNo,
      student_payment_id: paymentId,
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
          <div className="record-income__cancel">
            <button className="record-income__cancel__btn" onClick={close}>
              <Cancel />
            </button>
          </div>
          <div className="billsandFees_header">
            <img src={TouchAppIcon} alt="" />
            <h4 style={{ fontWeight: 700, color: "black" }}>
              Waive {billName}{" "}
            </h4>
          </div>
        </div>

        <div className="record-income__body">
          <p>
            Are you sure you want to waive this bill for{" "}
            <span style={{ fontWeight: 700 }}>
              {data?.student_details?.firstname}{" "}
              {data?.student_details?.lastname}
            </span>
            ? Waiving a bill means the student status will be recorded as Fully
            Paid and your financial account impacted. Do you wish to continue?
          </p>
        </div>
        {/* footer */}
        <div className="billsandFees_footer">
          <button onClick={close}>No, Keep Bill</button>
          {/* <button onClick={() => waive()}>Yes, Waive Bill</button> */}
          <Button
            btnText="Yes, Waive Bill"
            btnClass="btn-primary"
            width="117px"
            icon={""}
            disabled={false}
            onClick={() => waive()}
          />
        </div>
      </div>
    </Modal>
  );
};

export default RunWaiveBill;
