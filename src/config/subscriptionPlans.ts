export interface SubscriptionPlanConfig {
  id: 'daily' | 'weekly' | 'monthly';
  name: string;
  duration: string;
  durationDays: number;
  price: number;
  originalPrice?: number;
  planId: string;
  features: string[];
  popular: boolean;
  discount?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanConfig[] = [
  {
    id: 'daily',
    name: 'Daily Pack',
    duration: '1 Day',
    durationDays: 1,
    price: 1,
    planId: '26801220000007963',
    popular: false,
    features: ['Unlimited Videos', 'HD Quality', 'Mobile Access', 'Ad-Free Experience'],
  },
  {
    id: 'weekly',
    name: 'Weekly Pack',
    duration: '7 Days',
    durationDays: 7,
    price: 5,
    originalPrice: 15,
    planId: '26801220000007964',
    discount: '29% OFF',
    popular: false,
    features: [
      'Unlimited Videos',
      'HD Quality',
      'Mobile & Desktop',
      'Ad-Free Experience',
      'Early Access',
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly Pass',
    duration: '30 Days',
    durationDays: 30,
    price: 15,
    originalPrice: 25,
    planId: '26801220000007965',
    discount: '40% OFF',
    popular: true,
    features: [
      'Unlimited Videos',
      '4K Quality',
      'All Devices',
      'Ad-Free Experience',
      'Early Access',
      'Exclusive Content',
      'Priority Support',
    ],
  },
];

export const getPlanById = (id: string): SubscriptionPlanConfig | undefined =>
  SUBSCRIPTION_PLANS.find((plan) => plan.id === id);
