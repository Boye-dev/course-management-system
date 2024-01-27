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
import { useState } from 'react';
import { OptionProps } from './SelectRender';

export function MultiSelectRender({
  data,
  placeholder,
  label,
  maxDropdownHeight,
  search,
  setSearch,
}: {
  data: OptionProps[];
  placeholder: string;
  label: string;
  maxDropdownHeight?: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [value, setValue] = useState<string[]>([]);

  const handleValueSelect = (val: string) =>
    setValue((current) =>
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
    );

  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v !== val));

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {data.find((val) => val.value === item)?.label}
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
          {value.includes(item.value) ? <CheckIcon size={12} /> : null}
          <span>{item.render ? item.render() : item.label}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Text fw={500}>{label}</Text>
      <Combobox.DropdownTarget>
        <PillsInput
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
                value={search}
                placeholder={placeholder}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
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
