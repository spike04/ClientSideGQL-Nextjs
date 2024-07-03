'use client'

import Sidebar from '@/app/(dashboard)/Sidebar'
import { isAuth } from '@/utils/token'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!isAuth()) {
      redirect('/signin')
    }
  }, [])

  return (
    <div className="relative h-screen w-screen bg-slate-50">
      <aside className="absolute left-0 top-0 w-[200px] h-full">
        <Sidebar />
      </aside>
      <main className="w-[calc(100vw-200px)] h-full ml-[200px]">
        <div className="p-3 h-full w-full">
          <div className="rounded-lg border w-full h-full bg-white">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
