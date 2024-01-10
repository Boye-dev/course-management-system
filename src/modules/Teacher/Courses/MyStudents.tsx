import { useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Menu,
  Modal,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDotsVertical } from '@tabler/icons-react';
import MantineTable from '@/shared/components/Table';
import { IEnrolledCourseDetails } from '@/interfaces/courses.interface';

interface ITableParams {
  page: number;
  pageSize: string;

  search?: string;
}

const MyStudents = () => {
  const theme = useMantineTheme();
  const [tableParams, setTableParams] = useState<ITableParams>({
    page: 0,
    pageSize: '5',
  });

  const [, setSelectedRow] = useState<IEnrolledCourseDetails | {}>();
  const [modal, { open: openModal, close: closeModal }] = useDisclosure();
  const mockData: IEnrolledCourseDetails[] = [
    {
      student: {
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
      teacher: {
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
      student: {
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
      teacher: {
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
      student: {
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
      teacher: {
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
      student: {
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
      teacher: {
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
  ];
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center" wrap="wrap">
          <Title my={30}>Computer Tech</Title>
          <Flex
            wrap="wrap"
            justify={{ xs: 'flex-start', md: 'flex-end' }}
            w={{ xs: '100%', md: '60%' }}
          >
            <Button>Bulk Upload</Button>
            <Button color={theme.colors.brandSecondary[9]} ml={10}>
              Download Template
            </Button>
          </Flex>
        </Flex>
        <Space h={20} />
        <MantineTable<IEnrolledCourseDetails>
          head={[
            { label: 'Student Name', key: 'course', render: (_row, val) => val.name },
            { label: 'Student Email', key: 'course', render: (_row, val) => val.course_code },
            { label: 'Score', key: 'score' },
            { label: 'Grade', key: 'grade' },
            {
              label: '',
              key: 'course',
              render: (row) => (
                <Menu shadow="md" width={120}>
                  <Menu.Target>
                    <ActionIcon
                      variant="default"
                      onClick={() => {
                        setSelectedRow(row);
                      }}
                    >
                      <IconDotsVertical />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown onClick={openModal}>
                    <Menu.Item>Upload Score</Menu.Item>
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

export default MyStudents;
