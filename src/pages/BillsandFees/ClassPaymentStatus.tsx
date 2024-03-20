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

const ClassPaymentStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  let bill_name = queryParams.get("bill_name");
  let class_name = queryParams.get("class_name");
  let status = queryParams.get("status");

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [runWaiveBillModalOpen, setWaiveBillModalOpen] =
    useState<boolean>(false);

  const { mutate, isLoading } = useGetPaymentStatusOnBill();

  const { mutate: sendReminder } = useSendReminder(id || "");

  const [apiData, setApiData] = useState([]);
  const [test, setTest] = useState(2022);
  const [studentNo, setStudentNo] = useState(0);

  const submit = () => {
    let dataToSend = {
      bill_id: id,
      payment_status: status,
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
  const DotsBtn = ({ value }: { value: string }) => {
    // let class_name = value;
    let class_name = value.split("-")[0];

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
                    onSendReminder();
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
      Header: "STUDENT NAME",
      accessor: "student_name",
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
        />
      </div>
    </div>
  );
};

export default ClassPaymentStatus;
