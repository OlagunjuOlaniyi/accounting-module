import React, { useState } from "react";
import Table from "../../components/Table/Table";
import Dots from "../../icons/Dots";
import Dot from "../../icons/Dot";
import Visibility from "../../icons/Visibility";
import Delete from "../../icons/Delete";
import Edit from "../../icons/Edit";
import { useNavigate } from "react-router";

import Dispense from "../../icons/Dispense";
import Restock from "../../icons/Restock";
import HistoryIcon from "../../icons/HistoryIcon";
import { useCurrency } from "../../context/CurrencyContext";

interface Iprops {
  filteredData?: any[];
  isLoading: Boolean;
  searchRes: any;
}

const ProductTable = ({ filteredData, searchRes, isLoading }: Iprops) => {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  let apiData: any = searchRes ? searchRes : filteredData ? filteredData : [];

  // console.log({apiData});

  //badge component on table
  const Badge = ({ value }: { value: string }) => {
    return (
      <div
        className={`${
          value?.toLowerCase() === "available"
            ? "generated-badge"
            : value?.toLowerCase()
        }`}
      >
        {value?.toLowerCase()}
      </div>
    );
  };

  //dots button component
  const DotsBtn = ({ value, quantity }: { value: string; quantity: any }) => {
    //get single product/add on data

    // console.log({quantity});

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
              <div className="action">
                <div
                  className="action__flex"
                  onClick={() => navigate(`/inventory/${value}`)}
                >
                  <Visibility />
                  <p>View</p>
                </div>

                <div
                  className="action__flex"
                  onClick={() => navigate(`/inventory/${value}?action=edit`)}
                >
                  <Edit />
                  <p>Edit</p>
                </div>

                {quantity > 0 && (
                  <div
                    className="action__flex"
                    onClick={() =>
                      navigate(`/inventory/${value}?action=dispense`)
                    }
                  >
                    <Dispense />
                    <p>Dispense</p>
                  </div>
                )}

                <div
                  className="action__flex"
                  onClick={() => navigate(`/inventory/${value}?action=restock`)}
                >
                  <Restock />
                  <p>Restock</p>
                </div>
                <div
                  className="action__flex"
                  onClick={() => navigate(`/inventory/history/${value}`)}
                >
                  <HistoryIcon />
                  <p>Product History</p>
                </div>

                <div
                  className="action__flex"
                  onClick={() => navigate(`/inventory/${value}?action=delete`)}
                >
                  <Delete />
                  <p>Discard</p>
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
      Header: "PRODUCT ID",
      accessor: "id",
    },

    {
      Header: "PRODUCT NAME",
      accessor: (d: any) => `${d?.name},${d?.image}`,
      Cell: ({ cell: { value } }: any) => (
        <div className="d-flex">
          <img
            width={"32px"}
            height={"32px"}
            src={value.split(",")[1]}
            alt=""
          />
          <p>{value.split(",")[0]}</p>
        </div>
      ),
    },

    {
      Header: "CATEGORY",
      accessor: (d: any) =>
        `${d?.product_group?.name},${d?.product_group?.category?.name}`,
      Cell: ({ cell: { value } }: any) => (
        <div>
          <p style={{ marginBottom: "5px" }}>{value.split(",")[0]}</p>
          <div className="d-flex">
            <Dot type={"income"} />
            <p>{value.split(",")[1]}</p>
          </div>
        </div>
      ),
    },
    {
      Header: "QUANTITY",
      accessor: "sizes",
      Cell: ({ cell: { value } }: any) => (
        <div>
          <p>
            {value?.reduce(
              (total: number, size: any) => total + size.quantity,
              0
            )}
          </p>
          <p>
            Varies in : <b>Size</b>
          </p>
        </div>
      ),
    },
    {
      Header: "AMOUNT",
      accessor: "general_selling_price",
      Cell: ({ cell: { value } }: any) => (
        <p>
          {value !== "VARIES"
            ? `${currency} ${Number(value)?.toLocaleString()}`
            : value}
        </p>
      ),
    },

    {
      Header: "STATUS",
      accessor: "status",
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <Badge value={value} />
      ),
    },

    {
      Header: "Actions",
      accessor: (d: any) => `${d.id},${d.quantity}`,
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <>
          <div style={{ display: "flex", gap: "16px" }}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/inventory/${value.split(",")[0]}?action=edit`)
              }
            >
              <Edit />
            </div>

            <DotsBtn
              value={value.split(",")[0]}
              quantity={value.split(",")[1]}
            />
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
          <Table data={apiData ? apiData : []} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default ProductTable;
