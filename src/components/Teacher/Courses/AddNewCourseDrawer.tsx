import { Box, Button, Center, Drawer, Group, Loader, Space, Text } from '@mantine/core';
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
import { ApiCoursesResponse, enrollCourseMutation } from '@/services/course.service';
import { handleErrors } from '@/utils/handleErrors';
import { MultiSelectRender } from '@/shared/components/MultiSelectRender';
import { ITeacherParams, getTeachers } from '@/services/teacher.service';
import { SelectRender } from '@/shared/components/SelectRender';
import useCoursesInfiiniteQuery from '@/hooks/useCoursesInfiiniteQuery';

const AddNewCourseDrawer = ({
  opened,
  close,
  refetch,
}: IDrawerProps & {
  refetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiCoursesResponse, Error>>;
}) => {
  const { ref: teacherRef, inView: teacherInview } = useInView();
  const { isFetching, isFetchingNextPage, coursesData, search, setSearch } =
    useCoursesInfiiniteQuery({
      enabled: opened,
    });
  const schema = z.object({
    courses: z.array(z.string()).refine((data) => data.length > 0, {
      message: 'Select a course',
    }),
    teacher: z.string().min(1, { message: 'Teacher is required' }),
  });
  const form = useForm({
    initialValues: {
      courses: [],
      teacher: '',
    },

    validate: zodResolver(schema),
  });

  const [searchTeacher, setSearchTeacher] = useState('');
  const [debouncedTeacher] = useDebouncedValue(searchTeacher, 200);
  const [tableParamsTeachers, setTableParamsTeachers] = useState<ITeacherParams>({
    page: 0,
    pageSize: '10',
    search: searchTeacher,
    searchBy: ['firstName', 'lastName', 'middleName'],
  });

  useEffect(() => {
    setTableParamsTeachers({
      ...tableParamsTeachers,
      search: debouncedTeacher.length > 0 ? debouncedTeacher : '',
    });
  }, [debouncedTeacher]);
  const {
    fetchNextPage: fetchNextPageTeachers,
    hasNextPage: hasNextPageTeachers,
    isFetchingNextPage: isFetchingNextPageTeachers,
    isFetching: isFetchingTeachers,
    data: dataTeachers,
  } = useInfiniteQuery({
    queryKey: ['teachers-infinte', tableParamsTeachers],
    enabled: opened,
    queryFn: ({ pageParam }) => getTeachers({ ...tableParamsTeachers, page: pageParam }),
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
      id: values.teacher,
    };
    mutate(payload);
  };

  useEffect(() => {
    if (teacherInview && hasNextPageTeachers) {
      fetchNextPageTeachers();
    }
  }, [teacherInview, fetchNextPageTeachers, hasNextPageTeachers]);

  const teachersData =
    dataTeachers?.pages
      .flatMap((page) => page?.data)
      ?.map((teacher, i) => {
        if (dataTeachers?.pages.flatMap((page) => page?.data).length === i + 1) {
          return {
            render: () => (
              <Text ref={teacherRef}>
                {teacher?.lastName} {teacher?.middleName} {teacher?.firstName}
              </Text>
            ),
            label: `${teacher?.lastName} ${teacher?.middleName} ${teacher?.firstName}`,
            value: teacher?._id,
            disabled: false,
          };
        }
        return {
          render: () => (
            <Text ref={teacherRef}>
              {teacher?.lastName} {teacher?.middleName} {teacher?.firstName}
            </Text>
          ),
          label: `${teacher?.lastName} ${teacher?.middleName} ${teacher?.firstName}`,
          value: teacher?._id,
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
              searchValue={search}
              onSearch={(searchValue) => setSearch(searchValue)}
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
            <Space h={10} />
            <SelectRender
              maxDropdownHeight={300}
              label="Teacher"
              search={searchTeacher}
              setSearch={setSearchTeacher}
              placeholder="Teacher"
              data={
                isFetchingTeachers && isFetchingNextPageTeachers
                  ? teachersData?.concat({
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
                  : isFetchingTeachers
                    ? [
                        {
                          value: 'Fetching Teachers',
                          label: 'Fetching Teachers',
                          disabled: true,
                        },
                      ]
                    : teachersData || []
              }
              {...form.getInputProps('teacher')}
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
