export default function Footer({ socialLinks = {} }) {
  const instagram = socialLinks.instagram || "https://www.instagram.com/maribelgarciamuseoscuentos"
  const instaHandle = instagram.split('/').pop() || "maribelgarciamuseoscuentos"

  return (
    <footer className="bg-cafe-oscuro text-crema py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-display text-xl font-semibold text-arena">Maribel García</p>
          <p className="text-sm text-crema/60 mt-1">Guardiana de Historias</p>
        </div>

        <div className="flex flex-col items-center gap-1 text-sm text-crema/60">
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-dorado transition-colors"
          >
            @{instaHandle}
          </a>
          <span>Argentina</span>
        </div>

        <p className="text-xs text-crema/40 text-center">
          © {new Date().getFullYear()} Maribel García. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
