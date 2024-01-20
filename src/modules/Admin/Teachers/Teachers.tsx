// import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Box,
  Button,
  Flex,
  //  Pill,
  Title,
} from '@mantine/core';
// import MantineTable from '@/shared/components/Table';
// import { ITeacherDetails } from '@/interfaces/teachers.interface';
import AddNewTeacherDrawer from '@/components/Admin/Teachers/AddNewTeacherDrawer';
import EditTeacherDrawer from '@/components/Admin/Teachers/EditTeacherDrawer';

// interface ITableParams {
//   page: number;
//   pageSize: string;
//   search?: string;
// }

const Teachers = () => {
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
          <Title my={30}>Teachers</Title>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        {/* <MantineTable<ITeacherDetails>
          head={[
            { label: 'First Name', key: 'firstName' },
            { label: 'Last Name', key: 'lastName' },
            { label: 'Email', key: 'email' },
            {
              label: 'Department',
              key: 'department',
              render: (_row, val) => <Pill>{val.name}</Pill>,
            },
            { label: 'Status', key: 'status', render: (_row, val) => <Pill>{val} </Pill> },
          ]}
          total={mockData.length}
          values={mockData}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          onRowItemClick={() => openEdit()}
        /> */}

        <EditTeacherDrawer opened={edit} close={closeEdit} id="123" />
        <AddNewTeacherDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Teachers;
