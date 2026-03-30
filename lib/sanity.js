import { createClient } from 'next-sanity';
// Süslü parantez ekledik ve ismini güncelledik (VS Code artık kızmayacak)
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_NAME,
    useCdn: true,
    apiVersion: "2026-03-28",
});

// Fonksiyon ismini de yukarıdakiyle eşledik
const builder = createImageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);