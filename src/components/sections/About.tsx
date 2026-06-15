import { projects, WANTED_POSTER_URL } from "../../data/portfolio";
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
          className="wanted-poster wanted-poster-art about-profile-card gsap-hover-card"
          data-gsap-hover="static"
          aria-label="Wanted poster for Rafael Po"
        >
          <img
            className="wanted-poster-image"
            src={WANTED_POSTER_URL}
            alt="Wanted poster featuring Rafael Po"
            decoding="async"
          />
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
