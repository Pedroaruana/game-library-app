import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Biblioteca de Jogos" }} />
      <Stack.Screen name="add-game" options={{ title: "Adicionar Jogo" }} />
      <Stack.Screen name="game/[id]" options={{ title: "Detalhes" }} />
    </Stack>
  );
}
