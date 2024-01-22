import React from 'react';
import { Box, Center, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { useLocation } from 'react-router-dom';
import { SidebarItemInterface } from '@/interfaces/layoutInterfaces';
import classes from '../styles/Layout.module.css';

type SidebarItemProps = Omit<SidebarItemInterface, 'roles'> & {
  collapsed: boolean;
  onClick: () => void;
};
const SidebarItem = ({ text, icon: Icon, path, collapsed, onClick }: SidebarItemProps) => {
  const theme = useMantineTheme();
  const location = useLocation();
  const { hovered, ref } = useHover();
  const isActive = location.pathname.startsWith(path);
  return (
    <>
      <Tooltip label={text} hidden={!collapsed} zIndex={400}>
        <Center
          ref={ref}
          inline
          className={classes.nav_item}
          w="100%"
          h={50}
          my={12}
          pl={20}
          bg={hovered || isActive ? 'rgba(20, 20, 20, 0.05)' : ''}
          onClick={onClick}
        >
          <Center ref={ref} inline w="100%" h={50} my={12} pl={20}>
            <Icon color={hovered || isActive ? theme.colors.brandSecondary[9] : theme.white} />

            <Text
              ml={10}
              c={hovered || isActive ? theme.colors.brandSecondary[9] : theme.white}
              w="80%"
              size="md"
              display={{ xs: 'flex', md: collapsed ? 'none' : 'block' }}
              fw={500}
            >
              {text}
            </Text>
          </Center>

          <Box
            w={3}
            h="100%"
            bg={theme.colors.brandSecondary[9]}
            style={{ borderRadius: '10px', visibility: hovered || isActive ? 'visible' : 'hidden' }}
          />
        </Center>
      </Tooltip>
    </>
  );
};

export default SidebarItem;
