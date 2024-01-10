import React from 'react';
import { Box, Center, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarItemInterface } from '@/interfaces/layoutInterfaces';
import classes from '../styles/Layout.module.css';

type SidebarItemProps = Omit<SidebarItemInterface, 'roles'> & {
  collapsed: boolean;
};
const SidebarItem = ({ text, icon: Icon, path, collapsed }: SidebarItemProps) => {
  const theme = useMantineTheme();
  const location = useLocation();
  const { hovered, ref } = useHover();
  const isActive = location.pathname.startsWith(path);
  const navigate = useNavigate();
  return (
    <>
      <Tooltip label={text} hidden={!collapsed}>
        <Center
          ref={ref}
          inline
          className={classes.nav_item}
          w="100%"
          h={50}
          my={12}
          pl={20}
          bg={hovered || isActive ? 'rgba(20, 20, 20, 0.05)' : ''}
          onClick={() => navigate(path)}
        >
          <Icon color={hovered || isActive ? theme.colors.brandSecondary[9] : theme.white} />
          {collapsed || (
            <Text
              c={hovered || isActive ? theme.colors.brandSecondary[9] : theme.white}
              w="80%"
              size="md"
              fw={500}
            >
              {text}
            </Text>
          )}

          <Box
            w={5}
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
