import {
  Box,
  Button,
  Center,
  Drawer,
  Group,
  Loader,
  NumberInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  QueryObserverResult,
  RefetchOptions,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useInView } from 'react-intersection-observer';
import { z } from 'zod';
import { IDrawerProps } from '@/interfaces/helperInterface';
import { ApiCoursesResponse, addCourseMutation } from '@/services/course.service';
import {
  ApiDepartmentsResponse,
  IDepartmentParams,
  getDepartments,
} from '@/services/department.service';
import { handleErrors } from '@/utils/handleErrors';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import { SelectRender } from '@/shared/components/SelectRender';

const AddNewCourseDrawer = ({
  opened,
  close,
  refetch,
}: IDrawerProps & {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiCoursesResponse, Error>>;
}) => {
  const { ref, inView } = useInView();

  const schema = z.object({
    name: z.string().min(1, 'Course Name is required'),
    code: z
      .string()
      .min(2, 'Course Code must be 2 character')
      .max(2, 'Course Code must be 2 character')
      .refine((value) => /^\d{2}$/.test(value), {
        message: 'Course Code must be 2 numeric characters',
      }),
    yearTaken: z.number().min(1, 'Years Taken is required'),
    units: z.number().min(1, 'Units is required'),
    department: z
      .string({ required_error: 'Department is required' })
      .min(1, 'Department is required'),
  });
  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      yearTaken: 0,
      department: '',
    },

    validate: zodResolver(schema),
  });
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const [tableParams, setTableParams] = useState<IDepartmentParams>({
    page: 0,
    pageSize: '10',
    search,
    searchBy: ['name'],
  });

  useEffect(() => {
    setTableParams({ ...tableParams, search: debounced.length > 0 ? debounced : '' });
  }, [debounced]);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, data } = useInfiniteQuery({
    queryKey: ['departments-infinite', tableParams],

    enabled: opened,
    queryFn: ({ pageParam }) => getDepartments({ ...tableParams, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages: any) => {
      const totalItems = lastPage?.total;
      const itemsLoaded = pages.reduce(
        (total: number, page: ApiDepartmentsResponse) => total + page.data.length,
        0
      );

      if (itemsLoaded < totalItems) {
        return pages.length;
      }

      return undefined;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addCourseMutation,
    onSuccess: () => {
      notifications.show({
        title: 'Course added Successfull',
        message: 'A new course has been added successfull',
        color: 'green',
      });
      form.reset();
      refetch();
      close();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const addCourse = (values: Record<string, any>) => {
    const payload = {
      name: values.name,
      code: values.code,
      yearTaken: values.yearTaken,
      department: values.department,
      units: values.units,
    };
    mutate(payload);
  };
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  const departmentsData =
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
      <Drawer opened={opened} onClose={close} title="Add New Course" position="right">
        <form onSubmit={form.onSubmit((values) => addCourse(values))}>
          <Box h="76dvh">
            <TextInput
              label="Course Name"
              placeholder="Course Name"
              size="md"
              my={20}
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Course Code"
              placeholder="Course Code"
              size="md"
              my={20}
              maxLength={2}
              {...form.getInputProps('code')}
            />

            <NumberInput
              label="Year Taken"
              placeholder="Year Taken"
              size="md"
              allowNegative={false}
              allowDecimal={false}
              allowLeadingZeros={false}
              my={20}
              {...form.getInputProps('yearTaken')}
            />
            <NumberInput
              label="Units"
              placeholder="Units"
              size="md"
              allowNegative={false}
              allowDecimal={false}
              allowLeadingZeros={false}
              my={20}
              mb={40}
              {...form.getInputProps('units')}
            />
            <SelectRender
              maxDropdownHeight={300}
              label="Departments"
              search={search}
              setSearch={setSearch}
              placeholder="Departments"
              data={
                isFetching && isFetchingNextPage
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
                  : isFetching
                    ? [
                        {
                          value: 'Fetching Departments',
                          label: 'Fetching Departments',
                          disabled: true,
                        },
                      ]
                    : departmentsData || []
              }
              {...form.getInputProps('department')}
            />
          </Box>
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10} style={{ zIndex: '100' }}>
            <Button type="submit" loading={isPending}>
              Add Course
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default AddNewCourseDrawer;
