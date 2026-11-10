"use client";

// 사이트 헤더: 스크롤 상태(관측 기반), 모바일 전체 화면 메뉴(모달: 초점 가두기, 바깥 inert).
// 내비 현재 표시는 html[data-chapter] 를 CSS 가 읽는다(aria-current 는 lib/motion setChapter 가 함께 고친다).

import { useCallback, useEffect, useRef, useState } from "react";
import { contact, cta, nav, serviceLinks } from "@/lib/facts";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";
import styles from "./SiteHeader.module.css";
import progress from "./ScrollProgress.module.css";

const SHEET_ID = "site-menu";

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  ).filter((el) => !el.closest("[inert]") && el.getClientRects().length > 0);
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const barItemsRef = useRef<HTMLDivElement>(null);

  // 8px 스크롤 이후 헤더 바탕을 켠다
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }, []);

  // 메뉴가 열리면: 헤더 밖 전부와 헤더 막대의 워드마크·CTA 를 inert, 스크롤 잠금, 첫 링크로 초점, Tab 순환, Esc 닫기
  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    if (!header) return;
    const outside = Array.from(document.body.children).filter(
      (n): n is HTMLElement => n instanceof HTMLElement && n !== header && !n.contains(header),
    );
    const barItems = Array.from(barItemsRef.current?.children ?? []) as HTMLElement[];
    const inerted = [...outside, ...barItems];
    inerted.forEach((n) => n.setAttribute("inert", ""));
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables(header);
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !header.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !header.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && close(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      inerted.forEach((n) => n.removeAttribute("inert"));
      root.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open, close]);

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      <header
        ref={headerRef}
        className={styles.header}
        data-scrolled={scrolled || open}
        data-open={open}
        data-surface-follow=""
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? cta.menu : undefined}
      >
        <div className={`container ${styles.bar}`}>
          <div ref={barItemsRef} className={styles.barLead}>
            <Wordmark className={styles.wordmark} />
          </div>

          <nav aria-label="주 메뉴" className={styles.nav}>
            <ul className={styles.navList}>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.navLink} data-nav={item.id}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            {serviceLinks.map((l) => (
              <a key={l.id} href={l.href} target="_blank" rel="noopener noreferrer" className={styles.portal}>
                {l.name}
                <Icon name="external" size={18} />
                <span className="sr-only">{cta.newWindow}</span>
              </a>
            ))}
            <ThemeToggle className={styles.desktopOnly} />
            <div className={styles.ctaWrap} inert={open ? true : undefined}>
              <a href="#contact" className={`btn-primary ${styles.cta}`}>
                {cta.primary}
              </a>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              aria-expanded={open}
              aria-controls={SHEET_ID}
              aria-label={open ? cta.menuClose : cta.menuOpen}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>

        {/* 진행 측점: 헤더 아래 1px 선 위를 페이지 진행도만큼 이동(CSS scroll 타임라인) */}
        <div className={`${progress.track} ${styles.progress}`} aria-hidden="true">
          <div className={progress.mover}>
            <span className={progress.dot} />
          </div>
        </div>

        <div id={SHEET_ID} ref={sheetRef} className={styles.sheet} data-open={open}>
          <div className={`container ${styles.sheetInner}`}>
            <ul className={styles.sheetMeta}>
              {serviceLinks.map((l) => (
                <li key={l.id}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={styles.sheetMetaLink}>
                    <Icon name="external" />
                    {l.name}
                    <span className="sr-only">{cta.newWindow}</span>
                  </a>
                </li>
              ))}
            </ul>
            <ul className={styles.sheetNav}>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.sheetLink} data-nav={item.id} onClick={() => close(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#contact" className={`btn-primary ${styles.sheetCta}`} onClick={() => close(false)}>
              {cta.primary}
            </a>
            <ul className={styles.sheetMeta}>
              <li>
                <a href={contact.phoneHref} className={`${styles.sheetMetaLink} tnum`}>
                  <Icon name="phone" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={contact.mailto} className={styles.sheetMetaLink}>
                  <Icon name="mail" />
                  {contact.email}
                </a>
              </li>
              <li>
                <ThemeToggle withText className={styles.sheetToggle} />
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
