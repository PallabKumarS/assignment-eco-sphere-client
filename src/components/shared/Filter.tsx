"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import { getAllCategories } from "@/services/CategoryService";
import { TCategory } from "@/types";

const FilterComponent = () => {
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [paid, setPaid] = useState<string | undefined>();
  const [isFetching, setIsFetching] = useState(true);
  const [categories, setCategories] = useState<TCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      setCategories(res.data);
      setIsFetching(false);
    };

    fetchCategories();
  });

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    if (paid !== undefined) {
      params.set("isPaid", paid);
    }
    if (selectedCategories.length > 0) {
      params.set("categoryId", selectedCategories.join(","));
    }

    router.push(`/ideas?${params.toString()}`);
  };

  const handleClearFilter = () => {
    setSelectedCategories([]);
    setPaid(undefined);
    router.push("/ideas");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex flex-1 w-full px-6"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filter
        </Button>
      </SheetTrigger>
      <SheetContent className="px-3 md:px-8 bg-sidebar">
        <SheetDescription></SheetDescription>
        <SheetHeader>
          <SheetTitle>Filter Listings</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {/* Categories */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categories</label>
            <Command className="bg-chart-1 px-2">
              <CommandInput
                className="h-8"
                placeholder="Type a category or search..."
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup aria-checked="mixed">
                  {categories?.map((category: TCategory) => (
                    <CommandItem
                      className="flex items-center gap-2"
                      key={category.id}
                      disabled={isFetching}
                      onSelect={() => {
                        setSelectedCategories((prev) =>
                          prev.includes(category.id)
                            ? prev.filter((id) => id !== category.id)
                            : [...prev, category.id]
                        );
                      }}
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                      />
                      {category.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          {/* Paid Ideas */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Paid Ideas</label>
            <RadioGroup
              value={paid}
              onValueChange={(value) => setPaid(value)}
              className="flex flex-col space-y-1 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="paid" />
                <Label htmlFor="paid">Paid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="free" />
                <Label htmlFor="free">Free</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button onClick={handleApplyFilter}>Apply Filter</Button>
            <Button variant="outline" onClick={handleClearFilter}>
              Clear
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterComponent;
