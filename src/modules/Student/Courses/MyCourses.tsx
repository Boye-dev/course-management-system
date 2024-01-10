import { useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { IconDotsVertical } from '@tabler/icons-react';
import MantineTable from '@/shared/components/Table';
import { IEnrolledCourseDetails } from '@/interfaces/courses.interface';

interface ITableParams {
  page: number;
  pageSize: string;

  search?: string;
}

const MyCourses = () => {
  const theme = useMantineTheme();
  const [tableParams, setTableParams] = useState<ITableParams>({
    page: 0,
    pageSize: '5',
  });
  const navigate = useNavigate();
  const [, setSelectedRow] = useState<IEnrolledCourseDetails | {}>();
  const [modal, { open: openModal, close: closeModal }] = useDisclosure();
  const mockData: IEnrolledCourseDetails[] = [
    {
      course: {
        name: 'Compiler Constuction',
        course_code: 'COSC412',
        level: 4,
        credit: 2,
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
      _id: '123',
      score: 75,
      grade: 'A',
    },
    {
      course: {
        name: 'Compiler Constuction',
        course_code: 'COSC412',
        level: 4,
        credit: 2,
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
      _id: '123',
      score: 75,
      grade: 'A',
    },
    {
      course: {
        name: 'Compiler Constuction',
        course_code: 'COSC412',
        level: 4,
        credit: 2,
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
      _id: '123',
      score: 75,
      grade: 'A',
    },
    {
      course: {
        name: 'Compiler Constuction',
        course_code: 'COSC412',
        level: 4,
        credit: 2,
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
      score: 75,
      _id: '123',
      grade: 'A',
    },
    {
      course: {
        name: 'Compiler Constuction',
        course_code: 'COSC412',
        level: 4,
        credit: 2,
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
      score: 75,
      _id: '123',
      grade: 'A',
    },
    {
      course: {
        name: 'Compiler Constuction',
        course_code: 'COSC412',
        level: 4,
        credit: 2,
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
      score: 75,
      _id: '123',
      grade: 'A',
    },
    {
      course: {
        name: 'Compiler Constuction',
        course_code: 'COSC412',
        level: 4,
        credit: 2,
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
      score: 75,
      grade: 'A',
      _id: '123',
    },
  ];
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>My Courses</Title>
          <Tooltip
            bg={theme.colors.red[6]}
            label="Please reach out to the System Admin to perform this action"
            position="bottom"
          >
            <Button onClick={() => navigate('/student/courses/1/add-courses')}>Add New</Button>
          </Tooltip>
        </Flex>
        <MantineTable<IEnrolledCourseDetails>
          head={[
            { label: 'Course Name', key: 'course', render: (_row, val) => val.name },
            { label: 'Course Code', key: 'course', render: (_row, val) => val.course_code },
            { label: 'Credit', key: 'course', render: (_row, val) => val.credit },
            { label: 'Score', key: 'score' },
            { label: 'Grade', key: 'grade' },
            {
              label: '',
              key: 'course',
              render: (row) => (
                <Menu shadow="md" width={100}>
                  <Menu.Target>
                    <Tooltip
                      bg={theme.colors.red[6]}
                      label="Please reach out to the System Admin to perform this action"
                      position="bottom"
                      // hidden
                    >
                      <ActionIcon
                        disabled
                        variant="default"
                        onClick={() => {
                          setSelectedRow(row);
                        }}
                      >
                        <IconDotsVertical />
                      </ActionIcon>
                    </Tooltip>
                  </Menu.Target>
                  <Menu.Dropdown onClick={openModal}>
                    <Menu.Item>Remove</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ),
            },
          ]}
          total={mockData.length}
          values={mockData}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
        />

        <Modal opened={modal} onClose={closeModal} withCloseButton={false} centered>
          <Stack h={200} justify="space-evenly">
            <Stack align="center">
              <Text>Are You Sure ?</Text>
              <Text>Are you sure you want to remove this course?</Text>
            </Stack>
            <Group justify="flex-end" my={10}>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRow({});
                  closeModal();
                }}
              >
                Cancel
              </Button>
              <Button color="red">Remove Course</Button>
            </Group>
          </Stack>
        </Modal>
      </Box>
    </>
  );
};

export default MyCourses;
