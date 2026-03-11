import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto pb-[calc(56px+env(safe-area-inset-bottom,8px))] min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
