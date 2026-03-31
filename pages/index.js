import useSWR from 'swr';
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { getAllTeams, getHomePageData } from '../lib/api';
import { urlFor } from '../lib/sanity';

// SWR için fetcher fonksiyonu: Tüm verileri tek pakette topluyoruz
const fetchHomeData = async () => {
  const [teams, homeData] = await Promise.all([
    getAllTeams(),
    getHomePageData()
  ]);
  return { teams, homeData };
};

export default function Home({ teams: initialTeams, homeData: initialHomeData }) {
  const [mounted, setMounted] = useState(false);
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.3, triggerOnce: true });

  // 1. SWR YAPILANDIRMASI: Statik veriyi (initial) kullanır, arka planda günceller.
  const { data } = useSWR('home-page-live-data', fetchHomeData, {
    fallbackData: { teams: initialTeams, homeData: initialHomeData },
    revalidateOnFocus: true, // Sekmeye dönünce veriyi tazeler
    dedupingInterval: 10000  // 10 saniye içinde mükerrer istek atmaz
  });

  // Hydration hatasını önlemek için mounted kontrolü
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verilere güvenli erişim (SWR datasından çekiyoruz)
  const homeData = data?.homeData || {};
  const teams = data?.teams || [];

  const statsDisplay = [
    { value: homeData.activeTeamCount || 0, label: "Aktif Takım" },
    { value: homeData.activeMemberCount || 0, label: "Aktif Üye Sayısı" },
    { value: homeData.achievementCount || 0, label: "Başarılarımız" },
  ];
  const heroBgImage = homeData.heroImage?.url || '/uzay_home.jpg';

  // Sunucu ve Tarayıcı senkronizasyonu için kritik kontrol
  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>KTU Uzay Kulübü | Uzay Keşfedilmeyi Bekliyor...</title>
      </Head>

      <div className="bg-slate-950 text-slate-100 min-h-screen font-sans" data-scroll-behavior="smooth">

        {/* --- Hero Section --- */}
        <div id="Anasayfa" className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroBgImage}
              alt="Uzay Arka Plan"
              fill
              className="object-cover"
              priority
              loading="eager"
              sizes="100vw"
              quality={85}
              placeholder="blur"
              // HATALI YER: team.logo... yerine homeData.heroImage... kullanmalısın
              blurDataURL={homeData.heroImage?.metadata?.lqip || heroBgImage}
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <Container className="relative z-10 text-center flex flex-col items-center gap-6 md:gap-8 p-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tighter italic w-full max-w-4xl drop-shadow-2xl">
              Uzay Keşfedilmeyi Bekliyor...
            </h1>

            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-50"></div>

            <div className="flex gap-8 mt-32 md:mt-48 transition-all duration-700 ease-out">
              <a href="https://www.instagram.com/uzayktu" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110 duration-300">
                <i className="bi bi-instagram" style={{ fontSize: '1.8rem', color: '#e4405f' }}></i>
              </a>
              <a href="https://www.linkedin.com/company/uzayktu/" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110 duration-300">
                <i className="bi bi-linkedin" style={{ fontSize: '1.8rem', color: '#0077b5' }}></i>
              </a>
            </div>
          </Container>
        </div>

        {/* --- Hakkımızda --- */}
        <Container id="Hakkımızda" className="py-16 md:py-24 border-t border-slate-800">
          <Row className="gap-y-12 items-center">
            <Col lg={7}>
              <Carousel fade interval={4000} className="rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                {homeData.aboutImages?.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <div className="relative aspect-video">
                      <Image
                        // 1. urlFor DEĞİL, direkt optimize edilmiş url
                        src={img.url}
                        alt={`Galeri Görseli ${idx}`}
                        fill
                        // 2. ÖNEMLİ: className'den ÖNCE sizes ekle
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        className="object-cover"
                        // 3. Filip Jerga Usulü Blur
                        placeholder="blur"
                        blurDataURL={img.metadata?.lqip}
                        // 4. Kaliteyi biraz düşürerek (80) hızı artır
                        quality={80}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
            <Col lg={5} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Hakkımızda</h2>
              <p className="text-lg text-slate-300 leading-relaxed">{homeData.aboutText}</p>
            </Col>
          </Row>
        </Container>

        {/* --- Neler Yapıyoruz? --- */}
        <Container id="NelerYapıyoruz?" className="py-16 md:py-24 bg-slate-900 border-t border-slate-800">
          <Row className="gap-y-12 items-center">
            <Col lg={5} className="space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Neler Yapıyoruz?</h2>
              <p className="text-lg text-slate-300 leading-relaxed">{homeData.whatWeDoText}</p>
            </Col>
            <Col lg={7}>
              <Carousel fade interval={4000} className="rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                {homeData.whatWeDoImages?.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <div className="relative aspect-video">
                      <Image
                        // 1. urlFor yerine direkt img.url (api.js'de optimize ettiğimiz için)
                        src={img.url}
                        alt="Faaliyet"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 800px"
                        placeholder="blur"
                        // 2. team.logo yerine döngüdeki güncel resmin (img) verisini kullanıyoruz
                        blurDataURL={img.metadata?.lqip}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          </Row>
        </Container>

        {/* --- Rakamlarda Biz --- */}
        <Container id="RakamlardaBiz" ref={statsRef} className="py-24 md:py-32 text-center bg-slate-950">
          <h2 className="text-white text-xl font-light mb-20 tracking-[0.2em] opacity-50 uppercase">Rakamlarda Biz</h2>
          <Row className="justify-content-center">
            {statsDisplay.map((stat, index) => (
              <Col key={index} xs={12} md={4} className={`text-center py-6 ${index !== 2 ? 'md:border-r border-slate-800/50' : ''}`}>
                <div className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-none">
                  {statsInView ? <CountUp start={0} end={stat.value} duration={2.5} /> : "0"}
                </div>
                <span className="text-slate-500 uppercase tracking-[0.4em] text-[10px] font-bold mt-6 inline-block">
                  {stat.label}
                </span>
              </Col>
            ))}
          </Row>
        </Container>

        {/* --- Aktif Takımlar --- */}
        <Container id="AktifTakımlar" className="py-20 md:py-28 bg-slate-900 border-t border-slate-800">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-white mb-16 uppercase">
            Aktif Takımlarımız
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-x-8 gap-y-12 items-start">
            {teams.map((team, index) => (
              <div key={index} className="flex flex-col items-center gap-6 p-4 rounded-xl transition hover:bg-slate-800/60 hover:-translate-y-1 group cursor-default">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-4 border-2 border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-blue-500">
                  {team.logo?.url ? (
                    <Image
                      // urlFor yerine direkt api.js'den gelen url
                      src={team.logo.url}
                      alt={team.name}
                      fill
                      // Bulanık yükleme efekti (LQIP)
                      placeholder="blur"
                      blurDataURL={team.logo.metadata?.lqip}
                      priority={index < 3}
                      sizes="(max-width: 768px) 128px, 160px"
                      // mix-blend-multiply: Beyaz arka planlı logoları şeffaf gibi gösterir
                      className="object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 italic text-xs uppercase font-bold text-center p-4">
                      Logo Yok
                    </div>
                  )}
                </div>
                <p className="text-sm md:text-base font-semibold text-center text-slate-300 group-hover:text-white transition-colors">
                  {team.name}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <a href="/ActiveTeams" className="text-blue-500 hover:text-blue-400 font-bold tracking-widest uppercase text-xs border-b border-blue-500/30 pb-1 transition-all">
              Tüm Takım Detaylarını Gör →
            </a>
          </div>
        </Container>

      </div>
    </>
  );
}

export async function getStaticProps() {
  const [teams, homeData] = await Promise.all([
    getAllTeams(),
    getHomePageData()
  ]);

  return {
    props: {
      teams: teams || [],
      homeData: homeData || null,
    },
    revalidate: 60, // Her dakika statik sayfayı yenile
  };
}