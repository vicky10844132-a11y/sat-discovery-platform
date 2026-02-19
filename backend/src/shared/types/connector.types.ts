// Base types for data connectors

export interface SearchQuery {
  bbox?: [number, number, number, number]; // [minX, minY, maxX, maxY]
  geometry?: GeoJSON.Geometry;
  datetime?: {
    start: string; // ISO 8601
    end: string;
  };
  collections?: string[];
  limit?: number;
  filters?: {
    cloudCover?: { max: number; min?: number };
    resolution?: { max: number; min?: number };
    [key: string]: any;
  };
}

export interface DataItem {
  id: string;
  collection: string;
  geometry: GeoJSON.Geometry;
  bbox: [number, number, number, number];
  datetime: string;
  properties: {
    platform?: string;
    instrument?: string;
    cloudCover?: number;
    resolution?: number;
    [key: string]: any;
  };
  assets: {
    [key: string]: {
      href: string;
      type?: string;
      title?: string;
      roles?: string[];
    };
  };
  links: Array<{
    rel: string;
    href: string;
    type?: string;
  }>;
  source: {
    connector: string;
    originalId: string;
    ingestTime: string;
  };
}

export interface ConnectorCapabilities {
  supportedCollections: string[];
  supportsTimeRange: boolean;
  supportsGeometry: boolean;
  supportsCloudFilter: boolean;
  maxResults: number;
  rateLimits?: {
    requests: number;
    window: number; // milliseconds
  };
}

export interface ConnectorConfig {
  id: string;
  name: string;
  type: string;
  url: string;
  apiKey?: string;
  username?: string;
  password?: string;
  [key: string]: any;
}
