import { Box, Flex, Paper, Space, Text, Title, useMantineTheme } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ICourseParams, getEnrolledCourses } from '@/services/course.service';
import { getDecodedJwt } from '@/api/Auth';
import BabcockLoader from '@/shared/components/BabcockLoader';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import MantinePagination from '@/shared/components/Pagination';
import Filter from '@/shared/components/Filter';
import useFilter from '@/hooks/useFilter';

const Courses = () => {
  const theme = useMantineTheme();

  const navigate = useNavigate();

  const decodedUser = getDecodedJwt();

  const { setFilterValues, tableParams, setTableParams, search, setSearch } =
    useFilter<ICourseParams>({
      defaultParams: {
        page: 0,
        pageSize: '10',
        sortBy: 'course.name',
        searchBy: ['course.name', 'course.code'],
      },
    });
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
          wrap="wrap"
          gap={10}
        >
          <Flex>
            <Title my={30}>My Courses</Title>
            <Filter
              search={search}
              searchPlaceholder="search by name or code"
              applyFilters={(val) => setFilterValues(val)}
              onSearchChange={(val: string) => setSearch(val)}
              showFilter={false}
            />
          </Flex>
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
                    {convertAllLowercaseToSentenceCase(course?.course?.department.name)}
                  </Text>
                  <Text c={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
                    {`${course?.course?.units}unit`}
                    {course?.course?.units > 1 ? 's' : ''}
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
      </Box>
    </>
  );
};

export default Courses;
