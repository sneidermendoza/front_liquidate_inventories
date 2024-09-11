import {
  ComponentWithAs,
  Table,
  TableCellProps,
  TableColumnHeaderProps,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export type TableColumn<T = any> = {
  id: keyof T;
  text: React.ReactNode | string;
} & TableColumnHeaderProps & { cell: (row: T) => React.ReactNode };

export type TableWrapperProps<T> = {
  columns: TableColumn[];
  rows: T[];
};

export default function TableWrapper<T>({
  columns,
  rows,
}: TableWrapperProps<T>) {
  return (
    <>
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#fff",
              }}
            >
              {columns.map((column) => (
                <Th {...column}>{column.text}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row) => (
              <Tr>
                {columns.map((column) => (
                  <Td>{column.cell(row)}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
