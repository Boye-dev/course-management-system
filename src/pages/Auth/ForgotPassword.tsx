import { Button, Flex, Image, Text, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { handleErrors } from '@/utils/handleErrors';
import { forgotPassword } from '@/services/auth.service';
import logo from '@/assets/images/babcock-logo.png';

const ForgotPassword = () => {
  const [reset, { open }] = useDisclosure();
  const [email, setEmail] = useState('');
  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      notifications.show({
        title: 'Reset Passowrd Email Sent',
        message: 'Please check your email to reset password',
        color: 'green',
      });
      open();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  return (
    <>
      <Flex align="center" justify="center" direction="column" h="100dvh">
        <Image src={logo} w={80} h={80} />
        {reset ? (
          <Text>Check your mail to reset your password</Text>
        ) : (
          <>
            <TextInput
              label="Enter You Email"
              placeholder="Email"
              w={250}
              mt={20}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button w={250} mt={15} onClick={() => mutate({ email })} loading={isPending}>
              Forgot Password
            </Button>
          </>
        )}
      </Flex>
    </>
  );
};

export default ForgotPassword;
