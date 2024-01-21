import { Box, Button, Drawer, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { useEffect } from 'react';
import { IDrawerProps } from '@/interfaces/helperInterface';
import { ApiDepartmentsResponse, editDepartmentMutation } from '@/services/department.service';
import { IDepartmentDetails } from '@/interfaces/courses.interface';
import { handleErrors } from '@/utils/handleErrors';

type EditDrawerProps = IDrawerProps & {
  row: IDepartmentDetails | undefined;
  clear: () => void;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiDepartmentsResponse, Error>>;
};
const EditDepartmentDrawer = ({ opened, close, row, refetch, clear }: EditDrawerProps) => {
  const schema = z.object({
    name: z.string().min(1, 'School Name is required'),
    code: z
      .string()
      .min(4, 'School Code must be 4 character')
      .max(4, 'School Code must be 4 character'),
  });

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
    },

    validate: zodResolver(schema),
  });
  useEffect(() => {
    form.setValues({
      name: row?.name,
      code: row?.code,
    });
  }, [row]);

  const { mutate, isPending } = useMutation({
    mutationFn: editDepartmentMutation,
    onSuccess: () => {
      notifications.show({
        title: 'Department updated Successfull',
        message: 'A  department has been updated successfully',
        color: 'green',
      });
      refetch();
      close();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const editDepartment = (values: Record<string, any>) => {
    const formData = { name: values.name, code: values.code };
    const payload = { formData, id: row?._id || '' };
    mutate(payload);
  };
  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => {
          form.reset();
          clear();
          close();
        }}
        title="Edit Department"
        position="right"
      >
        <form onSubmit={form.onSubmit((values) => editDepartment(values))}>
          <Box h="76dvh">
            <TextInput
              label="Department Name"
              placeholder="Department Name"
              size="md"
              defaultValue={row?.name}
              my={20}
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Department Code"
              placeholder="Department Code"
              size="md"
              my={20}
              maxLength={4}
              defaultValue={row?.code}
              {...form.getInputProps('code')}
            />
          </Box>
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10} style={{ zIndex: '100' }}>
            <Button type="submit" loading={isPending}>
              Edit Department
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default EditDepartmentDrawer;
