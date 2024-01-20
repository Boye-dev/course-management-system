import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Button,
  Flex,
  Image,
  Paper,
  PasswordInput,
  PinInput,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import logo from '@/assets/images/babcock-logo.png';
import { IOtpInterface, LoginInterface } from '@/interfaces/auth.interface';
import { login, verifyOtp } from '@/services/auth.service';
import Auth from '@/api/Auth';
import { Roles } from '@/constants/roles';
import { handleErrors } from '@/utils/handleErrors';

const Login = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const form = useForm<LoginInterface>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.trim().length < 8 ? 'Password must be greater than 8' : null),
    },
  });
  const otpForm = useForm<IOtpInterface>({
    initialValues: {
      otp: 0,
    },
    validate: {
      otp: (value) => (value.toString().length < 6 ? 'Otp must be greater than 6' : null),
    },
  });
  const { mutate, isPending, data } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      notifications.show({
        title: 'Login successful',
        message: 'Please enter your otp',
        color: 'green',
      });
      setShowOtp(true);
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const { mutate: verifyOtpMutation, isPending: isVerifyingOtp } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (tokenData) => {
      notifications.show({
        title: 'Login successful',
        message: 'Otp verification successfull',
        color: 'green',
      });

      Auth.setToken(tokenData?.data?.accessToken);
      Auth.setRefreshToken(tokenData?.data?.refreshToken);
      if (data?.data.role === Roles.ADMIN) {
        navigate('/admin/students');
      }
      if (data?.data.role === Roles.TEACHER) {
        navigate('/teacher/courses');
      }
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const submitLogin = (values: LoginInterface) => {
    mutate(values);
  };

  const verifyOtpSubmit = (values: IOtpInterface) => {
    const payload = { otp: Number(values.otp), id: data?.data?._id };

    verifyOtpMutation(payload);
  };

  const getUrl = () => {
    if (Auth.getDecodedJwt().role === Roles.ADMIN) {
      return '/admin/personal-info';
    }
    return '';
  };

  return Auth.isAuthenticated() ? (
    <Navigate to={getUrl()} />
  ) : (
    <>
      <Flex w="100%" h="100vh" justify="center" align="center">
        <Paper w={300} shadow="xs" p={20}>
          <Flex justify="center">
            <Image src={logo} w={80} h={80} />
          </Flex>

          {showOtp ? (
            <>
              <Stack align="center" mt={10}>
                <form onSubmit={otpForm.onSubmit((values) => verifyOtpSubmit(values))}>
                  <Text fw={500}>Verify Otp</Text>
                  <PinInput
                    mt={20}
                    inputMode="numeric"
                    type="number"
                    length={6}
                    placeholder="_"
                    {...otpForm.getInputProps('otp')}
                  />
                  {Object.values(otpForm.errors).length > 0 && (
                    <Text fz={12} c="red">
                      {otpForm.errors.otp}
                    </Text>
                  )}

                  <Button fullWidth mt={15} type="submit" loading={isVerifyingOtp}>
                    Verify
                  </Button>
                </form>
              </Stack>
            </>
          ) : (
            <>
              <form onSubmit={form.onSubmit((values) => submitLogin(values))}>
                <TextInput
                  label="Email"
                  placeholder="Email"
                  mt={20}
                  {...form.getInputProps('username')}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Password"
                  mt={20}
                  {...form.getInputProps('password')}
                />
                <Button fullWidth mt={30} type="submit" loading={isPending}>
                  Login
                </Button>
              </form>

              <Text
                color={theme.colors.brandSecondary[9]}
                fz={12}
                ta="right"
                mt={5}
                style={{ cursor: 'pointer' }}
              >
                Forgot Password?
              </Text>
            </>
          )}
        </Paper>
      </Flex>
    </>
  );
};

export default Login;
