// src/db/types.ts
import { campaignStatusEnum } from './schema';

export type CampaignStatus = typeof campaignStatusEnum.enumValues[number] | 'All';
