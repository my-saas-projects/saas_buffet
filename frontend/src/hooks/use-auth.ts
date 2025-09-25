'use client'

import { useState, useEffect } from 'react'
import { authAPI } from '@/services/api'

interface User {
  id: string
  email: string
  name?: string
  phone?: string
  whatsapp?: string
  role: string
  isOnboarded: boolean
  createdAt: string
  updatedAt: string
}

interface Company {
  id: string
  ownerId: string
  name: string
  cnpj?: string
  phone: string
  email: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  logo?: string
  defaultProfitMargin: number
  maxEventsPerDay: number
  plan: string
  trialEndsAt?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  company: Company | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

interface RegisterData {
  name: string
  email: string
  phone: string
  companyName: string
  password: string
  role?: string
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setIsLoading(true)

      // Check if there's a token in localStorage
      const token = localStorage.getItem('token')

      if (token) {
        // Verify token with Django backend
        const response = await authAPI.profile()
        const userData = response.data

        // Atualizar localStorage com dados mais recentes do backend
        localStorage.setItem('user', JSON.stringify(userData))
        
        setUser(userData)
        if (userData.company) {
          setCompany(userData.company)
        }
      } else {
        // Check for legacy data (for migration)
        const savedUser = localStorage.getItem('buffetflow_user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      // Clear invalid tokens
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      const data = response.data

      if (data.token) {
        // Store token and user data
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        setUser(data.user)
        if (data.user.company) {
          setCompany(data.user.company)
        }

        // Redirect after successful login
        setTimeout(() => {
          if (data.user.is_onboarded) {
            window.location.href = '/'
          } else {
            window.location.href = '/onboarding'
          }
        }, 500)

        return { success: true }
      } else {
        return { success: false, error: 'Token não recebido' }
      }
    } catch (error: any) {
      console.error('Erro no login:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Erro ao conectar com o servidor'
      return { success: false, error: errorMessage }
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register({
        username: data.email, // Usar email como username
        email: data.email,
        first_name: data.name.split(' ')[0] || data.name,
        last_name: data.name.split(' ').slice(1).join(' ') || '',
        phone: data.phone,
        password: data.password,
        password_confirm: data.password,
        company_name: data.companyName
      })
      
      const responseData = response.data

      if (responseData.token) {
        // Store token and user data
        localStorage.setItem('token', responseData.token)
        localStorage.setItem('user', JSON.stringify(responseData.user))

        setUser(responseData.user)
        if (responseData.user.company) {
          setCompany(responseData.user.company)
        }

        // Redirect to onboarding after successful registration
        setTimeout(() => {
          window.location.href = '/onboarding'
        }, 500)

        return { success: true }
      } else {
        return { success: false, error: 'Token não recebido' }
      }
    } catch (error: any) {
      console.error('Erro no registro:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Erro ao conectar com o servidor'
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      // Call Django logout endpoint (optional)
      await authAPI.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Clear local storage and state
      setUser(null)
      setCompany(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Clear legacy data as well
      localStorage.removeItem('buffetflow_user')
      localStorage.removeItem('buffetflow_email')
      window.location.href = '/auth'
    }
  }

  return {
    user,
    company,
    isLoading,
    login,
    register,
    logout,
  }
}