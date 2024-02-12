import { Text } from '@mantine/core';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ApiSchoolResponse, ISchoolParams, getSchools } from '@/services/school.service';
import { convertAllLowercaseToSentenceCase } from '@/utils/textHelpers';

const useSchoolInfiniteQuery = () => {
  const [tableParamsSchool, setTableParamsSchool] = useState<ISchoolParams>({
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
    isFetching: isFetchingSchools,
    data: schools,
  } = useInfiniteQuery({
    queryKey: ['schools-infinite', tableParamsSchool],
    queryFn: ({ pageParam }) => getSchools({ ...tableParamsSchool, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages: any) => {
      const totalItems = lastPage?.total;
      const itemsLoaded = pages.reduce((total: number, page: ApiSchoolResponse) => {
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
  const schoolsData =
    schools?.pages
      .flatMap((page) => page?.data)
      ?.map((course, i) => {
        if (schools?.pages.flatMap((page) => page?.data).length === i + 1) {
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
    schools,
    schoolsData,
    isFetchingSchools,
    isFetchingSchoolsNextPage: isFetchingNextPage,
    setTableParamsSchool,
    tableParamsSchool,
  };
};

export default useSchoolInfiniteQuery;
