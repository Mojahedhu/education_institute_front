import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  label: React.ReactNode;
  value: string | number;
}

export interface SearchableSelectProps {
  value?: string | number;
  onValueChange: (value: string | number) => void;
  options?: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  popoverWidth?: string;
  /** For server-side Refine queries */
  onSearch?: (search: string) => void;
  shouldFilter?: boolean;
  /** Optional: Only renders an "All" option if allOptionLabel is passed */
  allOptionLabel?: string;
  allOptionValue?: string | number;
  /** Variant style for trigger: 'filter' (ChevronDown, auto width) or 'form' (ChevronsUpDown, w-full) */
  variant?: "filter" | "form";
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onValueChange,
  options = [],
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  isLoading = false,
  disabled = false,
  className,
  popoverWidth = "w-(--radix-popover-trigger-width)",
  onSearch,
  shouldFilter = false,
  allOptionLabel,
  allOptionValue = "all",
  variant = "filter",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cachedLabel, setCachedLabel] = useState<React.ReactNode>("");

  // Update cachedLabel whenever the value matches an item in options
  useEffect(() => {
    if (!value || value === allOptionValue) {
      setCachedLabel("");
      return;
    }
    const found = options.find(
      (opt) => String(opt.value).toLowerCase() === String(value).toLowerCase(),
    );
    if (found) {
      setCachedLabel(found.label);
    }
  }, [value, options, allOptionValue]);

  // Find currently selected label
  const selectedOption = useMemo(() => {
    if (
      allOptionLabel &&
      String(value).toLowerCase() === String(allOptionValue).toLowerCase()
    ) {
      return { label: allOptionLabel, value: allOptionValue };
    }
    return options.find(
      (opt) =>
        String(opt.value).toLowerCase() === String(value).toLowerCase() ||
        String(opt.label).toLowerCase() === String(value).toLowerCase(),
    );
  }, [value, options, allOptionLabel, allOptionValue]);

  // Use selectedOption label -> fallback to cachedLabel -> fallback to placeholder (NEVER raw ID)
  const displayLabel = selectedOption?.label || cachedLabel || placeholder;

  const isPlaceholderShowing = !selectedOption && (!value || value === "all");

  const handleSelect = (val: string | number) => {
    onValueChange(val);
    setOpen(false);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    onSearch?.(val);
  };

  // Only compute/show "All" option if `allOptionLabel` is explicitly provided
  const showAllOption =
    allOptionLabel &&
    (!search ||
      allOptionLabel.toLowerCase().includes(search.toLowerCase().trim()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          type="button"
          aria-expanded={open}
          className={cn(
            "justify-between font-normal",
            variant === "form" && "w-full",
            isPlaceholderShowing &&
              variant === "form" &&
              "text-muted-foreground",
            className,
          )}
          disabled={disabled || isLoading}
        >
          <span className="truncate">{displayLabel}</span>
          {variant === "filter" ? (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn("p-0", popoverWidth)}>
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            className="w-full text-center placeholder:text-center"
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty className="text-center">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {/* Only rendered if allOptionLabel was provided */}
              {showAllOption && (
                <CommandItem
                  value={String(allOptionValue)}
                  className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground px-2"
                  onSelect={() => handleSelect(allOptionValue)}
                >
                  {allOptionLabel}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      String(value).toLowerCase() ===
                        String(allOptionValue).toLowerCase()
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              )}

              {options.map((option) => {
                const isSelected =
                  String(option.value).toLowerCase() ===
                    String(value).toLowerCase() ||
                  String(option.label).toLowerCase() ===
                    String(value).toLowerCase();

                return (
                  <CommandItem
                    key={String(option.value)}
                    value={String(option.value)}
                    className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground px-2"
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableSelect;
