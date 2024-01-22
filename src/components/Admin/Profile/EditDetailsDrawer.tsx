import { useState } from 'react';
import {
  Avatar,
  Button,
  Drawer,
  FileButton,
  Group,
  Select,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import dayjs from 'dayjs';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import { IDrawerProps } from '@/interfaces/helperInterface';
import { GenderEnum, IUser, RelationshipStatusEnum } from '@/interfaces/auth.interface';
import { updatePersonalInfo } from '@/services/admin.services';
import { getDecodedJwt } from '@/api/Auth';
import { handleErrors } from '@/utils/handleErrors';
import useStateAndLGA from '@/hooks/useStateAndLga';

const EditDetailsDrawer = ({
  opened,
  close,
  data,
  refetch,
}: IDrawerProps & {
  data?: IUser;
  refetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | IUser, Error>>;
}) => {
  const decodedUser = getDecodedJwt();

  const [file, setFile] = useState<File | null>(null);
  const schema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    middleName: z.string().min(1, { message: 'Middle name is required' }),
    gender: z.string().min(1, { message: 'Gender is required' }),
    relationshipStatus: z.string().min(1, { message: 'Marital Status is required' }),
    nationality: z.string().min(1, { message: 'Nationality is required' }),

    state: z.string().min(1, { message: 'State is required' }),
    lga: z.string().min(1, { message: 'LGA is required' }),

    address: z.string().min(1, { message: 'Address is required' }),

    dateOfBirth: z.date(),
    phoneNumber: z
      .string()
      .min(11, { message: 'Phone Number Must Be 11 Digits' })
      .max(11, { message: 'Phone Number Must Be 11 Digits' }),
  });
  const form = useForm({
    initialValues: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      middleName: data?.middleName,
      gender: data?.gender,
      phoneNumber: data?.phoneNumber,
      dateOfBirth: data?.dateOfBirth && new Date(data?.dateOfBirth),
      relationshipStatus: data?.relationshipStatus,
      nationality: data?.nationality,
      state: data?.state,
      lga: data?.lga,
      address: data?.address,
    },

    validate: zodResolver(schema),
  });
  const { states } = useStateAndLGA(form.getTransformedValues().state || '');
  const { LGAs } = useStateAndLGA(form.getTransformedValues().state || '');
  const { mutate, isPending } = useMutation({
    mutationFn: updatePersonalInfo,
    onSuccess: () => {
      notifications.show({
        title: 'Profile Update Successfull',
        message: 'Your profile has been updated successfull',
        color: 'green',
      });
      refetch && refetch();
      close();
    },
    onError: (error) => {
      handleErrors(error, 'Error Updating Profile');
    },
  });

  const editDetails = (values: Record<string, any>) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'dateOfBirth') {
        const date = dayjs(value).format('YYYY-MM-DD');
        formData.append(key, date);
      } else {
        formData.append(key, value);
      }
    });
    if (file) {
      formData.append('profilePicture', file);
    }
    const payload = { formData, id: decodedUser.id };
    mutate(payload);
  };
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Edit Profile" position="right">
        <form onSubmit={form.onSubmit((values) => editDetails(values))}>
          <Text fw={500}>Change Profile Picture</Text>
          <FileButton onChange={setFile} accept="image/png,image/jpeg" multiple={false}>
            {(props) => (
              <Avatar
                my={20}
                style={{ cursor: 'pointer' }}
                {...props}
                size="lg"
                src={file ? URL.createObjectURL(file) : data?.profilePicture}
              />
            )}
          </FileButton>

          <TextInput
            label="First Name"
            placeholder="First Name"
            size="md"
            my={20}
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Last Name"
            placeholder="Last Name"
            size="md"
            my={20}
            {...form.getInputProps('lastName')}
          />
          <TextInput
            label="Middle Name"
            placeholder="Middle Name"
            size="md"
            my={20}
            {...form.getInputProps('middleName')}
          />
          <TextInput
            label="Phone Number"
            placeholder="Phone Number"
            size="md"
            my={20}
            {...form.getInputProps('phoneNumber')}
          />
          <Select
            data={Object.values(GenderEnum)}
            label="Gender"
            placeholder="Gender"
            size="md"
            my={20}
            {...form.getInputProps('gender')}
          />
          <DateInput
            label="Dob"
            placeholder="Date Of Birth"
            size="md"
            valueFormat="YYYY-MM-DD"
            my={20}
            {...form.getInputProps('dateOfBirth')}
          />
          <Select
            data={Object.values(RelationshipStatusEnum)}
            label="Marital Status"
            placeholder="Marital Status"
            size="md"
            my={20}
            {...form.getInputProps('relationshipStatus')}
          />
          <TextInput
            label="Nationality"
            placeholder="Nationality"
            size="md"
            my={20}
            {...form.getInputProps('nationality')}
          />
          <Select
            label="State"
            placeholder="State"
            size="md"
            my={20}
            data={states}
            {...form.getInputProps('state')}
          />
          <Select
            label="Lga"
            placeholder="Lga"
            size="md"
            data={LGAs}
            my={20}
            {...form.getInputProps('lga')}
          />
          <Textarea
            label="Address"
            placeholder="Address"
            size="md"
            my={20}
            {...form.getInputProps('address')}
          />
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10} style={{ zIndex: '100' }}>
            <Button type="submit" loading={isPending}>
              Edit Details
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default EditDetailsDrawer;
