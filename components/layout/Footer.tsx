import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const links = [
    { label: "Shop all", href: "/shop" },
    { label: "Skin care", href: "/shop?category=skin" },
    { label: "Hair care", href: "/shop?category=hair" },
    { label: "My orders", href: "/orders" },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <Link href="/" aria-label="Dermiscaa home" className={styles.logo}>
                            <Image src="/images/logo/logo.png" alt="" width={48} height={48} className={styles.mark} />
                            <span>Dermiscaa</span>
                        </Link>
                        <p>Everyday care for skin &amp; hair.</p>
                    </div>
                    <nav aria-label="Footer" className={styles.links}>
                        {links.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
                    </nav>
                </div>
                <p className={styles.copyright}>© {new Date().getFullYear()} Dermiscaa. All rights reserved.</p>
            </div>
        </footer>
    );
}
