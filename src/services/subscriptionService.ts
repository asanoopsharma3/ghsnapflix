import { apiClient } from '../api/axiosClient';
import { API_CONFIG } from '../config/api';
import { SubscriptionStatusPayload, SubscriptionStatusResponse } from '../types/subscription';

export async function fetchSubscriptionStatus(): Promise<SubscriptionStatusPayload | null> {
  const { data } = await apiClient.get<SubscriptionStatusResponse>(
    API_CONFIG.endpoints.subscriptionStatus
  );

  return data.subscription ?? null;
}
