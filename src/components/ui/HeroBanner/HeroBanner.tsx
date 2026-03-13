import { Link } from "react-router-dom";
import { Button } from "../../common";
import "./HeroBanner.scss";

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-banner__content">
        <h1 className="hero-banner__title">
          Votre PC sur mesure,
          <br />
          <span className="hero-banner__title--accent">conçu pour durer.</span>
        </h1>
        <p className="hero-banner__subtitle">
          PC Aeris conçoit des ordinateurs reconditionnés et assemblés avec soin,
          pour allier performance, durabilité et respect de l'environnement.
        </p>
        <div className="hero-banner__actions">
          <Link to="/configurator">
            <Button>Configurer mon PC</Button>
          </Link>
          <Link to="/about">
            <Button variant="outline">En savoir plus</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
