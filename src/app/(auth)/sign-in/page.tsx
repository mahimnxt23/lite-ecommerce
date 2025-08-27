import AuthForm from "@/components/AuthForm";
import {signIn} from "@/lib/auth/actions";

export default function Page({
  searchParams,
}: {
  searchParams: { redirect_url?: string };
}) {
  return (
    <AuthForm
      mode="sign-in"
      onSubmit={signIn}
      redirectUrl={searchParams.redirect_url}
    />
  );
}
