"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';


export default function CustomNavbar() {
    const [mounted, setMounted] = useState(false);
    const [activeKey, setActiveKey] = useState('#Anasayfa');
    const [expanded, setExpanded] = useState(false);

    const handleNavLinkClick = (key) => {
        setActiveKey(key);
        setExpanded(false); // Menüyü kapat!
    };
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // Tarayıcı emin olana kadar render etme

    return (
        <Navbar
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)} // Üç çizgiye basınca state'i değiştir
            expand="lg"
            variant="dark"
            // Inline style ile tarayıcıya "burada çakılı kal" diyoruz
            style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 9999, // Her şeyin en üstünde
                backgroundColor: 'rgba(2, 6, 23, 0.7)', // bg-slate-950 %70 opak
                backdropFilter: 'blur(12px)', // Flu efekti
                borderBottom: '1px solid rgba(30, 41, 59, 0.5)' // border-slate-800/50
            }}
            className="shadow-2xl"
        >
            <Container>
                <Navbar.Brand href="/#Anasayfa" className="flex items-center group no-underline">
                    {/* Logo Alanı - Üzerine gelince hafif döner */}
                    <div className="relative w-12 h-12 md:w-14 md:h-14 mr-3 transition-transform duration-500 group-hover:rotate-[10deg]">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            priority // Bunu ekle
                            loading="eager" // Bunu ekle
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain"
                        />
                    </div>

                    {/* Yazı Alanı */}
                    <div className="flex flex-col leading-none">
                        <span className="text-xl md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-blue-400 group-hover:to-blue-600 transition-all duration-500">
                            KTÜ UZAY
                        </span>
                        <span className="text-[10px] md:text-[11px] font-bold tracking-[0.4em] text-blue-500 uppercase mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            Kulübü
                        </span>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="gap-2 p-4 md:p-0 items-center">
                        <Link
                            href="/#Anasayfa"
                            className={`nav-link px-3 py-2 transition-all text-white no-underline flex items-center ${activeKey === '#Anasayfa' ? 'bg-white/10 rounded-full' : ''
                                }`}
                            onClick={() => handleNavLinkClick('#Anasayfa')}
                            style={{ fontWeight: '500' }}
                        >
                            Anasayfa
                        </Link>
                        <NavDropdown 
                            title={
                                <span className="text-white transition-all duration-300 hover:text-blue-400" style={{ fontWeight: '500' }}>
                                    Takımlar
                                </span>
                            }
                            id="teams-dropdown"
                            className="custom-dropdown">
                            <Link
                                href="/ActiveTeams"
                                className="dropdown-item no-underline transition-colors"
                                onClick={() => setExpanded(false)}
                            >
                                Aktif Takımlar
                            </Link>

                            <Link
                                href="/PastTeams"
                                className="dropdown-item no-underline transition-colors"
                                onClick={() => setExpanded(false)}
                            >
                                Geçmiş Takımlar
                            </Link>
                        </NavDropdown>

                        {/* Başarılar Linki */}
                        <Link
                            href="/Achievements"
                            className={`nav-link px-3 py-2 transition-all text-white no-underline flex items-center ${activeKey === '/Achievements' ? 'bg-white/10 rounded-full' : ''
                                }`}
                            onClick={() => handleNavLinkClick('/Achievements')}
                            style={{ fontWeight: '500' }}
                        >
                            Başarılar
                        </Link>

                        {/* Sponsorlar Linki */}
                        <Link
                            href="/Sponsors"
                            className={`nav-link px-3 py-2 transition-all text-white no-underline flex items-center ${activeKey === '/Sponsors' ? 'bg-white/10 rounded-full' : ''
                                }`}
                            onClick={() => handleNavLinkClick('/Sponsors')}
                            style={{ fontWeight: '500' }}
                        >
                            Sponsorlar
                        </Link>

                        {/* İletişim Linki */}
                        <Link
                            href="/Contact"
                            className={`nav-link px-3 py-2 transition-all text-white no-underline flex items-center ${activeKey === '/Contact' ? 'bg-white/10 rounded-full' : ''
                                }`}
                            onClick={() => handleNavLinkClick('/Contact')}
                            style={{ fontWeight: '500' }}
                        >
                            İletişim
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <style jsx global>{`
                .dropdown-menu {
                    background-color: rgba(2, 6, 23, 0.9) !important;
                    backdrop-filter: blur(15px) !important;
                    border: 1px solid rgba(30, 41, 59, 0.5) !important;
                    margin-top: 10px !important;
                }
                .dropdown-item { color: white !important; }
                .dropdown-item:hover { background-color: rgba(255, 255, 255, 0.1) !important; }
            `}</style>
        </Navbar>
    );
}