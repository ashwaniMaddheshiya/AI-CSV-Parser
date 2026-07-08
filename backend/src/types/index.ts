export const CRM_STATUSES = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
] as const;

export type CrmStatus = (typeof CRM_STATUSES)[number];

export const DATA_SOURCES = [
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
] as const;

export type DataSource = (typeof DATA_SOURCES)[number];

export interface CRMRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: CrmStatus | "";
  crm_note: string;
  data_source: DataSource | "";
  possession_time: string;
  description: string;
}

export interface SkippedRecord {
  rowIndex: number;
  reason: string;
  rawData: Record<string, string>;
}

export interface ImportResponse {
  success: boolean;
  imported: number;
  skipped: number;
  records: CRMRecord[];
  skippedRecords: SkippedRecord[];
}

export interface CsvRow {
  [key: string]: string;
}

export interface AiBatchResult {
  records: CRMRecord[];
  skippedRecords: SkippedRecord[];
}

export interface AiExtractionResponse {
  records: CRMRecord[];
  skipped: SkippedRecord[];
}
