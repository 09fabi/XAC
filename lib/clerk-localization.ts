import { esES } from "@clerk/localizations";

export const customESLocalization = {
  ...esES,
  locale: "es-ES",
  formFieldLabel__firstName: "Nombre",
  formFieldLabel__lastName: "Apellido",
  formFieldLabel__emailAddress: "Correo electrónico",
  formFieldLabel__password: "Contraseña",
  formFieldInputPlaceholder__firstName: "",
  formFieldInputPlaceholder__lastName: "",
  formFieldInputPlaceholder__emailAddress: "",
  formFieldInputPlaceholder__password: "",
  formFieldHintText__optional: "",
  signIn: {
    ...esES.signIn,
    title: "Iniciar sesión",
    subtitle: "",
  },
  signUp: {
    ...esES.signUp,
    title: "Crear cuenta",
    subtitle: "",
  },
} as typeof esES;

