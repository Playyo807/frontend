import "server-only";

import ClientPage from "./ClientPage";
import { auth } from "@/auth";

export default async function serverWrapper() {
  const session = await auth();

  return <ClientPage />;
}
