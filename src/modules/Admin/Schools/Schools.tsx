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

const Schools = () => {
  const theme = useMantineTheme();
  const [tableParams, setTableParams] = useState<ISchoolParams>({
    page: 0,
    pageSize: '10',
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
        <Flex justify="space-between" align="center">
          <Title my={30}>Schools</Title>
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
