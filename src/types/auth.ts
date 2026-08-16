export interface SendOtpRequest {
  msisdn: string;
}

export interface SendOtpResponse {
  ok: boolean;
  statusCode: string;
  statusMessage: string;
  transactionId: string;
  data: {
    status: string;
  };
  clientCorrelator: string;
  errorMessage: string | null;
  devMode?: boolean;
  devOtp?: string;
}

export interface VerifyOtpRequest {
  msisdn: string;
  otp: string;
}

export interface VerifyOtpResponse {
  ok: boolean;
  verified: boolean;
  errorMessage: string | null;
}
