import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definir rutas públicas que no requieren autenticación
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/store(.*)",
  "/product(.*)",
  "/cart(.*)",
  "/recommendations(.*)",
  "/redirecting(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Excluir rutas de API del middleware
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return;
  }

  // Si es una ruta pública, permitir acceso sin verificación
  if (isPublicRoute(req)) {
    return;
  }

  // Para rutas protegidas, verificar autenticación
  const { userId } = await auth();
  
  if (!userId) {
    // Redirigir a sign-in si no está autenticado
    const signInUrl = new URL("/sign-in", req.url);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Excluir archivos estáticos, rutas de API, y archivos de Next.js
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
