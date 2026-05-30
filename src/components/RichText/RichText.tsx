import { PortableText as PortableTextReact } from "@portabletext/react";
import styles from "./RichText.module.css";

const components = {
  block: {
    normal: ({ children }: any) => <p className={styles.p}>{children}</p>,
    h2: ({ children }: any) => <h2 className={styles.h2}>{children}</h2>,
    h3: ({ children }: any) => <h3 className={styles.h3}>{children}</h3>,
    blockquote: ({ children }: any) => <blockquote className={styles.blockquote}>{children}</blockquote>,
  },
  marks: {
    em: ({ children }: any) => <em className={styles.em}>{children}</em>,
    strong: ({ children }: any) => <strong className={styles.strong}>{children}</strong>,
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <a href={value.href} rel={rel} className={styles.link}>
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => <ul className={styles.ul}>{children}</ul>,
    number: ({ children }: any) => <ol className={styles.ol}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className={styles.li}>{children}</li>,
  },
};

export function RichText({ value }: { value: any }) {
  if (!value) return null;
  return (
    <div className={styles.richText}>
      <PortableTextReact value={value} components={components} />
    </div>
  );
}
