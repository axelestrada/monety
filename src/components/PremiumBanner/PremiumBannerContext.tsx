import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface PremiumBannerContextType {
  isPremiumBannerVisible: boolean;
  hidePremiumBanner: () => void;
}

export const PremiumBannerContext = createContext<PremiumBannerContextType>({
  isPremiumBannerVisible: true,
  hidePremiumBanner: () => {
    throw new Error("hidePremiumBanner not implemented");
  },
});

interface PremiumBannerProviderProps {
  children: React.ReactNode;
}

export const PremiumBannerProvider = ({
  children,
}: PremiumBannerProviderProps) => {
  const [isPremiumBannerVisible, setIsPremiumBannerVisible] = useState(true);

  const hidePremiumBanner = useCallback(() => {
    setIsPremiumBannerVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      isPremiumBannerVisible,
      hidePremiumBanner,
    }),
    [isPremiumBannerVisible, hidePremiumBanner]
  );

  return (
    <PremiumBannerContext.Provider value={value}>
      {children}
    </PremiumBannerContext.Provider>
  );
};
