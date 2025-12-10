import { RegisterForm } from "@/components/auth/RegisterForm";
import { redirectIfAuth } from "@/lib/auth-middleware";

export default async function RegisterPage() {
  await redirectIfAuth();

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <RegisterForm />
    </div>
  );
}
