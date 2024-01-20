import { Box, Button, Drawer, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { IDrawerProps } from '@/interfaces/helperInterface';
import { handleErrors } from '@/utils/handleErrors';
import { ApiSchoolResponse, addSchoolMutation } from '@/services/school.service';

const AddNewSchoolDrawer = ({
  opened,
  close,
  refetch,
}: IDrawerProps & {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiSchoolResponse, Error>>;
}) => {
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

  const { mutate, isPending } = useMutation({
    mutationFn: addSchoolMutation,
    onSuccess: () => {
      notifications.show({
        title: 'School added Successfull',
        message: 'A new school has been added successfull',
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
  const addSchool = (values: Record<string, any>) => {
    const payload = { name: values.name, code: values.code };
    mutate(payload);
  };
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Add New School" position="right">
        <form onSubmit={form.onSubmit((values) => addSchool(values))}>
          <Box h="76dvh">
            <TextInput
              label="School Name"
              placeholder="School Name"
              size="md"
              my={20}
              {...form.getInputProps('name')}
            />
            <TextInput
              label="School Code"
              placeholder="School Code"
              size="md"
              my={20}
              maxLength={4}
              {...form.getInputProps('code')}
            />
          </Box>
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10} style={{ zIndex: '100' }}>
            <Button type="submit" loading={isPending}>
              Add School
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default AddNewSchoolDrawer;
