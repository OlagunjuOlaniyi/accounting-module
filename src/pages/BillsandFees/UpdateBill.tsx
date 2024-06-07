import { useCallback, useEffect, useRef, useState } from "react";

import "./BillsandFees.scss";
import TextInput from "../../components/Input/TextInput";
import TextInputSelectAll from "../../components/Input/TextInputSelectAll";
import AddCircleBlue from "../../icons/AddCircleBlue";
import ToggleUnchecked from "../../icons/ToggleUnchecked";
import Caution from "../../icons/Caution";
import ToggleChecked from "../../icons/ToggleChecked";
import { useGetSchoolDetails } from "../../hooks/queries/SchoolQuery";
import { useNavigate, useParams } from "react-router";
import {
  useGetBills,
  useGetClasses,
  useGetFeeTypes,
  useGetSingleBill,
  useGetTerm,
} from "../../hooks/queries/billsAndFeesMgt";
import { Discount, Fee } from "../../types/types";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { useUpdateBill } from "../../hooks/mutations/billsAndFeesMgt";
import DeleteRed from "../../icons/DeleteRed";
import ClassAndStudentSelection from "../../components/ClassAndStudentSelection/ClassAndStudentSelection";
import { useGetStudents } from "../../hooks/queries/students";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import AddCircleBlack from "../../icons/AddCircleBlack";

const CreateBill = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data } = useGetSingleBill(id);
  const { data: fee_types } = useGetFeeTypes();

  // get incomes
  const { data: useBills } = useGetBills();

  // const billsWithId = useBills?.map((bill: any) => ({
  //   id: bill.id,
  // }));
  const billsWithId = useBills?.filter((bill: any) => bill.id === Number(id));

  const formattedBillsWithId = billsWithId?.map((bil: any) => bil.classes);

  // console.log("bills", billsWithId);

  const [addClass, setAddClass] = useState<boolean>(true);
  const [addFee, setAddFee] = useState<boolean>(true);
  const [addDiscount, setAddDiscount] = useState<boolean>(true);
  const [partPayment, setPartPayment] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<boolean>(false);

  const [classSearchValue, setClassSearchValue] = useState<string>("");
  const [selectedFee, setSelectedFee] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(200);
  const [selectedFeeId, setSelectedFeeId] = useState(200);
  const [selectedDiscountFeeType, setSelectedDiscountFeeType] = useState(200);
  const [showAddFeeDropdown, setShowAddFeeDropdown] = useState(false);
  const [showDiscountDropdown, setShowDiscountDropdown] = useState(false);
  const [selectedFeeForDiscount, setSelectedFeeForDiscount] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const [discountValue, setDiscounValue] = useState(1);
  const [discountedAmount, setDiscountAmout] = useState(0);
  const [discountIndex, setDiscountIndex] = useState(0);

  const [fees, setFees] = useState<Fee[]>([]);

  const [fields, setFields] = useState({
    billName: data?.bill_name,
    dueDate: data?.due_date,
    term: data?.term,
    session: data?.session,
    status: "draft",
    classes: [],
    amount: 0,
    mandatory: false,
  });

  useEffect(() => {
    setFees(data?.fees);
    setFields({
      ...fields,
      dueDate: data?.due_date,
      billName: data?.bill_name,
      term: data?.term,
      session: data?.session,
    });
  }, [data]);

  // const { data: classesAndStudents, isLoading: studentsLoading } =
  //   useGetStudents();

  const { data: classesAndStudents } = useGetStudents(
    fields.term || "SECOND TERM",
    fields.session || "2023/2024"
  );

  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      // id: 0,
      value: 0,
      description: "",
      fee_type: "",
      amount: 0,
      is_percentage: true,
      students: [],
      classes: [],
    },
  ]);

  // const [discounts, setDiscounts] = useState<Discount[]>([]);

  // useEffect(() => {
  //   setAddDiscount(discounts.length > 0 ? true : false);
  // }, []);

  const [mainDiscounts, setMainDiscounts] = useState([]);

  useEffect(() => {
    if (data) {
      // Extract discounts from bill data
      // const extractedDiscounts = data.fees.map((fee: any) => ({
      //   value: fee?.fee_type?.discounts[0]?.value,
      //   description: fee?.fee_type?.discounts[0]?.description,
      //   fee_type: fee?.fee_type?.discounts[0]?.fee_type,
      //   amount: fee?.fee_type.discounts[0]?.amount,
      //   is_percentage: fee?.fee_type?.discounts[0]?.is_percentage,
      //   students: fee?.fee_type?.discounts[0]?.students,
      //   classes: fee?.fee_type?.discounts[0]?.classes,
      // }));
      const extractedDiscounts = data.fees.flatMap(
        (fee: any, index: number) => {
          if (
            fee?.fee_type?.discounts &&
            fee.fee_type.discounts.length > 0 && // Check if discounts array is not empty
            fee.fee_type.discounts.some((discount: any) => !!discount) // Check if any discount is truthy
          ) {
            return fee.fee_type.discounts.map(
              (discount: any, index: number) => ({
                // index: index,
                id: discount.id,
                value: discount.value,
                description: discount.description,
                fee_type: discount.fee_type,
                amount: discount.amount,
                is_percentage: discount.is_percentage,
                students: discount.students,
                classes: discount.classes,
              })
            );
          } else {
            return [];
          }
        }
      );
      // setAddDiscount(extractedDiscounts[0].value ? true : false);
      setMainDiscounts(extractedDiscounts);
      setDiscounts(extractedDiscounts);
    }
  }, [data]);

  // const [discounted, setDiscounted] = useState<Discount[]>([]);

  const formattedFeeType = data?.fees?.map((fee: any) => fee?.fee_type?.name);

  // const formattedDiscount = data?.fees?.map((fee) => ({
  //   discount: fee?.fee_type?.discounts,
  // }));

  // const formattedDiscount = fees?.map((fee: any) =>
  //   fee?.fee_type?.discounts.map((d: any) => ({
  //     value: d?.value,
  //     description: d?.description,
  //     fee_type: d?.fee_type,
  //     amount: d?.amount,
  //     is_percentage: d?.is_percentage,
  //     students: d?.students,
  //     classes: d?.classes,
  //   }))
  // );

  // const formattedDiscount = data?.fees?.map(
  //   (fee: any) => fee?.fee_type?.discounts
  // );
  // const formattedDiscountNew = formattedDiscount?.map((d: any) => d[0]);
  // const formattedDiscountFinal = formattedDiscountNew?.map((d: any) => ({
  //   value: d?.value,
  //   description: d?.description,
  //   fee_type: d?.fee_type,
  //   amount: d?.amount,
  //   is_percentage: d?.is_percentage,
  //   students: d?.students,
  //   classes: d?.classes,
  // }));

  // useEffect(() => {
  //   // console.log("final", formattedDiscountFinal);
  //   setDiscounts(formattedDiscountFinal);
  // }, [data]);

  // populate the discount fields
  useEffect(() => {}, []);
  const getDiscount = discounts.map((dis, i) => ({
    fee_type: dis?.fee_type,
  }));

  useEffect(() => {
    // Calculate the total amount
    const totalAmount = fees?.reduce(
      (total: number, fee: Fee) => Number(total) + Number(fee.amount),
      0
    );
    setFields({ ...fields, amount: totalAmount });
  }, [fees]);

  // console.log("ss", formattedBillsWithId[0]);

  let storedClasses =
    formattedBillsWithId[0] ||
    JSON.parse(localStorage.getItem("classes") || "");
  // JSON.parse(localStorage.getItem("classes" || ""));

  let formattedStoredClasses = storedClasses?.map((c: any, index: number) => ({
    // id: c.id,
    // name: c.class_name,
    id: index,
    name: c?.name,
  }));

  const [selectedClasses, setSelectedClasses] = useState<any>(
    formattedStoredClasses
  );

  // formattedBillsWithId

  // const calcDiscountedValue = () => {
  //   const filterFeesByFeeTypeName = (): Fee[] => {
  //     return fees
  //       ? fees?.filter((fee) => fee.fee_type.name === selectedFeeForDiscount)
  //       : [];
  //   };
  //   let discounted =
  //     (Number(filterFeesByFeeTypeName()[0]?.fee_type?.default_amount) *
  //       discountValue) /
  //     100;
  //   setDiscountAmout(Number(discounted));
  // };

  // useEffect(() => {
  //   calcDiscountedValue();
  // }, [discountValue, selectedFeeForDiscount]);

  const { data: schoolData } = useGetSchoolDetails();
  const { data: classes } = useGetClasses();
  const formattedClasses = classes?.map((c: any, index: number) => ({
    // id: c.idx,
    // name: c?.class_field,
    id: index,
    name: c?.class_id,
  }));
  // console.log(formattedClasses);

  const schoolDetailsLocal = JSON.parse(
    localStorage.getItem("userDetails") || ""
  );

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

  const [feeTypeId, setFeeTypeId] = useState(0);

  const handleAddDiscount = () => {
    const newDiscount: Discount = {
      value: 0,
      description: "",
      fee_type: "",
      amount: 0,
      is_percentage: true,
      students: [],
      classes: [],
    };
    setDiscounts([...discounts, newDiscount]);
  };
  const handleAddDiscount2 = () => {
    const newDiscount: Discount = [
      {
        value: 0,
        description: "",
        fee_type: "",
        amount: 0,
        is_percentage: true,
        students: [],
        classes: [],
      },
      {
        value: 0,
        description: "",
        fee_type: "",
        amount: 0,
        is_percentage: true,
        students: [],
        classes: [],
      },
    ];
    setDiscounts(newDiscount);
  };

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

  const [discounted, setDiscounted] = useState(0);
  const [feeTypeAmount, setFeeTypeAmount] = useState(0);

  const handleDiscountChange = (
    index: number,
    field: string,
    value: any,
    feeType: string,
    id: number
  ) => {
    // const filterFeesByFeeTypeName = (): Fee[] => {
    //   return fees?.filter(
    //     (fee) => fee.fee_type.name === getDiscount[discountIndex].fee_type
    //   );
    // };
    // let discounted = Number(
    //   (Number(filterFeesByFeeTypeName()[0]?.fee_type?.default_amount) *
    //     discounts[discountIndex].value) /
    //     100
    // );

    const updatedDiscount = discounts.map((discount, i) =>
      i === index
        ? {
            ...discount,
            // amount: discounted,
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

    const updatedFees = fees?.map((fee, i) =>
      fee.fee_type.name === feeType && i === id
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

  // // Function to calculate the discount amount
  // const calculateDiscountAmount = (discount: Discount, fees: Fee[]) => {
  //   if (!fees) return 0;
  //   // Find the fee associated with the discount
  //   const fee = fees.find((fee) => fee?.fee_type?.name === discount?.fee_type);

  //   // If fee is not found or discount is not applied to a fee, return 0
  //   if (!fee) return 0;

  //   // Calculate the discount amount based on whether it's a percentage or fixed amount
  //   let discountAmount = discount.is_percentage
  //     ? (fee.amount * discount.value) / 100
  //     : discount.value;

  //   return discountAmount;
  // };

  // useEffect(() => {
  //   // Calculate discount amount for each discount
  //   const updatedDiscounts = discounts.map((discount, index) => ({
  //     ...discount,
  //     amount: calculateDiscountAmount(discount, fees),
  //   }));

  //   // Update the discounts state with calculated discount amounts
  //   setDiscounts(updatedDiscounts);
  // }, [discounts, fees]);

  //  calculate discount
  // useEffect(() => {
  //   const filterFeesByFeeTypeName = (): Fee[] => {
  //     return fees?.filter(
  //       (fee) => fee?.fee_type?.name === getDiscount[discountIndex]?.fee_type
  //     );
  //   };

  //   let discounted = discounts[discountIndex]?.is_percentage
  //     ? (Number(filterFeesByFeeTypeName()[0]?.fee_type?.default_amount) *
  //         discounts[discountIndex]?.value) /
  //       100
  //     : discounts[discountIndex]?.value;

  //   // setDiscountAmout(Number(discounted));
  //   const updatedDiscount = discounts.map((discount, i) =>
  //     i === discountIndex
  //       ? {
  //           ...discount,
  //           amount: discounted,
  //         }
  //       : discount
  //   );
  //   setDiscounts(prevDiscounts => updatedDiscount);
  // }, [
  //   discounts[discountIndex].value,
  //   getDiscount[discountIndex].fee_type,
  //   discounts[discountIndex].is_percentage,
  // ]);

  const calculateDiscount = useCallback(() => {
    // Make sure dependencies are available
    if (!fees || !discounts || !getDiscount || !discountIndex) return;

    const filterFeesByFeeTypeName = () => {
      return fees?.filter(
        (fee) => fee?.fee_type?.name === getDiscount[discountIndex]?.fee_type
      );
    };

    // Retrieve the fee associated with the current discount
    const filteredFees = filterFeesByFeeTypeName();
    // if (!filteredFees.length) return;

    const feeAmount = Number(filteredFees[0]?.fee_type?.default_amount);
    const discountValue = discounts[discountIndex]?.value;
    const isPercentage = discounts[discountIndex]?.is_percentage;

    // Calculate the discounted amount
    let discounted = isPercentage
      ? (feeAmount * discountValue) / 100
      : discountValue;

    // console.log("am", discounted);

    // Update the discount amount in the discounts array
    const updatedDiscounts = discounts.map((discount, i) =>
      i === discountIndex
        ? {
            ...discount,
            amount: discounted,
          }
        : discount
    );
    setDiscounts(updatedDiscounts);
  }, [fees, discounts, getDiscount, discountIndex]);

  useEffect(() => {
    calculateDiscount();
  }, [fees, discounts, getDiscount, discountIndex]);

  // const handleClassChange = (index: number, selectedClasses: number[]) => {
  //   const updatedFees = fees.map((fee, i) =>
  //     i === index
  //       ? {
  //           ...fee,
  //           fee_type: {
  //             ...fee.fee_type,
  //             classes: selectedClasses,
  //           },
  //         }
  //       : fee
  //   );

  //   setFees(updatedFees);
  // };
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

  // const handleClassDropdownChange = (
  //   index: number,
  //   selectedClasses: number[]
  // ) => {
  //   // Call the handleClassChange function to update the fees state
  //   handleClassChange(index, selectedClasses);
  // };

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

  // useEffect(() => {
  //   // Calculate the total amount
  //   const totalAmount = fees.reduce((total, fee) => total + fee.amount, 0);
  //   setFields({ ...fields, amount: totalAmount });
  // }, [fees]);

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
    if (fields.term == "" && fields.session == "") {
      toast.error("Please enter the term and session first");
      return;
    }

    if (selectedDiscount === index) {
      setSelectedDiscountFeeType(200);
    } else {
      setSelectedDiscountFeeType(index);
    }
  };

  const { data: term } = useGetTerm();

  const formattedTerm = term?.map((t: any, index: any) => ({
    id: index,
    name: t?.term_id,
  }));

  const { mutate, isLoading } = useUpdateBill(id ? id : "");

  // console.log("class", selectedClasses);

  //submit form
  const submit = () => {
    if (isNaN(Number(fields.amount))) {
      toast.error("Amount field can only contain numbers");
      return;
    }
    // console.log("fees", fees);

    const updatedFees = fees.map((fee, i) =>
      fee.fee_type.classes
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,

              classes:
                fee?.fee_type?.classes?.length === formattedStoredClasses.length
                  ? selectedClasses?.map(({ name }: any) => ({ name }))
                  : fee?.fee_type?.classes?.length === 0 &&
                    fee?.fee_type?.students?.length === 0
                  ? selectedClasses?.map(({ name }: any) => ({ name }))
                  : fee?.fee_type?.classes,
            },
          }
        : fee
    );

    let dataToSend = {
      bill_name: fields?.billName,
      due_date: fields?.dueDate,
      term: fields?.term,
      session: fields?.session,
      status: "draft",
      classes: selectedClasses,
      fees: updatedFees,
      // fees: fees,
      // amount: fields.amount,
      // mandatory: false,
    };

    // console.log("data to send", dataToSend);

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success("Bill updated successfully");
        setFields({ ...fields });
        navigate("/bills-fees-management");
        queryClient.invalidateQueries({
          queryKey: `update-bill`,
        });
      },

      onError: (e) => {
        toast.error(e?.response.data.bill_name || "Error updating bill");
      },
    });
  };

  return (
    <div>
      <Header />
      <div className="bills_overview">
        <h2 className="bills_overview__title">{fields.billName || ""} Bill</h2>
        <h1 className="bills_overview__approval">APPROVAL STATUS: Pending</h1>
        <h1 className="bills_overview__status">STATUS: Draft</h1>
      </div>

      <div className="bills_schoolInfo">
        <div className="bills_schoolInfo__logo">
          <img
            src={
              schoolData
                ? schoolData?.data[0]?.arm?.logo
                : schoolDetailsLocal?.logo
            }
            alt=""
          />
        </div>
        <div className="bills_schoolInfo__details">
          {schoolData
            ? schoolData?.data[0]?.arm?.name
            : schoolDetailsLocal?.name}
          <p style={{ fontSize: "22px" }}>
            {schoolData?.data[0]?.arm?.address || schoolDetailsLocal?.address}
          </p>
          {fields.billName ? `${fields.billName}` : ""}
          <p className="bills_schoolInfo__details__email">
            Email:{" "}
            {schoolData
              ? schoolData?.data[0]?.arm?.email
              : schoolDetailsLocal?.contact}
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
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.billName}
            // defaultValue={data && data?.bill_name}
            fieldClass={"input-field"}
            errorMessage={""}
            id={"billName"}
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

          <TextInput
            label="Bill Due Date"
            placeholder="Bill Name"
            name="dueDate"
            type="date"
            errorClass={"error-msg"}
            handleChange={handleChange}
            value={fields.dueDate}
            // defaultValue={data && data?.due_date}
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
            // defaultValue={data && data?.term}
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
            // defaultValue={data && data?.session}
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
              toggleOption={function (a: any): void {
                throw new Error("");
              }}
              selectedValues={undefined}
              options={[]}
              disabled={true}
            />
          </div>

          <div className="bills_form__other_form__addons">
            <p
              onClick={() => setAddFee(!addFee)}
              style={{ width: "fit-content" }}
            >
              <AddCircleBlue />
              Add Fee
            </p>
            {fees?.length > 0 && (
              <div className="bills_form__other_form__addons__addFee">
                {addFee &&
                  fees?.map((fee, index) => (
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
                              defaultValue={fee.fee_type.name}
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
                                selectedClassesInParent={fee.fee_type.classes}
                                selectedStudentsInParent={fee.fee_type.students}
                                classes={classesAndStudents as any}
                                cancel={() =>
                                  showClasses(fee.fee_type.name, index)
                                }
                                // onClassChange={(selectedClasses: number[]) =>
                                //   handleClassDropdownChange(
                                //     index,
                                //     selectedClasses
                                //   )
                                // }
                                onClassChange={(
                                  // index: any,
                                  selectedClasses: any,
                                  selectedStudents: any
                                ) =>
                                  handleClassDropdownChange(
                                    index,
                                    selectedClasses,
                                    selectedStudents
                                  )
                                }
                                onStudentsChange={(
                                  selectedStudents: number[]
                                ) =>
                                  handleStudentDropdownChange(
                                    index,
                                    selectedStudents
                                  )
                                }
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
                  <div
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
                  </div>
                )}
              </div>
            )}
            {/* 
            <p onClick={() => setAddDiscount(!addDiscount)}>
              <AddCircleBlue />
              Add Discount
            </p> */}

            {discounts?.length > 0 ? (
              <p
                onClick={() => setAddDiscount(!addDiscount)}
                style={{
                  width: "fit-content",
                }}
              >
                <AddCircleBlue />
                Add Discount
              </p>
            ) : (
              <p
                onClick={handleAddDiscount2}
                style={{
                  width: "fit-content",
                }}
              >
                <AddCircleBlue />
                Add Discount
              </p>
            )}

            {/* {formattedDiscount?.length &&
              formattedDiscount?.map((disc, index) => {
                return (
                  <>
                    <p>{disc.discount[index].description}</p>
                    <p>{disc.discount}</p>
                  </>
                );
              })} */}
            {/* {addDiscount && discounts?.length > 0
              ? discounts.map((d, index) =>
                  index >= 1 ? <div>Yes{d.amount}</div> : null
                )
              : discounts.map((d, index) =>
                  index >= 1 ? <div>Yes{d.amount}</div> : null
                )} */}

            {mainDiscounts?.length > 0
              ? addDiscount &&
                discounts?.map((d, index) => (
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
                            // defaultValue={d.value}
                            onChange={(e) =>
                              handleDiscountChange(
                                index,
                                "value",
                                e.target.value,
                                d.fee_type,
                                feeTypeId
                              )
                            }
                            placeholder="type or select fee type"
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
                                onStudentsChange={(
                                  selectedStudents: number[]
                                ) =>
                                  handleStudentDropdownChange(
                                    index,
                                    selectedStudents
                                  )
                                }
                              />
                            )}
                        </div>
                      </div>
                      Off
                      {/* <p>{d.fee_type}</p> */}
                      <div style={{ position: "relative" }}>
                        <div className="bills_form__other_form__addons__addDiscount__input">
                          <input
                            type="text"
                            name=""
                            id=""
                            value={d.fee_type}
                            // defaultValue={d.fee_type}
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
                            fees.map((fee, i) => (
                              <div
                                className="discount_dropdown__item"
                                onClick={() => {
                                  // setSelectedFeeForDiscount(fee?.fee_type?.name);
                                  setFeeTypeAmount(
                                    fee?.fee_type?.default_amount
                                  );
                                  setDiscountIndex(index);
                                  handleDiscountChange(
                                    index,
                                    "fee_type",
                                    fee?.fee_type?.name,
                                    d.fee_type,
                                    i
                                  );
                                  setFeeTypeId(i);
                                  setShowDiscountDropdown(false);
                                }}
                              >
                                <p>{fee?.fee_type?.name}</p>
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
                            // defaultValue={d.description}
                            placeholder="Reason for discount"
                            onFocus={() => {
                              setDiscountIndex(index);
                              setShowAuth(true);
                            }}
                            onBlur={() => {
                              setShowAuth(false);
                            }}
                            onChange={(e) => {
                              handleDiscountChange(
                                index,
                                "description",
                                e.target.value,
                                d.fee_type,
                                feeTypeId
                              );
                              // setDiscountIndex(index);
                              // setShowAuth(true);
                            }}
                          />
                          {showAuth && index === discountIndex && (
                            <p
                              // style={{
                              //   position: "absolute",
                              //   color: "red",
                              //   fontSize: "11px",
                              // }}
                              style={{
                                color: "#FFA800",
                                fontSize: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                position: "absolute",
                                // right: "50px",
                                // marginTop: "65px",
                              }}
                            >
                              <Caution />
                              Please re-select this Fee Type
                            </p>
                          )}
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
                ))
              : discounts?.length > 0 &&
                addDiscount &&
                discounts.map((d, index) =>
                  index >= 1 ? (
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
                              // defaultValue={d.value}
                              onChange={(e) =>
                                handleDiscountChange(
                                  index,
                                  "value",
                                  e.target.value,
                                  d.fee_type,
                                  feeTypeId
                                )
                              }
                              placeholder="type or select fee type"
                            />

                            <button
                              onClick={() => showClassesForDiscount(index)}
                            >
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
                                  onStudentsChange={(
                                    selectedStudents: number[]
                                  ) =>
                                    handleStudentDropdownChange(
                                      index,
                                      selectedStudents
                                    )
                                  }
                                />
                              )}
                          </div>
                        </div>
                        Off
                        {/* <p>{d.fee_type}</p> */}
                        <div style={{ position: "relative" }}>
                          <div className="bills_form__other_form__addons__addDiscount__input">
                            <input
                              type="text"
                              name=""
                              id=""
                              value={d.fee_type}
                              // defaultValue={d.fee_type}
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
                              fees.map((fee, i) => (
                                <div
                                  className="discount_dropdown__item"
                                  onClick={() => {
                                    // setSelectedFeeForDiscount(fee?.fee_type?.name);
                                    setFeeTypeAmount(
                                      fee?.fee_type?.default_amount
                                    );
                                    setDiscountIndex(index);
                                    handleDiscountChange(
                                      index,
                                      "fee_type",
                                      fee?.fee_type?.name,
                                      d.fee_type,
                                      i
                                    );
                                    setFeeTypeId(i);
                                    setShowDiscountDropdown(false);
                                  }}
                                >
                                  <p>{fee?.fee_type?.name}</p>
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
                              // defaultValue={d.description}
                              placeholder="Reason for discount"
                              onKeyDown={() => {
                                setDiscountIndex(index);
                                setShowAuth(true);
                              }}
                              onBlur={() => {
                                setShowAuth(false);
                              }}
                              onChange={(e) => {
                                handleDiscountChange(
                                  index,
                                  "description",
                                  e.target.value,
                                  d.fee_type,
                                  feeTypeId
                                );
                                // setDiscountIndex(index);
                                // setShowAuth(true);
                              }}
                            />
                            {showAuth && index === discountIndex && (
                              <p
                                // style={{
                                //   position: "absolute",
                                //   color: "red",
                                //   fontSize: "11px",
                                // }}
                                style={{
                                  color: "#FFA800",
                                  fontSize: 12,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                  position: "absolute",
                                  // right: "50px",
                                  // marginTop: "65px",
                                }}
                              >
                                <Caution />
                                Please re-select this Fee Type
                              </p>
                            )}
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
                  ) : null
                )}

            {/* {addDiscount && discounts.length > 0 && ( */}
            {discounts && (
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
            {isLoading ? "Updating..." : "Update Bill"}
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
