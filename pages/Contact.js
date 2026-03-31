import Head from 'next/head';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function ContactPage() {
    const [mounted, setMounted] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false); // Harita kontrolü
    const [state, setState] = useState({
        submitting: false,
        succeeded: false,
        errors: []
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, submitting: true });
        const form = e.target;
        const formData = new FormData(form);

        const response = await fetch("https://formspree.io/f/maqljden", {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            setState({ submitting: false, succeeded: true, errors: [] });
            form.reset();
        } else {
            setState({ submitting: false, succeeded: false, errors: ["Bir hata oluştu."] });
        }
    };

    // Hydration koruması
    if (!mounted) return null;

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 py-20">
            <Head>
                <title>İletişim | KTÜ Uzay Kulübü</title>
            </Head>

            <Container>
                <Row className="g-5 items-start">
                    {/* SOL SÜTUN */}
                    <Col lg={5}>
                        <div className="flex flex-col gap-y-10">
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">İletişim</h2>
                                <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                            </div>

                            <div className="flex items-center gap-x-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                                        <FaEnvelope className="text-blue-500 text-lg" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">E-Posta</span>
                                        <a href="mailto:uzayktu@gmail.com" className="text-white text-sm font-medium no-underline hover:text-blue-400 transition-colors">
                                            uzayktu@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 border-l border-slate-800 pl-8">
                                    <a href="https://www.instagram.com/uzayktu" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
                                        <i className="bi bi-instagram text-2xl text-pink-500"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/company/uzayktu/" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
                                        <i className="bi bi-linkedin text-2xl text-blue-500"></i>
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 mt-1">
                                        <FaMapMarkerAlt className="text-blue-500 text-lg" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Adres</span>
                                        <p className="text-white text-sm font-medium m-0 leading-relaxed">
                                            KTÜ Kanuni Kampüsü, Hukuk Fakültesi Alt Katı, Ortahisar/Trabzon
                                        </p>
                                    </div>
                                </div>

                                {/* HARİTA ALANI: SKELETON EKLENDİ */}
                                <div className="rounded-[32px] overflow-hidden border border-slate-800 shadow-xl h-[280px] w-full relative bg-slate-900/50">
                                    {!mapLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Spinner animation="border" variant="primary" size="sm" />
                                            <span className="ml-3 text-slate-500 text-xs font-mono">HARİTA YÜKLENİYOR...</span>
                                        </div>
                                    )}
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5!2d39.775!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzAwLjAiTiAzOcKwNDYnMzAuMCJF!5e0!3m2!1str!2str!4v123456789"
                                        width="100%"
                                        height="100%"
                                        style={{
                                            border: 0,
                                            filter: 'grayscale(100%) invert(90%) contrast(90%)',
                                            opacity: mapLoaded ? 1 : 0
                                        }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        onLoad={() => setMapLoaded(true)} // Harita yüklendiğinde tetiklenir
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* SAĞ SÜTUN: FORM */}
                    <Col lg={7}>
                        <div className="bg-slate-900/60 border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-md min-h-[500px] flex flex-col justify-center">
                            {state.succeeded ? (
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">Mesajınız Alındı!</h2>
                                    <p className="text-slate-400">En kısa sürede size geri dönüş yapacağız.</p>
                                    <Button variant="link" onClick={() => setState({ ...state, succeeded: false })} className="text-blue-500 no-underline mt-4">Yeni bir mesaj gönder</Button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold text-white tracking-tight mb-10">Bize Mesaj Gönderin</h2>
                                    <Form onSubmit={handleSubmit} className="space-y-6">
                                        <Form.Group>
                                            <Form.Label className="text-slate-400 text-[11px] uppercase tracking-wider font-bold ml-1 mb-2">Ad Soyad</Form.Label>
                                            <Form.Control name="name" required type="text" placeholder="Adınız Soyadınız" className="!bg-slate-800/40 !border-slate-700/50 !text-white p-3.5 rounded-2xl shadow-none" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="text-slate-400 text-[11px] uppercase tracking-wider font-bold ml-1 mb-2">E-Posta</Form.Label>
                                            <Form.Control name="email" required type="email" placeholder="eposta@adresiniz.com" className="!bg-slate-800/40 !border-slate-700/50 !text-white p-3.5 rounded-2xl shadow-none" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="text-slate-400 text-[11px] uppercase tracking-wider font-bold ml-1 mb-2">Konu</Form.Label>
                                            <Form.Control name="subject" required type="text" placeholder="Mesajınızın konusu" className="!bg-slate-800/40 !border-slate-700/50 !text-white p-3.5 rounded-2xl shadow-none" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="text-slate-400 text-[11px] uppercase tracking-wider font-bold ml-1 mb-2">Mesajınız</Form.Label>
                                            <Form.Control name="message" required as="textarea" rows={4} placeholder="Buraya yazın..." className="!bg-slate-800/40 !border-slate-700/50 !text-white p-3.5 rounded-2xl shadow-none resize-none" />
                                        </Form.Group>
                                        <Button disabled={state.submitting} type="submit" className="w-fit mx-auto d-block bg-blue-800 hover:bg-blue-900 border-none py-3 px-10 rounded-2xl font-bold transition-all">
                                            {state.submitting ? "Gönderiliyor..." : "Mesajı Gönder"}
                                        </Button>
                                    </Form>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}