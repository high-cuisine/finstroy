import { Suspense } from "react";
import UnlockLoginForm from "./UnlockLoginForm";

export default function UnlockLoginPage() {
  return (
    <Suspense fallback={null}>
      <UnlockLoginForm />
    </Suspense>
  );
}
