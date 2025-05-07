"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerContent}>
          <div className={styles.mainSection}>
            <div className={styles.logoSection}>
              <h6 className={styles.logo}>iWork</h6>
            </div>

            <div className={styles.taglineSection}>
              <p className={styles.tagline}>
                Найдите свою идеальную работу и развивайте карьеру
              </p>
            </div>
          </div>

          <Separator className={styles.separator} />

          <div className={styles.bottomSection}>
            <div className={styles.copyright}>
              © {new Date().getFullYear()} iWork. Все права защищены.
            </div>

            <div className={styles.location}>Казахстан</div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
