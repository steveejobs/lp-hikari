import Image from "next/image";

type OpticalHeroProps = {
  image: string;
};

export function OpticalHero({ image }: OpticalHeroProps) {
  return (
    <figure className="optical-figure">
      <div className="optical-stage" data-light-trail-hero>
        <svg
          className="hero-light-trails"
          viewBox="0 0 100 130"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="hero-light-path hero-light-path-primary" d="M3 92 C1 57 2 17 28 5 C50 -5 86 2 97 28" />
          <path className="hero-light-path hero-light-path-secondary" d="M98 38 C101 72 97 111 72 125 C50 137 17 127 5 103" />
          <path className="hero-light-path hero-light-path-accent" d="M10 118 C31 130 61 130 82 114" />
        </svg>

        <div className="optical-frame">
          <Image
            src={image}
            alt="Mulher usando óculos solares na Ótica Hikari"
            fill
            preload
            fetchPriority="high"
            sizes="(max-width: 767px) 82vw, (max-width: 1100px) 46vw, 520px"
            className="hero-portrait"
          />
          <span className="hero-image-shade" aria-hidden="true" />
        </div>

        <span className="hero-light-signal hero-light-signal-one" aria-hidden="true" />
        <span className="hero-light-signal hero-light-signal-two" aria-hidden="true" />
        <span className="hero-light-index" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <figcaption>A luz desenha o caminho. Seu olhar continua no centro.</figcaption>
    </figure>
  );
}
