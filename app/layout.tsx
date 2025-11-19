"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      localization={esES}
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

