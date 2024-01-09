import { Drawer, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IDrawerProps } from '@/interfaces/helperInterface';

const AddNewSchoolDrawer = ({ opened, close }: IDrawerProps) => {
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
      <Drawer opened={opened} onClose={close} title="Add New School" position="right">
        <form onSubmit={form.onSubmit(() => {})}>
          <TextInput label="School Name" placeholder="School Name" size="md" my={20} />
          <TextInput label="School Code" placeholder="School Code" size="md" my={20} />
          <TextInput label="Email" placeholder="First Name" size="md" my={20} />
        </form>
      </Drawer>
    </>
  );
};

export default AddNewSchoolDrawer;
