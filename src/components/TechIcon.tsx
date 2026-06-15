import type { IconType } from "react-icons";

type TechIconProps = {
  className?: string;
  Icon: IconType;
  label: string;
};

export function TechIcon({ className, Icon, label }: TechIconProps) {
  return (
    <span
      className={`tech-icon ${className ?? ""}`}
      title={label}
      aria-label={label}
    >
      <Icon aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
