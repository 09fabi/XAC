"use client";
import { SignIn } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Page() {
  const router = useRouter();
  const { clearAllAlerts } = useAlert();

  useEffect(() => {
    // Limpiar cualquier flag de procesamiento al entrar a la página de sign-in
    // Esto asegura que si el usuario vuelve a intentar, el flujo funcione correctamente
    sessionStorage.removeItem("sso_callback_processed");
    sessionStorage.removeItem("user_not_found_handled");
    sessionStorage.removeItem("clerk_user_cancelled");
    // Limpiar alerts previos al entrar a la página
    clearAllAlerts();
  }, [clearAllAlerts]);

  // Separar la lógica de ocultar mensajes en un useEffect diferente que se ejecute después
  useEffect(() => {
    // Función optimizada para ocultar mensajes de error de Clerk
    const hideClerkErrorMessages = () => {
      // Solo buscar en alerts específicos, no en todos los elementos
      const alerts = document.querySelectorAll('.cl-alert, .cl-alertText, .cl-alertDanger, .cl-alertError, [class*="cl-alert"]');
      
      alerts.forEach((alert) => {
        const text = alert.textContent || (alert as HTMLElement).innerText || "";
        const textLower = text.toLowerCase();
        
        // Si contiene el mensaje de error, ocultarlo
        if (
          textLower.includes("external account was not found") ||
          textLower.includes("the external account was not found") ||
          (textLower.includes("external account") && textLower.includes("not found"))
        ) {
          const element = alert as HTMLElement;
          element.style.cssText = "display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; max-height: 0 !important; overflow: hidden !important;";
        }
      });
    };

    // Esperar a que Clerk cargue completamente antes de empezar
    let observer: MutationObserver | null = null;
    let interval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    // Función para iniciar la observación
    const startObserving = () => {
      const clerkContainer = document.querySelector('[class*="cl-rootBox"]');
      if (!clerkContainer) return;

      // Ejecutar una vez después de un pequeño delay
      timeoutId = setTimeout(() => {
        hideClerkErrorMessages();
      }, 500);

      // Observar cambios en el DOM solo dentro del contenedor de Clerk
      observer = new MutationObserver(() => {
        // Usar requestAnimationFrame para no bloquear el render
        requestAnimationFrame(() => {
          hideClerkErrorMessages();
        });
      });

      observer.observe(clerkContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      // Verificar periódicamente con menos frecuencia
      interval = setInterval(() => {
        hideClerkErrorMessages();
      }, 2000);
    };

    // Esperar a que Clerk cargue (verificar cada 200ms)
    const checkClerkLoaded = setInterval(() => {
      const clerkContainer = document.querySelector('[class*="cl-rootBox"]');
      if (clerkContainer && clerkContainer.children.length > 0) {
        clearInterval(checkClerkLoaded);
        startObserving();
      }
    }, 200);

    // Limpiar después de 5 segundos si Clerk no carga
    const safetyTimeout = setTimeout(() => {
      clearInterval(checkClerkLoaded);
    }, 5000);

    return () => {
      if (observer) observer.disconnect();
      if (interval) clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(checkClerkLoaded);
      clearTimeout(safetyTimeout);
    };
  }, []); // Este useEffect no depende de nada, se ejecuta una vez

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar arriba */}
      <div className="pt-4">
        <Navbar textColor="white" borderColor="white" simple={true} title="xac" />
      </div>

      {/* Contenido centrado */}
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          fallbackRedirectUrl="/"
          appearance={{
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
              formFieldErrorText: "bg-white text-black border-2 border-black rounded-none uppercase tracking-wider text-xs",
              formFieldError: "bg-white text-black border-2 border-black rounded-none uppercase tracking-wider text-xs",
              alert: "bg-white text-black border-2 border-black rounded-none uppercase tracking-wider",
              alertText: "bg-white text-black border-2 border-black rounded-none uppercase tracking-wider",
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
              colorDanger: "#000000",
              colorSuccess: "#000000",
              colorWarning: "#000000",
              colorNeutral: "#000000",
            },
          }}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
