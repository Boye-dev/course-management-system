import { Box, Button, Drawer, Group, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { IDrawerProps } from '@/interfaces/helperInterface';
import { getDecodedJwt } from '@/api/Auth';
import { updatePassword } from '@/services/admin.services';
import { hadleErrors } from '@/utils/handleErrors';

const PasswordUpdateDrawer = ({ opened, close }: IDrawerProps) => {
  const decodedUser = getDecodedJwt();

  const schema = z
    .object({
      oldPassword: z.string().min(8, { message: 'Password must be greater than 7 characters' }),
      newPassword: z.string().min(8, { message: 'Password must be greater than 7 characters' }),
      confirmNewPassword: z
        .string()
        .min(8, { message: 'Password must be greater than 7 characters' }),
    })
    .refine((val) => val.newPassword === val.confirmNewPassword, {
      path: ['confirmNewPassword'],
      message: 'Password must be the same',
    });

  const form = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },

    validate: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      notifications.show({
        title: 'Password Update Successfull',
        message: 'Your password has been updated successfull',
        color: 'green',
      });
      form.reset();
      close();
    },
    onError: (error) => {
      hadleErrors(error, 'Error Updating Password');
    },
  });

  const editPassword = (values: Record<string, any>) => {
    const formData = { oldPassword: values.oldPassword, newPassword: values.newPassword };
    const payload = { formData, id: decodedUser.id };
    mutate(payload);
  };
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Update Password" position="right">
        <form onSubmit={form.onSubmit((values) => editPassword(values))}>
          <Box h="76dvh">
            <PasswordInput
              label="Old Password"
              placeholder="Old Password"
              size="md"
              my={20}
              {...form.getInputProps('oldPassword')}
            />
            <PasswordInput
              label="New Password"
              placeholder="New Password"
              size="md"
              my={20}
              {...form.getInputProps('newPassword')}
            />
            <PasswordInput
              label="ConfirmNew Password"
              placeholder="Confirm New Password"
              size="md"
              my={20}
              {...form.getInputProps('confirmNewPassword')}
            />
          </Box>
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10}>
            <Button type="submit" loading={isPending}>
              Update Password
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default PasswordUpdateDrawer;
