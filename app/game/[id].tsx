import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function GameDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🎮 Jogo ID: {id}</Text>
    </View>
  );
}
