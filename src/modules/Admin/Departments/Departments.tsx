import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Flex, Title } from '@mantine/core';
import MantineTable from '@/shared/components/Table';

import AddNewDepartmentDrawer from '@/components/Admin/Departments/AddNewDepartmentDrawer';
import EditDepartmentDrawer from '@/components/Admin/Departments/EditDepartmentDrawer';
import { IDepartmentDetails } from '@/interfaces/courses.interface';

interface ITableParams {
  page: number;
  pageSize: string;
  search?: string;
}

const Departments = () => {
  const [tableParams, setTableParams] = useState<ITableParams>({
    page: 0,
    pageSize: '5',
  });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const mockData: IDepartmentDetails[] = [
    {
      name: 'Computer Science',
      school: { _id: '2000', name: 'Computer Science' },
      _id: '123',
    },
    {
      name: 'Computer Science',
      school: { _id: '2000', name: 'Computer Science' },
      _id: '123',
    },
    {
      name: 'Computer Science',
      school: { _id: '2000', name: 'Computer Science' },
      _id: '123',
    },
    {
      name: 'Computer Science',
      school: { _id: '2000', name: 'Computer Science' },
      _id: '123',
    },
    {
      name: 'Computer Science',
      school: { _id: '2000', name: 'Computer Science' },
      _id: '123',
    },
    {
      name: 'Computer Science',
      school: { _id: '2000', name: 'Computer Science' },
      _id: '123',
    },
    {
      name: 'Computer Science',
      school: { _id: '2000', name: 'Computer Science' },
      _id: '123',
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
          head={[
            { label: 'Department Name', key: 'name' },
            { label: 'School', key: 'school', render: (val) => val.name },
          ]}
          total={mockData.length}
          values={mockData}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          onRowItemClick={() => openEdit()}
        />

        <EditDepartmentDrawer opened={edit} close={closeEdit} id="123" />
        <AddNewDepartmentDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Departments;
