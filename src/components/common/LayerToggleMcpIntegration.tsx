import LayerToggle from "./LayerToggle";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

export default function LayerToggleMcpIntegration({ locale = "en" as Locale }) {
  return (
    <LayerToggle
      plainLabel={t(locale, "common.plainLabel")}
      technicalLabel={t(locale, "common.technicalLabel")}
      plain={
        <div>
          {t(locale, "mcpIntegration.whatPlain").split("\n\n").map((p, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
          ))}
        </div>
      }
      technical={
        <div>
          {t(locale, "mcpIntegration.whatTechnical").split("\n\n").map((p, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
          ))}
        </div>
      }
    />
  );
}
