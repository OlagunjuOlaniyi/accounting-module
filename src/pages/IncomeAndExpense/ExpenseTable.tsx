import React from 'react';
import Table from '../../components/Table/Table';
import { tableData } from '../../data';
import { useGetExpenses } from '../../hooks/queries/expenses';

const ExpenseTable = () => {
  //get expenses
  const { data, isLoading } = useGetExpenses();
  console.log(isLoading);
  console.log(data);
  const columns = [
    { label: 'TRANSACTION TYPE', accessor: 'transaction_type', sortable: true },
    {
      label: 'TRANSACTION GROUP',
      accessor: 'transaction_group',
      sortable: true,
    },
    {
      label: 'ACCOUNT',
      accessor: 'account',
      sortable: true,
      sortbyOrder: 'desc',
    },
    { label: 'AMOUNT', accessor: 'amount', sortable: true },
    { label: 'APPROVAL STATUS', accessor: 'approval_status', sortable: false },
    { label: 'ACTIONS', accessor: 'start_date', sortable: false },
  ];
  return (
    <div>
      <div className='table_container'>
        <Table caption='' data={tableData} columns={columns} />
      </div>
    </div>
  );
};

export default ExpenseTable;
