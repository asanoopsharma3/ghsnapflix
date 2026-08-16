import { apiClient } from '../api/axiosClient';
import { API_CONFIG } from '../config/api';
import { SendOtpResponse, VerifyOtpResponse } from '../types/auth';

export async function sendOtp(msisdn: string): Promise<SendOtpResponse> {
  const { data } = await apiClient.post<SendOtpResponse>(
    API_CONFIG.endpoints.sendOtp,
    { msisdn }
  );

  return data;
}

export async function verifyOtp(msisdn: string, otp: string): Promise<VerifyOtpResponse> {
  const { data } = await apiClient.post<VerifyOtpResponse>(
    API_CONFIG.endpoints.verifyOtp,
    { msisdn, otp }
  );

  return data;
}
