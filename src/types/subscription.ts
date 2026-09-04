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

export interface SubscriptionStatusPayload {
  subscriptionStatus?: string;
  quizAccessStatus?: string;
  questionsPlayedToday?: number;
  questionsRemaining?: number;
  dailyQuestionLimit?: number;
  canPlay?: boolean;
  message?: string;
}

export interface SubscriptionStatusResponse {
  success?: boolean;
  subscription?: SubscriptionStatusPayload;
  message?: string;
}
