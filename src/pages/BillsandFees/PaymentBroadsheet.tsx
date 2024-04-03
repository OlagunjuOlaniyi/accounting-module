import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import Dots from "../../icons/Dots";
import Visibility from "../../icons/Visibility";
import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "react-query";

import ViewPayment from "../../icons/ViewPayment";
import { useCurrency } from "../../context/CurrencyContext";
import Addcircle from "../../icons/Addcircle";
import Button from "../../components/Button/Button";
import Export from "../../icons/Export";
import Filter from "../../icons/Filter";
import Search from "../../icons/Search";
import toast from "react-hot-toast";
import { useGetPaymentBroadsheet } from "../../hooks/mutations/billsAndFeesMgt";
import OverviewCard from "../../components/OverviewCard/OverviewCard";
import Income from "../../icons/Income";
import Expense from "../../icons/Expense";
import Net from "../../icons/Net";
import Header from "../../components/Header/Header";
import ParentIcon from "../../icons/ParentIcon";
import { downloadClassBroadsheet } from "../../services/billsServices";
import axios from "axios";

const PaymentBroadsheet = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const toggleDeleteConfirmation = () => {
    setDeleteConfirmation(!deleteConfirmation);
  };

  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  let class_name = queryParams.get("class_name");
  let bill_name = queryParams.get("bill_name");

  const { mutate, isLoading } = useGetPaymentBroadsheet();

  const [apiData, setApiData] = useState({
    amount_outstanding_total: 0,
    amount_paid_total: 0,
    grand_total: 0,
    students_data: [],
  });

  // console.log(class_name);
  // const download = async () => {
  //   let dataToSend = {
  //     class: class_name,
  //   };
  //   try {
  //     const res = await downloadClassBroadsheet(dataToSend);
  //     console.log("response", res);
  //     window.open(res.pdf_url, "_blank");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // download report
  const download = () => {
    let dataToSend = {
      class: class_name,
    };
    axios
      .post(
        "https://edves.cloud/api/v1/payments/payments/class-payment/",
        dataToSend
      )
      .then((res) => {
        console.log("response", res);
        window.open(res.data.pdf_url, "_blank");
      });
  };

  const submit = () => {
    let dataToSend = {
      bill_id: id,
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

  useEffect(() => {
    submit();
  }, [id, class_name]);

  const cardDetails: any[] = [
    {
      id: 1,
      title: "GRAND TOTAL",
      amount: `${currency} ${
        apiData ? apiData?.grand_total?.toLocaleString() : 0
      }`,
      percentage: "",
      type: "",
      icon: <Income />,
    },
    {
      id: 2,
      title: "AMOUNT PAID",
      amount: `${currency} ${
        apiData ? apiData?.amount_paid_total?.toLocaleString() : 0
      }`,
      percentage: "",
      type: "",
      icon: <Expense />,
    },
    {
      id: 3,
      title: "OUTSTANDING AMOUNT",
      amount: `${currency} ${
        apiData ? apiData?.amount_outstanding_total?.toLocaleString() : 0
      }`,
      percentage: "",
      //type: apiData?.profit?.toLocaleString().includes('-') ? 'loss' : 'profit',
      type: "",
      icon: <Net />,
    },
  ];

  //badge component on table
  const Badge = ({ value }: { value: boolean }) => {
    return <div className={`${value}-generated-badge`}>{value}</div>;
  };

  //dots button component
  const DotsBtn = ({ value, index }: { value: string; index: any }) => {
    return (
      <div className="action-wrapper">
        <button
          onClick={() => {
            setSelectedId(value);
            setSelectedIndex(index);
            setDropdownActions(!dropdownActions);
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <Dots />

          {dropdownActions && index === selectedIndex && (
            <>
              {/* {billStatus} */}
              {/* {console.log("value", value)} */}
              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => {
                    localStorage.setItem("adm_num", JSON.stringify(value));
                    navigate(
                      `/record-payment/${id}?adm_num=${value}?bill_name=${bill_name}`
                    );
                  }}
                >
                  <Edit /> <p>Record Payment</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(
                      `/student-transactions/${value}?bill_name=${bill_name}`
                    );
                  }}
                >
                  <ParentIcon /> <p>View Parent History</p>
                </div>
              </div>
            </>
          )}
        </button>
      </div>
    );
  };

  //   const dataWithFeeTypes = apiData.map((student) => ({
  //     ...student,
  //     fee_types: student.fee_types.map((fee) => ({
  //       fee_type_name: fee.fee_type_name,
  //       amount_due: fee.amount_due,
  //     })),
  //   }));

  const uniqueFeeTypes = Array.from(
    new Set(
      apiData?.students_data?.flatMap((student: any) =>
        student.fee_types.map((fee: any) => fee.fee_type_name)
      )
    )
  );

  //table header and columns
  const columns = [
    {
      Header: "Student Name",
      accessor: (d: any) =>
        `${d.student_details?.firstname} ${d.student_details?.lastname}`,
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },
    {
      Header: "Class",
      accessor: " ",
      Cell: ({ cell: { value } }: any) => <p>{class_name}</p>,
    },

    ...uniqueFeeTypes.map((feeType) => ({
      Header: feeType,
      accessor: (d: any) =>
        `${
          d.fee_types.find((fee: any) => fee.fee_type_name === `${feeType}`)
            ?.amount_due
        }`,
      Cell: ({ cell: { value } }: any) => (
        <p>
          {Number(value).toLocaleString() === "NaN"
            ? "N/A"
            : Number(value).toLocaleString()}
        </p>
      ),
    })),

    // {
    //   Header: "Actions",
    //   accessor: (d: any, index: any) =>
    //     `${d.student_details?.admission_number}`,
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
      accessor: (d: any) => `${d.student_details?.admission_number}`,
      Cell: ({ cell, row }: any) => (
        <>
          <div style={{ display: "flex", gap: "16px" }}>
            <DotsBtn value={cell.value} index={row.index} />
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
          {bill_name} ( {class_name} )Payment Status
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

        <button
          className="ie_overview__top-level__filter-download"
          onClick={download}
        >
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
            onClick={() => {}} //onClick={() => setShowActions(!showActions)}
          />
        </div>
      </div>

      <div className="table_container">
        <div
          className="income-expense-overview__cards"
          style={{ marginBottom: "64px" }}
        >
          {cardDetails.map((el) => (
            <div key={el.id}>
              <OverviewCard
                type={el.type}
                title={el.title}
                percentage={el.percentage}
                amount={el.amount}
                icon={el.icon}
              />
            </div>
          ))}
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table
            data={apiData?.students_data ? apiData?.students_data : []}
            columns={columns}
          />
        )}

        {/* <Draft data={data} columns={columns} isLoading={isLoading}/> */}
      </div>
    </div>
  );
};

export default PaymentBroadsheet;
