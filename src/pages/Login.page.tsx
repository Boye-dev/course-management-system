import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Image, Paper, PasswordInput, Text, TextInput } from '@mantine/core';
import logo from '../assets/images/babcock-logo.png';

const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      <Flex w="100%" h="100vh" justify="center" align="center">
        <Paper w={300} shadow="xs" p={20}>
          <Flex justify="center">
            <Image src={logo} w={80} h={80} />
          </Flex>
          <TextInput label="Email" placeholder="Email" mt={20} />
          <PasswordInput label="Password" placeholder="Password" mt={20} />
          <Button fullWidth mt={30}>
            Login
          </Button>
        </Paper>
      </Flex>

      <Box pos="fixed" top="0" right="0">
        <Paper w={300} shadow="xs" p={20} bg="red">
          <Text>Demo</Text>
          <Button fullWidth onClick={() => navigate('/admin')}>
            Admin
          </Button>
          <Button fullWidth my={20} onClick={() => navigate('/student')}>
            Student{' '}
          </Button>
          <Button fullWidth onClick={() => navigate('/teacher')}>
            Teacher
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
