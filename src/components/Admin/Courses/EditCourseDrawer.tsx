import { Box, Button, Drawer, Group, NumberInput, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { useEffect } from 'react';
import { IDrawerProps } from '@/interfaces/helperInterface';
import { ApiCoursesResponse, editCourseMutation } from '@/services/course.service';
import { ICourseDetails } from '@/interfaces/courses.interface';
import { handleErrors } from '@/utils/handleErrors';

type EditDrawerProps = IDrawerProps & {
  row: ICourseDetails | undefined;
  clear: () => void;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | ApiCoursesResponse, Error>>;
};
const EditCourseDrawer = ({ opened, close, row, refetch, clear }: EditDrawerProps) => {
  const schema = z.object({
    name: z.string().min(1, 'School Name is required'),
    units: z.number().min(1, 'Units is required'),
    code: z
      .string()
      .min(2, 'Course Code must be 2 character')
      .max(2, 'Course Code must be 2 character')
      .refine((value) => /^\d{2}$/.test(value), {
        message: 'Course Code must be 2 numeric characters',
      }),
  });

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      units: 0,
    },

    validate: zodResolver(schema),
  });
  useEffect(() => {
    form.setValues({
      name: row?.name,
      units: row?.units,
      code: row?.code.substring(5),
    });
  }, [row]);

  const { mutate, isPending } = useMutation({
    mutationFn: editCourseMutation,
    onSuccess: () => {
      notifications.show({
        title: 'Course updated Successfull',
        message: 'A  course has been updated successfully',
        color: 'green',
      });
      refetch();
      close();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const editCourse = (values: Record<string, any>) => {
    const formData = { name: values.name, code: values.code, units: values.units };
    const payload = { formData, id: row?._id || '' };
    mutate(payload);
  };
  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => {
          form.reset();
          clear();
          close();
        }}
        title="Edit Course"
        position="right"
      >
        <form onSubmit={form.onSubmit((values) => editCourse(values))}>
          <Box h="76dvh">
            <TextInput
              label="Course Name"
              placeholder="Course Name"
              size="md"
              defaultValue={row?.name}
              my={20}
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Course Code"
              placeholder="Course Code"
              size="md"
              maxLength={2}
              my={20}
              defaultValue={row?.code}
              {...form.getInputProps('code')}
            />
            <NumberInput
              label="Units"
              placeholder="Units"
              size="md"
              allowNegative={false}
              allowDecimal={false}
              allowLeadingZeros={false}
              my={20}
              {...form.getInputProps('units')}
            />
          </Box>
          <Group justify="end" pos="sticky" bottom={0} bg="white" p={10} style={{ zIndex: '100' }}>
            <Button type="submit" loading={isPending}>
              Edit Course
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  );
};

export default EditCourseDrawer;
