import { SubscriptionPlanConfig } from '../config/subscriptionPlans';

const STORAGE_KEY = 'ghsnapflix_session';
const DAY_MS = 24 * 60 * 60 * 1000;

export interface StoredSubscription {
  planKey: SubscriptionPlanConfig['id'];
  apiPlanId: string;
  subscribedAt: number;
  expiresAt: number;
}

export interface GHSnapflixSession {
  msisdn: string;
  isLoggedIn: boolean;
  subscription: StoredSubscription | null;
}

interface GHSnapflixStorage {
  session: GHSnapflixSession | null;
  subscriptionsByMsisdn: Record<string, StoredSubscription>;
}

const emptyStorage = (): GHSnapflixStorage => ({
  session: null,
  subscriptionsByMsisdn: {},
});

const readStorage = (): GHSnapflixStorage => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStorage();
    }

    const parsed = JSON.parse(raw) as GHSnapflixStorage;
    return {
      session: parsed.session ?? null,
      subscriptionsByMsisdn: parsed.subscriptionsByMsisdn ?? {},
    };
  } catch {
    return emptyStorage();
  }
};

const writeStorage = (storage: GHSnapflixStorage): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
};

export const isSubscriptionActive = (
  subscription: StoredSubscription | null | undefined
): subscription is StoredSubscription => {
  if (!subscription) {
    return false;
  }

  return Date.now() < subscription.expiresAt;
};

export const getSubscriptionExpiry = (
  durationDays: number,
  fromTime = Date.now()
): number => fromTime + durationDays * DAY_MS;

export const loadAppSession = (): {
  msisdn: string;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  subscription: StoredSubscription | null;
} => {
  const storage = readStorage();
  const session = storage.session;

  if (!session?.msisdn) {
    return {
      msisdn: '',
      isLoggedIn: false,
      isSubscribed: false,
      subscription: null,
    };
  }

  let subscription: StoredSubscription | null =
    storage.subscriptionsByMsisdn[session.msisdn] ?? null;

  if (!isSubscriptionActive(subscription)) {
    if (subscription) {
      delete storage.subscriptionsByMsisdn[session.msisdn];
      if (storage.session) {
        storage.session.subscription = null;
      }
      writeStorage(storage);
    }
    subscription = null;
  } else if (storage.session) {
    storage.session.subscription = subscription;
    writeStorage(storage);
  }

  return {
    msisdn: session.msisdn,
    isLoggedIn: session.isLoggedIn,
    isSubscribed: isSubscriptionActive(subscription),
    subscription,
  };
};

export const saveLoginSession = (msisdn: string): void => {
  const storage = readStorage();
  const subscription = storage.subscriptionsByMsisdn[msisdn] ?? null;
  const activeSubscription = isSubscriptionActive(subscription) ? subscription : null;

  if (subscription && !activeSubscription) {
    delete storage.subscriptionsByMsisdn[msisdn];
  }

  storage.session = {
    msisdn,
    isLoggedIn: true,
    subscription: activeSubscription,
  };

  writeStorage(storage);
};

export const saveSubscription = (
  msisdn: string,
  plan: Pick<SubscriptionPlanConfig, 'id' | 'planId' | 'durationDays'>
): StoredSubscription => {
  const storage = readStorage();
  const subscribedAt = Date.now();
  const subscription: StoredSubscription = {
    planKey: plan.id,
    apiPlanId: plan.planId,
    subscribedAt,
    expiresAt: getSubscriptionExpiry(plan.durationDays, subscribedAt),
  };

  storage.subscriptionsByMsisdn[msisdn] = subscription;

  if (storage.session?.msisdn === msisdn) {
    storage.session.subscription = subscription;
    storage.session.isLoggedIn = true;
  }

  writeStorage(storage);
  return subscription;
};

export const clearLoginSession = (): void => {
  const storage = readStorage();

  if (storage.session) {
    storage.session.isLoggedIn = false;
  }

  writeStorage(storage);
};

export const clearAllSessionData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getMsisdnSubscription = (msisdn: string): StoredSubscription | null => {
  const storage = readStorage();
  const subscription = storage.subscriptionsByMsisdn[msisdn] ?? null;
  return isSubscriptionActive(subscription) ? subscription : null;
};
