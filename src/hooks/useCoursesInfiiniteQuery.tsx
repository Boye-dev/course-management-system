import { Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ApiCoursesResponse, ICourseParams, getCourses } from '@/services/course.service';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';

const useCoursesInfiiniteQuery = ({ enabled = true }: { enabled?: boolean }) => {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState('');
  const [tableParams, setTableParams] = useState<ICourseParams>({
    page: 0,
    pageSize: '10',
    searchBy: ['name'],
  });
  const [debounced] = useDebouncedValue(search, 400);

  useEffect(() => {
    setTableParams({ ...tableParams, search: debounced.length > 0 ? debounced : '' });
  }, [debounced]);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, data } = useInfiniteQuery({
    queryKey: ['courses-infinte', tableParams],
    enabled,
    queryFn: ({ pageParam }) => getCourses({ ...tableParams, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages: any) => {
      const totalItems = lastPage?.total;
      const itemsLoaded = pages.reduce((total: number, page: ApiCoursesResponse) => {
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
  const coursesData =
    data?.pages
      .flatMap((page) => page?.data)
      ?.map((course, i) => {
        if (data?.pages.flatMap((page) => page?.data).length === i + 1) {
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
    coursesData,
    data,
    isFetching,
    isFetchingNextPage,
    tableParams,
    setTableParams,
    search,
    setSearch,
  };
};

export default useCoursesInfiiniteQuery;
