import {
  Avatar,
  Button,
  Center,
  Drawer,
  FileButton,
  Group,
  Loader,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import {
  QueryObserverResult,
  RefetchOptions,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IDrawerProps } from '@/interfaces/helperInterface';
import useStateAndLGA from '@/hooks/useStateAndLga';
import { handleErrors } from '@/utils/handleErrors';
import { GenderEnum, RelationshipStatusEnum } from '@/interfaces/auth.interface';
import {
  ApiDepartmentsResponse,
  IDepartmentParams,
  getDepartments,
} from '@/services/department.service';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';
import { ApiTeachersResponse, addTeacher } from '@/services/teacher.service';
import { Roles } from '@/constants/roles';
import { SelectRender } from '@/shared/components/SelectRender';

const AddNewTeacherDrawer = ({
  opened,
  refetch,
  close,
}: IDrawerProps & {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiTeachersResponse, Error>>;
}) => {
  const { ref, inView } = useInView();
  const [file, setFile] = useState<File | null>(null);
  const schema = z
    .object({
      firstName: z.string().min(1, { message: 'First name is required' }),
      lastName: z.string().min(1, { message: 'Last name is required' }),
      middleName: z.string().min(1, { message: 'Middle name is required' }),
      gender: z.string().min(1, { message: 'Gender is required' }),
      relationshipStatus: z.string().min(1, { message: 'Marital Status is required' }),
      nationality: z.string().min(1, { message: 'Nationality is required' }),
      department: z.string().min(1, { message: 'Department is required' }),
      state: z.string().min(1, { message: 'State is required' }),
      lga: z.string().min(1, { message: 'LGA is required' }),
      address: z.string().min(1, { message: 'Address is required' }),
      email: z
        .string()
        .email({ message: 'Email is invalid' })
        .min(1, { message: 'Email is required' }),
      dateOfBirth: z.date(),
      phoneNumber: z
        .string()
        .min(11, { message: 'Phone Number Must Be 11 Digits' })
        .max(11, { message: 'Phone Number Must Be 11 Digits' }),
      password: z.string().min(8, { message: 'Password must be greater than 7 characters' }),
      confirmPassword: z.string().min(8, { message: 'Password must be greater than 7 characters' }),
    })
    .refine((val) => val.password === val.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Password must be the same',
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
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      gender: '',
      phoneNumber: '',
      dateOfBirth: '',
      relationshipStatus: '',
      nationality: '',
      state: '',
      lga: '',
      address: '',
      department: '',
      password: '',
      confirmPassword: '',
      email: '',
    },

    validate: zodResolver(schema),
  });
  const { states } = useStateAndLGA(form.getTransformedValues().state || '');
  const { LGAs } = useStateAndLGA(form.getTransformedValues().state || '');
  const { mutate, isPending } = useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      notifications.show({
        title: 'Teacher Added Successfull',
        message: 'A new teacher has been added successfull',
        color: 'green',
      });
      refetch && refetch();

      setFile(null);
      close();
    },
    onError: (error) => {
      handleErrors(error, 'Error Adding Teacher');
    },
  });
  const addTeacherMutation = (values: Record<string, any>) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'dateOfBirth') {
        const date = dayjs(value).format('YYYY-MM-DD');
        formData.append(key, date);
      } else {
        formData.append(key, value);
      }
    });
    if (file) {
      formData.append('profilePicture', file);
    }
    formData.append('role', Roles.TEACHER);
    mutate(formData);
  };
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Add New Teacher" position="right">
        <form onSubmit={form.onSubmit((values) => addTeacherMutation(values))}>
          <Text fw={500}> Profile Picture</Text>
          <FileButton onChange={setFile} accept="image/png,image/jpeg" multiple={false}>
            {(props) => (
              <Avatar
                my={20}
                style={{ cursor: 'pointer' }}
                {...props}
                alt="profilePicture"
                size="lg"
                src={file && URL.createObjectURL(file)}
              />
            )}
          </FileButton>

          <TextInput
            label="First Name"
            placeholder="First Name"
            size="md"
            my={20}
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Last Name"
            placeholder="Last Name"
            size="md"
            my={20}
            {...form.getInputProps('lastName')}
          />
          <TextInput
            label="Middle Name"
            placeholder="Middle Name"
            size="md"
            my={20}
            {...form.getInputProps('middleName')}
          />
          <TextInput
            label="Email"
            placeholder="Email"
            size="md"
            my={20}
            {...form.getInputProps('email')}
          />
          <TextInput
            label="Phone Number"
            placeholder="Phone Number"
            size="md"
            my={20}
            {...form.getInputProps('phoneNumber')}
          />
          <Select
            data={Object.values(GenderEnum)}
            label="Gender"
            placeholder="Gender"
            size="md"
            my={20}
            {...form.getInputProps('gender')}
          />
          <DateInput
            label="Dob"
            placeholder="Date Of Birth"
            size="md"
            valueFormat="YYYY-MM-DD"
            my={20}
            {...form.getInputProps('dateOfBirth')}
          />

          <Select
            data={Object.values(RelationshipStatusEnum)}
            label="Marital Status"
            placeholder="Marital Status"
            size="md"
            my={20}
            {...form.getInputProps('relationshipStatus')}
          />
          <TextInput
            label="Nationality"
            placeholder="Nationality"
            size="md"
            my={20}
            {...form.getInputProps('nationality')}
          />
          <Select
            label="State"
            placeholder="State"
            size="md"
            my={20}
            data={states}
            {...form.getInputProps('state')}
          />
          <Select
            label="Lga"
            placeholder="Lga"
            size="md"
            data={LGAs}
            my={20}
            {...form.getInputProps('lga')}
          />
          <Textarea
            label="Address"
            placeholder="Address"
            size="md"
            my={20}
            {...form.getInputProps('address')}
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
          <PasswordInput
            label="Password"
            placeholder="Password"
            size="md"
            my={20}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm Password"
            size="md"
            my={20}
            {...form.getInputProps('confirmPassword')}
          />
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10} style={{ zIndex: '100' }}>
            <Button type="submit" loading={isPending}>
              Add Teacher
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default AddNewTeacherDrawer;
