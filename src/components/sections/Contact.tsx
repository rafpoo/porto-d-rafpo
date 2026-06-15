import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { socialLinks } from "../../data/portfolio";

const iconMap = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  phone: Phone,
};

export function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = useMemo(
    () => ({
      duration: shouldReduceMotion ? 0.01 : 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    }),
    [shouldReduceMotion],
  );

  return (
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
            Reach out for full-stack development, web platform work, Android app
            development, or software engineering collaboration.
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
  );
}
