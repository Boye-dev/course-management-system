import { useEffect, useState } from 'react';
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
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import logo from '@/assets/images/babcock-logo.png';
import { IOtpInterface, LoginInterface } from '@/interfaces/auth.interface';
import { login, resendOtp, verifyOtp } from '@/services/auth.service';
import Auth from '@/api/Auth';
import { Roles } from '@/constants/roles';
import { handleErrors } from '@/utils/handleErrors';
import useAuthentication from '@/hooks/useAuthentication';
import BabcockLoader from '@/shared/components/BabcockLoader';

const Login = () => {
  const { loading, authenticated } = useAuthentication();

  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [interval, setCountdown] = useState<boolean>(false);
  const schema = z.object({
    username: z.string().email({ message: 'Invalid Email Address' }),
    password: z.string().min(6, 'Password must be greater than 6'),
  });
  const form = useForm<LoginInterface>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(schema),
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
      setCountdown(!interval);
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const { mutate: resendOtpMutation, isPending: isPendingResend } = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      notifications.show({
        title: 'Otp Resent successful',
        message: 'Please enter your otp',
        color: 'green',
      });
      setCountdown(!interval);
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
        navigate('/admin/personal-info');
      }
      if (data?.data.role === Roles.TEACHER) {
        navigate('/teacher/personal-info');
      }
      if (data?.data.role === Roles.STUDENT) {
        navigate('/student/personal-info');
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
    if (Auth.getDecodedJwt().role === Roles.TEACHER) {
      return '/teacher/personal-info';
    }
    if (Auth.getDecodedJwt().role === Roles.STUDENT) {
      return '/student/personal-info';
    }
    return '';
  };

  const [timeSpan, setTimeSpan] = useState<number>(0);
  useEffect(() => {
    let timerInterval: any;
    if (showOtp) {
      const startTime = Date.now();
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 1);

      const calculateTimeSpan = () => {
        const remainingTime = endTime.getTime() - Date.now();
        setTimeSpan(() => Math.max(0, remainingTime));
      };

      calculateTimeSpan();

      timerInterval = setInterval(() => {
        calculateTimeSpan();
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [interval]);
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `in ${formattedMinutes}:${formattedSeconds}`;
  };

  return loading ? (
    <BabcockLoader />
  ) : authenticated ? (
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
                  <Flex justify="center" mt={10} align="center">
                    <Text fz={12}>Otp not received? </Text>
                    <Button
                      fz={12}
                      h={20}
                      disabled={timeSpan !== 0}
                      loading={isPendingResend}
                      ml={10}
                      onClick={() => {
                        if (timeSpan === 0) {
                          resendOtpMutation(data?.data);
                        }
                      }}
                    >
                      Resend Otp {timeSpan !== 0 && formatTime(timeSpan)}
                    </Button>
                  </Flex>
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
                onClick={() => navigate('/forgot-password')}
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
