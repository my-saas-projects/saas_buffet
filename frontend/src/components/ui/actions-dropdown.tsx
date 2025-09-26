"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"

interface ActionsDropdownProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  className?: string
}

export function ActionsDropdown({ onView, onEdit, onDelete, className = "" }: ActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Memoize handlers to prevent re-renders
  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(prev => !prev)
  }, [])

  const handleView = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onView()
    setIsOpen(false)
  }, [onView])

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit()
    setIsOpen(false)
  }, [onEdit])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete()
    setIsOpen(false)
  }, [onDelete])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 hover:bg-gray-100"
        onClick={handleToggle}
      >
        <span className="sr-only">Abrir menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-[9999] min-w-[160px] rounded-md border bg-white p-1 shadow-md">
          <div className="px-2 py-1.5 text-sm font-medium text-gray-700">
            Ações
          </div>
          <div className="border-t border-gray-100 my-1" />
          
          <button
            className="flex w-full items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer"
            onClick={handleView}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </button>
          
          <button
            className="flex w-full items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer"
            onClick={handleEdit}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </button>
          
          <div className="border-t border-gray-100 my-1" />
          
          <button
            className="flex w-full items-center px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-sm cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </button>
        </div>
      )}
    </div>
  )
}
