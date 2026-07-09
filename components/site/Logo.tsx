import Link from "next/link";

export function LogoMark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8.5" fill="#0e1330" />
      <circle cx="23" cy="9" r="6.5" fill="#f2b544" opacity=".22" />
      <circle cx="23" cy="9" r="3.1" fill="#f2b544" />
      <rect x="7" y="17" width="3.6" height="8" rx="1.3" fill="#7d8cf0" />
      <rect x="12.6" y="13" width="3.6" height="12" rx="1.3" fill="#b3bcf7" />
      <rect x="18.2" y="16" width="3.6" height="9" rx="1.3" fill="#fff" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Lumenboard home">
      <LogoMark />
      <span>
        Lumen<b>board</b>
      </span>
    </Link>
  );
}
