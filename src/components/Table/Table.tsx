import TableBody from './TableBody';
import TableHead from './TableHead';
import { useSortableTable } from '../../hooks/useSortableTable';
import './table.scss';

const Table = ({ caption, data, columns }: any) => {
  const [tableData, handleSorting] = useSortableTable(data, columns);

  return (
    <>
      <table className='table'>
        <caption>{caption}</caption>
        <TableHead {...{ columns, handleSorting }} />
        <TableBody {...{ columns, tableData }} />
      </table>
    </>
  );
};

export default Table;
