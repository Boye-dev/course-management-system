import { ActionIcon, Flex, Select, Text } from '@mantine/core';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';

interface MantinePaginationProps {
  total: number;
  rowsPerPageOptions: string[];
  value: string;
  onRowsPerPageChange: (_val: string) => void;
  onPageChange: (_val: number) => void;
  page: number;
  pageSize: number;
}
const MantinePagination = ({
  total,
  rowsPerPageOptions,
  value,
  page,
  pageSize,
  onRowsPerPageChange,
  onPageChange,
}: MantinePaginationProps) => {
  const getTotalData = () => {
    if (total - page * pageSize > pageSize) {
      return (page + 1) * pageSize;
    }
    return total;
  };

  return (
    <>
      <Flex justify="flex-end" mt={20} align="center">
        <Text mr={10}>Rows Per Page:</Text>
        <Select
          w={100}
          data={rowsPerPageOptions}
          value={value}
          onChange={(val) => val && onRowsPerPageChange(val)}
        />
        <Text mx={20}>
          {page * pageSize + 1}-{getTotalData()} of {total}
        </Text>
        <ActionIcon
          variant="default"
          mx={10}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          <IconChevronLeft />
        </ActionIcon>
        <ActionIcon
          variant="default"
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 > Math.ceil(total / pageSize) - 1}
        >
          <IconChevronRight />
        </ActionIcon>
      </Flex>
    </>
  );
};

export default MantinePagination;
