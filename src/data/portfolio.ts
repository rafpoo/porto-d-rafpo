import type { IconType } from "react-icons";
import {
  SiDocker,
  SiFirebase,
  SiGithubactions,
  SiKotlin,
  SiMysql,
  SiNginx,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import type {
  NavItem,
  PortfolioProject,
  SkillGroup,
  SocialLink,
  TimelineItem,
} from "../types";

export const publicAssetUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const CV_URL = publicAssetUrl("Rafael_Nicholas_Po_CV.pdf");
export const STRAW_HAT_URL = publicAssetUrl("assets/straw-hat.png");
export const PROFILE_IMAGE_URL = publicAssetUrl("assets/profile.png");
export const WANTED_POSTER_URL = publicAssetUrl("assets/wanted-poster.png");

export const navItems: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#journey" },
  { label: "CV", href: "#cv" },
  { label: "Contact", href: "#contact" },
];

export const projects: PortfolioProject[] = [
  {
    title: "MAXIMA UMN 2025 Platform",
    description:
      "Built and maintained REST APIs and responsive frontend features for a production-grade campus orientation platform serving 2,000+ users.",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Express.js",
      "MySQL",
      "Sequelize",
    ],
    image: { label: "North harbor", theme: "lagoon" },
    links: [
      {
        label: "Client Web",
        href: "https://github.com/MAXIMA-2025/mxm25-app-client",
        icon: "github",
      },
      {
        label: "Internal Web",
        href: "https://github.com/MAXIMA-2025/mxm25-app-internal",
        icon: "github",
      },
      {
        label: "API",
        href: "https://github.com/MAXIMA-2025/mxm25-server-internal",
        icon: "github",
      },
      {
        label: "Mailer",
        href: "https://github.com/MAXIMA-2025/mxm25-app-mailer",
        icon: "github",
      },
    ],
    category: "Full Stack",
  },
  {
    title: "MAXIMA Ticketing & Payments",
    description:
      "Implemented Google OAuth2, Apereo CAS SSO, Midtrans payment integration, Git-based collaboration, Docker deployment, CI/CD, and Nginx load balancing.",
    stack: [
      "OAuth2",
      "CAS SSO",
      "Midtrans",
      "Nginx",
      "GitHub Actions",
      "DigitalOcean",
    ],
    image: { label: "Gold route", theme: "sunset" },
    links: [
      {
        label: "Client Web",
        href: "https://github.com/MAXIMA-2025/mxm25-app-client",
        icon: "github",
      },
      {
        label: "Internal Web",
        href: "https://github.com/MAXIMA-2025/mxm25-app-internal",
        icon: "github",
      },
      {
        label: "API",
        href: "https://github.com/MAXIMA-2025/mxm25-server-internal",
        icon: "github",
      },
      {
        label: "Mailer",
        href: "https://github.com/MAXIMA-2025/mxm25-app-mailer",
        icon: "github",
      },
    ],
    category: "Infrastructure",
  },
  {
    title: "TrustEnd Attendance App",
    description:
      "Building a React Native employee attendance tracking app with trust scoring, GPS/WiFi validation, multi-tenant organizations, offline sync, and retry logic.",
    stack: [
      "React Native",
      "Expo Router",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Zustand",
    ],
    image: { label: "Trust route", theme: "lagoon" },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/rafpoo/TrustEnd",
        icon: "github",
      },
    ],
    category: "Mobile",
  },
  {
    title: "MEDEASE Medical Service App",
    description:
      "Developed an Android medical service app with clean architecture, Firebase authentication, Firestore, appointment booking, maps, push notifications, and an admin dashboard.",
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "Firebase Auth",
      "Firestore",
      "Google Maps",
    ],
    image: { label: "Storm chart", theme: "storm" },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/rafpoo/MedEase",
        icon: "github",
      },
    ],
    category: "Mobile",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "Java",
      "Python",
      "Kotlin",
    ],
  },
  {
    label: "Frameworks",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "shadcn/ui",
      "Express.js",
      "Node.js",
      "Laravel",
      "Jetpack Compose",
    ],
  },
  {
    label: "Databases",
    items: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Supabase",
      "Sequelize ORM",
    ],
  },
  {
    label: "DevOps & Tools",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "GitHub Actions",
      "Nginx",
      "Vercel",
      "Cloudflare",
      "DigitalOcean",
      "Postman",
    ],
  },
];

export const timelineItems: TimelineItem[] = [
  {
    date: "Aug 2023 - Present",
    title: "Universitas Multimedia Nusantara",
    description:
      "Informatics undergraduate, 7th semester, with a 3.86 / 4.00 GPA, expected graduation in 2027, and coursework in data structures, databases, software engineering, mobile, and web development.",
  },
  {
    date: "Jan - Nov 2025",
    title: "MAXIMA UMN 2025 Web Division Coordinator",
    description:
      "Led a 6-member developer team while shipping a production-grade campus orientation platform for 2,000+ users with REST APIs, React UI, authentication, payments, and deployment responsibilities.",
  },
  {
    date: "Jul - Dec 2025",
    title: "MEDEASE Full Stack Developer",
    description:
      "Built a medical service Android app with Firebase-backed authentication, cloud storage, appointment booking, maps, notifications, and admin monitoring.",
  },
  {
    date: "Apr - Jun 2026",
    title: "TrustEnd Full Stack Mobile Developer",
    description:
      "Building an Expo-based attendance tracking app with trust scoring, GPS/WiFi validation, Supabase authentication, Row Level Security, PostgreSQL, and offline sync.",
  },
];

export const socialLinks: SocialLink[] = [
  { label: "Email", href: "mailto:3k.raffs@gmail.com", icon: "mail" },
  { label: "Phone", href: "tel:+6287753036926", icon: "phone" },
  { label: "GitHub", href: "https://github.com/rafpoo", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/rafael-po-71507233a",
    icon: "linkedin",
  },
];

export const certifications = [
  "Huawei HCIA-AI V3.5",
  "Huawei HCIA-openGauss V1.0",
];

export const heroStackStreamItems: {
  Icon: IconType;
  label: string;
  className: string;
}[] = [
  { Icon: SiReact, label: "React", className: "tech-icon-react" },
  { Icon: SiNodedotjs, label: "Node.js", className: "tech-icon-node" },
  { Icon: SiMysql, label: "MySQL", className: "tech-icon-mysql" },
  { Icon: SiSupabase, label: "Supabase", className: "tech-icon-supabase" },
  { Icon: SiDocker, label: "Docker", className: "tech-icon-docker" },
  { Icon: SiNginx, label: "Nginx", className: "tech-icon-nginx" },
  {
    Icon: SiGithubactions,
    label: "GitHub Actions",
    className: "tech-icon-actions",
  },
  { Icon: SiKotlin, label: "Kotlin", className: "tech-icon-kotlin" },
  { Icon: SiFirebase, label: "Firebase", className: "tech-icon-firebase" },
  { Icon: SiPostgresql, label: "PostgreSQL", className: "tech-icon-postgres" },
  {
    Icon: SiTypescript,
    label: "TypeScript",
    className: "tech-icon-typescript",
  },
  {
    Icon: SiTailwindcss,
    label: "Tailwind CSS",
    className: "tech-icon-tailwind",
  },
];
