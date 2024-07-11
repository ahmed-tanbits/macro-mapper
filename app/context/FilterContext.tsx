"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname } from 'next/navigation';

const FilterContext = createContext<any | undefined>(undefined);

const initialFilters = {
  allergies: [
    { key: "is_gluten_free", checked: false },
    { key: "is_dairy_free", checked: false },
    { key: "is_nut_free", checked: false },
    { key: "is_soy_free", checked: false },
    { key: "is_egg_free", checked: false },
    { key: "is_sesame_free", checked: false },
    { key: "is_sulfite_free", checked: false },
    { key: "is_vegetarian", checked: false },
    { key: "is_vegan", checked: false },
    { key: "is_shell_fish_free", checked: false },
  ],
  cuisines: [],
  calories: [0, 2000],
  fat: [0, 200],
  protein: [0, 100],
  carbs: [0, 1000],
  sodium: [0, 5000],
  fibre: [0, 200],
  sugars: [0, 200],
};

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<any>(initialFilters);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setFilters(initialFilters);
    }
  }, [pathname]);

  const syncFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, syncFilters, initialFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};
