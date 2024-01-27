import { Box, Button, Flex, Paper, Stack, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import EditDetailsDrawer from '@/components/Admin/Profile/EditDetailsDrawer';
import PasswordUpdateDrawer from '@/components/Admin/Profile/PasswordUpdateDrawer';
import UserDetails from '@/components/Admin/Profile/UserDetails';
import { getPersonalInfo } from '@/services/admin.services';
import { getDecodedJwt } from '@/api/Auth';
import BabcockLoader from '@/shared/components/BabcockLoader';
import ExtraDetails from '@/components/Admin/Profile/ExtraDetails';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';

const PersonalInformation = () => {
  const theme = useMantineTheme();
  const decodedUser = getDecodedJwt();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [passwordChange, { open: openPasswordChange, close: closePasswordChange }] =
    useDisclosure(false);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['personal-info'],
    queryFn: () => getPersonalInfo(decodedUser.id),
  });

  return isFetching ? (
    <BabcockLoader />
  ) : data ? (
    <>
      <Flex gap="xl" wrap="wrap" justify="center" w="100%">
        <Paper
          h={250}
          py={20}
          pos="sticky"
          top={70}
          w={{ xs: '100%', md: 400 }}
          style={{ zIndex: 50 }}
        >
          <Stack align="center">
            <Text
              p={10}
              mx={30}
              my={10}
              w="80%"
              bg={theme.colors.brandSecondary[8]}
              style={{ borderRadius: '5px' }}
              c={theme.white}
              fw={700}
            >
              Profile
            </Text>

            <Button size="md" w="80%" onClick={openEdit}>
              Edit Profile
            </Button>
            <Button w="80%" size="md" onClick={openPasswordChange}>
              Change Password
            </Button>
          </Stack>
        </Paper>

        <Box w={{ xs: '100%', md: 400 }}>
          <UserDetails data={data} />
          <Box mt={10}>
            <ExtraDetails
              school={convertAllLowercaseToSentenceCase(data.department?.school.name || '')}
              department={convertAllLowercaseToSentenceCase(data.department?.name || '')}
            />
          </Box>
        </Box>
      </Flex>
      <EditDetailsDrawer opened={edit} close={closeEdit} data={data} refetch={refetch} />
      <PasswordUpdateDrawer opened={passwordChange} close={closePasswordChange} />
    </>
  ) : (
    <Box>
      <BabcockLoader />
    </Box>
  );
};

export default PersonalInformation;
