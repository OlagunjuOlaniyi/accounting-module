import { useState } from "react";
import Table from "../../components/Table/Table";
import Dots from "../../icons/Dots";
import Visibility from "../../icons/Visibility";
import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";

import { useNavigate, useParams } from "react-router";

import {
  useGetClassPaymentStatus,
  useGetParentWallet,
} from "../../hooks/queries/billsAndFeesMgt";
import Send from "../../icons/Send";
import Duplicate from "../../icons/Duplicate";
import Unsend from "../../icons/Unsend";
import ViewPayment from "../../icons/ViewPayment";

import Button from "../../components/Button/Button";
import Export from "../../icons/Export";
import Addcircle from "../../icons/Addcircle";
import Filter from "../../icons/Filter";
import Search from "../../icons/Search";
import Header from "../../components/Header/Header";
import Broadsheet from "../../icons/Broadsheet";
import WalletModal from "../../components/Modals/WalletModal/WalletModal";
import DeleteRed from "../../icons/DeleteRed";
import DeleteConfirmation from "../../components/Modals/DeleteConfirmation/DeleteConfirmation";
import {
  useDeactivateWallet,
  useDeleteBill,
} from "../../hooks/mutations/billsAndFeesMgt";
import { QueryClient, useQueryClient } from "react-query";
import toast from "react-hot-toast";

const Wallet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  let bill_name = queryParams.get("bill_name");
  const queryClient = useQueryClient();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const toggleDeleteConfirmation = () => {
    setDeleteConfirmation(!deleteConfirmation);
  };

  const { data, isLoading } = useGetParentWallet();
  const { mutate: deactivateWalletFn, isLoading: deleteLoading } =
    useDeactivateWallet();
  // const { mutate: waiveBill } = useWaiveBill(id || "");

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = (type: string) => {
    setModalOpen(true);
  };

  const deactivateWallet = () => {
    let dataToSend = {
      account_number: selectedId,
    };
    deactivateWalletFn(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success("Wallet deactivated successfully");
        queryClient.invalidateQueries({
          queryKey: `deactivate-wallet`,
        });
        setDeleteConfirmation(false);
      },

      onError: (e) => {
        toast.error("Error deactivating wallet");
      },
    });
  };

  // console.log("wallter", data?.wallets);
  // const data2 = Object.keys(data?.wallets).map((key) => ({
  //   walletNumber: key,
  // }));

  // console.log("he", data2);

  //dots button component
  const DotsBtn = ({ value }: { value: string }) => {
    let splitedValue = value.split(",");
    let accountNo = splitedValue[0];
    let walletId: string = splitedValue[1];
    return (
      <div className="action-wrapper">
        <button
          onClick={() => {
            setSelectedId(accountNo);
            setDropdownActions(!dropdownActions);
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <Dots />

          {dropdownActions && accountNo === selectedId && (
            <>
              {/* {billStatus} */}
              {/* {console.log("seleid", selectedId)} */}
              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => {
                    // navigate(`/bill/${id}`);
                    navigate(`/parent-wallet/${walletId}`);
                  }}
                >
                  <Visibility />
                  <p>View Wallet</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => setModalOpen(true)}
                >
                  <Broadsheet />
                  <p>Fund Wallet</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => toggleDeleteConfirmation()}
                >
                  <Delete />
                  <p>Deactivate</p>
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
      Header: "WALLET NUM",
      accessor: "walletNumber",
      Cell: ({ cell: { value } }: any) => <p>{value ? value : "N/A"}</p>,
    },
    {
      Header: "ADMISSION NUM",
      accessor: (d: any) => `${d.students[0].admissionnumber}`,
      Cell: ({ cell, row }: any) => (
        <p>
          {/* {Object.keys(data.wallets).map((walletId) => (
            <div key={walletId}>
              <h2>Wallet ID: {walletId}</h2>
              <ul>
                {data.wallets[walletId].students.map((student) => (
                  <li key={student.admissionnumber}>
                    {student.firstname} {student.lastname} -{" "}
                    {student.account_number}
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
          {cell.value}
        </p>
      ),
    },

    {
      Header: "FIRST NAME",
      accessor: (d: any) => `${d.students[0].firstname}`,
      Cell: ({ cell: { value } }: any) => (
        // <button
        //   className="table-btn"
        //   onClick={() =>
        //     navigate(
        //       `/class-payment-status/${id}?status=fully_paid&bill_name=${bill_name}`
        //     )
        //   }
        // >
        //   {value}
        // </button>
        <p>{value}</p>
      ),
    },

    {
      Header: "LAST NAME",
      accessor: (d: any) => `${d.students[0].lastname}`,
      Cell: ({ cell: { value } }: any) => (
        // <button
        //   className="table-btn"
        //   onClick={() =>
        //     navigate(
        //       `/class-payment-status/${id}?status=not_paid&bill_name=${bill_name}`
        //     )
        //   }
        // >
        //   {value}
        // </button>
        <p>{value}</p>
      ),
    },
    {
      Header: "ACCOUNT NUM",
      accessor: (d: any) => `${d.students[0].account_number}`,
      Cell: ({ cell: { value } }: any) => (
        // <button
        //   className="table-btn"
        //   onClick={() =>
        //     navigate(
        //       `/class-payment-status/${id}?status=overpaid&bill_name=${bill_name}`
        //     )
        //   }
        // >
        //   {value}
        // </button>
        <p>{value}</p>
      ),
    },
    {
      Header: "STUDENT BALANCE",
      accessor: (d: any) => `${d.students[0].balance}`,
      Cell: ({ cell: { value } }: any) => (
        // <button
        //   className="table-btn"
        //   onClick={() =>
        //     navigate(
        //       `/class-payment-status/${id}?status=partly_paid&bill_name=${bill_name}`
        //     )
        //   }
        // >
        //   {value}
        // </button>
        <p>{value}</p>
      ),
    },
    {
      Header: "PARENT NAME",
      accessor: (d: any) => `${d.students[0].parent_name}`,
      Cell: ({ cell: { value } }: any) => (
        // <button
        //   className="table-btn"
        //   onClick={() =>
        //     navigate(
        //       `/class-payment-status/${id}?status=waived&bill_name=${bill_name}`
        //     )
        //   }
        // >
        //   {value}
        // </button>
        <p>{value}</p>
      ),
    },
    {
      Header: "Actions",
      accessor: (d: any) => `${d.students[0].account_number},${d.walletNumber}`,
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <>
          <div style={{ display: "flex", gap: "16px" }}>
            <DotsBtn value={value} />
          </div>
        </>
      ),
    },
  ];

  // // Generate columns dynamically based on student data
  // const generateColumns = () => {
  //   if (!data) return [];
  //   const wallets = data.wallets;
  //   if (!wallets) return [];
  //   const walletKeys = Object.keys(wallets);
  //   if (walletKeys.length === 0) return [];

  //   // Assume all wallets have the same structure, use the first wallet to generate columns
  //   const firstWallet = wallets[walletKeys[0]];
  //   const studentFields = Object.keys(firstWallet.students[0]);

  //   const columns = [
  //     {
  //       Header: "WALLET NO",
  //       accessor: "walletNumber",
  //     },
  //     ...studentFields.map((field) => ({
  //       Header: field.toUpperCase(),
  //       accessor: `students[].${field}`,
  //     })),
  //     {
  //       Header: "ACTIONS",
  //       Cell: ({ row }: any) => <DotsBtn value={row.original.walletNumber} />,
  //     },
  //   ];

  //   return columns;
  // };

  return (
    <div>
      <Header />
      <p className="sm-test" onClick={() => navigate(-1)}>
        Bills and Fees Management /
        <b style={{ color: "#010c15" }}>{bill_name}</b>
      </p>
      <div style={{ margin: "32px 0" }}>
        <h3 style={{ fontSize: "36px", color: "#010C15" }}>
          {bill_name} Wallet
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
          <Table
            data={Object.keys(data.wallets).map((key) => ({
              walletNumber: key,
              ...data.wallets[key],
            }))}
            columns={columns}
          />
        )}
        <WalletModal
          walletId={selectedId}
          modalIsOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          // studentNo={studentNo}
        />

        <DeleteConfirmation
          modalIsOpen={deleteConfirmation}
          close={toggleDeleteConfirmation}
          confirmationText={"This action cannot be reversed"}
          deleteFn={deactivateWallet}
          deleteBtnText={"Deactivate Wallet"}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default Wallet;
