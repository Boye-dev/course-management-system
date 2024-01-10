import { Drawer, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IDrawerProps } from '@/interfaces/helperInterface';

type EditDrawerProps = IDrawerProps & { id: string };
const EditCourseDrawer = ({ opened, close, id }: EditDrawerProps) => {
  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Edit Course" position="right">
        <form onSubmit={form.onSubmit(() => {})}>
          <TextInput label="Course Name" placeholder="Course Name" size="md" my={20} />
          <TextInput label="Course Code" placeholder="Course Code" size="md" my={20} />
          <TextInput label="Email" placeholder="First Name" size="md" value={id} my={20} />
        </form>
      </Drawer>
    </>
  );
};

export default EditCourseDrawer;
