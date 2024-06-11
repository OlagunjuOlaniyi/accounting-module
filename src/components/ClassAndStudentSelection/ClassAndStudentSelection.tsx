import React, { useEffect, useState } from "react";
import "./classandstudnts.scss";
import Unchecked from "../../icons/Unchecked";
import Checked from "../../icons/Checked";
import Arrow from "../../icons/arrow.svg";

type OriginalData = {
  [className: string]: {
    students: {
      idx: number;
      admissionnumber: string;
      firstname: string;
      lastname: string;
      phonenumber: string;
      parentemail: string;
      parentorguardian: string;
      fathersemail: string;
    }[];
    pagination_info: {
      total_students: number;
      page: number;
      total_pages: number;
      next_page: null | number;
      prev_page: null | number;
    };
  };
};

type ConvertedDataItem = {
  class_name?: string;
  id?: string;
  total_students?: number;
  students_details?: { id: number; name: string }[];
};

const ClassAndStudentSelection = ({
  classes,
  cancel,
  onClassChange,
  onStudentsChange,
  selectedClassesInParent,
  selectedStudentsInParent,
  preSelectedClasses,
  setSelectedClassesDrop,
  selectedClassesDrop,
  setSelectedStudents,
  selectedStudents,
}: {
  classes: OriginalData;
  cancel?: any;
  onClassChange?: any;
  onStudentsChange?: any;
  selectedClassesInParent?: any;
  selectedStudentsInParent?: any;
  preSelectedClasses: any;
  setSelectedClassesDrop: any;
  selectedClassesDrop: any;
  setSelectedStudents: any;
  selectedStudents: any;
}) => {
  // const convertedClasses: ConvertedDataItem[] = Object.entries(classes).map(
  //   ([className, classData]) => ({
  //     class_name: className,
  //     id: className,
  //     total_students: classData?.pagination_info?.total_students,
  //     students_details: classData?.students?.map((student: any) => ({
  //       id: student.idx,
  //       name: `${student.firstname} ${student.lastname}`,
  //       ...student,
  //     })),
  //   })
  // );

  const [convertedClasses, setFilteredClasses] = useState<ConvertedDataItem[]>(
    []
  );
  const [showStudents, setShowStudents] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  // const [selectedClasses, setSelectedClasses] = useState<{ name: string }[]>(
  //   []
  // );
  // const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const filtered = Object.entries(classes || {})
      .map(([className, classData]) => ({
        class_name: className,
        id: className,
        total_students: classData?.pagination_info?.total_students,
        students_details: classData?.students?.map((student: any) => ({
          id: student.idx,
          name: `${student.firstname} ${student.lastname}`,
          ...student,
        })),
      }))
      .filter((c) =>
        preSelectedClasses.some((pc: any) => pc.name === c.class_name)
      );

    setFilteredClasses(filtered);
  }, [classes, preSelectedClasses]);

  useEffect(() => {
    // Sync the selectedClassesDrop state with the selectedClassesInParent when the component mounts or reopens

    setSelectedClassesDrop(selectedClassesInParent || []);
    setSelectedStudents(selectedStudentsInParent || []);
  }, [
    selectedClassesInParent,
    setSelectedClassesDrop,
    setSelectedStudents,
    selectedStudentsInParent,
  ]);

  // useEffect(() => {
  //   // Filter the convertedClasses array to show only the selected classes
  //   const filteredClasses = convertedClasses.filter((c) =>
  //     preSelectedClasses.some((pc) => pc.name === c.class_name)
  //   );
  //   setSelectedClasses(filteredClasses);
  // }, []);

  // const toggleClasses = (name: string) => {
  //   const updatedClasses = selectedClasses.some((obj) => obj.name === name)
  //     ? selectedClasses.filter((obj) => obj.name !== name)
  //     : [...selectedClasses, { name }];

  //   setSelectedClasses(updatedClasses);
  // };
  const toggleClasses = (name: string) => {
    const index = selectedClassesDrop.findIndex(
      (obj: any) => obj.name === name
    );

    if (index === -1) {
      setSelectedClassesDrop([...selectedClassesDrop, { name }]);
    } else {
      setSelectedClassesDrop(
        selectedClassesDrop.filter((obj: any) => obj.name !== name)
      );
    }

    // if (index === -1) {
    //   // If the ID doesn't exist in the array, add it
    //   setSelectedClassesDrop([...selectedClassesDrop, { name: name }]);
    // } else {
    //   // If the ID exists in the array, remove it
    //   setSelectedClassesDrop([
    //     ...selectedClassesDrop.slice(0, index),
    //     ...selectedClassesDrop.slice(index + 1),
    //   ]);
    // }
  };

  const toggleStudents = (details: any) => {
    const updatedStudents = selectedStudents.some(
      (obj: any) => obj.name === details.name
    )
      ? selectedStudents.filter((obj: any) => obj.name !== details.name)
      : [...selectedStudents, details];

    setSelectedStudents(updatedStudents);
  };

  const isSelected = (name: string) => {
    const selected = selectedClassesDrop.some((obj: any) => obj.name === name);
    // ||      selectedClassesInParent.some(
    //   (obj: { name: string }) => obj.name === name
    // );

    return selected;
  };

  const isStudentSelected = (name: string) => {
    return selectedStudents.some((obj: any) => obj?.name === name);
    // ||
    // selectedStudentsInParent.some(
    //   (obj: { name: string }) => obj?.name === name
    // )
  };

  const resetFilters = () => {
    setSelectedClassesDrop([]);
    setSelectedStudents([]);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredClasses = convertedClasses.filter(
    (c) =>
      c.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.students_details.some((student: any) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  console.log("class", selectedClassesDrop);
  console.log("selectedClassesInParent", selectedClassesInParent);

  const Icon = () => {
    return (
      <svg
        width="4"
        height="8"
        viewBox="0 0 4 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.666504 7.3335L3.99984 4.00016L0.666504 0.66683L0.666504 7.3335Z"
          fill="#323232"
        />
      </svg>
    );
  };

  return (
    <div className="class-and-students">
      <div className="class-and-students__heading">
        <p className="class-and-students__heading__title">
          Assign To Class/ Student
        </p>
        <p className="class-and-students__heading__cancel" onClick={cancel}>
          Cancel
        </p>
      </div>
      <div className="class-and-students__search">
        <input
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {/* <div className="class-and-students__list">
        <div className="class-and-students__list__left">
          <Unchecked />
          <p>All Classes</p>
        </div>
        <div className="class-and-students__list__right"></div>
      </div> */}
      {filteredClasses.length === 0 ? (
        <div
          className="class-and-students__no-options"
          style={{ textAlign: "center" }}
        >
          No options available
        </div>
      ) : (
        filteredClasses.map((c: any) => (
          <div key={c.id}>
            <div className="class-and-students__list">
              <div className="class-and-students__list__left">
                <div onClick={() => toggleClasses(c.class_name)}>
                  {isSelected(c.class_name) ? <Checked /> : <Unchecked />}
                </div>
                <p
                  onClick={() => {
                    setSelectedId(c.id);
                    setShowStudents(selectedId !== c.id ? true : !showStudents);
                  }}
                >
                  {c?.class_name}
                </p>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedId(c.id);
                    setShowStudents(selectedId !== c.id ? true : !showStudents);
                  }}
                >
                  <img src={Arrow} alt="" />
                </div>
              </div>
              <div className="class-and-students__list__right">
                <p>{c?.total_students}</p>
              </div>
            </div>
            {showStudents &&
              selectedId === c.id &&
              c?.students_details.map((s: any) => (
                <div
                  key={s.id}
                  className="class-and-students__list"
                  style={{ marginLeft: "32px" }}
                  onClick={() => {
                    toggleStudents(s);
                  }}
                >
                  <div className="class-and-students__list__left">
                    {isStudentSelected(s?.name) || isSelected(c?.class_name) ? (
                      <Checked />
                    ) : (
                      <Unchecked />
                    )}
                    <p>{s?.name}</p>
                  </div>
                </div>
              ))}
          </div>
        ))
      )}
      {/* {filteredClasses.map((c: any) => (
        <div key={c.id}>
          <div className="class-and-students__list">
            <div className="class-and-students__list__left">
              <div onClick={() => toggleClasses(c?.class_name)}>
                {isSelected(c?.class_name) ? <Checked /> : <Unchecked />}
              </div>

              <p
                onClick={() => {
                  setSelectedId(c.id);
                  setShowStudents(selectedId !== c.id ? true : !showStudents);
                }}
              >
                {c?.class_name}
              </p>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedId(c.id);
                  setShowStudents(selectedId !== c.id ? true : !showStudents);
                }}
              >
                {/* <Icon /> * 
                <img src={Arrow} alt="" />
              </div>
            </div>
            <div className="class-and-students__list__right">
              <p>{c?.total_students}</p>
            </div>
          </div>
          {showStudents &&
            selectedId === c.id &&
            c?.students_details.map((s: any) => (
              <div
                key={s.id}
                className="class-and-students__list"
                style={{ marginLeft: "32px" }}
                onClick={() => {
                  toggleStudents(s);
                }}
              >
                <div className="class-and-students__list__left">
                  {isStudentSelected(s?.name) || isSelected(c?.class_name) ? (
                    <Checked />
                  ) : (
                    <Unchecked />
                  )}
                  <p>{s?.name}</p>
                </div>
              </div>
            ))}
        </div>
      ))} */}

      <div className="class-and-students__footer">
        <p onClick={resetFilters}>Reset Filters</p>
        <button
          style={{
            background: "#439ADE",
            color: "white",
            padding: "16px 20px",
            borderRadius: "5px",
          }}
          onClick={() => {
            onStudentsChange(selectedStudents);
            onClassChange(selectedClassesDrop, selectedStudents);
            cancel();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ClassAndStudentSelection;
