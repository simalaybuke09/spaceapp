import Link from 'next/link';
import Head from 'next/head';
import { Container } from 'react-bootstrap';

export default function Custom404() {
    return (
        <div className="bg-slate-950 min-h-screen flex items-center justify-center text-slate-100 overflow-hidden relative">
            <Head>
                <title>404 - Uzayda Kayboldun | KTU Uzay</title>
            </Head>

            {/* Arka Plan Süsü: Yıldız efektleri için minik bir dokunuş */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
                <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
            </div>

            <Container className="relative z-10 text-center">
                <div className="space-y-6">
                    {/* Büyük 404 Yazısı */}
                    <h1 className="text-[12rem] md:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-slate-900 opacity-50 select-none">
                        404
                    </h1>

                    <div className="-mt-12 md:-mt-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Houston, Bir Problemimiz Var! 🛰️
                        </h2>
                        <p className="text-slate-400 text-lg max-w-lg mx-auto mb-10 font-light italic">
                            Aradığın koordinatlar galaksimizde bulunamadı. Astronotumuz şu an rotasını düzeltmeye çalışıyor.
                        </p>

                        {/* Ana Sayfaya Dön Butonu */}
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-blue-900/40 no-underline hover:scale-105 active:scale-95"
                        >
                            Dünya'ya (Ana Sayfa) Dön
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}