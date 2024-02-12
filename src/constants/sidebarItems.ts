import {
  IconBackpack,
  IconBook,
  IconSchool,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import { SidebarItemInterface } from '@/interfaces/layoutInterfaces';
import { Roles } from './roles';

export const adminSidebarItems: SidebarItemInterface[] = [
  {
    text: 'Personal Information',
    icon: IconUser,
    path: '/admin/personal-info',
    roles: [Roles.ADMIN],
  },
  { text: 'Courses', icon: IconBook, path: '/admin/courses', roles: [Roles.ADMIN] },
  {
    text: 'Enrolled Teachers',
    icon: IconBook,
    path: '/admin/enrolled-teachers',
    roles: [Roles.ADMIN],
  },
  { text: 'Teachers', icon: IconUsers, path: '/admin/teachers', roles: [Roles.ADMIN] },
  { text: 'Students', icon: IconUsersGroup, path: '/admin/students', roles: [Roles.ADMIN] },
  { text: 'Departments', icon: IconBackpack, path: '/admin/departments', roles: [Roles.ADMIN] },
  { text: 'Schools', icon: IconSchool, path: '/admin/schools', roles: [Roles.ADMIN] },
];

export const studentSideBarItems: SidebarItemInterface[] = [
  {
    text: 'Personal Information',
    icon: IconUser,
    path: '/student/personal-info',
    roles: [Roles.STUDENT],
  },
  { text: 'Courses', icon: IconBook, path: '/student/courses', roles: [Roles.STUDENT] },
];

export const teacherSideBarItems: SidebarItemInterface[] = [
  {
    text: 'Personal Information',
    icon: IconUser,
    path: '/teacher/personal-info',
    roles: [Roles.TEACHER],
  },
  { text: 'Courses', icon: IconBook, path: '/teacher/courses', roles: [Roles.STUDENT] },
];
