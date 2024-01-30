import { Box, Button, Flex, Paper, Space, Text, Title, useMantineTheme } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { ICourseParams, getEnrolledCourses } from '@/services/course.service';
import AddNewCourseDrawer from '@/components/Teacher/Courses/AddNewCourseDrawer';
import { getDecodedJwt } from '@/api/Auth';
import BabcockLoader from '@/shared/components/BabcockLoader';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import MantinePagination from '@/shared/components/Pagination';

const Courses = () => {
  const theme = useMantineTheme();
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();

  const navigate = useNavigate();
  const [tableParams, setTableParams] = useState<ICourseParams>({
    page: 0,
    pageSize: '10',
  });
  const decodedUser = getDecodedJwt();

  const { data, isFetching } = useQuery({
    queryKey: ['courses-enrolled', tableParams],
    queryFn: () => getEnrolledCourses({ teacher: decodedUser.id, queryParams: tableParams }),
  });

  return (
    <>
      <Box>
        <Flex
          justify="space-between"
          align={{ xs: 'flex-start', md: 'center' }}
          direction={{ xs: 'column', md: 'row' }}
        >
          <Title my={30}>My Courses</Title>
          <Button onClick={openAddNew}>Enroll In A Course</Button>
        </Flex>
        <Space h={15} />
        {isFetching ? (
          <BabcockLoader />
        ) : (
          <>
            <Flex justify="space-evenly" align="center" wrap="wrap" gap={20} pb={60}>
              {data?.data?.map((course) => (
                <Paper
                  w={{ xs: '100%', md: 'auto' }}
                  mih={100}
                  miw={300}
                  shadow="xs"
                  style={{ cursor: 'pointer' }}
                  p={10}
                  onClick={() => navigate(`${course?.course._id}`)}
                >
                  <Flex align="center" justify="flex-start" h="100%">
                    <IconBook color={theme.colors.brandSecondary?.[9]} size={30} />
                    <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                      {convertAllLowercaseToSentenceCase(course?.course?.name)}
                    </Text>
                  </Flex>
                  <Text c={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
                    Computer Tech
                  </Text>
                  <Text c={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
                    3 Units
                  </Text>
                </Paper>
              ))}
            </Flex>
          </>
        )}
        <Box pos="fixed" bottom={0} right={0} bg="white" w="100%" p={5}>
          <MantinePagination
            total={data?.total || 0}
            rowsPerPageOptions={['5', '10', '20', '30', '50', '100']}
            value={tableParams.pageSize}
            onRowsPerPageChange={(val) =>
              setTableParams({ ...tableParams, pageSize: val, page: 0 })
            }
            onPageChange={(val) => setTableParams({ ...tableParams, page: val })}
            page={tableParams.page}
            pageSize={parseInt(tableParams.pageSize, 10)}
          />
        </Box>
        <AddNewCourseDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Courses;
