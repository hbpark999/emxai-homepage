export type SiteRoute = {
  title: string;
  href: string;
  label: string;
  description: string;
};

export const siteRoutes: SiteRoute[] = [
  {
    title: "Main",
    href: "/",
    label: "Main",
    description: "EMxAI homepage overview and key messages.",
  },
  {
    title: "About",
    href: "/about",
    label: "About",
    description: "Company story, mission, people, and operating principles.",
  },
  {
    title: "Solution",
    href: "/solution",
    label: "Solution",
    description: "AI and engineering solutions for customers and partners.",
  },
  {
    title: "Education",
    href: "/education",
    label: "Education",
    description: "Training programs, learning tracks, and workshops.",
  },
  {
    title: "Knowledge",
    href: "/knowledge",
    label: "Knowledge",
    description: "Insights, technical notes, and curated research material.",
  },
  {
    title: "Web Tools",
    href: "/web-tools",
    label: "Web Tools",
    description: "Interactive calculators, demos, and engineering utilities.",
  },
  {
    title: "News/Event",
    href: "/news-event",
    label: "News/Event",
    description: "Company news, events, announcements, and updates.",
  },
  {
    title: "Contact",
    href: "/contact",
    label: "Contact",
    description: "Inquiry channels for projects, training, and partnerships.",
  },
];

export const secondaryRoutes = siteRoutes.filter((route) => route.href !== "/");
