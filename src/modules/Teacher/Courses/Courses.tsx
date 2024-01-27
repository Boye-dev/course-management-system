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

const Courses = () => {
  const theme = useMantineTheme();
  const [addNew, { open: openAddNew, close: closeAddNew }] = useDisclosure();

  const navigate = useNavigate();
  const [tableParams] = useState<ICourseParams>({
    page: 0,
    pageSize: '10',
  });
  const decodedUser = getDecodedJwt();

  const { data, isFetching } = useQuery({
    queryKey: ['courses-enrolled'],
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
          <Flex
            justify="space-evenly"
            align="center"
            wrap="wrap"
            gap={20}
            onClick={() => navigate('1/my-students')}
          >
            {data?.data?.map((course) => (
              <Paper
                w={{ xs: '100%', md: 'auto' }}
                mih={100}
                miw={300}
                shadow="xs"
                style={{ cursor: 'pointer' }}
                p={10}
              >
                <Flex align="center" justify="flex-start" h="100%">
                  <IconBook color={theme.colors.brandSecondary?.[9]} size={30} />
                  <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                    {convertAllLowercaseToSentenceCase(course?.course?.name)}
                  </Text>
                </Flex>
                <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
                  Computer Tech
                </Text>
                <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
                  3 Units
                </Text>
              </Paper>
            ))}
          </Flex>
        )}
        <AddNewCourseDrawer opened={addNew} close={closeAddNew} />
      </Box>
    </>
  );
};

export default Courses;
