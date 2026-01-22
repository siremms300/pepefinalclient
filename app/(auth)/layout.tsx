// app/(auth)/layout.tsx
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="absolute top-0 left-0 right-0 p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-pepe-primary rounded-full flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl">P</span>
          </div>
          <span className="font-display font-bold text-xl text-pepe-dark">
            Pepe&apos;s <span className="text-pepe-primary">Brunch</span>
          </span>
        </Link>
      </header>
      {children}
    </>
  )
}