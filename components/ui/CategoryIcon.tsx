import { HairIcon, LeafIcon, SkinIcon } from "./BeautyIcons";
export default function CategoryIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = name === "skin" ? SkinIcon : name === "hair" ? HairIcon : LeafIcon;
  return <Icon size={size} />;
}
