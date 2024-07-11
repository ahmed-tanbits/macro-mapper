import React from "react";
import { WheatOff, MilkOff, NutOff, FishOff, Bean, EggOff, Flower2, ShieldOff, Leaf, Vegan, Milk, Nut, Fish, BeanOff, Egg, XCircle, ShieldCheck, Wheat } from "lucide-react";

type Product = {
  prod_id: string;
  rest_id: string;
  is_gluten_free: boolean | null;
  is_dairy_free: boolean | null;
  is_nut_free: boolean | null;
  is_shell_fish_free: boolean | null;
  is_soy_free: boolean | null;
  is_egg_free: boolean | null;
  is_sesame_free: boolean | null;
  is_sulfite_free: boolean | null;
  is_vegetarian: boolean | null;
  is_vegan: boolean | null;
};

type BadgeType = {
  label: string;
  isTrue: boolean;
  icon?: React.ReactNode;
};

const badgeData: { [key: string]: { label: string; icon?: React.ReactNode; falseLabel?: string; falseIcon?: React.ReactNode } } = {
  is_gluten_free: { label: "Gluten Free", icon: <WheatOff size={16} />, falseLabel: "Gluten", falseIcon: <Wheat size={16} /> },
  is_dairy_free: { label: "Dairy Free", icon: <MilkOff size={16} />, falseLabel: "Dairy", falseIcon: <Milk size={16} /> },
  is_nut_free: { label: "Nut Free", icon: <NutOff size={16} />, falseLabel: "Nut", falseIcon: <Nut size={16} /> },
  is_shell_fish_free: { label: "Shellfish Free", icon: <FishOff size={16} />, falseLabel: "Shellfish", falseIcon: <Fish size={16} /> },
  is_soy_free: { label: "Soy Free", icon: <BeanOff size={16} />, falseLabel: "Soy", falseIcon: <Bean size={16} /> },
  is_egg_free: { label: "Egg Free", icon: <EggOff size={16} />, falseLabel: "Egg", falseIcon: <Egg size={16} /> },
  is_sesame_free: { label: "Sesame Free", icon: <Flower2 size={16} />, falseLabel: "Sesame", falseIcon: <XCircle size={16} /> },
  is_sulfite_free: { label: "Sulfite Free", icon: <ShieldOff size={16} />, falseLabel: "Sulfite", falseIcon: <ShieldCheck size={16} /> },
  is_vegetarian: { label: "Vegetarian", icon: <Leaf size={16} />, falseLabel: "Non-Vegetarian", falseIcon: <Leaf size={16} /> },
  is_vegan: { label: "Vegan", icon: <Vegan size={16} />, falseLabel: "Non-Vegan", falseIcon: <Vegan size={16} /> },
};

const AllergenTags = ({ products }: { products: Product[] }) => {
  const badgeMap: { [key: string]: BadgeType } = {};

  (products || []).forEach(product => {
    Object.keys(badgeData).forEach(key => {
      const isTrue = product[key as keyof Product];
      if (isTrue === true || (isTrue === false && !badgeMap[key]?.isTrue)) {
        badgeMap[key] = isTrue
          ? { label: badgeData[key].label, isTrue, icon: badgeData[key].icon }
          : { label: badgeData[key].falseLabel || badgeData[key].label, isTrue, icon: badgeData[key].falseIcon };
      }
    });
  });

  const badges = Object.values(badgeMap).filter(badge => badge.isTrue !== null);

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => (
        <Badge key={index} {...badge} />
      ))}
    </div>
  );
};

const Badge = ({ label, isTrue, icon }: BadgeType) => {
  return (
    <span className={`text-sm px-2 py-1 rounded-lg flex gap-1 items-center justify-center text-neutral-700`}>
      {icon}
      {label}
    </span>
  );
};

export default AllergenTags;
