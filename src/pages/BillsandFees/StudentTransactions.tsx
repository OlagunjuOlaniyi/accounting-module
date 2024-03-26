import { useEffect, useState } from "react";
import {
  useSendReminder,
  useViewStudentTransactions,
} from "../../hooks/mutations/billsAndFeesMgt";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Button from "../../components/Button/Button";
import Addcircle from "../../icons/Addcircle";
import Filter from "../../icons/Filter";
import Export from "../../icons/Export";
import Header from "../../components/Header/Header";
import Search from "../../icons/Search";
import Table from "../../components/Table/Table";
import moment from "moment";
import Dots from "../../icons/Dots";
import Visibility from "../../icons/Visibility";
import Edit from "../../icons/Edit";
import Broadsheet from "../../icons/Broadsheet";
import Clock from "../../icons/Clock";
import TouchApp from "../../icons/TouchApp";
import RunWaiveBill from "../../components/Modals/BillsAndFees/WaiveBill";
import Delete from "../../icons/Delete";
import ApplyOverPayment from "../../components/Modals/ApplyOverPayment/OverPayment";

const StudentTransactions = () => {
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const { mutate: sendReminder } = useSendReminder(id || "");

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [studentNo, setStudentNo] = useState(0);
  const [runWaiveBillModalOpen, setWaiveBillModalOpen] =
    useState<boolean>(false);

  let bill_name = queryParams.get("bill_name");

  const { mutate, isLoading } = useViewStudentTransactions();

  const [apiData, setApiData] = useState<any>({
    total_outstanding_all: 0,
    total_overpayment: 0,
    transactions: [],
    student_details: {
      firstname: "",
      last_name: "",
      admission_number: "",
    },
  });

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

  const submit = () => {
    let dataToSend = {
      admission_number: id,
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

  useEffect(() => {
    submit();
  }, [id]);

  // Parent button
  const DotsBtnParent = ({ value }: { value: string }) => {
    let class_name = value;
    // let class_name = value.split("-")[0];

    return (
      <div className="action-wrapper">
        <button
          onClick={() => {
            setSelectedId(value);
            setStudentNo(value);
            setDropdownActions(!dropdownActions);
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <Dots />

          {dropdownActions && value === selectedId && (
            <>
              {/* {billStatus} */}

              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => {
                    setWaiveBillModalOpen(true);
                  }}
                >
                  <Visibility />
                  <p>Apply Overpayment</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(`/record-payment/${value}?bill_name=${bill_name}`);
                  }}
                >
                  <Delete /> <p>Deactivate Parent</p>
                </div>

                <div
                  className="action__flex"
                  onClick={() => {
                    onSendReminder();
                  }}
                >
                  <Clock />
                  <p>Send Reminder</p>
                </div>
              </div>
            </>
          )}
        </button>
      </div>
    );
  };

  // student button
  const DotsBtn = ({ value }: { value: string }) => {
    let class_name = value;
    // let class_name = value.split("-")[0];

    return (
      <div className="action-wrapper">
        <button
          onClick={() => {
            setSelectedId(value);
            setStudentNo(value);
            setDropdownActions(!dropdownActions);
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <Dots />

          {dropdownActions && value === selectedId && (
            <>
              {/* {billStatus} */}

              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => {
                    // navigate(`/bill/${id}`);
                    navigate(`/student-bill/${value}?bill_name=${bill_name}`);
                  }}
                >
                  <Visibility />
                  <p>View Student Bill</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(`/record-payment/${value}?bill_name=${bill_name}`);
                  }}
                >
                  <Edit /> <p>Record Payment</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(
                      `/payment-broadsheet/${id}?class_name=${class_name}&bill_name=${bill_name}`
                    );
                  }}
                >
                  <Broadsheet />
                  <p>Payment Broadsheet</p>
                </div>

                <div
                  className="action__flex"
                  onClick={() => {
                    // onSendReminder();
                  }}
                >
                  <Clock />
                  <p>Send Reminder</p>
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
      accessor: "class_name",
      Cell: ({ cell: { value } }: any) => (
        <p>
          {" "}
          {apiData?.student_details?.firstname}{" "}
          {apiData?.student_details?.last_name}
        </p>
      ),
    },
    {
      Header: "BILL NAME",
      accessor: "feetype_name",
      Cell: ({ cell: { value } }: any) => <p>{bill_name}</p>,
    },

    {
      Header: "TOTAL AMOUNT",
      accessor: "total_amount",
      Cell: ({ cell: { value } }: any) => (
        <p>NGN {Number(value)?.toLocaleString()}</p>
      ),
    },

    {
      Header: "AMOUNT PAID",
      accessor: "amount_paid",
      Cell: ({ cell: { value } }: any) => (
        <p>NGN {Number(value)?.toLocaleString()}</p>
      ),
    },
    {
      Header: "STATUS",
      accessor: "payment_status",
      Cell: ({ cell: { value } }: any) => (
        <div className={`${value?.toLowerCase()} payment-status`}>
          {value?.replace("_", " ")}
        </div>
      ),
    },
    // {
    //   Header: "DATE OF TRANSACTION",
    //   accessor: "created_at",
    //   Cell: ({ cell: { value } }: any) => <p>{moment(value)?.format("lll")}</p>,
    // },
    {
      Header: "Actions",
      // accessor: (d: any) => `${d.class_name}-${d.student_name}`,
      accessor: "admission_number",
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <>
          <div style={{ display: "flex", gap: "16px" }}>
            <DotsBtn value={value} />
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <p className="sm-test" onClick={() => navigate(-1)}>
        Bills and Fees Management /
        <b style={{ color: "#010c15" }}>{bill_name}</b>
      </p>
      <div style={{ margin: "32px 0" }}>
        <h3 style={{ fontSize: "36px", color: "#010C15" }}>
          {apiData?.student_details?.firstname}{" "}
          {apiData?.student_details?.last_name}
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
            onClick={() => {
              navigate("/CreateBill");
            }}
          />
        </div>
      </div>

      <div className="record-payment-header">
        {/* <h3>STUDENT NAME</h3>
        <h3>ADMISSION NUMBER</h3>

        <h3>AMOUNT OWED</h3>
        <h3>AMOUNT PAID</h3>
        <h3>AMOUNT OVERPAID</h3> */}
        <h3>PARENT NAME</h3>
        <h3>NO OF CHILDREN</h3>

        <h3>DATE JOINED</h3>
        <h3>OVERPAYMENT AMOUNT</h3>
        <h3>AMOUNT OWED</h3>
        <h3>ACTION</h3>
      </div>

      <div className="student-transactions-overview">
        <h3>
          {apiData?.student_details?.firstname}{" "}
          {apiData?.student_details?.last_name}
        </h3>
        <h3>{apiData?.student_details?.admission_number}</h3>
        <h3>
          NGN {Number(apiData?.transactions[0]?.amount_owed).toLocaleString()}
        </h3>
        <h3>
          NGN {Number(apiData?.transactions[0]?.amount_paid).toLocaleString()}
        </h3>{" "}
        <h3>NGN {Number(apiData?.total_overpayment).toLocaleString()}</h3>
        <h3>
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "14px",
              fontWeight: "normal",
            }}
          >
            <DotsBtnParent value={apiData?.student_details?.admission_number} />
          </div>
          {/* <DotsBtn /> */}
        </h3>
      </div>

      <div className="table_container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={apiData?.transactions || []} columns={columns} />
        )}

        {/* <Draft data={data} columns={columns} isLoading={isLoading}/> */}
        <RunWaiveBill
          id={id}
          modalIsOpen={runWaiveBillModalOpen}
          closeModal={() => setWaiveBillModalOpen(false)}
          studentNo={studentNo}
        />
        <ApplyOverPayment
          id={id}
          modalIsOpen={runWaiveBillModalOpen}
          closeModal={() => setWaiveBillModalOpen(false)}
          studentNo={studentNo}
        />
      </div>
    </div>
  );
};

export default StudentTransactions;
