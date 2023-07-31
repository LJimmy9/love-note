import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { CardInfoDisplay, IdCardInfoDisplay } from "./InfoCard";

import gi from "./GameInfo.module.scss";

interface GameInfoProps {
  showInfo: boolean;
  setShowInfo: Dispatch<SetStateAction<boolean>>;
}

export const GameInfo = ({ showInfo, setShowInfo }: GameInfoProps) => {
  const { t } = useTranslation("common");

  if (!showInfo) return;

  return (
    <div className={gi.infoCard}>
      <div className={gi.infoHeader}>
        <p className={gi.infoTitle}>❤️ {t("info.title")} ❤️</p>
        <div>
          <button className={gi.closeBtn} onClick={() => setShowInfo(false)}>
            &times;
          </button>
        </div>
      </div>
      <div>
        <div className={gi.infoTitle}> {t("info.header")} </div>
        <div className={gi.infoContent}>{t("info.overview")}</div>
        <div className={gi.infoContent}>
          <span className={gi.infoBullet}>{t("info.faq.header")}</span>
          <ul>
            <li key={"li1"}>{t("info.faq.bullet-1")}</li>
            <li key={"li2"}>{t("info.faq.bullet-2")}</li>
            <li key={"li1"}>{t("info.faq.bullet-3")}</li>
            <li key={"li2"}>{t("info.faq.bullet-4")}</li>
            <li key={"li2"}>{t("info.faq.bullet-5")}</li>
            <li key={"li1"}>{t("info.faq.bullet-6")}</li>
            <li key={"li2"}>{t("info.faq.bullet-7")}</li>
            <li key={"li1"}>{t("info.faq.bullet-8")}</li>
          </ul>{" "}
        </div>
      </div>
      <div>
        <p className={gi.infoTitle}> {t("info.card-header")} </p>
        <CardInfoDisplay />
        <p className={gi.infoTitle}> {t("info.identityCard-header")} </p>
        <IdCardInfoDisplay />
      </div>
      <div className={gi.credits}>
        <div>Credits:</div>
        <div>
          Background Music: Waiting For a Sign (Instrumental) - LilyPichu
        </div>
        <div>Sound Effects:</div>
        <div>Music Jingles - Kenney Vleugels</div>
      </div>
    </div>
  );
};
