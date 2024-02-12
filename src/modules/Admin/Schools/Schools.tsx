import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Flex, Text, Title, useMantineTheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import AddNewSchoolDrawer from '@/components/Admin/Schools/AddNewSchoolDrawer';
import EditSchoolDrawer from '@/components/Admin/Schools/EditSchoolDrawer';
import { ISchoolDetails } from '@/interfaces/courses.interface';
import { ISchoolParams, getSchools } from '@/services/school.service';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import Filter from '@/shared/components/Filter';
import useFilter from '@/hooks/useFilter';

const Schools = () => {
  const theme = useMantineTheme();
  const { setFilterValues, tableParams, setTableParams, search, setSearch } =
    useFilter<ISchoolParams>({
      defaultParams: {
        page: 0,
        pageSize: '10',
        sortBy: 'name',
        searchBy: ['name', 'code'],
      },
    });

  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();
  const [row, setRow] = useState<ISchoolDetails | undefined>();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['schools', tableParams],
    queryFn: () => getSchools(tableParams),
  });
  const column: ColumnHead<ISchoolDetails> = [
    {
      label: 'School Name',
      key: 'name',
      render: (_row, index, val) => (
        <Text c={index % 2 !== 0 ? theme.colors.dark[9] : theme.white}>
          {convertAllLowercaseToSentenceCase(val)}
        </Text>
      ),
    },
    { label: 'School Code', key: 'code' },
  ];
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center" wrap="wrap" gap={10}>
          <Flex align="center" gap={5} wrap="wrap">
            <Title my={30}>Schools</Title>
            <Flex>
              <Filter
                search={search}
                searchPlaceholder="search by name or code"
                applyFilters={(val) => setFilterValues(val)}
                onSearchChange={(val: string) => setSearch(val)}
                showFilter={false}
              />
            </Flex>
          </Flex>
          <Button onClick={openAddNew}>Add New</Button>
        </Flex>
        <MantineTable<ISchoolDetails>
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

        <EditSchoolDrawer
          opened={edit}
          close={closeEdit}
          row={row}
          refetch={refetch}
          clear={() => setRow(undefined)}
        />

        <AddNewSchoolDrawer opened={addNew} close={closeAddNew} refetch={refetch} />
      </Box>
    </>
  );
};

export default Schools;
