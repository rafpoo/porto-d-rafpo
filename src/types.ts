export type PortfolioProject = {
  title: string;
  description: string;
  stack: string[];
  image: {
    displayType?: "landscape" | "portrait";
    label: string;
    theme: "lagoon" | "sunset" | "storm";
  };
  links: {
    label: string;
    href: string;
    icon: "external" | "github";
  }[];
  category: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "mail" | "github" | "linkedin";
};

export type NavItem = {
  label: string;
  href: string;
};
