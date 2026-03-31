import Head from 'next/head'; 
import Layout from '@/components/Layout'; 
import '@/styles/globals.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>KTÜ Uzay Kulübü</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}