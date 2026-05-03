import type { TargetImage } from '../domain/experiment';

export function TargetRanking({
  targets,
  value,
  onChange
}: {
  targets: TargetImage[];
  value: string[];
  onChange: (ranking: string[]) => void;
}) {
  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((x) => x !== id));
    else onChange([...value, id]);
  };

  return (
    <div>
      <p>Double-blind mode: rank options only after impressions are locked.</p>
      {targets.map((target) => (
        <button key={target.id} type="button" className="rank-item" onClick={() => toggle(target.id)}>
          {value.includes(target.id) ? `#${value.indexOf(target.id) + 1}` : '—'} {target.title}
        </button>
      ))}
      <p>Current order: {value.join(' > ') || 'none yet'}</p>
    </div>
  );
}
