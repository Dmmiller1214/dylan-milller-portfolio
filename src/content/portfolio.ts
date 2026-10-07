/**
 * Single source of truth for every word and link on the site.
 *
 * Anything wrapped in square brackets — `[like this]` — is a placeholder. The
 * UI detects that bracket convention at render time, styles those strings so
 * they are visibly unfinished, and shows a draft notice while any remain.
 *
 * Nothing here is invented. No technology list, employment history, client
 * work, metric, testimonial or result is stated on Dylan's behalf. Fields that
 * have not been supplied are `null` or empty and the UI omits them.
 */

export type Placeholder = `[${string}]`;

/** Bracketed strings are unfinished content awaiting input. */
export function isPlaceholder(value: string | undefined | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.startsWith("[") && trimmed.endsWith("]");
}

/**
 * Strips the placeholder brackets. For strings that leave the page as plain
 * text — `<title>`, meta descriptions, `alt` and `aria-label` — where the
 * visual marker cannot be applied.
 */
export function plain(value: string): string {
  return value.replace(/^\s*\[|\]\s*$/g, "");
}

export type Profile = {
  name: string;
  role: string;
  /** Display line under the name. */
  headline: string;
  /** One or two sentences under the headline. */
  valueProposition: string;
  /** Short line in the masthead and footer. `null` hides the location. */
  location: string | null;
  /** Used for `<title>` templates and structured data. */
  siteUrl: string;
};

export const profile: Profile = {
  name: "Dylan Miller",
  role: "Frontend Developer",
  headline: "Thoughtful design. Engaging web experiences.",
  valueProposition:
    "I’m Dylan Miller, a frontend developer building responsive web interfaces with React, Next.js, and TypeScript. I’m looking for a junior frontend role where I can contribute to a product team and continue growing through hands-on development.",
  location: null,
  siteUrl: "https://dylan-milller-portfolio.vercel.app",
};

export type AboutContent = {
  /** Two to four paragraphs. Keep it personable and first person. */
  paragraphs: string[];
  /** Short, concrete interests. Hidden when empty. */
  interests: string[];
  /** Optional portrait. Leave `null` to show the marble relief instead. */
  portrait: { src: string; alt: string } | null;
};

export const about: AboutContent = {
  paragraphs: [
    "I enjoy combining design and development to create websites that look polished and feel intuitive. My projects explore interactive catalogs, business websites, animated interfaces, membership platforms, and AI-powered experiences.",
    "I’m looking to join a team where I can contribute to real projects, learn from experienced developers, and strengthen my frontend development skills.",
  ],
  interests: [],
  portrait: null,
};

export type SkillGroup = {
  title: string;
  /** Optional one line framing the group. Hidden when empty. */
  summary?: string;
  items: string[];
};

export const skillsIntro =
  "I build web experiences using modern frontend technologies, with a focus on clear design, useful interactions, and intuitive user experiences.";

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    items: ["HTML", "CSS", "JavaScript", "TypeScript"],
  },
  {
    title: "Frameworks",
    items: ["React", "Next.js"],
  },
  {
    title: "Styling",
    items: ["Tailwind CSS", "Bootstrap"],
  },
  {
    title: "Development and design tools",
    items: ["Git", "GitHub", "VS Code", "Figma"],
  },
  {
    title: "Services and deployment",
    items: ["Firebase", "Stripe", "Vercel"],
  },
];

export type Practice = {
  title: string;
  /** How you actually approach this. Avoid claiming numbers you can't show. */
  description: string;
};

/**
 * Four craft commitments. Descriptions stay at the level of approach — they
 * do not name tools, audits or metrics that have not been supplied.
 */
export const practices: Practice[] = [
  {
    title: "Responsive design",
    description:
      "Layouts should feel considered on a phone in the hand as much as on a wide desktop, so the work stays easy to use at every size.",
  },
  {
    title: "Accessibility",
    description:
      "Pages should be readable, well structured and usable with a keyboard — the experience is not reserved for people with a mouse and perfect vision.",
  },
  {
    title: "Performance",
    description:
      "A site should feel light and ready, so people can get to what they came for without waiting on decoration.",
  },
  {
    title: "Thoughtful user experience",
    description:
      "Design and development belong together: polished visuals, intuitive flow, and the small details that make an interface a pleasure to use.",
  },
];

export type ProjectLink = {
  /** Live deployment. Set to `null` if there isn't one. */
  live: string | null;
  /** Public source. Set to `null` rather than guessing a repository URL. */
  source: string | null;
};

export type Project = {
  /** URL segment for the detail page: /work/<slug>. */
  slug: string;
  name: string;
  /** One or two sentences for the overview row. */
  description: string;
  /** Hidden when empty — never filled with guessed stacks. */
  technologies: string[];
  /** Hidden when `null`. */
  role: string | null;
  /**
   * Path under /public, or `null` to render the labelled placeholder frame.
   * Supply a 16:10 image so the frame never shifts while loading.
   */
  screenshot: {
    src: string;
    alt: string;
    width: number;
    height: number;
  } | null;
  links: ProjectLink;
  detail: {
    problem: string | null;
    approach: string | null;
    keyFeatures: string[];
    challenges: { title: string; body: string }[];
    /**
     * Only ever populated from numbers supplied in content. Left empty, the
     * results block is omitted entirely rather than filled with invented figures.
     */
    results: { label: string; value: string }[];
  };
};

const shot = (src: string, alt: string) => ({
  src,
  alt,
  width: 1760,
  height: 1100,
});

export const projects: Project[] = [
  {
    slug: "minecraft-mob-catalog",
    name: "Build Like a Pro — Minecraft Mob Catalog",
    description:
      "An interactive catalog that helps Minecraft players find information about the game’s mobs. The project brings mob details together in one place, making it easier to explore and learn about the creatures found throughout Minecraft.",
    technologies: ["React", "JavaScript", "CSS", "Vite", "React Router"],
    role: null,
    screenshot: shot(
      "/projects/minecraft-mob-catalog.webp",
      "The Build Like a Pro catalog: a search and filter panel above a grid of Minecraft mob cards.",
    ),
    links: {
      live: "https://dmmiller1214.github.io/Build-like-a-pro/",
      source: "https://github.com/Dmmiller1214/Build-like-a-pro",
    },
    detail: {
      problem: null,
      approach: null,
      keyFeatures: [],
      challenges: [],
      results: [],
    },
  },
  {
    slug: "business-website-clone",
    name: "Business Website Clone",
    description:
      "A frontend project recreating an existing business website as a development exercise. The project focuses on translating a reference design into a working interface, practicing page structure, layout, and visual consistency.",
    technologies: ["HTML", "CSS", "JavaScript"],
    role: null,
    screenshot: shot(
      "/projects/business-website-clone.webp",
      "The Treact business-site clone: a wide headline, email sign-up, and an illustrated desk scene.",
    ),
    links: {
      live: "https://dmmiller1214.github.io/Clone-Website/",
      source: "https://github.com/Dmmiller1214/Clone-Website",
    },
    detail: {
      problem: null,
      approach: null,
      keyFeatures: [],
      challenges: [],
      results: [],
    },
  },
  {
    slug: "nft-website-concept",
    name: "NFT Website Concept",
    description:
      "A simulated NFT website featuring smooth animations and an engaging visual presentation. The project explores how motion and interface design can work together to create a polished browsing experience.",
    technologies: [],
    role: null,
    screenshot: shot(
      "/projects/nft-website-concept.webp",
      "Ultraverse NFT World: a headline about creating and collecting digital items beside an illustrated network of NFT cards.",
    ),
    links: {
      live: "https://dylan-internship.vercel.app/",
      source: null,
    },
    detail: {
      problem: null,
      approach: null,
      keyFeatures: [],
      challenges: [],
      results: [],
    },
  },
  {
    slug: "summarist",
    name: "Summarist — Book Membership Platform",
    description:
      "A book website with user authentication and an integrated payment system for purchasing different membership plans. The project brings together account access and subscription purchasing to demonstrate a more complete web application experience.",
    technologies: [],
    role: null,
    screenshot: shot(
      "/projects/summarist.webp",
      "Summarist home page: a headline about gaining knowledge in less time, a login button, and three reading features.",
    ),
    links: {
      live: "https://summarist-umber.vercel.app/",
      source: null,
    },
    detail: {
      problem: null,
      approach: null,
      keyFeatures: [],
      challenges: [],
      results: [],
    },
  },
  {
    slug: "skinstric",
    name: "Skinstric — AI Skin Analysis Interface",
    description:
      "An AI-powered skincare concept that uses a facial scan to generate estimates about a user’s background. The project presents an interactive experience around image analysis, guiding users through the scan and its AI-generated results. Those results are estimates produced by the model — not medical advice, and not a verified identification of anyone.",
    technologies: [],
    role: null,
    screenshot: shot(
      "/projects/skinstric.webp",
      "Skinstric intro screen: a centred ‘Sophisticated skincare’ headline with Discover A.I. and Take Test controls.",
    ),
    links: {
      live: "https://skinstric-lime.vercel.app/",
      source: null,
    },
    detail: {
      problem: null,
      approach: null,
      keyFeatures: [],
      challenges: [],
      results: [],
    },
  },
];

export type ContactContent = {
  headline: string;
  /** Invitation copy above the links. */
  invitation: string;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  /** Any other profile worth listing, e.g. a writing or dribbble link. */
  elsewhere: { label: string; href: string }[];
  /**
   * Put the PDF in /public and point here, e.g. "/your-name-resume.pdf".
   * Leave `null` and the download button is omitted rather than dead-linked.
   */
  resumeUrl: string | null;
  /** Optional one-liner on current availability. */
  availability: string | null;
};

export const contact: ContactContent = {
  headline: "Let’s build something great.",
  invitation:
    "Have a project in mind or an opportunity to share? I’m excited to connect and explore how we can work together.",
  email: null,
  github: "https://github.com/Dmmiller1214",
  linkedin: "https://www.linkedin.com/in/dylan-miller-8a91b1440/",
  elsewhere: [],
  resumeUrl: null,
  availability: "Open to junior frontend developer opportunities.",
};

export const navigation = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
] as const;

function collectStrings(): (string | null | undefined)[] {
  return [
    profile.name,
    profile.headline,
    profile.valueProposition,
    profile.location,
    ...about.paragraphs,
    ...about.interests,
    ...skillGroups.flatMap((group) => [group.summary, ...group.items]),
    skillsIntro,
    ...practices.map((practice) => practice.description),
    ...projects.flatMap((project) => [
      project.name,
      project.description,
      project.role,
      ...project.technologies,
      project.detail.problem,
      project.detail.approach,
      ...project.detail.keyFeatures,
      ...project.detail.challenges.flatMap((c) => [c.title, c.body]),
    ]),
    contact.headline,
    contact.invitation,
    contact.email,
    contact.github,
    contact.linkedin,
    contact.availability,
  ];
}

/** Drives the draft notice. Flips to `false` once the brackets are gone. */
export function hasUnfinishedContent(): boolean {
  return collectStrings().some((value) => isPlaceholder(value));
}
