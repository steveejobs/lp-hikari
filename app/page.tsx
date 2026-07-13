import Image from "next/image";
import type { CSSProperties } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { ControlledVideo } from "@/components/controlled-video";
import { FocusGallery } from "@/components/focus-gallery";
import { OpticalHero } from "@/components/optical-hero";
import { ArrowIcon, RouteIcon, WhatsAppIcon } from "@/components/icons";
import { SeriesCarousel } from "@/components/series-carousel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { business, fullAddress, getWhatsAppUrl } from "@/lib/business";
import { seriesFour, seriesOne, seriesThree, seriesTwo } from "@/lib/galleries";
import styles from "./home.module.css";

const mapEmbedUrl =
  "https://www.google.com/maps?q=-7.1922897,-48.2094709&z=16&output=embed";

function AnimatedTitleLine({
  text,
  className,
  delayOffset,
}: {
  text: string;
  className: string;
  delayOffset: number;
}) {
  const words = text.split(" ");

  return (
    <span className={className} aria-hidden="true">
      {words.map((word, wordIndex) => {
        const wordOffset =
          delayOffset +
          words
            .slice(0, wordIndex)
            .reduce((offset, previousWord) => offset + previousWord.length + 1, 0);

        return (
          <span className="hero-word" key={`${word}-${wordIndex}`}>
            {Array.from(word).map((character, index) => (
              <span
                className="hero-char"
                key={`${character}-${index}`}
                style={{ "--char-index": index + wordOffset } as CSSProperties}
              >
                {character}
              </span>
            ))}
            {wordIndex < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="hero-ambient" aria-hidden="true" />
          <BrandIcon
            className="hero-symbol"
            priority
            sizes="(max-width: 720px) 48vw, min(24vw, 336px)"
          />

          <div className="site-shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <BrandIcon className="hero-focus-mark" sizes="29px" />
                Ótica Hikari · Araguaína
              </p>
              <h1 id="hero-title" className="hero-title" aria-label="O florescer de um novo olhar.">
                <AnimatedTitleLine
                  text="O florescer"
                  className="hero-title-line hero-title-primary"
                  delayOffset={0}
                />
                <AnimatedTitleLine
                  text="de um novo olhar."
                  className="hero-title-line hero-title-gold"
                  delayOffset={3}
                />
              </h1>
              <p className="hero-description">
                Óculos solares e receituários no Centro de Araguaína. Um atendimento começa
                com conversa — e com o seu jeito de ver.
              </p>

              <div className="hero-actions" aria-label="Ações principais">
                <a
                  className="button button-primary"
                  href={getWhatsAppUrl("site")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon />
                  Pedir atendimento
                </a>
                <a
                  className="button button-secondary"
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <RouteIcon />
                  Traçar rota
                </a>
              </div>

              <dl className="hero-facts">
                <div>
                  <dt>Onde</dt>
                  <dd>{fullAddress}</dd>
                </div>
                <div>
                  <dt>Ao chegar</dt>
                  <dd>{business.parking}</dd>
                </div>
              </dl>
            </div>

            <OpticalHero image="/gallery/series-01/05.jpg" />
          </div>

          <a className="hero-scroll" href="#ensaios" aria-label="Ir para os ensaios">
            <span>Explorar a luz</span>
            <i aria-hidden="true" />
          </a>
        </section>

        <section id="ensaios" className={styles.lightIntro} aria-labelledby="light-title">
          <div className={`site-shell ${styles.lightIntroGrid}`}>
            <div className={styles.introCopy} data-reveal="focus-reveal">
              <h2 id="light-title">Hikari é luz. <em>O resto é foco.</em></h2>
              <p>
                Óculos solares e receituários ganham diferentes pontos de vista. A luz conduz
                a sequência; cada ensaio preserva pessoa, gesto e atmosfera.
              </p>
            </div>
            <div className={styles.introLens} data-reveal="optical-mask" aria-hidden="true">
              <BrandIcon className={styles.introMark} sizes="112px" />
              <i />
            </div>
          </div>
        </section>

        <section className={styles.seriesOne} aria-labelledby="series-one-title">
          <div className={`site-shell ${styles.sectionHeader}`} data-reveal="line-reveal">
            <div>
              <h2 id="series-one-title">Entre o retrato <em>e o detalhe.</em></h2>
            </div>
            <p>
              Uma sequência contínua entre expressão e produto. Deslize para acompanhar
              as mudanças de gesto, forma e luz.
            </p>
          </div>
          <SeriesCarousel items={seriesOne} label="Galeria de retratos e detalhes da Ótica Hikari" />
        </section>

        <section className={styles.diptychSection} aria-labelledby="diptych-title">
          <div className={`site-shell ${styles.diptychGrid}`}>
            <div className={styles.diptychCopy} data-reveal="line-reveal">
              <h2 id="diptych-title">Dois instantes. <em>O mesmo olhar.</em></h2>
              <p>
                Um díptico para perceber como forma e expressão mudam juntas, sem quebrar a
                continuidade do ensaio.
              </p>
            </div>
            <div className={styles.diptychMedia} data-reveal="diptych">
              {seriesTwo.map((item) => (
                <figure key={item.id} className={styles.diptychImage} data-series="02" data-series-item={item.id}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 720px) 50vw, (max-width: 1100px) 38vw, 420px"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.focusSection} aria-labelledby="focus-title">
          <div className={`site-shell ${styles.focusGrid}`}>
            <div className={styles.focusCopy} data-reveal="focus-reveal">
              <h2 id="focus-title">Uma troca de lente <em>muda o campo.</em></h2>
              <p>
                A pessoa e a luz permanecem; o desenho da armação muda o ponto de atenção.
              </p>
              <p className={styles.interactionHint}>Deslize ou use as setas</p>
            </div>
            <FocusGallery items={seriesThree} label="Galeria de diferentes armações da Ótica Hikari" />
          </div>
        </section>

        <section id="loja" className={styles.motionSection} aria-labelledby="motion-title">
          <div className={`site-shell ${styles.motionGrid}`}>
            <div className={styles.motionCopy} data-reveal="line-reveal">
              <h2 id="motion-title">A luz não fica <em>parada.</em></h2>
              <p>
                Entre o gesto e o detalhe, o movimento amplia a leitura sem tomar o lugar
                da escolha.
              </p>
            </div>
            <figure className={styles.primaryVideo} data-reveal="optical-mask">
              <ControlledVideo
                src="/video/selection.mp4"
                poster="/video/selection-poster.jpg"
                label="Vídeo de uma mulher apresentando óculos solares"
              />
            </figure>
            <figure className={styles.fragmentVideo} data-reveal="soft-settle">
              <ControlledVideo
                src="/video/fragment.mp4"
                poster="/video/fragment-poster.jpg"
                label="Fragmento em vídeo com diferentes armações"
                autoplay={false}
              />
            </figure>
          </div>
        </section>

        <section className={styles.seriesFour} aria-labelledby="series-four-title">
          <div className={`site-shell ${styles.seriesFourHeader}`} data-reveal="line-reveal">
            <h2 id="series-four-title">Presença em cada <em>enquadramento.</em></h2>
            <p>
              A sequência permanece inteira: mesma pessoa, mesma luz, novas formas diante
              do olhar.
            </p>
          </div>
          <div className={`site-shell ${styles.editorialGrid}`} data-reveal="editorial">
            {seriesFour.map((item) => (
              <figure key={item.id} className={styles.editorialImage} data-series="04" data-series-item={item.id}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 600px) 47vw, (max-width: 1000px) 31vw, 410px"
                />
              </figure>
            ))}
          </div>
        </section>

        <section id="localizacao" className={styles.locationSection} aria-labelledby="location-title">
          <div className={`site-shell ${styles.locationGrid}`}>
            <div className={styles.locationCopy} data-reveal="line-reveal">
              <p className={styles.darkKicker}>Araguaína · Tocantins</p>
              <h2 id="location-title">No Centro, <em>onde o olhar encontra a luz.</em></h2>
              <address>{fullAddress}</address>
              <p>{business.parking}.</p>
              <div className={styles.locationActions}>
                <a className="button button-primary" href={business.mapsUrl} target="_blank" rel="noreferrer">
                  <RouteIcon /> Traçar rota
                </a>
                <a className="button button-secondary" href={getWhatsAppUrl("site")} target="_blank" rel="noreferrer">
                  <WhatsAppIcon /> Falar com a Hikari
                </a>
              </div>
            </div>
            <div className={styles.mapBlock} data-reveal="map">
              <div className={styles.mapFrame}>
                <iframe
                  data-map-iframe
                  title="Mapa da Ótica Hikari em Araguaína"
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className={styles.mapCaption}>
                <span>{fullAddress}</span>
                <a href={business.mapsUrl} target="_blank" rel="noreferrer">
                  Abrir no Google Maps <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={`site-shell ${styles.faqGrid}`}>
            <div data-reveal="focus-reveal">
              <h2 id="faq-title">Antes de <em>visitar.</em></h2>
            </div>
            <div className={styles.faqList} data-reveal="soft-settle">
              <details>
                <summary>O que encontro na Ótica Hikari?</summary>
                <p>Óculos solares e receituários.</p>
              </details>
              <details>
                <summary>Onde fica a loja?</summary>
                <p>{fullAddress}.</p>
              </details>
              <details>
                <summary>Há estacionamento?</summary>
                <p>Sim. A Ótica Hikari informa estacionamento gratuito.</p>
              </details>
              <details>
                <summary>Como começo o atendimento?</summary>
                <p>Envie uma mensagem pelo WhatsApp e conte o que você procura.</p>
              </details>
            </div>
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="final-title">
          <div className={`site-shell ${styles.finalCtaInner}`} data-reveal="focus-reveal">
            <BrandIcon className={styles.finalMark} sizes="48px" />
            <h2 id="final-title">Seu novo olhar pode <em>começar agora.</em></h2>
            <a className="button button-primary" href={getWhatsAppUrl("site")} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Pedir atendimento no WhatsApp
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
