"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Calendar,
  ChefHat,
  DollarSign,
  Home,
  Menu,
  Users,
  X,
  Clock,
} from "lucide-react"

interface SideNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  companyName?: string
}

const navItems = [
  {
    id: "overview",
    label: "Visão Geral",
    icon: Home,
    description: "Dashboard principal"
  },
  {
    id: "clients",
    label: "Clientes",
    icon: Users,
    description: "Gestão de clientes"
  },
  {
    id: "events",
    label: "Eventos",
    icon: Calendar,
    description: "Festas e eventos"
  },
  {
    id: "menu",
    label: "Cardápio",
    icon: ChefHat,
    description: "Itens do cardápio"
  },
  {
    id: "calendar",
    label: "Agenda",
    icon: Clock,
    description: "Calendário de eventos"
  },
  {
    id: "financial",
    label: "Financeiro",
    icon: DollarSign,
    description: "Controle financeiro"
  },
]

export function SideNav({ activeTab, onTabChange, companyName }: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 shadow-lg",
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-72",
          "lg:relative lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <ChefHat className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                      BuffetFlow
                    </h1>
                    <p className="text-xs text-orange-600 font-medium">
                      Sistema de Gestão
                    </p>
                  </div>
                </div>
                {companyName && (
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {companyName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Empresa ativa
                    </p>
                  </div>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 h-9 w-9 lg:flex hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isCollapsed ? (
                <Menu className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </Button>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              className="p-2 h-9 w-9 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-12 px-3 transition-all duration-200",
                    isActive
                      ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-r-2 border-orange-600 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                    isCollapsed && "justify-center px-2"
                  )}
                  onClick={() => {
                    onTabChange(item.id)
                    // Close mobile sidebar when item is selected
                    if (window.innerWidth < 1024) {
                      setIsCollapsed(true)
                    }
                  }}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", !isCollapsed && "mr-3")} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                ✓ MVP Ativo
              </Badge>
            </div>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              Versão 1.0.0
            </p>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsCollapsed(false)}
        className={cn(
          "fixed top-4 left-4 z-40 lg:hidden bg-white dark:bg-gray-900 shadow-lg",
          !isCollapsed && "hidden"
        )}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  )
}