import { View } from "react-native";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import useThemeColors from "@/hooks/useThemeColors";

import { Separator } from "@/components/Separator";
import { CustomText } from "@/components/CustomText";
import { CustomModal } from "@/components/CustomModal";

import { DrawerItem } from "@/features/navigation/CustomDrawer/DrawerItem";
import { DrawerHeader } from "@/features/navigation/CustomDrawer/DrawerHeader";

import { HomeOutline } from "@/icons/HomeOutline";
import { BarChartOutline } from "@/icons/BarChartOutline";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { usePathname } from "expo-router";

import * as Application from "expo-application";

interface CustomDrawerProps {
  visible: boolean;
  closeDrawer: () => void;
}

export const CustomDrawer = ({ visible, closeDrawer }: CustomDrawerProps) => {
  const colors = useThemeColors();

  const router = useRouter();
  const pathname = usePathname();

  const [showStatusBar, setShowStatusBar] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowStatusBar(true);
    } else {
      setTimeout(() => {
        setShowStatusBar(false);
      }, 200);
    }
  }, [visible]);

  return (
    <CustomModal
      isVisible={visible}
      onRequestClose={closeDrawer}
      position="left"
      animationType="slide-from-left"
    >
      <SafeAreaView className="flex-[1] w-4/5">
        {showStatusBar && (
          <StatusBar
            style="auto"
            backgroundColor={colors["--color-main-background"]}
          />
        )}

        <View className="bg-main-background flex-[1] rounded-r-2xl px-3">
          <DrawerHeader />

          <Separator className="mx-3 mb-6" />

          <DrawerItem
            active={pathname === "/"}
            label="Home"
            icon={({ isActive }) => (
              <HomeOutline
                fill={
                  isActive
                    ? colors["--color-accent"]
                    : colors["--color-text-secondary"]
                }
              />
            )}
            onPress={() => {
              closeDrawer();

              if (pathname !== "/") {
                router.navigate("/");
              }
            }}
          />

          <DrawerItem
            icon={({ isActive }) => (
              <BarChartOutline
                fill="none"
                stroke={
                  isActive
                    ? colors["--color-accent"]
                    : colors["--color-text-secondary"]
                }
              />
            )}
            label="Statistics"
          />

          <DrawerItem
            icon={({ isActive }) => (
              <AntDesign
                name="calculator"
                size={22}
                color={
                  isActive
                    ? colors["--color-accent"]
                    : colors["--color-text-secondary"]
                }
              />
            )}
            label="Budgets"
          />

          <Separator className="my-3.5" />

          <DrawerItem
            icon={({ isActive }) => (
              <Feather
                name="settings"
                size={22}
                color={
                  isActive
                    ? colors["--color-accent"]
                    : colors["--color-text-secondary"]
                }
              />
            )}
            label="Settings"
          />

          <DrawerItem
            icon={({ isActive }) => (
              <Feather
                name="upload-cloud"
                size={22}
                color={
                  isActive
                    ? colors["--color-accent"]
                    : colors["--color-text-secondary"]
                }
              />
            )}
            label="Backup & Restore"
          />

          <Separator className="my-3.5" />

          <DrawerItem
            icon={({ isActive }) => (
              <MaterialCommunityIcons
                name="check-decagram-outline"
                size={24}
                color={
                  isActive
                    ? colors["--color-accent"]
                    : colors["--color-text-secondary"]
                }
              />
            )}
            label="Get premium"
          />

          <DrawerItem
            icon={({ isActive }) => (
              <Feather
                name="star"
                size={22}
                color={
                  isActive
                    ? colors["--color-accent"]
                    : colors["--color-text-secondary"]
                }
              />
            )}
            label="Rate this app"
          />

          <DrawerItem
            icon={({ isActive }) => (
              <MaterialCommunityIcons
                name="comment-alert-outline"
                size={24}
                color={
                  isActive
                    ? colors["--color-accent"]
                    : colors["--color-text-secondary"]
                }
              />
            )}
            label="Contact us"
          />

          <View className="flex-1 justify-end py-3.5">
            <CustomText className="font-[Rounded-Regular] text-xs text-center text-text-secondary">
              {Application.nativeApplicationVersion}
            </CustomText>
          </View>
        </View>
      </SafeAreaView>
    </CustomModal>
  );
};
