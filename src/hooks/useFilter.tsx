import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IFilter } from '@/interfaces/helperInterface';

interface IUseFilterProps<T> {
  defaultParams: T;
}
const useFilter = <T,>({ defaultParams }: IUseFilterProps<T>) => {
  const [tableParams, setTableParams] = useState<T>(defaultParams);
  const [filterValues, setFilterValues] = useState<IFilter[]>([]);
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 400);

  useEffect(() => {
    setTableParams((prevTableParams) => ({
      ...prevTableParams,
      search: debounced.length > 0 ? debounced : '',
    }));
  }, [debounced]);

  useEffect(() => {
    if (filterValues.length === 0) {
      setTableParams(defaultParams);
    } else {
      setTableParams((prevTableParams) => {
        let updatedParams = { ...prevTableParams };

        filterValues.forEach((item) => {
          updatedParams = {
            ...updatedParams,
            [item.key]: item.values,
          };
        });

        return updatedParams;
      });
    }
  }, [filterValues]);

  return { filterValues, setFilterValues, tableParams, setTableParams, search, setSearch };
};

export default useFilter;
