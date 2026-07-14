import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { ControlledVideo } from "@/components/controlled-video";
import { ArrowIcon, InstagramIcon, RouteIcon, WhatsAppIcon } from "@/components/icons";
import { InstagramFocus } from "@/components/instagram-focus";
import {
  business,
  fullAddress,
  getWhatsAppUrl,
  instagramProductMessages,
} from "@/lib/business";
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
            <p>
              <BrandIcon className={styles.hintMark} sizes="18px" />
              em movimento — deslize para explorar
            </p>
            <InstagramFocus items={seriesFour} />
          </div>
        </div>
      </section>

      <section className={styles.products} aria-labelledby="products-title">
        <div className={styles.productsInner} data-reveal="editorial">
          <header className={styles.productsHeading}>
            <div>
              <p>Para o seu jeito de olhar</p>
              <h2 id="products-title">Solar e receituário, com a mesma presença.</h2>
            </div>
          </header>

          <div className={styles.productChoices}>
            <article className={styles.productChoice}>
              <div>
                <h3>Óculos receituários</h3>
                <p>Armações para acompanhar sua rotina e seu jeito de ver.</p>
              </div>
              <a
                href={getWhatsAppUrl("instagram", instagramProductMessages.prescription)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon />
                Quero óculos de grau
              </a>
            </article>

            <article className={styles.productChoice}>
              <div>
                <h3>Óculos solares</h3>
                <p>Proteção, expressão e novas formas de olhar.</p>
              </div>
              <a
                href={getWhatsAppUrl("instagram", instagramProductMessages.solar)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon />
                Quero óculos solar
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.motion} aria-labelledby="motion-title">
        <div className={styles.motionInner} data-reveal="optical-mask">
          <div className={styles.motionCopy}>
            <h2 id="motion-title">Forma, gesto e luz <em>em movimento.</em></h2>
            <p>Os óculos acompanham a expressão — de perto, com tempo e leveza.</p>
          </div>
          <div className={styles.editorialFrame} data-instagram-video>
            <ControlledVideo
              className={styles.editorialVideo}
              src="/video/selection.mp4"
              poster="/video/selection-poster.jpg"
              label="Filme editorial da Ótica Hikari com modelo usando óculos"
              preload="metadata"
            />
          </div>
        </div>
      </section>

      <section className={styles.visit} aria-labelledby="visit-title">
        <div className={styles.visitInner} data-reveal="line-reveal">
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
        <div className={styles.continueInner} data-reveal="focus-reveal">
          <BrandIcon className={styles.continueMark} sizes="48px" />
          <p>Quer percorrer toda a história?</p>
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
