"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"
import { Moon, Sun, Plus, Settings, LogOut } from "lucide-react"

interface HeaderProps {
  onNewEvent?: () => void
  onSettings?: () => void
  onLogout?: () => void
}

export function Header({ onNewEvent, onSettings, onLogout }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left side - could add breadcrumbs or page title here */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sistema BuffetFlow
          </h2>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="w-10 h-10 p-0 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            )}
          </Button>

          {/* New Event Button */}
          {onNewEvent && (
            <Button
              size="sm"
              onClick={onNewEvent}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          )}

          {/* Settings Button */}
          {onSettings && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSettings}
              className="px-4 py-2 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          )}

          {/* Logout Button */}
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}