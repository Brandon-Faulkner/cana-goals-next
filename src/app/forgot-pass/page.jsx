import Image from "next/image";
import { ForgotPassForm } from "@/components/forms/forgot-pass-form";
import RouteGuard from "@/components/auth/route-guard";

export const metadata = {
  title: "Cana Goals | Forgot Password"
}

export default function Page() {
  return (
    <RouteGuard mode="public">
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="flex items-center gap-2 self-center font-medium text-lg">
            <Image src="/android-chrome-192x192.png" alt="Cana Goals main logo" width={24} height={24} className="m-auto" />
            Cana Goals
          </div>
          <ForgotPassForm />
        </div>
      </div>
    </RouteGuard>
  );
}