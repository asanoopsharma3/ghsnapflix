export interface SubscribeRequest {
  msisdn: string;
  plan_id: string;
}

export interface SubscribeResponse {
  ok: boolean;
  statusCode?: string;
  statusMessage?: string;
  amountCharged?: string;
  transactionId?: string;
  subscriptionMisdnId?: string;
  data?: {
    subscriptionName?: string;
    registrationChannel?: string;
    amountCharged?: number;
    sendSMSNotification?: boolean;
    autoRenew?: boolean;
    amountBefore?: number;
    amountAfter?: number;
    correlationId?: string;
    nonGSM?: boolean;
    status?: string;
    customerId?: string;
    cvmoffer?: boolean;
    statusCode?: string;
    statusMessage?: string;
    nodeId?: string;
  };
  errorMessage?: string | null;
}
