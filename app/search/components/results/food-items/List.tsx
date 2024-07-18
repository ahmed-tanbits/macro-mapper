// "use client";
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import FoodItem from "./FoodItem";
// import { supabase } from "@/supabaseClient";
// import LoadingCard from "../restaurants/LoadingCard";
// import Sort from "../../filters/Sort";
// import SearchBarResponsive from "@/app/search/components/filters/filters-responsive/SearchBarResponsive";
// import ResetFiltersButton from "./ResetFiltersButton";

// type FiltersType = {
//   allergies: { key: string; checked: boolean }[];
//   cuisines: string[];
//   calories: [number, number];
//   fat: [number, number];
//   protein: [number, number];
//   carbs: [number, number];
//   sodium: [number, number];
//   sugars: [number, number];
//   fibre: [number, number];
// };

// type Props = {
//   filters: FiltersType;
//   onHighlightLocations: (rest_id: string) => void;
//   toggleView: any;
// };

// export default function FoodList({
//   filters,
//   onHighlightLocations,
//   toggleView,
// }: Props) {
//   const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [sortOption, setSortOption] = useState<string>("Default");
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const loader = useRef<HTMLDivElement | null>(null);

//   const fetchFoodItems = useCallback(
//     async (page: number, isNewSearch = false) => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         let query = supabase.from("products").select("*");

//         const startIndex = (page - 1) * 20;
//         const endIndex = page * 20 - 1;

//         query = query.range(startIndex, endIndex);

//         query = applyFilters(query);

//         if (searchTerm) {
//           query = query.ilike("product_name", `%${searchTerm}%`);
//         }

//         const { data, error } = await query;

//         if (error) {
//           throw new Error(error.message);
//         }

//         const sortedAndFilteredData = data.filter((item) => {
//           if (sortOption === "Default") return true;
//           const sortKey = sortKeyMap[sortOption];
//           return item[sortKey] !== null && item[sortKey] !== undefined;
//         });

//         setFoodItems((prev) => {
//           const newItems = isNewSearch ? sortedAndFilteredData : [...prev, ...sortedAndFilteredData];
//           const uniqueItems = Array.from(new Set(newItems.map(item => item.prod_id)))
//             .map(id => newItems.find(item => item.prod_id === id));
//           return uniqueItems;
//         });

//         setHasMore(data.length === 20);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [filters, sortOption, searchTerm]
//   );

//   const sortKeyMap: { [key: string]: string } = {
//     "Lowest Calories": "calories",
//     "Highest Calories": "calories",
//     "Lowest Fat": "total_fat",
//     "Highest Fat": "total_fat",
//     "Lowest Protein": "protein",
//     "Highest Protein": "protein",
//     "Lowest Carbs": "total_carbs",
//     "Highest Carbs": "total_carbs",
//     "Lowest Sodium": "sodium",
//     "Highest Sodium": "sodium",
//     "Lowest Sugar": "sugars",
//     "Highest Sugar": "sugars",
//     "Lowest Fibre": "fibre",
//     "Highest Fibre": "fibre",
//   };

//   function applyFilters(query: any) {
//     query = query
//       .or(`calories.gte.${filters.calories[0]},calories.is.null`)
//       .or(`calories.lte.${filters.calories[1]},calories.is.null`)
//       .or(`total_fat.gte.${filters.fat[0]},total_fat.is.null`)
//       .or(`total_fat.lte.${filters.fat[1]},total_fat.is.null`)
//       .or(`protein.gte.${filters.protein[0]},protein.is.null`)
//       .or(`protein.lte.${filters.protein[1]},protein.is.null`)
//       .or(`total_carbs.gte.${filters.carbs[0]},total_carbs.is.null`)
//       .or(`total_carbs.lte.${filters.carbs[1]},total_carbs.is.null`)
//       .or(`sodium.gte.${filters.sodium[0]},sodium.is.null`)
//       .or(`sodium.lte.${filters.sodium[1]},sodium.is.null`)
//       .or(`sugars.gte.${filters.sugars[0]},sugars.is.null`)
//       .or(`sugars.lte.${filters.sugars[1]},sugars.is.null`)
//       .or(`fibre.gte.${filters.fibre[0]},fibre.is.null`)
//       .or(`fibre.lte.${filters.fibre[1]},fibre.is.null`);

//     filters.allergies.forEach((allergy) => {
//       if (allergy.checked) {
//         query = query.eq(allergy.key, true);
//       }
//     });

//     if (sortOption !== "Default") {
//       const sortKey = sortKeyMap[sortOption];
//       if (sortKey) {
//         query = query.order(sortKey, {
//           ascending: sortOption.startsWith("Lowest"),
//         });
//       }
//     }

//     return query;
//   }

//   useEffect(() => {
//     setPage(1);
//     setFoodItems([]); // Clear food items on new search
//     fetchFoodItems(1, true); // Indicate that this is a new search
//   }, [filters, sortOption, searchTerm, fetchFoodItems]);

//   useEffect(() => {
//     if (page > 1) {
//       fetchFoodItems(page);
//     }
//   }, [page, fetchFoodItems]);

//   useEffect(() => {
//     const handleObserver = (entries: IntersectionObserverEntry[]) => {
//       const target = entries[0];
//       if (target.isIntersecting && !isLoading && hasMore) {
//         setPage((prev) => prev + 1);
//       }
//     };

//     const options = {
//       root: null,
//       rootMargin: "20px",
//       threshold: 0.1,
//     };

//     const observer = new IntersectionObserver(handleObserver, options);

//     if (loader.current) {
//       observer.observe(loader.current);
//     }

//     return () => {
//       if (loader.current) {
//         observer.disconnect();
//       }
//     };
//   }, [isLoading, hasMore]);

//   return (
//     <div className="flex flex-col pb-20 justify-start items-start hide-scrollbar h-full w-full gap-4 p-3 md:p-4 overflow-y-scroll">
//       <div className="w-full">
//         <SearchBarResponsive onSearch={setSearchTerm} />
//       </div>
//       <div className="w-full flex justify-end items-end space-x-2">
//         <Sort onSortChange={setSortOption} />
//         <ResetFiltersButton /> {/* Add the ResetFiltersButton here */}
//       </div>

//       {error && (
//         <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
//           <p className="font-medium">Error: {error}</p>
//         </div>
//       )}

//       {isLoading && foodItems.length === 0 && (
//         <div className="w-full flex flex-col items-center gap-4 justify-center">
//           {[...Array(10)].map((_, index) => (
//             <LoadingCard key={index} />
//           ))}
//         </div>
//       )}

//       {!isLoading && foodItems.length === 0 && !error && (
//         <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
//           <p className="font-medium">No foods for current filters.</p>
//           <p>
//             We are constantly updating our site with new foods for you to
//             browse!
//           </p>
//         </div>
//       )}

//       {foodItems.map((item) => (
//         <FoodItem
//           key={item.prod_id}
//           item={item}
//           toggleView={toggleView}
//           onHighlightLocations={onHighlightLocations}
//         />
//       ))}

//       {isLoading && foodItems.length > 0 && (
//         <div className="w-full flex justify-center">
//           <LoadingCard />
//         </div>
//       )}

//       <div ref={loader}></div>
//     </div>
//   );
// }






















// "use client";
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import FoodItem from "./FoodItem";
// import { supabase } from "@/supabaseClient";
// import LoadingCard from "../restaurants/LoadingCard";
// import Sort from "../../filters/Sort";
// import SearchBarResponsive from "@/app/search/components/filters/filters-responsive/SearchBarResponsive";
// import ResetFiltersButton from "./ResetFiltersButton";

// type FiltersType = {
//   allergies: { key: string; checked: boolean }[];
//   cuisines: string[];
//   calories: [number, number];
//   fat: [number, number];
//   protein: [number, number];
//   carbs: [number, number];
//   sodium: [number, number];
//   sugars: [number, number];
//   fibre: [number, number];
// };

// type Props = {
//   filters: FiltersType;
//   onHighlightLocations: (rest_id: string) => void;
//   toggleView: any;
// };

// export default function FoodList({
//   filters,
//   onHighlightLocations,
//   toggleView,
// }: Props) {
//   const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [sortOption, setSortOption] = useState<string>("Default");
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const loader = useRef<HTMLDivElement | null>(null);

//   const sortKeyMap: { [key: string]: string } = {
//     "Lowest Calories": "calories",
//     "Highest Calories": "calories",
//     "Lowest Fat": "total_fat",
//     "Highest Fat": "total_fat",
//     "Lowest Protein": "protein",
//     "Highest Protein": "protein",
//     "Lowest Carbs": "total_carbs",
//     "Highest Carbs": "total_carbs",
//     "Lowest Sodium": "sodium",
//     "Highest Sodium": "sodium",
//     "Lowest Sugar": "sugars",
//     "Highest Sugar": "sugars",
//     "Lowest Fibre": "fibre",
//     "Highest Fibre": "fibre",
//   };

//   const fetchFoodItems = useCallback(
//     async (page: number, isNewSearch = false) => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         let query = supabase.from("products").select("*");

//         const startIndex = (page - 1) * 20;
//         const endIndex = page * 20 - 1;

//         query = query.range(startIndex, endIndex);

//         if (searchTerm) {
//           query = query.ilike("product_name", `%${searchTerm}%`);
//         }

//         if (sortOption !== "Default") {
//           const sortKey = sortKeyMap[sortOption];
//           if (sortKey) {
//             query = query.order(sortKey, {
//               ascending: sortOption.startsWith("Lowest"),
//               nullsFirst: false,
//             });
//             query = query.not(sortKey, "is", null); // Exclude items with null sortKey
//           }
//         }

//         const { data, error } = await query;

//         if (error) {
//           throw new Error(error.message);
//         }

//         setFoodItems((prev) => {
//           const newItems = isNewSearch ? data : [...prev, ...data];
//           const uniqueItems = Array.from(new Set(newItems.map(item => item.prod_id)))
//             .map(id => newItems.find(item => item.prod_id === id));
//           return uniqueItems;
//         });

//         setHasMore(data.length === 20);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [sortOption, searchTerm]
//   );

//   useEffect(() => {
//     setPage(1);
//     setFoodItems([]); // Clear food items on new search
//     fetchFoodItems(1, true); // Indicate that this is a new search
//   }, [sortOption, searchTerm, fetchFoodItems]);

//   useEffect(() => {
//     if (page > 1) {
//       fetchFoodItems(page);
//     }
//   }, [page, fetchFoodItems]);

//   useEffect(() => {
//     const handleObserver = (entries: IntersectionObserverEntry[]) => {
//       const target = entries[0];
//       if (target.isIntersecting && !isLoading && hasMore) {
//         setPage((prev) => prev + 1);
//       }
//     };

//     const options = {
//       root: null,
//       rootMargin: "20px",
//       threshold: 0.1,
//     };

//     const observer = new IntersectionObserver(handleObserver, options);

//     if (loader.current) {
//       observer.observe(loader.current);
//     }

//     return () => {
//       if (loader.current) {
//         observer.disconnect();
//       }
//     };
//   }, [isLoading, hasMore]);

//   return (
//     <div className="flex flex-col pb-20 justify-start items-start hide-scrollbar h-full w-full gap-4 p-3 md:p-4 overflow-y-scroll">
//       <div className="w-full">
//         <SearchBarResponsive onSearch={setSearchTerm} />
//       </div>
//       <div className="w-full flex justify-end items-end space-x-2">
//         <Sort onSortChange={setSortOption} />
//         <ResetFiltersButton />
//       </div>

//       {error && (
//         <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
//           <p className="font-medium">Error: {error}</p>
//         </div>
//       )}

//       {isLoading && foodItems.length === 0 && (
//         <div className="w-full flex flex-col items-center gap-4 justify-center">
//           {[...Array(10)].map((_, index) => (
//             <LoadingCard key={index} />
//           ))}
//         </div>
//       )}

//       {!isLoading && foodItems.length === 0 && !error && (
//         <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
//           <p className="font-medium">No foods for current filters.</p>
//           <p>
//             We are constantly updating our site with new foods for you to
//             browse!
//           </p>
//         </div>
//       )}

//       {foodItems.map((item) => (
//         <FoodItem
//           key={item.prod_id}
//           item={item}
//           toggleView={toggleView}
//           onHighlightLocations={onHighlightLocations}
//         />
//       ))}

//       {isLoading && foodItems.length > 0 && (
//         <div className="w-full flex justify-center">
//           <LoadingCard />
//         </div>
//       )}

//       <div ref={loader}></div>
//     </div>
//   );
// }























// "use client";
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import FoodItem from "./FoodItem";
// import { supabase } from "@/supabaseClient";
// import LoadingCard from "../restaurants/LoadingCard";
// import Sort from "../../filters/Sort";
// import SearchBarResponsive from "@/app/search/components/filters/filters-responsive/SearchBarResponsive";
// import ResetFiltersButton from "./ResetFiltersButton";

// type FiltersType = {
//   allergies: { key: string; checked: boolean }[];
//   cuisines: string[];
//   calories: [number, number];
//   fat: [number, number];
//   protein: [number, number];
//   carbs: [number, number];
//   sodium: [number, number];
//   sugars: [number, number];
//   fibre: [number, number];
// };

// type Props = {
//   filters: FiltersType;
//   onHighlightLocations: (rest_id: string) => void;
//   toggleView: any;
// };

// export default function FoodList({
//   filters,
//   onHighlightLocations,
//   toggleView,
// }: Props) {
//   const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [sortOption, setSortOption] = useState<string>("Default");
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const loader = useRef<HTMLDivElement | null>(null);

//   const sortKeyMap: { [key: string]: string } = {
//     "Lowest Calories": "calories",
//     "Highest Calories": "calories",
//     "Lowest Fat": "total_fat",
//     "Highest Fat": "total_fat",
//     "Lowest Protein": "protein",
//     "Highest Protein": "protein",
//     "Lowest Carbs": "total_carbs",
//     "Highest Carbs": "total_carbs",
//     "Lowest Sodium": "sodium",
//     "Highest Sodium": "sodium",
//     "Lowest Sugar": "sugars",
//     "Highest Sugar": "sugars",
//     "Lowest Fibre": "fibre",
//     "Highest Fibre": "fibre",
//   };

//   const applyFilters = (query: any) => {
//     if (filters.calories[0] !== 0 || filters.calories[1] !== 2000) {
//       query = query.gte('calories', filters.calories[0]).lte('calories', filters.calories[1]);
//     }
//     if (filters.fat[0] !== 0 || filters.fat[1] !== 200) {
//       query = query.gte('total_fat', filters.fat[0]).lte('total_fat', filters.fat[1]);
//     }
//     if (filters.protein[0] !== 0 || filters.protein[1] !== 100) {
//       query = query.gte('protein', filters.protein[0]).lte('protein', filters.protein[1]);
//     }
//     if (filters.carbs[0] !== 0 || filters.carbs[1] !== 1000) {
//       query = query.gte('total_carbs', filters.carbs[0]).lte('total_carbs', filters.carbs[1]);
//     }
//     if (filters.sodium[0] !== 0 || filters.sodium[1] !== 5000) {
//       query = query.gte('sodium', filters.sodium[0]).lte('sodium', filters.sodium[1]);
//     }
//     if (filters.sugars[0] !== 0 || filters.sugars[1] !== 200) {
//       query = query.gte('sugars', filters.sugars[0]).lte('sugars', filters.sugars[1]);
//     }
//     if (filters.fibre[0] !== 0 || filters.fibre[1] !== 200) {
//       query = query.gte('fibre', filters.fibre[0]).lte('fibre', filters.fibre[1]);
//     }
  
//     filters.allergies.forEach((allergy) => {
//       if (allergy.checked) {
//         query = query.eq(allergy.key, true);
//       }
//     });
  
//     return query;
//   };
  

//   const fetchFoodItems = useCallback(
//     async (page: number, isNewSearch = false) => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         let query = supabase.from("products").select("*");

//         const startIndex = (page - 1) * 20;
//         const endIndex = page * 20 - 1;

//         query = query.range(startIndex, endIndex);

//         if (searchTerm) {
//           query = query.ilike("product_name", `%${searchTerm}%`);
//         }

//         if (sortOption !== "Default") {
//           const sortKey = sortKeyMap[sortOption];
//           if (sortKey) {
//             query = query.order(sortKey, {
//               ascending: sortOption.startsWith("Lowest"),
//               nullsFirst: false,
//             });
//             query = query.not(sortKey, "is", null); // Exclude items with null sortKey
//           }
//         }

//         query = applyFilters(query);

//         const { data, error } = await query;

//         if (error) {
//           throw new Error(error.message);
//         }

//         setFoodItems((prev) => {
//           const newItems = isNewSearch ? data : [...prev, ...data];
//           const uniqueItems = Array.from(new Set(newItems.map(item => item.prod_id)))
//             .map(id => newItems.find(item => item.prod_id === id));
//           return uniqueItems;
//         });

//         setHasMore(data.length === 20);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [filters, sortOption, searchTerm]
//   );

//   useEffect(() => {
//     setPage(1);
//     setFoodItems([]); // Clear food items on new search
//     fetchFoodItems(1, true); // Indicate that this is a new search
//   }, [filters, sortOption, searchTerm, fetchFoodItems]);

//   useEffect(() => {
//     if (page > 1) {
//       fetchFoodItems(page);
//     }
//   }, [page, fetchFoodItems]);

//   useEffect(() => {
//     const handleObserver = (entries: IntersectionObserverEntry[]) => {
//       const target = entries[0];
//       if (target.isIntersecting && !isLoading && hasMore) {
//         setPage((prev) => prev + 1);
//       }
//     };

//     const options = {
//       root: null,
//       rootMargin: "20px",
//       threshold: 0.1,
//     };

//     const observer = new IntersectionObserver(handleObserver, options);

//     if (loader.current) {
//       observer.observe(loader.current);
//     }

//     return () => {
//       if (loader.current) {
//         observer.disconnect();
//       }
//     };
//   }, [isLoading, hasMore]);

//   return (
//     <div className="flex flex-col pb-20 justify-start items-start hide-scrollbar h-full w-full gap-4 p-3 md:p-4 overflow-y-scroll">
//       <div className="w-full">
//         <SearchBarResponsive onSearch={setSearchTerm} />
//       </div>
//       <div className="w-full flex justify-end items-end space-x-2">
//         <Sort onSortChange={setSortOption} />
//         <ResetFiltersButton />
//       </div>

//       {error && (
//         <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
//           <p className="font-medium">Error: {error}</p>
//         </div>
//       )}

//       {isLoading && foodItems.length === 0 && (
//         <div className="w-full flex flex-col items-center gap-4 justify-center">
//           {[...Array(10)].map((_, index) => (
//             <LoadingCard key={index} />
//           ))}
//         </div>
//       )}

//       {!isLoading && foodItems.length === 0 && !error && (
//         <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
//           <p className="font-medium">No foods for current filters.</p>
//           <p>
//             We are constantly updating our site with new foods for you to
//             browse!
//           </p>
//         </div>
//       )}

//       {foodItems.map((item) => (
//         <FoodItem
//           key={item.prod_id}
//           item={item}
//           toggleView={toggleView}
//           onHighlightLocations={onHighlightLocations}
//         />
//       ))}

//       {isLoading && foodItems.length > 0 && (
//         <div className="w-full flex justify-center">
//           <LoadingCard />
//         </div>
//       )}

//       <div ref={loader}></div>
//     </div>
//   );
// }





"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import FoodItem from "./FoodItem";
import { supabase } from "@/supabaseClient";
import LoadingCard from "../restaurants/LoadingCard";
import Sort from "../../filters/Sort";
import SearchBarResponsive from "@/app/search/components/filters/filters-responsive/SearchBarResponsive";
import ResetFiltersButton from "./ResetFiltersButton";

type FiltersType = {
  allergies: { key: string; checked: boolean }[];
  cuisines: string[];
  calories: [number, number];
  fat: [number, number];
  protein: [number, number];
  carbs: [number, number];
  sodium: [number, number];
  sugars: [number, number];
  fibre: [number, number];
};

type Props = {
  filters: FiltersType;
  onHighlightLocations: (rest_id: string) => void;
  toggleView: any;
};

export default function FoodList({
  filters,
  onHighlightLocations,
  toggleView,
}: Props) {
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState<string>("Default");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const loader = useRef<HTMLDivElement | null>(null);

  const sortKeyMap: { [key: string]: string } = {
    "Lowest Calories": "calories",
    "Highest Calories": "calories",
    "Lowest Fat": "total_fat",
    "Highest Fat": "total_fat",
    "Lowest Protein": "protein",
    "Highest Protein": "protein",
    "Lowest Carbs": "total_carbs",
    "Highest Carbs": "total_carbs",
    "Lowest Sodium": "sodium",
    "Highest Sodium": "sodium",
    "Lowest Sugar": "sugars",
    "Highest Sugar": "sugars",
    "Lowest Fibre": "fibre",
    "Highest Fibre": "fibre",
  };

  const applyFilters = (query: any) => {
    if (filters.calories[0] !== 0 || filters.calories[1] !== 2000) {
      query = query.gte('calories', filters.calories[0]).lte('calories', filters.calories[1]);
    }
    if (filters.fat[0] !== 0 || filters.fat[1] !== 200) {
      query = query.gte('total_fat', filters.fat[0]).lte('total_fat', filters.fat[1]);
    }
    if (filters.protein[0] !== 0 || filters.protein[1] !== 100) {
      query = query.gte('protein', filters.protein[0]).lte('protein', filters.protein[1]);
    }
    if (filters.carbs[0] !== 0 || filters.carbs[1] !== 1000) {
      query = query.gte('total_carbs', filters.carbs[0]).lte('total_carbs', filters.carbs[1]);
    }
    if (filters.sodium[0] !== 0 || filters.sodium[1] !== 5000) {
      query = query.gte('sodium', filters.sodium[0]).lte('sodium', filters.sodium[1]);
    }
    if (filters.sugars[0] !== 0 || filters.sugars[1] !== 200) {
      query = query.gte('sugars', filters.sugars[0]).lte('sugars', filters.sugars[1]);
    }
    if (filters.fibre[0] !== 0 || filters.fibre[1] !== 200) {
      query = query.gte('fibre', filters.fibre[0]).lte('fibre', filters.fibre[1]);
    }

    filters.allergies.forEach((allergy) => {
      if (allergy.checked) {
        query = query.eq(allergy.key, true);
      }
    });

    return query;
  };

  const fetchFoodItems = useCallback(
    async (page: number, isNewSearch = false) => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase.from("products").select("*");

        const startIndex = (page - 1) * 20;
        const endIndex = page * 20 - 1;

        query = query.range(startIndex, endIndex);

        if (searchTerm) {
          query = query.ilike("product_name", `%${searchTerm}%`);
        }

        if (sortOption !== "Default") {
          const sortKey = sortKeyMap[sortOption];
          if (sortKey) {
            query = query.order(sortKey, {
              ascending: sortOption.startsWith("Lowest"),
              nullsFirst: false,
            });
            query = query.not(sortKey, "is", null); // Exclude items with null sortKey
          }
        }

        query = applyFilters(query);

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        setFoodItems((prev) => {
          const newItems = isNewSearch ? data : [...prev, ...data];
          const uniqueItems = Array.from(new Set(newItems.map(item => item.prod_id)))
            .map(id => newItems.find(item => item.prod_id === id));
          return uniqueItems;
        });

        setHasMore(data.length === 20);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, sortOption, searchTerm]
  );

  useEffect(() => {
    setPage(1);
    setFoodItems([]); // Clear food items on new search
    fetchFoodItems(1, true); // Indicate that this is a new search
  }, [filters, sortOption, searchTerm, fetchFoodItems]);

  useEffect(() => {
    if (page > 1) {
      fetchFoodItems(page);
    }
  }, [page, fetchFoodItems]);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.disconnect();
      }
    };
  }, [isLoading, hasMore]);

  return (
    <div className="flex flex-col pb-20 justify-start items-start hide-scrollbar h-full w-full gap-4 p-3 md:p-4 overflow-y-scroll">
      <div className="w-full">
        <SearchBarResponsive onSearch={setSearchTerm} />
      </div>
      <div className="w-full flex justify-end items-end space-x-2">
        <Sort onSortChange={setSortOption} />
        <ResetFiltersButton />
      </div>

      {error && (
        <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {isLoading && foodItems.length === 0 && (
        <div className="w-full flex flex-col items-center gap-4 justify-center">
          {[...Array(10)].map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      )}

      {!isLoading && foodItems.length === 0 && !error && (
        <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
          <p className="font-medium">No foods for current filters.</p>
          <p>
            We are constantly updating our site with new foods for you to
            browse!
          </p>
        </div>
      )}

      {foodItems.map((item) => (
        <FoodItem
          key={item.prod_id}
          item={item}
          toggleView={toggleView}
          onHighlightLocations={onHighlightLocations}
        />
      ))}

      {isLoading && foodItems.length > 0 && (
        <div className="w-full flex justify-center">
          <LoadingCard />
        </div>
      )}

      <div ref={loader}></div>
    </div>
  );
}
