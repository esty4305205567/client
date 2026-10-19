export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-1 px-4 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:gap-3">
        <span>© {year} כל הזכויות שמורות</span>
        <span className="hidden sm:inline" aria-hidden="true">
          ·
        </span>
        <span>ESTY</span>
        <span className="hidden sm:inline" aria-hidden="true">
          ·
        </span>
        <a
          href="mailto:esty43052@gmail.com"
          dir="ltr"
          className="transition-colors hover:text-primary"
        >
          esty43052@gmail.com
        </a>
      </div>
    </footer>
  );
}
