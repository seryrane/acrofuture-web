import { company, contact, serviceLinks } from "@/lib/facts";
import { WordmarkText } from "./Wordmark";
import styles from "./SiteFooter.module.css";

// 8. 푸터: 도면 표제란. 칸 격자 안에 라벨/값, 맨 아래 넓은 칸에 태그라인으로 서명한다.
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <dl className={styles.block}>
          <div className={`${styles.cell} ${styles.c3}`}>
            <dt>상호</dt>
            <dd className={styles.nameCell}>
              <span>{company.name}</span>
              <WordmarkText className={styles.wordmark} />
            </dd>
          </div>
          <div className={`${styles.cell} ${styles.c3}`}>
            <dt>대표</dt>
            <dd>{company.ceo}</dd>
          </div>
          <div className={`${styles.cell} ${styles.c3}`}>
            <dt>사업자등록번호</dt>
            <dd className="tnum">{company.bizNo}</dd>
          </div>
          <div className={`${styles.cell} ${styles.c3}`}>
            <dt>설립</dt>
            <dd className="tnum">{company.founded}</dd>
          </div>
          <div className={`${styles.cell} ${styles.c6}`}>
            <dt>주소</dt>
            <dd className="tnum">{contact.address}</dd>
          </div>
          <div className={`${styles.cell} ${styles.c3}`}>
            <dt>전화</dt>
            <dd className="tnum">
              <a href={contact.phoneHref} className={styles.link}>
                {contact.phone}
              </a>
            </dd>
          </div>
          <div className={`${styles.cell} ${styles.c3}`}>
            <dt>팩스</dt>
            <dd className="tnum">{contact.fax}</dd>
          </div>
          <div className={`${styles.cell} ${styles.c3}`}>
            <dt>메일</dt>
            <dd>
              <a href={contact.mailto} className={styles.link}>
                {contact.email}
              </a>
            </dd>
          </div>
          {serviceLinks.map((l) => (
            <div key={l.id} className={`${styles.cell} ${styles.c3}`}>
              <dt>{l.name}</dt>
              <dd>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {l.host}
                  <span className="sr-only">(새 창)</span>
                </a>
              </dd>
            </div>
          ))}
          <div className={`${styles.cell} ${styles.c12} ${styles.sign}`}>
            <dt className="sr-only">표어</dt>
            <dd className={styles.tagline} lang="en">
              {company.tagline}
            </dd>
            <dd className={styles.copy}>{company.copyright}</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
