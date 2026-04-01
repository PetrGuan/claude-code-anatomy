import LayerToggle from "./LayerToggle";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

export default function LayerTogglePermissionBash({ locale = "en" as Locale }) {
  return (
    <LayerToggle
      plainLabel={t(locale, "common.plainLabel")}
      technicalLabel={t(locale, "common.technicalLabel")}
      plain={
        <div>
          {t(locale, "permissionSecurity.bashPlain").split("\n\n").map((para, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{para}</p>
          ))}
        </div>
      }
      technical={
        <div>
          {t(locale, "permissionSecurity.bashTechnical").split("\n\n").map((para, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{para}</p>
          ))}
        </div>
      }
    />
  );
}
