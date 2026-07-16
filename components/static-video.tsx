import styles from "./controlled-video.module.css";

type StaticVideoProps = {
  src: string;
  poster: string;
  label: string;
};

export function StaticVideo({ src, poster, label }: StaticVideoProps) {
  return (
    <div className={styles.frame} data-video-playing="false" data-video-ready="poster">
      <video src={src} poster={poster} muted playsInline loop preload="none" controls aria-label={label}>
        Seu navegador não suporta vídeo HTML. O poster editorial permanece disponível.
      </video>
      <span className={styles.shade} aria-hidden="true" />
    </div>
  );
}
