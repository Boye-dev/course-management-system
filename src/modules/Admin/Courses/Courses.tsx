import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Flex, Text, Title, useMantineTheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import MantineTable, { ColumnHead } from '@/shared/components/Table';
import AddNewCourseDrawer from '@/components/Admin/Courses/AddNewCourseDrawer';
import EditCourseDrawer from '@/components/Admin/Courses/EditCourseDrawer';
import { ICourseDetails } from '@/interfaces/courses.interface';
import { ICourseParams, getCourses } from '@/services/course.service';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';

const Courses = () => {
  const theme = useMantineTheme();
  const [tableParams, setTableParams] = useState<ICourseParams>({
    page: 0,
    pageSize: '10',
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
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>Courses</Title>
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
