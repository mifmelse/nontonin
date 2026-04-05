export function Footer() {
  return (
    <footer className="mt-16 border-t border-border-subtle px-5 py-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs text-text-muted">
          🍿 <span className="font-bold text-primary">nontonin</span> — Film
          domain publik gratis dari{" "}
          <a
            href="https://archive.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            Internet Archive
          </a>
        </p>
        <p className="mt-1 text-[10px] text-text-muted">
          Metadata diperkaya oleh TMDB. Semua film berstatus public domain.
        </p>
      </div>
    </footer>
  );
}
