import { memo } from "react";
import { Link } from "wouter";
import { jurisdictions } from "@/lib/jurisdiction-data";
import { InfoTooltip } from "@/components/ui/tooltip-with-info";

const RegulatoryMap = () => {
  // Simple viewBox for world map proportions
  return (
    <div className="w-full h-[600px] relative bg-card rounded-lg">
      <svg 
        viewBox="0 0 1000 500" 
        className="w-full h-full"
        style={{ background: '#2C3440' }}
      >
        {/* Simple world map outline */}
        <path
          d="M0,250 h1000 M500,0 v500"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          fill="none"
        />

        {/* Grid lines for reference */}
        {Array.from({ length: 10 }).map((_, i) => (
          <path
            key={`grid-${i}`}
            d={`M${i * 100},0 v500 M0,${i * 50} h1000`}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
            fill="none"
          />
        ))}

        {/* Jurisdiction markers */}
        {jurisdictions.map(({ name, description, id }) => {
          // Convert lat/long to SVG coordinates
          const x = ((180 + jurisdictions[0].coordinates[1]) / 360) * 1000;
          const y = ((90 - jurisdictions[0].coordinates[0]) / 180) * 500;

          return (
            <Link key={id} href={`/jurisdiction/${id}`}>
              <g transform={`translate(${x}, ${y})`}>
                <circle
                  r="8"
                  fill="#60A5FA"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="animate-pulse cursor-pointer"
                />
                <circle
                  r="4"
                  fill="#2563EB"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  className="cursor-pointer"
                />
                <InfoTooltip term={name} explanation={description}>
                  <foreignObject x="-50" y="-40" width="100" height="20">
                    <div className="text-center text-sm text-white">{name}</div>
                  </foreignObject>
                </InfoTooltip>
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
};

export default memo(RegulatoryMap);