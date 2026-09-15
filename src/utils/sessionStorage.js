import { isJwtExpired } from './jwt';
const STORAGE_KEY = 'ghsnapflix_session';
const DAY_MS = 24 * 60 * 60 * 1000;
const TOKEN_KEY = 'token';
const PAYMENT_DONE_KEY = 'payment_done';
const OFFER_CODE_KEY = 'offerCode';
const PHONE_KEY = 'phone';
const emptyStorage = () => ({
    session: null,
    subscriptionsByMsisdn: {},
});
const readStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return emptyStorage();
        }
        const parsed = JSON.parse(raw);
        return {
            session: parsed.session ?? null,
            subscriptionsByMsisdn: parsed.subscriptionsByMsisdn ?? {},
        };
    }
    catch {
        return emptyStorage();
    }
};
const writeStorage = (storage) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
};

export const DEMO_ADMIN_KEY = 'ghsnapflix_demo_admin';
export const DEMO_SUB_KEY = 'is_demo_subscription';

export const isDemoAdminEnabled = () => {
    try {
        return localStorage.getItem(DEMO_ADMIN_KEY) === 'true' || localStorage.getItem(DEMO_SUB_KEY) === 'true';
    } catch {
        return false;
    }
};

export const setDemoAdminEnabled = (enabled) => {
    try {
        if (enabled) {
            localStorage.setItem(DEMO_ADMIN_KEY, 'true');
        } else {
            localStorage.removeItem(DEMO_ADMIN_KEY);
            localStorage.removeItem(DEMO_SUB_KEY);
        }
    } catch (e) {
        console.error('Error toggling demo admin:', e);
    }
};

export const setDemoSubscriptionState = (state) => {
    try {
        const demoMsisdn = '233241234567';
        localStorage.setItem(DEMO_ADMIN_KEY, 'true');

        if (state === 'active') {
            localStorage.setItem(DEMO_SUB_KEY, 'true');
            localStorage.setItem(TOKEN_KEY, 'demo-admin-jwt-token');
            localStorage.setItem(PAYMENT_DONE_KEY, 'true');
            localStorage.setItem(PHONE_KEY, demoMsisdn);
            localStorage.setItem(OFFER_CODE_KEY, 'GH_SNAP_DAILY_1');

            const storage = readStorage();
            const subscribedAt = Date.now();
            const subscription = {
                planKey: 'daily',
                apiPlanId: 'daily-pass',
                subscribedAt,
                expiresAt: subscribedAt + 7 * DAY_MS,
            };
            storage.subscriptionsByMsisdn[demoMsisdn] = subscription;
            storage.session = {
                msisdn: demoMsisdn,
                isLoggedIn: true,
                subscription,
            };
            writeStorage(storage);
            return subscription;
        } else if (state === 'expired') {
            localStorage.setItem(DEMO_SUB_KEY, 'expired');
            localStorage.setItem(TOKEN_KEY, 'demo-expired-token');
            localStorage.setItem(PAYMENT_DONE_KEY, 'false');
            localStorage.setItem(PHONE_KEY, demoMsisdn);

            const storage = readStorage();
            const subscribedAt = Date.now() - 2 * DAY_MS;
            const subscription = {
                planKey: 'daily',
                apiPlanId: 'daily-pass',
                subscribedAt,
                expiresAt: Date.now() - 3600000, // expired 1 hour ago
            };
            storage.subscriptionsByMsisdn[demoMsisdn] = subscription;
            storage.session = {
                msisdn: demoMsisdn,
                isLoggedIn: true,
                subscription,
            };
            writeStorage(storage);
            return subscription;
        } else {
            // guest
            localStorage.removeItem(DEMO_SUB_KEY);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(PAYMENT_DONE_KEY);
            localStorage.removeItem(PHONE_KEY);
            const storage = readStorage();
            if (storage.session) {
                storage.session.isLoggedIn = false;
                storage.session.subscription = null;
            }
            delete storage.subscriptionsByMsisdn[demoMsisdn];
            writeStorage(storage);
            return null;
        }
    } catch (e) {
        console.error('Error setting demo subscription state:', e);
        return null;
    }
};

export const isSubscriptionActive = (subscription) => {
    if (!subscription) {
        return false;
    }
    return Date.now() < subscription.expiresAt;
};
export const getSubscriptionExpiry = (durationDays = 1, fromTime = Date.now()) => fromTime + (durationDays || 1) * DAY_MS;
export const loadAppSession = () => {
    // Check Demo Admin state first
    if (isDemoAdminEnabled()) {
        const demoSubStatus = localStorage.getItem(DEMO_SUB_KEY);
        if (demoSubStatus === 'true') {
            const demoMsisdn = localStorage.getItem(PHONE_KEY) || '233241234567';
            return {
                msisdn: demoMsisdn,
                isLoggedIn: true,
                isSubscribed: true,
                subscription: {
                    planKey: 'daily',
                    apiPlanId: 'daily-pass',
                    subscribedAt: Date.now() - 3600000,
                    expiresAt: Date.now() + 7 * DAY_MS,
                },
                accessExpired: false,
            };
        } else if (demoSubStatus === 'expired') {
            const demoMsisdn = localStorage.getItem(PHONE_KEY) || '233241234567';
            return {
                msisdn: demoMsisdn,
                isLoggedIn: true,
                isSubscribed: false,
                subscription: {
                    planKey: 'daily',
                    apiPlanId: 'daily-pass',
                    subscribedAt: Date.now() - 2 * DAY_MS,
                    expiresAt: Date.now() - 3600000,
                },
                accessExpired: true,
            };
        }
    }

    const token = getAuthToken();
    if (token && isJwtExpired(token)) {
        clearLoginSession();
        return {
            msisdn: '',
            isLoggedIn: false,
            isSubscribed: false,
            subscription: null,
            accessExpired: true,
        };
    }
    const storage = readStorage();
    const session = storage.session;
    if (!session?.msisdn) {
        const phone = localStorage.getItem(PHONE_KEY) || '';
        if (token && phone && !isJwtExpired(token)) {
            return {
                msisdn: phone.replace(/\D/g, ''),
                isLoggedIn: true,
                isSubscribed: localStorage.getItem(PAYMENT_DONE_KEY) === 'true',
                subscription: null,
                accessExpired: false,
            };
        }
        return {
            msisdn: '',
            isLoggedIn: false,
            isSubscribed: false,
            subscription: null,
            accessExpired: false,
        };
    }
    let subscription = storage.subscriptionsByMsisdn[session.msisdn] ?? null;
    if (!isSubscriptionActive(subscription)) {
        if (subscription) {
            delete storage.subscriptionsByMsisdn[session.msisdn];
            if (storage.session) {
                storage.session.subscription = null;
                storage.session.isLoggedIn = false;
            }
            writeStorage(storage);
            clearLoginSession();
            return {
                msisdn: '',
                isLoggedIn: false,
                isSubscribed: false,
                subscription: null,
                accessExpired: true,
            };
        }
        subscription = null;
    }
    else if (storage.session) {
        storage.session.subscription = subscription;
        writeStorage(storage);
    }
    const isSubscribed = isSubscriptionActive(subscription) && Boolean(token) && !isJwtExpired(token);
    return {
        msisdn: session.msisdn,
        isLoggedIn: Boolean(session.isLoggedIn && token && !isJwtExpired(token) && isSubscribed),
        isSubscribed,
        subscription,
        accessExpired: false,
    };
};
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const saveAuthToken = (token, msisdn) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(PAYMENT_DONE_KEY, 'true');
    if (msisdn) {
        localStorage.setItem(PHONE_KEY, msisdn);
    }
};
export const saveLoginSession = (msisdn) => {
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
export const saveSubscription = (msisdn, plan) => {
    const storage = readStorage();
    const subscribedAt = Date.now();
    const subscription = {
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
export const clearLoginSession = (preserveDemo = false) => {
    const storage = readStorage();
    if (storage.session) {
        storage.session.isLoggedIn = false;
    }
    writeStorage(storage);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PAYMENT_DONE_KEY);
    localStorage.removeItem(OFFER_CODE_KEY);
    localStorage.removeItem(PHONE_KEY);
    if (!preserveDemo && !isDemoAdminEnabled()) {
        localStorage.removeItem('is_demo_subscription');
    }
};
export const clearAllSessionData = () => {
    localStorage.removeItem(STORAGE_KEY);
};
export const getMsisdnSubscription = (msisdn) => {
    const storage = readStorage();
    const subscription = storage.subscriptionsByMsisdn[msisdn] ?? null;
    return isSubscriptionActive(subscription) ? subscription : null;
};
