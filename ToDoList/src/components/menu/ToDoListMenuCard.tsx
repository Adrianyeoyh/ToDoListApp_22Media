import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { formatDateTime, parseApiTimestamp } from "@/lib/format-date";
import type { ToDoList } from "@/services/utils/types";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

type ToDoListMenuCardProps = {
  toDoList: ToDoList;
  onEdit: () => void;
  isSelecting: boolean;
  isSelected: boolean;
  onToggleSelected: () => void;
};

export function ToDoListMenuCard({ toDoList, onEdit, isSelecting, isSelected, onToggleSelected }: ToDoListMenuCardProps) {
  return (
    <View className="flex-row items-center gap-3">
      {isSelecting && <Checkbox checked={isSelected} onCheckedChange={onToggleSelected} />}

      <Card className="flex-1">
        <Pressable
            disabled={isSelecting}
            onPress={() =>
              router.push({ pathname: '/[id]', params: { id: toDoList.id } })
            }
          >
        <CardHeader>
          <CardTitle className="font-bold">{toDoList.name}</CardTitle>
          <CardDescription>
            Last updated at:{" "}
            {formatDateTime(parseApiTimestamp(toDoList.updated_at))}
          </CardDescription>
        </CardHeader>
        </Pressable>

        {!isSelecting && (
          <Pressable
            onPress={onEdit}
            hitSlop={8}
            className="absolute -right-3 -top-3 h-9 w-9 items-center justify-center rounded-full border border-border bg-white shadow-sm active:opacity-70"
          >
            <Text>✏️</Text>
          </Pressable>
        )}
      </Card>
    </View>
  );
}
