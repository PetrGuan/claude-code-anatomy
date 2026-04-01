import LayerToggle from "./LayerToggle";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

export default function LayerToggleScale({ locale = "en" as Locale }) {
  return (
    <LayerToggle
      plainLabel={t(locale, "common.plainLabel")}
      technicalLabel={t(locale, "common.technicalLabel")}
      plain={<p>{t(locale, "overview.scalePlain")}</p>}
      technical={
        <div>
          <p>{t(locale, "overview.scaleTechnical")}</p>
          <ul className="mt-2 text-sm space-y-1">
            {t(locale, "overview.scaleTechDetails").split("\n").map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
