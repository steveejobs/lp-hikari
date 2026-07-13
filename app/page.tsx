import Image from "next/image";
import { ControlledVideo } from "@/components/controlled-video";
import { FocusGallery } from "@/components/focus-gallery";
import { OpticalHero } from "@/components/optical-hero";
import { RouteIcon, WhatsAppIcon } from "@/components/icons";
import { SeriesCarousel } from "@/components/series-carousel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { business, fullAddress, getWhatsAppUrl } from "@/lib/business";
import { seriesFour, seriesOne, seriesThree, seriesTwo } from "@/lib/galleries";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="hero-ambient" aria-hidden="true" />
          <span className="hero-symbol" aria-hidden="true">光</span>

          <div className="site-shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span aria-hidden="true">光</span> Ótica Hikari · Araguaína</p>
              <h1 id="hero-title" className="hero-title">
                <span>O florescer</span>{" "}
                <em>de um novo olhar.</em>
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
            <p className={styles.sectionCode}>LAB / 00</p>
            <div className={styles.introCopy}>
              <h2 id="light-title">Hikari é luz. <em>O resto é foco.</em></h2>
              <p>
                Óculos solares e receituários ganham diferentes pontos de vista. A luz conduz
                a sequência; cada ensaio preserva pessoa, gesto e atmosfera.
              </p>
            </div>
            <div className={styles.introLens} aria-hidden="true">
              <span>光</span>
              <i />
              <p>Luz · foco · profundidade</p>
            </div>
          </div>
        </section>

        <section className={styles.seriesOne} aria-labelledby="series-one-title">
          <div className={`site-shell ${styles.sectionHeader}`}>
            <div>
              <p className={styles.darkKicker}>Ensaio 01 · Sol</p>
              <h2 id="series-one-title">Entre o retrato <em>e o detalhe.</em></h2>
            </div>
            <p>
              Dez imagens, uma única sequência. Deslize para acompanhar o ensaio sem perder
              o fio entre expressão e produto.
            </p>
          </div>
          <SeriesCarousel items={seriesOne} label="Ensaio um da Ótica Hikari" />
        </section>

        <section className={styles.diptychSection} aria-labelledby="diptych-title">
          <div className={`site-shell ${styles.diptychGrid}`}>
            <div className={styles.diptychCopy}>
              <p className={styles.lightKicker}>Ensaio 02 · Gesto</p>
              <h2 id="diptych-title">Dois instantes. <em>O mesmo olhar.</em></h2>
              <p>
                Um díptico para perceber como forma e expressão mudam juntas, sem quebrar a
                continuidade do ensaio.
              </p>
              <span aria-hidden="true">02 / 02</span>
            </div>
            <div className={styles.diptychMedia}>
              {seriesTwo.map((item, index) => (
                <figure key={item.id} className={styles.diptychImage} data-series="02" data-series-item={item.id}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 720px) 50vw, (max-width: 1100px) 38vw, 420px"
                  />
                  <figcaption>0{index + 1}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.focusSection} aria-labelledby="focus-title">
          <div className={`site-shell ${styles.focusGrid}`}>
            <div className={styles.focusCopy}>
              <p className={styles.darkKicker}>Ensaio 03 · Foco variável</p>
              <h2 id="focus-title">Uma troca de lente <em>muda o campo.</em></h2>
              <p>
                Escolha um dos quatro registros. A pessoa e a luz permanecem; o desenho da
                armação muda o ponto de atenção.
              </p>
              <p className={styles.interactionHint}>Deslize ou use as setas</p>
            </div>
            <FocusGallery items={seriesThree} label="Ensaio três da Ótica Hikari" />
          </div>
        </section>

        <section id="loja" className={styles.motionSection} aria-labelledby="motion-title">
          <div className={`site-shell ${styles.motionGrid}`}>
            <div className={styles.motionCopy}>
              <p className={styles.lightKicker}>Em movimento</p>
              <h2 id="motion-title">A luz não fica <em>parada.</em></h2>
              <p>
                Um registro principal e um fragmento menor, apresentados na escala que cada
                arquivo suporta. O movimento amplia a leitura sem tomar o lugar da escolha.
              </p>
              <span>Som desativado · reprodução controlada</span>
            </div>
            <figure className={styles.primaryVideo}>
              <ControlledVideo
                src="/video/selection.mp4"
                poster="/video/selection-poster.jpg"
                label="Vídeo de uma mulher apresentando óculos solares"
              />
              <figcaption>Registro 01 / seleção em movimento</figcaption>
            </figure>
            <figure className={styles.fragmentVideo}>
              <ControlledVideo
                src="/video/fragment.mp4"
                poster="/video/fragment-poster.jpg"
                label="Fragmento em vídeo com diferentes armações"
                autoplay={false}
              />
              <figcaption>Fragmento / arquivo 02</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.seriesFour} aria-labelledby="series-four-title">
          <div className={`site-shell ${styles.seriesFourHeader}`}>
            <p className={styles.lightKicker}>Ensaio 04 · Presença</p>
            <h2 id="series-four-title">Seis enquadramentos, <em>uma narrativa.</em></h2>
            <p>
              Do primeiro gesto ao último, a sequência permanece inteira: mesma pessoa,
              mesma luz, novas formas diante do olhar.
            </p>
          </div>
          <div className={`site-shell ${styles.editorialGrid}`}>
            {seriesFour.map((item) => (
              <figure key={item.id} className={styles.editorialImage} data-series="04" data-series-item={item.id}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 600px) 47vw, (max-width: 1000px) 31vw, 410px"
                />
                <figcaption>{item.id}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="localizacao" className={styles.locationSection} aria-labelledby="location-title">
          <div className={`site-shell ${styles.locationGrid}`}>
            <div className={styles.locationCopy}>
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
            <div className={styles.routeDiagram} aria-hidden="true">
              <svg viewBox="0 0 620 430" fill="none">
                <path d="M-10 314C82 284 111 215 191 213c92-2 92 89 189 74 70-11 88-99 161-109 33-5 62 4 91 21" />
                <path d="M83-18c5 77 57 98 45 172-10 62-65 80-61 145 3 54 45 80 43 144" />
                <path d="M481-19c-24 87 31 119 9 200-20 71-81 97-85 166-2 34 10 62 24 91" />
              </svg>
              <span className={styles.routePoint}>光</span>
              <p>Rua 19 de Novembro <strong>nº 68</strong></p>
              <small>-7.1922897 · -48.2094709</small>
            </div>
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={`site-shell ${styles.faqGrid}`}>
            <div>
              <p className={styles.lightKicker}>Informação direta</p>
              <h2 id="faq-title">Antes de <em>visitar.</em></h2>
            </div>
            <div className={styles.faqList}>
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
          <div className={`site-shell ${styles.finalCtaInner}`}>
            <p aria-hidden="true">光</p>
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
