import { memo } from "react";
import { Link } from "wouter";
import { jurisdictions } from "@/lib/jurisdiction-data";
import { InfoTooltip } from "@/components/ui/tooltip-with-info";

const RegulatoryMap = () => {
  return (
    <div className="w-full h-[600px] relative bg-card rounded-lg">
      <svg 
        viewBox="0 0 1000 500" 
        className="w-full h-full"
        style={{ background: '#1a1f2a' }}
      >
        {/* World map grid for reference */}
        <path
          d="M0,250 h1000"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M500,0 v500"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          fill="none"
        />

        {/* Grid lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <path
            key={`grid-${i}`}
            d={`M${i * 100},0 v500 M0,${i * 50} h1000`}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
            fill="none"
          />
        ))}

        {/* Simplified continent outlines */}
        <g fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
          {/* North America */}
          <path d="M100,50 L250,50 L300,100 L350,150 L300,200 L250,250 L150,300 L100,250 L50,200 L100,50" />

          {/* South America */}
          <path d="M250,300 L300,300 L350,350 L300,400 L250,450 L200,400 L200,350 L250,300" />

          {/* Europe */}
          <path d="M450,100 L550,50 L600,75 L550,150 L500,175 L450,150 L450,100" />

          {/* Africa */}
          <path d="M450,200 L550,200 L600,250 L550,350 L500,400 L450,350 L400,300 L450,200" />

          {/* Asia */}
          <path d="M550,50 L800,50 L850,100 L900,150 L850,250 L750,300 L650,250 L600,200 L550,150 L550,50" />

          {/* Australia */}
          <path d="M750,350 L850,350 L900,400 L850,450 L750,450 L700,400 L750,350" />
        </g>

        {/* Jurisdiction markers */}
        {jurisdictions.map(({ name, description, id, coordinates }) => {
          // Convert lat/long to SVG coordinates
          const x = ((180 + coordinates[1]) / 360) * 1000;
          const y = ((90 - coordinates[0]) / 180) * 500;

          return (
            <Link key={id} href={`/jurisdiction/${id}`}>
              <g transform={`translate(${x}, ${y})`}>
                <circle
                  r="12"
                  fill="#60A5FA"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="animate-pulse cursor-pointer opacity-30"
                />
                <circle
                  r="6"
                  fill="#2563EB"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  className="cursor-pointer"
                />
                <InfoTooltip term={name} explanation={description}>
                  <foreignObject x="-50" y="-40" width="100" height="20">
                    <div className="text-center text-sm text-white font-medium">
                      {name}
                    </div>
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