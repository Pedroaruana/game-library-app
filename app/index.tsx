import { useRouter } from "expo-router";

import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

import { signOut } from "firebase/auth";

import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    FlatList,
    Image,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { auth, db } from "../firebase";

export default function Home() {
  const router = useRouter();

  const [games, setGames] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // 🔐 Auth listener (proteção)
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login" as any);
      }

      setUser(user);
      setLoading(false);
    });

    return unsubscribeAuth;
  }, []);

  // 🎮 Buscar jogos do usuário
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "games"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setGames(list);
    });

    return () => unsubscribe();
  }, [user]);

  // 🗑 deletar jogo
  const deleteGame = async (id: string) => {
    try {
      await deleteDoc(doc(db, "games", id));
    } catch (error) {
      console.log(error);
    }
  };

  // 🚪 logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login" as any);
    } catch (error) {
      console.log(error);
    }
  };

  // ⏳ loading
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: darkMode ? "#111" : "#fff",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: darkMode ? "#111" : "#fff",
      }}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          🎮 Jogos
        </Text>

        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* USER */}
      <Text
        style={{
          marginBottom: 10,
          color: darkMode ? "#ccc" : "#555",
        }}
      >
        Usuário: {user?.email}
      </Text>

      {/* LOGOUT */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#222",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>🚪 Logout</Text>
      </TouchableOpacity>

      {/* ADD GAME */}
      <TouchableOpacity
        onPress={() => router.push("/add-game" as any)}
        style={{
          backgroundColor: "green",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          ➕ Adicionar Jogo
        </Text>
      </TouchableOpacity>

      {/* LISTA */}
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: darkMode ? "#222" : "#eee",
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            {/* CAPA */}
            {item.coverUrl ? (
              <Image
                source={{ uri: item.coverUrl }}
                style={{
                  width: "100%",
                  height: 150,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
            ) : null}

            {/* NOME + FAVORITO */}
            <TouchableOpacity
              onPress={() =>
                updateDoc(doc(db, "games", item.id), {
                  favorite: !item.favorite,
                })
              }
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: darkMode ? "#fff" : "#000",
                }}
              >
                {item.favorite ? "❤️ " : "🤍 "}
                {item.name}
              </Text>
            </TouchableOpacity>

            {/* DELETE */}
            <TouchableOpacity
              onPress={() => deleteGame(item.id)}
              style={{
                backgroundColor: "red",
                padding: 8,
                borderRadius: 6,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Excluir
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
