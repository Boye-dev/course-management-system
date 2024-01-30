import {
  CheckIcon,
  Combobox,
  Group,
  InputBase,
  ScrollArea,
  Text,
  useCombobox,
} from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';

import { useEffect, useState } from 'react';

export interface OptionProps {
  label: string;
  value: string;
  render?: () => JSX.Element;
  disabled?: boolean;
}
export function SelectRender({
  data,
  placeholder,
  label,
  maxDropdownHeight,
  search,
  setSearch,
  ...formProps
}: GetInputPropsReturnType & {
  data: OptionProps[];
  placeholder: string;
  label: string;
  maxDropdownHeight?: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }
    },
  });

  const [value, setValue] = useState<string | null>(null);

  const shouldFilterOptions = data.every((item) => item.label !== search);
  const filteredOptions = shouldFilterOptions
    ? data.filter((item) => item.label.toLowerCase().includes(search.toLowerCase().trim()))
    : data;

  const options = filteredOptions.map((item) => (
    <Combobox.Option
      disabled={item.disabled}
      value={item.value}
      key={item.value}
      active={value?.includes(item.value)}
    >
      <Group gap="sm">
        {value?.includes(item.value) ? <CheckIcon size={12} color="gray" /> : null}
        <span>{item.render ? item.render() : item.label}</span>
      </Group>
    </Combobox.Option>
  ));

  useEffect(() => {
    setSearch(data.find((v) => v.value === value)?.label || '');
  }, [value]);
  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        formProps.onChange(val);
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Text fw={500}>{label}</Text>
      <Combobox.Target>
        <InputBase
          error={formProps.error}
          size="md"
          rightSection={<Combobox.Chevron />}
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(data.find((v) => v.value === value)?.label || '');
          }}
          placeholder={placeholder}
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <ScrollArea.Autosize mah={maxDropdownHeight} scrollbars="y">
          <Combobox.Options>
            {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
          </Combobox.Options>
        </ScrollArea.Autosize>
      </Combobox.Dropdown>
    </Combobox>
  );
}
