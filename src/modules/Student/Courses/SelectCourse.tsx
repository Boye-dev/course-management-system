import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Modal,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDecodedJwt } from '@/api/Auth';
import { RegistrationStatusEnum } from '@/interfaces/auth.interface';
import { IEnrolledCourseDetails } from '@/interfaces/courses.interface';
import { getPersonalInfo } from '@/services/admin.services';
import {
  ICourseParams,
  enrollStudentCourseMutation,
  getEnrolledCoursesSelect,
} from '@/services/course.service';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import { handleErrors } from '@/utils/handleErrors';

const SelectCourse = () => {
  const [selectedRows, setSelectedRows] = useState<IEnrolledCourseDetails[]>([]);
  const theme = useMantineTheme();

  const navigate = useNavigate();
  const [modal, { open: openModal, close: closeModal }] = useDisclosure();
  const [nextPage, { toggle }] = useDisclosure();
  const { year } = useParams();
  const decodedUser = getDecodedJwt();

  const { data } = useQuery({
    queryKey: ['personal-info'],
    queryFn: () => getPersonalInfo(decodedUser.id),
  });

  const [tableParams, setTableParams] = useState<ICourseParams>({
    page: 0,

    pageSize: '10',
  });

  const { data: courses, isFetching: isFetchingCourses } = useQuery({
    queryKey: ['courses-enrolled', tableParams],
    queryFn: () => getEnrolledCoursesSelect(tableParams),
  });
  useEffect(() => {
    const foundRegistration =
      Object.keys(data?.registrationStatus || {}).find((reg) => reg === year) || '';
    if (!foundRegistration) {
      navigate('/student/courses');
    }
    if (data?.registrationStatus) {
      if (data?.registrationStatus[foundRegistration].includes(RegistrationStatusEnum.Registered)) {
        notifications.show({
          message: 'You have  registered for this year',
          title: 'Registered',
          color: 'red',
        });
        navigate('/student/courses');
      }
    }
  }, [year]);
  const column: ColumnHead<IEnrolledCourseDetails> = [
    {
      label: 'Course Name',
      key: 'course',
      render: (_row, index, val) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(val.name)}
        </Text>
      ),
    },
    {
      label: 'Course Code',
      key: 'course',
      render: (_row, index, val) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(val.code)}
        </Text>
      ),
    },
    {
      label: 'Department',
      key: 'teacher',
      render: (val, index, departmentDetails) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(departmentDetails?.department.name)}
        </Text>
      ),
    },
    {
      label: 'Lecturer',
      key: 'teacher',
      render: (val, index, teacher) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {teacher.lastName} {teacher.middleName} {teacher.firstName}
        </Text>
      ),
    },
    {
      label: 'Year Taken',
      key: 'course',
      render: (_val, index, item) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {`Year ${item.yearTaken}`}
        </Text>
      ),
    },
    {
      label: 'Units',
      key: 'course',
      render: (_val, index, item) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {`${item.units} unit${item.units > 1 ? 's' : ''}`}
        </Text>
      ),
    },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: enrollStudentCourseMutation,
    onSuccess: () => {
      notifications.show({
        title: 'Course enrollment Successfull',
        message: 'You have enrolled for the courses successfull',
        color: 'green',
      });
      setSelectedRows([]);

      closeModal();
      navigate(`/student/courses/${year}/my-courses`);
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const addCourse = () => {
    const payload = {
      year: year || '',
      courses: selectedRows.map((course) => course._id),
      id: decodedUser.id,
    };
    mutate(payload);
  };
  return (
    <>
      <Box>
        {nextPage || (
          <>
            <Flex justify="space-between" align="center">
              <Title my={30}>Select Courses</Title>
              <Button onClick={toggle}>Next</Button>
            </Flex>
            <MantineTable<IEnrolledCourseDetails>
              head={column}
              total={courses?.total || 0}
              values={courses?.data || []}
              pageSize={tableParams.pageSize}
              page={tableParams.page}
              onRowsPerPageChange={(val) =>
                setTableParams({ ...tableParams, pageSize: val, page: 0 })
              }
              checkbox
              onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              loading={isFetchingCourses}
            />
          </>
        )}
        {nextPage && (
          <>
            <Flex
              justify="space-between"
              align={{ xs: 'flex-start', md: 'center' }}
              direction={{ xs: 'column', md: 'row' }}
            >
              <Center inline>
                <IconArrowLeft onClick={toggle} />
                <Title my={30}>Selected Courses</Title>
              </Center>
              <Button onClick={openModal} disabled={selectedRows.length <= 0}>
                Add Selcted Courses
              </Button>
            </Flex>
            <Space h={15} />
            <MantineTable<IEnrolledCourseDetails>
              head={column}
              checkbox
              total={selectedRows.length}
              values={selectedRows}
              pageSize={tableParams.pageSize}
              page={tableParams.page}
              onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
              onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
              selectedRows={selectedRows}
              showPagination={false}
              setSelectedRows={setSelectedRows}
            />
          </>
        )}
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
            <Button color="red" onClick={addCourse} loading={isPending}>
              Add Course
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default SelectCourse;
