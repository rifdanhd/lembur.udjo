import { PortalTitle } from "@/components/ticketing/PortalShared";
import { PasswordResetForm } from "@/components/ticketing/PasswordResetForm";
export default function ForgotPage() { return <><PortalTitle title="Lupa kata sandi" description="Minta tautan pemulihan untuk akun dengan email dan kata sandi." /><PasswordResetForm reset={false} /></>; }
