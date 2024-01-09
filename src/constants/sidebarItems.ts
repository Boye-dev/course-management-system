import {
  IconBackpack,
  IconBook,
  IconSchool,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import { SidebarItemInterface } from '@/interfaces/layoutInterfaces';

export const sidebarItems: SidebarItemInterface[] = [
  { text: 'Personal Information', icon: IconUser, path: '/admin/personal-info', roles: ['ADMIN'] },
  { text: 'Courses', icon: IconBook, path: '/admin/courses', roles: ['ADMIN'] },
  { text: 'Teachers', icon: IconUsers, path: '/admin/teachers', roles: ['ADMIN'] },
  { text: 'Students', icon: IconUsersGroup, path: '/admin/students', roles: ['ADMIN'] },
  { text: 'Departments', icon: IconBackpack, path: '/admin/departments', roles: ['ADMIN'] },
  { text: 'Schools', icon: IconSchool, path: '/admin/schools', roles: ['ADMIN'] },
];
