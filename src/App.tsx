import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PricingSection } from './components/PricingSection';
import { PortfolioSection } from './components/PortfolioSection';
import { AboutSection } from './components/AboutSection';
import { ProcessSection } from './components/ProcessSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { SiteData } from './types';
import { fetchSiteData, getAdminToken } from './lib/api';

export default function App() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Pre-fill service in contact form
  const [preFilledService, setPreFilledService] = useState<string | undefined>(undefined);

  const loadData = async () => {
    try {
      const result = await fetchSiteData();
      setData(result);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching site data:', err);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setIsAdminLoggedIn(Boolean(getAdminToken()));
  }, []);

  const handleSelectServiceForContact = (serviceTitle: string) => {
    setPreFilledService(serviceTitle);
    const contactElem = document.getElementById('contacto');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#DCE5E0] border-t-[#064E3B] rounded-full animate-spin mb-4" />
        <span className="font-display font-bold text-base text-[#064E3B] tracking-tight">
          MAREVAS <span className="font-medium text-[#2F5E4E]">MKT</span>
        </span>
        <span className="text-xs text-[#2F5E4E] mt-1">Cargando experiencia creativa...</span>
      </div>
    );
  }

  // Fallback if data is null
  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display font-bold text-xl text-[#064E3B] mb-2">
          Cargando Marevas MKT
        </h2>
        <p className="text-sm text-[#2F5E4E] mb-4">
          {error || 'Iniciando servicios del servidor...'}
        </p>
        <button
          onClick={() => loadData()}
          className="px-4 py-2 bg-[#064E3B] text-white rounded-lg text-xs font-semibold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#064E3B] selection:bg-[#2F5E4E] selection:text-white">
      {/* Navbar */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        logoUrl={data.settings.logoUrl}
      />

      <main id="main-content">
        {/* 1. Hero Section */}
        <Hero
          settings={data.settings}
          onExploreProjects={() => scrollToSection('portfolio')}
          onContactClick={() => scrollToSection('contacto')}
        />

        {/* 2. Services Section */}
        <ServicesSection
          services={data.services}
          onSelectServiceForContact={handleSelectServiceForContact}
        />

        {/* 3. Planes y Precios */}
        <PricingSection />

        {/* 4. Visual Portfolio (Reels & Vertical Content) */}
        <PortfolioSection
          projects={data.projects}
          onOpenProjectContact={(projectTitle) =>
            handleSelectServiceForContact(`Consulta sobre proyecto: ${projectTitle}`)
          }
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 4. Sobre Marevas */}
        <AboutSection
          settings={data.settings}
          onContactClick={() => scrollToSection('contacto')}
        />

        {/* 5. Proceso de Trabajo */}
        <ProcessSection />

        {/* 6. Contacto & Canales */}
        <ContactSection
          settings={data.settings}
          selectedServicePreFill={preFilledService}
          onClearPreFill={() => setPreFilledService(undefined)}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={data.settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Official WhatsApp Button */}
      <a
        href="https://wa.me/34653745138?text=%C2%A1Hola%20Marevas%20MKT!%20Me%20gustar%C3%ADa%20consultar%20una%20propuesta%20de%20contenido%20audiovisual."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-emerald-900/30 transition-all duration-300 hover:scale-105 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#25D366] border border-white/20"
        aria-label="Contactar por WhatsApp (+34 653 745 138)"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.693.074-2.147-.532-1.859-.774-3.045-2.668-3.138-2.792-.092-.124-.757-.999-.757-1.91 0-.912.482-1.358.653-1.545.172-.187.375-.233.5-.233.125 0 .25.002.359.006.115.005.27-.043.422.325.158.381.54 1.32.587 1.415.047.094.078.204.015.328-.063.125-.094.204-.188.312-.094.11-.198.245-.282.329-.094.094-.192.196-.083.383.11.187.487.804 1.045 1.302.72.641 1.327.84 1.514.933.187.094.296.079.405-.047.11-.125.468-.545.593-.733.125-.187.25-.156.422-.093.172.062 1.092.515 1.28.608.187.094.312.141.359.219.046.078.046.452-.098.857zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.434 5.176L2 22l4.957-1.399C8.423 21.493 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
        <span className="text-xs font-bold tracking-wide">
          WhatsApp
        </span>
      </a>

      {/* Admin Panel Modal / Dashboard */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataUpdated={loadData}
        isLoggedIn={isAdminLoggedIn}
        setIsLoggedIn={setIsAdminLoggedIn}
      />
    </div>
  );
}
