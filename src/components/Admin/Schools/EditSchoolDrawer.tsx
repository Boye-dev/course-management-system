import { Box, Button, Drawer, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { useEffect } from 'react';
import { IDrawerProps } from '@/interfaces/helperInterface';
import { handleErrors } from '@/utils/handleErrors';
import { ApiSchoolResponse, editSchoolMutation } from '@/services/school.service';
import { ISchoolDetails } from '@/interfaces/courses.interface';

type EditDrawerProps = IDrawerProps & {
  row: ISchoolDetails | undefined;
  clear: () => void;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiSchoolResponse, Error>>;
};
const EditSchoolDrawer = ({ opened, close, row, refetch, clear }: EditDrawerProps) => {
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
    mutationFn: editSchoolMutation,
    onSuccess: () => {
      notifications.show({
        title: 'School updated Successfull',
        message: 'A school has been updated successfully',
        color: 'green',
      });
      refetch();
      close();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const editSchool = (values: Record<string, any>) => {
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
        title="Edit School"
        position="right"
      >
        <form onSubmit={form.onSubmit((values) => editSchool(values))}>
          <Box h="76dvh">
            <TextInput
              label="School Name"
              placeholder="School Name"
              size="md"
              my={20}
              defaultValue={row?.name}
              {...form.getInputProps('name')}
            />
            <TextInput
              label="School Code"
              placeholder="School Code"
              size="md"
              my={20}
              maxLength={4}
              defaultValue={row?.code}
              {...form.getInputProps('code')}
            />
          </Box>
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10} style={{ zIndex: '100' }}>
            <Button type="submit" loading={isPending}>
              Edit School
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default EditSchoolDrawer;
