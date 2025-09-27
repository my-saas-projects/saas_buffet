"use client"

import { useState } from "react"
import { EventsList } from "./events-list"
import { SimpleEventsTable } from "./simple-events-table"
import { EventListItem } from "@/lib/types"

interface EventsViewProps {
  companyId: string
  onEventSelect?: (event: EventListItem) => void
  onCreateNew?: () => void
}

type ViewMode = "cards" | "table"

export function EventsView({ companyId, onEventSelect, onCreateNew }: EventsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  return (
    <div className="space-y-6">
      {/* Content */}
      {viewMode === "cards" ? (
        <EventsList
          companyId={companyId}
          onEventSelect={onEventSelect}
          onCreateNew={onCreateNew}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      ) : (
        <SimpleEventsTable
          companyId={companyId}
          onEventSelect={onEventSelect}
          onCreateNew={onCreateNew}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}
    </div>
  )
}
