const ACTIONS = [
  {
    id: 'fan-off-leaving',
    label: 'Switched off fan when leaving the room',
    kwhSaved: 0.3,
  },
  {
    id: 'natural-light-hour',
    label: 'Used natural light instead of tube light for 1 hour',
    kwhSaved: 0.08,
  },
  {
    id: 'no-overnight-charging',
    label: 'Did not charge phone overnight after it was full',
    kwhSaved: 0.04,
  },
  {
    id: 'geyser-off-15min',
    label: 'Switched off geyser within 15 minutes of bathing',
    kwhSaved: 1.0,
  },
  {
    id: 'ac-at-24',
    label: 'Kept AC at 24°C instead of 18°C',
    kwhSaved: 1.2,
  },
  {
    id: 'unplug-charger',
    label: 'Unplugged charger when not in use',
    kwhSaved: 0.04,
  },
  {
    id: 'air-dry-clothes',
    label: 'Air-dried clothes instead of using an electric iron',
    kwhSaved: 0.25,
  },
  {
    id: 'lights-off-leaving',
    label: 'Turned off lights when leaving the room',
    kwhSaved: 0.12,
  },
];

module.exports = ACTIONS;
