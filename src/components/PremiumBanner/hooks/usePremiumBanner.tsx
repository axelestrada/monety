import { useContext } from "react";
import { PremiumBannerContext } from "@/components/PremiumBanner/PremiumBannerContext";

export const usePremiumBanner = () => {
  const context = useContext(PremiumBannerContext);

  if (!context) {
    throw new Error(
      "usePremiumBanner must be used within a PremiumBannerProvider"
    );
  }

  return context;
};
