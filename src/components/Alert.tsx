import { CustomModal } from "@/components/CustomModal";
import { Text, TouchableOpacity, View } from "react-native";
import { CustomText } from "@/components/CustomText";

interface AlertProps {
  isVisible: boolean;
  title: string;
  onRequestClose: () => void;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const Alert = ({
  title,
  onCancel = () => {},
  onSuccess = () => {},
  ...props
}: AlertProps) => {
  return (
    <CustomModal {...props}>
      <View
        className="bg-main-background dark:bg-card-background rounded-3xl"
        style={{
          minWidth: 220,
        }}
      >
        <CustomText className="font-[Rounded-Medium] text-text-secondary text-center p-5 text-xs">
          {title}
        </CustomText>

        <View className="flex-row border-t border-separator">
          <TouchableOpacity
            className="flex-[1] items-center p-4"
            onPress={onCancel}
          >
            <CustomText className="font-[Rounded-Medium] text-xs text-text-primary">
              CANCEL
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-[1] items-center p-4"
            onPress={onSuccess}
          >
            <CustomText className="font-[Rounded-Medium] text-xs text-accent">
              YES
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};
