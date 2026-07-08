export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-brand-softv2 py-3 px-6 flex flex-wrap items-center justify-between gap-3 text-info-regular text-text-secondary">
      <div className="flex items-center gap-2">
        <img
          src="/images/escudo_footer.png"
          alt="Gobierno de Colombia"
          className="h-6"
        />
        <span className="font-bold" style={{ color: "var(--color-brand-fort)" }}>
          Gobierno de Colombia
        </span>
      </div>
      <div className="flex items-center gap-3 flex-wrap divide-x divide-brand-softv2">
        <a href="#" className="hover:underline hover:text-primary">
          Entidad Institucional
        </a>
        <a href="#" className="pl-3 hover:underline hover:text-primary">
          Políticas de privacidad
        </a>
        <a href="#" className="pl-3 hover:underline hover:text-primary">
          Términos y condiciones
        </a>
      </div>
    </footer>
  );
}