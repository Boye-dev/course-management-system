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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
  IconPower,
} from '@tabler/icons-react';
import SidebarItem from '../components/SidebarItem';
import logo from '../../assets/images/babcock-logo.png';
import {
  adminSidebarItems,
  studentSideBarItems,
  teacherSideBarItems,
} from '@/constants/sidebarItems';
import Auth from '@/api/Auth';

const Layout = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const [collapsed, { toggle: collapseSidebar }] = useDisclosure();
  const location = useLocation();
  const sidebarItems = location.pathname.startsWith('/admin')
    ? adminSidebarItems
    : location.pathname.startsWith('/student')
      ? studentSideBarItems
      : teacherSideBarItems;
  const renderSideItems = () =>
    sidebarItems.map((item, index) => (
      <SidebarItem
        onClick={() => {
          navigate(item.path);
          toggle();
        }}
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
          left={{ xs: 0, md: collapsed ? 80 : 300 }}
        >
          <Flex h="100%" w="100%">
            <Flex justify="center" align="center" pl={10}>
              <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="md" />
            </Flex>
            <Flex w="100%" h="100%" justify="flex-end" align="center" display="flex">
              <Avatar radius="xl" alt="Profile Image" mx={10} />
              <Text mx={10}>Oyelola Adeboye</Text>

              <Tooltip label="Logout">
                <Avatar
                  color={theme.colors.red[1]}
                  mx={10}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    Auth.removeToken();
                    navigate('/');
                  }}
                >
                  <IconPower color={theme.colors.red[9]} />
                </Avatar>
              </Tooltip>
            </Flex>
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar
          bg={theme.primaryColor}
          top={{ xs: 60, md: 0 }}
          h="100%"
          p={0}
          zIndex={100}
        >
          <Stack
            align="center"
            display="flex"
            pt={20}
            pb={30}
            style={{
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <Image
              src={logo}
              alt="logo"
              w={{ xs: 100, md: collapsed ? 60 : 100 }}
              h={{ xs: 100, md: collapsed ? 60 : 100 }}
              my={{ xs: 10, md: 10 }}
            />
            <Flex
              align="center"
              display={{ xs: 'none', md: 'flex' }}
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
          <Box px={{ xs: 5, md: 50 }}>
            <Outlet />
          </Box>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default Layout;
