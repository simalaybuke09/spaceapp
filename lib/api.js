import { client } from './sanity';

// 1. AKTİF TAKIMLAR: Sadece gerekli alanlar + Logo metadata (LQIP)
export async function getAllTeams() {
    return await client.fetch(
        `*[_type == "activeteams"]{
            name,
            competition,
            captain,
            description,
            "slug": slug.current,
            "logo": logo.asset->{
                url,
                metadata { lqip }
            }
        }`
    );
}

// 2. GEÇMİŞ TAKIMLAR LİSTESİ: Arşiv resimlerini ÇEKMİYORUZ (Hız için kritik)
export async function getAllPastTeams() {
    return await client.fetch(
        `*[_type == "pastteams"] | order(period desc){
            name, 
            competition, 
            captain, 
            period, 
            description, 
            "slug": slug.current,
            "logo": logo.asset->{
                url,
                metadata { lqip }
            }
        }`
    );
}

// 3. TAKIM DETAY: Burada her şeyi (Arşiv dahil) çekiyoruz
export async function getTeamDetail(slug) {
    if (!slug) return null;
    return await client.fetch(
        `*[_type == "pastteams" && slug.current == $slug][0]{
            name, 
            competition, 
            captain, 
            period, 
            description, 
            "slug": slug.current,
            "logo": logo.asset->{ url, metadata { lqip } },
            archiveImages[] {
                asset-> {
                    _id,
                    url,
                    metadata { lqip, dimensions }
                }
            }
        }`,
        { slug: slug }
    );
}

// 4. BAŞARILAR: Yıla göre sıralı ve optimize
export async function getAllAchievements() {
    return await client.fetch(
        `*[_type == "achievement"] | order(year desc, order asc){
            title,
            award,
            teamName,
            year,
            description,
            "image": image.asset->{
                url,
                metadata { lqip }
            }
        }`
    );
}

// 5. SPONSORLAR: Tier (Seviye) bazlı sıralama
export async function getAllSponsors() {
    return await client.fetch(
        `*[_type == "sponsor"] | order(tier asc, order asc){
            name,
            url,
            tier,
            "logo": logo.asset->{
                url,
                metadata { lqip }
            }
        }`
    );
}

// 6. ANA SAYFA VERİSİ: EN ÖNEMLİ OPTİMİZASYON BURASI!
// Her şeyi çekmek yerine sadece ihtiyacımız olan alanları isimlendirerek alıyoruz.
export async function getHomePageData() {
    return await client.fetch(
        `*[_type == "homePage"][0]{
            activeTeamCount,
            activeMemberCount,
            achievementCount,
            aboutText,
            whatWeDoText,
            "heroImage": heroImage.asset->{ url, metadata { lqip } },
            "aboutImages": aboutImages[].asset->{ url, metadata { lqip } },
            "whatWeDoImages": whatWeDoImages[].asset->{ url, metadata { lqip } }
        }`
    );
}