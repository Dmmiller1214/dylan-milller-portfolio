import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { Skills } from "@/components/sections/skills";
import { Container, SectionRule } from "@/components/section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Container>
        <SectionRule />
      </Container>
      <About />
      <Skills />
      <Contact />
    </>
  );
}
