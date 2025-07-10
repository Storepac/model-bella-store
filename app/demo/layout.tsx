import { ReactNode } from "react"

interface DemoLayoutProps {
  children: ReactNode
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  return (
    <>
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 text-center text-sm font-medium">
        🎯 <strong>DEMO</strong> - Esta é uma página de demonstração. Os dados são fictícios.
      </div>
      {children}
    </>
  )
} 