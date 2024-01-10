import { Box, Button, Flex, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Title my={30}>My Courses</Title>
          <Button>Enroll In A Course</Button>
        </Flex>
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={20}
          onClick={() => navigate('1/my-students')}
        >
          <Paper w={300} mih={100} shadow="xs" style={{ cursor: 'pointer' }} p={10}>
            <Flex align="center" justify="flex-start" h="100%">
              <IconBook color={theme.colors.brandSecondary?.[9]} size={30} />
              <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                COSC 200
              </Text>
            </Flex>
            <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
              Computer Tech
            </Text>
            <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
              3 Units
            </Text>
          </Paper>
          <Paper w={300} mih={100} shadow="xs" style={{ cursor: 'pointer' }} p={10}>
            <Flex align="center" justify="flex-start" h="100%">
              <IconBook color={theme.colors.brandSecondary?.[9]} size={30} />
              <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                COSC 200
              </Text>
            </Flex>
            <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
              Computer Tech
            </Text>
            <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
              3 Units
            </Text>
          </Paper>{' '}
          <Paper w={300} mih={100} shadow="xs" style={{ cursor: 'pointer' }} p={10}>
            <Flex align="center" justify="flex-start" h="100%">
              <IconBook color={theme.colors.brandSecondary?.[9]} size={30} />
              <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                COSC 200
              </Text>
            </Flex>
            <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
              Computer Tech
            </Text>
            <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
              3 Units
            </Text>
          </Paper>{' '}
          <Paper w={300} mih={100} shadow="xs" style={{ cursor: 'pointer' }} p={10}>
            <Flex align="center" justify="flex-start" h="100%">
              <IconBook color={theme.colors.brandSecondary?.[9]} size={30} />
              <Text color={theme.colors.brandSecondary?.[9]} fz={25} ml={10} fw={600}>
                COSC 200
              </Text>
            </Flex>
            <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
              Computer Tech
            </Text>
            <Text color={theme.colors.brandSecondary?.[9]} fz={12} fw={400}>
              3 Units
            </Text>
          </Paper>
        </Flex>
      </Box>
    </>
  );
};

export default Courses;
