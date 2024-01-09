import { Drawer, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IDrawerProps } from '@/interfaces/helperInterface';

type EditDrawerProps = IDrawerProps & { id: string };
const EditSchoolDrawer = ({ opened, close, id }: EditDrawerProps) => {
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
      <Drawer opened={opened} onClose={close} title="Edit School" position="right">
        <form onSubmit={form.onSubmit(() => {})}>
          <TextInput label="School Name" placeholder="School Name" size="md" my={20} />
          <TextInput label="School Code" placeholder="School Code" size="md" my={20} />
          <TextInput label="Email" placeholder="First Name" value={id} size="md" my={20} />
        </form>
      </Drawer>
    </>
  );
};

export default EditSchoolDrawer;
