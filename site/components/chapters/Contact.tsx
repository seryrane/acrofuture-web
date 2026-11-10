import { contact, contactSection, cta, serviceLinks } from "@/lib/facts";
import { Icon } from "../Icon";
import s from "./Contact.module.css";

// 5 문의 #contact(4판): 일반 흐름, 심야 면. 폼 없이 메일·전화 링크, 연락처 묶음은 카드 한 장.
export function Contact() {
  return (
    <section
      id="contact"
      className={`section st-tex night ${s.contact}`}
      data-surface-of="night"
      data-chapter-of="contact"
      aria-labelledby="contact-title"
    >
      <div className="container cols">
        <div className={s.main}>
          <h2 id="contact-title" className="h2">
            {contactSection.title}
          </h2>
          <p className={s.body}>{contactSection.body}</p>
          <a href={contact.mailto} className={s.mail}>
            <Icon name="mail" className={s.mailIcon} />
            <span>{contact.email}</span>
          </a>
        </div>

        <div className={s.arrival}>
          <svg className={s.arrivalSvg} viewBox="0 0 280 280" data-plate="" aria-hidden="true" focusable="false">
            <g stroke="var(--ink-3)" strokeWidth="1">
              <line x1="80" y1="170" x2="200" y2="170" />
              <line x1="140" y1="110" x2="140" y2="230" />
            </g>
            <path d="M40 0 V80 H140 V170" fill="none" stroke="var(--fix)" strokeWidth="2" />
            <g className={s.arrivalRing}>
              <circle cx="140" cy="170" r="32" fill="var(--paper)" stroke="var(--fix)" strokeWidth="1.5" />
            </g>
            <circle cx="140" cy="170" r="6" fill="var(--fix-core)" />
          </svg>
        </div>

        <dl className={`card ${s.info}`}>
          <div className={s.infoCell}>
            <dt className="meta">{contactSection.phoneLabel}</dt>
            <dd className="lead tnum">
              <a href={contact.phoneHref} className={`text-link ${s.tap}`}>
                {contact.phone}
              </a>
            </dd>
          </div>
          <div className={s.infoCell}>
            <dt className="meta">{contactSection.faxLabel}</dt>
            <dd className="lead tnum">{contact.fax}</dd>
          </div>
          <div className={s.infoCell}>
            <dt className="meta">{contactSection.addressLabel}</dt>
            <dd className="lead tnum">
              <address>{contact.address}</address>
            </dd>
          </div>
        </dl>

        <ul className={s.portal}>
          {serviceLinks.map((l) => (
            <li key={l.id}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-link">
                {l.name} {l.host}
                <span className="sr-only">{cta.newWindow}</span>
                <Icon name="external" className={s.portalIcon} size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
