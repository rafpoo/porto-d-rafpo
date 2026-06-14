import {
  Anchor,
  Award,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  Map,
  Menu,
  Phone,
  Sailboat,
  Send,
  Telescope,
  X,
} from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiDocker,
  SiFirebase,
  SiGithubactions,
  SiKotlin,
  SiLaravel,
  SiMysql,
  SiNginx,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import {
  GsapBountyCarousel,
  GsapBountyCounter,
  GsapHeroConstellation,
  GsapJourneyRoute,
  GsapRouteLogbook,
  GsapStrawHatStory,
  useGsapHoverEffects,
} from "./components/GsapVoyageEffects";

type PortfolioProject = {
  title: string;
  description: string;
  stack: string[];
  image: {
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

type SkillGroup = {
  label: string;
  items: string[];
};

type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

type SocialLink = {
  label: string;
  href: string;
  icon: "mail" | "github" | "linkedin" | "phone";
};

const publicAssetUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const CV_URL = publicAssetUrl("Rafael_Nicholas_Po_CV.pdf");
const STRAW_HAT_URL = publicAssetUrl("assets/straw-hat.png");
const PROFILE_IMAGE_URL = publicAssetUrl("assets/profile.png");

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#journey" },
  { label: "CV", href: "#cv" },
  { label: "Contact", href: "#contact" },
];

const projects: PortfolioProject[] = [
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
        label: "GitHub Profile",
        href: "https://github.com/rafpoo",
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
    links: [{ label: "Discuss Project", href: "#contact", icon: "external" }],
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
        label: "GitHub Profile",
        href: "https://github.com/rafpoo",
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
        label: "GitHub Profile",
        href: "https://github.com/rafpoo",
        icon: "github",
      },
    ],
    category: "Mobile",
  },
];

const skillGroups: SkillGroup[] = [
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

const timelineItems: TimelineItem[] = [
  {
    date: "Aug 2023 - Present",
    title: "Universitas Multimedia Nusantara",
    description:
      "Informatics undergraduate, semester 6, with a 3.86 / 4.00 GPA, expected graduation in 2027, and coursework in data structures, databases, software engineering, mobile, and web development.",
  },
  {
    date: "2024",
    title: "Orientation & Festival Leadership",
    description:
      "Served as OMB UMN Person in Charge for 20 freshmen and as Hansan Festival security division liaison officer for guest-star coordination and event operations.",
  },
  {
    date: "Jan - Nov 2025",
    title: "MAXIMA UMN 2025 Web Division Coordinator",
    description:
      "Led a 6-member developer team while shipping a production-grade campus orientation platform for 2,000+ users with REST APIs, React UI, authentication, payments, and deployment responsibilities.",
  },
  {
    date: "Apr 2026 - Present",
    title: "TrustEnd Full Stack Mobile Developer",
    description:
      "Building an Expo-based attendance tracking app with trust scoring, GPS/WiFi validation, Supabase authentication, Row Level Security, PostgreSQL, and offline sync.",
  },
  {
    date: "Jul - Dec 2025",
    title: "MEDEASE Full Stack Developer",
    description:
      "Built a medical service Android app with Firebase-backed authentication, cloud storage, appointment booking, maps, notifications, and admin monitoring.",
  },
];

const socialLinks: SocialLink[] = [
  { label: "Email", href: "mailto:3k.raffs@gmail.com", icon: "mail" },
  { label: "Phone", href: "tel:+6287753036926", icon: "phone" },
  { label: "GitHub", href: "https://github.com/rafpoo", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/rafael-po-71507233a",
    icon: "linkedin",
  },
];

const iconMap = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  phone: Phone,
};

const projectIconMap = {
  external: ExternalLink,
  github: Github,
};

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 110, damping: 22 },
  },
};

const staggerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const loopTransition = (duration: number, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: "easeInOut" as const,
});

const linearLoopTransition = (duration: number, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: "linear" as const,
});

const heroStackStreamItems: {
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

function TechIcon({
  className,
  Icon,
  label,
}: {
  className?: string;
  Icon: IconType;
  label: string;
}) {
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

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const skyY = useTransform(
    scrollY,
    [0, 620],
    shouldReduceMotion ? [0, 0] : [0, 90],
  );
  const shipY = useTransform(
    scrollY,
    [0, 620],
    shouldReduceMotion ? [0, 0] : [0, 54],
  );
  const waveY = useTransform(
    scrollY,
    [0, 620],
    shouldReduceMotion ? [0, 0] : [0, 28],
  );
  useGsapHoverEffects(appRef);

  const motionTransition = useMemo(
    () => ({
      duration: shouldReduceMotion ? 0.01 : 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    }),
    [shouldReduceMotion],
  );

  return (
    <div className="app-shell" ref={appRef}>
      <GsapStrawHatStory />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <header className="site-header" aria-label="Primary navigation">
        <a
          className="brand-mark gsap-hover-link"
          href="#top"
          aria-label="Rafael's Voyage Log home"
        >
          <span
            className="brand-emblem nav-straw-hat-anchor"
            aria-hidden="true"
          >
            <img
              className="nav-straw-hat-image"
              src={STRAW_HAT_URL}
              alt=""
              decoding="async"
            />
          </span>
          <span>Rafael</span>
        </a>
        <nav className="desktop-nav" aria-label="Main menu">
          {navItems.map((item) => (
            <a className="gsap-hover-link" key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className="menu-button gsap-hover-link"
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.nav
            id="mobile-menu"
            className="mobile-nav"
            aria-label="Mobile menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={motionTransition}
          >
            {navItems.map((item) => (
              <a
                className="gsap-hover-link"
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <main id="main">
        <section
          className="hero-section"
          id="top"
          aria-labelledby="hero-heading"
        >
          <GsapHeroConstellation />
          <motion.svg
            className="hero-route-loop"
            viewBox="0 0 760 420"
            aria-hidden="true"
            initial={false}
          >
            <motion.path
              d="M54 296 C176 104 276 90 362 186 C458 294 596 286 704 98"
              animate={
                shouldReduceMotion
                  ? { pathLength: 1, pathOffset: 0 }
                  : {
                      pathLength: [0.12, 0.86, 0.12],
                      pathOffset: [0, 0.28, 0.92],
                    }
              }
              transition={loopTransition(9)}
            />
          </motion.svg>
          <motion.div
            className="hero-current-marker hero-current-marker-one"
            aria-hidden="true"
            animate={
              shouldReduceMotion
                ? undefined
                : { x: [0, 28, 0], y: [0, -14, 0], opacity: [0.42, 0.86, 0.42] }
            }
            transition={loopTransition(7)}
          >
            <TechIcon
              Icon={SiLaravel}
              label="TypeScript"
              className="tech-icon-laravel"
            />
          </motion.div>
          <motion.div
            className="hero-current-marker hero-current-marker-two"
            aria-hidden="true"
            animate={
              shouldReduceMotion
                ? undefined
                : { x: [0, -20, 0], y: [0, 18, 0], opacity: [0.36, 0.78, 0.36] }
            }
            transition={loopTransition(8.5, 0.4)}
          >
            <TechIcon
              Icon={SiNodedotjs}
              label="Node.js"
              className="tech-icon-node"
            />
          </motion.div>
          <motion.div
            className="hero-sky-map"
            style={{ y: skyY }}
            aria-hidden="true"
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={linearLoopTransition(58)}
          >
            <span className="tech-orbit-item tech-orbit-react">
              <TechIcon
                Icon={SiReact}
                label="React"
                className="tech-icon-react"
              />
            </span>
            <span className="tech-orbit-item tech-orbit-mysql">
              <TechIcon
                Icon={SiMysql}
                label="MySQL"
                className="tech-icon-mysql"
              />
            </span>
            <span className="tech-orbit-item tech-orbit-docker">
              <TechIcon
                Icon={SiDocker}
                label="Docker"
                className="tech-icon-docker"
              />
            </span>
          </motion.div>
          <motion.div
            className="hero-tech-layer"
            style={{ y: shipY }}
            aria-hidden="true"
          ></motion.div>
          <motion.div
            className="hero-stack-stream"
            style={{ y: waveY }}
            aria-hidden="true"
          >
            <GsapBountyCarousel>
              {heroStackStreamItems.map((item) => (
                <div className="hero-stack-carousel-card" key={item.label}>
                  <TechIcon
                    Icon={item.Icon}
                    label={item.label}
                    className={`${item.className} tech-icon-wide`}
                  />
                </div>
              ))}
            </GsapBountyCarousel>
          </motion.div>

          <motion.div
            className="hero-content"
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p className="eyebrow" variants={revealVariants}>
              Informatics Undergraduate / Full-Stack Developer
            </motion.p>
            <motion.h1 id="hero-heading" variants={revealVariants}>
              Rafael's Voyage Log
            </motion.h1>
            <motion.p className="hero-lede" variants={revealVariants}>
              I build clean, maintainable full-stack web applications with
              React, TypeScript, Node.js, and MySQL, shaped by production work
              serving 2,000+ campus users.
            </motion.p>
            <motion.div className="hero-actions" variants={revealVariants}>
              <a
                className="button button-primary gsap-hover-link"
                href="#projects"
              >
                <Map size={18} />
                View Projects
              </a>
              <a
                className="button button-secondary gsap-hover-link"
                href={CV_URL}
                target="_blank"
                rel="noreferrer"
              >
                <FileText size={18} />
                View CV
              </a>
              <a
                className="button button-secondary gsap-hover-link"
                href="#contact"
              >
                <Send size={18} />
                Send a Message
              </a>
            </motion.div>
          </motion.div>
        </section>

        <Section
          id="about"
          eyebrow="Wanted for good craft"
          title="About the Captain"
        >
          <div className="about-grid">
            <motion.article
              className="wanted-poster gsap-hover-card"
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="poster-header">
                <span>Wanted</span>
                <small>For shipping thoughtful products</small>
              </div>
              <div
                className="portrait-frame"
                aria-label="Rafael Po portrait"
              >
                <img
                  className="portrait-image"
                  src={PROFILE_IMAGE_URL}
                  alt="Rafael Po portrait"
                  decoding="async"
                />
              </div>
              <h3>Rafael Po</h3>
              <p>
                Informatics student at Universitas Multimedia Nusantara focused
                on full-stack web development, readable code, REST APIs, admin
                dashboards, and practical production systems.
              </p>
            </motion.article>

            <motion.div
              className="about-copy"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.p variants={revealVariants}>
                I am a 7th semester Informatics undergraduate at Universitas
                Multimedia Nusantara with a 3.86 GPA and expected graduation in
                2027. I build maintainable applications with React, TypeScript,
                Node.js, and MySQL / PostgreSQL, and I communicate progress
                clearly in collaborative team environments.
              </motion.p>
              <GsapBountyCarousel>
                <div className="bounty-carousel-card">
                  <GsapBountyCounter
                    value={3.86}
                    decimals={2}
                    label="Current GPA"
                  />
                </div>
                <div className="bounty-carousel-card">
                  <GsapBountyCounter
                    value={2000}
                    suffix="+"
                    label="Users Served"
                  />
                </div>
                <div className="bounty-carousel-card">
                  <GsapBountyCounter
                    value={2027}
                    label="Expected Graduation"
                    useGrouping={false}
                  />
                </div>
              </GsapBountyCarousel>
            </motion.div>
          </div>
        </Section>

        <Section
          id="projects"
          eyebrow="Treasure map"
          title="Selected Project Voyages"
        >
          <motion.div
            className="project-grid"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </motion.div>
        </Section>

        <Section
          id="route-log"
          eyebrow="Route log"
          title="Engineering Route Map"
        >
          <GsapRouteLogbook />
        </Section>

        <Section
          id="skills"
          eyebrow="Crew inventory"
          title="Tools for the Voyage"
        >
          <motion.div
            className="skill-grid"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {skillGroups.map((group) => (
              <motion.article
                className="skill-card gsap-hover-card"
                key={group.label}
                variants={revealVariants}
              >
                <div className="skill-card-header">
                  <Anchor size={20} />
                  <h3>{group.label}</h3>
                </div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </Section>

        <Section
          id="certifications"
          eyebrow="Credential chest"
          title="Certifications"
        >
          <motion.div
            className="certification-grid"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {["Huawei HCIA-AI V3.5", "Huawei HCIA-openGauss V1.0"].map(
              (certificate) => (
                <motion.article
                  className="certification-card gsap-hover-card"
                  key={certificate}
                  variants={revealVariants}
                >
                  <Award size={22} aria-hidden="true" />
                  <span>{certificate}</span>
                </motion.article>
              ),
            )}
          </motion.div>
        </Section>

        <Section id="journey" eyebrow="Island route" title="Journey Timeline">
          <GsapJourneyRoute />
          <div
            className="timeline"
            aria-label="Rafael's portfolio journey timeline"
          >
            {timelineItems.map((item, index) => (
              <motion.article
                className="timeline-item gsap-hover-card"
                key={item.title}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.06 }}
              >
                <span className="timeline-date">{item.date}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="cv" eyebrow="Captain's papers" title="View My CV">
          <motion.div
            className="cv-panel"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={motionTransition}
          >
            <div className="cv-summary gsap-hover-card">
              <div className="cv-summary-icon" aria-hidden="true">
                <GraduationCap size={28} />
              </div>
              <div>
                <h3>Rafael Nicholas Po - CV</h3>
                <p>
                  Includes education, technical skills, MAXIMA UMN production
                  platform experience, TrustEnd, MEDEASE, organizations, and
                  Huawei certifications.
                </p>
              </div>
              <div className="cv-actions">
                <a
                  className="button button-primary gsap-hover-link"
                  href={CV_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={18} />
                  Open CV
                </a>
                <a
                  className="button button-secondary cv-download gsap-hover-link"
                  href={CV_URL}
                  download
                >
                  <Download size={18} />
                  Download
                </a>
              </div>
            </div>
            <iframe
              className="cv-viewer"
              src={CV_URL}
              title="Rafael Nicholas Po CV PDF preview"
            />
          </motion.div>
        </Section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <motion.div
            className="contact-inner"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={motionTransition}
          >
            <div>
              <p className="eyebrow">Message in a bottle</p>
              <h2 id="contact-title">Ready to chart the next build?</h2>
              <p>
                Reach out for full-stack development, web platform work, Android
                app development, or software engineering collaboration.
              </p>
            </div>
            <div
              className="contact-actions"
              aria-label="Social and contact links"
            >
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon];
                return (
                  <a
                    className="button button-secondary gsap-hover-link"
                    href={link.href}
                    key={link.label}
                  >
                    <Icon size={18} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section
      className="content-section"
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`}>
          {id === "about" ? (
            <>
              About the Capta
              <span className="captain-hat-anchor">
                in
                <span className="straw-hat-dock" aria-hidden="true">
                  <img
                    className="straw-hat-dock-image"
                    src={STRAW_HAT_URL}
                    alt=""
                    decoding="async"
                  />
                </span>
              </span>
            </>
          ) : (
            title
          )}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      className="project-card gsap-hover-card"
      data-gsap-tilt={index % 2 === 0 ? "-0.45" : "0.45"}
      variants={revealVariants}
    >
      <motion.div
        className={`project-map project-map-${project.image.theme}`}
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                backgroundPosition: [
                  "0px 0px, 0px 0px",
                  "22px -18px, 0px 0px",
                  "0px 0px, 0px 0px",
                ],
              }
        }
        transition={loopTransition(10 + index)}
      >
        <span className="project-map-label">{project.image.label}</span>
        <motion.span
          className="project-boat"
          animate={
            shouldReduceMotion
              ? undefined
              : { y: [0, -7, 0], rotate: [-1.5, 2, -1.5] }
          }
          transition={loopTransition(4.4 + index * 0.35, index * 0.25)}
        >
          <Sailboat size={38} />
        </motion.span>
      </motion.div>
      <div className="project-body">
        <div className="project-meta">
          <span>{project.category}</span>
          <Telescope size={18} aria-hidden="true" />
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul
          className="stack-list"
          aria-label={`${project.title} technology stack`}
        >
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="project-actions">
          {project.links.map((link) => {
            const Icon = projectIconMap[link.icon];
            const isInternal = link.href.startsWith("#");

            return (
              <a
                className="gsap-hover-link"
                href={link.href}
                key={link.label}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noreferrer"}
              >
                {link.label}
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

export default App;
