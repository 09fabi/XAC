"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center mt-10">
      <SignIn
        routing="path"
        path="/sign-in"
        appearance={{
          elements: {
            formButtonPrimary: "bg-black text-white",
          },
        }}
        signInOptions={{
          identifier: {
            emailAddress: true,
          },
          strategyOverrides: {
            email_code: true,
            email_link: true,
            password: true,
            oauth_google: true,
          },
        }}
      />
    </div>
  );
}

