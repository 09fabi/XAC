"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { customESLocalization } from "@/lib/clerk-localization";
import { AlertProvider } from "@/context/AlertContext";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      localization={customESLocalization}
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <AlertProvider>
        <html lang="es">
          <body>{children}</body>
        </html>
      </AlertProvider>
    </ClerkProvider>
  );
}

