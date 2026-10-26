import { View } from "react-native";
import { Text } from "@/components/ui/text";
import ToDoListMenu from "@/components/menu/ToDoListMenu";


export default function HomeScreen() {

  return (
    <View className="flex-1 bg-background p-6">
      <Text variant="h3">My Lists</Text>
      <ToDoListMenu/>
    </View>
  );
}
