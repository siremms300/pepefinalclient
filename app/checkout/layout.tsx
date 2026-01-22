// app/checkout/layout.tsx
import Script from 'next/script'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Preload Paystack script */}
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  )
}