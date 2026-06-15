import { PROFILE_IMAGE_URL, projects } from "../../data/portfolio";
import {
  GsapAboutScrollytelling,
  GsapBountyCarousel,
  GsapBountyCounter,
} from "../GsapVoyageEffects";
import { Section } from "../Section";

export function About() {
  return (
    <Section
      id="about"
      eyebrow="Wanted for good craft"
      title="About the Captain"
    >
      <GsapAboutScrollytelling projects={projects}>
        <article
          className="wanted-poster about-profile-card gsap-hover-card"
          data-gsap-hover="static"
        >
          <div className="poster-header">
            <span>Wanted</span>
            <small>For shipping thoughtful products</small>
          </div>
          <div className="portrait-frame" aria-label="Rafael Po portrait">
            <img
              className="portrait-image"
              src={PROFILE_IMAGE_URL}
              alt="Rafael Po portrait"
              decoding="async"
            />
          </div>
          <h3>Rafael Po</h3>
          <p>
            Informatics student at Universitas Multimedia Nusantara focused on
            full-stack web development, readable code, REST APIs, admin
            dashboards, and practical production systems.
          </p>
        </article>

        <div className="about-copy about-story-copy">
          <p>
            I am a 7th semester Informatics undergraduate at Universitas
            Multimedia Nusantara with a 3.86 GPA and expected graduation in
            2027. I build maintainable applications with React, TypeScript,
            Node.js, and MySQL / PostgreSQL, and I communicate progress clearly
            in collaborative team environments.
          </p>
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
        </div>
      </GsapAboutScrollytelling>
    </Section>
  );
}
