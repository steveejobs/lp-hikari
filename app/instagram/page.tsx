import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, InstagramIcon, RouteIcon, WhatsAppIcon } from "@/components/icons";
import { InstagramFocus } from "@/components/instagram-focus";
import { business, fullAddress, getWhatsAppUrl } from "@/lib/business";
import { seriesFour } from "@/lib/galleries";
import styles from "./instagram.module.css";

export const metadata: Metadata = {
  title: "Ótica Hikari no Instagram",
  description: "Fale com a Ótica Hikari ou trace sua rota até a loja no Centro de Araguaína.",
  alternates: { canonical: "/instagram" },
  openGraph: {
    url: "/instagram",
    title: "Ótica Hikari — Seu novo olhar começa aqui",
    description: "Óculos solares e receituários no Centro de Araguaína.",
  },
};

export default function InstagramPage() {
  return (
    <main id="conteudo" className={styles.page}>
      <section className={styles.hero} aria-labelledby="instagram-title">
        <header className={styles.header}>
          <Link href="/" aria-label="Ótica Hikari — início">
            <Image
              src="/brand/logo-hikari.png"
              width={200}
              height={112}
              sizes="(max-width: 720px) 100px, 120px"
              alt="Ótica Hikari"
            />
          </Link>
          <span>Araguaína · TO</span>
        </header>

        <div className={styles.heroGrid}>
          <div className={styles.copy}>
            <p className={styles.handle}>{business.instagramHandle}</p>
            <h1 id="instagram-title">A luz encontra <em>seu novo olhar.</em></h1>
            <p className={styles.description}>Óculos solares e receituários no Centro de Araguaína.</p>
            <div className={styles.actions}>
              <a className={styles.whatsapp} href={getWhatsAppUrl("instagram")} target="_blank" rel="noreferrer">
                <WhatsAppIcon />
                Falar no WhatsApp
              </a>
              <a className={styles.route} href={business.mapsUrl} target="_blank" rel="noreferrer">
                <RouteIcon />
                Traçar rota
              </a>
            </div>
            <div className={styles.quickFacts}>
              <span>Rua 19 de Novembro, nº 68</span>
              <span>{business.parking}</span>
            </div>
          </div>

          <div className={styles.visual}>
            <p><span aria-hidden="true">光</span> deslize para mudar o foco</p>
            <InstagramFocus items={seriesFour.slice(0, 3)} />
          </div>
        </div>
      </section>

      <section className={styles.visit} aria-labelledby="visit-title">
        <div className={styles.visitInner}>
          <p className={styles.visitCode}>VISITA / 01</p>
          <div>
            <h2 id="visit-title">No Centro de <em>Araguaína.</em></h2>
            <address>{fullAddress}</address>
            <p>{business.parking}.</p>
          </div>
          <a href={business.mapsUrl} target="_blank" rel="noreferrer">
            Abrir rota <RouteIcon />
          </a>
        </div>
      </section>

      <section className={styles.continueSection} aria-labelledby="continue-title">
        <div className={styles.continueInner}>
          <span aria-hidden="true">光</span>
          <p>Quer ver os quatro ensaios?</p>
          <h2 id="continue-title">Continue a experiência no site completo.</h2>
          <Link href="/">
            Entrar no site <ArrowIcon />
          </Link>
          <a href={business.instagramUrl} target="_blank" rel="noreferrer">
            <InstagramIcon /> Abrir Instagram
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <Image
          src="/brand/logo-hikari.png"
          width={200}
          height={112}
          sizes="100px"
          alt="Ótica Hikari"
        />
        <p>O florescer de um novo olhar.</p>
        <a href={getWhatsAppUrl("instagram")} target="_blank" rel="noreferrer">
          <WhatsAppIcon /> WhatsApp
        </a>
      </footer>
    </main>
  );
}
