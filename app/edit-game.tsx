import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../firebase";

export default function EditGame() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      const gameRef = doc(db, "games", String(id));
      const gameSnap = await getDoc(gameRef);

      if (gameSnap.exists()) {
        setName(gameSnap.data().name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "games", String(id)), {
        name,
      });

      router.push("/" as any);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 22,
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        ✏ Editar Jogo
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nome do jogo"
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        onPress={handleUpdate}
        style={{
          backgroundColor: "blue",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Salvar Alterações
        </Text>
      </TouchableOpacity>
    </View>
  );
}
