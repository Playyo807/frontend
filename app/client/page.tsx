import "server-only";
import ClientPage from "./ClientPage";
import dotenv from "dotenv";
import { auth } from "../../auth";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
dotenv.config();

export default async function serverWrapper() {
  const services = await prisma.service.findMany();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage serviceData={services} />
    </Suspense>
  );
}
