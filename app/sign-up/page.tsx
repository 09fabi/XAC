"use client";
import { SignUp } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navbar arriba */}
      <div className="pt-4">
        <Navbar textColor="white" borderColor="white" simple={true} title="xac" />
      </div>

      {/* Contenido centrado */}
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <SignUp 
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
          afterSignInUrl="/"
          fallbackRedirectUrl="/"
          appearance={{
            locale: "es-ES",
            elements: {
              rootBox: "mx-auto",
              card: "bg-black border-2 border-white shadow-none",
              headerTitle: "text-white font-black uppercase tracking-tight",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-black text-white border-2 border-white hover:bg-neutral-800 font-medium uppercase tracking-wider",
              formButtonPrimary: "bg-white text-black hover:bg-gray-100 font-medium uppercase tracking-wider border-2 border-white",
              formFieldLabel: "text-white font-medium uppercase tracking-wider text-sm",
              formFieldInput: "bg-black text-white border-2 border-white focus:border-white focus:ring-0",
              formFieldInputShowPasswordButton: "text-white hover:text-gray-400",
              footer: "bg-black !important",
              footerAction: "bg-black !important",
              footerActionLink: "text-white hover:text-gray-400 font-medium bg-black !important",
              footerActionText: "text-white bg-black !important",
              footerPages: "bg-black !important",
              footerPagesLink: "bg-black text-white !important",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-white hover:text-gray-400",
              formResendCodeLink: "text-white hover:text-gray-400",
              otpCodeFieldInput: "bg-black text-white border-2 border-white focus:border-white focus:ring-0",
              dividerLine: "bg-white",
              dividerText: "text-white",
            },
            variables: {
              colorText: "#ffffff",
              colorTextSecondary: "#9ca3af",
            },
          }}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
