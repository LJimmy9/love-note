import ic from "./infoCard.module.css";
import cardData from "../assets/cards.json";
import idCardData from "../assets/identity-cards.json";

export const CardInfoDisplay = () => {
  return (
    <p>
      {cardData.map((item) => (
        <p className={ic.infoList}>
          <span className={ic.infoCardName}>{item.cardNum} {item.image}</span> {item.description}
        </p>
      ))}
    </p>
  );
};

export const IdCardInfoDisplay = () => {
  return (
    <p>
      {idCardData.map((item) => (
        <p className={ic.infoList}>
          <span className={ic.infoIDName}>{item.name} {item.image}</span> {item.description} {" "}
        </p>
      ))}
    </p>
  );
};
