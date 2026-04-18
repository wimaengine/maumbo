import { withBase } from "../utils/url";

export interface NavTab {
  label: string;
  href?: string;
  children?: NavTab[];
}

const tabs: NavTab[] = [
  {
    label: "Introduction",
    href: "#geometry-contacts-support-matrix",
    children: [
      { label: "Support Matrix", href: "#geometry-contacts-support-matrix" }
    ]
  },
  {
    label: "Guide",
    href: "/guide",
    children: [
      { label: "Overview", href: "/guide" }
    ]
  },
  {
    label: "Examples",
    href: "/examples",
    children: [{ label: "Overview", href: "/examples" }]
  }
];

function mapTabLinks(tab: NavTab): NavTab {
  return {
    ...tab,
    href: tab.href ? withBase(tab.href) : undefined,
    children: tab.children?.map(mapTabLinks),
  };
}

export const sidebarTabs: NavTab[] = tabs.map(mapTabLinks);
