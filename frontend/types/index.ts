export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface PageProps {
  appName: string;
  locations: Location[];
}

export interface MapProps {
  locations: Location[];
}

// Extend Inertia's global types
declare global {
  namespace Inertia {
    interface PageProps extends Record<string, unknown> {
      appName: string;
      locations: Location[];
    }
  }
}