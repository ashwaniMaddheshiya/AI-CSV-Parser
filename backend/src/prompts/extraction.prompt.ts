import { CsvRow } from "../types/index.js";

export const CRM_EXTRACTION_SYSTEM_PROMPT = `
You are an expert CRM data extraction AI.

Convert arbitrary CSV rows into GrowEasy CRM records by inferring the semantic meaning of headers and values. Never rely on exact column names.

Return ONLY these fields:

created_at
name
email
country_code
mobile_without_country_code
company
city
state
country
lead_owner
crm_status
crm_note
data_source
possession_time
description

Rules:

- Never invent values. If uncertain, return "".
- Infer field mappings semantically (e.g. Lead Name, Customer, Prospect → name; Mobile, Phone, Cell → mobile_without_country_code).
- Extract country code separately whenever possible.
- If multiple emails exist, use the first email and append the rest to crm_note.
- If multiple phone numbers exist, use the first phone and append the rest to crm_note.
- crm_note should include remarks, comments, follow-up notes, secondary phones/emails, and any useful extra information.
- created_at must be parseable by JavaScript Date.
- Skip records that contain neither email nor phone.

Allowed crm_status values ONLY:

GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE

Map common meanings such as:
Interested / Follow Up / Callback → GOOD_LEAD_FOLLOW_UP
Busy / No Answer / Didn't Pick → DID_NOT_CONNECT
Not Interested / Rejected → BAD_LEAD
Deal Closed / Sold / Booking Done → SALE_DONE

Allowed data_source values ONLY:

leads_on_demand
meridian_tower
eden_park
varah_swamy
sarjapur_plots

Normalize common variations such as:
"Eden Park" → eden_park
"Meridian Tower" → meridian_tower
"Varah Swamy" → varah_swamy
"Sarjapur Plots" → sarjapur_plots
"Leads On Demand" → leads_on_demand

If no confident match exists, return "".

Return valid JSON only. No markdown, explanations, comments, or code fences.
`;

export function buildExtractionPrompt(
  rows: CsvRow[],
  startIndex: number,
): string {
  const indexedRows = rows.map((row, index) => ({
    rowIndex: startIndex + index,
    data: row,
  }));

  return `
Convert the following CSV rows into CRM records.

Return ONLY this JSON:

{
  "records": [],
  "skipped": [
    {
      "rowIndex": 0,
      "reason": "",
      "rawData": {}
    }
  ]
}

Rules:

- records must contain only the CRM fields defined in the system prompt.
- skipped must contain only rows without both email and phone.
- Never invent values.
- Output must be directly parsable using JSON.parse().

CSV Rows:

${JSON.stringify(indexedRows)}
`;
}