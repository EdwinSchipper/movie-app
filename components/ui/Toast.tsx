'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { Button as HeadlessButton } from '@headlessui/react'
import { ToastContainer, Slide, toast as reactToastify } from 'react-toastify/unstyled'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastApi {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export interface ToastProviderProps {
  children: ReactNode
}

function renderToastIcon({ type }: { type: string }) {
  if (type === 'success') {
    return <CheckCircleIcon className="size-5 shrink-0 text-accent-emerald" aria-hidden="true" />
  }
  if (type === 'error') {
    return <ExclamationCircleIcon className="size-5 shrink-0 text-accent-coral" aria-hidden="true" />
  }
  return <InformationCircleIcon className="size-5 shrink-0 text-brand" aria-hidden="true" />
}

function ToastCloseButton({ closeToast }: { closeToast: () => void }) {
  return (
    <HeadlessButton
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        closeToast()
      }}
      aria-label="Melding sluiten"
      className="absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded-control text-fg-muted transition-colors data-hover:bg-surface-glass data-hover:text-fg-primary focus:outline-none data-focus:ring-2 data-focus:ring-brand"
    >
      <XMarkIcon className="size-4" aria-hidden="true" />
    </HeadlessButton>
  )
}

export function ToastProvider({ children }: ToastProviderProps) {
  const value = useMemo<ToastApi>(
    () => ({
      success: (message: string) => {
        reactToastify.success(message)
      },
      error: (message: string) => {
        reactToastify.error(message)
      },
      info: (message: string) => {
        reactToastify.info(message)
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        transition={Slide}
        icon={renderToastIcon}
        closeButton={ToastCloseButton}
        aria-label="Meldingen"
      />
    </ToastContext.Provider>
  )
}
