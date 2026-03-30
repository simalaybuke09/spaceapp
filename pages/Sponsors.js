import useSWR from 'swr'; // 1. SWR'ı içe aktar
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getAllSponsors } from '../lib/api';
import { urlFor } from '../lib/sanity';

// SWR fetcher fonksiyonu
const fetcher = () => getAllSponsors();

export default function SponsorsPage({ sponsors: initialData }) {
    const [mounted, setMounted] = useState(false);

    // 2. SWR Kurulumu: Statik veriyi (initialData) baz alır, arka planda günceller
    const { data: sponsors } = useSWR('sponsors-list', fetcher, {
        fallbackData: initialData,
        revalidateOnFocus: true,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hydration uyuşmazlığını engellemek için
    if (!mounted) return null;

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 py-20">
            <Head>
                <title>Sponsorlar | KTU Uzay Kulübü</title>
            </Head>

            <Container>
                {/* Üst Başlık */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 uppercase">
                        DEĞERLİ SPONSORLARIMIZ
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Geleceğin teknolojilerini inşa ederken bizlere destek olan tüm paydaşlarımıza teşekkür ederiz.
                    </p>
                    <div className="w-16 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Sponsor Grid - SWR datasından beslenir */}
                <Row className="justify-content-center g-4 md:g-5">
                    {sponsors?.map((sponsor, index) => (
                        <Col xs={6} md={4} lg={3} key={sponsor._id || index}>
                            <a
                                href={sponsor.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center no-underline"
                            >
                                {/* Logo Kutusu */}
                                <div className="relative w-full aspect-square bg-white rounded-3xl p-6 md:p-8 flex items-center justify-center shadow-xl transition-all duration-500 hover:shadow-blue-500/20 hover:-translate-y-2 border border-white/5">
                                    <div className="relative w-full h-full transition-all duration-500 grayscale group-hover:grayscale-0 scale-95 group-hover:scale-105">
                                        {sponsor.logo ? (
                                            <Image
                                                src={sponsor.logo.url}
                                                alt={sponsor.name}
                                                fill
                                                priority={index < 4} // İlk satırdaki sponsorları öncelikli yükle
                                                sizes="(max-width: 768px) 150px, 200px"
                                                className="object-contain"
                                                placeholder="blur"
                                                blurDataURL={sponsor.logo.metadata.lqip}
                                            />
                                        ) : (
                                            <div className="text-slate-300 text-xs font-bold text-center">LOGO EKSİK</div>
                                        )}
                                    </div>
                                </div>
                                {/* Altına Yazılan İsim */}
                                <p className="mt-4 text-sm md:text-base font-semibold text-slate-400 group-hover:text-blue-400 transition-colors tracking-wide uppercase text-center">
                                    {sponsor.name}
                                </p>
                            </a>
                        </Col>
                    ))}
                </Row>

                {/* Sponsorluk Çağrısı */}
                <div className="mt-20 p-10 bg-blue-600/5 border border-blue-600/20 rounded-3xl text-center">
                    <h3 className="text-2xl font-bold mb-4">Bize Destek Olun</h3>
                    <p className="text-slate-400 mb-6 font-light">
                        Geleceğin mühendislik projelerinde yanımızda yer almak ister misiniz?
                    </p>
                    <a
                        href="mailto:uzayktu@gmail.com"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-600/40 no-underline"
                    >
                        Sponsorluk Dosyası Al
                    </a>
                </div>
            </Container>
        </div>
    );
}

// Statik Veri Çekme (İlk yükleme hızı ve SEO için)
export async function getStaticProps() {
    const sponsors = await getAllSponsors();
    return {
        props: {
            sponsors: sponsors || [],
        },
        revalidate: 60, // Her dakika statik içeriği yenile
    };
}