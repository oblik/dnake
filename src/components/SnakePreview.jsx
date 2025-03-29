import React from 'react';

// Snake types with enhanced visualization properties
export const snakeTypes = [
  {
    id: 'red-eyed',
    name: 'Red-Eyed Viper',
    description: 'A deadly serpent with glowing red eyes that can hypnotize its prey',
    primaryColor: '#2e7d32',
    secondaryColor: '#1b5e20',
    eyeColor: '#ff1744',
    patternColor: '#388e3c',
    headShape: 'diamond'
  },
  {
    id: 'black-eyed',
    name: 'Shadow Serpent',
    description: 'A mysterious snake that lurks in darkness with piercing black eyes',
    primaryColor: '#5e35b1',
    secondaryColor: '#4527a0',
    eyeColor: '#000000',
    patternColor: '#7e57c2',
    headShape: 'round'
  },
  {
    id: 'golden',
    name: 'Golden Python',
    description: 'A majestic snake with scales that shimmer like gold in the sunlight',
    primaryColor: '#ffd700',
    secondaryColor: '#ffb300',
    eyeColor: '#ff9100',
    patternColor: '#ffc400',
    headShape: 'triangle'
  }
];

function SnakePreview({ primaryColor, secondaryColor, eyeColor, patternColor, headShape }) {
  // Default values if not provided
  const pattern = patternColor || primaryColor;
  const head = headShape || 'diamond';
  
  return (
    <div className="snake-canvas">
      <svg width="200" height="100" viewBox="0 0 200 100">
        {/* Create a zigzag snake path that looks like a moving snake */}
        <g transform="translate(10, 50)">
          {/* Head */}
          {head === 'diamond' ? (
            <path d="M180,0 L190,10 L180,20 L170,10 Z" fill={primaryColor} />
          ) : head === 'round' ? (
            <circle cx="180" cy="10" r="10" fill={primaryColor} />
          ) : (
            <polygon points="170,0 190,10 170,20" fill={primaryColor} />
          )}
          
          {/* Eyes */}
          <circle cx="183" cy="7" r="2.5" fill={eyeColor} />
          <circle cx="183" cy="13" r="2.5" fill={eyeColor} />
          
          {/* Body segments with alternating colors and pattern */}
          <rect x="155" y="5" width="15" height="10" rx="3" fill={secondaryColor} />
          <rect x="140" y="5" width="15" height="10" rx="3" fill={primaryColor} />
          <rect x="125" y="5" width="15" height="10" rx="3" fill={secondaryColor} />
          <rect x="110" y="5" width="15" height="10" rx="3" fill={primaryColor} />
          <rect x="95" y="5" width="15" height="10" rx="3" fill={secondaryColor} />
          
          {/* Body continues but curves */}
          <rect x="80" y="5" width="15" height="10" rx="3" fill={primaryColor} transform="rotate(-10, 87.5, 10)" />
          <rect x="65" y="2" width="15" height="10" rx="3" fill={secondaryColor} transform="rotate(-20, 72.5, 7)" />
          <rect x="50" y="-4" width="15" height="10" rx="3" fill={primaryColor} transform="rotate(-30, 57.5, 1)" />
          <rect x="35" y="-12" width="15" height="10" rx="3" fill={secondaryColor} transform="rotate(-40, 42.5, -7)" />
          <rect x="22" y="-23" width="15" height="10" rx="3" fill={primaryColor} transform="rotate(-50, 29.5, -18)" />
          
          {/* Pattern overlay */}
          <g opacity="0.5">
            <circle cx="163" cy="10" r="2" fill={pattern} />
            <circle cx="148" cy="10" r="2" fill={pattern} />
            <circle cx="133" cy="10" r="2" fill={pattern} />
            <circle cx="118" cy="10" r="2" fill={pattern} />
            <circle cx="103" cy="10" r="2" fill={pattern} />
            <circle cx="87" cy="10" r="2" fill={pattern} transform="rotate(-10, 87.5, 10)" />
            <circle cx="72" cy="7" r="2" fill={pattern} transform="rotate(-20, 72.5, 7)" />
            <circle cx="57" cy="1" r="2" fill={pattern} transform="rotate(-30, 57.5, 1)" />
            <circle cx="42" cy="-7" r="2" fill={pattern} transform="rotate(-40, 42.5, -7)" />
            <circle cx="29" cy="-18" r="2" fill={pattern} transform="rotate(-50, 29.5, -18)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default SnakePreview; 