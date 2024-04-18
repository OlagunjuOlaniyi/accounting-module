import { useState } from "react";
import Table from "../../components/Table/Table";
import Dots from "../../icons/Dots";
import Visibility from "../../icons/Visibility";
import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";
import { useNavigate } from "react-router";
import { useQueryClient } from "react-query";

import { useGetBills } from "../../hooks/queries/billsAndFeesMgt";
import Send from "../../icons/Send";
import Duplicate from "../../icons/Duplicate";
import Unsend from "../../icons/Unsend";
import ViewPayment from "../../icons/ViewPayment";
import {
  useDeleteBill,
  useDuplicateBill,
  useSendBill,
  useUnsendBill,
} from "../../hooks/mutations/billsAndFeesMgt";
import toast from "react-hot-toast";
import DeleteConfirmation from "../../components/Modals/DeleteConfirmation/DeleteConfirmation";
import { useCurrency } from "../../context/CurrencyContext";
import Header from "../../components/Header/Header";

interface Iprops {
  filteredData?: any;
  filteredLoading: Boolean;
  searchRes: any;
}

const Overview = ({ filteredLoading, filteredData, searchRes }: Iprops) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const toggleDeleteConfirmation = () => {
    setDeleteConfirmation(!deleteConfirmation);
  };

  //get incomes
  const { data, isLoading } = useGetBills();

  //badge component on table
  const Badge = ({ value }: { value: boolean }) => {
    return <div className={`${value}-generated-badge`}>{value}</div>;
  };

  const { mutate } = useDuplicateBill();
  const { mutate: sendBill } = useSendBill();
  const { mutate: unsendBill } = useUnsendBill();
  const { mutate: deleteBillFn, isLoading: deleteLoading } = useDeleteBill();

  const duplicate = () => {
    mutate(selectedId, {
      onSuccess: (res) => {
        close();
        toast.success("Bill duplicated successfully");
        queryClient.invalidateQueries({
          queryKey: `bills`,
        });
      },

      onError: (e) => {
        toast.error("Error duplicating bill");
      },
    });
  };

  const send = () => {
    sendBill(selectedId, {
      onSuccess: (res) => {
        close();
        toast.success(res?.detail);
        queryClient.invalidateQueries({
          queryKey: `bills`,
        });
      },

      onError: (e) => {
        toast.error("Error sending bill");
      },
    });
  };

  const unsend = () => {
    unsendBill(selectedId, {
      onSuccess: (res) => {
        close();
        toast.success(res?.detail);
        queryClient.invalidateQueries({
          queryKey: `bills`,
        });
      },

      onError: (e) => {
        toast.error("Error unsending bill");
      },
    });
  };

  const deleteBill = () => {
    deleteBillFn(selectedId, {
      onSuccess: (res) => {
        close();
        toast.success("Bill deleted successfully");
        queryClient.invalidateQueries({
          queryKey: `bills`,
        });
        setDeleteConfirmation(false);
      },

      onError: (e) => {
        toast.error("Error deleting bill");
      },
    });
  };

  const getClasses = () => {
    let filtered = data.filter((d: any) => Number(d.id) === Number(selectedId));

    localStorage.setItem("classes", JSON.stringify(filtered[0].classes));
  };
  //dots button component
  const DotsBtn = ({ value }: { value: string }) => {
    let splitedValue = value.split(",");
    let id = splitedValue[0];
    let status: string = splitedValue[1];
    let bill_name = splitedValue[2];
    let owner = splitedValue[3];

    return (
      <div className="action-wrapper">
        <button
          onClick={() => {
            setSelectedId(id);
            setDropdownActions(!dropdownActions);
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <Dots />

          {dropdownActions && id === selectedId && status === "draft" && (
            <>
              {/* {billStatus} */}
              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(`/bill/${id}`);
                    getClasses();
                  }}
                >
                  <Visibility />
                  <p>View</p>
                </div>

                <div
                  className="action__flex"
                  onClick={() => navigate(`/update-bill/${id}`)}
                >
                  <Edit />
                  <p>Edit</p>
                </div>

                <div className="action__flex" onClick={() => send()}>
                  <Send />
                  <p>Send Bill</p>
                </div>

                <div className="action__flex" onClick={() => duplicate()}>
                  <Duplicate />
                  <p>Duplicate</p>
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

          {dropdownActions && id === selectedId && status === "sent" && (
            <>
              {/* {billStatus} */}
              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(`/bill/${id}`);
                    getClasses();
                  }}
                >
                  <Visibility />
                  <p>View</p>
                </div>

                <div className="action__flex" onClick={() => duplicate()}>
                  <Duplicate />
                  <p>Duplicate</p>
                </div>

                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(`/payment-status/${id}?bill_name=${bill_name}`);

                    localStorage.setItem(
                      "bills_and_fees",
                      JSON.stringify({
                        owner: owner,
                        bill_id: id,
                      })
                    );
                  }}
                >
                  <ViewPayment />
                  <p>View Payment Status</p>
                </div>

                <div className="action__flex" onClick={() => unsend()}>
                  <Unsend />
                  <p>Unsend Bill</p>
                </div>

                {/* <div
                  className="action__flex"
                  onClick={() => toggleDeleteConfirmation()}
                >
                  <Delete />
                  <p>Delete</p>
                </div> */}
              </div>
            </>
          )}

          {dropdownActions && id === selectedId && status === "unsent" && (
            <>
              {/* {billStatus} */}
              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => {
                    navigate(`/bill/${id}`);
                    getClasses();
                  }}
                >
                  <Visibility />
                  <p>View</p>
                </div>

                <div
                  className="action__flex"
                  onClick={() => navigate(`/update-bill/${id}`)}
                >
                  <Edit />
                  <p>Edit</p>
                </div>

                <div className="action__flex" onClick={() => duplicate()}>
                  <Duplicate />
                  <p>Duplicate</p>
                </div>

                <div className="action__flex" onClick={() => send()}>
                  <Unsend />
                  <p>Resend Bill</p>
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
      Header: "Bill Name",
      accessor: "bill_name",
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },
    {
      Header: "Assigned Class",
      accessor: "classes",
      Cell: ({ cell: { value } }: any) => {
        const displayItems = value?.slice(0, 5);
        const remainingItems = value?.length - 5;

        return (
          <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            {displayItems?.map((item: any) => (
              <div
                key={item?.name} // Add a unique key for each item
                style={{
                  background: "#E4EFF9",
                  padding: "2px 12px 2px 12px",
                  borderRadius: "12px",
                }}
              >
                {item?.name}
              </div>
            ))}
            {remainingItems > 0 && <p> and {remainingItems} more</p>}
          </div>
        );
      },
    },

    {
      Header: "Total Student",
      accessor: "total_students",
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },

    {
      Header: "Total Amount",
      accessor: "total_amount",
      Cell: ({ cell: { value } }: any) => (
        <p>
          {currency} {Number(value)?.toLocaleString()}
        </p>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell: { value } }: any) => <Badge value={value} />,
    },
    {
      Header: "Actions",
      accessor: (d: any) => `${d.id},${d.status},${d.bill_name},${d.owner}`,
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <>
          <div style={{ display: "flex", gap: "16px" }}>
            {["draft", "unsent"].includes(value.split(",")[1].toLowerCase()) ? (
              // <button
              //   style={{ all: "unset", cursor: "pointer" }}
              //   onClick={() => navigate(`/update-bill/${value.split(",")[0]}`)}
              // >
              //   <Edit />
              // </button>
              <></>
            ) : (
              ""
            )}
            <DotsBtn value={value} />
          </div>
        </>
      ),
    },
  ];
  return (
    <div>
      <div className="table_container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={data ? data : []} columns={columns} />
        )}

        {/* <Draft data={data} columns={columns} isLoading={isLoading}/> */}
      </div>
      <DeleteConfirmation
        modalIsOpen={deleteConfirmation}
        close={toggleDeleteConfirmation}
        confirmationText={"This action cannot be reversed"}
        deleteFn={deleteBill}
        deleteBtnText={"Delete Bill"}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Overview;
