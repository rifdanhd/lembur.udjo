import StatusPage from "../../../pesanan/[orderNumber]/page";
export const metadata = { title: "Detail Reservasi" };
export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) { return StatusPage({ params: Promise.resolve({ orderNumber: (await params).id }) }); }
