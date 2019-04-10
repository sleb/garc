export interface AutoArchiveConfig {
  shouldDeletePermenantly: boolean;
  shouldSendEmail: boolean;
  archiveLabelName: string;
}

export interface SearchConfig {
  categories: string[];
  location: string;
  age: string;
}