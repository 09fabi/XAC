import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();
  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Bienvenido, usuario {userId}</h1>
    </div>
  );
}

