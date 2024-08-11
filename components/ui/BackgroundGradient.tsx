import { LinearGradient } from "expo-linear-gradient"


const BackgroundGradient = () => {
  return (
    <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[
          "#73d1cc",
          "#ff8bd8",
         
          
        ]}
        className="absolute top-0 right-0 bottom-0 left-0"
      />
  )
}

export default BackgroundGradient