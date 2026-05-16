// app/(marketing)/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import "@/global.css";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <main className="">
            {children}
        </main>
      <Footer />
    </div>
  );
}

