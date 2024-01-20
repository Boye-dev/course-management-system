// import { useState } from 'react';
import { Box, Button, Center, Flex, Group, Modal, Space, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
// import MantineTable from '@/shared/components/Table';
// import { ICourseDetails } from '@/interfaces/courses.interface';

// interface ITableParams {
//   page: number;
//   pageSize: string;
//   search?: string;
// }

const SelectCourse = () => {
  // const [selectedRows, setSelectedRows] = useState<ICourseDetails[]>([]);

  // const [tableParams, setTableParams] = useState<ITableParams>({
  //   page: 0,
  //   pageSize: '5',
  // });
  //   const { year } = useParams();
  const [modal, { open: openModal, close: closeModal }] = useDisclosure();
  const [nextPage, { toggle }] = useDisclosure();

  return (
    <>
      <Box>
        {nextPage || (
          <>
            <Flex justify="space-between" align="center">
              <Title my={30}>Select Courses</Title>
              <Button onClick={toggle}>Next</Button>
            </Flex>
            {/* <MantineTable<ICourseDetails>
              head={[
                { label: 'Name', key: 'name' },
                { label: 'Course Code', key: 'course_code' },
                { label: 'Level', key: 'level' },
                { label: 'Department', key: 'department', render: (val) => val.name },
                { label: 'School', key: 'school', render: (val) => val.name },
              ]}
              checkbox
              total={mockData.length}
              values={mockData}
              pageSize={tableParams.pageSize}
              page={tableParams.page}
              onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
              onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            /> */}
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
              <Button onClick={openModal}>Add Selcted Courses</Button>
            </Flex>
            <Space h={15} />
            {/* <MantineTable<ICourseDetails>
              head={[
                { label: 'Name', key: 'name' },
                { label: 'Course Code', key: 'course_code' },
                { label: 'Level', key: 'level' },
                { label: 'Department', key: 'department', render: (val) => val.name },
                { label: 'School', key: 'school', render: (val) => val.name },
              ]}
              checkbox
              total={selectedRows.length}
              values={selectedRows}
              pageSize={tableParams.pageSize}
              page={tableParams.page}
              onRowsPerPageChange={(val) => setTableParams({ ...tableParams, pageSize: val })}
              onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            /> */}
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
            <Button color="red">Add Course</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default SelectCourse;
