import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Center, Flex, Loader, Text, Title, useMantineTheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import AddNewCourseDrawer from '@/components/Teacher/Courses/AddNewCourseDrawer';
import { IEnrolledCourseDetails } from '@/interfaces/courses.interface';
import { ICourseParams, getEnrolledCoursesSelect } from '@/services/course.service';
import Filter from '@/shared/components/Filter';
import useFilter from '@/hooks/useFilter';
import useDepartmentsInfiniteQuery from '@/hooks/useDepartmentsInfiniteQuery';
import useCoursesInfiiniteQuery from '@/hooks/useCoursesInfiiniteQuery';

const EnrolledTeachers = () => {
  const theme = useMantineTheme();
  const [addNewCourse, { open: openAddNewCourse, close: closeAddNewCourse }] = useDisclosure();
  const defaultParams = {
    page: 0,
    sortBy: 'course.name',
    pageSize: '10',
    searchBy: [
      'course.name',
      'course.code',
      'teacher.firstName',
      'teacher.lastName',
      'teacher.middleName',
    ],
  };
  const { setFilterValues, tableParams, setTableParams, search, setSearch } =
    useFilter<ICourseParams>({
      defaultParams,
    });

  const { data, isFetching } = useQuery({
    queryKey: ['courses-enrolled', tableParams],
    queryFn: () => getEnrolledCoursesSelect(tableParams),
  });
  const {
    isFetchingDepartments,
    isFetchingDepartmentsNextPage,
    departmentsData,
    setTableParamsDepartment,
    tableParamsDepartment,
  } = useDepartmentsInfiniteQuery();

  const {
    isFetching: isFetchingCourses,
    isFetchingNextPage: isFetchingCoursesNextPage,
    coursesData,
    tableParams: tableParamsCourses,
    setTableParams: setTableParamsCourses,
  } = useCoursesInfiiniteQuery({ enabled: true });

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

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center" wrap="wrap" gap={10}>
          <Flex align="center" gap={5} wrap="wrap">
            <Title my={30}>Teachers</Title>

            <Filter
              searchPlaceholder="search by course name, teacher"
              search={search}
              applyFilters={(val) => setFilterValues(val)}
              onSearchChange={(val: string) => setSearch(val)}
              data={[
                {
                  type: 'multiselect',
                  placeholder: 'Departments',
                  label: 'Departments',
                  key: 'department',
                  searchValue: tableParamsDepartment.search,
                  onSearch: (searchValue: string) =>
                    setTableParamsDepartment({ ...tableParamsDepartment, search: searchValue }),
                  data:
                    isFetchingDepartments && isFetchingDepartmentsNextPage
                      ? departmentsData?.concat({
                          label: 'Fetching More',
                          disabled: true,
                          value: 'Fetching More',
                          render: () => (
                            <Center inline>
                              <Loader size="sm" />
                              <Text>Fetching More</Text>
                            </Center>
                          ),
                        })
                      : isFetchingDepartments
                        ? [
                            {
                              value: 'Fetching Departments',
                              label: 'Fetching Departments',
                              disabled: true,
                            },
                          ]
                        : departmentsData || [],
                },
                {
                  type: 'multiselect',
                  placeholder: 'Courses',
                  label: 'Courses',
                  key: 'course',
                  searchValue: tableParamsCourses.search,
                  onSearch: (searchValue: string) =>
                    setTableParamsCourses({ ...tableParamsCourses, search: searchValue }),
                  data:
                    isFetchingCourses && isFetchingCoursesNextPage
                      ? coursesData?.concat({
                          label: 'Fetching More',
                          disabled: true,
                          value: 'Fetching More',
                          render: () => (
                            <Center inline>
                              <Loader size="sm" />
                              <Text>Fetching More</Text>
                            </Center>
                          ),
                        })
                      : isFetchingCourses
                        ? [
                            {
                              value: 'Fetching Departments',
                              label: 'Fetching Departments',
                              disabled: true,
                            },
                          ]
                        : coursesData || [],
                },
                {
                  type: 'number',
                  placeholder: 'Year Taken',
                  label: 'Year Taken',
                  key: 'yearTaken',
                },
              ]}
            />
          </Flex>

          <Button onClick={openAddNewCourse}>Add New</Button>
        </Flex>
        <MantineTable<IEnrolledCourseDetails>
          head={column}
          total={data?.total || 0}
          values={data?.data || []}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val, page: 0 })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          loading={isFetching}
        />

        <AddNewCourseDrawer opened={addNewCourse} close={closeAddNewCourse} />
      </Box>
    </>
  );
};

export default EnrolledTeachers;
