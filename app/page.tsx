import { redirect } from "next/navigation";
import "server-only";

export default async function serverWrapper() {
    redirect('/client');
};