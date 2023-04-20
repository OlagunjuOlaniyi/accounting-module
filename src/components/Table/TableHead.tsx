import { useState } from 'react';
import SortArrow from '../../icons/SortArrow';
const TableHead = ({ columns, handleSorting }: any) => {
  const [sortField, setSortField] = useState<string>('');
  const [order, setOrder] = useState<string>('asc');

  const handleSortingChange = (accessor: any) => {
    const sortOrder =
      accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <thead>
      <tr>
        {columns.map(({ label, accessor, sortable }: any) => {
          const cl = sortable
            ? sortField === accessor && order === 'asc'
              ? 'up'
              : sortField === accessor && order === 'desc'
              ? 'down'
              : 'default'
            : '';
          return (
            <th
              key={accessor}
              onClick={
                sortable
                  ? () => handleSortingChange(accessor)
                  : () => console.log('')
              }
              className={cl}
            >
              <div className='each-head'>
                {label}
                {sortable && <SortArrow />}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
