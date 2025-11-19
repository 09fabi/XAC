"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center mt-10">
      <SignUp
        routing="path"
        path="/sign-up"
        appearance={{
          elements: {
            formButtonPrimary: "bg-black text-white",
          },
        }}
        signUpOptions={{
          strategyOverrides: {
            email_code: true,
            password: true,
            oauth_google: true,
          },
        }}
      />
    </div>
  );
}

