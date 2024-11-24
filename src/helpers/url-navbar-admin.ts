import {
  LayoutDashboard,
  MessageCircleQuestion,
  ShieldX,
  User,
} from "lucide-react";

export const urlNavbarAdmin = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "BootCamp Cyber",
      logo: ShieldX,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/admin/dashboard",
        },
        {
          title: "Leaderboard",
          url: "/admin/dashboard/leaderboard",
        },
      ],
    },
    {
      title: "Questions",
      url: "#",
      icon: MessageCircleQuestion,
      items: [
        {
          title: "All Questions",
          url: "/admin/soals",
        },
        {
          title: "Favorite Questions",
          url: "/admin/soals/favorite",
        },
      ],
    },
    {
      title: "Account Settings",
      url: "#",
      icon: User,
      items: [
        {
          title: "Profile",
          url: "/admin/profile",
        },
        {
          title: "Preferences",
          url: "/admin/preferences",
        },
      ],
    },
  ],
};
