import gi from "./GameInfo.module.css";
import cardData from "../assets/cards.json";
import idCardData from "../assets/identity-cards.json";

export const CardInfoDisplay = () => {
  return (
    <>
      {cardData.map((item, idx) => (
        <p className={gi.infoList} key={`cid-${item.id}-${idx}`}>
          <span className={gi.infoCardName}>
            {item.cardNum} {item.image}
          </span>{" "}
          {item.description}
        </p>
      ))}
    </>
  );
};

export const IdCardInfoDisplay = () => {
  return (
    <>
      {idCardData.map((item, idx) => (
        <p className={gi.infoList} key={`icid-${item.name}-${idx}`}>
          <span className={gi.infoIDName}>
            {item.name} {item.image}
          </span>{" "}
          {item.description}{" "}
        </p>
      ))}
    </>
  );
};
