import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";
import { LucideIconStatic } from "./LucideIconStatic";

// Get all icon names from lucide-react static exports
// Filter to only icon components (PascalCase functions, exclude utilities)
// Convert to kebab-case for compatibility with IconSelector and LucideIconStatic
const iconNames = Object.keys(LucideIcons)
  .filter(
    (key) =>
      typeof (LucideIcons as Record<string, unknown>)[key] === "function" &&
      key[0] === key[0].toUpperCase() &&
      key !== "createLucideIcon" &&
      !key.endsWith("Icon") // Exclude deprecated *Icon aliases
  )
  .map((key) => key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase());

export const LucideIconList = iconNames;

export type LucideIconType = (typeof LucideIconList)[number];

export interface IconProps extends LucideProps {
  name: LucideIconType;
}

export { LucideIconStatic };
