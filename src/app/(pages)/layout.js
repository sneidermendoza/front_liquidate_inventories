"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/header/header";

const AuthLayout = ({ children }) => {
  const session = useSession();
  const router = useRouter();

  console.log(session);
  useEffect(() => {
    // Verificar el estado de la sesión y redirigir si es necesario
    if (session.status === "unauthenticated") {
      router?.push("/");
    }
  }, [session.status, router]);

  // Renderizar los hijos solo si la sesión está autenticada
  return children != null & session.status === "authenticated" ? (
    <>
      <Header/>
      {children}
    </>
  ) : null;
};

export default AuthLayout;
