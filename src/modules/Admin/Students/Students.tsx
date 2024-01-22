import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Avatar, Box, Button, Flex, Pill, Text, Title, useMantineTheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import AddNewStudentDrawer from '@/components/Admin/Students/AddNewStudentDrawer';
import EditStudentDrawer from '@/components/Admin/Students/EditStudentDrawer';
import { IUser } from '@/interfaces/auth.interface';
import { IStudentParams, getStudents } from '@/services/student.service';
import { getStatusColor } from '@/utils/getStatusColor';
import {
  convertAllLowercaseToSentenceCase,
  convertAllUpperCaseToSentenceCase,
} from '@/utils/textHelpers';

const Students = () => {
  const theme = useMantineTheme();
  const [tableParams, setTableParams] = useState<IStudentParams>({
    page: 0,
    pageSize: '10',
  });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [row, setRow] = useState<IUser | undefined>();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['students', tableParams],
    queryFn: () => getStudents(tableParams),
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
    { label: 'Admission Year', key: 'yearOfAdmission' },
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
          <Title my={30}>Students</Title>
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

        <EditStudentDrawer
          opened={edit}
          close={closeEdit}
          row={row}
          refetch={refetch}
          clear={() => setRow(undefined)}
        />
        <AddNewStudentDrawer opened={addNew} close={closeAddNew} refetch={refetch} />
      </Box>
    </>
  );
};

export default Students;
