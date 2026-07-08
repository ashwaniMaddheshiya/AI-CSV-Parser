import { CRM_STATUSES, CRMRecord, DATA_SOURCES, SkippedRecord } from "../types/index.js";
import { isValidDate } from "../utils/index.js";

const CRM_STATUS_SET = new Set<string>(CRM_STATUSES);
const DATA_SOURCE_SET = new Set<string>(DATA_SOURCES);

function hasContactInfo(record: CRMRecord): boolean {
  return Boolean(record.email.trim() || record.mobile_without_country_code.trim());
}

function sanitizeStatus(value: string): CRMRecord["crm_status"] {
  return CRM_STATUS_SET.has(value) ? (value as CRMRecord["crm_status"]) : "";
}

function sanitizeDataSource(value: string): CRMRecord["data_source"] {
  return DATA_SOURCE_SET.has(value) ? (value as CRMRecord["data_source"]) : "";
}

export function sanitizeCrmRecord(record: CRMRecord): CRMRecord {
  return {
    created_at: isValidDate(record.created_at) ? record.created_at : "",
    name: record.name.trim(),
    email: record.email.trim(),
    country_code: record.country_code.trim(),
    mobile_without_country_code: record.mobile_without_country_code.trim(),
    company: record.company.trim(),
    city: record.city.trim(),
    state: record.state.trim(),
    country: record.country.trim(),
    lead_owner: record.lead_owner.trim(),
    crm_status: sanitizeStatus(record.crm_status.trim()),
    crm_note: record.crm_note.trim(),
    data_source: sanitizeDataSource(record.data_source.trim()),
    possession_time: record.possession_time.trim(),
    description: record.description.trim(),
  };
}

export function validateAndSanitizeRecords(records: CRMRecord[]): {
  validRecords: CRMRecord[];
  skippedRecords: SkippedRecord[];
} {
  const validRecords: CRMRecord[] = [];
  const skippedRecords: SkippedRecord[] = [];

  records.forEach((record, index) => {
    const sanitized = sanitizeCrmRecord(record);

    if (!hasContactInfo(sanitized)) {
      skippedRecords.push({
        rowIndex: index,
        reason: "No email or phone found after extraction",
        rawData: recordToRawData(record),
      });
      return;
    }

    validRecords.push(sanitized);
  });

  return { validRecords, skippedRecords };
}

function recordToRawData(record: CRMRecord): Record<string, string> {
  return {
    name: record.name,
    email: record.email,
    mobile_without_country_code: record.mobile_without_country_code,
    company: record.company,
  };
}
