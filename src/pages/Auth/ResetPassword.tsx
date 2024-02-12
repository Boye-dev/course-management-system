import { Box, Button, Flex, Group, Image, PasswordInput, Text } from '@mantine/core';
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { z } from 'zod';

import { useMutation } from '@tanstack/react-query';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { handleErrors } from '@/utils/handleErrors';
import { resetPassword } from '@/services/auth.service';
import logo from '@/assets/images/babcock-logo.png';

const ResetPassword = () => {
  const [reset, { open }] = useDisclosure();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const id = searchParams.get('id') || '';
  const schema = z
    .object({
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
      newPassword: '',
      confirmNewPassword: '',
    },

    validate: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      notifications.show({
        title: 'Password Reset Successfull',
        message: 'Your password has been reset successfull',
        color: 'green',
      });
      form.reset();
      open();
    },
    onError: (error) => {
      handleErrors(error, 'Error Resetting Password');
    },
  });
  const editPassword = (values: Record<string, any>) => {
    mutate({ password: values.newPassword, token, id });
  };
  return (
    <>
      <Flex align="center" justify="center" direction="column" h="100dvh">
        <Image src={logo} w={80} h={80} />
        {reset ? (
          <>
            <Text>Password Reset Successfull </Text>
            <Button w={200} mt={15} onClick={() => navigate('/login')}>
              Login
            </Button>
          </>
        ) : (
          <>
            <form onSubmit={form.onSubmit((values) => editPassword(values))}>
              <Box>
                <PasswordInput
                  label="New Password"
                  placeholder="New Password"
                  my={20}
                  w={250}
                  {...form.getInputProps('newPassword')}
                />
                <PasswordInput
                  label="ConfirmNew Password"
                  placeholder="Confirm New Password"
                  w={250}
                  my={20}
                  {...form.getInputProps('confirmNewPassword')}
                />
              </Box>
              <Group justify="end" pos="sticky" bottom={0} bg="white">
                <Button type="submit" loading={isPending} w={250}>
                  Reset Password
                </Button>
              </Group>
            </form>
          </>
        )}
      </Flex>
    </>
  );
};

export default ResetPassword;
