import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../Button';

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  addButtonText?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  addButtonText = 'Add New'
}) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
      {onAdd && (
        <div className="p-4 border-b border-gray-200">
          <Button onClick={onAdd}>{addButtonText}</Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                    }`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      {onEdit && (
                        <Button
                          variant="secondary"
                          onClick={() => onEdit(row)}
                        >
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="secondary"
                          onClick={() => onDelete(row)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};