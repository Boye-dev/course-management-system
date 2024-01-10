import { Drawer, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IDrawerProps } from '@/interfaces/helperInterface';

const AddNewStudentDrawer = ({ opened, close }: IDrawerProps) => {
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
      <Drawer opened={opened} onClose={close} title="Add New Student" position="right">
        <form onSubmit={form.onSubmit(() => {})}>
          <TextInput label="Student Name" placeholder="Student Name" size="md" my={20} />
          <TextInput label="Student Code" placeholder="Student Code" size="md" my={20} />
          <TextInput label="Email" placeholder="First Name" size="md" my={20} />
        </form>
      </Drawer>
    </>
  );
};

export default AddNewStudentDrawer;
