"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Grid3X3, Table } from "lucide-react"
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
      {/* View Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Eventos</h2>
              <p className="text-gray-600">Gerencie todos os seus eventos</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Cards
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <Table className="h-4 w-4 mr-2" />
                Tabela
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === "cards" ? (
        <EventsList
          companyId={companyId}
          onEventSelect={onEventSelect}
          onCreateNew={onCreateNew}
        />
      ) : (
        <SimpleEventsTable
          companyId={companyId}
          onEventSelect={onEventSelect}
          onCreateNew={onCreateNew}
        />
      )}
    </div>
  )
}
