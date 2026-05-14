import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../firebase";

export default function AddGame() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const user = auth.currentUser;

  const CLOUD_NAME = "dmnzyrm1k";
  const UPLOAD_PRESET = "unsigned_upload";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async () => {
    if (!image) return "";

    const data = new FormData();

    data.append("file", {
      uri: image,
      type: "image/jpeg",
      name: "game.jpg",
    } as any);

    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      },
    );

    const file = await res.json();

    return file.secure_url;
  };

  const handleSave = async () => {
    if (!name) return;

    if (!user) {
      Alert.alert("Erro", "Usuário não logado");
      return;
    }

    try {
      setUploading(true);

      const imageUrl = await uploadToCloudinary();

      await addDoc(collection(db, "games"), {
        name,
        coverUrl: imageUrl,
        favorite: false,
        createdAt: Date.now(),
        userId: user.uid,
        userEmail: user.email,
      });

      setName("");
      setImage(null);

      router.push("/");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao salvar jogo");
    } finally {
      setUploading(false);
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
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        ➕ Adicionar Jogo
      </Text>

      <TextInput
        placeholder="Nome do jogo"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />

      {/* BOTÃO IMAGEM */}
      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: "#444",
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          📷 Escolher imagem
        </Text>
      </TouchableOpacity>

      {/* PREVIEW */}
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: "100%",
            height: 180,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />
      )}

      {/* SALVAR */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={uploading}
        style={{
          backgroundColor: uploading ? "#999" : "green",
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
          {uploading ? "Enviando..." : "💾 Salvar jogo"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
