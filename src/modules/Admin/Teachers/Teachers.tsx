import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Avatar, Box, Button, Flex, Pill, Text, Title, useMantineTheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import { IUser } from '@/interfaces/auth.interface';
import { getStatusColor } from '@/utils/getStatusColor';
import AddNewTeacherDrawer from '@/components/Admin/Teachers/AddNewTeacherDrawer';
import EditTeacherDrawer from '@/components/Admin/Teachers/EditTeacherDrawer';
import {
  convertAllLowercaseToSentenceCase,
  convertAllUpperCaseToSentenceCase,
} from '@/utils/textHelpers';
import { ITeacherParams, getTeachers } from '@/services/teacher.service';

const Teachers = () => {
  const theme = useMantineTheme();
  const [tableParams, setTableParams] = useState<ITeacherParams>({
    page: 0,
    pageSize: '10',
  });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [row, setRow] = useState<IUser | undefined>();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['teachers', tableParams],
    queryFn: () => getTeachers(tableParams),
  });

  const column: ColumnHead<IUser> = [
    {
      label: '',
      key: 'profilePicture',
      render: (_row, index, pic) => <Avatar src={pic} />,
    },

    {
      label: 'Full Name',
      key: 'firstName',
      render: (_row, index) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {_row.lastName} {_row.middleName} {_row.firstName}
        </Text>
      ),
    },
    { label: 'Email', key: 'email' },
    {
      label: 'Department',
      key: 'department',
      render: (_row, index, departmentDetails) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(departmentDetails?.name)}
        </Text>
      ),
    },
    { label: 'Gender', key: 'gender' },
    {
      label: 'Status',
      key: 'status',
      render: (_row, _index, status) => (
        <Pill c={getStatusColor(status)}>{convertAllUpperCaseToSentenceCase(status)}</Pill>
      ),
    },
  ];

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>Teachers</Title>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<IUser>
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

        <EditTeacherDrawer
          opened={edit}
          close={closeEdit}
          row={row}
          refetch={refetch}
          clear={() => setRow(undefined)}
        />
        <AddNewTeacherDrawer opened={addNew} close={closeAddNew} refetch={refetch} />
      </Box>
    </>
  );
};

export default Teachers;
