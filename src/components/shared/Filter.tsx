"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
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
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { TCategory, TMongoose } from "@/types";

const Filter = () => {
  const router = useRouter();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string | undefined>();

  const { data: categories, isFetching } = useGetAllCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    if (priceRange[0] > 0 || priceRange[1] < 50000) {
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
    }
    if (availability !== undefined) {
      params.set("availability", availability);
    }
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }

    router.push(`/listings?${params.toString()}`);
  };

  const handleClearFilter = () => {
    setPriceRange([0, 50000]);
    setSelectedCategories([]);
    setAvailability(undefined);
    router.push("/listings");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="px-3 md:px-8 bg-sidebar">
        <SheetDescription></SheetDescription>
        <SheetHeader>
          <SheetTitle>Filter Listings</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <div className="pt-2">
              <Slider
                defaultValue={[0, 50000]}
                max={50000}
                step={500}
                value={priceRange}
                onValueChange={(priceRange) =>
                  setPriceRange(priceRange as [number, number])
                }
                className="my-4"
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

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
                  {categories?.data?.map((category: TCategory & TMongoose) => (
                    <CommandItem
                      className="flex items-center gap-2"
                      key={category._id}
                      disabled={isFetching}
                      onSelect={() => {
                        setSelectedCategories((prev) =>
                          prev.includes(category._id)
                            ? prev.filter((id) => id !== category._id)
                            : [...prev, category._id]
                        );
                      }}
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category._id)}
                      />
                      {category.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Availability</label>
            <RadioGroup
              value={availability}
              onValueChange={(value) => setAvailability(value)}
              className="flex flex-col space-y-1 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="available" />
                <Label htmlFor="available">Available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="out_of_stock" />
                <Label htmlFor="out_of_stock">Out of stock</Label>
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

export default Filter;
