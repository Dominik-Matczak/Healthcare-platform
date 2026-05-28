import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  const user = session?.user;

  return (
    <h1>
      Welcome {user?.name}
      {user ? (
        <a href="/auth/logout">Logout</a>
      ) : (
        <a href="/auth/login">Login</a>
      )}
    </h1>
  );
}