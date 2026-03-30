import { useState, useEffect } from 'react';
import CustomNavbar from './CustomNavbar';
import Footer from './Footer';

export default function Layout({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hydration hatasını önlemek için mounted olana kadar ham içeriği dönüyoruz
    return (
        <div
            className="bg-slate-950 min-h-screen text-slate-100"
            data-scroll-behavior={mounted ? "smooth" : undefined}
        >
            <CustomNavbar />

            <main className={mounted ? "pt-20" : ""}>
                {children}
            </main>

            <Footer />
        </div>
    );
}