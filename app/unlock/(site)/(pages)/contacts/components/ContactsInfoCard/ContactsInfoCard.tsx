import { phoneToTelHref } from "../../helpers/phoneToTelHref";
import styles from "./ContactsInfoCard.module.scss";

interface ContactsInfoCardProps {
  phones: string[];
  emails: string[];
  hoursLine: string;
}

export default function ContactsInfoCard({ phones, emails, hoursLine }: ContactsInfoCardProps) {
  return (
    <div className={styles.contactsCard}>
      <h2 className={styles.contactsTitle}>Контакты</h2>

      <div className={styles.contactItem}>
        <span className={styles.contactLabel}>Телефон</span>
        {phones.map((p) => (
          <a key={p} href={phoneToTelHref(p)} className={styles.contactValue}>
            {p}
          </a>
        ))}
      </div>

      <div className={styles.contactItem}>
        <span className={styles.contactLabel}>График работы</span>
        <span className={styles.contactValue}>{hoursLine}</span>
      </div>

      <div className={styles.contactItem}>
        <span className={styles.contactLabel}>Email</span>
        {emails.map((em) => (
          <a key={em} href={`mailto:${em}`} className={styles.contactValue}>
            {em}
          </a>
        ))}
      </div>
    </div>
  );
}
