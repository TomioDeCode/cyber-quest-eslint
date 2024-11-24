import {
  LayoutDashboard,
  MessageCircleQuestion,
  ShieldX,
  User,
} from "lucide-react";

export const urlNavbarUsers = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "BootCamp Cyber",
      logo: ShieldX,
      plan: "",
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
          url: "/user/dashboard",
        },
        {
          title: "Leaderboard",
          url: "/user/dashboard/leaderboard",
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
          url: "/user/soals",
        },
        {
          title: "Favorite Questions",
          url: "/user/soals/favorite",
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
          url: "/user/profile",
        },
        {
          title: "Preferences",
          url: "/user/preferences",
        },
      ],
    },
  ],
};
