import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/Button/Button";
import { BillsandFees } from "../../data";
import Addcircle from "../../icons/Addcircle";
import Wallet from "../../icons/Wallet";
import Clear from "../../icons/Clear";
import Export from "../../icons/Export";

import Search from "../../icons/Search";

import { changeDateFormat, calcDiffInDays } from "../../utilities";
import moment from "moment";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import {
  useFilterIncomeAndExpenseOverview,
  useGetIncomeAndExpenseOverview,
  useSearch,
} from "../../hooks/queries/overview";
import { useDebounce } from "use-debounce";
import SmallSpinner from "../../assets/smallspinner.svg";
import "../ChartOfAccount/BalanceSheet.scss";

import OverviewCard, {
  ICardProps,
} from "../../components/OverviewCard/OverviewCard";

import RecordIncome from "../../components/Modals/IncomeAndExpense/RecordIncome";
import RecordExpense from "../../components/Modals/IncomeAndExpense/RecordExpense";
import RecordEquity from "../../components/Modals/EquityAssetAndLiability/RecordEquity";
import RecordLiability from "../../components/Modals/EquityAssetAndLiability/RecordLiability";
import RecordAsset from "../../components/Modals/EquityAssetAndLiability/RecordAsset";
import Overview from "./Overview";

import Draft from "./Draft";
import Sent from "./Sent";
import Unsent from "./Unsent";
import Header from "../../components/Header/Header";

const BillsandFeesLayout = () => {
  const navigate = useNavigate();
  const { data } = useGetIncomeAndExpenseOverview();
  const [activeTab, setActiveTab] = useState<string | number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [showActions, setShowActions] = useState<boolean>(false);
  const [state, setState] = useState<any>([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const redirectToCreateBill = () => {
    navigate("/CreateBill");
  };

  const [modalOpen, setModalOpen] = useState<any>({
    income: false,
    expense: false,
    equity: false,
    liability: false,
    asset: false,
  });

  interface ICardDetails extends ICardProps {
    id: number;
  }

  const [debouncedValue] = useDebounce(searchText, 1000);

  const closeModal = (type: string) => {
    setModalOpen({
      income: false,
      expense: false,
      equity: false,
      liability: false,
      asset: false,
    });
  };

  const openModal = (type: string) => {
    type === "income"
      ? setModalOpen({
          income: true,
          expense: false,
          equity: false,
          liability: false,
          asset: false,
        })
      : type === "expense"
      ? setModalOpen({
          income: false,
          expense: true,
          equity: false,
          liability: false,
          asset: false,
        })
      : type === "equity"
      ? setModalOpen({
          income: false,
          expense: false,
          equity: true,
          liability: false,
          asset: false,
        })
      : type === "liability"
      ? setModalOpen({
          income: false,
          expense: false,
          equity: false,
          liability: true,
          asset: false,
        })
      : setModalOpen({
          income: false,
          expense: false,
          equity: false,
          liability: false,
          asset: true,
        });
  };

  let formatedStartDate = changeDateFormat(
    moment(state[0]?.startDate).format("l")
  );
  let formatedEndDate = changeDateFormat(moment(state[0]?.endDate).format("l"));

  const { isLoading, refetch } = useFilterIncomeAndExpenseOverview(
    formatedStartDate,
    state[0]?.endDate ? formatedEndDate : formatedStartDate
  );

  //filter for today
  const fetchToday = () => {
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);

    setTimeout(() => {
      refetch();
    }, 500);
  };

  //filter for yesterday
  const fetchYesterday = () => {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    setState([
      {
        startDate: date,
        endDate: date,
        key: "selection",
      },
    ]);

    setTimeout(() => {
      refetch();
    }, 500);
  };

  //filter all
  const fetchAll = () => {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    setState([
      {
        startDate: "",
        endDate: "",
        key: "selection",
      },
    ]);

    setTimeout(() => {
      refetch();
    }, 500);
  };

  let searchres = useSearch(debouncedValue).data;
  let searchLoading = useSearch(debouncedValue).isLoading;

  //move tab to income after getting response from search
  useEffect(() => {
    if (searchres && activeTab === 1) {
      setActiveTab(2);
    }
  }, [searchres]);
  return (
    <div>
      <Header />
      <div>
        <div className="ie_overview">
          <h2 className="ie_overview__title">Bills/Fees Management</h2>
        </div>
        <div className="ie_overview__top-level">
          <div className="ie_overview__top-level__search">
            {" "}
            <Search />
            <input
              placeholder="Search by bill name, student name, admission no, class, parent phone no"
              className="ie_overview__top-level__search__input"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            {searchText && (
              <div
                style={{ marginTop: "5px", cursor: "pointer" }}
                onClick={() => setSearchText("")}
              >
                {searchLoading ? <img src={SmallSpinner} alt="" /> : <Clear />}
              </div>
            )}
          </div>

          <button className="ie_overview__top-level__filter-download">
            {" "}
            <Export />
            <p>Download</p>
          </button>
          <button
            className="ie_overview__top-level__filter-download"
            onClick={() => navigate("/student-transaction")}
          >
            {" "}
            <Wallet />
            <p>Transaction</p>
          </button>
          <button
            className="ie_overview__top-level__filter-download"
            onClick={() => navigate("/wallet")}
          >
            {" "}
            <Wallet />
            <p>Wallet</p>
          </button>
          <div className="ie_overview__top-level__btn-wrap">
            <Button
              btnText="Create Bill"
              btnClass="btn-primary"
              width="214px"
              icon={<Addcircle />}
              disabled={false}
              onClick={redirectToCreateBill}
            />
          </div>
        </div>
        <div className="ie_overview__tabs">
          {BillsandFees.map((el) => (
            <div key={el.id} onClick={() => setActiveTab(el.id)}>
              <div
                className={`ie_overview__tabs__single__${
                  activeTab === el.id ? "active-tab" : "inactive-tab"
                }`}
              >
                {el.title}
              </div>
            </div>
          ))}
        </div>

        <div>
          {activeTab === 1 && (
            <>
              <Overview filteredLoading={false} searchRes={""} />
            </>
          )}
          {activeTab === 2 && (
            <>
              <Sent filteredLoading={false} searchRes={""} />
            </>
          )}
          {activeTab === 3 && (
            <>
              <Unsent filteredLoading={false} searchRes={""} />
            </>
          )}
          {activeTab === 4 && (
            <>
              <Draft filteredLoading={false} searchRes={""} />
            </>
          )}
        </div>

        <RecordIncome modalIsOpen={modalOpen.income} closeModal={closeModal} />
        <RecordExpense
          modalIsOpen={modalOpen.expense}
          closeModal={closeModal}
        />
        <RecordEquity modalIsOpen={modalOpen.equity} closeModal={closeModal} />
        <RecordLiability
          modalIsOpen={modalOpen.liability}
          closeModal={closeModal}
        />
        <RecordAsset modalIsOpen={modalOpen.asset} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default BillsandFeesLayout;
