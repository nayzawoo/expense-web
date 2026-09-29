import type { ComponentType } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

type CategoryIconProps = LucideProps & {
  name: string;
};

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const icons = LucideIcons as unknown as Record<
    string,
    ComponentType<LucideProps>
  >;
  const IconComponent = icons[name] ?? LucideIcons.Banknote;

  return <IconComponent {...props} />;
}
