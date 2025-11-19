"use client";
import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/context/AlertContext";

function SSOCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError } = useAlert();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevenir múltiples ejecuciones
    if (hasProcessed.current) {
      return;
    }

    // Verificar que searchParams no sea null
    if (!searchParams) {
      return;
    }

    // Verificar si el usuario viene de volver atrás intencionalmente
    const isBackNavigation = sessionStorage.getItem("clerk_user_cancelled") === "true";
    
    if (isBackNavigation) {
      hasProcessed.current = true;
      // Limpiar el flag y redirigir al inicio sin mostrar alert
      sessionStorage.removeItem("clerk_user_cancelled");
      router.replace("/");
      return;
    }

    // Verificar si ya procesamos este callback
    const callbackProcessed = sessionStorage.getItem("sso_callback_processed");
    if (callbackProcessed) {
      return;
    }

    // Marcar como procesado inmediatamente para evitar múltiples ejecuciones
    sessionStorage.setItem("sso_callback_processed", "true");
    hasProcessed.current = true;

    // Cuando Clerk redirige a sso-callback sin parámetros de error,
    // generalmente significa que el usuario intentó iniciar sesión pero no existe
    const handleUserNotFound = () => {
      // Mostrar alert minimalista solo una vez
      showError("No tienes una cuenta registrada. Por favor, regístrate primero.", 3000);
      
      // Redirigir a página de redirección después de mostrar el alert
      setTimeout(() => {
        sessionStorage.removeItem("sso_callback_processed");
        router.replace("/redirecting");
      }, 1500);
    };

    // Verificar si hay parámetros de error explícitos
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    // Verificar mensajes de error específicos de Clerk
    const errorDescLower = errorDescription?.toLowerCase() || "";
    const isUserNotFound = errorDescLower.includes("not found") ||
                          errorDescLower.includes("no encontrado") ||
                          errorDescLower.includes("external account") ||
                          errorDescLower.includes("was not found") ||
                          error === "user_not_found" ||
                          error === "external_account_not_found";
    
    // Si hay parámetros de error relacionados con usuario no encontrado
    if (isUserNotFound) {
      handleUserNotFound();
      return;
    }

    // Si hay un error pero no es de usuario no encontrado, también redirigir
    if (error && !searchParams.has("code") && !searchParams.has("session_id")) {
      handleUserNotFound();
      return;
    }

    // Si llegamos a sso-callback sin parámetros de éxito (como código de verificación),
    // y tenemos sign_in_fallback_redirect_url pero no code/session, probablemente es error
    const hasSuccessParams = searchParams.has("code") || 
                            searchParams.has("session_id") || 
                            searchParams.has("__clerk_redirect_url");
    
    // Si no hay parámetros de éxito y tenemos redirect_url, puede ser un error
    // En este caso, Clerk puede estar redirigiendo aquí sin parámetros de éxito
    // lo que generalmente significa que el usuario no existe
    if (!hasSuccessParams && searchParams.has("sign_in_fallback_redirect_url")) {
      // Esperar un momento para ver si Clerk carga algo, si no, asumir error
      const checkTimeout = setTimeout(() => {
        if (!hasProcessed.current) {
          hasProcessed.current = true;
          handleUserNotFound();
        }
      }, 2000);
      
      return () => {
        clearTimeout(checkTimeout);
      };
    }

    // Si hay parámetros de éxito, intentar redirigir normalmente
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

    // Si no hay parámetros de éxito ni error explícito, pero llegamos aquí,
    // probablemente es un error de usuario no encontrado
    // Esperar un poco para ver si Clerk carga algo
    const finalCheckTimeout = setTimeout(() => {
      if (!hasProcessed.current) {
        hasProcessed.current = true;
        handleUserNotFound();
      }
    }, 2000);

    return () => {
      clearTimeout(finalCheckTimeout);
    };
  }, [searchParams, router, showError]);

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

