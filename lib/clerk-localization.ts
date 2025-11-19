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
    ...(esES.signIn || {}),
    title: "Iniciar sesión",
    subtitle: "",
    emailAddress: {
      ...(esES.signIn?.emailAddress || {}),
      placeholder: "",
    },
    password: {
      ...(esES.signIn?.password || {}),
      placeholder: "",
    },
  },
  signUp: {
    ...(esES.signUp || {}),
    title: "Crear cuenta",
    subtitle: "",
    firstName: {
      ...(esES.signUp?.firstName || {}),
      placeholder: "",
    },
    lastName: {
      ...(esES.signUp?.lastName || {}),
      placeholder: "",
    },
    emailAddress: {
      ...(esES.signUp?.emailAddress || {}),
      placeholder: "",
    },
    password: {
      ...(esES.signUp?.password || {}),
      placeholder: "",
    },
  },
};

