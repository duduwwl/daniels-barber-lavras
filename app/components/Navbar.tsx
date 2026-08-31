'use client';

import { useEffect, useState } from 'react';

const links = [
  { number: '01', label: 'Início', href: '/#inicio' },
  { number: '02', label: 'Profissionais', href: '/agendar#profissionais' },
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
      <a className="brand" href="/#inicio" aria-label="Daniel's Barber — início" onClick={() => setMenuOpen(false)}>
        <img className="brand-mark" src="/logo-instagram.jpg" alt="" aria-hidden="true" />
        <span><strong>DANIEL&apos;S</strong><small>BARBER · LAVRAS</small></span>
      </a>

      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
        {links.map((link) => (
          <a href={link.href} key={link.number} onClick={() => setMenuOpen(false)}>
            <small>{link.number}</small><span>{link.label}</span>
          </a>
        ))}
      </nav>

      <div className="nav-location" aria-label="Localização da barbearia">
        <i /><span>Lavras<small>Minas Gerais</small></span>
      </div>

      <a className="nav-cta" href="/agendar#reservar">
        <span><small>AGENDA ONLINE</small><strong>Reservar horário</strong></span><b>↗</b>
      </a>

      <button className={`menu-button ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Abrir menu">
        <i /><i />
      </button>
    </header>
  );
}
