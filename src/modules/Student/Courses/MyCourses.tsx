import { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { IconDotsVertical } from '@tabler/icons-react';
import { IEnrolledCourseDetails, IMyCourse } from '@/interfaces/courses.interface';
import { getPersonalInfo } from '@/services/admin.services';
import { getDecodedJwt } from '@/api/Auth';
import { RegistrationStatusEnum } from '@/interfaces/auth.interface';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import { ICourseParams, getEnrolledStudentCourses } from '@/services/course.service';

const MyCourses = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [, setSelectedRow] = useState<IEnrolledCourseDetails | {}>();
  const [modal, { open: openModal, close: closeModal }] = useDisclosure();
  const { year } = useParams();
  const decodedUser = getDecodedJwt();
  const { data, isFetching } = useQuery({
    queryKey: ['personal-info-courses'],
    queryFn: () => getPersonalInfo(decodedUser.id),
  });
  useEffect(() => {
    if (!isFetching) {
      const foundRegistration =
        Object.keys(data?.registrationStatus || {})?.find((reg) => reg === year) || '';
      if (!foundRegistration) {
        navigate('/student/courses');
      }
      if (data?.registrationStatus) {
        if (
          data?.registrationStatus[foundRegistration].includes(
            RegistrationStatusEnum.Not_Registered
          )
        ) {
          notifications.show({
            message: 'You have not registered for this year',
            title: 'Not registered',
            color: 'red',
          });
          navigate('/student/courses');
        }
      }
    }
  }, [year, isFetching]);
  const [tableParams, setTableParams] = useState<ICourseParams>({
    page: 0,
    year,
    pageSize: '10',
  });

  const { data: courses, isFetching: isFetchingCourses } = useQuery({
    queryKey: ['courses-enrolled', tableParams],
    queryFn: () => getEnrolledStudentCourses(tableParams, decodedUser.id),
  });
  const canNotUpdate = () => {
    if (data?.registrationStatus) {
      if (data?.registrationStatus[year || ''].includes(RegistrationStatusEnum.Can_Update)) {
        return false;
      }
      return true;
    }
    return true;
  };
  const column: ColumnHead<IMyCourse> = [
    {
      label: 'Course Name',
      key: 'course',
      render: (_row, index, val) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(val?.course.name)}
        </Text>
      ),
    },
    {
      label: 'Course Code',
      key: 'course',
      render: (_row, index, val) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(val?.course.code)}
        </Text>
      ),
    },

    {
      label: 'Lecturer',
      key: 'course',
      render: (val, index, teacher) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {teacher?.teacher.lastName} {teacher?.teacher.middleName} {teacher?.teacher.firstName}
        </Text>
      ),
    },

    {
      label: 'Units',
      key: 'course',
      render: (_val, index, item) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {`${item?.course.units} unit${item?.course.units > 1 ? 's' : ''}`}
        </Text>
      ),
    },
    {
      label: 'Score',
      key: 'score',
      render: (_val, index, score) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {`${score === -2 ? 'NG' : score}`}
        </Text>
      ),
    },
    {
      label: 'Grade',
      key: 'grade',
      render: (_val, index, grade) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>{grade}</Text>
      ),
    },
    {
      label: 'Gp',
      key: 'gp',
      render: (_val, index, gp) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>{gp}</Text>
      ),
    },
    {
      label: '',
      key: 'course',
      render: (row) => (
        <Menu shadow="md" width={100}>
          <Menu.Target>
            <ActionIcon
              disabled={canNotUpdate()}
              variant="default"
              onClick={() => {
                setSelectedRow(row);
              }}
            >
              <Tooltip
                bg={theme.colors.red[6]}
                label="Please reach out to the System Admin to perform this action"
                position="bottom"
                hidden={!canNotUpdate()}
              >
                <IconDotsVertical />
              </Tooltip>
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown onClick={openModal}>
            <Menu.Item>Remove</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>
            My Courses<span style={{ fontSize: '13px' }}>/{year}</span>
          </Title>
          <Tooltip
            bg={theme.colors.red[6]}
            label="Please reach out to the System Admin to perform this action"
            position="bottom"
            hidden={!canNotUpdate()}
          >
            <Button
              onClick={() => navigate('/student/courses/1/add-courses')}
              disabled={canNotUpdate()}
            >
              Add New
            </Button>
          </Tooltip>
        </Flex>
        <MantineTable<IMyCourse>
          head={column}
          total={courses?.total || 0}
          values={courses?.data || []}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val, page: 0 })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          loading={isFetchingCourses || isFetching}
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
