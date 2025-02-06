import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from '@/contexts/auth';
import { TextStyles } from "@/theme";

const ProfileMain = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white, padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{  marginTop: 4, ...TextStyles.h2 }}>Настройки</Text>
        <TouchableOpacity
          style={{
            width: 80,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.grayBg,
            borderRadius: 15,
          }}
          onPress={handleLogout}
        >
          <Ionicons name="exit-outline" size={18} color={Colors.black} />
        </TouchableOpacity>
      </View>
{/*блок с настройками*/}
      <View style={{ marginTop: 40, gap: 8 }}>
        <TouchableOpacity
          onPress={() => router.push("/profile/edit")}
          style={{
            backgroundColor: Colors.grayBg,
            borderRadius: 25,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <View>
            <Text style={{ ...TextStyles.h2 }}>Мой профиль</Text>
            <Text
              style={{
                ...TextStyles.text,
                color: Colors.grayText,
                marginTop: 8,
              }}
            >
              Редактировать информацию профиля
            </Text>
          </View>
          <Ionicons
            name="arrow-forward-outline"
            size={16}
            color={Colors.black}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/profile/mykids")}
          style={{
            backgroundColor: Colors.grayBg,
            borderRadius: 25,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <View>
            <Text style={{...TextStyles.h2 }}>Дети</Text>
            <Text
              style={{
                ...TextStyles.text,
                color: Colors.grayText,
                marginTop: 8,
              }}
            >
              Добавить, изменить информацию о детях
            </Text>
          </View>
          <Ionicons
            name="arrow-forward-outline"
            size={16}
            color={Colors.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/profile/tickets")}
          style={{
            backgroundColor: Colors.grayBg,
            borderRadius: 25,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <View>
            <Text style={{ ...TextStyles.h2}}>Купленные билеты</Text>
            <Text
              style={{
                ...TextStyles.text,
                color: Colors.grayText,
                marginTop: 8,
              }}
            >
              История купленных билетов
            </Text>
          </View>
          <Ionicons
            name="arrow-forward-outline"
            size={16}
            color={Colors.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/profile/cards")}
          style={{
            backgroundColor: Colors.grayBg,
            borderRadius: 25,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <View>
            <Text style={{ ...TextStyles.h2 }}>Карты лояльности</Text>
            <Text
              style={{
                ...TextStyles.text,
                color: Colors.grayText,
                marginTop: 8,
              }}
            >
              Mr. Grek, Троя Парк
            </Text>
          </View>
          <Ionicons
            name="arrow-forward-outline"
            size={16}
            color={Colors.black}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileMain;

const styles = StyleSheet.create({});
