import { Box, Button, Center, Drawer, Group, Loader, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  QueryObserverResult,
  RefetchOptions,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useInView } from 'react-intersection-observer';
import { IDrawerProps } from '@/interfaces/helperInterface';
import {
  ApiCoursesResponse,
  ICourseParams,
  enrollCourseMutation,
  getCourses,
} from '@/services/course.service';
import { handleErrors } from '@/utils/handleErrors';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import { getDecodedJwt } from '@/api/Auth';
import { MultiSelectRender } from '@/shared/components/MultiSelectRender';

const AddNewCourseDrawer = ({
  opened,
  close,
  refetch,
}: IDrawerProps & {
  refetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiCoursesResponse, Error>>;
}) => {
  const { ref, inView } = useInView();
  const decodedUser = getDecodedJwt();
  const schema = z.object({
    courses: z.any(),
  });
  const form = useForm({
    initialValues: {
      courses: [],
    },

    validate: zodResolver(schema),
  });
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const [tableParams, setTableParams] = useState<ICourseParams>({
    page: 0,
    pageSize: '10',
    search,
    searchBy: ['name'],
  });

  useEffect(() => {
    setTableParams({ ...tableParams, search: debounced.length > 0 ? debounced : '' });
  }, [debounced]);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, data } = useInfiniteQuery({
    queryKey: ['courses-infinte', tableParams],
    enabled: opened,
    queryFn: ({ pageParam }) => getCourses({ ...tableParams, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages: any) => {
      const totalItems = lastPage?.total;
      const itemsLoaded = pages.reduce(
        (total: number, page: ApiCoursesResponse) => total + page.data.length,
        0
      );

      if (itemsLoaded < totalItems) {
        return pages.length;
      }

      return undefined;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: enrollCourseMutation,
    onSuccess: () => {
      notifications.show({
        title: 'Course enrollment Successfull',
        message: 'You have enrolled for the courses successfull',
        color: 'green',
      });
      form.reset();
      refetch && refetch();
      close();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const addCourse = (values: Record<string, any>) => {
    const payload = {
      courses: values.courses,
      id: decodedUser.id,
    };
    mutate(payload);
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  const coursesData =
    data?.pages
      .flatMap((page) => page.data)
      ?.map((course, i) => {
        if (data?.pages.flatMap((page) => page.data).length === i + 1) {
          return {
            render: () => <Text ref={ref}>{convertAllLowercaseToSentenceCase(course?.name)}</Text>,
            label: `${convertAllLowercaseToSentenceCase(course?.name)}`,
            value: course?._id,
            disabled: false,
          };
        }
        return {
          render: () => <Text>{convertAllLowercaseToSentenceCase(course?.name)}</Text>,
          label: `${convertAllLowercaseToSentenceCase(course?.name)}`,
          value: course?._id,
          disabled: false,
        };
      }) || [];

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Enroll New Course" position="right">
        <form onSubmit={form.onSubmit((values) => addCourse(values))}>
          <Box h="76dvh">
            <MultiSelectRender
              maxDropdownHeight={250}
              label="Courses"
              search={search}
              setSearch={setSearch}
              placeholder="Courses"
              data={
                isFetching && isFetchingNextPage
                  ? coursesData?.concat({
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
                  : isFetching
                    ? [
                        {
                          value: 'Fetching Courses',
                          label: 'Fetching Courses',
                          disabled: true,
                        },
                      ]
                    : coursesData || []
              }
              {...form.getInputProps('courses')}
            />
          </Box>
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10} style={{ zIndex: '100' }}>
            <Button type="submit" loading={isPending}>
              Enroll New Course
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default AddNewCourseDrawer;
