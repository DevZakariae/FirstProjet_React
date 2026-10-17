import React, { useMemo, useState } from "react";

const cities = ["Casablanca", "Marrakech", "Rabat", "Agadir", "Fès", "Tanger", "Essaouira", "Oujda"];

const trips = [
  { id: 1, depart: "08:00", arrive: "12:30", duration: "4h 30min", price: 120, type: "Confort", stops: "Direct" },
  { id: 2, depart: "10:00", arrive: "14:45", duration: "4h 45min", price: 110, type: "Confort", stops: "1 arrêt" },
  { id: 3, depart: "14:00", arrive: "18:30", duration: "4h 30min", price: 135, type: "Premium", stops: "Direct" },
  { id: 4, depart: "17:00", arrive: "21:30", duration: "4h 30min", price: 120, type: "Confort", stops: "Direct" }
];

function App() {
  const [from, setFrom] = useState("Casablanca");
  const [to, setTo] = useState("Marrakech");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [passengers, setPassengers] = useState("1");
  const [searched, setSearched] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [seats, setSeats] = useState([]);
  const [step, setStep] = useState("search");
  const [notice, setNotice] = useState("");

  const total = useMemo(() => (selectedTrip ? selectedTrip.price * Number(passengers) : 0), [selectedTrip, passengers]);

  const searchTrips = (event) => {
    event.preventDefault();
    if (from === to) {
      setNotice("Choisissez deux villes différentes pour votre trajet.");
      return;
    }
    setNotice("");
    setSearched(true);
    setSelectedTrip(null);
    setStep("search");
  };

  const chooseTrip = (trip) => {
    setSelectedTrip(trip);
    setSeats([]);
    setStep("seats");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSeat = (seat) => {
    setSeats((current) => current.includes(seat)
      ? current.filter((item) => item !== seat)
      : current.length < Number(passengers) ? [...current, seat] : current);
  };

  const continueToSummary = () => {
    if (seats.length !== Number(passengers)) {
      setNotice(`Veuillez sélectionner ${passengers} siège(s) pour continuer.`);
      return;
    }
    setNotice("");
    setStep("summary");
  };

  const confirmDemo = () => {
    setNotice("Réservation de démonstration confirmée ! Aucun paiement réel n’a été effectué.");
    setStep("confirmed");
  };

  const formattedDate = date ? new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric"
  }) : "";

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#accueil" aria-label="Wijhati accueil"><span className="brand-mark">wijhati</span><span className="brand-sub">VOTRE VOYAGE, VOTRE DESTINATION</span></a>
        <nav className="nav-links">
          <a href="#accueil" onClick={() => { setStep("search"); setSearched(false); }}>Accueil</a>
          <a href="#reservation" onClick={() => { setStep("search"); setSearched(false); }}>Réserver</a>
          <a href="#avantages">Nos services</a>
        </nav>
        <button className="account-button" onClick={() => setNotice("La connexion sera ajoutée dans une prochaine version.")}>Mon compte <span>↗</span></button>
      </header>

      <main>
        <section className="hero" id="accueil">
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-line" /> LE MAROC VOUS ATTEND</div>
            <h1>Votre prochain voyage<br /><em>commence ici.</em></h1>
            <p>Réservez votre billet d’autocar en quelques clics.<br />Voyagez confortablement, partout au Maroc.</p>
            <div className="hero-tags"><span>✓ Réservation simple</span><span>✓ Prix transparents</span></div>
          </div>
          <div className="hero-art" role="img" aria-label="Illustration d’un autocar sur une route marocaine">
            <div className="sun"></div><div className="mountain mountain-back"></div><div className="mountain mountain-front"></div>
            <div className="road"></div>
            <div className="bus">
              <div className="bus-windows"><i></i><i></i><i></i><i></i><i></i></div>
              <div className="bus-logo">wijhati</div><div className="bus-body-line"></div>
              <div className="wheel wheel-one"></div><div className="wheel wheel-two"></div>
            </div>
            <div className="art-caption"><span className="caption-dot"></span> La route est à vous</div>
          </div>
        </section>

        <section className="booking-panel" id="reservation">
          <div className="panel-heading">
            <div><span className="section-kicker">PLANIFIEZ VOTRE TRAJET</span><h2>Où souhaitez-vous aller ?</h2></div>
            <span className="secure-note">♧ Réservation sécurisée</span>
          </div>
          <form className="search-form" onSubmit={searchTrips}>
            <label className="field"><span>VILLE DE DÉPART</span><span className="field-icon">⌖</span>
              <select value={from} onChange={(e) => setFrom(e.target.value)}>{cities.map(city => <option key={city}>{city}</option>)}</select>
            </label>
            <button className="swap-button" type="button" title="Inverser les villes" onClick={() => { setFrom(to); setTo(from); }}>⇄</button>
            <label className="field"><span>DESTINATION</span><span className="field-icon">⌖</span>
              <select value={to} onChange={(e) => setTo(e.target.value)}>{cities.map(city => <option key={city}>{city}</option>)}</select>
            </label>
            <label className="field date-field"><span>DATE DE DÉPART</span><span className="field-icon">▦</span>
              <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label className="field passenger-field"><span>PASSAGERS</span><span className="field-icon">♙</span>
              <select value={passengers} onChange={(e) => setPassengers(e.target.value)}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? "passager" : "passagers"}</option>)}</select>
            </label>
            <button className="primary-button search-button" type="submit">Rechercher <span>→</span></button>
          </form>
          {notice && step !== "confirmed" && <div className="notice" role="status">{notice}</div>}
          <div className="trust-row"><span>✦ Plus de 50 destinations</span><span>◈ Paiement sécurisé (démo)</span><span>◎ Assistance voyageurs</span></div>
        </section>

        {step === "search" && searched && (
          <section className="results-section">
            <div className="results-header"><div><span className="section-kicker">VOTRE VOYAGE</span><h2>{from} <span className="route-arrow">→</span> {to}</h2><p>{formattedDate} · {passengers} passager(s)</p></div><span className="result-count">{trips.length} départs disponibles</span></div>
            <div className="trip-list">
              {trips.map(trip => <article className="trip-card" key={trip.id}>
                <div className="trip-brand"><span className="mini-logo">wijhati</span><span>{trip.type}</span></div>
                <div className="trip-time"><strong>{trip.depart}</strong><div className="time-line"><span></span><small>{trip.duration}</small><span></span></div><strong>{trip.arrive}</strong><div className="trip-cities"><span>{from}</span><span>{to}</span></div></div>
                <div className="trip-details"><span>♧ {trip.stops}</span><span>❄ Climatisation</span></div>
                <div className="trip-price"><strong>{trip.price * Number(passengers)} <small>MAD</small></strong><span>{trip.price} MAD / personne</span><button className="primary-button" onClick={() => chooseTrip(trip)}>Choisir <span>→</span></button></div>
              </article>)}
            </div>
          </section>
        )}

        {step === "seats" && selectedTrip && (
          <section className="workflow-card">
            <div className="workflow-top"><button className="back-button" onClick={() => setStep("search")}>← Retour aux départs</button><span className="step-label">ÉTAPE 2 SUR 3</span></div>
            <h2>Choisissez vos sièges</h2><p className="muted">{from} → {to} · {formattedDate} · Départ à {selectedTrip.depart}</p>
            <div className="seat-layout">
              <div className="seat-legend"><span><i className="legend-free"></i> Disponible</span><span><i className="legend-selected"></i> Sélectionné</span><span><i className="legend-busy"></i> Occupé</span></div>
              <div className="bus-seats"><div className="driver">CONDUCTEUR</div>{Array.from({length: 8}, (_, row) => <div className="seat-row" key={row}>{["A","B","C","D"].map((col, index) => { const seat = `${row + 1}${col}`; const busy = [ "1B", "2D", "3A", "4C", "6B", "7D" ].includes(seat); return <button key={seat} disabled={busy} className={`seat ${busy ? "busy" : ""} ${seats.includes(seat) ? "selected" : ""} ${index === 2 ? "aisle" : ""}`} onClick={() => toggleSeat(seat)} aria-label={`Siège ${seat}`}>{seat}</button>; })}</div>)}</div>
            </div>
            <div className="workflow-footer"><span>{seats.length} / {passengers} siège(s) sélectionné(s)</span><button className="primary-button" onClick={continueToSummary}>Continuer →</button></div>
          </section>
        )}

        {step === "summary" && selectedTrip && (
          <section className="workflow-card summary-card">
            <div className="workflow-top"><button className="back-button" onClick={() => setStep("seats")}>← Modifier les sièges</button><span className="step-label">ÉTAPE 3 SUR 3</span></div>
            <h2>Récapitulatif de réservation</h2><p className="muted">Vérifiez les informations avant de confirmer.</p>
            <div className="summary-details"><div><span>TRAJET</span><strong>{from} → {to}</strong></div><div><span>DATE & DÉPART</span><strong>{formattedDate} · {selectedTrip.depart}</strong></div><div><span>PASSAGERS</span><strong>{passengers}</strong></div><div><span>SIÈGES</span><strong>{seats.join(", ")}</strong></div></div>
            <div className="total-line"><span>Total à payer (simulation)</span><strong>{total} MAD</strong></div>
            <p className="demo-warning">Mode démonstration : aucune carte bancaire ne sera demandée et aucun paiement réel n’est effectué.</p>
            <button className="primary-button confirm-button" onClick={confirmDemo}>Confirmer la réservation <span>→</span></button>
          </section>
        )}

        {step === "confirmed" && (
          <section className="workflow-card confirmation-card">
            <div className="success-icon">✓</div><span className="section-kicker">DÉMONSTRATION TERMINÉE</span><h2>Votre réservation est prête !</h2>
            <p>{notice}</p><div className="ticket-preview"><div className="ticket-head"><span className="mini-logo">wijhati</span><span className="ticket-status">EXEMPLE DE BILLET</span></div><h3>{from} <span>→</span> {to}</h3><div className="ticket-grid"><div><small>DATE</small><strong>{formattedDate}</strong></div><div><small>DÉPART</small><strong>{selectedTrip?.depart}</strong></div><div><small>SIÈGES</small><strong>{seats.join(", ")}</strong></div><div><small>TOTAL</small><strong>{total} MAD</strong></div></div><p className="muted">Ceci n’est pas un billet officiel et ne permet pas de voyager.</p></div>
            <button className="primary-button" onClick={() => { setStep("search"); setSearched(false); setSelectedTrip(null); setNotice(""); window.scrollTo({top: 0, behavior: "smooth"}); }}>Nouvelle recherche ↗</button>
          </section>
        )}

        <section className="benefits" id="avantages"><div className="benefit-intro"><span className="section-kicker">L’EXPÉRIENCE VOYAGE</span><h2>Le voyage en toute sérénité.</h2><p>Un trajet simple à organiser, du départ à l’arrivée.</p></div><article><div className="benefit-icon">✧</div><h3>Confort à bord</h3><p>Un voyage pensé pour votre confort.</p></article><article><div className="benefit-icon">⌖</div><h3>Partout au Maroc</h3><p>Découvrez les villes et les paysages du royaume.</p></article><article><div className="benefit-icon">♡</div><h3>À votre écoute</h3><p>Une expérience claire à chaque étape.</p></article></section>
      </main>
      <footer><a className="brand footer-brand" href="#accueil"><span className="brand-mark">CTM</span></a><span>Projet pédagogique React · Projet de démonstration</span><a href="#reservation">Réserver un trajet ↑</a></footer>
    </div>
  );
}

export default App;