"use client";
import { SignIn } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Page() {
  const router = useRouter();
  const { showError } = useAlert();

  useEffect(() => {
    // Limpiar cualquier flag de procesamiento al entrar a la página
    sessionStorage.removeItem("sso_callback_processed");
    sessionStorage.removeItem("user_not_found_handled");
    
    let checkInterval: NodeJS.Timeout;
    let observer: MutationObserver;
    
    // Función para detectar y manejar el error
    const handleUserNotFoundError = () => {
      // Verificar que no hayamos procesado esto ya
      if (sessionStorage.getItem("user_not_found_handled")) {
        return;
      }

      // Buscar el mensaje de error en el DOM
      const allText = document.body.innerText || document.body.textContent || "";
      const hasError = allText.toLowerCase().includes("external account was not found") ||
                      allText.toLowerCase().includes("the external account was not found") ||
                      (allText.toLowerCase().includes("not found") && allText.toLowerCase().includes("account"));

      if (hasError) {
        sessionStorage.setItem("user_not_found_handled", "true");
        
        // Limpiar intervalos y observers
        if (checkInterval) clearInterval(checkInterval);
        if (observer) observer.disconnect();
        
        // Mostrar alert y redirigir
        showError("No tienes una cuenta registrada. Por favor, regístrate primero.", 3000);
        
        setTimeout(() => {
          sessionStorage.removeItem("user_not_found_handled");
          router.push("/redirecting");
        }, 1500);
      }
    };

    // Observar cambios en el DOM para detectar mensajes de error de Clerk
    observer = new MutationObserver(() => {
      handleUserNotFoundError();
    });

    // Observar el contenedor de Clerk cuando esté disponible
    const startObserving = () => {
      const clerkContainer = document.querySelector('[class*="cl-rootBox"]') || document.body;
      observer.observe(clerkContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    };

    // Intentar empezar a observar inmediatamente
    startObserving();

    // También verificar periódicamente por si Clerk carga después
    checkInterval = setInterval(() => {
      handleUserNotFoundError();
      // Si encontramos el contenedor de Clerk, empezar a observar
      if (document.querySelector('[class*="cl-rootBox"]')) {
        startObserving();
      }
    }, 500);

    // Limpiar después de 10 segundos para evitar loops infinitos
    const cleanupTimeout = setTimeout(() => {
      if (checkInterval) clearInterval(checkInterval);
      if (observer) observer.disconnect();
    }, 10000);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (observer) observer.disconnect();
      clearTimeout(cleanupTimeout);
    };
  }, [router, showError]);

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
