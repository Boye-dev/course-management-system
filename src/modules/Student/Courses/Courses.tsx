import { Box, Flex, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { IconCertificate } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getDecodedJwt } from '@/api/Auth';
import { getPersonalInfo, getSettings } from '@/services/admin.services';
import BabcockLoader from '@/shared/components/BabcockLoader';
import { RegistrationStatusEnum } from '@/interfaces/auth.interface';

const Courses = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const decodedUser = getDecodedJwt();
  const { data, isFetching } = useQuery({
    queryKey: ['personal-info-setting'],
    queryFn: () => getPersonalInfo(decodedUser.id),
  });
  const { data: settings, isFetching: isFetchingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
  });

  const canMoveToNext = (year: string, status: string[]) => {
    if (settings?.registrationAllowed) {
      const canRegister = Object.keys(settings?.registrationAllowed).find((reg) => reg === year);
      if (canRegister) {
        const endDate = new Date(settings?.registrationAllowed[canRegister].closed);
        const currentDate = new Date();
        if (currentDate > endDate && status.includes(RegistrationStatusEnum.Not_Registered)) {
          return notifications.show({
            message: 'Registration has closed for this year',
            title: 'Registration Closed',
            color: 'red',
          });
        }
        if (status.includes(RegistrationStatusEnum.Registered)) {
          navigate(`${year}/my-courses`);
        }
        if (status.includes(RegistrationStatusEnum.Not_Registered)) {
          navigate(`${year}/add-courses`);
        }
      } else {
        return notifications.show({
          message: 'Registration has not been opened for this year',
          title: 'Registration Not Open',
          color: 'red',
        });
      }
    }
    return undefined;
  };

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>My Courses</Title>
        </Flex>
        {isFetching || isFetchingSettings ? (
          <BabcockLoader />
        ) : (
          <Flex justify="space-around" align="center" wrap="wrap" gap={20}>
            {Object.entries(data?.registrationStatus || {}).map(([year, status], index) => (
              <Paper
                key={index}
                w={{ xs: '100%', md: 300 }}
                h={100}
                shadow="xs"
                style={{ cursor: 'pointer' }}
                onClick={() => canMoveToNext(year, status)}
              >
                <Flex align="center" justify="center" h="100%">
                  <IconCertificate color={theme.colors.brandSecondary?.[9]} size={30} />
                  <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                    {year}
                  </Text>
                </Flex>
              </Paper>
            ))}
          </Flex>
        )}
      </Box>
    </>
  );
};

export default Courses;
