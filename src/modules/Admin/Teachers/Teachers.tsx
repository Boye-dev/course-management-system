import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Loader,
  Pill,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import { IUser } from '@/interfaces/auth.interface';
import { getStatusColor } from '@/utils/getStatusColor';
import AddNewTeacherDrawer from '@/components/Admin/Teachers/AddNewTeacherDrawer';
import EditTeacherDrawer from '@/components/Admin/Teachers/EditTeacherDrawer';
import {
  convertAllLowercaseToSentenceCase,
  convertAllUpperCaseToSentenceCase,
} from '@/utils/textHelpers';
import useDepartmentsInfiniteQuery from '@/hooks/useDepartmentsInfiniteQuery';
import Filter from '@/shared/components/Filter';
import useFilter from '@/hooks/useFilter';
import { ITeacherParams, getTeachers } from '@/services/teacher.service';

const Teachers = () => {
  const theme = useMantineTheme();
  const { setFilterValues, tableParams, setTableParams, search, setSearch } =
    useFilter<ITeacherParams>({
      defaultParams: {
        page: 0,
        pageSize: '10',
        sortBy: 'lastName',
        searchBy: ['firstName', 'lastName', 'middleName', 'email'],
      },
    });
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();

  const [row, setRow] = useState<IUser | undefined>();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['teachers', tableParams],
    queryFn: () => getTeachers(tableParams),
  });

  const column: ColumnHead<IUser> = [
    {
      label: '',
      key: 'profilePicture',
      render: (_row, index, pic) => <Avatar src={pic} />,
    },

    {
      label: 'Full Name',
      key: 'firstName',
      render: (_row, index) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {_row.lastName} {_row.middleName} {_row.firstName}
        </Text>
      ),
    },
    { label: 'Email', key: 'email' },
    {
      label: 'Department',
      key: 'department',
      render: (_row, index, departmentDetails) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(departmentDetails?.name)}
        </Text>
      ),
    },
    { label: 'Gender', key: 'gender' },
    {
      label: 'Status',
      key: 'status',
      render: (_row, _index, status) => (
        <Pill c={getStatusColor(status)}>{convertAllUpperCaseToSentenceCase(status)}</Pill>
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
            <Title my={30}>Teachers</Title>

            <Filter
              search={search}
              searchPlaceholder="search by name or email"
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
                  placeholder: 'Gender',
                  label: 'Gender',
                  key: 'gender',
                  data: [
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                  ],
                },

                {
                  type: 'multiselect',
                  placeholder: 'Status',
                  label: 'Status',
                  key: 'status',
                  data: [
                    { label: 'Active', value: 'ACTIVE' },
                    { label: 'Inactive', value: 'INACTIVE' },
                  ],
                },
              ]}
            />
          </Flex>

          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<IUser>
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

        <EditTeacherDrawer
          opened={edit}
          close={closeEdit}
          row={row}
          refetch={refetch}
          clear={() => setRow(undefined)}
        />
        <AddNewTeacherDrawer opened={addNew} close={closeAddNew} refetch={refetch} />
      </Box>
    </>
  );
};

export default Teachers;
