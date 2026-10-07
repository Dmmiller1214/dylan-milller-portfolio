# Dylan Miller — Frontend Developer Portfolio

My personal frontend development portfolio, showcasing five projects, my technical skills, and my approach to building web interfaces.

The design combines classical sculpture imagery, warm neutral colors, serif headings, and subtle animation to create a consistent visual identity.

## Live Demo

[Visit my portfolio](https://dylan-milller-portfolio.vercel.app)

## Features

- Five project showcases with screenshots and live demo links
- Individual project pages
- About, skills, development approach, and contact sections
- Responsive layouts and a mobile navigation menu
- Navigation highlighting for the current section
- Scroll-reveal animations with reduced-motion support
- Skip-to-content link and keyboard focus styling
- Page titles, descriptions, and Open Graph metadata
- Centralized content configuration

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui and Radix UI
- Lucide icons
- Vercel for hosting

## Featured Projects

- **AstroWorld Mob Explorer:** A Minecraft mob catalog with search, filtering, and details.
- **Business Website Clone:** A frontend recreation of a reference business website.
- **NFT Website Concept:** A simulated NFT interface exploring animation and visual presentation.
- **Summarist:** A book membership platform featuring authentication and membership purchasing.
- **Skinstric:** An AI-focused interface project.

These are separate projects showcased by the portfolio. Their technologies and services are not necessarily dependencies of the portfolio itself.

## Run Locally

Clone the repository and install its dependencies:

```bash
git clone https://github.com/Dmmiller1214/dylan-milller-portfolio.git
cd dylan-milller-portfolio
npm ci
npm run dev
```

Open [http://localhost:43127](http://localhost:43127).

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript types |

Run `npm run build` before starting the production server.

## Project Structure

```text
src/
├── app/                 # Pages, layout, metadata, and global styles
├── assets/sculptures/   # Sculpture artwork
├── components/          # Shared components and homepage sections
├── content/portfolio.ts # Profile, projects, skills, and contact content
├── hooks/               # Shared React hooks
└── lib/                 # Utility functions

public/projects/         # Project screenshots
scripts/                 # Browser review and screenshot tools
```

## Updating Content

Most profile and project content is managed in `src/content/portfolio.ts`, including:

- Profile introduction and site URL
- Project descriptions, screenshots, technologies, and links
- About section
- Skill groups
- Development practices
- Contact links and optional resume URL

Project screenshots are stored in `public/projects/`.

To add a resume, place the PDF in `public/` and set `contact.resumeUrl` to its path.

## Review Tools

The repository includes browser review scripts for accessibility, screenshots, and performance.

With a production server running and Playwright Chromium installed:

```bash
npm run review:a11y -- http://127.0.0.1:43127
npm run review:shots -- http://127.0.0.1:43127
npm run review:perf -- http://127.0.0.1:43127
```

These tools support verification; their presence alone does not establish accessibility compliance or performance results.

## Artwork

The sculpture images are generated artwork used as decorative elements.

## Contact

- [GitHub](https://github.com/Dmmiller1214)
- [LinkedIn](https://www.linkedin.com/in/dylan-miller-8a91b1440)
