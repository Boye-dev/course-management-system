import {
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  ScrollArea,
  Text,
  useCombobox,
} from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { useEffect, useState } from 'react';
import { OptionProps } from './SelectRender';

export function MultiSelectRender({
  data,
  placeholder,
  label,
  maxDropdownHeight,
  defaultValues,
  onSearch,
  searchValue,
  ...formProps
}: GetInputPropsReturnType & {
  data: OptionProps[];
  placeholder: string;
  label: string;
  maxDropdownHeight?: number;
  defaultValues?: string[];
  onSearch?: (_searchValue: string) => void;
  searchValue?: string;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });
  const [search, setSearch] = useState('');
  const [value, setValue] = useState<string[]>(defaultValues || []);
  const [valuesSlected, setValuesSelected] = useState<OptionProps[]>(data || []);

  const handleValueSelect = (val: string) => {
    const selectedData = data.find((item) => val === item.value);
    if (selectedData) {
      setValuesSelected((prev) => [...prev, selectedData]);
    }
    setValue((current) =>
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
    );
  };
  useEffect(() => {
    formProps.onChange(value);
  }, [value]);
  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v !== val));

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {valuesSlected.find((val) => val.value === item)?.label}
    </Pill>
  ));

  const options = data
    .filter((item) => item?.label.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option
        disabled={item.disabled}
        value={item.value}
        key={item.value}
        active={value.includes(item.value)}
      >
        <Group gap="sm">
          {value.includes(item.value) ? <CheckIcon size={12} color="gray" /> : null}
          <span>{item.render ? item.render() : item.label}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Text fw={500}>{label}</Text>
      <Combobox.DropdownTarget>
        <PillsInput
          error={formProps.error}
          pointer
          onClick={() => combobox.openDropdown()}
          size="md"
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
        >
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={searchValue || search}
                placeholder={placeholder}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  if (onSearch) {
                    onSearch(event.currentTarget.value);
                  } else {
                    setSearch(event.currentTarget.value);
                  }
                }}
                onKeyDown={(event) => {
                  if (onSearch) {
                    if (event.key === 'Backspace') {
                      event.preventDefault();

                      onSearch(
                        event.currentTarget.value.substring(0, event.currentTarget.value.length - 1)
                      );
                    }
                    if (event.key === 'Backspace' && searchValue?.length === 0) {
                      handleValueRemove(value[value.length - 1]);
                    }
                  } else if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault();

                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

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
