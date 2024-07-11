import React from "react";
import {
  WheatOff,
  MilkOff,
  NutOff,
  FishOff,
  BeanOff,
  EggOff,
  X,
  ShieldOff,
  Wheat,
  Milk,
  Nut,
  Fish,
  Bean,
  Egg,
  XCircle,
  ShieldCheck,
  Leaf,
  Vegan,
  Check,
} from "lucide-react";

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

type BadgeType = {
  label: string;
  isTrue: boolean;
  icon?: React.ReactNode;
};

const badgeData: {
  [key: string]: {
    label: string;
    icon?: React.ReactNode;
    falseLabel?: string;
    falseIcon?: React.ReactNode;
  };
} = {
  is_gluten_free: {
    label: "Gluten Free",
    icon: <WheatOff size={14} />,
    falseLabel: "Gluten",
    falseIcon: <Wheat size={14} />,
  },
  is_dairy_free: {
    label: "Dairy Free",
    icon: <MilkOff size={14} />,
    falseLabel: "Dairy",
    falseIcon: <Milk size={14} />,
  },
  is_nut_free: {
    label: "Nut Free",
    icon: <NutOff size={14} />,
    falseLabel: "Nuts",
    falseIcon: <Nut size={14} />,
  },
  is_shell_fish_free: {
    label: "Shellfish Free",
    icon: <FishOff size={14} />,
    falseLabel: "Shellfish",
    falseIcon: <Fish size={14} />,
  },
  is_soy_free: {
    label: "Soy Free",
    icon: <BeanOff size={14} />,
    falseLabel: "Soy",
    falseIcon: <Bean size={14} />,
  },
  is_egg_free: {
    label: "Egg Free",
    icon: <EggOff size={14} />,
    falseLabel: "Eggs",
    falseIcon: <Egg size={14} />,
  },
  is_sesame_free: {
    label: "Sesame Free",
    icon: <X size={14} />,
    falseLabel: "Sesame",
    falseIcon: <XCircle size={14} />,
  },
  is_sulfite_free: {
    label: "Sulfite Free",
    icon: <ShieldOff size={14} />,
    falseLabel: "Sulfite",
    falseIcon: <ShieldCheck size={14} />,
  },
  is_vegetarian: {
    label: "Vegetarian",
    icon: <Leaf size={14} />,
    falseLabel: "Non-Vegetarian",
    falseIcon: <Leaf size={14} />,
  },
  is_vegan: {
    label: "Vegan",
    icon: <Vegan size={14} />,
    falseLabel: "Non-Vegan",
    falseIcon: <Vegan size={14} />,
  },
};

const BadgeList = ({ products }: { products?: Product[] }) => {
  const badgeMap: { [key: string]: BadgeType } = {};

  (products || []).forEach((product) => {
    Object.keys(badgeData).forEach((key) => {
      const isTrue = product[key as keyof Product];
      if (isTrue === true || (isTrue === false && !badgeMap[key]?.isTrue)) {
        badgeMap[key] = isTrue
          ? { label: badgeData[key].label, isTrue, icon: badgeData[key].icon }
          : {
              label: badgeData[key].falseLabel || badgeData[key].label,
              isTrue: false,
              icon: badgeData[key].falseIcon || <X size={14} />,
            };
      }
    });
  });

  const badges = Object.values(badgeMap).filter(
    (badge) => badge.isTrue !== null
  );

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
    <span
      className={`text-xs px-2 py-1 rounded-full flex gap-1 items-center justify-center ${
        isTrue
          ? "text-primary-700 bg-primary-500 bg-opacity-15 border border-primary-500  border-opacity-50"
          : "text-yellow-700 bg-yellow-500 bg-opacity-15 border border-yellow-500 border-opacity-50"
      }`}
    >
      {icon}
      {label}
    </span>
  );
};

export default BadgeList;
