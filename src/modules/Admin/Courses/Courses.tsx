import { useState } from 'react';
import { Box, Button, Flex, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import MantineTable from '@/shared/components/Table';
import { ICourseDetails } from '@/interfaces/courses.interface';
import AddNewCourseDrawer from '@/components/Courses/AddNewCourseDrawer';
import EditCourseDrawer from '@/components/Courses/EditCourseDrawer';

interface ITableParams {
  page: number;
  pageSize: string;

  search?: string;
}

const Courses = () => {
  const [tableParams, setTableParams] = useState<ITableParams>({
    page: 0,
    pageSize: '5',
  });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const mockData: ICourseDetails[] = [
    {
      name: 'Compiler Constuction',
      course_code: 'COSC412',
      level: 4,
      _id: '1',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      school: { _id: '124', name: 'Computer Science' },
    },
    {
      name: 'Compiler Constuction',
      course_code: 'COSC412',
      level: 4,
      _id: '1',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      school: { _id: '124', name: 'Computer Science' },
    },
    {
      name: 'Compiler Constuction',
      course_code: 'COSC412',
      level: 4,
      _id: '1',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      school: { _id: '124', name: 'Computer Science' },
    },
    {
      name: 'Compiler Constuction',
      course_code: 'COSC412',
      level: 4,
      _id: '1',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      school: { _id: '124', name: 'Computer Science' },
    },
    {
      name: 'Compiler Constuction',
      course_code: 'COSC412',
      level: 4,
      _id: '1',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      school: { _id: '124', name: 'Computer Science' },
    },
  ];
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>Courses</Title>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<ICourseDetails>
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
        />

        <EditCourseDrawer opened={edit} close={closeEdit} id="123" />
        <AddNewCourseDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Courses;
