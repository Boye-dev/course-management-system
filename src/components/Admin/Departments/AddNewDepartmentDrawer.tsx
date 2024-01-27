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
import { z } from 'zod';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { IDrawerProps } from '@/interfaces/helperInterface';
import { ApiDepartmentsResponse, addDepartmentMutation } from '@/services/department.service';
import { ApiSchoolResponse, ISchoolParams, getSchools } from '@/services/school.service';
import { handleErrors } from '@/utils/handleErrors';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';

import { SelectRender } from '@/shared/components/SelectRender';

const AddNewDepartmentDrawer = ({
  opened,
  close,
  refetch,
}: IDrawerProps & {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiDepartmentsResponse, Error>>;
}) => {
  const { ref, inView } = useInView();

  const schema = z.object({
    name: z.string().min(1, 'Department Name is required'),
    code: z
      .string()
      .min(4, 'Department Code must be 4 character')
      .max(4, 'Department Code must be 4 character'),
    yearsTaken: z.number().min(1, 'Years Taken is required'),
    school: z.string({ required_error: 'School is required' }).min(1, 'School is required'),
  });
  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      yearsTaken: 0,
      school: '',
    },

    validate: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addDepartmentMutation,
    onSuccess: () => {
      notifications.show({
        title: 'Department added Successfull',
        message: 'A new department has been added successfull',
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
  const addDepartment = (values: Record<string, any>) => {
    const payload = {
      name: values.name,
      code: values.code,
      yearsTaken: values.yearsTaken,
      school: values.school,
    };
    mutate(payload);
  };
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 300);
  const [tableParams, setTableParams] = useState<ISchoolParams>({
    page: 0,
    pageSize: '10',
    search,
    searchBy: ['name'],
  });

  useEffect(() => {
    setTableParams({ ...tableParams, search: debounced.length > 0 ? debounced : '' });
  }, [debounced]);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, data } = useInfiniteQuery({
    queryKey: ['schools-infinte', tableParams],
    enabled: opened,
    queryFn: ({ pageParam }) => getSchools({ ...tableParams, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages: any) => {
      const totalItems = lastPage?.total;
      const itemsLoaded = pages.reduce(
        (total: number, page: ApiSchoolResponse) => total + page.data.length,
        0
      );

      if (itemsLoaded < totalItems) {
        return pages.length;
      }

      return undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  const schoolData =
    data?.pages
      .flatMap((page) => page.data)
      ?.map((school, i) => {
        if (data?.pages.flatMap((page) => page.data).length === i + 1) {
          return {
            render: () => <Text ref={ref}>{convertAllLowercaseToSentenceCase(school?.name)}</Text>,
            label: `${convertAllLowercaseToSentenceCase(school?.name)}`,
            value: school?._id,
            disabled: false,
          };
        }
        return {
          render: () => <Text>{convertAllLowercaseToSentenceCase(school?.name)}</Text>,
          label: `${convertAllLowercaseToSentenceCase(school?.name)}`,
          value: school?._id,
          disabled: false,
        };
      }) || [];

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Add New Department" position="right">
        <form onSubmit={form.onSubmit((values) => addDepartment(values))}>
          <Box h="76dvh">
            <TextInput
              label="Department Name"
              placeholder="Department Name"
              size="md"
              my={20}
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Department Code"
              placeholder="Department Code"
              size="md"
              my={20}
              maxLength={4}
              {...form.getInputProps('code')}
            />

            <NumberInput
              label="Department Years"
              placeholder="Department Years"
              size="md"
              allowNegative={false}
              allowDecimal={false}
              allowLeadingZeros={false}
              my={20}
              {...form.getInputProps('yearsTaken')}
            />
            <SelectRender
              maxDropdownHeight={300}
              label="Schools"
              search={search}
              setSearch={setSearch}
              placeholder="Schools"
              data={
                isFetching && isFetchingNextPage
                  ? schoolData?.concat({
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
                          value: 'Fetching Schools',
                          label: 'Fetching Schools',
                          disabled: true,
                        },
                      ]
                    : schoolData || []
              }
            />
          </Box>
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10} style={{ zIndex: '100' }}>
            <Button type="submit" loading={isPending}>
              Add Department
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default AddNewDepartmentDrawer;
