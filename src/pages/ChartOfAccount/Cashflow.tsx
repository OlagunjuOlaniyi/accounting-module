import React from "react";
import { Ioverview } from "../../types/types";
import { useGetIncomeAndExpenseOverview } from "../../hooks/queries/overview";
interface Iprops {
  filteredData?: Ioverview;
  filteredLoading: Boolean;
}
const Cashflow = ({ filteredData, filteredLoading }: Iprops) => {
  const { data } = useGetIncomeAndExpenseOverview();
  let apiData: any = filteredData ? filteredData : data;
  return (
    <div className="cashflow-overview">
      {/* CASHFLOWS */}
      <div>
        <div
          className="cashflow-overview__statement-wrapper__header"
          style={{
            background: "#FBFDFE",
            borderTop: "2px solid #E4EFF9",
            borderBottom: "2px solid #E4EFF9",
            padding: "20px 0 20px 20px",
          }}
        >
          <h3>CASH FLOWS FROM OPERATING ACTIVITIES</h3>
        </div>
        {apiData?.incomes?.length === 0 ? (
          <div className="empty-state">No data available</div>
        ) : (
          apiData?.incomes?.map((el: any) => (
            <div
              className="cashflow-overview__statement-wrapper__content"
              key={el.id}
            >
              <div className="cashflow-overview__statement-wrapper__content__left">
                <p>{el.transaction_type?.name}</p>
              </div>
              <div className="cashflow-overview__statement-wrapper__content__right">
                <p>{Number(el.amount).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {/* ADJUSTMENTS */}
      <div>
        <div
          className="cashflow-overview__statement-wrapper__header"
          style={{
            background: "#FBFDFE",
            borderTop: "2px solid #E4EFF9",
            borderBottom: "2px solid #E4EFF9",
            padding: "20px 0 20px 20px",
          }}
        >
          <h3>ADJUSTMENTS</h3>
        </div>

        {apiData?.incomes?.length === 0 ? (
          <div className="empty-state">No data available</div>
        ) : (
          apiData?.incomes?.map((el: any) => (
            <div
              className="cashflow-overview__statement-wrapper__content"
              key={el.id}
            >
              <div className="cashflow-overview__statement-wrapper__content__left">
                <p>{el.transaction_type?.name}</p>
              </div>
              <div className="cashflow-overview__statement-wrapper__content__right">
                <p>{Number(el.amount).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}

        <div
          style={{ border: "none" }}
          className="income-expense-overview__statement-wrapper__total"
        >
          <div className="">
            <h3>Total ADJUSTMENTS</h3>
          </div>
          <div className="">
            <h3>{apiData?.total_income?.toLocaleString()}</h3>
          </div>
        </div>
      </div>
      {/* WORKING CAPITAL */}
      <div>
        <div
          className="cashflow-overview__statement-wrapper__header"
          style={{
            background: "#FBFDFE",
            borderTop: "2px solid #E4EFF9",
            borderBottom: "2px solid #E4EFF9",
            padding: "20px 0 20px 20px",
          }}
        >
          <h3>WORKING CAPITAL</h3>
        </div>

        {apiData?.incomes?.length === 0 ? (
          <div className="empty-state">No data available</div>
        ) : (
          apiData?.incomes?.map((el: any) => (
            <div
              className="cashflow-overview__statement-wrapper__content"
              key={el.id}
            >
              <div className="cashflow-overview__statement-wrapper__content__left">
                <p>{el.transaction_type?.name}</p>
              </div>
              <div className="cashflow-overview__statement-wrapper__content__right">
                <p>{Number(el.amount).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}

        <div className="income-expense-overview__statement-wrapper__total">
          <div className="">
            <h3>NET CASH FLOW OPERATING ACTIVITIES</h3>
          </div>
          <div className="">
            <h3>{apiData?.total_income?.toLocaleString()}</h3>
          </div>
        </div>
      </div>
      {/* CASH FLOWS FROM INVESTING ACTIVITIES */}
      <div>
        <div className="cashflow-overview__statement-wrapper__header">
          <h3>CASH FLOWS FROM INVESTING ACTIVITIES</h3>
        </div>

        {apiData?.incomes?.length === 0 ? (
          <div className="empty-state">No data available</div>
        ) : (
          apiData?.incomes?.map((el: any) => (
            <div
              className="cashflow-overview__statement-wrapper__content"
              key={el.id}
            >
              <div className="cashflow-overview__statement-wrapper__content__left">
                <p>{el.transaction_type?.name}</p>
              </div>
              <div className="cashflow-overview__statement-wrapper__content__right">
                <p>{Number(el.amount).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}

        <div className="income-expense-overview__statement-wrapper__total">
          <div className="">
            <h3>NET CASH USED IN INVESTING ACTIVITIES</h3>
          </div>
          <div className="">
            <h3>{apiData?.total_income?.toLocaleString()}</h3>
          </div>
        </div>
      </div>
      {/* CASH FLOWS FROM FINANCING ACTIVITIES */}
      <div>
        <div className="cashflow-overview__statement-wrapper__header">
          <h3>CASH FLOWS FROM FINANCING ACTIVITIES</h3>
        </div>

        {apiData?.incomes?.length === 0 ? (
          <div className="empty-state">No data available</div>
        ) : (
          apiData?.incomes?.map((el: any) => (
            <div
              className="cashflow-overview__statement-wrapper__content"
              key={el.id}
            >
              <div className="cashflow-overview__statement-wrapper__content__left">
                <p>{el.transaction_type?.name}</p>
              </div>
              <div className="cashflow-overview__statement-wrapper__content__right">
                <p>{Number(el.amount).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}

        <div className="income-expense-overview__statement-wrapper__total">
          <div className="">
            <h3>NET CASH USED IN FINANCING ACTIVITIES</h3>
          </div>
          <div className="">
            <h3>{apiData?.total_income?.toLocaleString()}</h3>
          </div>
        </div>
      </div>
      {/* NET INCREASE IN CASH AND CASH EQUIVALENTS */}
      <div
        style={{ border: "none" }}
        className="income-expense-overview__statement-wrapper__total"
      >
        <div className="">
          <h3>NET INCREASE IN CASH AND CASH EQUIVALENTS</h3>
        </div>
        <div className="">
          <h3>{apiData?.total_income?.toLocaleString()}</h3>
        </div>
      </div>
      {/* CASH AND CASH EQUIVALENTS AT BEGINNING OF PERIOD */}
      <div
        style={{ border: "none" }}
        className="income-expense-overview__statement-wrapper__total"
      >
        <div className="">
          <h3>CASH AND CASH EQUIVALENTS AT BEGINNING OF PERIOD</h3>
        </div>
        <div className="">
          <h3>{apiData?.total_income?.toLocaleString()}</h3>
        </div>
      </div>
      {/* CASH AND CASH EQUIVALENTS AT END OF PERIOD */}
      <div
        style={{ border: "none" }}
        className="income-expense-overview__statement-wrapper__total"
      >
        <div className="">
          <h3>CASH AND CASH EQUIVALENTS AT END OF PERIOD</h3>
        </div>
        <div className="">
          <h3>{apiData?.total_income?.toLocaleString()}</h3>
        </div>
      </div>

      <p>Notes to the financial statements</p>
    </div>
  );
};

export default Cashflow;
