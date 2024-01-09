import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Flex, Pill, Title } from '@mantine/core';
import MantineTable from '@/shared/components/Table';
import AddNewStudentDrawer from '@/components/Students/AddNewStudentDrawer';
import EditStudentDrawer from '@/components/Students/EditStudentDrawer';
import { IStudentDetails } from '@/interfaces/student.interface';

interface ITableParams {
  page: number;
  pageSize: string;
  search?: string;
}

const Students = () => {
  const [tableParams, setTableParams] = useState<ITableParams>({
    page: 0,
    pageSize: '5',
  });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const mockData: IStudentDetails[] = [
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
          <Title my={30}>Students</Title>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<IStudentDetails>
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

        <EditStudentDrawer opened={edit} close={closeEdit} id="123" />
        <AddNewStudentDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Students;
