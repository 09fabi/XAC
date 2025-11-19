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
            formButtonPrimary: "bg-black text-white hover:bg-neutral-800",
            card: "shadow-xl",
          },
        }}
      />
    </div>
  );
}
