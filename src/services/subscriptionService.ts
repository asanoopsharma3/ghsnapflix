import { apiClient } from '../api/axiosClient';
import { API_CONFIG } from '../config/api';
import { SubscribeResponse } from '../types/subscription';

export async function subscribe(msisdn: string, planId: string): Promise<SubscribeResponse> {
  const { data } = await apiClient.post<SubscribeResponse>(API_CONFIG.endpoints.subscribe, {
    msisdn,
    plan_id: planId,
  });

  return data;
}
