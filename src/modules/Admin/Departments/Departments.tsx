import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Center, Flex, Loader, Text, Title, useMantineTheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import AddNewDepartmentDrawer from '@/components/Admin/Departments/AddNewDepartmentDrawer';
import EditDepartmentDrawer from '@/components/Admin/Departments/EditDepartmentDrawer';
import { IDepartmentDetails } from '@/interfaces/courses.interface';
import { IDepartmentParams, getDepartments } from '@/services/department.service';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import Filter from '@/shared/components/Filter';
import useSchoolInfiniteQuery from '@/hooks/useSchoolInfiniteQuery';
import useFilter from '@/hooks/useFilter';

const Departments = () => {
  const theme = useMantineTheme();

  const { setFilterValues, tableParams, setTableParams, search, setSearch } =
    useFilter<IDepartmentParams>({
      defaultParams: {
        page: 0,
        pageSize: '10',
        sortBy: 'name',
        searchBy: ['name', 'code'],
      },
    });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [row, setRow] = useState<IDepartmentDetails | undefined>();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['departments', tableParams],
    queryFn: () => getDepartments(tableParams),
  });
  const column: ColumnHead<IDepartmentDetails> = [
    {
      label: 'Department Name',
      key: 'name',
      render: (_row, index, val) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(val)}
        </Text>
      ),
    },
    { label: 'Department Code', key: 'code' },
    {
      label: 'School',
      key: 'school',
      render: (val, index, schoolDetails) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(schoolDetails?.name)}
        </Text>
      ),
    },
    {
      label: 'Years Taken',
      key: 'yearsTaken',
      render: (_val, index, item) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {`${item}year${item > 0 ? 's' : ''}`}
        </Text>
      ),
    },
  ];
  const {
    isFetchingSchools,
    isFetchingSchoolsNextPage,
    schoolsData,
    setTableParamsSchool,
    tableParamsSchool,
  } = useSchoolInfiniteQuery();
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center" wrap="wrap" gap={10}>
          <Flex align="center" gap={5} wrap="wrap">
            <Title my={30}>Departments</Title>

            <Filter
              search={search}
              searchPlaceholder="search by name or code"
              applyFilters={(val) => setFilterValues(val)}
              onSearchChange={(val: string) => setSearch(val)}
              data={[
                {
                  type: 'multiselect',
                  placeholder: 'Schools',
                  label: 'Schools',
                  key: 'school',
                  searchValue: tableParamsSchool.search,
                  onSearch: (searchValue: string) =>
                    setTableParamsSchool({ ...tableParamsSchool, search: searchValue }),
                  data:
                    isFetchingSchools && isFetchingSchoolsNextPage
                      ? schoolsData?.concat({
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
                      : isFetchingSchools
                        ? [
                            {
                              value: 'Fetching Departments',
                              label: 'Fetching Departments',
                              disabled: true,
                            },
                          ]
                        : schoolsData || [],
                },
                {
                  type: 'number',
                  placeholder: 'Year Taken',
                  label: 'Year Taken',
                  key: 'yearsTaken',
                },
              ]}
            />
          </Flex>

          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<IDepartmentDetails>
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

        <EditDepartmentDrawer
          opened={edit}
          close={closeEdit}
          row={row}
          refetch={refetch}
          clear={() => setRow(undefined)}
        />
        <AddNewDepartmentDrawer opened={addNew} close={closeAddNew} refetch={refetch} />
      </Box>
    </>
  );
};

export default Departments;
