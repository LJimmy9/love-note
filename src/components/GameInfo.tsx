import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { CardInfoDisplay, IdCardInfoDisplay } from "./InfoCard";

import gi from "./GameInfo.module.css";

interface GameInfoProps {
  showInfo: boolean;
  setShowInfo: Dispatch<SetStateAction<boolean>>;
}

export const GameInfo = ({ showInfo, setShowInfo }: GameInfoProps) => {
  const { t, i18n } = useTranslation("common");
  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  if (!showInfo) return;

  return (
    <div className={gi.infoCard}>
      <div className={gi.infoHeader}>
        <p className={gi.infoTitle}>❤️ {t("info.title")} ❤️</p>
        <select onChange={(e) => changeLanguageHandler(e.target.value)}>
          <option value="en">en</option>
          <option value="es">es</option>
          <option value="cn">cn</option>
        </select>
        <button onClick={() => setShowInfo(false)}>&times;</button>
      </div>
      <div>
        <div className={gi.infoTitle}> {t("info.header")} </div>
        <div className={gi.infoContent}>{t("info.overview")}</div>
        <div className={gi.infoContent}>
          <span className={gi.infoBullet}>{t("info.win.header")}</span>
          <ul>
            <li key={"li1"}>{t("info.win.bullet-1")}</li>
            <li key={"li2"}>{t("info.win.bullet-2")}</li>
            <li key={"li3"}>{t("info.win.bullet-3")}</li>
          </ul>
        </div>
        <div className={gi.infoContent}>
          <span className={gi.infoBullet}>{t("info.play.header")}</span>
          <ul>
            <li key={"li1"}>{t("info.play.bullet-1")}</li>
            <li key={"li2"}>{t("info.play.bullet-2")}</li>
          </ul>{" "}
        </div>
      </div>
      <div>
        <p className={gi.infoTitle}> {t("info.card-header")} </p>
        <CardInfoDisplay />
        <p className={gi.infoTitle}> {t("info.identityCard-header")} </p>
        <IdCardInfoDisplay />
      </div>
    </div>
  );
};
