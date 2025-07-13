import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";
import { Badge } from "@/components/ui/badge";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  console.log("user", user);

  return (
    <div className="root-layout">

      <div className="flex flex-row justify-between items-center">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">InterviewAI</h2>
        </Link>
      </nav>

      <div className="flex flex-row gap-4">
        <Badge variant="outline" className = "text-xl">
          Credits: {user?.credits}
        </Badge>
        <Link href={`/profile/${user?.id}`}>
          <Image src="/user.webp" alt="profile" width={32} height={32} />
        </Link>
        </div>
      </div>

      {children}
    </div>
  );
};

export default Layout;
