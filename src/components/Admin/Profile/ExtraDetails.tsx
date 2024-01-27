import { Box, Center, Paper, Text, useMantineTheme } from '@mantine/core';

import { IconBackpack, IconSchool } from '@tabler/icons-react';

const ExtraDetails = ({ school, department }: { school: string; department: string }) => {
  const theme = useMantineTheme();
  return (
    <>
      <Paper py={20} w="100%">
        <Box my={30} px={30}>
          <Center inline>
            <IconBackpack color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Department
            </Text>
          </Center>
          <Text>{department}</Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconSchool color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              School
            </Text>
          </Center>
          <Text>{school}</Text>
        </Box>
      </Paper>
    </>
  );
};

export default ExtraDetails;
