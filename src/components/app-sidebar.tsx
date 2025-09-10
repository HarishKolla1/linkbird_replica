"use client"

import * as React from "react"
import Image from "next/image"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavAdmin } from "./nav-admin"

// Sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Kandid",
      logo: GalleryVerticalEnd,
      plan: "Personal",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Leads",
      url: "/dashboard/leads",
      icon: Bot,
    },
    {
      title: "Campaigns",
      url: "/dashboard/campaigns",
      icon: BookOpen,
    },
    {
      title: "Messages",
      url: "#",
      icon: Settings2,
    },
    {
      title: "LinkedIn Accounts",
      url: "#",
      icon: Settings2,
    },
  ],
  settings: [
    {
      name: "Setting and Billing",
      url: "#",
      icon: Frame,
    },
  ],
  admin: [
    {
      name: "Activity logs",
      url: "#",
      icon: Frame,
    },
    {
      name: "User logs",
      url: "#",
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* Company Logo */}
        <div className="flex items-center justify-center gap-2 py-2">
          <Image
            src="/linkbird-light-logo.svg"
            alt="Company Logo"
            width={130}
            height={60}
            className="rounded-md"
          />
        </div>
        <Separator />

        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.settings} />
        <NavAdmin projects={data.admin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
