import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { FC } from "react";
interface pageProps {}

const page = async({}) => {
  const session = await getServerSession(authOptions);
  return <pre>{JSON.stringify(session)}</pre>
}

export default page