import { Checkbox, Paper, Table, TableProps, Text, useMantineTheme } from '@mantine/core';
import React from 'react';
import classes from '../styles/Table.module.css';
import MantinePagination from './Pagination';

interface CustomTableProps<T> extends TableProps {
  head: ColumnProps<keyof T, T>[];
  values: T[];
  checkbox?: boolean;
  onRowItemClick?: (_item: T) => void;
  onRowsPerPageChange: (_val: string) => void;
  onPageChange: (_val: number) => void;
  pageSize: string;
  total: number;
  page: number;
  selectedRows?: T[];
  setSelectedRows?: React.Dispatch<React.SetStateAction<T[]>>;
}
interface ColumnProps<T, K> {
  label: string;
  key: T;
  render?: (_row: K, _val: any) => React.ReactNode;
}
const MantineTable = <T,>({
  head,
  values,
  checkbox = false,
  onRowItemClick,
  onRowsPerPageChange,
  onPageChange,
  pageSize,
  total,
  page,
  selectedRows,
  setSelectedRows,
  ...props
}: CustomTableProps<T>) => {
  const theme = useMantineTheme();

  const tableHead = head.map((item, index) => <Table.Th key={index}>{item.label}</Table.Th>);

  const tableData = values?.map((item, index) => (
    <Table.Tr
      key={index + 1}
      className={classes.row_hover}
      onClick={() => onRowItemClick && onRowItemClick(item)}
      style={{
        cursor: 'pointer',
        backgroundColor: (index + 1) % 2 === 0 ? theme.colors.brandSecondary[7] : '',
      }}
    >
      {checkbox && selectedRows && setSelectedRows && (
        <Table.Td>
          <Checkbox
            style={{ cursor: 'pointer', zIndex: 100 }}
            checked={
              selectedRows.find((val) => JSON.stringify(val) === JSON.stringify(item)) !== undefined
            }
            onChange={(event) => {
              setSelectedRows(
                event.currentTarget.checked
                  ? [...selectedRows, item]
                  : selectedRows.filter((val) => JSON.stringify(val) !== JSON.stringify(item))
              );
            }}
          />
        </Table.Td>
      )}
      {head.map((key, keyIndex) => (
        <>
          <Table.Td key={keyIndex}>
            {key.render ? (
              key.render(item, item[key.key])
            ) : (
              <Text c={(index + 1) % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
                {item[key.key as keyof T] as React.ReactNode}
              </Text>
            )}
          </Table.Td>
        </>
      ))}
    </Table.Tr>
  ));

  return (
    <Paper p={10} shadow="xs" mah="calc(100vh - 60px)">
      <Table.ScrollContainer minWidth="100%">
        <Table {...props}>
          <Table.Tr>
            {checkbox && <Table.Th />}
            {tableHead}
          </Table.Tr>
          {tableData}
        </Table>
      </Table.ScrollContainer>

      <MantinePagination
        total={total}
        rowsPerPageOptions={['5', '10', '20', '30', '50', '100']}
        value={pageSize}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        pageSize={parseInt(pageSize, 10)}
        onPageChange={onPageChange}
      />
    </Paper>
  );
};

export default MantineTable;
