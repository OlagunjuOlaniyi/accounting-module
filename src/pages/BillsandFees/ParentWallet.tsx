import { useMemo, useState } from "react";
import Table from "../../components/Table/Table";
import Dots from "../../icons/Dots";
import Visibility from "../../icons/Visibility";
import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";
import { useNavigate, useParams } from "react-router";

import {
  useGetClassPaymentStatus,
  useSingleParentWallet,
} from "../../hooks/queries/billsAndFeesMgt";

import Button from "../../components/Button/Button";
import Export from "../../icons/Export";
import Addcircle from "../../icons/Addcircle";
import Wallet from "../../icons/Wallet";
import Filter from "../../icons/Filter";
import Search from "../../icons/Search";
import Header from "../../components/Header/Header";
import Broadsheet from "../../icons/Broadsheet";

const ParentWallet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);

  let bill_name = queryParams.get("bill_name");

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const { data, isLoading } = useSingleParentWallet(id || "");

  // Extract and format students data
  const formattedStudents = useMemo(() => {
    if (!data) return [];

    return Object.values(data.wallets).flatMap((wallet: any) =>
      wallet.students.map((student: any) => ({
        admissionNumber: student.admissionnumber,
        firstName: student.firstname,
        lastName: student.lastname,
        accountNumber: student.account_number,
        balance: student.balance,
        totalBalance: wallet.total_balance,
        parentName: student.parent_name,
      }))
    );
  }, [data]);

  // console.log("hello", formattedStudents);

  //dots button component
  const DotsBtn = ({ value }: { value: string }) => {
    return (
      <div className="action-wrapper">
        <button
          onClick={() => {
            setSelectedId(value);
            setDropdownActions(!dropdownActions);
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <Dots />

          {dropdownActions && value === selectedId && (
            <>
              {/* {billStatus} */}
              {/* {console.log("seleid", selectedId)} */}
              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => {
                    // navigate(`/bill/${id}`);
                    navigate(
                      `/class-payment-status/${id}?status=not_paid&bill_name=${bill_name}`
                    );
                  }}
                >
                  <Visibility />
                  <p>View</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(
                      `/payment-broadsheet/${id}?class_name=${selectedId}&bill_name=${bill_name}`
                    );
                  }}
                >
                  <Broadsheet />
                  <p>Payment Broadsheet</p>
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
      Header: "PARENT NAME",
      accessor: "parentName",
      Cell: ({ cell: { value } }: any) => <p>{value ? value : "N/A"}</p>,
    },

    {
      Header: "STUDENT NAME",
      accessor: "firstName",
      Cell: ({ cell, row }: any) => (
        <p>
          {cell.value} {row.original.lastName}
        </p>
      ),
    },

    {
      Header: "ADMISSION NUMBER",
      accessor: "admissionNumber",
      Cell: ({ cell, row }: any) => <p>{cell.value}</p>,
    },
    {
      Header: "BALANCE",
      accessor: "balance",
      Cell: ({ cell, row }: any) => <p>{cell.value}</p>,
    },
    {
      Header: "ACCOUNT NUMBER",
      accessor: "accountNumber",
      Cell: ({ cell, row }: any) => <p>{cell.value}</p>,
    },
    {
      Header: "TOTAL BALANCE",
      accessor: "totalBalance",
      Cell: ({ cell, row }: any) => <p>{cell.value}</p>,
    },
    // {
    //   Header: "Actions",
    //   accessor: (d: any) => `${d.class_name}`,
    //   Cell: ({ cell: { value } }: { cell: { value: string } }) => (
    //     <>
    //       <div style={{ display: "flex", gap: "16px" }}>
    //         <DotsBtn value={value} />
    //       </div>
    //     </>
    //   ),
    // },
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
          {bill_name} Parent Wallet
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

        <button
          className="ie_overview__top-level__filter-download btn-primary"
          onClick={() => navigate(-1)}
        >
          {" "}
          <Wallet />
          <p>View Wallet</p>
        </button>

        {/* <div className="ie_overview__top-level__btn-wrap">
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
        </div> */}
      </div>
      <div className="table_container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={formattedStudents} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default ParentWallet;
