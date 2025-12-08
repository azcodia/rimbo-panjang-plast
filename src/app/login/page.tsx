import Image from "next/image";
import LoginForm from "./LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex relative">
      <div className="flex-[3] relative flex items-center justify-center">
        <Image
          src="/images/background.png"
          width={200}
          height={200}
          alt="Industry Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <Image
          src="/images/logo.png"
          width={200}
          height={200}
          alt="Logo"
          className="absolute left-4 top-4 w-40 object-contain opacity-70"
        />
      </div>

      <div className="flex-[2] flex items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6 space-y-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
