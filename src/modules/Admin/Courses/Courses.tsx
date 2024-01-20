// import { useState } from 'react';
import { Box, Button, Flex, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import MantineTable from '@/shared/components/Table';
// import { ICourseDetails } from '@/interfaces/courses.interface';
import AddNewCourseDrawer from '@/components/Admin/Courses/AddNewCourseDrawer';
import EditCourseDrawer from '@/components/Admin/Courses/EditCourseDrawer';

// interface ITableParams {
//   page: number;
//   pageSize: string;

//   search?: string;
// }

const Courses = () => {
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
          <Title my={30}>Courses</Title>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        {/* <MantineTable<ICourseDetails>
          head={[
            { label: 'Name', key: 'name' },
            { label: 'Course Code', key: 'course_code' },
            { label: 'Level', key: 'level' },
            { label: 'Department', key: 'department', render: (val) => val.name },
            { label: 'School', key: 'school', render: (val) => val.name },
          ]}
          total={mockData.length}
          values={mockData}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          onRowItemClick={() => openEdit()}
        /> */}

        <EditCourseDrawer opened={edit} close={closeEdit} id="123" />
        <AddNewCourseDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Courses;
