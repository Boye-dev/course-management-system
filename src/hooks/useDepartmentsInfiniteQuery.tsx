import { Text } from '@mantine/core';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  ApiDepartmentsResponse,
  IDepartmentParams,
  getDepartments,
} from '@/services/department.service';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';

const useDepartmentsInfiniteQuery = () => {
  const [tableParamsDepartment, setTableParamsDepartment] = useState<IDepartmentParams>({
    page: 0,
    sortBy: 'name',
    pageSize: '10',
    searchBy: ['name'],
  });

  const { ref, inView } = useInView();

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching: isFetchingDepartments,
    data: departments,
  } = useInfiniteQuery({
    queryKey: ['departments-infinite', tableParamsDepartment],
    queryFn: ({ pageParam }) => getDepartments({ ...tableParamsDepartment, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages: any) => {
      const totalItems = lastPage?.total;
      const itemsLoaded = pages.reduce((total: number, page: ApiDepartmentsResponse) => {
        if (page) {
          return total + page.data.length;
        }
        return totalItems;
      }, 0);

      if (itemsLoaded < totalItems) {
        return pages.length;
      }

      return undefined;
    },
  });
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  const departmentsData =
    departments?.pages
      .flatMap((page) => page?.data)
      ?.map((course, i) => {
        if (departments?.pages.flatMap((page) => page?.data).length === i + 1) {
          return {
            render: () => <Text ref={ref}>{convertAllLowercaseToSentenceCase(course?.name)}</Text>,
            label: `${convertAllLowercaseToSentenceCase(course?.name)}`,
            value: course?._id,
            disabled: false,
          };
        }
        return {
          render: () => <Text>{convertAllLowercaseToSentenceCase(course?.name)}</Text>,
          label: `${convertAllLowercaseToSentenceCase(course?.name)}`,
          value: course?._id,
          disabled: false,
        };
      }) || [];
  return {
    departments,
    departmentsData,
    isFetchingDepartments,
    isFetchingDepartmentsNextPage: isFetchingNextPage,
    setTableParamsDepartment,
    tableParamsDepartment,
  };
};

export default useDepartmentsInfiniteQuery;
