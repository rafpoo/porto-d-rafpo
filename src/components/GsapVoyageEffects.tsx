import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { Compass, Database, LockKeyhole, Sailboat, ServerCog, Sparkles, Smartphone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type BountyCounterProps = {
  decimals?: number;
  label: string;
  suffix?: string;
  useGrouping?: boolean;
  value: number;
};

const STRAW_HAT_URL = `${import.meta.env.BASE_URL}assets/straw-hat.png`;

const routeLogItems = [
  {
    icon: ServerCog,
    label: '01',
    title: 'API Harbor',
    text: 'REST APIs, clean CRUD flows, and Sequelize models for production campus platforms.',
    tools: ['Express.js', 'Node.js', 'Sequelize'],
  },
  {
    icon: LockKeyhole,
    label: '02',
    title: 'Auth Gate',
    text: 'OAuth2, Apereo CAS SSO, Supabase auth, and Row Level Security for safer access control.',
    tools: ['OAuth2', 'CAS SSO', 'Supabase RLS'],
  },
  {
    icon: Database,
    label: '03',
    title: 'Data Reef',
    text: 'Relational schemas, admin dashboards, ticketing flows, payment states, and reporting views.',
    tools: ['MySQL', 'PostgreSQL', 'Midtrans'],
  },
  {
    icon: Smartphone,
    label: '04',
    title: 'Mobile Island',
    text: 'Attendance, medical booking, offline sync, maps, notifications, and Android-first workflows.',
    tools: ['React Native', 'Kotlin', 'Firebase'],
  },
];

function formatCounter(value: number, decimals: number, suffix = '', useGrouping = true) {
  return `${value.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    useGrouping,
  })}${suffix}`;
}

export function useGsapHoverEffects(scopeRef: RefObject<HTMLElement | null>) {
  useGSAP(
    (_, contextSafe) => {
      const root = scopeRef.current;

      if (!root || !contextSafe) {
        return;
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cards = gsap.utils.toArray<HTMLElement>('.gsap-hover-card', root);
      const links = gsap.utils.toArray<HTMLElement>('.gsap-hover-link', root);

      gsap.set([...cards, ...links], {
        transformOrigin: '50% 50%',
      });

      if (reduceMotion) {
        return;
      }

      const hoverIcons = 'svg, .brand-emblem, .cv-summary-icon, .route-log-index';

      cards.forEach((card, index) => {
        card.dataset.gsapTilt = card.dataset.gsapTilt ?? (index % 2 === 0 ? '-0.45' : '0.45');
      });

      const handleCardEnter = contextSafe((event: Event) => {
        const target = event.currentTarget as HTMLElement;
        const tilt = Number(target.dataset.gsapTilt ?? 0.45);
        const isCompact = window.matchMedia('(max-width: 680px)').matches;

        gsap.to(target, {
          duration: 0.38,
          ease: 'power3.out',
          overwrite: 'auto',
          rotation: isCompact ? 0 : tilt,
          scale: 1.012,
          y: isCompact ? -4 : -8,
        });

        gsap.to(target.querySelectorAll(hoverIcons), {
          duration: 0.38,
          ease: 'power3.out',
          overwrite: 'auto',
          rotation: -6,
          scale: 1.08,
        });
      });

      const handleCardLeave = contextSafe((event: Event) => {
        const target = event.currentTarget as HTMLElement;

        gsap.to(target, {
          duration: 0.32,
          ease: 'power2.out',
          overwrite: 'auto',
          rotation: 0,
          scale: 1,
          y: 0,
        });

        gsap.to(target.querySelectorAll(hoverIcons), {
          duration: 0.32,
          ease: 'power2.out',
          overwrite: 'auto',
          rotation: 0,
          scale: 1,
          x: 0,
        });
      });

      const handleLinkEnter = contextSafe((event: Event) => {
        const target = event.currentTarget as HTMLElement;

        gsap.to(target, {
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
          scale: 1.025,
          y: -3,
        });

        gsap.to(target.querySelectorAll('svg'), {
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
          rotation: -8,
          scale: 1.12,
          x: 3,
        });
      });

      const handleLinkLeave = contextSafe((event: Event) => {
        const target = event.currentTarget as HTMLElement;

        gsap.to(target, {
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
          scale: 1,
          y: 0,
        });

        gsap.to(target.querySelectorAll('svg'), {
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
          rotation: 0,
          scale: 1,
          x: 0,
        });
      });

      cards.forEach((card) => {
        card.addEventListener('pointerenter', handleCardEnter);
        card.addEventListener('pointerleave', handleCardLeave);
      });

      links.forEach((link) => {
        link.addEventListener('pointerenter', handleLinkEnter);
        link.addEventListener('pointerleave', handleLinkLeave);
      });

      return () => {
        cards.forEach((card) => {
          card.removeEventListener('pointerenter', handleCardEnter);
          card.removeEventListener('pointerleave', handleCardLeave);
        });

        links.forEach((link) => {
          link.removeEventListener('pointerenter', handleLinkEnter);
          link.removeEventListener('pointerleave', handleLinkLeave);
        });
      };
    },
    { scope: scopeRef },
  );
}

export function GsapStrawHatStory() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const wrapper = scope.current;
      const hat = wrapper?.querySelector<HTMLImageElement>('.straw-hat-story-image');
      const dock = document.querySelector<HTMLElement>('.straw-hat-dock');
      const dockImage = document.querySelector<HTMLImageElement>('.straw-hat-dock-image');
      const about = document.querySelector<HTMLElement>('#about');

      if (!wrapper || !hat || !dock || !dockImage || !about) {
        return;
      }

      if (reduceMotion) {
        gsap.set(wrapper, { autoAlpha: 0 });
        gsap.set(dockImage, { autoAlpha: 1, scale: 1, rotation: 45 });
        return;
      }

      const getDockOffset = () => {
        const dockRect = dock.getBoundingClientRect();
        const centerX = dockRect.left + dockRect.width / 2;
        const centerY = dockRect.top + dockRect.height / 2;

        return {
          x: centerX - window.innerWidth / 2,
          y: centerY - window.innerHeight / 2,
        };
      };

      const getEndScale = () => (window.innerWidth < 680 ? 0.34 : 0.2);

      gsap.set(wrapper, {
        autoAlpha: 0,
        left: '50%',
        pointerEvents: 'none',
        position: 'fixed',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        zIndex: 52,
      });

      gsap.set(hat, {
        filter: 'drop-shadow(0 34px 44px rgba(3, 15, 28, 0.32))',
        rotation: -18,
        scale: 0.44,
        transformOrigin: '50% 52%',
        x: 0,
        y: 70,
      });

      gsap.set(dockImage, {
        autoAlpha: 0,
        rotation: 45,
        scale: 0.82,
        transformOrigin: '50% 52%',
      });

      const hatTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: about,
          start: 'top bottom',
          end: 'top 20%',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      hatTimeline
        .to(
          wrapper,
          {
            autoAlpha: 1,
            duration: 0.08,
            ease: 'none',
          },
          0,
        )
        .to(
          hat,
          {
            duration: 0.38,
            ease: 'power1.inOut',
            rotation: 250,
            scale: () => (window.innerWidth < 680 ? 1.38 : 1.22),
            x: 0,
            y: () => (window.innerWidth < 680 ? -8 : 0),
          },
          0.08,
        )
        .to(
          hat,
          {
            duration: 0.54,
            ease: 'power2.inOut',
            rotation: 765,
            scale: getEndScale,
            x: () => getDockOffset().x,
            y: () => getDockOffset().y,
          },
          0.44,
        )
        .to(
          dockImage,
          {
            autoAlpha: 1,
            duration: 0.16,
            ease: 'none',
            rotation: 45,
            scale: 1,
          },
          0.82,
        )
        .to(
          wrapper,
          {
            autoAlpha: 0,
            duration: 0.18,
            ease: 'none',
          },
          0.86,
        );

      gsap.to(dockImage, {
        y: -8,
        duration: 3.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: dock,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play pause resume pause',
        },
      });

      ScrollTrigger.refresh();
    },
    { scope },
  );

  return (
    <div className="straw-hat-story" ref={scope} aria-hidden="true">
      <img className="straw-hat-story-image" src={STRAW_HAT_URL} alt="" decoding="async" />
    </div>
  );
}

export function GsapBountyCarousel({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  useGSAP(
    () => {
      const root = scope.current;

      if (!root) {
        return;
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const track = root.querySelector<HTMLElement>('.bounty-carousel-track');
      const firstSet = root.querySelector<HTMLElement>('.bounty-carousel-set');

      if (!track || !firstSet) {
        return;
      }

      if (reduceMotion) {
        gsap.set(track, { clearProps: 'all' });
        return;
      }

      const createLoop = () => {
        const gap = Number.parseFloat(getComputedStyle(track).columnGap || '0');
        const distance = firstSet.offsetWidth + gap;

        gsap.set(track, { x: 0 });

        return gsap.to(track, {
          duration: 14,
          ease: 'none',
          repeat: -1,
          x: -distance,
        });
      };

      let loop = createLoop();

      const handleResize = () => {
        loop.kill();
        loop = createLoop();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        loop.kill();
        window.removeEventListener('resize', handleResize);
      };
    },
    { scope },
  );

  return (
    <div className="bounty-carousel" ref={scope}>
      <div className="bounty-carousel-track">
        <div className="bounty-carousel-set">
          {items.map((item, index) =>
            isValidElement(item)
              ? cloneElement(item as ReactElement<Record<string, unknown>>, {
                  key: `bounty-${index}`,
                })
              : item,
          )}
        </div>
        <div className="bounty-carousel-set" aria-hidden="true">
          {items.map((item, index) =>
            isValidElement(item)
              ? cloneElement(item as ReactElement<Record<string, unknown>>, {
                  key: `bounty-clone-${index}`,
                })
              : item,
          )}
        </div>
      </div>
    </div>
  );
}

export function GsapHeroConstellation() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const paths = gsap.utils.toArray<SVGPathElement>('.gsap-constellation-path');

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: reduceMotion ? 0 : length });
      });

      if (reduceMotion) {
        gsap.set('.gsap-map-node, .gsap-current-dot', { autoAlpha: 0.78, scale: 1 });
        return;
      }

      const mapTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      mapTimeline
        .to('.gsap-constellation-path', {
          strokeDashoffset: 0,
          duration: 3.2,
          ease: 'power2.inOut',
          stagger: 0.22,
        })
        .to(
          '.gsap-constellation-path',
          {
            strokeDashoffset: (_, target: SVGPathElement) => -target.getTotalLength(),
            duration: 3.2,
            ease: 'power2.inOut',
            stagger: 0.18,
          },
          '+=0.3',
        );

      gsap.to('.gsap-map-node', {
        autoAlpha: 0.95,
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        scale: 1.28,
        stagger: { amount: 1.1, from: 'random' },
        yoyo: true,
      });

      gsap.to('.gsap-current-dot', {
        duration: 5.8,
        ease: 'sine.inOut',
        repeat: -1,
        stagger: 0.6,
        x: (index) => (index % 2 === 0 ? 24 : -18),
        y: (index) => (index % 2 === 0 ? -18 : 22),
        yoyo: true,
      });

      gsap.to('.gsap-hero-compass', {
        duration: 18,
        ease: 'none',
        repeat: -1,
        rotation: 360,
        transformOrigin: '50% 50%',
      });
    },
    { scope },
  );

  return (
    <div className="gsap-hero-constellation" ref={scope} aria-hidden="true">
      <svg viewBox="0 0 760 420" className="gsap-constellation-svg">
        <path
          className="gsap-constellation-path"
          d="M78 276 C164 138 296 104 396 184 C486 256 576 206 696 94"
        />
        <path
          className="gsap-constellation-path"
          d="M122 326 C222 258 306 294 390 238 C478 180 542 122 636 144"
        />
        <circle className="gsap-map-node" cx="78" cy="276" r="7" />
        <circle className="gsap-map-node" cx="396" cy="184" r="8" />
        <circle className="gsap-map-node" cx="696" cy="94" r="7" />
        <circle className="gsap-map-node" cx="390" cy="238" r="6" />
      </svg>
      <span className="gsap-current-dot gsap-current-dot-one">
        <Sparkles size={18} />
      </span>
      <span className="gsap-current-dot gsap-current-dot-two">
        <Sailboat size={20} />
      </span>
      <span className="gsap-hero-compass">
        <Compass size={42} />
      </span>
    </div>
  );
}

export function GsapBountyCounter({
  decimals = 0,
  label,
  suffix,
  useGrouping = true,
  value,
}: BountyCounterProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const target = valueRef.current;

      if (!target) {
        return;
      }

      const setValue = (nextValue: number) => {
        target.textContent = formatCounter(nextValue, decimals, suffix, useGrouping);
      };

      if (reduceMotion) {
        setValue(value);
        return;
      }

      const counter = { value: 0 };
      gsap.to(counter, {
        value,
        duration: 1.45,
        ease: 'power3.out',
        onUpdate: () => setValue(counter.value),
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 82%',
          once: true,
        },
      });
    },
    { scope: cardRef },
  );

  return (
    <div className="bounty-card gsap-bounty-card" ref={cardRef}>
      <strong ref={valueRef}>{formatCounter(value, decimals, suffix, useGrouping)}</strong>
      <span>{label}</span>
    </div>
  );
}

export function GsapJourneyRoute() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const path = scope.current?.querySelector<SVGPathElement>('.gsap-journey-route-path');

      if (!path) {
        return;
      }

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: reduceMotion ? 0 : length });

      if (reduceMotion) {
        gsap.set('.gsap-route-island, .gsap-route-ship', { autoAlpha: 1, scale: 1 });
        return;
      }

      const routeTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 82%',
          end: 'bottom 45%',
          scrub: 1,
        },
      });

      routeTimeline
        .to(path, { strokeDashoffset: 0, ease: 'none' })
        .from(
          '.gsap-route-island',
          {
            autoAlpha: 0,
            ease: 'back.out(1.7)',
            scale: 0.35,
            stagger: 0.16,
            transformOrigin: '50% 50%',
          },
          0.05,
        )
        .fromTo(
          '.gsap-route-ship',
          { autoAlpha: 0, x: -80, y: 32, rotation: -8 },
          { autoAlpha: 1, x: 0, y: 0, rotation: 0, ease: 'power1.out' },
          0.2,
        );
    },
    { scope },
  );

  return (
    <div className="gsap-journey-route" ref={scope} aria-hidden="true">
      <svg viewBox="0 0 960 220">
        <path
          className="gsap-journey-route-path"
          d="M72 148 C192 42 304 190 426 94 C548 -2 638 170 774 78 C842 32 882 56 918 92"
        />
        <circle className="gsap-route-island" cx="72" cy="148" r="16" />
        <circle className="gsap-route-island" cx="426" cy="94" r="18" />
        <circle className="gsap-route-island" cx="774" cy="78" r="15" />
        <g className="gsap-route-ship" transform="translate(852 70)">
          <path d="M0 32 L96 32 L78 54 L20 54 Z" />
          <path d="M42 0 L42 32 L8 32 Z" />
          <path d="M48 8 L48 32 L84 32 Z" />
        </g>
      </svg>
    </div>
  );
}

export function GsapRouteLogbook() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const path = scope.current?.querySelector<SVGPathElement>('.gsap-logbook-path');

      if (!path) {
        return;
      }

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: reduceMotion ? 0 : length });

      if (reduceMotion) {
        gsap.set('.gsap-logbook-island, .gsap-logbook-ship, .route-log-card', {
          autoAlpha: 1,
          scale: 1,
          y: 0,
        });
        return;
      }

      const routeTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 78%',
          end: 'bottom 42%',
          scrub: 1,
        },
      });

      routeTimeline
        .to(path, { strokeDashoffset: 0, ease: 'none' })
        .from(
          '.gsap-logbook-island',
          {
            autoAlpha: 0,
            ease: 'back.out(1.5)',
            scale: 0.35,
            stagger: 0.12,
            transformOrigin: '50% 50%',
          },
          0.04,
        )
        .from(
          '.route-log-card',
          {
            autoAlpha: 0,
            ease: 'power2.out',
            rotation: (index) => (index % 2 === 0 ? -1.4 : 1.4),
            stagger: 0.1,
            y: 34,
          },
          0.1,
        )
        .fromTo(
          '.gsap-logbook-ship',
          { autoAlpha: 0, rotation: -10, x: -70, y: 20 },
          { autoAlpha: 1, ease: 'none', rotation: 0, x: 0, y: 0 },
          0.18,
        );

      gsap.to('.route-log-current', {
        duration: 2.8,
        ease: 'sine.inOut',
        repeat: -1,
        scale: 1.16,
        yoyo: true,
      });
    },
    { scope },
  );

  return (
    <div className="gsap-route-logbook" ref={scope}>
      <div className="route-log-map" aria-hidden="true">
        <svg viewBox="0 0 1020 260">
          <path
            className="gsap-logbook-path"
            d="M70 188 C176 64 274 76 354 146 C446 226 550 220 632 126 C720 24 826 50 948 106"
          />
          <circle className="gsap-logbook-island" cx="70" cy="188" r="18" />
          <circle className="gsap-logbook-island" cx="354" cy="146" r="20" />
          <circle className="gsap-logbook-island" cx="632" cy="126" r="18" />
          <circle className="gsap-logbook-island route-log-current" cx="948" cy="106" r="20" />
          <g className="gsap-logbook-ship" transform="translate(868 86)">
            <path d="M0 30 L86 30 L70 50 L16 50 Z" />
            <path d="M38 0 L38 30 L8 30 Z" />
            <path d="M44 7 L44 30 L78 30 Z" />
          </g>
        </svg>
      </div>

      <div className="route-log-grid">
        {routeLogItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <article
              className="route-log-card gsap-hover-card"
              data-gsap-tilt={index % 2 === 0 ? '-0.45' : '0.45'}
              key={item.title}
            >
              <div className="route-log-index">
                <Icon size={22} />
                <span>{item.label}</span>
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <ul aria-label={`${item.title} technologies`}>
                {item.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
