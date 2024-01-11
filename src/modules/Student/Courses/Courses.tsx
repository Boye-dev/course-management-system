import { Box, Flex, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { IconCertificate } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>My Courses</Title>
        </Flex>
        <Flex justify="space-between" align="center" wrap="wrap" gap={20}>
          <Paper
            w={{ xs: '100%', md: 300 }}
            h={100}
            shadow="xs"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('1/my-courses')}
          >
            <Flex align="center" justify="center" h="100%">
              <IconCertificate color={theme.colors.brandSecondary?.[9]} size={30} />
              <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                Year 1
              </Text>
            </Flex>
          </Paper>
          <Paper w={{ xs: '100%', md: 300 }} h={100} shadow="xs" style={{ cursor: 'pointer' }}>
            <Flex align="center" justify="center" h="100%">
              <IconCertificate color={theme.colors.brandSecondary?.[9]} size={30} />
              <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                Year 2
              </Text>
            </Flex>
          </Paper>
          <Paper w={{ xs: '100%', md: 300 }} h={100} shadow="xs" style={{ cursor: 'pointer' }}>
            <Flex align="center" justify="center" h="100%">
              <IconCertificate color={theme.colors.brandSecondary?.[9]} size={30} />
              <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                Year 3
              </Text>
            </Flex>
          </Paper>
          <Paper w={{ xs: '100%', md: 300 }} h={100} shadow="xs" style={{ cursor: 'pointer' }}>
            <Flex align="center" justify="center" h="100%">
              <IconCertificate color={theme.colors.brandSecondary?.[9]} size={30} />
              <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                Year 4
              </Text>
            </Flex>
          </Paper>
        </Flex>
      </Box>
    </>
  );
};

export default Courses;
