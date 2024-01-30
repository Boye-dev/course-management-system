import { Box, Flex, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { IconCertificate } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getSettings } from '@/services/admin.services';
import BabcockLoader from '@/shared/components/BabcockLoader';

const Years = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const { data: settings, isFetching: isFetchingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
  });

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}> Years</Title>
        </Flex>
        {isFetchingSettings ? (
          <BabcockLoader />
        ) : (
          <Flex justify="space-around" align="center" wrap="wrap" gap={20}>
            {Object.keys(settings?.registrationAllowed || {}).map((year, index) => (
              <Paper
                key={index}
                w={{ xs: '100%', md: 300 }}
                h={100}
                shadow="xs"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`${year}/my-students`)}
              >
                <Flex align="center" justify="center" h="100%">
                  <IconCertificate color={theme.colors.brandSecondary?.[9]} size={30} />
                  <Text c={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
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

export default Years;
