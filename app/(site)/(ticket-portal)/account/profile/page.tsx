import { currentVisitor } from "@/lib/ticketing/visitor-server";
import { PortalTitle, LoginPrompt } from "@/components/ticketing/PortalShared";
import { ProfileForm } from "@/components/ticketing/ProfileForm";
export const metadata = { title: "Profil Saya" };
export default async function ProfilePage() { const visitor = await currentVisitor(); return <><PortalTitle title="Profil saya" description="Perbarui nama untuk kunjunganmu berikutnya." />{visitor ? <ProfileForm visitor={visitor} /> : <LoginPrompt next="/account/profile" />}</>; }
