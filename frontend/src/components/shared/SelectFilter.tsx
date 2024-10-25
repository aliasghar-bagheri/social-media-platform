import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

type SelectFilterProps = {
  value: string;
  onValueChange: (value: string) => void;
  selectItemList: string[];
  disabled?: false;
};

const SelectFilter = ({
  value,
  onValueChange,
  selectItemList,
  disabled,
}: SelectFilterProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="flex w-auto items-center gap-3 rounded-2xl">
        <p className="base-medium capitalize">{value}</p>
        <img src="/assets/icons/filter.svg" alt="filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectItemList.map((item, index) => {
            const toLowercaseValue = String(item).toLowerCase();
            return (
              <SelectItem className="capitalize" value={toLowercaseValue} key={index}>
                {item}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectFilter;
