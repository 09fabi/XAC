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
          localization={{
            locale: "es-ES",
            labels: {
              signUp: {
                title: "Crear cuenta",
                subtitle: "¡Bienvenido! Por favor crea tu cuenta para continuar",
                firstName: {
                  label: "Nombre",
                  placeholder: "Ingresa tu nombre",
                },
                lastName: {
                  label: "Apellido",
                  placeholder: "Ingresa tu apellido",
                },
                emailAddress: {
                  label: "Correo electrónico",
                  placeholder: "Ingresa tu correo electrónico",
                },
                password: {
                  label: "Contraseña",
                  placeholder: "Ingresa tu contraseña",
                },
                formButtonPrimary: "Continuar",
                socialButtonsBlockButton: "Continuar con {{provider|titleize}}",
                dividerText: "o",
                formFieldAction__emailAddress: "Usar correo electrónico",
                formFieldAction__emailCode: "Usar código de verificación",
                formFieldAction__emailLink: "Usar enlace mágico",
                formFieldAction__phoneNumber: "Usar número de teléfono",
                formFieldAction__username: "Usar nombre de usuario",
                formFieldAction__password: "Usar contraseña",
                alreadyHaveAccount: "¿Ya tienes una cuenta?",
                signIn: {
                  actionLink: "Iniciar sesión",
                  actionText: "¿Ya tienes una cuenta?",
                },
              },
              formFieldLabel__firstName: "Nombre",
              formFieldLabel__lastName: "Apellido",
              formFieldLabel__emailAddress: "Correo electrónico",
              formFieldLabel__emailCode: "Código de verificación",
              formFieldLabel__password: "Contraseña",
              formFieldLabel__username: "Nombre de usuario",
              formFieldLabel__phoneNumber: "Número de teléfono",
              formFieldInputPlaceholder__firstName: "Ingresa tu nombre",
              formFieldInputPlaceholder__lastName: "Ingresa tu apellido",
              formFieldInputPlaceholder__emailAddress: "Ingresa tu correo electrónico",
              formFieldInputPlaceholder__password: "Ingresa tu contraseña",
              formFieldError__matchingPasswords: "Las contraseñas no coinciden",
              formFieldHintText__optional: "Opcional",
              formButtonPrimary__continue: "Continuar",
              formButtonPrimary__finish: "Finalizar",
              formButtonPrimary__save: "Guardar",
              formButtonReset: "Limpiar",
              formFieldAction__forgotPassword: "¿Olvidaste tu contraseña?",
              formFieldAction__signIn: "Iniciar sesión",
              formFieldAction__signUp: "Registrarse",
              socialButtonsBlockButton__google: "Continuar con Google",
              socialButtonsBlockButton__github: "Continuar con GitHub",
              socialButtonsBlockButton__facebook: "Continuar con Facebook",
              footerActionLink__signIn: "Iniciar sesión",
              footerActionLink__signUp: "Registrarse",
              footerActionLink__forgotPassword: "¿Olvidaste tu contraseña?",
              footerActionText__signIn: "¿Ya tienes una cuenta?",
              footerActionText__signUp: "¿No tienes una cuenta?",
              footerActionText__forgotPassword: "¿Olvidaste tu contraseña?",
              footerPagesLink__help: "Ayuda",
              footerPagesLink__privacy: "Privacidad",
              footerPagesLink__terms: "Términos",
              identityPreviewEditButton: "Editar",
              identityPreviewText: "Continuar como",
              formResendCodeLink: "Reenviar código",
              formFieldError__matchingPasswords: "Las contraseñas no coinciden",
              formFieldError__minLength: "Debe tener al menos {{count}} caracteres",
              formFieldError__maxLength: "Debe tener menos de {{count}} caracteres",
              formFieldError__pattern: "Formato inválido",
              formFieldError__required: "Este campo es obligatorio",
            },
          }}
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
          }}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
