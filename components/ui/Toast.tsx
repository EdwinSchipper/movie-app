'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import UIButton from './Button'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
  }
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context.toast
}

export interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      setToasts((prev) => [...prev.slice(-4), { id, message, type }])

      setTimeout(() => {
        removeToast(id)
      }, 3500)
    },
    [removeToast]
  )

  const toastMethods = {
    success: useCallback((msg: string) => addToast(msg, 'success'), [addToast]),
    error: useCallback((msg: string) => addToast(msg, 'error'), [addToast]),
    info: useCallback((msg: string) => addToast(msg, 'info'), [addToast]),
  }

  const getBorderAndIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          border: 'border-accent-emerald/40',
          icon: <CheckCircleIcon className="w-5 h-5 text-accent-emerald shrink-0" />,
        }
      case 'error':
        return {
          border: 'border-accent-coral/40',
          icon: <ExclamationCircleIcon className="w-5 h-5 text-accent-coral shrink-0" />,
        }
      case 'info':
      default:
        return {
          border: 'border-border-default',
          icon: <InformationCircleIcon className="w-5 h-5 text-fg-muted shrink-0" />,
        }
    }
  }

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((item) => {
          const { border, icon } = getBorderAndIcon(item.type)
          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-control shadow-xl bg-surface/95 backdrop-blur border text-fg-primary text-sm transition-all duration-200 ${border}`}
              role="alert"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {icon}
                <span className="truncate">{item.message}</span>
              </div>
              <UIButton
                type="button"
                variant="outline"
                size="xs"
                onClick={() => removeToast(item.id)}
                className="p-1 rounded-pill shrink-0"
                aria-label="Notificatie sluiten"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </UIButton>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

