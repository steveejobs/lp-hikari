import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/business";
import { WhatsAppIcon } from "@/components/icons";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link href="/" className="brand-link" aria-label="Ótica Hikari — início">
          <Image
            src="/brand/logo-hikari.png"
            alt="Ótica Hikari"
            width={200}
            height={112}
            preload
            fetchPriority="high"
            sizes="(max-width: 767px) 102px, 124px"
            className="header-logo"
          />
        </Link>

        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#escolha">Escolha guiada</a>
          <a href="#ensaios">Coleções</a>
          <a href="#loja">A loja</a>
          <a href="#localizacao">Como chegar</a>
        </nav>

        <a
          className="header-contact"
          href={getWhatsAppUrl("site")}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com a Ótica Hikari pelo WhatsApp"
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
