"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RedirectingPage() {
  const router = useRouter();

  useEffect(() => {
    // Marcar que venimos de redirecting para que el navbar sepa que no mostrar alert
    sessionStorage.setItem("from_redirecting", "true");
    
    // Redirigir a sign-up después de 2 segundos
    const timer = setTimeout(() => {
      router.push("/sign-up");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar arriba */}
      <div className="pt-4">
        <Navbar textColor="white" borderColor="white" simple={true} title="xac" />
      </div>

      {/* Contenido centrado */}
      <div className="flex-grow flex items-center justify-center px-3 sm:px-4">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-block border-2 border-white p-8 bg-black">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent mx-auto"></div>
            </div>
          </div>
          <h2 className="text-white font-black uppercase tracking-tight text-xl sm:text-2xl md:text-3xl mb-4">
            Redirigiendo
          </h2>
          <p className="text-gray-400 text-sm sm:text-base uppercase tracking-wider">
            Por favor espera...
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

