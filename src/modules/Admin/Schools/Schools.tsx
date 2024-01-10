import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Flex, Title } from '@mantine/core';
import MantineTable from '@/shared/components/Table';
import AddNewSchoolDrawer from '@/components/Admin/Schools/AddNewSchoolDrawer';
import EditSchoolDrawer from '@/components/Admin/Schools/EditSchoolDrawer';
import { ISchoolDetails } from '@/interfaces/courses.interface';

interface ITableParams {
  page: number;
  pageSize: string;
  search?: string;
}

const Schools = () => {
  const [tableParams, setTableParams] = useState<ITableParams>({
    page: 0,
    pageSize: '5',
  });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const mockData: ISchoolDetails[] = [
    {
      name: 'Computer Science',
      _id: '123',
    },
    {
      name: 'Computer Science',
      _id: '123',
    },
    {
      name: 'Computer Science',
      _id: '123',
    },
    {
      name: 'Computer Science',
      _id: '123',
    },
    {
      name: 'Computer Science',
      _id: '123',
    },
    {
      name: 'Computer Science',
      _id: '123',
    },
  ];
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>Schools</Title>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<ISchoolDetails>
          head={[{ label: 'School Name', key: 'name' }]}
          total={mockData.length}
          values={mockData}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          onRowItemClick={() => openEdit()}
        />

        <EditSchoolDrawer opened={edit} close={closeEdit} id="123" />
        <AddNewSchoolDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Schools;
