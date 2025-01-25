export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "WaTask",
  description: "WaTask is a task management platform that integrates seamlessly with WhatsApp. Students can receive automated task reminders, set deadlines, and manage their academic tasks all through WhatsApp, making it easier to stay on top of deadlines and projects.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Login",
      href: "/login",
    },
  ],
  links: {
    github: "https://github.com/muhamamdfaiz19/watask-v2",
  },
};
