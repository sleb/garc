export interface AutoArchiveConfig {
  shouldDeletePermenantly: boolean;
  shouldSendEmail: boolean;
}

export interface SearchConfig {
  categories: string[];
  location: string;
  age: string;
}