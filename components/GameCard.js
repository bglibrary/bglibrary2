/**
 * Displays a single GameCard (summary). No domain logic.
 */
export default function GameCard({ card, onSelect }) {
  if (!card) return null;
  return (
    <article
      data-testid="game-card"
      data-id={card.id}
      onClick={() => onSelect && onSelect(card.id)}
      role={onSelect ? "button" : undefined}
      style={{ margin: "0.5rem 0", padding: "0.5rem", border: "1px solid #ccc", cursor: onSelect ? "pointer" : "default" }}
    >
      <h3>{card.title}</h3>
      <p>Joueurs : {card.playerCount}</p>
      <p>Durée : {card.playDuration}</p>
      {card.hasAwards && <span>Award</span>}
      {card.isFavorite && <span>Favori</span>}
    </article>
  );
}
