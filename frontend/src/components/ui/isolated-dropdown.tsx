"use client"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"

interface IsolatedDropdownProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

// Componente memoizado para evitar re-renders desnecessários
const IsolatedDropdown = memo(function IsolatedDropdown({ onView, onEdit, onDelete }: IsolatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handlers estáveis que não mudam
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

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    // Usar setTimeout para evitar conflitos
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex items-center justify-center w-8 h-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Abrir menu de ações</span>
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-9 z-[9999] w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            Ações
          </div>
          
          <button
            type="button"
            className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            onClick={handleView}
            role="menuitem"
          >
            <Eye className="w-4 h-4 mr-3 text-gray-400" />
            Ver detalhes
          </button>
          
          <button
            type="button"
            className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            onClick={handleEdit}
            role="menuitem"
          >
            <Edit className="w-4 h-4 mr-3 text-gray-400" />
            Editar
          </button>
          
          <div className="border-t border-gray-100 my-1" />
          
          <button
            type="button"
            className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            onClick={handleDelete}
            role="menuitem"
          >
            <Trash2 className="w-4 h-4 mr-3 text-red-400" />
            Excluir
          </button>
        </div>
      )}
    </div>
  )
})

export { IsolatedDropdown }
