type CheckboxOption = {
  id: number;
  label: string;
  checked: boolean;
};

type Product = {
  prod_id: string;
  rest_id: string;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_nut_free: boolean;
  is_shell_fish_free: boolean;
  is_soy_free: boolean;
  is_egg_free: boolean;
  is_sesame_free: boolean;
  is_sulfite_free: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
};

type MenuItem = {
  prod_id: string;
  rest_id: string;
  category: string;
  drink_or_food: string;
  product_name: string;
  product_description: string;
  image_id: string;
  price: number;
  serving_size: string;
  kj: number;
  calories: number;
  protein: number;
  total_fat: number;
  saturated_fat: number;
  total_carbs: number;
  sugars: number;
  fibre: number;
  sodium: number;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_nut_free: boolean;
  is_shell_fish_free: boolean;
  is_soy_free: boolean;
  is_egg_free: boolean;
  is_sesame_free: boolean;
  is_sulfite_free: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  distance: number;
};
type RestaurantProps = {
  location_id: string;
  restaurant_id: string;
  image_id: string;
  company_name: string;
  description: string;
  cuisine: string;
  google_link: string;
  address: string;
  phone: string;
  website: string;
  lat: number;
  long: number;
  open_mon: string;
  open_tues: string;
  open_wed: string;
  open_thur: string;
  open_fri: string;
  open_sat: string;
  open_sun: string;
  is_active: boolean;
  suburb: string;
  state: string;
  street: string;
  post_code: string;
  google_places_id: string;
  closed: boolean;
  products?: Product[];
};



type LocationItem = {
  location_id: string;
  restaurant_id: string;
  image_id: string;
  company_name: string;
  description: string;
  cuisine: string;
  google_link: string;
  address: string;
  phone: string;
  website: string;
  lat: number;
  long: number;
  open_mon: string;
  open_tues: string;
  open_wed: string;
  open_thur: string;
  open_fri: string;
  open_sat: string;
  open_sun: string;
  is_active: boolean;
  suburb: string;
  state: string;
  street: string;
  post_code: string;
  google_places_id: string;
  closed: boolean;
}