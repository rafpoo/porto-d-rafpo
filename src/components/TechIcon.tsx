import type { IconType } from "react-icons";

type TechIconProps = {
  className?: string;
  Icon: IconType;
  label: string;
};

export function TechIcon({ className, Icon, label }: TechIconProps) {
  const accessibleLabel = label.trim() || undefined;

  return (
    <span
      className={`tech-icon ${className ?? ""}`}
      role={accessibleLabel ? "img" : undefined}
      title={accessibleLabel}
      aria-label={accessibleLabel}
      aria-hidden={accessibleLabel ? undefined : true}
    >
      <Icon aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
