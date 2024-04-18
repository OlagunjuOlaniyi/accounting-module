import { useState } from "react";
import Table from "../../components/Table/Table";
import Dots from "../../icons/Dots";
import Visibility from "../../icons/Visibility";
import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";
import { useQueryClient } from "react-query";
import { useGetBills } from "../../hooks/queries/billsAndFeesMgt";
import { filterByStatus } from "../../services/utils";
import Duplicate from "../../icons/Duplicate";
import ViewPayment from "../../icons/ViewPayment";
import Unsend from "../../icons/Unsend";
import { useNavigate } from "react-router";
import { useCurrency } from "../../context/CurrencyContext";
import {
  useDeleteBill,
  useDuplicateBill,
  useSendBill,
  useUnsendBill,
} from "../../hooks/mutations/billsAndFeesMgt";
import Header from "../../components/Header/Header";
import DeleteConfirmation from "../../components/Modals/DeleteConfirmation/DeleteConfirmation";
import toast from "react-hot-toast";
interface Iprops {
  filteredData?: any;
  filteredLoading: Boolean;
  searchRes: any;
}
const Sent = ({ filteredLoading, filteredData, searchRes }: Iprops) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const { mutate } = useDuplicateBill();
  const { mutate: sendBill } = useSendBill();
  const { mutate: unsendBill } = useUnsendBill();
  const { mutate: deleteBillFn, isLoading: deleteLoading } = useDeleteBill();
  const { data, isLoading } = useGetBills();

  let billStatus: string = "sent";

  const getClasses = () => {
    let filtered = data.filter((d: any) => Number(d.id) === Number(selectedId));

    localStorage.setItem("classes", JSON.stringify(filtered[0].classes));
  };

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const toggleDeleteConfirmation = () => {
    setDeleteConfirmation(!deleteConfirmation);
  };

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

  //badge component on table
  const Badge = ({ value }: { value: boolean }) => {
    return <div className={`${value}-generated-badge`}>{value}</div>;
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
      // Cell: ({ cell: { value } }: any) => (
      //   <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
      //     {value?.map((item: any) => (
      //       <div
      //         style={{
      //           background: "#E4EFF9",
      //           padding: "2px 12px 2px 12px",
      //           borderRadius: "12px",
      //         }}
      //       >
      //         {item.class_name}
      //       </div>
      //     ))}
      //   </div>
      // ),
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
              <Edit />
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
          <Table
            data={data ? filterByStatus(data, billStatus) : []}
            columns={filterByStatus(data, billStatus).length > 0 ? columns : []}
          />
        )}
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

export default Sent;
