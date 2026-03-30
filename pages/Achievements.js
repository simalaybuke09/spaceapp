import useSWR from 'swr';
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getAllAchievements } from '../lib/api';

export default function AchievementsPage({ achievements: initialData }) {
    const [mounted, setMounted] = useState(false);

    // 1. SWR YAPILANDIRMASI: Canlı veri takibi
    const { data: achievements } = useSWR('achievements-list', getAllAchievements, {
        fallbackData: initialData,
        revalidateOnFocus: true
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hydration koruması
    if (!mounted) return null;

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 py-24">
            <Head>
                <title>Başarılarımız | KTU Uzay Kulübü</title>
            </Head>

            <Container>
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase">
                        GURUR TABLOMUZ
                    </h1>
                    <div className="h-1.5 w-32 bg-blue-600 mx-auto rounded-full mb-8"></div>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg italic">
                        Gökyüzüne kazıdığımız her başarının arkasında bitmek bilmeyen bir azim ve takım ruhu var.
                    </p>
                </div>

                <Row className="gap-y-12">
                    {achievements?.map((item, index) => (
                        <Col key={index} lg={6} xl={4}>
                            <div className="group bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden hover:bg-slate-900/60 transition-all duration-500 hover:-translate-y-2 shadow-2xl">

                                {/* Başarı Görseli */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    {item.image?.url ? (
                                        <Image
                                            // 2. MODERN IMAGE: urlFor yerine direkt api.js'den gelen url
                                            src={item.image.url}
                                            alt={item.title}
                                            fill
                                            // 3. BLUR-UP: Bulanık yükleme efekti
                                            placeholder="blur"
                                            blurDataURL={item.image.metadata?.lqip}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority={index < 3} // İlk 3 başarıyı (üst sıra) öncelikli yükle
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600 font-bold italic">Görsel Yok</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
                                            {item.year}
                                        </span>
                                    </div>
                                </div>

                                {/* İçerik Bölümü */}
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="text-blue-500 font-mono text-sm mb-4 tracking-tight">
                                        🏆 {item.award}
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {item.description}
                                    </p>
                                    <div className="pt-6 border-t border-slate-800/50 flex justify-between items-center">
                                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Takım</span>
                                        <span className="text-slate-200 text-xs font-semibold">{item.teamName}</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export async function getStaticProps() {
    const achievements = await getAllAchievements();
    return {
        props: { achievements: achievements || [] },
        revalidate: 60,
    };
}