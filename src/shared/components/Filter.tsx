import { Box, Button, Flex, Modal, NumberInput, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFilter } from '@tabler/icons-react';
import React, { useState } from 'react';
import { MultiSelectRender } from './MultiSelectRender';
import { IFilter } from '@/interfaces/helperInterface';

enum FilterTypes {
  multiselect = 'multiselect',
  number = 'number',
  multiselectrender = 'multiselectrender',
}
interface IFilterOptions {
  type: keyof typeof FilterTypes;
  placeholder: string;
  label: string;
  key: string;
  searchValue?: string;
  onSearch?: (searchValue: string) => void;
  data?: any;
}

interface FilterProps {
  search: string;
  searchPlaceholder: string;
  onSearchChange: (_val: string) => void;
  applyFilters: (_filterValues: IFilter[]) => void;
  data?: IFilterOptions[];
  showFilter?: boolean;
}
const Filter = ({
  search,
  onSearchChange,
  data = [],
  applyFilters,
  searchPlaceholder,
  showFilter = true,
}: FilterProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [filterValues, setFilterValues] = useState<IFilter[]>([]);

  const updateFilters = (val: IFilter) => {
    const filteredIndex = filterValues.findIndex((item) => item.label === val.label);
    if (filteredIndex !== -1) {
      setFilterValues((prev) => {
        const updatedArray = prev.map((prevVal) => {
          if (prevVal.label === val.label) {
            return { ...prevVal, values: val.values };
          }
          return prevVal;
        });

        return updatedArray;
      });

      return;
    }
    const values = filterValues;
    values.push(val);
    setFilterValues(values);
  };

  return (
    <>
      {showFilter && (
        <Modal opened={opened} onClose={close} title="Filter" centered>
          <Box mah={500} mih={400}>
            {data.map((filter: any) => {
              if (filter.type === FilterTypes.multiselect) {
                return (
                  <Box mt={20} key={filter.key}>
                    <MultiSelectRender
                      defaultValues={
                        filterValues.find((item) => item.label === filter.label)?.values || []
                      }
                      maxDropdownHeight={250}
                      searchValue={filter.searchValue}
                      onSearch={(searchValue) => filter.onSearch(searchValue)}
                      label={filter.label}
                      placeholder={filter.placeholder}
                      data={filter.data}
                      onChange={(val: string[]) =>
                        updateFilters({ label: filter.label, values: val, key: filter.key })
                      }
                    />
                  </Box>
                );
              }
              if (filter.type === FilterTypes.number) {
                return (
                  <Box mt={20} key={filter.key}>
                    <NumberInput
                      defaultValue={
                        filterValues.find((item) => item.label === filter.label)?.values
                      }
                      label={filter.label}
                      placeholder={filter.placeholder}
                      onChange={(val: string | number) =>
                        updateFilters({ label: filter.label, values: val, key: filter.key })
                      }
                    />
                  </Box>
                );
              }
              return undefined;
            })}
          </Box>
          <Flex gap={5}>
            <Button
              variant="outline"
              color="red"
              w="50%"
              onClick={() => {
                setFilterValues([]);
                onSearchChange('');
                applyFilters([]);
                close();
              }}
            >
              Clear Filters
            </Button>
            <Button
              w="50%"
              onClick={() => {
                applyFilters(filterValues);
                close();
              }}
            >
              Apply
            </Button>
          </Flex>
        </Modal>
      )}
      <Flex gap={10} align="center" wrap="wrap">
        <TextInput
          w="300px"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
        />
        {showFilter && (
          <Flex
            w={100}
            h={40}
            style={{ border: '1px solid black', borderRadius: '10px', cursor: 'pointer' }}
            bg="white"
            align="center"
            justify="center"
            onClick={open}
          >
            <Text>Filter</Text>
            <IconFilter />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default Filter;
