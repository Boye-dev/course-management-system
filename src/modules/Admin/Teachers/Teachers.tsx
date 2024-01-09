import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Flex, Pill, Title } from '@mantine/core';
import MantineTable from '@/shared/components/Table';
import { ITeacherDetails } from '@/interfaces/teachers.interface';
import AddNewTeacherDrawer from '@/components/Teachers/AddNewTeacherDrawer';
import EditTeacherDrawer from '@/components/Teachers/EditTeacherDrawer';

interface ITableParams {
  page: number;
  pageSize: string;
  search?: string;
}

const Teachers = () => {
  const [tableParams, setTableParams] = useState<ITableParams>({
    page: 0,
    pageSize: '5',
  });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const mockData: ITeacherDetails[] = [
    {
      firstName: 'Oyelola',
      lastName: 'Oyelola',
      email: 'oyelola@gmail.com',
      gender: 'MALE',
      maritalStatus: 'Single',
      nationality: 'Nigerian',
      state: 'Lagos',
      lga: 'Oyo',
      _id: '123',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      status: 'Active',
    },
    {
      firstName: 'Oyelola',
      lastName: 'Oyelola',
      email: 'oyelola@gmail.com',
      gender: 'MALE',
      maritalStatus: 'Single',
      nationality: 'Nigerian',
      state: 'Lagos',
      lga: 'Oyo',
      _id: '123',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      status: 'Active',
    },
    {
      firstName: 'Oyelola',
      lastName: 'Oyelola',
      email: 'oyelola@gmail.com',
      gender: 'MALE',
      maritalStatus: 'Single',
      nationality: 'Nigerian',
      state: 'Lagos',
      lga: 'Oyo',
      _id: '123',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      status: 'Active',
    },
    {
      firstName: 'Oyelola',
      lastName: 'Oyelola',
      email: 'oyelola@gmail.com',
      gender: 'MALE',
      maritalStatus: 'Single',
      nationality: 'Nigerian',
      state: 'Lagos',
      lga: 'Oyo',
      _id: '123',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      status: 'Active',
    },
    {
      firstName: 'Oyelola',
      lastName: 'Oyelola',
      email: 'oyelola@gmail.com',
      gender: 'MALE',
      maritalStatus: 'Single',
      nationality: 'Nigerian',
      state: 'Lagos',
      lga: 'Oyo',
      _id: '123',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      status: 'Active',
    },
  ];
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>Teachers</Title>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<ITeacherDetails>
          head={[
            { label: 'First Name', key: 'firstName' },
            { label: 'Last Name', key: 'lastName' },
            { label: 'Email', key: 'email' },
            { label: 'Department', key: 'department', render: (val) => <Pill>{val.name} </Pill> },
            { label: 'Status', key: 'status', render: (val) => <Pill>{val} </Pill> },
          ]}
          total={mockData.length}
          values={mockData}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          onRowItemClick={() => openEdit()}
        />

        <EditTeacherDrawer opened={edit} close={closeEdit} id="123" />
        <AddNewTeacherDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Teachers;
