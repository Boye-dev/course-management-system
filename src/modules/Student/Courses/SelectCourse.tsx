import { useState } from 'react';
import { Box, Button, Flex, Group, Modal, Space, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import MantineTable from '@/shared/components/Table';
import { ICourseDetails } from '@/interfaces/courses.interface';

interface ITableParams {
  page: number;
  pageSize: string;
  search?: string;
}

const SelectCourse = () => {
  const [selectedRows, setSelectedRows] = useState<ICourseDetails[]>([]);
  const [tableParams, setTableParams] = useState<ITableParams>({
    page: 0,
    pageSize: '5',
  });
  //   const { year } = useParams();
  const [modal, { open: openModal, close: closeModal }] = useDisclosure();

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
      credit: 3,
      school: { _id: '124', name: 'Computer Science' },
    },
    {
      name: 'Compiler Constuction',
      course_code: 'COSC412',
      level: 3,
      _id: '1',
      department: {
        _id: '122',
        school: {
          name: 'Computer Science',
          _id: '123',
        },
        name: 'Computer Science',
      },
      credit: 3,
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
      credit: 3,
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
      credit: 3,
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
      credit: 3,
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
      credit: 3,
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
      credit: 3,
      school: { _id: '124', name: 'Computer Science' },
    },
  ];
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>Select Courses</Title>
        </Flex>
        <MantineTable<ICourseDetails>
          head={[
            { label: 'Name', key: 'name' },
            { label: 'Course Code', key: 'course_code' },
            { label: 'Level', key: 'level' },
            { label: 'Department', key: 'department', render: (val) => val.name },
            { label: 'School', key: 'school', render: (val) => val.name },
          ]}
          checkbox
          total={mockData.length}
          values={mockData}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
        <Space h={20} />
        <Flex justify="space-between" align="center">
          <Title my={30}>Selected Courses</Title>
          <Button onClick={openModal}>Add Selcted Courses</Button>
        </Flex>
        <MantineTable<ICourseDetails>
          head={[
            { label: 'Name', key: 'name' },
            { label: 'Course Code', key: 'course_code' },
            { label: 'Level', key: 'level' },
            { label: 'Department', key: 'department', render: (val) => val.name },
            { label: 'School', key: 'school', render: (val) => val.name },
          ]}
          checkbox
          total={selectedRows.length}
          values={selectedRows}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </Box>
      <Modal opened={modal} onClose={closeModal} withCloseButton={false} centered>
        <Stack h={200} justify="space-evenly">
          <Stack align="center">
            <Text>Are You Sure ?</Text>
            <Text>Are you sure you want to add these courses?</Text>
          </Stack>
          <Group justify="flex-end" my={10}>
            <Button
              variant="outline"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </Button>
            <Button color="red">Add Course</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default SelectCourse;
