import React, { useState } from 'react';
import './classandstudnts.scss';
import Unchecked from '../../icons/Unchecked';
import Checked from '../../icons/Checked';

const ClassAndStudentSelection = ({
  classes,
  cancel,
  onClassChange,
  onStudentsChange,
}: any) => {
  const [showStudents, setShowStudents] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const toggleClasses = (id: number) => {
    const index = selectedClasses.indexOf(id);

    if (index === -1) {
      // If the ID doesn't exist in the array, add it
      setSelectedClasses([...selectedClasses, id]);
    } else {
      // If the ID exists in the array, remove it
      setSelectedClasses([
        ...selectedClasses.slice(0, index),
        ...selectedClasses.slice(index + 1),
      ]);
    }
  };

  const toggleStudents = (id: number) => {
    const index = selectedStudents.indexOf(id);

    if (index === -1) {
      // If the ID doesn't exist in the array, add it
      setSelectedStudents([...selectedStudents, id]);
    } else {
      // If the ID exists in the array, remove it
      setSelectedStudents([
        ...selectedStudents.slice(0, index),
        ...selectedStudents.slice(index + 1),
      ]);
    }
  };

  const isSelected = (id: number) => {
    return selectedClasses.includes(id);
  };

  const isStudentSelected = (id: number) => {
    return selectedStudents.includes(id);
  };
  const Icon = () => {
    return (
      <svg
        width='4'
        height='8'
        viewBox='0 0 4 8'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M0.666504 7.3335L3.99984 4.00016L0.666504 0.66683L0.666504 7.3335Z'
          fill='#323232'
        />
      </svg>
    );
  };

  return (
    <div className='class-and-students'>
      <div className='class-and-students__heading'>
        <p className='class-and-students__heading__title'>
          Assign To Class/ Student
        </p>
        <p className='class-and-students__heading__cancel' onClick={cancel}>
          Cancel
        </p>
      </div>
      <div className='class-and-students__search'>
        <input placeholder='Search' />
      </div>
      <div className='class-and-students__list'>
        <div className='class-and-students__list__left'>
          <Unchecked />
          <p>All Classes</p>
        </div>
        <div className='class-and-students__list__right'>
          <p>36</p>
        </div>
      </div>
      {classes?.map((c: any) => (
        <div key={c.id}>
          <div className='class-and-students__list'>
            <div className='class-and-students__list__left'>
              <div onClick={() => toggleClasses(c?.id)}>
                {isSelected(c?.id) ? <Checked /> : <Unchecked />}
              </div>

              <p>{c?.class_name}</p>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setShowStudents(!showStudents);
                  setSelectedId(c.id);
                }}
              >
                <Icon />
              </div>
            </div>
            <div className='class-and-students__list__right'>
              <p>{c?.total_students}</p>
            </div>
          </div>
          {showStudents &&
            selectedId === c.id &&
            c?.students_details.map((s: any) => (
              <div
                key={s.id}
                className='class-and-students__list'
                style={{ marginLeft: '32px' }}
                onClick={() => {
                  toggleStudents(s?.id);
                }}
              >
                <div className='class-and-students__list__left'>
                  {isStudentSelected(s?.id) ? <Checked /> : <Unchecked />}
                  <p>{s?.name}</p>
                </div>
              </div>
            ))}
        </div>
      ))}
      <div className='class-and-students__footer'>
        <p>Reset Filters</p>
        <button
          onClick={() => {
            onStudentsChange(selectedStudents);
            onClassChange(selectedClasses);
            cancel();
          }}
        >
          Add Student
        </button>
      </div>
    </div>
  );
};

export default ClassAndStudentSelection;
