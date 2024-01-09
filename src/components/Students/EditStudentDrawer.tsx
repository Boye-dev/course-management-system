import { Drawer, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IDrawerProps } from '@/interfaces/helperInterface';

type EditDrawerProps = IDrawerProps & { id: string };
const EditStudentDrawer = ({ opened, close, id }: EditDrawerProps) => {
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
      <Drawer opened={opened} onClose={close} title="Edit Student" position="right">
        <form onSubmit={form.onSubmit(() => {})}>
          <TextInput label="Student Name" placeholder="Student Name" size="md" my={20} />
          <TextInput label="Student Code" placeholder="Student Code" size="md" my={20} />
          <TextInput label="Email" placeholder="First Name" value={id} size="md" my={20} />
        </form>
      </Drawer>
    </>
  );
};

export default EditStudentDrawer;
