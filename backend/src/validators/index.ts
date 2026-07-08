import { z } from "zod";
import { CRM_STATUSES, DATA_SOURCES } from "../types/index.js";

export const crmRecordSchema = z.object({
  created_at: z.string(),
  name: z.string(),
  email: z.string(),
  country_code: z.string(),
  mobile_without_country_code: z.string(),
  company: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  lead_owner: z.string(),
  crm_status: z.union([z.enum(CRM_STATUSES), z.literal("")]),
  crm_note: z.string(),
  data_source: z.union([z.enum(DATA_SOURCES), z.literal("")]),
  possession_time: z.string(),
  description: z.string(),
});

export const aiExtractionResponseSchema = z.object({
  records: z.array(crmRecordSchema),
  skipped: z.array(
    z.object({
      rowIndex: z.number(),
      reason: z.string(),
      rawData: z.record(z.string()),
    }),
  ),
});

export const importResponseSchema = z.object({
  success: z.boolean(),
  imported: z.number(),
  skipped: z.number(),
  records: z.array(crmRecordSchema),
  skippedRecords: z.array(
    z.object({
      rowIndex: z.number(),
      reason: z.string(),
      rawData: z.record(z.string()),
    }),
  ),
});

export type CrmRecordInput = z.infer<typeof crmRecordSchema>;
export type AiExtractionResponseInput = z.infer<typeof aiExtractionResponseSchema>;
