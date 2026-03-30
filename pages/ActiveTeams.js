import useSWR from 'swr';
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getAllTeams } from '../lib/api';
// urlFor'u artık kullanmıyoruz, çünkü api.js veriyi pişirip gönderiyor.

export default function ActiveTeams({ teams: initialData }) {
  const [mounted, setMounted] = useState(false);

  const { data: teams } = useSWR('active-teams-list', getAllTeams, {
    fallbackData: initialData,
    revalidateOnFocus: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-20">
      <Head>
        <title>Takımlarımız | KTU Uzay Kulübü</title>
      </Head>

      <Container>
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white uppercase">
            AKTİF TAKIMLARIMIZ
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto italic">
            Gökyüzünün sınırlarını zorlayan, her biri farklı alanda uzmanlaşmış teknik ekiplerimizle tanışın.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {teams?.map((team, index) => (
            <div
              key={team.slug || index}
              className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 hover:bg-slate-900/60 transition-all duration-300 shadow-xl"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

                {/* SOL TARAF: LOGO VE İSİM */}
                <div className="flex flex-col items-center gap-4 w-full md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-8">
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
                        sizes="160px"
                        className="object-contain p-6 mix-blend-multiply"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 italic text-xs uppercase font-bold">Logo Yok</div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight text-center">
                    {team.name}
                  </h2>
                </div>

                {/* SAĞ TARAF: DETAYLAR */}
                <div className="flex flex-col gap-4 w-full md:w-3/4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold opacity-80">Yarışma Adı</label>
                    <h3 className="text-xl md:text-2xl font-semibold text-slate-100">{team.competition}</h3>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Takım Kaptanı</label>
                    <p className="text-lg text-slate-300 font-medium">{team.captain}</p>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Hakkında</label>
                    <p className="text-slate-400 leading-relaxed max-w-3xl">
                      {team.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export async function getStaticProps() {
  const teams = await getAllTeams();
  return {
    props: {
      teams: teams || [],
    },
    revalidate: 60,
  };
}