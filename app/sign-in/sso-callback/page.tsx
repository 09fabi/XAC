"use client";
import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/context/AlertContext";

function SSOCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, clearAllAlerts } = useAlert();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevenir múltiples ejecuciones
    if (hasProcessed.current) {
      return;
    }

    // Verificar que searchParams no sea null
    if (!searchParams) {
      // Si no hay searchParams, esperar un momento y redirigir
      const timeout = setTimeout(() => {
        if (!hasProcessed.current) {
          hasProcessed.current = true;
          clearAllAlerts();
          showError("No tienes una cuenta registrada. Por favor, regístrate primero.", 3000);
          setTimeout(() => {
            router.replace("/redirecting");
          }, 1500);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }

    // Verificar si el usuario viene de volver atrás intencionalmente
    const isBackNavigation = sessionStorage.getItem("clerk_user_cancelled") === "true";
    
    if (isBackNavigation) {
      hasProcessed.current = true;
      sessionStorage.removeItem("clerk_user_cancelled");
      sessionStorage.removeItem("sso_callback_processed");
      router.replace("/");
      return;
    }

    // Verificar si ya procesamos este callback (evitar loops)
    const callbackProcessed = sessionStorage.getItem("sso_callback_processed");
    if (callbackProcessed === "true") {
      // Si ya procesamos, redirigir inmediatamente sin procesar de nuevo
      hasProcessed.current = true;
      router.replace("/redirecting");
      return;
    }

    // Marcar como procesado inmediatamente para evitar múltiples ejecuciones
    sessionStorage.setItem("sso_callback_processed", "true");
    hasProcessed.current = true;

    // Función para manejar usuario no encontrado
    const handleUserNotFound = () => {
      // Limpiar cualquier alert previo antes de mostrar uno nuevo
      clearAllAlerts();
      showError("No tienes una cuenta registrada. Por favor, regístrate primero.", 3000);
      setTimeout(() => {
        router.replace("/redirecting");
      }, 1500);
    };

    // Verificar parámetros de éxito primero
    const hasSuccessParams = searchParams.has("code") || 
                            searchParams.has("session_id") || 
                            searchParams.has("__clerk_redirect_url");

    // Si hay parámetros de éxito, redirigir normalmente
    if (hasSuccessParams) {
      const fallbackUrl = searchParams.get("sign_in_fallback_redirect_url") || 
                          searchParams.get("after_sign_in_url") || 
                          "/";
      
      try {
        const decodedUrl = decodeURIComponent(fallbackUrl);
        sessionStorage.removeItem("sso_callback_processed");
        router.replace(decodedUrl);
      } catch {
        sessionStorage.removeItem("sso_callback_processed");
        router.replace("/");
      }
      return;
    }

    // Verificar si hay parámetros de error explícitos
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    if (error || errorDescription) {
      const errorDescLower = errorDescription?.toLowerCase() || "";
      const isUserNotFound = errorDescLower.includes("not found") ||
                            errorDescLower.includes("no encontrado") ||
                            errorDescLower.includes("external account") ||
                            errorDescLower.includes("was not found") ||
                            error === "user_not_found" ||
                            error === "external_account_not_found";
      
      if (isUserNotFound) {
        handleUserNotFound();
        return;
      }
    }

    // Si no hay parámetros de éxito ni error explícito, asumir usuario no encontrado
    // Esto es común cuando Clerk redirige aquí sin parámetros después de un intento fallido
    // Usar un timeout corto para asegurar que siempre redirija
    const timeout = setTimeout(() => {
      handleUserNotFound();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchParams, router, showError, clearAllAlerts]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg uppercase tracking-wider">Procesando autenticación...</p>
      </div>
    </div>
  );
}

export default function SSOCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Cargando...</p>
          </div>
        </div>
      }
    >
      <SSOCallbackContent />
    </Suspense>
  );
}

