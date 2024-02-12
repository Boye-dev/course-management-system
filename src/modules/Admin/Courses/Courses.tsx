import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Center, Flex, Loader, Text, Title, useMantineTheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import AddNewCourseDrawer from '@/components/Admin/Courses/AddNewCourseDrawer';
import EditCourseDrawer from '@/components/Admin/Courses/EditCourseDrawer';
import { ICourseDetails } from '@/interfaces/courses.interface';
import { ICourseParams, getCourses } from '@/services/course.service';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import Filter from '@/shared/components/Filter';
import useFilter from '@/hooks/useFilter';
import useDepartmentsInfiniteQuery from '@/hooks/useDepartmentsInfiniteQuery';

const Courses = () => {
  const theme = useMantineTheme();

  const defaultParams = {
    page: 0,
    pageSize: '10',
    sortBy: 'yearTaken',
    searchBy: ['name', 'code'],
  };
  const { setFilterValues, tableParams, setTableParams, search, setSearch } =
    useFilter<ICourseParams>({
      defaultParams,
    });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [row, setRow] = useState<ICourseDetails | undefined>();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['courses', tableParams],
    queryFn: () => getCourses(tableParams),
  });
  const column: ColumnHead<ICourseDetails> = [
    {
      label: 'Course Name',
      key: 'name',
      render: (_row, index, val) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(val)}
        </Text>
      ),
    },
    { label: 'Course Code', key: 'code' },
    {
      label: 'Department',
      key: 'department',
      render: (val, index, departmentDetails) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(departmentDetails?.name)}
        </Text>
      ),
    },
    {
      label: 'Year Taken',
      key: 'yearTaken',
      render: (_val, index, item) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>{`Year ${item}`}</Text>
      ),
    },
    {
      label: 'Units',
      key: 'units',
      render: (_val, index, item) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {`${item} unit${item > 1 ? 's' : ''}`}
        </Text>
      ),
    },
  ];
  const {
    isFetchingDepartments,
    isFetchingDepartmentsNextPage,
    departmentsData,
    setTableParamsDepartment,
    tableParamsDepartment,
  } = useDepartmentsInfiniteQuery();
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center" wrap="wrap" gap={10}>
          <Flex align="center" gap={5} wrap="wrap">
            <Title my={30}>Courses</Title>
            <Filter
              searchPlaceholder="search by course name, code"
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
                  type: 'number',
                  placeholder: 'Year Taken',
                  label: 'Year Taken',
                  key: 'yearTaken',
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
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<ICourseDetails>
          head={column}
          total={data?.total || 0}
          values={data?.data || []}
          pageSize={tableParams.pageSize}
          page={tableParams.page}
          onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val, page: 0 })}
          onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
          onRowItemClick={(rowData) => {
            setRow(rowData);
            openEdit();
          }}
          loading={isFetching}
        />

        <EditCourseDrawer
          opened={edit}
          close={closeEdit}
          row={row}
          refetch={refetch}
          clear={() => setRow(undefined)}
        />
        <AddNewCourseDrawer opened={addNew} close={closeAddNew} refetch={refetch} />
      </Box>
    </>
  );
};

export default Courses;
