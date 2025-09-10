"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useLeadSheetStore } from "@/store/leadSheetStore"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, Trash2 } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function GlobalLeadSheet() {
  const { lead, open, closeSheet } = useLeadSheetStore()
  const [openInfo, setOpenInfo] = useState(false)

  if (!lead) return null

  return (
    <Sheet open={open} onOpenChange={closeSheet}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <div className="p-6 space-y-6">
          <SheetTitle className="text-lg font-semibold">Lead Profile</SheetTitle>

          {/* Profile Card */}
          <Card className="p-4">
            <div className="flex justify-between">
              {/* Left Side */}
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {lead.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-base font-semibold">{lead.name}</h2>
                  <p className="text-sm text-muted-foreground">{lead.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {lead.campaign && (
                      <Badge variant="outline">{lead.campaign.name}</Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700"
                    >
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Right Side - Delete Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Bottom - Additional Details Toggler */}
           {/* Bottom - Additional Details Toggler */}
<Collapsible open={openInfo} onOpenChange={setOpenInfo} className="mt-4">
  <CollapsibleTrigger className="flex w-full items-center justify-between cursor-pointer border-t pt-3">
    <p className="text-sm font-medium">Additional Profile Info</p>
    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
  <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarFallback>
          {("harishkolla11@gmail.com").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span>{("harishkolla11@gmail.com")}</span>
    </div>
  </CollapsibleContent>
</Collapsible>


          </Card>

          {/* Timeline Section */}
          {/* Timeline / Vertical Progress Bar */}
{/* Timeline / Vertical Progress Bar */}
<div className="flex gap-4 mt-4">
  {/* Left vertical line with dots */}
  <div className="relative flex flex-col items-center">
    <div className="absolute left-1/2 top-2 bottom-0 -translate-x-1/2 border-l-2 border-gray-300"></div>

    {[
      "Invitation Request",
      "Connection Status",
      "Connection Acceptance Message",
      "Follow Up 1",
      "Follow Up 2",
      "Replied",
    ].map((step, idx) => {
      const isCompleted =
        step === "Connection Status" ? false : idx <= 2 // mark Connection Status gray
      return (
        <div key={idx} className="relative mb-6 last:mb-0 flex items-center">
          <div
            className={`h-4 w-4 rounded-full border-2 ${
              isCompleted ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
            }`}
          ></div>
        </div>
      )
    })}
  </div>

  {/* Right side - step labels, aligned with dots */}
  <div className="flex flex-col justify-start mt-0">
    {[
      "Invitation Request",
      "Connection Status",
      "Connection Acceptance Message",
      "Follow Up 1",
      "Follow Up 2",
      "Replied",
    ].map((step, idx) => {
      const isGray = step === "Connection Status"
      const isCompleted = !isGray && idx <= 2
      return (
        <div key={idx} className="mb-6 last:mb-0 flex items-center h-4">
          <p
            className={`text-sm ${
              isGray ? "text-gray-400" : isCompleted ? "text-blue-600 font-semibold" : "text-gray-400"
            }`}
          >
            {step}
          </p>
        </div>
      )
    })}
  </div>
</div>

        </div>
      </SheetContent>
    </Sheet>
  )
}
