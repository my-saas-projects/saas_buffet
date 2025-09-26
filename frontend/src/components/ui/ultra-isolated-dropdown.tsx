"use client"

import { useState, useRef, useEffect, useCallback, memo } from "react"

interface UltraIsolatedDropdownProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

// Componente ultra isolado sem dependências externas
const UltraIsolatedDropdown = memo(function UltraIsolatedDropdown({ onView, onEdit, onDelete }: UltraIsolatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handlers estáveis
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

    // Usar setTimeout para evitar conflitos
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-8 h-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Abrir menu de ações</span>
        {/* SVG inline para evitar dependências */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
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
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver detalhes
          </button>
          
          <button
            type="button"
            className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            onClick={handleEdit}
            role="menuitem"
          >
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          
          <div className="border-t border-gray-100 my-1" />
          
          <button
            type="button"
            className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            onClick={handleDelete}
            role="menuitem"
          >
            <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir
          </button>
        </div>
      )}
    </div>
  )
})

export { UltraIsolatedDropdown }
