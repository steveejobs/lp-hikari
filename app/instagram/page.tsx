import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { StaticVideo } from "@/components/static-video";
import { ArrowIcon, InstagramIcon, RouteIcon, WhatsAppIcon } from "@/components/icons";
import { InstagramFocus } from "@/components/instagram-focus";
import {
  business,
  fullAddress,
  getWhatsAppUrl,
  instagramProductMessages,
} from "@/lib/business";
import { seriesFour, seriesOne, seriesThree } from "@/lib/galleries";
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

const quickLinks = [
  {
    title: "Falar no WhatsApp",
    description: "Atendimento direto para escolher seus óculos.",
    href: getWhatsAppUrl("instagram"),
    icon: WhatsAppIcon,
    featured: true,
  },
  {
    title: "Traçar rota",
    description: "Rua 19 de Novembro, nº 68.",
    href: business.mapsUrl,
    icon: RouteIcon,
    featured: false,
  },
  {
    title: "Quero óculos de grau",
    description: "Armações para rotina, trabalho e presença.",
    href: getWhatsAppUrl("instagram", instagramProductMessages.prescription),
    icon: WhatsAppIcon,
    featured: false,
  },
  {
    title: "Quero óculos solar",
    description: "Proteção, estilo e lentes com personalidade.",
    href: getWhatsAppUrl("instagram", instagramProductMessages.solar),
    icon: WhatsAppIcon,
    featured: false,
  },
  {
    title: "Ver no Instagram",
    description: "Campanhas, novidades e bastidores.",
    href: business.instagramUrl,
    icon: InstagramIcon,
    featured: false,
  },
] as const;

const productCards = [
  {
    title: "Óculos de grau",
    description: "Escolha armações com orientação para o seu rosto e rotina.",
    href: getWhatsAppUrl("instagram", instagramProductMessages.prescription),
    image: seriesOne[9],
    internal: false,
  },
  {
    title: "Óculos solares",
    description: "Modelos para presença, proteção e dias de luz intensa.",
    href: getWhatsAppUrl("instagram", instagramProductMessages.solar),
    image: seriesFour[3],
    internal: false,
  },
  {
    title: "Coleções",
    description: "Veja formatos, lentes e acabamentos antes de visitar.",
    href: business.instagramUrl,
    image: seriesThree[0],
    internal: false,
  },
  {
    title: "Site completo",
    description: "Conheça a experiência completa da Ótica Hikari.",
    href: "/",
    image: seriesOne[2],
    internal: true,
  },
] as const;

const heroPreview = [seriesFour[0], seriesOne[1], seriesThree[2]];
const campaignImages = [seriesOne[8], seriesOne[3], seriesFour[4], seriesThree[3]];

export default function InstagramPage() {
  return (
    <main id="conteudo" className={styles.page}>
      <section className={styles.profileHero} aria-labelledby="instagram-title" data-reveal="focus-reveal">
        <div className={styles.mobileShell}>
          <Link className={styles.logoCard} href="/" aria-label="Ótica Hikari — início">
            <Image
              src="/brand/logo-hikari.png"
              width={200}
              height={112}
              sizes="104px"
              alt="Ótica Hikari"
              priority
            />
          </Link>

          <p className={styles.handle}>{business.instagramHandle}</p>
          <h1 id="instagram-title">
            Ótica <em>Hikari</em>
          </h1>
          <p className={styles.description}>
            Óculos solares e de grau no Centro de Araguaína, com estética Hikari e
            atendimento direto pelo WhatsApp.
          </p>

          <div className={styles.badges} aria-label="Informações rápidas" data-motion-stagger>
            <span>Centro de Araguaína</span>
            <span>{business.parking}</span>
          </div>

          <div className={styles.previewCard} aria-label="Seleção visual da Ótica Hikari" data-pointer-glow>
            <div className={styles.previewGrid}>
              {heroPreview.map((item, index) => (
                <figure className={styles.previewFrame} key={item.id}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    preload={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    sizes="(max-width: 540px) 44vw, 170px"
                  />
                </figure>
              ))}
            </div>
            <div className={styles.previewCaption}>
              <BrandIcon className={styles.previewMark} sizes="24px" />
              <span>O florescer de um novo olhar</span>
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.quickLinks} aria-label="Links rápidos da Ótica Hikari" data-reveal="soft-settle" data-motion-stagger>
        {quickLinks.map((item) => {
          const content = (
            <>
              <span className={styles.linkIcon} aria-hidden="true">
                <item.icon />
              </span>
              <span className={styles.linkText}>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <ArrowIcon className={styles.linkArrow} />
            </>
          );

          return (
            <a
              className={styles.linkCard}
              data-featured={item.featured ? "true" : undefined}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              key={item.title}
              data-pointer-glow
            >
              {content}
            </a>
          );
        })}

        <Link className={styles.linkCard} href="/" data-pointer-glow>
          <span className={styles.linkIcon} aria-hidden="true">
            <ArrowIcon />
          </span>
          <span className={styles.linkText}>
            <strong>Site completo</strong>
            <small>Veja a experiência completa da Ótica Hikari.</small>
          </span>
          <ArrowIcon className={styles.linkArrow} />
        </Link>
      </nav>

      <section className={styles.spotlight} aria-labelledby="spotlight-title" data-reveal="line-reveal">
        <div className={styles.sectionHeader}>
          <div>
            <p>Campanha em destaque</p>
            <h2 id="spotlight-title">Editorial Hikari para escolher pelo olhar.</h2>
          </div>
          <a href={business.instagramUrl} target="_blank" rel="noreferrer">
            ver seção
          </a>
        </div>

        <div className={styles.campaignGrid} data-motion-stagger>
          {campaignImages.map((item, index) => (
            <figure className={styles.campaignFrame} key={`${item.id}-${index}`}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={index === 0 ? "(max-width: 540px) 92vw, 430px" : "(max-width: 540px) 45vw, 210px"}
              />
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.products} aria-labelledby="products-title" data-reveal="soft-settle">
        <div className={styles.sectionHeader}>
          <div>
            <p>Mini vitrine</p>
            <h2 id="products-title">Escolha o caminho mais rápido.</h2>
          </div>
          <a href={getWhatsAppUrl("instagram")} target="_blank" rel="noreferrer">
            pedir ajuda
          </a>
        </div>

        <div className={styles.productGrid} data-motion-stagger>
          {productCards.map((item) => {
            const card = (
              <>
                <span className={styles.productMedia}>
                  <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 540px) 45vw, 210px" />
                </span>
                <span className={styles.productCopy}>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
              </>
            );

            return item.internal ? (
              <Link className={styles.productCard} href={item.href} key={item.title} data-pointer-glow>
                {card}
              </Link>
            ) : (
              <a className={styles.productCard} href={item.href} target="_blank" rel="noreferrer" key={item.title} data-pointer-glow>
                {card}
              </a>
            );
          })}
        </div>
      </section>

      <section className={styles.focusSection} aria-labelledby="focus-title" data-reveal="horizontal-flow">
        <div className={styles.darkShell}>
          <div className={styles.darkHeader}>
            <Image src="/brand/logo-hikari.png" width={56} height={31} sizes="28px" alt="" className={styles.darkMark} />
            <div>
              <p>Em movimento</p>
              <h2 id="focus-title">Deslize pelas armações em foco.</h2>
            </div>
          </div>
          <InstagramFocus items={seriesFour} />
        </div>
      </section>

      <section className={styles.motion} aria-labelledby="motion-title" data-reveal="soft-settle">
        <div className={styles.darkShell}>
          <div className={styles.darkHeader}>
            <Image src="/brand/logo-hikari.png" width={56} height={31} sizes="28px" alt="" className={styles.darkMark} />
            <div>
              <p>Forma, gesto e luz</p>
              <h2 id="motion-title">Veja a presença dos óculos no rosto.</h2>
            </div>
          </div>

          <div className={styles.videoCard} data-instagram-video>
            <StaticVideo
              className={styles.editorialVideo}
              src="/video/selection.mp4"
              poster="/video/selection-poster.jpg"
              label="Filme editorial da Ótica Hikari com modelo usando óculos"
            />
          </div>
        </div>
      </section>

      <section className={styles.visit} aria-labelledby="visit-title" data-reveal="line-reveal">
        <div className={styles.sectionHeader}>
          <div>
            <p>Localização</p>
            <h2 id="visit-title">No Centro de Araguaína.</h2>
          </div>
        </div>

        <div className={styles.infoList} data-motion-stagger>
          <a className={styles.infoCard} href={business.mapsUrl} target="_blank" rel="noreferrer" data-pointer-glow>
            <RouteIcon />
            <span>
              <strong>Como chegar</strong>
              <small>{fullAddress}</small>
            </span>
          </a>
          <div className={styles.infoCard} data-pointer-glow>
            <Image src="/brand/logo-hikari.png" width={44} height={25} sizes="22px" alt="" className={styles.infoMark} />
            <span>
              <strong>{business.parking}</strong>
              <small>Mais praticidade para visitar a loja.</small>
            </span>
          </div>
          <a className={styles.infoCard} href={getWhatsAppUrl("instagram")} target="_blank" rel="noreferrer" data-pointer-glow>
            <WhatsAppIcon />
            <span>
              <strong>{business.phoneDisplay}</strong>
              <small>Chame antes de ir e receba orientação.</small>
            </span>
          </a>
        </div>
      </section>

      <section className={styles.continueSection} aria-labelledby="continue-title" data-reveal="focus-reveal" data-pointer-glow>
        <BrandIcon className={styles.continueMark} sizes="42px" />
        <p>Quer percorrer toda a história?</p>
        <h2 id="continue-title">Continue a experiência no site completo.</h2>
        <div className={styles.continueActions}>
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
          sizes="96px"
          alt="Ótica Hikari"
        />
        <p>O florescer de um novo olhar.</p>
      </footer>
    </main>
  );
}
