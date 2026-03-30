import { Container } from 'react-bootstrap';

export default function Footer() {
    return (
        <footer id="İletişim" className="py-12 bg-slate-950 border-t border-slate-800">
            <Container className="text-center">
                <div className="flex gap-8 justify-center mb-8">

                    <a
                        href="https://www.instagram.com/uzayktu?igsh=MThtM285ZGFycThlaw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110 duration-300"
                    >
                        <i className="bi bi-instagram" style={{
                            fontSize: '2.0rem',
                            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block',
                            lineHeight: '1'
                        }}></i>
                    </a>

                    {/* LinkedIn - Kurumsal Mavi Gradient Efektli */}
                    <a
                        href="https://www.linkedin.com/company/uzayktu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110 duration-300"
                    >
                        <i className="bi bi-linkedin" style={{
                            fontSize: '2.0rem',
                            background: 'linear-gradient(45deg, #0077b5 0%, #00a0dc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block',
                            lineHeight: '1'
                        }}></i>
                    </a>

                </div>

                <div className="space-y-2">
                    <p className="text-white font-medium tracking-wide">KTU Uzay Kulübü</p>
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} Tüm hakları saklıdır.
                    </p>
                </div>
            </Container>
        </footer>
    );
}