import React from 'react';
import { useTable, useSortBy } from 'react-table';
import './table.scss';
import SortArrow from '../../icons/SortArrow';
import { useNavigate } from 'react-router';

const TableProfitLoss = ({
  columns,
  data,
  route = 'chart-of-account/type-profit-and-loss',
}: any) => {
  const navigate = useNavigate();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              // Add the sorting props to control sorting. For this example
              // we can add them into the header props
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {/* Add a sort direction indicator */}
                <span>
                  <SortArrow />
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row :  any, i) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              onClick={() =>
                navigate(`/${route}/${row?.original?.transaction_type}`, {
                  state: { from: window.location.pathname },
                })
              }
              style={{ cursor: 'pointer' }}
            >
              {row.cells.map((cell:any) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableProfitLoss;
