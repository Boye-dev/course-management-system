import { Drawer, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IDrawerProps } from '@/interfaces/helperInterface';

const EditDetailsDrawer = ({ opened, close }: IDrawerProps) => {
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
      <Drawer opened={opened} onClose={close} title="Edit Profile" position="right">
        <form onSubmit={form.onSubmit(() => {})}>
          <TextInput label="First Name" placeholder="First Name" size="md" my={20} />
          <TextInput label="Last Name" placeholder="First Name" size="md" my={20} />
          <TextInput label="Email" placeholder="First Name" size="md" my={20} />
        </form>
      </Drawer>
    </>
  );
};

export default EditDetailsDrawer;
