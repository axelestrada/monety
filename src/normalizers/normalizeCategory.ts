import ICategory from "@/interfaces/category";

export const normalizeCategory = (category: any): ICategory => {
  return {
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    type: category.type,
  };
};