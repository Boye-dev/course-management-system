// import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Box,
  Button,
  Flex,
  // Pill,
  Title,
} from '@mantine/core';
// import MantineTable from '@/shared/components/Table';
import AddNewStudentDrawer from '@/components/Admin/Students/AddNewStudentDrawer';
import EditStudentDrawer from '@/components/Admin/Students/EditStudentDrawer';
// import { IStudentDetails } from '@/interfaces/student.interface';

// interface ITableParams {
//   page: number;
//   pageSize: string;
//   search?: string;
// }

const Students = () => {
  // const [tableParams, setTableParams] = useState<ITableParams>({
  //   page: 0,
  //   pageSize: '5',
  // });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [edit, { close: closeEdit }] = useDisclosure();

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>Students</Title>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        {/* <MantineTable<IStudentDetails>
          head={[
            { label: 'First Name', key: 'firstName' },
            { label: 'Last Name', key: 'lastName' },
            { label: 'Email', key: 'email' },
            {
              label: 'Department',
              key: 'department',
              render: (_row, val) => <Pill>{val.name} </Pill>,
            },
            {
              label: 'Status',
              key: 'status',
              render: (_row: any, val: string) => <Pill>{val} </Pill>,
            },
          ]}
          total={mockData.length}
          values={mockData}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          onRowItemClick={() => openEdit()}
        /> */}

        <EditStudentDrawer opened={edit} close={closeEdit} id="123" />
        <AddNewStudentDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Students;
