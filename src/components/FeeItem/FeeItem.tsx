import { useState } from "react";
import CheckCircle from "../../icons/CheckCircle";
import Checked from "../../icons/Checked";
import ToggleChecked from "../../icons/ToggleChecked";
import ToggleUnchecked from "../../icons/ToggleUnchecked";
import UnCheckCircle from "../../icons/UnCheckCircle";
import Unchecked from "../../icons/Unchecked";
import "./fee-item.scss";

type Iprops = {
  name: string;
  payment_id: number;
  mandatory: boolean;
  discount: boolean;
  amount: number;
  amount_paid: number;
  total_amount: number;
  reason: string;
  discount_amount: number;
  status: string;
  checkedPaymentId: any;
  setCheckedPaymentId: any;
  currency: any;
  page: string;
};
const FeeItem = ({
  name,
  payment_id,
  mandatory,
  discount,
  amount,
  amount_paid,
  total_amount,
  reason,
  discount_amount,
  status,
  checkedPaymentId,
  setCheckedPaymentId,
  currency,
  page,
}: Iprops) => {
  const [isChecked, setIsChecked] = useState(false);
  const [checkedAmounts, setCheckedAmounts] = useState<number[]>([]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      // setCheckedAmounts([...checkedAmounts, payment_id]);
      setCheckedPaymentId([...checkedPaymentId, payment_id]);
    } else {
      const updatedPaymentId = checkedPaymentId.filter(
        (checkedPaymentId: any) => checkedPaymentId !== payment_id
      );
      // setCheckedAmounts(updatedAmounts);
      setCheckedPaymentId(updatedPaymentId);
    }
  };

  // console.log("amount", checkedPaymentId);
  return (
    <div className="fee-item">
      <div
        className="fee-item__first flex-item"
        // onClick={handleCheckboxChange}
        style={{ display: "flex", gap: "10px", cursor: "pointer" }}
      >
        {page === "record" ? (
          status === "fully paid" ? null : isChecked ? (
            <button onClick={handleCheckboxChange}>
              <Checked />
            </button>
          ) : (
            <button onClick={handleCheckboxChange}>
              <Unchecked />
            </button>
          )
        ) : null}

        {/* {isChecked ? (
          <button onClick={handleCheckboxChange}>
            <Checked />
          </button>
        ) : (
          <button onClick={handleCheckboxChange}>
            <Unchecked />
          </button>
        )} */}

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h4>{name}</h4>
            {status === "fully paid" ? <CheckCircle /> : <UnCheckCircle />}
          </div>

          <p style={{ color: "#FFA800", fontSize: "12px" }}>
            This fee type is {mandatory ? "compulsory" : "optional"}
          </p>
        </div>
      </div>

      <h3 className="flex-item">{discount ? `${discount}` : "0"}</h3>

      <h4 className="flex-item">{discount ? reason : "N/A"}</h4>
      <h3 className="flex-item">
        {Number(amount_paid).toLocaleString() || 0}
      </h3>
      <h3 className="flex-item">
        {Number(amount).toLocaleString() || 0}
      </h3>

      <h3 className="flex-item">
        {currency} {Number(total_amount)?.toLocaleString()}
      </h3>
    </div>
  );
};

export default FeeItem;
