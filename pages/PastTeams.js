import useSWR from 'swr';
import Head from 'next/head';
import Image from 'next/image';
import { Container } from 'react-bootstrap';
import Link from 'next/link';
import { getAllPastTeams } from '../lib/api';
// urlFor'a artık ihtiyacımız yok, çünkü api.js veriyi pişirip gönderiyor.

export default function PastTeamsPage({ pastTeams: initialData }) {
  const { data: pastTeams } = useSWR('past-teams-list', getAllPastTeams, {
    fallbackData: initialData,
    revalidateOnFocus: true
  });

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-20">
      <Head>
        <title>Geçmiş Takımlar | KTU Uzay Kulübü</title>
      </Head>

      <Container>
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-slate-400 uppercase">
            GEÇMİŞ TAKIMLARIMIZ
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto italic">
            Kulübümüzün tarihinde iz bırakan ve başarılarıyla yolumuzu aydınlatan eski takımlarımız.
          </p>
        </div>

        <div className="flex flex-col gap-8 opacity-90">
          {pastTeams?.map((team, index) => (
            <Link
              href={`/${team.slug}`}
              key={team.slug || index}
              className="group block relative bg-slate-900/20 border border-slate-800/50 rounded-3xl p-6 md:p-8 hover:bg-slate-900/40 transition-all duration-300 no-underline"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

                {/* SOL TARAF: LOGO VE İSİM */}
                <div className="flex flex-col items-center gap-4 w-full md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-slate-800/50 pb-6 md:pb-0 md:pr-8">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-4 border-2 border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    {team.logo?.url && (
                      <Image
                        // urlFor yerine direkt .url kullanıyoruz
                        src={team.logo.url}
                        alt={team.name}
                        fill
                        // Bulanık yükleme efekti (LQIP)
                        placeholder="blur"
                        blurDataURL={team.logo.metadata?.lqip}
                        sizes="160px"
                        priority={index < 2}
                        className="object-contain p-6 mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-400 group-hover:text-white transition-colors">
                    {team.name}
                  </h2>
                </div>

                {/* SAĞ TARAF: DETAYLAR */}
                <div className="flex flex-col gap-4 w-full md:w-3/4">
                  <div className="flex justify-between items-start">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Yarışma Adı</label>
                      <h3 className="text-xl md:text-2xl font-semibold text-slate-300">{team.competition}</h3>
                    </div>
                    <div className="bg-slate-800/50 px-4 py-1 rounded-full border border-slate-700">
                      <span className="text-xs font-mono text-slate-400">{team.period}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">Takım Kaptanı</label>
                    <p className="text-lg text-slate-400 font-medium">{team.captain}</p>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">Hakkında</label>
                    <p className="text-slate-500 leading-relaxed max-w-3xl line-clamp-3">
                      {team.description}
                    </p>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}

export async function getStaticProps() {
  const pastTeams = await getAllPastTeams();
  return {
    props: {
      pastTeams: pastTeams || [],
    },
    revalidate: 60,
  };
}