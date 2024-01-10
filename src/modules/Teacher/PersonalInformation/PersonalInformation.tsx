import { Box, Button, Flex, Paper, Stack, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import EditDetailsDrawer from '@/components/Admin/Profile/EditDetailsDrawer';
import PasswordUpdateDrawer from '@/components/Admin/Profile/PasswordUpdateDrawer';
import UserDetails from '@/components/Admin/Profile/UserDetails';
import ExtraDetails from '@/components/Admin/Profile/ExtraDetails';

const PersonalInformation = () => {
  const theme = useMantineTheme();
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [passwordChange, { open: openPasswordChange, close: closePasswordChange }] =
    useDisclosure(false);
  return (
    <>
      <Flex gap="xl" wrap="wrap" justify="center" w="100%">
        <Paper
          h={250}
          py={20}
          pos="sticky"
          top={70}
          w={{ xs: '100%', md: 400 }}
          style={{ zIndex: 200 }}
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
          <UserDetails />
          <Box mt={10}>
            <ExtraDetails />
          </Box>
        </Box>
      </Flex>
      <EditDetailsDrawer opened={edit} close={closeEdit} />
      <PasswordUpdateDrawer opened={passwordChange} close={closePasswordChange} />
    </>
  );
};

export default PersonalInformation;
