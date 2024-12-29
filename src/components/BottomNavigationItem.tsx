import { TouchableOpacity, View } from "react-native";
import { Href, usePathname, useRouter } from "expo-router";

import { CustomText } from "@/components/CustomText";
import useThemeColors from "@/hooks/useThemeColors";

interface BottomNavigationItemProps {
  label: string;
  pathname: Href;
  icon: ({ isActive }: { isActive: boolean }) => React.ReactNode;
}

export const BottomNavigationItem = ({
  icon,
  label,
  pathname: itemPathname,
}: BottomNavigationItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const colors = useThemeColors();

  const isActive = pathname === itemPathname;

  return (
    <TouchableOpacity
      className="items-center flex-[1] justify-between mx-1"
      onPress={() => router.navigate(itemPathname)}
    >
      <View
        className={`py-1.5 px-6 mb-1`}
        style={{
          borderRadius: 100,
          backgroundColor: isActive
            ? colors["--color-accent-background"]
            : "transparent",
        }}
      >
        {icon({ isActive })}
      </View>

      <CustomText
        numberOfLines={1}
        className={`text-s font-[Rounded-Medium] text-text-${
          isActive ? "primary" : "secondary"
        }`}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};
