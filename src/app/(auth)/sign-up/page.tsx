import AuthForm from "@/components/AuthForm";
import {signUp} from "@/lib/auth/actions";

export default function Page({
  searchParams,
}: {
  searchParams: { redirect_url?: string };
}) {
  return (
    <AuthForm
      mode="sign-up"
      onSubmit={signUp}
      redirectUrl={searchParams.redirect_url}
    />
  );
}
