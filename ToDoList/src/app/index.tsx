import { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import ToDoListMenu from "@/components/menu/ToDoListMenu";


export default function HomeScreen() {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelecting = () => {
    setIsSelecting((current) => !current);
    setSelectedIds([]);
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((selectedId) => selectedId !== id) : [...ids, id]));
  };

  const exitSelecting = () => {
    setIsSelecting(false);
    setSelectedIds([]);
  };

  return (
    <View className="flex-1 bg-background p-6">
      <View className="flex-row items-center justify-between">
        <Text variant="h3">My Lists</Text>
        <Pressable onPress={toggleSelecting} hitSlop={8} className="active:opacity-60">
          <Text className="font-semibold text-primary">{isSelecting ? "Done" : "Select"}</Text>
        </Pressable>
      </View>
      <ToDoListMenu
        isSelecting={isSelecting}
        selectedIds={selectedIds}
        onToggleSelected={toggleSelected}
        onExitSelecting={exitSelecting}
      />
    </View>
  );
}
