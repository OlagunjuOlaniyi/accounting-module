import { Key } from 'react';

const TableBody = ({ tableData, columns, nameOfClass }: any) => {
  return (
    <tbody>
      {tableData.map(
        (data: { [x: string]: any; id: Key | null | undefined }) => {
          return (
            <tr key={data.id}>
              {columns.map(({ accessor }: any) => {
                const tData = data[accessor] ? data[accessor] : '——';
                return (
                  <td key={accessor}>
                    {nameOfClass ? (
                      <p className={nameOfClass}>{tData}</p>
                    ) : (
                      tData
                    )}
                  </td>
                );
              })}
            </tr>
          );
        }
      )}
    </tbody>
  );
};

export default TableBody;
