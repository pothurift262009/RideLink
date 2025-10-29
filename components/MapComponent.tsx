import React from 'react';
import { Coordinates, Ride } from '../types';
import { CarIcon } from './icons/Icons';

interface MapComponentProps {
  startCoords: Coordinates;
  endCoords: Coordinates;
  startCity: string;
  endCity: string;
  rides: Ride[];
  highlightedRideId?: string | null;
  driverPosition?: number; // Percentage (0-100) along the route
  onHighlightRide?: (rideId: string | null) => void;
  onCityClick?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ startCoords, endCoords, startCity, endCity, rides, highlightedRideId, driverPosition, onHighlightRide, onCityClick }) => {
  const viewBoxWidth = 100;
  const viewBoxHeight = 100;
  
  // Calculate driver's position on the line
  let driverX = 0;
  let driverY = 0;
  if (driverPosition !== undefined) {
    const t = driverPosition / 100;
    driverX = startCoords.x + t * (endCoords.x - startCoords.x);
    driverY = startCoords.y + t * (endCoords.y - startCoords.y);
  }

  // Sort rides to ensure the highlighted one is rendered on top.
  const sortedRides = [...rides].sort((a, b) => {
    if (a.id === highlightedRideId) return 1;
    if (b.id === highlightedRideId) return -1;
    return 0;
  });


  return (
    <div className="relative w-full aspect-video bg-slate-200 dark:bg-slate-900 rounded-lg overflow-hidden">
        {/* Stylized Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50"></div>
        <div className="absolute top-1/4 left-1/4 w-3/5 h-3/5 bg-green-200/50 dark:bg-green-800/40 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2/5 h-2/5 bg-blue-200/50 dark:bg-blue-800/40 rounded-full blur-2xl"></div>

        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="absolute inset-0 w-full h-full">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            {/* Render all ride routes, with highlighted one last */}
            {sortedRides.map(ride => {
                const isHighlighted = ride.id === highlightedRideId;
                return (
                    <g
                        key={ride.id}
                        onMouseEnter={() => onHighlightRide && onHighlightRide(ride.id)}
                        onMouseLeave={() => onHighlightRide && onHighlightRide(null)}
                        className="cursor-pointer"
                    >
                        {/* Invisible thicker line for easier clicking/hovering */}
                        <line
                            x1={startCoords.x}
                            y1={startCoords.y}
                            x2={endCoords.x}
                            y2={endCoords.y}
                            stroke="transparent"
                            strokeWidth="4"
                        />
                         {/* Visible line */}
                        <line
                            x1={startCoords.x}
                            y1={startCoords.y}
                            x2={endCoords.x}
                            y2={endCoords.y}
                            strokeWidth={isHighlighted ? "1.5" : "0.8"}
                            className={`transition-all duration-300 pointer-events-none ${isHighlighted ? 'stroke-indigo-500' : 'stroke-slate-400/70 dark:stroke-slate-600/70'}`}
                            strokeDasharray={isHighlighted ? "none" : "2 2"}
                        />
                    </g>
                )
            })}
           
            {/* Start and End Markers */}
            <g onClick={onCityClick} className="cursor-pointer group">
                <circle cx={startCoords.x} cy={startCoords.y} r="2" className="fill-green-500 stroke-white dark:stroke-slate-900 group-hover:fill-green-400 transition-colors" strokeWidth="0.5" />
                <text x={startCoords.x} y={startCoords.y + 5} className="text-[4px] font-semibold fill-slate-700 dark:fill-slate-200 group-hover:fill-slate-900 dark:group-hover:fill-white transition-colors pointer-events-none" textAnchor="middle">{startCity}</text>
            </g>

            <g onClick={onCityClick} className="cursor-pointer group">
                <circle cx={endCoords.x} cy={endCoords.y} r="2" className="fill-red-500 stroke-white dark:stroke-slate-900 group-hover:fill-red-400 transition-colors" strokeWidth="0.5" />
                <text x={endCoords.x} y={endCoords.y - 4} className="text-[4px] font-semibold fill-slate-700 dark:fill-slate-200 group-hover:fill-slate-900 dark:group-hover:fill-white transition-colors pointer-events-none" textAnchor="middle">{endCity}</text>
            </g>

            {/* Driver Position Marker */}
            {driverPosition !== undefined && (
                <g style={{ transform: `translate(${driverX}px, ${driverY}px)`, transition: 'transform 1s linear' }}>
                   <g transform="translate(-4 -4)" filter="url(#glow)">
                      <CarIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 opacity-80" style={{ transform: 'scale(0.5)'}} />
                   </g>
                </g>
            )}
        </svg>
    </div>
  );
};

export default MapComponent;