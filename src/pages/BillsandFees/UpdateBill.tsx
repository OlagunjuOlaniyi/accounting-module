import { useEffect, useState } from "react";

import "./BillsandFees.scss";
import TextInput from "../../components/Input/TextInput";
import AddCircleBlue from "../../icons/AddCircleBlue";
import ToggleUnchecked from "../../icons/ToggleUnchecked";
import ToggleChecked from "../../icons/ToggleChecked";
import { useGetSchoolDetails } from "../../hooks/queries/SchoolQuery";
import { useNavigate, useParams } from "react-router";
import {
  useGetBills,
  useGetClasses,
  useGetFeeTypes,
  useGetSingleBill,
} from "../../hooks/queries/billsAndFeesMgt";
import { Discount, Fee } from "../../types/types";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import { useUpdateBill } from "../../hooks/mutations/billsAndFeesMgt";
import DeleteRed from "../../icons/DeleteRed";
import ClassAndStudentSelection from "../../components/ClassAndStudentSelection/ClassAndStudentSelection";
import { useGetStudents } from "../../hooks/queries/students";
import Header from "../../components/Header/Header";

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

  const formattedBillsWithId = billsWithId?.map((bil) => bil.classes);

  // console.log("bills", formattedBillsWithId[]);

  const [addClass, setAddClass] = useState<boolean>(true);
  const [addFee, setAddFee] = useState<boolean>(true);
  const [addDiscount, setAddDiscount] = useState<boolean>(false);
  const [partPayment, setPartPayment] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<boolean>(false);

  const [classSearchValue, setClassSearchValue] = useState<string>("");
  const [selectedFee, setSelectedFee] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(200);
  const [selectedDiscountFeeType, setSelectedDiscountFeeType] = useState(200);
  const [showAddFeeDropdown, setShowAddFeeDropdown] = useState(false);
  const [showDiscountDropdown, setShowDiscountDropdown] = useState(false);
  const [selectedFeeForDiscount, setSelectedFeeForDiscount] = useState("");

  const [discountValue, setDiscounValue] = useState(1);
  const [discountedAmount, setDiscountAmout] = useState(0);
  const [discountIndex, setDiscountIndex] = useState(0);

  const [fees, setFees] = useState<Fee[]>([]);

  const [fields, setFields] = useState({
    billName: "",
    dueDate: "",
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
    });
  }, [data]);

  const { data: classesAndStudents, isLoading: studentsLoading } =
    useGetStudents();

  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      value: 0,
      description: "",
      fee_type: "",
      discount_amount: 0,
      is_percentage: true,
      students: [],
      classes: [],
    },
  ]);

  // const [discounts, setDiscounts] = useState<Discount[]>([]);

  const [discounted, setDiscounted] = useState<Discount[]>([]);

  const formattedDiscount = data?.fees?.map((fee) => fee?.fee_type?.discounts);

  // const formattedDiscount = data?.fees?.map((fee) => ({
  //   discount: fee?.fee_type?.discounts,
  // }));

  const formattedDiscountNew = formattedDiscount?.map((d) => d[0]);
  const formattedDiscountFinal = formattedDiscountNew?.map((d) => ({
    value: d?.value,
    description: d?.description,
    fee_type: d?.fee_type,
    discount_amount: d?.discount_amount,
    is_percentage: d?.is_percentage,
    students: d?.students,
    classes: d?.classes,
  }));
  // console.log("value", formattedDiscountFinal);

  useEffect(() => {
    setDiscounts(formattedDiscountFinal);
  }, [data]);
  // console.log("value", discounts);

  useEffect(() => {
    // Calculate the total amount
    const totalAmount = fees?.reduce(
      (total: number, fee: Fee) => Number(total) + Number(fee.amount),
      0
    );
    setFields({ ...fields, amount: totalAmount });
  }, [fees]);

  let storedClasses =
    JSON.parse(localStorage.getItem("classes")) || formattedBillsWithId[0];
  // JSON.parse(localStorage.getItem("classes" || ""));

  // console.log("thisis", storedClasses);
  let formattedStoredClasses = storedClasses?.map((c: any) => ({
    id: c.id,
    name: c.class_name,
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
  const formattedClasses = classes?.results?.map((c: any) => ({
    id: c.idx,
    name: c?.class_field,
  }));
  console.log(formattedClasses);

  const toggleClasses = (option: any) => {
    setSelectedClasses((prevSelected: any) => {
      // if it's in, remove
      const newArray = [...prevSelected];

      if (newArray.filter((e) => e.id === option.id).length > 0) {
        return newArray.filter((item) => item.id != option.id);
        // else, add
      } else {
        newArray.push(option);
        return newArray;
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
      mandatory: false,
    };
    setFees([...fees, newFee]);
  };

  const handleAddDiscount = () => {
    const newDiscount: Discount = {
      value: 10,
      description: "",
      fee_type: "",
      discount_amount: 0,
      is_percentage: true,
      students: [],
      classes: [],
    };
    setDiscounts([...discounts, newDiscount]);
  };

  const handleFeeTypeChange = (index: number, field: string, value: any) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              [field]: value,
            },
          }
        : fee
    );
    setFees(updatedFees);
  };

  const handleDiscountChange = (index: number, field: string, value: any) => {
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
            // discount_amount: discounted,
            [field]: value,
          }
        : discount
    );
    setDiscounts(updatedDiscount);
  };

  // populate the discount fields
  // const getDiscount = discounts.map((dis, i) => ({
  //   fee_type: dis.fee_type,
  // }));

  // console.log("get", getDiscount);

  // useEffect(() => {

  //   const filterFeesByFeeTypeName = (): Fee[] => {
  //     return fees?.filter(
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
  //           discount_amount: discounted,
  //         }
  //       : discount
  //   );
  //   setDiscounts(updatedDiscount);
  // }, [discounts]);

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

    setFees(updatedFees);
  };

  const handleClassChangeForDiscount = (
    index: number,
    selectedClasses: number[],
    selectedStudents: any
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
  };

  const handleClassDropdownChangeForDiscount = (
    index: number,
    selectedClasses: number[],
    selectedStudents: any
  ) => {
    handleClassChangeForDiscount(index, selectedClasses, selectedStudents);
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
    // Call the handleClassChange function to update the fees state
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

  const removeFee = (name: string) => {
    let filtered = fees.filter((el) => el.fee_type.name !== name);
    setFees(filtered);
  };

  const handleToggleMandatory = (index: number) => {
    const updatedFees = fees.map((fee, i) =>
      i === index ? { ...fee, mandatory: !fee.mandatory } : fee
    );
    setFees(updatedFees);
  };

  const showClasses = (fee: string) => {
    if (fee == "") {
      toast.error("Please enter the fee type first");
      return;
    }
    if (selectedFee === fee) {
      setSelectedFee("");
    } else {
      setSelectedFee(fee);
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

  const { mutate, isLoading } = useUpdateBill(id ? id : "");

  //submit form
  const submit = () => {
    if (isNaN(Number(fields.amount))) {
      toast.error("Amount field can only contain numbers");
      return;
    }

    let dataToSend = {
      bill_name: fields.billName,
      due_date: fields.dueDate,
      status: "draft",
      classes: selectedClasses,
      fees: fees,
      amount: fields.amount,
      mandatory: false,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success("Bill updated successfully");
        setFields({ ...fields });
        navigate("/bills-fees-management");
        queryClient.invalidateQueries({
          queryKey: `bills`,
        });
      },

      onError: (e) => {
        toast.error("Error updating bill");
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
          <img src={schoolData && schoolData?.data[0]?.arm?.logo} alt="" />
        </div>
        <div className="bills_schoolInfo__details">
          {schoolData && schoolData?.data[0]?.arm?.name}
          <br /> {fields.billName ? `${fields.billName} BILL` : ""}
          <p className="bills_schoolInfo__details__email">
            Email: {schoolData && schoolData?.data[0]?.arm?.email}
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
            defaultValue={data && data?.bill_name}
            fieldClass={"input-field"}
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
            defaultValue={data?.due_date}
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
      </div>

      {addClass && (
        <div className="bills_form__other_form">
          <div className="bills_form__other_form__header">
            <p>ASSIGNED CLASS</p>
            <p>TOTAL BILL AMOUNT</p>
          </div>

          <div className="bills_form__top">
            <TextInput
              label=""
              placeholder="Assign Bill to class"
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
                              onClick={() => showClasses(fee.fee_type.name)}
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
                            selectedFee === fee.fee_type.name && (
                              <ClassAndStudentSelection
                                classes={classesAndStudents as any}
                                cancel={() => showClasses(fee.fee_type.name)}
                                selectedClassesInParent={fee.fee_type.classes}
                                selectedStudentsInParent={fee.fee_type.students}
                                // onClassChange={(selectedClasses: number[]) =>
                                //   handleClassDropdownChange(
                                //     index,
                                //     selectedClasses
                                //   )
                                // }
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
                            <input
                              className="bills_form__other_form__addons__addFee__input__wrapper__input"
                              type="text"
                              name=""
                              id=""
                              placeholder="Amount"
                              value={fee.amount}
                              onChange={(e) =>
                                handleAmountChange(index, e.target.value)
                              }
                            />
                          </div>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => removeFee(fee.fee_type.name)}
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

            {/* {formattedDiscount?.length &&
              formattedDiscount?.map((disc, index) => {
                return (
                  <>
                    <p>{disc.discount[index].description}</p>
                    <p>{disc.discount}</p>
                  </>
                );
              })} */}

            {discounts?.length > 0 &&
              // addDiscount &&
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
                      <div className="bills_form__other_form__addons__addFee__input__wrapper">
                        <input
                          className="bills_form__other_form__addons__addFee__input__wrapper__input"
                          type="text"
                          name=""
                          id=""
                          value={d.value}
                          onChange={(e) =>
                            handleDiscountChange(index, "value", e.target.value)
                          }
                          placeholder="type or select fee type"
                        />
                        <button onClick={() => showClassesForDiscount(index)}>
                          <AddCircleBlue />
                        </button>
                        {selectedDiscount !== 200 &&
                          selectedDiscount === index && (
                            <ClassAndStudentSelection
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
                                  selectedStudents
                                )
                              }
                              onStudentsChange={(selectedStudents: number[]) =>
                                handleStudentDropdownChange(
                                  index,
                                  selectedStudents
                                )
                              }
                            />
                          )}
                      </div>
                    </div>
                    of
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
                              e.target.value
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
                                setDiscountIndex(index);
                                handleDiscountChange(
                                  index,
                                  "fee_type",
                                  fee?.fee_type?.name
                                );
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
                      <input
                        type="text"
                        name=""
                        id=""
                        placeholder=""
                        disabled
                        // value={discountedAmount ? discountedAmount : 0}
                        value={d.discount_amount}
                      />
                    </div>
                    <div className="bills_form__other_form__addons__addDiscount__input">
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
                            e.target.value
                          )
                        }
                      />
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
                            !d.is_percentage
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
                            !d.is_percentage
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

            {/* {addDiscount && discounts.length > 0 && ( */}
            {discounts && (
              <div
                onClick={handleAddDiscount}
                style={{
                  display: "flex",
                  flexDirection: "row",
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
          <button
            style={{
              background: "#E4EFF9",
              padding: "16px 20px",
              borderRadius: "5px",
            }}
          >
            Save as Draft
          </button>

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
