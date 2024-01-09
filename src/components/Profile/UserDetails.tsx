import { Avatar, Box, Center, Divider, Paper, Stack, Text, useMantineTheme } from '@mantine/core';

import {
  IconFlag,
  IconFlag2,
  IconHeart,
  IconMail,
  IconMan,
  IconPennant,
  IconUser,
} from '@tabler/icons-react';

const UserDetails = () => {
  const theme = useMantineTheme();
  return (
    <>
      <Paper py={20} w="100%">
        <Stack align="center" my={10}>
          <Avatar size="xl" />
        </Stack>

        <Box my={30} px={30}>
          <Center inline>
            <IconUser color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Full Name
            </Text>
          </Center>
          <Text>Oyelola Adeboye</Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconMail color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Email
            </Text>
          </Center>
          <Text>oyelola@gmail.com</Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconMan color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Gender
            </Text>
          </Center>
          <Text>Gender</Text>
        </Box>
        <Box my={30} px={30}>
          <Center inline>
            <IconHeart color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Marital Status
            </Text>
          </Center>
          <Text>Marital Status</Text>
        </Box>
        <Divider />

        <Box my={30} px={30}>
          <Center inline>
            <IconFlag color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Nationality
            </Text>
          </Center>
          <Text>Nigeria</Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconPennant color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              State
            </Text>
          </Center>
          <Text>Oyo</Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconFlag2 color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              LGA
            </Text>
          </Center>
          <Text>Ogbomosho South</Text>
        </Box>
      </Paper>
    </>
  );
};

export default UserDetails;
