import Image from "next/image";
import type { GalleryItem } from "@/lib/galleries";
import { ArrowIcon } from "@/components/icons";
import styles from "./series-carousel.module.css";

type SeriesCarouselProps = {
  items: GalleryItem[];
  label: string;
};

export function SeriesCarousel({ items, label }: SeriesCarouselProps) {
  return (
    <div className={styles.carousel} role="region" aria-roledescription="carrossel" aria-label={label} data-series="01">
      <div id="series-one-track" className={styles.track} tabIndex={0} aria-label={`${label}. Deslize horizontalmente ou use os atalhos para navegar.`}>
        {items.map((item, index) => (
          <article
            id={`series-one-${item.id}`}
            key={item.id}
            className={styles.slide}
            data-series-item={item.id}
            aria-label={`${index + 1} de ${items.length}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              draggable={false}
              sizes="(max-width: 600px) 78vw, (max-width: 1000px) 52vw, 420px"
              className={styles.image}
            />
          </article>
        ))}
      </div>

      <div className={styles.controls}>
        <p className="sr-only">Galeria com {items.length} imagens.</p>
        <span className={styles.progress} aria-hidden="true"><i /></span>
        <nav className={styles.dots} aria-label="Escolher imagem">
          {items.map((item, index) => (
            <a key={item.id} className={styles.dot} href={`#series-one-${item.id}`} aria-label={`Ir para a imagem ${index + 1}`} />
          ))}
        </nav>
        <div className={styles.arrows}>
          <a href={`#series-one-${items[0].id}`} aria-label="Ir para a primeira imagem"><ArrowIcon /></a>
          <a href={`#series-one-${items.at(-1)?.id ?? items[0].id}`} aria-label="Ir para a última imagem"><ArrowIcon /></a>
        </div>
      </div>
    </div>
  );
}
