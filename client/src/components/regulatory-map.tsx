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
          <path d="M200,100 l100,-30 l100,20 l50,50 l-50,80 l-150,30 l-50,-100 z" />

          {/* South America */}
          <path d="M300,300 l50,-30 l30,80 l-30,50 l-50,20 l-30,-70 z" />

          {/* Europe */}
          <path d="M500,100 l80,-20 l40,40 l-20,60 l-60,20 l-40,-40 z" />

          {/* Africa */}
          <path d="M500,200 l100,20 l20,100 l-60,80 l-80,-20 l-30,-130 z" />

          {/* Asia */}
          <path d="M600,100 l150,-30 l50,80 l-30,100 l-100,50 l-120,-80 l-20,-70 z" />

          {/* Australia */}
          <path d="M800,300 l60,20 l20,40 l-40,30 l-60,-10 l-20,-50 z" />
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