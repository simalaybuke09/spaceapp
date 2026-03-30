import useSWR from 'swr';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { Container, Carousel } from 'react-bootstrap';
import { getTeamDetail } from '../lib/api';
import { client } from '../lib/sanity'; // urlFor'u artık burada da silebilirsin

const fetcher = (slug) => getTeamDetail(slug);

export default function TeamDetail({ team: initialData }) {
    const router = useRouter();
    const { slug } = router.query;

    // SWR Key'i daha spesifik yapalım: 'team-detail-slug'
    const { data: team } = useSWR(slug ? `team-detail-${slug}` : null, () => fetcher(slug), {
        fallbackData: initialData,
        revalidateOnFocus: true
    });

    if (router.isFallback) return <div className="text-white text-center py-20 font-mono tracking-widest">VERİLER ÇEKİLİYOR...</div>;
    if (!team) return <div className="text-white text-center py-20">Takım bulunamadı.</div>;

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 py-20">
            <Head><title>{`${team.name} | Arşiv`}</title></Head>

            <Container>
                {/* Üst Kısım: Detay Kartı */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 mb-16 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                        <div className="flex flex-col items-center gap-6 w-full md:w-1/3 shrink-0 border-b md:border-b-0 md:border-r border-slate-800/50 pb-8 md:pb-0 md:pr-12">
                            <div className="relative w-48 h-48 rounded-full bg-white p-4 border-2 border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden">
                                {team.logo?.url && (
                                    <Image
                                        src={team.logo.url} // urlFor yerine direkt pişmiş url
                                        alt={team.name}
                                        fill
                                        priority
                                        sizes="192px"
                                        className="object-contain p-6 mix-blend-multiply"
                                        placeholder="blur"
                                        blurDataURL={team.logo.metadata?.lqip}
                                    />
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center tracking-tight leading-tight">{team.name}</h1>
                        </div>

                        <div className="flex flex-col gap-6 w-full md:w-2/3 py-2">
                            <span className="bg-blue-600/10 text-blue-400 text-[10px] font-black tracking-[0.3em] px-4 py-1.5 rounded-full border border-blue-600/20 w-fit uppercase">
                                {team.period} ARŞİVİ
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-100">{team.competition}</h2>
                            <p className="text-slate-400 text-lg leading-relaxed font-light italic">"{team.description}"</p>
                            <div className="pt-4 border-t border-slate-800/50">
                                <span className="text-slate-500 text-sm uppercase tracking-widest">Takım Kaptanı:</span>
                                <p className="text-slate-200 font-semibold text-lg">{team.captain}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Arşiv Carousel */}
                {team.archiveImages && team.archiveImages.length > 0 && (
                    <div className="mt-20 space-y-8">
                        <div className="text-center">
                            <h3 className="text-[10px] font-black tracking-[0.4em] text-blue-500/80 uppercase italic">Geçmişten Kareler</h3>
                            <div className="h-0.5 w-12 bg-blue-600 mx-auto mt-3 rounded-full opacity-50"></div>
                        </div>

                        <Carousel fade interval={4000} className="rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800/50 max-w-5xl mx-auto">
                            {team.archiveImages.map((img, idx) => {
                                // Asset yapısını api.js'deki yeni yapıya göre alıyoruz
                                const asset = img.asset || img;

                                return (
                                    <Carousel.Item key={idx}>
                                        <div className="relative h-[350px] md:h-[500px] w-full group">
                                            <Image
                                                src={asset.url} // api.js içinde asset->{url} demiştik
                                                alt={`Arşiv Görseli ${idx + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 1024px) 100vw, 1024px"
                                                placeholder="blur"
                                                blurDataURL={asset.metadata?.lqip}
                                                quality={80}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 right-6 text-[10px] font-mono text-white/30 tracking-widest uppercase">
                                                Görsel {idx + 1} / {team.archiveImages.length}
                                            </div>
                                        </div>
                                    </Carousel.Item>
                                );
                            })}
                        </Carousel>
                    </div>
                )}
            </Container>
        </div>
    );
}

export async function getStaticPaths() {
    const teams = await client.fetch(`*[_type == "pastteams"]{ "slug": slug.current }`);
    const paths = teams.map((t) => ({
        params: { slug: t.slug },
    }));
    return {
        paths,
        fallback: 'blocking'
    };
}

export async function getStaticProps({ params }) {
    const team = await getTeamDetail(params.slug);
    if (!team) return { notFound: true }; // Takım yoksa 404'e atar
    return { props: { team }, revalidate: 10 };
}