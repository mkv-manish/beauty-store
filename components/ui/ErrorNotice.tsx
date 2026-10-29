import type { ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";
import styles from "./ErrorNotice.module.css";

type Props = { children: ReactNode; title?: string; action?: ReactNode; className?: string };
export default function ErrorNotice({ children, title, action, className = "" }: Props) {
    return <div role="alert" className={`${styles.notice} ${className}`}>
        <FiAlertCircle className={styles.icon} size={18} aria-hidden="true" />
        <div className={styles.content}>
            {title && <p className={styles.title}>{title}</p>}
            <div className={styles.message}>{children}</div>
            {action && <div className={styles.action}>{action}</div>}
        </div>
    </div>;
}
