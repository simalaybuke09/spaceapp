import Layout from '@/components/Layout'; 
import '@/styles/globals.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
export default function App({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}