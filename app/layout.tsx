"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { customESLocalization } from "@/lib/clerk-localization";
import { AlertProvider } from "@/context/AlertContext";
import { CartProvider } from "@/context/CartContext";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ClerkProvider
          localization={customESLocalization}
          appearance={{
            layout: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
          }}
        >
          <CartProvider>
            <AlertProvider>
              {children}
            </AlertProvider>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

