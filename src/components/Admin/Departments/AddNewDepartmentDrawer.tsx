import { Box, Button, Drawer, Group, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { QueryObserverResult, RefetchOptions, useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { IDrawerProps } from '@/interfaces/helperInterface';
import { ApiDepartmentsResponse, addDepartmentMutation } from '@/services/department.service';
import { getSchools } from '@/services/school.service';
import { handleErrors } from '@/utils/handleErrors';

const AddNewDepartmentDrawer = ({
  opened,
  close,
  refetch,
}: IDrawerProps & {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiDepartmentsResponse, Error>>;
}) => {
  const schema = z.object({
    name: z.string().min(1, 'Department Name is required'),
    code: z
      .string()
      .min(4, 'Department Code must be 4 character')
      .max(4, 'Department Code must be 4 character'),
    yearsTaken: z
      .number()
      .min(1, 'Years Taken is required')
      .refine((val) => typeof val === 'string', { message: 'Years Taken is required' }),

    school: z
      .string({ required_error: 'School is required' })
      .min(1, 'School is required')
      .refine((val) => val === null, { message: 'School is required' }),
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

  const { data, isFetching } = useQuery({
    queryKey: ['schools'],
    queryFn: () => getSchools(),
    enabled: opened,
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
            <Select
              searchable
              nothingFoundMessage="No School..."
              data={
                isFetching
                  ? [{ value: 'Fetching Schools', label: 'Fetching Schools', disabled: true }]
                  : data?.data?.map((school) => ({
                      label: school?.name
                        .split(' ')
                        .map((item: string) => item[0].toUpperCase() + item.substring(1))
                        .join(' '),
                      value: school?._id,
                    })) || []
              }
              label="School"
              placeholder="School"
              size="md"
              my={20}
              {...form.getInputProps('school')}
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
