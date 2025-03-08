import { memo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { Link } from "wouter";
import { jurisdictions } from "@/lib/jurisdiction-data";
import { InfoTooltip } from "@/components/ui/tooltip-with-info";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

// Use a CORS-friendly endpoint
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GeoFeature {
  rsmKey: string;
  geometry: any; // TopoJSON geometry type
  properties: {
    name: string;
    [key: string]: any;
  };
}

const RegulatoryMap = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Map</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative">
      <ComposableMap 
        projection="geoMercator"
        projectionConfig={{
          scale: 150
        }}
      >
        <Geographies 
          geography={geoUrl}
          onGeographyPathError={(err) => {
            console.error("Geography Path Error:", err);
            setError("Failed to load map data");
          }}
          onGeographiesLoaded={() => setIsLoading(false)}
        >
          {({ geographies }: { geographies: GeoFeature[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#2C3440"
                stroke="#FFFFFF"
                strokeWidth={0.5}
                style={{
                  default: {
                    outline: "none",
                  },
                  hover: {
                    fill: "#374151",
                    outline: "none",
                  },
                  pressed: {
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>

        {jurisdictions.map(({ name, coordinates, description, id }) => (
          <Marker key={name} coordinates={[coordinates[1], coordinates[0]]}>
            <InfoTooltip
              term={name}
              explanation={description}
            >
              <Link href={`/jurisdiction/${id}`}>
                <g
                  transform="translate(-12, -24)"
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    r="8"
                    fill="#60A5FA"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <circle
                    r="4"
                    fill="#2563EB"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                </g>
              </Link>
            </InfoTooltip>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default memo(RegulatoryMap);