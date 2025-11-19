"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SSOCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Cuando Clerk redirige a sso-callback sin parámetros de error,
    // generalmente significa que el usuario intentó iniciar sesión pero no existe
    // Mostrar alert inmediatamente
    const showAlert = () => {
      alert("No tienes una cuenta registrada. Por favor, regístrate primero.");
      setErrorMessage("No tienes una cuenta registrada. Por favor, regístrate primero.");
      
      // Redirigir a sign-up después de un breve delay
      setTimeout(() => {
        router.push("/sign-up");
      }, 1500);
    };

    // Verificar si hay parámetros de error explícitos
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    // Si hay parámetros de error, mostrar mensaje
    if (error || errorDescription) {
      showAlert();
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
      showAlert();
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
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        {errorMessage ? (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-400">Redirigiendo a registro...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Procesando autenticación...</p>
          </>
        )}
      </div>
    </div>
  );
}

