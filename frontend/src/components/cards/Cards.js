import React from "react";
import "./css/Cards.css";
import CardItem from "./CardItem";

function Cards() {
  return (
    <div className="cards">
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="images/img-9.jpg"
              text="Amazing collections of antique and modern weapons."
              label="Weapons"
              path="https://www.bron.pl/wiedza/bron-palna-i-amunicja/pozwolenie-na-bron-do-celow-kolekcjonerskich"
            />
            <CardItem
              src="images/img-2.jpg"
              text="A collection of letters from various historical periods."
              label="Letters"
              path="https://koscierzyna.naszemiasto.pl/te-znaczki-pocztowe-sa-warte-fortune-kolekcjonerzy-znaczkow/ar/c1-9287575"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="images/img-3.jpg"
              text="Antique books and more, original copies."
              label="Books"
              path="https://instytutksiazki.pl/aktualnosci,2,zabytki-z-krolewskiej-biblioteki-i-zabytkowe-oprawy-w-muzeum-narodowym-w-krakowie,6021.html"
            />
            <CardItem
              src="images/img-4.jpg"
              text="Stamps from all over the world confirmed with quality certificates."
              label="Stamps"
              path="https://gk24.pl/te-znaczki-pocztowe-sa-warte-fortune-zobacz-ile-sa-warte-stare-znaczki-nie-spodziewasz-sie-ze-moga-tyle-kosztowac-6012024/ar/c3-17767375"
            />
            <CardItem
              src="images/img-8.jpg"
              text="Collections of collector coins from almost all countries in the world."
              label="Coins"
              path="https://www.money.pl/banki/kolekcjonowanie-monet-od-czego-zaczac-wyjasniamy-ile-mozna-na-tym-zarobic-6737621046115136a.html"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
