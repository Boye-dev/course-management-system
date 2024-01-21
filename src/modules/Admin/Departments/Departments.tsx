import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Flex, Text, Title, useMantineTheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import AddNewDepartmentDrawer from '@/components/Admin/Departments/AddNewDepartmentDrawer';
import EditDepartmentDrawer from '@/components/Admin/Departments/EditDepartmentDrawer';
import { IDepartmentDetails } from '@/interfaces/courses.interface';
import { IDepartmentParams, getDepartments } from '@/services/department.service';

const Departments = () => {
  const theme = useMantineTheme();
  const [tableParams, setTableParams] = useState<IDepartmentParams>({
    page: 0,
    pageSize: '10',
  });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [row, setRow] = useState<IDepartmentDetails | undefined>();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['schools', tableParams],
    queryFn: () => getDepartments(tableParams),
  });
  const column: ColumnHead<IDepartmentDetails> = [
    {
      label: 'Department Name',
      key: 'name',
      render: (_row, index, val) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {val
            .split(' ')
            .map((item: string) => item[0].toUpperCase() + item.substring(1))
            .join(' ')}
        </Text>
      ),
    },
    { label: 'Department Code', key: 'code' },
    {
      label: 'School',
      key: 'school',
      render: (val, index, schoolDetails) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {schoolDetails?.name
            .split(' ')
            .map((item: string) => item[0].toUpperCase() + item.substring(1))
            .join(' ')}
        </Text>
      ),
    },
    {
      label: 'Years Taken',
      key: 'yearsTaken',
      render: (_val, index, item) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {`${item}year${item > 0 && 's'}`}
        </Text>
      ),
    },
  ];
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>Departments</Title>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<IDepartmentDetails>
          head={column}
          total={data?.total || 0}
          values={data?.data || []}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val, page: 0 })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          onRowItemClick={(rowData) => {
            setRow(rowData);
            openEdit();
          }}
          loading={isFetching}
        />

        <EditDepartmentDrawer
          opened={edit}
          close={closeEdit}
          row={row}
          refetch={refetch}
          clear={() => setRow(undefined)}
        />
        <AddNewDepartmentDrawer opened={addNew} close={closeAddNew} refetch={refetch} />
      </Box>
    </>
  );
};

export default Departments;
