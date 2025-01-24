import { TouchableOpacity } from "react-native";

import { CustomText } from "@/components/CustomText";

interface DrawerItemProps {
  label: string;
  active?: boolean;
  icon: ({ isActive }: { isActive: boolean }) => React.ReactNode;
  onPress?: () => void;
}

export const DrawerItem = ({
  icon,
  label,
  onPress,
  active = false,
}: DrawerItemProps) => {
  return (
    <TouchableOpacity
      className={`rounded-full flex-row py-3.5 px-4 items-center ${
        active && "bg-accent-25"
      }`}
      onPress={onPress}
    >
      {icon({ isActive: active })}

      <CustomText
        className={`font-[Rounded-Medium] mx-3 ${
          active ? "text-accent" : "text-text-secondary"
        }`}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};
