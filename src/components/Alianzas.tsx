import { useEffect, useState } from "react";

const apiUrl = "https://cms.valenciapro.cl";

type Alianza = {
  nombre?: string;
  descripcion?: string;
  beneficio?: string;
  beneficio_texto?: string;
  logo?: string;
  imagen?: string;
  telefono?: string;
  whatsapp?: string;
  instagram?: string;
  link?: string;
};

export default function AlianzasClient() {
  const [alianzas, setAlianzas] = useState<Alianza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const fetchUrl = `${apiUrl}/wp-json/valencia/v1/alianzas`;
        const res = await fetch(fetchUrl, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setAlianzas(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  if (loading) return <div className="no-alianzas"><p>Cargando alianzas…</p></div>;
  if (error) return <div className="no-alianzas"><p>Error cargando alianzas: {error}</p></div>;

  return alianzas.length > 0 ? (
    <div className="alianzas-grid">
      {alianzas.map((alianza, idx) => {
        const hasImage = !!alianza.imagen;
        const hasContact = !!(alianza.telefono || alianza.whatsapp || alianza.instagram);

        return (
          <div key={idx} className={`alianza-card ${hasImage ? "has-featured-image" : ""}`}>
            <div className="alianza-card-inner">
              <div className="alianza-content">
                <div className="alianza-card-header">
                  <div className={`alianza-logo ${!alianza.logo ? "no-image" : ""}`}>
                    {alianza.logo ? (
                      <img src={alianza.logo} alt={alianza.nombre ?? "Alianza"} />
                    ) : (
                      <span style={{ fontWeight: 700 }}>VP</span>
                    )}
                  </div>
                  <h3 className="alianza-name">{alianza.nombre}</h3>
                </div>

                {alianza.descripcion && <p className="alianza-description">{alianza.descripcion}</p>}

                {alianza.beneficio && (
                  <div className="alianza-benefit">
                    <span className="benefit-badge">Beneficio exclusivo</span>
                    <h4 className="benefit-title">{alianza.beneficio}</h4>
                    {alianza.beneficio_texto && <p className="benefit-text">{alianza.beneficio_texto}</p>}
                  </div>
                )}

                {hasContact && (
                  <div className="alianza-contact">
                    {alianza.telefono && (
                      <a
                        href={`tel:${alianza.telefono.replace(/\s+/g, "")}`}
                        className="contact-item"
                        title="Llamar"
                      >
                        <span>{alianza.telefono}</span>
                      </a>
                    )}

                    {alianza.whatsapp && (
                      <a
                        href={`https://wa.me/${alianza.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener"
                        className="contact-item whatsapp"
                        title="WhatsApp"
                      >
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {alianza.instagram && (
                      <a
                        href={`https://instagram.com/${alianza.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener"
                        className="contact-item instagram"
                        title="Instagram"
                      >
                        <span>@{alianza.instagram.replace("@", "")}</span>
                      </a>
                    )}
                  </div>
                )}

                {alianza.link && (
                  <div className="alianza-cta">
                    <a href={alianza.link} target="_blank" rel="noopener">
                      Ver más información →
                    </a>
                  </div>
                )}
              </div>

              {hasImage && (
                <div className="alianza-featured-image">
                  <img src={alianza.imagen!} alt={alianza.beneficio || alianza.nombre || "Imagen"} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="no-alianzas">
      <p>Próximamente agregaremos nuestras alianzas y beneficios exclusivos.</p>
    </div>
  );
}
