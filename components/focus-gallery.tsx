import Image from "next/image";
import type { GalleryItem } from "@/lib/galleries";
import styles from "./focus-gallery.module.css";

type FocusGalleryProps = {
  items: GalleryItem[];
  label: string;
};

export function FocusGallery({ items, label }: FocusGalleryProps) {
  return (
    <div className={styles.gallery} role="region" aria-label={label} data-series="03">
      <div className={styles.stage}>
        <div className={styles.focusTrack} tabIndex={0} aria-label={`${label}. Deslize ou escolha um retrato.`}>
          {items.map((item) => (
            <figure id={`focus-${item.id}`} key={item.id} className={styles.focusSlide}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 720px) 88vw, (max-width: 1100px) 52vw, 520px"
                className={styles.activeImage}
              />
            </figure>
          ))}
        </div>
      </div>

      <nav className={styles.choices} aria-label="Escolher enquadramento">
        {items.map((item, index) => (
          <a
            key={item.id}
            className={styles.choice}
            data-series-item={item.id}
            href={`#focus-${item.id}`}
            aria-label={`Mostrar ${item.alt}`}
            aria-current={index === 0 ? "true" : undefined}
          >
            <span className={styles.thumb}>
              <Image src={item.src} alt="" fill sizes="(max-width: 720px) 20vw, 110px" />
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}
