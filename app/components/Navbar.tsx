'use client';

import { useEffect, useState } from 'react';
import { Camera, MessageCircle } from 'lucide-react';
import { sitePath } from '../site-path';

const links = [
  { number: '01', label: 'Início', href: '/#inicio' },
  { number: '02', label: 'Agendamento', href: '/agendar' },
  { number: '03', label: 'Contato', href: '/#contato' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href={sitePath('/#inicio')} aria-label="Daniel's Barber — início" onClick={() => setMenuOpen(false)}>
        <img className="brand-mark" src={sitePath('/logo-hd.png')} alt="" aria-hidden="true" />
        <span><strong>DANIEL&apos;S</strong><small>BARBER · LAVRAS</small></span>
      </a>

      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
        {links.map((link) => (
          <a href={sitePath(link.href)} key={link.number} onClick={() => setMenuOpen(false)}>
            <small>{link.number}</small><span>{link.label}</span>
          </a>
        ))}
      </nav>

      <div className="nav-social" aria-label="Redes sociais e contato">
        <a href="https://www.instagram.com/danielsbarber_04/" target="_blank" rel="noreferrer" aria-label="Instagram da Daniel's Barber"><Camera aria-hidden="true" /></a>
        <a href="https://wa.me/5535998416060" target="_blank" rel="noreferrer" aria-label="WhatsApp da Daniel's Barber"><MessageCircle aria-hidden="true" /></a>
      </div>

      <a className="nav-cta" href={sitePath('/agendar#reservar')}>
        <span><small>AGENDA ONLINE</small><strong>Reservar horário</strong></span><b>→</b>
      </a>

      <button className={`menu-button ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Abrir menu">
        <i /><i />
      </button>
    </header>
  );
}
