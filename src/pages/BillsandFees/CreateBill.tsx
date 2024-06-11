import { useEffect, useState } from "react";

import "./BillsandFees.scss";
import TextInput from "../../components/Input/TextInput";
import TextInputSelectAll from "../../components/Input/TextInputSelectAll";
import Button from "../../components/Button/Button";
import AddCircleBlack from "../../icons/AddCircleBlack";
import AddCircleBlue from "../../icons/AddCircleBlue";
import ToggleUnchecked from "../../icons/ToggleUnchecked";
import ToggleChecked from "../../icons/ToggleChecked";
import { useGetSchoolDetails } from "../../hooks/queries/SchoolQuery";
import { useNavigate } from "react-router";
import {
  useGetClasses,
  useGetFeeTypes,
  useGetTerm,
} from "../../hooks/queries/billsAndFeesMgt";
import { Discount, Fee } from "../../types/types";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useCreateBill } from "../../hooks/mutations/billsAndFeesMgt";
import DeleteRed from "../../icons/DeleteRed";
import ClassAndStudentSelection from "../../components/ClassAndStudentSelection/ClassAndStudentSelection";
import { useGetStudents } from "../../hooks/queries/students";
import MultiLevelDropdown from "../../components/MultilevelDropdown/MultilevelDropdown";
import Header from "../../components/Header/Header";
import Timeline from "../../icons/Timeline";

const fetchStudents = async (term: any, year: any) => {
  const response = await fetch(
    `https://edves.cloud/api/v1/payments/payments/student/?term=${encodeURIComponent(
      term
    )}&year=${encodeURIComponent(year)}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const CreateBill = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [addClass, setAddClass] = useState<boolean>(false);
  const [addFee, setAddFee] = useState<boolean>(false);
  const [addDiscount, setAddDiscount] = useState<boolean>(false);
  const [partPayment, setPartPayment] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<boolean>(false);
  const [selectedClasses, setSelectedClasses] = useState<any>([]);
  const [classSearchValue, setClassSearchValue] = useState<string>("");
  const [selectedFee, setSelectedFee] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(200);
  const [selectedFeeId, setSelectedFeeId] = useState(200);
  const [selectedDiscountFeeType, setSelectedDiscountFeeType] = useState(200);
  const [showDiscountDropdown, setShowDiscountDropdown] = useState(false);
  const [showAddFeeDropdown, setShowAddFeeDropdown] = useState(false);
  const [selectedFeeForDiscount, setSelectedFeeForDiscount] = useState("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selected, setSelected] = useState<any>([]);
  const [preSelectedClasses, setPreSelectedClasses] = useState([]);

  const [discountValue, setDiscounValue] = useState(1);
  const [discountIndex, setDiscountIndex] = useState(0);
  const [discountedAmount, setDiscountAmout] = useState(0);

  const [selectedClassesDrop, setSelectedClassesDrop] = useState<
    { name: string }[]
  >([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  const [fees, setFees] = useState<Fee[]>([
    {
      fee_type: {
        name: "",
        description: "",
        default_amount: 0.0,
        classes: [],
        students: [],
        discounts: [],
      },
      amount: 0.0,
      mandatory: true,
    },
  ]);

  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      value: 0,
      description: "",
      fee_type: "",
      amount: 0,
      is_percentage: true,
      students: [],
      classes: [],
    },
  ]);

  const getDiscount = discounts.map((dis, i) => ({
    fee_type: dis.fee_type,
  }));

  // const calcDiscountedValue = () => {
  //   // let filteredDiscount = () => {
  //   //   getDiscount.filter()
  //   // }
  //   const filterFeesByFeeTypeName = (): Fee[] => {
  //     return fees.filter(
  //       (fee) => fee.fee_type.name === getDiscount[discountIndex].fee_type
  //     );
  //   };

  //   let discounted =
  //     (Number(filterFeesByFeeTypeName()[0]?.fee_type?.default_amount) *
  //       discounts[discountIndex].value) /
  //     100;

  //   setDiscountAmout(Number(discounted));
  // };

  const [fields, setFields] = useState({
    billName: "",
    dueDate: "",
    term: "",
    session: "",
    status: "draft",
    classes: [],
    amount: 0,
    mandatory: false,
  });

  const { data: schoolData } = useGetSchoolDetails();
  const { data: classes } = useGetClasses();
  // const { data: classesAndStudents } = useGetStudents();
  const { data: classesAndStudents } = useGetStudents(
    fields.term || "SECOND TERM",
    fields.session || "2023/2024"
  );

  // console.log("school Data", schoolData);
  const schoolDetailsLocal = JSON.parse(
    localStorage.getItem("userDetails") || ""
  );

  // console.log("helo", schoolDetailsLocal);
  // console.log("sch data", schoolData);

  // const { data: classAndStud } = useQuery(
  //   ["students", fields.term, fields.session],
  //   () => fetchStudents(fields.term, fields.session)
  // );

  const formattedClasses = classes?.map((c: any, index: any) => ({
    // id: c?.idx,
    // name: c?.class_field,
    id: index,
    name: c?.class_id,
  }));

  // const toggleClasses = (option: any) => {
  //   setSelectedClasses((prevSelected: any) => {
  //     // if it's in, remove
  //     const newArray = [...prevSelected];

  //     if (newArray.filter((e) => e.id === option.id).length > 0) {
  //       return newArray.filter((item) => item.id != option.id);
  //       // else, add
  //     } else {
  //       newArray.push(option);
  //       return newArray;
  //     }
  //   });
  // };

  // console.log("selected", selectedClasses)

  const toggleClasses = (option: any) => {
    setSelectedClasses((prevSelected: any) => {
      // If option is an array, toggle all options
      if (Array.isArray(option)) {
        // Check if any of the options are already selected
        const anySelected = option.some((opt: any) =>
          prevSelected.some((selected: any) => selected.id === opt.id)
        );

        // If any option is selected, deselect all options
        if (anySelected) {
          return prevSelected.filter(
            (prev: any) => !option.some((opt: any) => opt.id === prev.id)
          );
        } else {
          // If no option is selected, select all options
          return [...prevSelected, ...option];
        }
      } else {
        // If it's a single option, toggle its selection
        const newArray = [...prevSelected];
        if (newArray.filter((e) => e.id === option.id).length > 0) {
          return newArray.filter((item) => item.id !== option.id);
        } else {
          newArray.push(option);
          return newArray;
        }
      }
    });
  };

  //handle field change
  const handleChange = (evt: any) => {
    const value = evt.target.value;
    setFields({
      ...fields,
      [evt.target.name]: value,
    });
  };

  // select value from dropdown
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
  };

  const selectbillName = (value: any) => {
    setFields({ ...fields, billName: value });
  };

  const handleClassSearch = (evt: any) => {
    setClassSearchValue(evt.target.value);
  };

  //add fee
  const handleAddFee = () => {
    const newFee: Fee = {
      fee_type: {
        name: "",
        description: "",
        default_amount: 0.0,
        classes: [],
        students: [],
        discounts: [],
      },
      amount: 0.0,
      mandatory: true,
    };
    setFees([...fees, newFee]);
  };

  // useEffect(() => {
  //   fees;
  // }, []);

  const [discountFeeType, setDiscountFeeType] = useState([]);
  const [feeTypeId, setFeeTypeId] = useState(0);
  const [feeTypeAmount, setFeeTypeAmount] = useState(0);

  const handleAddDiscount = () => {
    const newDiscount: Discount = {
      value: 0,
      description: "",
      is_percentage: true,
      fee_type: "",
      amount: 0,
      students: [],
      classes: [],
    };
    setDiscounts([...discounts, newDiscount]);
  };

  // console.log("fee id", feeTypeId);

  const handleFeeTypeChange = (index: number, field: string, value: any) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              [field]: value,
              id: index,
            },
          }
        : fee
    );
    setFees(updatedFees);
  };

  const handleDiscountChange = (
    index: number,
    field: string,
    value: any,
    feeType: string,
    id: number
  ) => {
    // if (field === "value" && value === 0) {
    //   toast.error("Please enter a fee type");
    //   return;
    // }
    const updatedDiscount = discounts.map((discount, i) =>
      i === index
        ? {
            ...discount,
            // discount_amount: discountedAmount,

            [field]: discount.is_percentage
              ? value > 100
                ? 100
                : value < 0
                ? 1
                : value
              : discount.is_percentage === false
              ? value > feeTypeAmount
                ? feeTypeAmount
                : value
              : value,
          }
        : discount
    );
    setDiscounts(updatedDiscount);

    // console.log("index", id);

    const updatedFees = fees?.map((fee, i) =>
      fee.fee_type.name === feeType && fee.fee_type?.id === id
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              discounts: [updatedDiscount[index]],
            },
          }
        : fee
    );

    // console.log("dd", updatedFees);

    setFees(updatedFees);
  };

  // Function to calculate the discount amount
  const calculateDiscountAmount = (discount: Discount, fees: Fee[]) => {
    // Find the fee associated with the discount
    const fee = fees.find((fee) => fee.fee_type.name === discount.fee_type);

    // If fee is not found or discount is not applied to a fee, return 0
    if (!fee) return 0;

    // Calculate the discount amount based on whether it's a percentage or fixed amount
    let discountAmount = discount.is_percentage
      ? (fee.amount * discount.value) / 100
      : discount.value;

    return discountAmount;
  };

  useEffect(() => {
    // Calculate discount amount for each discount
    const updatedDiscounts = discounts.map((discount, index) => ({
      ...discount,
      amount: calculateDiscountAmount(discount, fees),
    }));

    // Update the discounts state with calculated discount amounts
    setDiscounts(updatedDiscounts);
  }, [discounts, fees]);

  // populate the discount fields
  // useEffect(() => {
  //   const filterFeesByFeeTypeName = (): Fee[] => {
  //     return fees.filter(
  //       (fee) => fee.fee_type.name === getDiscount[discountIndex].fee_type
  //     );
  //   };

  //   let discounted =
  //     (Number(filterFeesByFeeTypeName()[0]?.fee_type?.default_amount) *
  //       discounts[discountIndex].value) /
  //     100;
  //   // setDiscountAmout(Number(discounted));
  //   const updatedDiscount = discounts.map((discount, i) =>
  //     i === discountIndex
  //       ? {
  //           ...discount,
  //           amount: Number(discounted),
  //           value: Number(discounts[discountIndex].value),
  //         }
  //       : discount
  //   );
  //   setDiscounts(updatedDiscount);
  // }, [
  //   discounts,
  //   discounts[discountIndex].value,
  //   getDiscount[discountIndex].fee_type,
  // ]);

  const handleClassChange = (
    index: number,
    selectedClasses: number[],
    selectedStudents: any
  ) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              // classes: selectedClasses2,
              classes: selectedClasses,
              students: selectedStudents,
            },
          }
        : fee
    );

    // console.log("hi", selectedClasses);
    setFees(updatedFees);
  };

  const handleClassChangeForDiscount = (
    index: number,
    selectedClasses: number[],
    selectedStudents: any,
    feeType: string
  ) => {
    const updatedDiscount = discounts.map((discount, i) =>
      i === index
        ? {
            ...discount,
            classes: selectedClasses,
            students: selectedStudents,
          }
        : discount
    );
    setDiscounts(updatedDiscount);

    const updatedFees = fees?.map((fee, i) =>
      fee.fee_type.name === feeType
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              discounts: [updatedDiscount[index]],
            },
          }
        : fee
    );

    setFees(updatedFees);
  };

  const handleClassDropdownChangeForDiscount = (
    index: number,
    selectedClasses: number[],
    selectedStudents: any,
    feeType: string
  ) => {
    handleClassChangeForDiscount(
      index,
      selectedClasses,
      selectedStudents,
      feeType
    );
    // handleDiscountChange(index, "fee_type", feeType, feeType);
  };

  const handleStudentChange = (index: number, selectedStudents: number[]) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              student: selectedStudents,
              students: selectedStudents,
            },
          }
        : fee
    );

    // setFees(updatedFees);
  };

  const handleClassDropdownChange = (
    index: number,
    selectedClasses: number[],
    selectedStudents: any
  ) => {
    handleClassChange(index, selectedClasses, selectedStudents);
  };

  const handleStudentDropdownChange = (
    index: number,
    selectedStudents: number[]
  ) => {
    handleStudentChange(index, selectedStudents);
  };

  const handleAmountChange = (index: number, value: string) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            amount: Number(value),
            fee_type: {
              ...fee.fee_type,
              default_amount: Number(value),
            },
          }
        : fee
    );
    setFees(updatedFees);
  };

  useEffect(() => {
    // Calculate the total amount
    const totalAmount = fees.reduce((total, fee) => total + fee.amount, 0);
    setFields({ ...fields, amount: totalAmount });
  }, [fees]);

  // const removeFee = (name: string) => {
  //   let filtered = fees.filter((el) => el.fee_type.name !== name);
  //   setFees(filtered);
  // };
  const removeFee = (name: any) => {
    // Ensure there is at least one fee remaining
    if (fees.length === 1) {
      setAddFee(false);
      return; // Prevent removing the last discount
    }

    let filtered = fees.filter((el, index) => index !== name);
    setFees(filtered);
  };

  // const removeDiscount = (name: any) => {
  //   let filtered = discounts.filter((el, index) => index !== name);
  //   setDiscounts(filtered);
  // };

  const removeDiscount = (indexToRemove: number) => {
    // Ensure there is at least one discount remaining
    if (discounts.length === 1) {
      setAddDiscount(false);
      return; // Prevent removing the last discount
    }

    const updatedDiscounts = discounts.filter(
      (_, index) => index !== indexToRemove
    );
    setDiscounts(updatedDiscounts);
  };

  const handleToggleMandatory = (index: number) => {
    const updatedFees = fees.map((fee, i) =>
      i === index ? { ...fee, mandatory: !fee.mandatory } : fee
    );
    setFees(updatedFees);
  };

  const showClasses = (fee: string, index: number) => {
    if (fields.term == "" && fields.session == "") {
      toast.error("Please enter the term and session first");
      return;
    }
    if (fee == "") {
      toast.error("Please enter the fee type first");
      return;
    }
    if (selectedFee === fee && selectedFeeId === index) {
      setSelectedFee("");
      setSelectedFeeId(200);
    } else {
      setSelectedFee(fee);
      setSelectedFeeId(index);
    }
  };

  const showClassesForDiscount = (index: number) => {
    if (selectedDiscount === index) {
      setSelectedDiscount(200);
    } else {
      setSelectedDiscount(index);
    }
  };

  const showClassesForDiscountFeeType = (index: number) => {
    if (selectedDiscount === index) {
      setSelectedDiscountFeeType(200);
    } else {
      setSelectedDiscountFeeType(index);
    }
  };

  const { mutate, isLoading } = useCreateBill();

  const { data: fee_types } = useGetFeeTypes();

  const { data: term } = useGetTerm();

  const formattedTerm = term?.map((t: any, index: any) => ({
    id: index,
    name: t?.term_id,
  }));

  // useEffect(() => {}, [selectedClasses]);

  // const convertedArray = selectedClasses?.map(({ name }: any) => ({
  //   [`"name"`]: name,
  // }));

  // console.log("classes", selectedClasses);

  //submit form
  const submit = () => {
    if (isNaN(Number(fields.amount))) {
      toast.error("Amount field can only contain numbers");
      return;
    }

    const updatedFees = fees.map((fee, i) =>
      fee.fee_type.classes
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,

              classes:
                fee?.fee_type?.classes?.length === 0 &&
                fee?.fee_type?.students?.length === 0
                  ? selectedClasses?.map(({ name }: any) => ({ name }))
                  : fee?.fee_type?.classes,
            },
          }
        : fee
    );
    // setFees(updatedFees);

    let dataToSend = {
      bill_name: fields.billName,
      due_date: fields.dueDate,
      term: fields.term,
      session: fields.session,
      status: "draft",
      part_payment: true,
      classes: selectedClasses?.map(({ name }: any) => ({ name })),
      fees: updatedFees,

      // amount: fields.amount,
      // mandatory: false,
      // discounts: discounts,
    };
    // console.log(dataToSend);

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success("Bill created successfully");
        queryClient.invalidateQueries({
          queryKey: `bills`,
        });

        setFields({ ...fields });
        navigate("/bills-fees-management");
      },

      onError: (e) => {
        toast.error("Error creating bill");
      },
    });
  };

  const handleClassDiscountChange = (
    index: number,
    selectedClasses: number[],
    selectedStudents: any
  ) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              classes: selectedClasses,
              students: selectedStudents,
            },
          }
        : fee
    );

    setFees(updatedFees);
  };

  return (
    <div>
      <Header />
      <div className="bills_overview">
        <h2 className="bills_overview__title">{fields.billName || ""}</h2>
        <h1 className="bills_overview__approval">APPROVAL STATUS: Pending</h1>
        <h1 className="bills_overview__status">STATUS: Draft</h1>
      </div>

      <div className="bills_schoolInfo">
        <div className="bills_schoolInfo__logo">
          <img
            src={schoolData?.data[0]?.arm?.logo || schoolDetailsLocal?.logo}
            alt=""
          />
        </div>
        <div className="bills_schoolInfo__details">
          {schoolData?.data[0]?.arm?.name || schoolDetailsLocal?.name}
          <p style={{ fontSize: "22px" }}>
            {schoolData?.data[0]?.arm?.address || schoolDetailsLocal?.address}
          </p>
          {fields.billName ? `${fields.billName}` : ""}
          <p className="bills_schoolInfo__details__email">
            Email:{" "}
            {schoolData?.data[0]?.arm?.email || schoolDetailsLocal?.contact}
          </p>
        </div>
      </div>

      <div className="bills_form">
        <div className="bills_form__top">
          <TextInput
            label="Bill Name"
            placeholder="Bill Name"
            className="bills_form__top__input"
            name="billName"
            type="text"
            fieldClass={"input-field"}
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.billName}
            errorMessage={""}
            id={"billName"}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={""}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={[
              { id: 1, name: "Second term 2023/2024" },
              { id: 2, name: "Third term 2023/2024" },
              { id: 3, name: "First term 2023/2024" },
              { id: 4, name: "Second term 2024/2025" },
            ]}
          />

          {/* <div
            className="bills_form__other_form__addons__addFee__input__wrapper"
            style={{ position: "relative" }}
          >
            <input
              className="bills_form__other_form__addons__addFee__input__wrapper__input"
              type="text"
              name="billName"
              id="billName"
              value={fields.billName}
              onClick={() => {
                setShowAddFeeDropdown(!showAddFeeDropdown);
              }}
              onChange={(e) => handleChange(e)}
              placeholder="type or select fee type"
            />
          </div>
          <div className="discount_dropdown" style={{ position: "absolute" }}>
            {showAddFeeDropdown &&
              fee_types?.results?.map((fee: { name: string }) => (
                <div
                  className="discount_dropdown__item"
                  onClick={() => {
                    selectbillName(fee.name);
                    setShowAddFeeDropdown(false);
                  }}
                >
                  <p>{fee?.name}</p>
                </div>
              ))}
          </div> */}

          <TextInput
            label="Bill Due Date"
            placeholder="Bill Name"
            name="dueDate"
            type="date"
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.dueDate}
            fieldClass={"input-field"}
            errorMessage={""}
            id={"dueDate"}
            onSelectValue={function (): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={""}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={[]}
          />
        </div>

        {/* session and term */}
        <div className="bills_form__top">
          <TextInput
            label="Term"
            placeholder="Term"
            className="bills_form__top__input"
            name="term"
            type="dropdown"
            fieldClass={"input-field"}
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.term}
            errorMessage={""}
            id={"term"}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={""}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            options={formattedTerm}
            // options={[
            //   { id: 1, name: "Second term 2023/2024" },
            //   { id: 2, name: "Third term 2023/2024" },
            //   { id: 3, name: "First term 2023/2024" },
            //   { id: 4, name: "Second term 2024/2025" },
            // ]}
          />

          <TextInput
            label="Session"
            placeholder="Session"
            name="session"
            type="dropdown"
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.session}
            fieldClass={"input-field"}
            errorMessage={""}
            id={"session"}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={""}
            handleBlur={""}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error("");
            }}
            selectedValues={undefined}
            // options={[]}
            options={[
              { id: 1, name: "2023/2024" },
              { id: 2, name: "2024/2025" },
              { id: 3, name: "2025/2026" },
            ]}
          />
        </div>

        <Button
          disabled={false}
          btnText="Add Class"
          btnClass="btn-cancel"
          width="100%"
          icon={<AddCircleBlack />}
          onClick={() => setAddClass(!addClass)}
        />
      </div>

      {addClass && (
        <div className="bills_form__other_form">
          <div className="bills_form__other_form__header">
            <p>ASSIGNED CLASS</p>
            <p>TOTAL BILL AMOUNT</p>
          </div>

          <div className="bills_form__top">
            <TextInputSelectAll
              label=""
              placeholder="Assign Bill to Class"
              name="classes"
              type="dropdown"
              errorClass={"error-msg"}
              handleChange={""}
              value={""}
              fieldClass={""}
              errorMessage={""}
              id={"classes"}
              onSelectValue={selectValue}
              isSearchable={true}
              handleSearchValue={handleClassSearch}
              searchValue={classSearchValue}
              handleBlur={""}
              multi={true}
              toggleOption={toggleClasses}
              selectedValues={selectedClasses}
              options={formattedClasses}
            />

            <TextInput
              label=""
              placeholder=""
              name="amount"
              type="text"
              errorClass={"error-msg"}
              handleChange={handleChange}
              value={fields.amount?.toLocaleString()}
              fieldClass={"input-field"}
              errorMessage={""}
              id={"amount"}
              onSelectValue={function (): void {}}
              isSearchable={false}
              handleSearchValue={function (): void {}}
              searchValue={""}
              handleBlur={""}
              multi={false}
              toggleOption={() => {}}
              selectedValues={[]}
              options={[]}
              disabled={true}
            />
            {/* <span className="currency_class">NGN</span> */}
          </div>

          <div className="bills_form__other_form__addons">
            <p
              onClick={() => setAddFee(!addFee)}
              style={{ width: "fit-content" }}
            >
              <AddCircleBlue />
              Add Fee
            </p>

            {fees.length > 0 && (
              <div className="bills_form__other_form__addons__addFee">
                {addFee &&
                  fees.map((fee, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "30px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          marginBottom: "20px",
                        }}
                      >
                        <div className="bills_form__other_form__addons__addFee__input">
                          <label>Fee Type</label>
                          <div className="bills_form__other_form__addons__addFee__input__wrapper">
                            <input
                              className="bills_form__other_form__addons__addFee__input__wrapper__input"
                              type="text"
                              name=""
                              id=""
                              value={fee.fee_type.name}
                              onClick={() => {
                                setShowAddFeeDropdown(!showAddFeeDropdown);
                                showClassesForDiscountFeeType(index);
                              }}
                              onChange={(e) =>
                                handleFeeTypeChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="type or select fee type"
                            />
                            <button
                              // onClick={() => showClasses(fee.fee_type.name)}
                              onClick={() =>
                                showClasses(fee.fee_type.name, index)
                              }
                            >
                              <AddCircleBlue />
                            </button>
                          </div>
                          <div className="discount_dropdown">
                            {showAddFeeDropdown &&
                              selectedDiscountFeeType === index &&
                              fee_types?.results?.map(
                                (fee: { name: string }) => (
                                  <div
                                    className="discount_dropdown__item"
                                    onClick={() => {
                                      handleFeeTypeChange(
                                        index,
                                        "name",
                                        fee.name
                                      );
                                      setShowAddFeeDropdown(false);
                                    }}
                                  >
                                    <p>{fee?.name}</p>
                                  </div>
                                )
                              )}
                          </div>
                          {selectedFee !== "" &&
                            selectedFeeId === index &&
                            selectedFee === fee.fee_type.name && (
                              <ClassAndStudentSelection
                                preSelectedClasses={selectedClasses}
                                classes={classesAndStudents as any}
                                cancel={() =>
                                  showClasses(fee.fee_type.name, index)
                                }
                                selectedClassesInParent={fee.fee_type.classes}
                                selectedStudentsInParent={fee.fee_type.students}
                                onClassChange={(
                                  selectedClasses: any,
                                  selectedStudents: any
                                ) =>
                                  handleClassDropdownChange(
                                    index,
                                    selectedClasses,
                                    selectedStudents
                                  )
                                }
                                onStudentsChange={(selectedStudents: any) =>
                                  handleStudentDropdownChange(
                                    index,
                                    selectedStudents
                                  )
                                }
                                selectedClassesDrop={selectedClassesDrop}
                                setSelectedClassesDrop={setSelectedClassesDrop}
                                setSelectedStudents={setSelectedStudents}
                                selectedStudents={selectedStudents}
                              />
                            )}
                        </div>
                        <div className="bills_form__other_form__addons__addFee__input">
                          <div className="bills_form__other_form__addons__addFee__input__wrapper">
                            {/* <span className="currency">
                              {schoolData?.data[0]?.currency}
                            </span> */}
                            <input
                              className="bills_form__other_form__addons__addFee__input__wrapper__input"
                              type="text"
                              name=""
                              id="input"
                              placeholder="Amount"
                              value={fee.amount}
                              onChange={(e) =>
                                handleAmountChange(index, e.target.value)
                              }
                            />
                          </div>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => removeFee(index)}
                          >
                            <DeleteRed />
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "10px",
                        }}
                      >
                        {fee.mandatory ? (
                          <button onClick={() => handleToggleMandatory(index)}>
                            <ToggleUnchecked />
                          </button>
                        ) : (
                          <button onClick={() => handleToggleMandatory(index)}>
                            <ToggleChecked />
                          </button>
                        )}
                        Optional
                      </div>
                    </div>
                  ))}

                {addFee && fees.length > 0 && (
                  <div>
                    <span
                      onClick={handleAddFee}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "fit-content",
                        gap: "10px",
                        color: "rgba(67, 154, 222, 1)",
                        marginTop: "20px",
                        cursor: "pointer",
                      }}
                    >
                      <AddCircleBlue />
                      Add Another Fee
                    </span>
                  </div>
                )}
              </div>
            )}

            <p
              onClick={() => setAddDiscount(!addDiscount)}
              // onClick={handleAddFee}
              style={{
                width: "fit-content",
              }}
            >
              <AddCircleBlue />
              Add Discount
            </p>

            {discounts.length > 0 &&
              addDiscount &&
              discounts.map((d, index) => (
                <div className="bills_form__other_form__addons__addDiscount">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      className="bills_form__other_form__addons__addFee__input"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <label>Discount</label>
                      <div className="bills_form__other_form__addons__addFee__input__wrapper wrapper">
                        <input
                          className="bills_form__other_form__addons__addFee__input__wrapper__input width"
                          type="text"
                          name=""
                          id=""
                          value={d.value}
                          onChange={(e) =>
                            handleDiscountChange(
                              index,
                              "value",
                              e.target.value,
                              d.fee_type,
                              feeTypeId
                            )
                          }
                          placeholder="Type the discount percentage"
                        />
                        <button onClick={() => showClassesForDiscount(index)}>
                          <AddCircleBlue />
                        </button>
                        {selectedDiscount !== 200 &&
                          selectedDiscount === index && (
                            <ClassAndStudentSelection
                              preSelectedClasses={selectedClasses}
                              selectedClassesInParent={d.classes}
                              selectedStudentsInParent={d.students}
                              classes={classesAndStudents as any}
                              cancel={() => showClassesForDiscount(index)}
                              onClassChange={(
                                selectedClasses: any,
                                selectedStudents: any
                              ) =>
                                handleClassDropdownChangeForDiscount(
                                  index,
                                  selectedClasses,
                                  selectedStudents,
                                  d.fee_type
                                )
                              }
                              onStudentsChange={(selectedStudents: number[]) =>
                                handleStudentDropdownChange(
                                  index,
                                  selectedStudents
                                )
                              }
                              selectedClassesDrop={selectedClassesDrop}
                              setSelectedClassesDrop={setSelectedClassesDrop}
                              setSelectedStudents={setSelectedStudents}
                              selectedStudents={selectedStudents}
                            />
                          )}
                      </div>
                    </div>
                    Off
                    <div style={{ position: "relative" }}>
                      <div className="bills_form__other_form__addons__addDiscount__input">
                        <input
                          type="text"
                          name=""
                          id=""
                          value={d.fee_type}
                          placeholder="Select fee type"
                          // onClick={() =>
                          //   setShowDiscountDropdown(!showDiscountDropdown)
                          // }
                          onClick={(e) => {
                            setShowDiscountDropdown(!showDiscountDropdown);
                            showClassesForDiscountFeeType(index);
                            // setDiscountIndex(index);
                          }}
                          onChange={(e) => {
                            setDiscountIndex(index);
                            handleDiscountChange(
                              index,
                              "fee_type",
                              e.target.value,
                              d.fee_type,
                              feeTypeId
                            );
                          }}
                        />
                      </div>
                      <div className="discount_dropdown">
                        {showDiscountDropdown &&
                          // selectedDiscount !== 200 &&
                          selectedDiscountFeeType === index &&
                          fees.map((fee) => (
                            <div
                              className="discount_dropdown__item"
                              onClick={() => {
                                // setSelectedFeeForDiscount(fee?.fee_type?.name);
                                setFeeTypeAmount(fee?.fee_type?.default_amount);
                                setDiscountIndex(index);
                                handleDiscountChange(
                                  index,
                                  "fee_type",
                                  fee?.fee_type?.name,
                                  d.fee_type,
                                  fee?.fee_type?.id
                                );
                                setFeeTypeId(fee?.fee_type?.id);
                                setShowDiscountDropdown(false);
                              }}
                            >
                              <p>{fee?.fee_type?.name} </p>
                            </div>
                          ))}
                      </div>
                    </div>
                    —
                    <div className="bills_form__other_form__addons__addDiscount__input">
                      {/* <span className="currency currency_d">
                        {schoolData?.data[0]?.currency}
                      </span> */}
                      <input
                        type="text"
                        name=""
                        id="input"
                        placeholder=""
                        disabled
                        // value={discountedAmount ? discountedAmount : 0}
                        value={d.amount}
                      />
                    </div>
                    <div
                      className="bills_form__other_form__addons__addDiscount__input"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <input
                          type="text"
                          name=""
                          id=""
                          value={d.description}
                          placeholder="Reason for discount"
                          onChange={(e) =>
                            handleDiscountChange(
                              index,
                              "description",
                              e.target.value,
                              d.fee_type,
                              feeTypeId
                            )
                          }
                        />
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => removeDiscount(index)}
                      >
                        <DeleteRed />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                    }}
                  >
                    {d.is_percentage ? (
                      <button
                        onClick={() =>
                          handleDiscountChange(
                            index,
                            "is_percentage",
                            !d.is_percentage,
                            d.fee_type,
                            feeTypeId
                          )
                        }
                      >
                        <ToggleChecked />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleDiscountChange(
                            index,
                            "is_percentage",
                            !d.is_percentage,
                            d.fee_type,
                            feeTypeId
                          )
                        }
                      >
                        <ToggleUnchecked />
                      </button>
                    )}
                    Percentage
                  </div>
                </div>
              ))}
            {addDiscount && discounts.length > 0 && (
              <div
                onClick={handleAddDiscount}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "fit-content",
                  gap: "10px",
                  color: "rgba(67, 154, 222, 1)",
                  marginTop: "20px",
                  cursor: "pointer",
                }}
              >
                <AddCircleBlue />
                Add Another Discount
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {partPayment ? (
                <button onClick={() => setPartPayment(!partPayment)}>
                  <ToggleChecked />
                </button>
              ) : (
                <button onClick={() => setPartPayment(!partPayment)}>
                  <ToggleUnchecked />
                </button>
              )}

              <p
                style={{
                  margin: "0",
                  padding: "0",
                  fontSize: "14px",
                  color: "black",
                }}
              >
                Click to allow part payment of school bill
              </p>
            </div>
          </div>

          <div className="bills_form__other_form__note">
            <label>Notes</label>
            <textarea
              name=""
              id=""
              cols={0}
              rows={10}
              placeholder="Add Notes"
              style={{
                width: "100%",
                height: "100px",
                background: "rgba(250, 250, 250, 1)",
                padding: "20px",
                borderRadius: "5px",
                border: "1px solid rgba(1, 12, 21, 0.1)",
              }}
            ></textarea>
          </div>
        </div>
      )}

      <div className="bills_form__btns">
        <button
          style={{
            background: "transparent",
            padding: "16px 20px",
            borderRadius: "5px",
          }}
          onClick={() => navigate("/bills-fees-management")}
        >
          Cancel
        </button>

        <div style={{ display: "flex", flexDirection: "row", gap: "25px" }}>
          {/* <button
            onClick={() => submit()}
            style={{
              background: "#E4EFF9",
              padding: "16px 20px",
              borderRadius: "5px",
            }}
          >
            Save as Draft
          </button> */}

          <button
            disabled={isLoading}
            style={{
              background: "#439ADE",
              color: "white",
              padding: "16px 20px",
              borderRadius: "5px",
            }}
            onClick={() => submit()}
          >
            Create Bill
          </button>

          {/* <Button
              disabled={false}
              btnText="Send Bill"
              btnClass="btn-primary"
              width="100%"
              onClick={() => {}}
            /> */}
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
