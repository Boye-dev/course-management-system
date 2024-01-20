import { Avatar, Box, Center, Divider, Paper, Stack, Text, useMantineTheme } from '@mantine/core';
import dayjs from 'dayjs';
import {
  IconBabyBottle,
  IconFlag,
  IconFlag2,
  IconHeart,
  IconMail,
  IconMan,
  IconPennant,
  IconUser,
} from '@tabler/icons-react';
import { IUser } from '@/interfaces/auth.interface';

const UserDetails = ({ data }: { data?: IUser }) => {
  const theme = useMantineTheme();
  return (
    <>
      <Paper py={20} w="100%">
        <Stack align="center" my={10}>
          <Avatar size="xl" src={data?.profilePicture} />
        </Stack>

        <Box my={30} px={30}>
          <Center inline>
            <IconUser color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Full Name
            </Text>
          </Center>
          <Text>
            {data?.lastName} {data?.middleName} {data?.firstName}
          </Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconMail color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Email
            </Text>
          </Center>
          <Text>{data?.email}</Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconMan color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Gender
            </Text>
          </Center>
          <Text>{data?.gender}</Text>
        </Box>
        <Box my={30} px={30}>
          <Center inline>
            <IconBabyBottle color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              DOB
            </Text>
          </Center>
          <Text>{dayjs(data?.dateOfBirth).format('MMM DD, YYYY')}</Text>
        </Box>
        <Box my={30} px={30}>
          <Center inline>
            <IconHeart color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Marital Status
            </Text>
          </Center>
          <Text>{data?.relationshipStatus}</Text>
        </Box>
        <Divider />

        <Box my={30} px={30}>
          <Center inline>
            <IconFlag color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Nationality
            </Text>
          </Center>
          <Text>{data?.nationality}</Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconPennant color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              State
            </Text>
          </Center>
          <Text>{data?.state}</Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconFlag2 color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              LGA
            </Text>
          </Center>
          <Text>{data?.lga}</Text>
        </Box>

        <Box my={30} px={30}>
          <Center inline>
            <IconFlag2 color={theme.colors.brandSecondary[9]} />
            <Text c={theme.colors.brandSecondary[9]} ml={6}>
              Address
            </Text>
          </Center>
          <Text>{data?.address}</Text>
        </Box>
      </Paper>
    </>
  );
};

export default UserDetails;
