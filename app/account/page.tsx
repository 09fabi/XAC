import { auth } from "@clerk/nextjs";

export default function Page() {
  const { userId } = auth();
  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Bienvenido, usuario {userId}</h1>
    </div>
  );
}

