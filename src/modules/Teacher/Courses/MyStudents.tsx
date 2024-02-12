import { useEffect, useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Menu,
  Modal,
  NumberInput,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { IconDotsVertical } from '@tabler/icons-react';
import { IMyCourse } from '@/interfaces/courses.interface';
import {
  ICourseParams,
  getEnrolledMyStudent,
  updateScoreMutation,
} from '@/services/course.service';
import { getDecodedJwt } from '@/api/Auth';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import { handleErrors } from '@/utils/handleErrors';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import Filter from '@/shared/components/Filter';
import useFilter from '@/hooks/useFilter';

const MyStudents = () => {
  const theme = useMantineTheme();
  const { id, year } = useParams();
  const [selectedRow, setSelectedRow] = useState<IMyCourse>();
  const [score, setScore] = useState<number>(0);
  const [modal, { open: openModal, close: closeModal }] = useDisclosure();
  const { setFilterValues, tableParams, setTableParams, search, setSearch } =
    useFilter<ICourseParams>({
      defaultParams: {
        page: 0,
        pageSize: '10',
        sortBy: 'grade',
        searchBy: [
          'course.course.name',
          'course.course.code',
          'student.firstName',
          'student.lastName',
          'student.middleName',
          'student.email',
        ],
      },
    });
  const decodedUser = getDecodedJwt();
  const {
    data: courses,
    isFetching: isFetchingCourses,
    refetch,
  } = useQuery({
    queryKey: ['courses-enrolled-students', tableParams],
    queryFn: () => getEnrolledMyStudent(tableParams, id || '', year || '', decodedUser.id),
  });
  const [courseName, setCourseName] = useState<string | undefined>('');

  useEffect(() => {
    if (!isFetchingCourses && !courseName && courses?.data && courses.data.length > 0) {
      const name = courses.data[0]?.course?.course?.name;
      if (name) {
        setCourseName(name);
      }
    }
  }, [courses, courseName, isFetchingCourses]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateScoreMutation,
    onSuccess: () => {
      notifications.show({
        title: 'Score updated updated Successfull',
        message: `You have updated ${selectedRow?.student.lastName} score`,
        color: 'green',
      });
      refetch();
      setSelectedRow(undefined);
      closeModal();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const updateScore = () => {
    const formData = { score };
    const payload = { formData, id: selectedRow?._id || '' };
    mutate(payload);
  };
  const column: ColumnHead<IMyCourse> = [
    {
      label: 'Student Name',
      key: 'student',
      render: (val, index, student) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {student.lastName} {student.middleName} {student.firstName}
        </Text>
      ),
    },
    {
      label: 'Student Email',
      key: 'student',
      render: (val, index, student) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>{student.email}</Text>
      ),
    },
    {
      label: 'Units',
      key: 'course',
      render: (_val, index, item) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {`${item?.course?.units} unit${item?.course?.units > 1 ? 's' : ''}`}
        </Text>
      ),
    },
    {
      label: 'Score',
      key: 'score',
      render: (_val, index, scoreData) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {`${scoreData === -2 ? 'NG' : scoreData}`}
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
  ];

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center" wrap="wrap" gap={10}>
          <Flex gap={20} wrap="wrap">
            <Title my={30}>
              {courseName
                ? convertAllLowercaseToSentenceCase(courseName || '')
                : 'No enrolled student'}
              <span style={{ fontSize: '13px' }}>/{year}</span>
            </Title>
            <Filter
              search={search}
              searchPlaceholder="search by course name or code, student"
              applyFilters={(val) => setFilterValues(val)}
              onSearchChange={(val: string) => setSearch(val)}
              data={[
                {
                  type: 'multiselect',
                  placeholder: 'Grade',
                  label: 'Grade',
                  key: 'grade',
                  data: [
                    { label: 'F', value: 'F' },
                    { label: 'A', value: 'A' },
                    { label: 'B', value: 'B' },
                    { label: 'C', value: 'C' },
                    { label: 'D', value: 'D' },
                    { label: 'E', value: 'E' },
                    { label: 'NG', value: 'NG' },
                    { label: 'F1', value: 'F1' },
                  ],
                },

                {
                  type: 'number',
                  placeholder: 'Units',
                  label: 'Units',
                  key: 'units',
                },
              ]}
            />
          </Flex>
          {/* <Flex
            wrap="wrap"
            justify={{ xs: 'flex-start', md: 'flex-end' }}
            w={{ xs: '100%', md: '60%' }}
          >
            <Button>Bulk Upload</Button>
            <Button color={theme.colors.brandSecondary[9]} ml={10}>
              Download Template
            </Button>
          </Flex> */}
        </Flex>
        <Space h={20} />
        <MantineTable<IMyCourse>
          head={column}
          total={courses?.total || 0}
          values={courses?.data || []}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val, page: 0 })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          loading={isFetchingCourses}
        />

        <Modal opened={modal} onClose={closeModal} withCloseButton={false} centered>
          <Stack h={200} justify="space-evenly">
            <Text>
              {selectedRow?.student.lastName || ''} {selectedRow?.student.middleName || ''}{' '}
              {selectedRow?.student.firstName || ''}
            </Text>
            <NumberInput
              allowDecimal={false}
              allowLeadingZeros={false}
              value={score}
              onChange={(val) => setScore(Number(val))}
            />
            <Group justify="flex-end" my={10}>
              <Button variant="outline" color="red" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={updateScore} loading={isPending}>
                Update Score
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Box>
    </>
  );
};

export default MyStudents;
