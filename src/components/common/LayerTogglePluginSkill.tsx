import LayerToggle from "./LayerToggle";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

export default function LayerTogglePluginSkill({ locale = "en" as Locale }) {
  return (
    <LayerToggle
      plainLabel={t(locale, "common.plainLabel")}
      technicalLabel={t(locale, "common.technicalLabel")}
      plain={
        <div>
          {t(locale, "pluginSkill.whatPlain").split("\n\n").map((p, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
          ))}
        </div>
      }
      technical={
        <div>
          {t(locale, "pluginSkill.whatTechnical").split("\n\n").map((p, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
          ))}
        </div>
      }
    />
  );
}
