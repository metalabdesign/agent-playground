'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/shadcnui/select';
import { PLACES } from '@/src/lib/openLibrary/constants';

interface PlaceDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlaceDropdown({ value, onChange }: PlaceDropdownProps) {
  const handleChange = (newValue: string) => {
    // Convert the special "all" value to empty string
    onChange(newValue === 'all' ? '' : newValue);
  };

  return (
    <Select value={value || 'all'} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Places" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Places</SelectItem>
        {PLACES.map((place) => (
          <SelectItem key={place.value} value={place.value}>
            {place.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
