export interface ISettings {
  isStoreOpen: boolean;
  operatingHours: {
    open: string;
    close: string;
  };
  estimatedDeliveryTime: string;
  minOrderValue: number;
  deliveryRadius: number;
  staffCommission: number;
  paymentMethods: {
    stripe: boolean;
    cod: boolean;
  };
  taxPercentage: number;
  featuredLimit: number;
  globalDiscount: number;
  adminNotifications: boolean;
  maintenanceMode: boolean;
}