import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Flex,
  Image,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
  IconPower,
} from '@tabler/icons-react';
import SidebarItem from '../components/SidebarItem';
import logo from '../../assets/images/babcock-logo.png';
import { studentSideBarItems } from '@/constants/sidebarItems';

const Layout = () => {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const [collapsed, { toggle: collapseSidebar }] = useDisclosure();

  const renderSideItems = () =>
    studentSideBarItems.map((item, index) => (
      <SidebarItem
        key={index}
        icon={item.icon}
        text={item.text}
        path={item.path}
        collapsed={collapsed}
      />
    ));

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: collapsed ? 80 : 300,
          breakpoint: 'md',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header
          w={{ xs: '100%', md: collapsed ? 'calc(100% - 80px)' : 'calc(100% - 300px)' }}
          left={{ xs: 0, sm: 0, md: collapsed ? 80 : 300 }}
        >
          <Flex h="100%" w="100%">
            <Flex justify="center" align="center" pl={10}>
              <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="md" />
            </Flex>
            <Flex w="100%" h="100%" justify="flex-end" align="center" display="flex">
              <Avatar radius="xl" alt="Profile Image" mx={10} />
              <Text mx={10}>Oyelola Adeboye</Text>

              <Tooltip label="Logout">
                <Avatar color={theme.colors.red[1]} mx={10} style={{ cursor: 'pointer' }}>
                  <IconPower color={theme.colors.red[9]} />
                </Avatar>
              </Tooltip>
            </Flex>
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar bg={theme.primaryColor} top={{ xs: 60, sm: 60, md: 0 }} h="100%" p={0}>
          <Stack align="center" display="flex" style={{ position: 'relative' }}>
            {collapsed || <Image src={logo} alt="logo" w={100} h={100} my={30} />}
            <Flex
              align="center"
              display="flex"
              style={{
                position: 'absolute',
                right: 10,
                top: 20,
                cursor: 'pointer',
              }}
              onClick={() => collapseSidebar()}
            >
              {collapsed ? (
                <IconLayoutSidebarRightCollapse color="white" />
              ) : (
                <IconLayoutSidebarLeftCollapse color="white" />
              )}
            </Flex>
            <Box mt={collapsed ? 60 : 0}>{renderSideItems()}</Box>
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main bg={theme.colors.gray[0]} mih="100vh">
          <Box px={50}>
            <Outlet />
          </Box>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default Layout;
