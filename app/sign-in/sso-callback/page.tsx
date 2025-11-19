"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/context/AlertContext";

function SSOCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError } = useAlert();

  useEffect(() => {
    // Verificar que searchParams no sea null
    if (!searchParams) {
      return;
    }

    // Verificar si el usuario viene de volver atrás intencionalmente
    const isBackNavigation = sessionStorage.getItem("clerk_user_cancelled") === "true";
    
    if (isBackNavigation) {
      // Limpiar el flag y redirigir al inicio sin mostrar alert
      sessionStorage.removeItem("clerk_user_cancelled");
      router.push("/");
      return;
    }

    // Cuando Clerk redirige a sso-callback sin parámetros de error,
    // generalmente significa que el usuario intentó iniciar sesión pero no existe
    const handleUserNotFound = () => {
      // Mostrar alert minimalista
      showError("No tienes una cuenta registrada. Por favor, regístrate primero.", 3000);
      
      // Redirigir a página de redirección después de mostrar el alert
      setTimeout(() => {
        router.push("/redirecting");
      }, 1000);
    };

    // Verificar si hay parámetros de error explícitos
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    // Si hay parámetros de error, manejar como usuario no encontrado
    if (error || errorDescription) {
      handleUserNotFound();
      return;
    }

    // Si llegamos a sso-callback sin parámetros de éxito (como código de verificación),
    // probablemente es porque el usuario no existe
    // Clerk normalmente redirige aquí cuando hay problemas de autenticación
    const hasSuccessParams = searchParams.has("code") || 
                            searchParams.has("session_id") || 
                            searchParams.has("__clerk_redirect_url");
    
    if (!hasSuccessParams) {
      // No hay parámetros de éxito, probablemente el usuario no existe
      handleUserNotFound();
      return;
    }

    // Si hay parámetros de éxito, intentar redirigir normalmente
    const fallbackUrl = searchParams.get("sign_in_fallback_redirect_url") || 
                        searchParams.get("after_sign_in_url") || 
                        "/";
    
    try {
      const decodedUrl = decodeURIComponent(fallbackUrl);
      router.push(decodedUrl);
    } catch {
      router.push("/");
    }
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

