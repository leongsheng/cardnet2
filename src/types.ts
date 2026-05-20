export interface Contact {
  _id?: string;
  id?: string; // used for frontend tracking if needed, but we rely on _id from mongo
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  organization: string;
  website: string;
  address: string;
  linkedin: string;
  twitter: string;
  github: string;
  avatarBase64: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemConfig {
  configured: boolean;
  mode: "database" | "memory";
  connected: boolean;
  dbName: string;
  error: string | null;
}
