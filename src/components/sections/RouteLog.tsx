import { GsapRouteLogbook } from "../GsapVoyageEffects";
import { Section } from "../Section";

export function RouteLog() {
  return (
    <Section
      id="route-log"
      eyebrow="Route log"
      title="Engineering Route Map"
    >
      <GsapRouteLogbook />
    </Section>
  );
}
