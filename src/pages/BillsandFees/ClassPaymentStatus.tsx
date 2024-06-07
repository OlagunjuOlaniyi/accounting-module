import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import Dots from "../../icons/Dots";
import Visibility from "../../icons/Visibility";

import { useNavigate, useParams } from "react-router";
import Button from "../../components/Button/Button";
import Export from "../../icons/Export";
import Addcircle from "../../icons/Addcircle";
import Filter from "../../icons/Filter";

import Search from "../../icons/Search";
import {
  useDeleteStudentBill,
  useGetPaymentBroadsheet,
  useGetPaymentStatusOnBill,
  useSendReminder,
} from "../../hooks/mutations/billsAndFeesMgt";
import toast from "react-hot-toast";
import Header from "../../components/Header/Header";
import Broadsheet from "../../icons/Broadsheet";
import ParentIcon from "../../icons/ParentIcon";
import Clock from "../../icons/Clock";
import Edit from "../../icons/Edit";
import { useGetClassPaymentStatus } from "../../hooks/queries/billsAndFeesMgt";
import TouchApp from "../../icons/TouchApp";
import RunPayrollDiscard from "../../components/Modals/Payroll/RunPayrollDiscard";
import RunWaiveBill from "../../components/Modals/BillsAndFees/WaiveBill";
import Generate from "../../icons/Generate";
import DeleteConfirmation from "../../components/Modals/DeleteConfirmation/DeleteConfirmation";
import Delete from "../../icons/Delete";
import { useQueryClient } from "react-query";
import axios from "axios";

const ClassPaymentStatus = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  let bill_name = queryParams.get("bill_name");
  let class_name = queryParams.get("class");
  let status = queryParams.get("status");

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [runWaiveBillModalOpen, setWaiveBillModalOpen] =
    useState<boolean>(false);

  const toggleDeleteConfirmation = () => {
    setDeleteConfirmation(!deleteConfirmation);
  };

  const { mutate, isLoading } = useGetPaymentStatusOnBill();

  const { mutate: sendReminder } = useSendReminder(id || "");

  const [apiData, setApiData] = useState([]);
  const [test, setTest] = useState(2022);
  const [studentNo, setStudentNo] = useState<any>(0);

  const [paymentId, setPaymentId] = useState<any>(0);

  const { mutate: deleteStudentBillFn, isLoading: deleteLoading } =
    useDeleteStudentBill();

  const deleteStudentBill = () => {
    let dataToSend = {
      student_payment_id: paymentId,
      id: id,
    };
    deleteStudentBillFn(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success("Student bill deleted successfully");
        queryClient.invalidateQueries({
          queryKey: `delete-student-bill`,
        });
        setDeleteConfirmation(false);
      },

      onError: (e) => {
        toast.error("Error deactivating wallet");
      },
    });
  };

  // download receipt
  const download = () => {
    // let dataToSend = { student_payment_id: paymentId };
    const formData = new FormData();
    formData.append("student_payment_id", paymentId);
    axios
      .post(
        `https://edves.cloud/api/v1/payments/payments/student_receipt/`,
        formData
      )
      .then((res) => {
        console.log("response", res);
        window.open(res.data.pdf_url, "_blank");
      })
      .catch((error) => {
        console.error("Error occurred during download:", error);
      });
  };

  const submit = () => {
    let dataToSend = {
      bill_id: id,
      payment_status: status,
      class: class_name,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        setApiData(res);
      },

      onError: (e) => {
        toast.error(e?.response.data.message || "error occured");
      },
    });
  };

  const onSendReminder = () => {
    let dataToSend = {};

    sendReminder(dataToSend, {
      onSuccess: (res) => {
        toast.success(res.detail);
      },

      onError: (e) => {
        toast.error(e?.response.data.message || "error occured");
      },
    });
  };

  useEffect(() => {
    submit();
  }, [id]);

  // get test
  // const { mutate: PaymentBroadSheet } = useGetPaymentBroadsheet();
  // const { data } = useGetClassPaymentStatus(id || "");

  // const fomattedData = data?.results?.map((dat) => ({
  //   class_name: dat.class_name,
  // }));

  // const getClassName = fomattedData[0].class_name;

  // // console.log("payment status data", data);
  // console.log("formated", getClassName);
  // const [apiData2, setApiData2] = useState({
  //   amount_outstanding_total: 0,
  //   amount_paid_total: 0,
  //   grand_total: 0,
  //   students_data: [],
  // });

  // const submit2 = () => {
  //   let dataToSend = {
  //     bill_id: id,
  //     class: getClassName,
  //   };

  //   PaymentBroadSheet(dataToSend, {
  //     onSuccess: (res) => {
  //       setApiData2(res);
  //     },

  //     onError: (e) => {
  //       toast.error(e?.response.data.message || "error occured");
  //     },
  //   });
  // };
  // useEffect(() => {
  //   submit2();
  // }, [id, getClassName]);

  // console.log("api", apiData2);

  //dots button component
  const DotsBtn = ({
    value,
    payment,
    className,
    name,
    index,
  }: {
    value: string;
    payment: any;
    className: any;
    name: any;
    index: any;
  }) => {
    let class_name = value.split("-")[0];

    return (
      <div className="action-wrapper">
        <button
          onClick={() => {
            setSelectedId(value);
            setStudentNo(value);
            setSelectedIndex(index);
            setPaymentId(payment);
            setDropdownActions(!dropdownActions);
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <Dots />

          {dropdownActions && index === selectedIndex && (
            <>
              {/* {billStatus} */}

              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => {
                    // navigate(`/bill/${id}`);
                    localStorage.setItem("adm_num", JSON.stringify(value));
                    navigate(
                      `/student-bill/${id}?adm_num=${value}&bill_name=${bill_name}`
                    );
                  }}
                >
                  <Visibility />
                  <p>View Student Bill</p>
                </div>
                {status !== "not_paid" ? (
                  <div className="action__flex" onClick={download}>
                    <Generate /> <p>Generate Receipt</p>
                  </div>
                ) : (
                  ""
                )}

                {status !== "fully_paid" ? (
                  <div
                    className="action__flex"
                    onClick={() => {
                      localStorage.setItem("adm_num", JSON.stringify(value));
                      navigate(
                        `/record-payment/${id}?adm_num=${value}&bill_name=${bill_name}`
                      );
                    }}
                  >
                    <Edit /> <p>Record Payment</p>
                  </div>
                ) : (
                  ""
                )}

                <div
                  className="action__flex"
                  onClick={() => {
                    onSendReminder();
                  }}
                >
                  <Clock />
                  <p>Send Reminder</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(
                      `/payment-broadsheet/${id}?class_name=${className}&bill_name=${bill_name}`
                    );
                  }}
                >
                  <Broadsheet />
                  <p>Payment Broadsheet</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => {
                    localStorage.setItem("adm_num", JSON.stringify(value));
                    navigate(
                      `/student-transactions/${id}?adm_num=${value}&bill_name=${bill_name}`
                    );
                  }}
                >
                  <ParentIcon /> <p>View Parent History</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => {
                    setWaiveBillModalOpen(true);
                  }}
                >
                  <TouchApp />
                  <p>Waive Bill</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => toggleDeleteConfirmation()}
                >
                  <Delete />
                  <p>Delete</p>
                </div>
              </div>
            </>
          )}
        </button>
      </div>
    );
  };

  //table header and columns
  const columns = [
    {
      Header: "STUDENT NAME",
      accessor: "student_name",
      Cell: ({ cell, row }: any) => (
        <div>
          <p>{cell.value}</p>
          <span style={{ color: "darkgrey", fontSize: "12px" }}>
            {row.original.admission_number}
          </span>
        </div>
      ),
    },
    {
      Header: "CLASS NAME",
      accessor: "class_name",
      Cell: ({ cell: { value } }: any) => <p>{value ? value : "N/A"}</p>,
    },
    {
      Header: "FEE NAME",
      accessor: "feetype_name",
    },

    {
      Header: "FEE AMOUNT",
      accessor: "total_amount",
      Cell: ({ cell: { value } }: any) => (
        <p>{Number(value)?.toLocaleString()}</p>
      ),
    },

    {
      Header: "STATUS",
      accessor: "status",
      Cell: ({ cell: { value } }: any) => (
        <div className={`${value?.toLowerCase()} payment-status`}>
          {value?.replace("_", " ")}
        </div>
      ),
    },

    // {
    //   Header: "Actions",
    //   // accessor: (d: any) => `${d.class_name}-${d.student_name}`,
    //   accessor: "admission_number",
    //   Cell: ({ cell: { value } }: { cell: { value: string } }) => (
    //     <>
    //       <div style={{ display: "flex", gap: "16px" }}>
    //         <DotsBtn value={value} />
    //       </div>
    //     </>
    //   ),
    // },
    {
      Header: "Actions",
      accessor: "admission_number",
      Cell: ({ cell, row }: any) => (
        <>
          <div style={{ display: "flex", gap: "16px" }}>
            <DotsBtn
              value={cell.value}
              name={row.original.student_name}
              payment={row.original.student_payment_id}
              className={row.original.class_name}
              index={row.index}
            />
          </div>
        </>
      ),
    },
  ];
  return (
    <div>
      <Header />
      <p className="sm-test" onClick={() => navigate(-1)}>
        Bills and Fees Management / {bill_name} /{" "}
        <b style={{ color: "#010c15" }}>{status?.replace("_", " ")}</b>
      </p>
      <div style={{ margin: "32px 0" }}>
        <h3 style={{ fontSize: "36px", color: "#010C15" }}>
          {bill_name} Payment Status
        </h3>
      </div>

      <div className="ie_overview__top-level">
        <div className="ie_overview__top-level__search">
          {" "}
          <Search />
          <input
            placeholder="Search by bill name, student name, admission no, class, parent phone no"
            className="ie_overview__top-level__search__input"
          />
        </div>

        <button className="ie_overview__top-level__filter-date" disabled>
          {" "}
          <Filter />
          <p>Filter</p>
        </button>

        <button className="ie_overview__top-level__filter-download">
          {" "}
          <Export />
          <p>Download</p>
        </button>

        <div className="ie_overview__top-level__btn-wrap">
          <Button
            btnText="Create Bill"
            btnClass="btn-primary"
            width="214px"
            icon={<Addcircle />}
            disabled={false}
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }} //onClick={() => setShowActions(!showActions)}
          />
        </div>
      </div>
      <div className="table_container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={apiData || []} columns={columns} />
        )}

        {/* <Draft data={data} columns={columns} isLoading={isLoading}/> */}

        <RunWaiveBill
          id={id}
          modalIsOpen={runWaiveBillModalOpen}
          closeModal={() => setWaiveBillModalOpen(false)}
          studentNo={studentNo}
          paymentId={paymentId}
          billName={bill_name}
        />
        <DeleteConfirmation
          modalIsOpen={deleteConfirmation}
          close={toggleDeleteConfirmation}
          confirmationText={"This action cannot be reversed"}
          deleteFn={deleteStudentBill}
          deleteBtnText={"Delete Bill"}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default ClassPaymentStatus;
