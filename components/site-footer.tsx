import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, RouteIcon, WhatsAppIcon } from "@/components/icons";
import { business, fullAddress, getWhatsAppUrl } from "@/lib/business";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`site-shell ${styles.inner}`}>
        <div className={styles.brand}>
          <Image
            src="/brand/logo-hikari.png"
            width={200}
            height={112}
            sizes="(max-width: 760px) 120px, 160px"
            alt="Ótica Hikari"
          />
          <p>O florescer de um novo olhar.</p>
        </div>
        <div className={styles.address}>
          <p>Óculos solares e receituários</p>
          <address>{fullAddress}</address>
          <span>{business.parking}</span>
        </div>
        <nav className={styles.links} aria-label="Links do rodapé">
          <a href={getWhatsAppUrl("site")} target="_blank" rel="noreferrer"><WhatsAppIcon /> WhatsApp</a>
          <a href={business.mapsUrl} target="_blank" rel="noreferrer"><RouteIcon /> Como chegar</a>
          <a href={business.instagramUrl} target="_blank" rel="noreferrer"><InstagramIcon /> Instagram</a>
          <Link href="/instagram">Experiência mobile</Link>
        </nav>
      </div>
      <div className={`site-shell ${styles.bottom}`}>
        <span>Ótica Hikari · Araguaína, Tocantins</span>
        <a href="#conteudo">Voltar ao início</a>
      </div>
    </footer>
  );
}
