import { LinearGradient } from "expo-linear-gradient"


const BackgroundGradient = () => {
  return (
    <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[
          "rgba(255, 229, 110,0.25)",
          "rgba(219, 99, 227,0.25)",
          "rgba(255, 128, 146,0.25)",
        ]}
        className="absolute top-0 right-0 bottom-0 left-0"
      />
  )
}

export default BackgroundGradient