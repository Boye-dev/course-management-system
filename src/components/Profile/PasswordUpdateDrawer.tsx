import { Drawer, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IDrawerProps } from '@/interfaces/helperInterface';

const PasswordUpdateDrawer = ({ opened, close }: IDrawerProps) => {
  const form = useForm({
    initialValues: {
      oldPassword: '',
    },
  });
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Update Password" position="right">
        <form onSubmit={form.onSubmit(() => {})}>
          <TextInput label="Old Password" placeholder="Old Password" size="md" my={20} />
          <TextInput label="New Password" placeholder="New Password" size="md" my={20} />
        </form>
      </Drawer>
    </>
  );
};

export default PasswordUpdateDrawer;
