import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  CalendarPlus,
  DoorOpen,
  CalendarCheck,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AKTUELLER_NUTZER } from "@/lib/mock-data"

const NAV = [
  { titel: "Dashboard", url: "/", icon: LayoutDashboard },
  { titel: "Raum buchen", url: "/buchen", icon: CalendarPlus },
  { titel: "Räume", url: "/raeume", icon: DoorOpen },
  { titel: "Meine Buchungen", url: "/buchungen", icon: CalendarCheck },
  { titel: "Im Büro", url: "/im-buero", icon: Users },
]

export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            C
          </div>
          <div className="leading-tight">
            <div className="font-semibold">Calvin</div>
            <div className="text-xs text-muted-foreground">
              Raumbuchung
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const aktiv =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={aktiv}
                      tooltip={item.titel}
                      render={<Link to={item.url} />}
                    >
                      <item.icon />
                      <span>{item.titel}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted font-medium">
            {AKTUELLER_NUTZER.initialen}
          </div>
          <div className="leading-tight">
            <div className="font-medium">{AKTUELLER_NUTZER.name}</div>
            <div className="text-xs text-muted-foreground">
              {AKTUELLER_NUTZER.rolle}
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
