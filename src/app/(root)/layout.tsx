import { Navbar, Footer } from "@/components";
import { CartInitializer } from "@/components/CartInitializer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartInitializer />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
