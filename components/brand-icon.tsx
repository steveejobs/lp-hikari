import Image from "next/image";
import brandIcon from "@/app/icon.png";

type BrandIconProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function BrandIcon({ className, priority, sizes }: BrandIconProps) {
  return (
    <Image
      src={brandIcon}
      alt=""
      className={className}
      priority={priority}
      sizes={sizes}
      aria-hidden="true"
      data-brand-icon
      draggable={false}
    />
  );
}
