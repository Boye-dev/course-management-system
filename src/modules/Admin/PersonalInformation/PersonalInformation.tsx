import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { DateTimePicker, YearPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons-react';
import { randomId, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import EditDetailsDrawer from '@/components/Admin/Profile/EditDetailsDrawer';
import PasswordUpdateDrawer from '@/components/Admin/Profile/PasswordUpdateDrawer';
import UserDetails from '@/components/Admin/Profile/UserDetails';
import { getPersonalInfo, getSettings, updateSettings } from '@/services/admin.services';
import { getDecodedJwt } from '@/api/Auth';
import BabcockLoader from '@/shared/components/BabcockLoader';
import { handleErrors } from '@/utils/handleErrors';

const PersonalInformation = () => {
  const theme = useMantineTheme();
  const decodedUser = getDecodedJwt();
  const [opened, { open, close }] = useDisclosure(false);
  const [edit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [passwordChange, { open: openPasswordChange, close: closePasswordChange }] =
    useDisclosure(false);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['personal-info'],
    queryFn: () => getPersonalInfo(decodedUser.id),
  });
  const { data: settings, isFetching: isFetchingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
    enabled: opened,
  });

  const form = useForm<{
    years: {
      key: string;
      year: Date | string;
      closed: Date | string;
      opened: Date | string;
    }[];
  }>({
    initialValues: {
      years: [
        {
          opened: '',
          closed: '',
          year: '',
          key: randomId(),
        },
      ],
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      notifications.show({
        title: 'Registration Updated',
        message: 'Registration Updated',
        color: 'green',
      });
      form.reset();
      refetch();
      close();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const registerYear = (values: any) => {
    const registrationAllowed: Record<string, Record<string, string>> = {};
    Object.entries(settings?.registrationAllowed || {}).forEach(([key, value]) => {
      registrationAllowed[key] = value;
      return registrationAllowed;
    });

    values.years.map((item: any) => {
      if (item.year !== '' && item.closed !== '' && item.opened !== '') {
        registrationAllowed[
          `${new Date(item.year).getFullYear()}-${new Date(item.year).getFullYear() + 1}`
        ] = {
          opened: dayjs(item.opened.toString()).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          closed: dayjs(item.closed.toString()).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      }

      return registrationAllowed;
    });

    mutate({ registrationAllowed });
  };
  const fields = form.values.years.map((item, index) => (
    <Group key={item.key} mt="xs">
      <YearPickerInput
        label="Select A Year"
        {...form.getInputProps(`years.${index}.year`)}
        mt={20}
      />
      <Flex gap={10} w="100%">
        <DateTimePicker
          w="50%"
          label="Opened"
          withSeconds
          valueFormat="DD MMM YYYY hh:mm A"
          {...form.getInputProps(`years.${index}.opened`)}
        />
        <DateTimePicker
          w="50%"
          label="Closed"
          withSeconds
          valueFormat="DD MMM YYYY hh:mm A"
          {...form.getInputProps(`years.${index}.closed`)}
        />
      </Flex>

      <ActionIcon color="red" onClick={() => form.removeListItem('years', index)}>
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));
  return isFetching ? (
    <BabcockLoader />
  ) : data ? (
    <>
      <Flex gap="xl" wrap="wrap" justify="center" w="100%">
        <Paper
          h="fit-content"
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
            <Button w="80%" size="md" color="red" onClick={open}>
              Registration Settings
            </Button>
          </Stack>
        </Paper>

        <Box w={{ xs: '100%', md: 400 }}>
          <UserDetails data={data} />
        </Box>
      </Flex>
      <EditDetailsDrawer opened={edit} close={closeEdit} data={data} refetch={refetch} />
      <PasswordUpdateDrawer opened={passwordChange} close={closePasswordChange} />
      <Modal opened={opened} onClose={close} title="Registration Settings" centered>
        {isFetchingSettings ? (
          <Box mah={500}>
            <BabcockLoader h={400} />
          </Box>
        ) : (
          <Box mah={500}>
            {Object.entries(settings?.registrationAllowed || {}).map(([key, value]) => (
              <>
                <Text mt={20} fw={500} color={theme.colors.brand[9]}>
                  {key}
                </Text>
                <Flex gap={10} w="100%">
                  <DateTimePicker
                    w="50%"
                    defaultValue={new Date(value.opened)}
                    label="Opened"
                    withSeconds
                    valueFormat="DD MMM YYYY hh:mm A"
                  />
                  <DateTimePicker
                    w="50%"
                    defaultValue={new Date(value.closed)}
                    label="Closed"
                    withSeconds
                    valueFormat="DD MMM YYYY hh:mm A"
                  />
                </Flex>
              </>
            ))}

            <form onSubmit={form.onSubmit((values) => registerYear(values))}>
              {fields}

              <Button
                mt={20}
                color={theme.colors.brandSecondary[8]}
                onClick={() =>
                  form.insertListItem('years', {
                    opened: '',
                    closed: '',
                    year: '',
                    key: randomId(),
                  })
                }
              >
                Add New
              </Button>

              <Button fullWidth mt={20} type="submit" loading={isPending}>
                Update
              </Button>
            </form>
          </Box>
        )}
      </Modal>
    </>
  ) : (
    <Box>
      <BabcockLoader />
    </Box>
  );
};

export default PersonalInformation;
