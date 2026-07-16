import styles from "./static-video.module.css";

type StaticVideoProps = {
  src: string;
  poster: string;
  label: string;
  className?: string;
};

export function StaticVideo({ src, poster, label, className }: StaticVideoProps) {
  return (
    <div className={`${styles.frame}${className ? ` ${className}` : ""}`} data-video-playing="false" data-video-ready="poster">
      <video
        data-video-src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        loop
        preload="none"
        disablePictureInPicture
        data-ambient-video
        aria-label={label}
      >
        Seu navegador não suporta vídeo HTML. O poster editorial permanece disponível.
      </video>
      <span className={styles.shade} aria-hidden="true" />
    </div>
  );
}
