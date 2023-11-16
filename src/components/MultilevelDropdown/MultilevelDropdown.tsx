import { useState } from 'react';
import Unchecked from '../../icons/Unchecked';
import '../ClassAndStudentSelection/classandstudnts.scss';
import Checked from '../../icons/Checked';
import './multilevel.scss';

interface Student {
  idx: number;
  admissionnumber: string;
  firstname: string;
  lastname: string;
}

interface PaginationInfo {
  total_students: number;
  page: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface SchoolClass {
  students: Student[];
  pagination_info: PaginationInfo;
}

interface SchoolData {
  [className: string]: SchoolClass;
}

const MultiLevelDropdown: React.FC<{
  data: SchoolData;
  selected: any;
  toggleOption: any;
}> = ({ data, selected, toggleOption }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleClassSelection = (className: string) => {
    setSelectedClass(selectedClass === className ? null : className);
  };

  // Filter classes based on the search term
  const filteredClasses = Object.keys(data)?.filter((className) =>
    className?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className='multi-level-wrapper'>
      <div className='dropdown-menu__search-box'>
        <input
          type='text'
          value={searchTerm}
          placeholder='Search for class'
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredClasses?.map((className) => (
        <div style={{ padding: '8px 16px' }}>
          <div className='class-and-students__list'>
            <div className='class-and-students__list__left'>
              <div onClick={() => handleClassSelection(className)}>
                {selectedClass === className ? <Checked /> : <Unchecked />}
              </div>

              <p>{className}</p>
              <div
                style={{ cursor: 'pointer' }}
                // onClick={() => {
                //   setShowStudents(!showStudents);
                //   setSelectedId(c.id);
                // }}
              ></div>
            </div>
            <div className='class-and-students__list__right'>
              <p>{data[className]?.pagination_info?.total_students}</p>
            </div>
          </div>

          {selectedClass &&
            selectedClass === className &&
            data[selectedClass]?.students?.map((s: any) => (
              <div
                key={s.idx}
                className='class-and-students__list'
                style={{ marginLeft: '32px' }}
                onClick={() => {
                  toggleOption({
                    name: `${s?.firstname} ${s?.lastname}`,
                    id: s?.idx,
                  });
                }}
              >
                <div className='class-and-students__list__left'>
                  {selected?.some((item: { name: string }) =>
                    item?.name?.includes(`${s?.firstname} ${s?.lastname}`)
                  ) ? (
                    <Checked />
                  ) : (
                    <Unchecked />
                  )}
                  <p>
                    {s?.firstname} {s?.lastname}
                  </p>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default MultiLevelDropdown;
