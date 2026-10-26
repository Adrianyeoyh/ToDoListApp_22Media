import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatDateTime, parseApiTimestamp } from "@/lib/format-date";
import type { ToDoList } from "@/services/utils/types";
import { router } from "expo-router";
import { Pressable } from "react-native";

type ToDoListMenuCardProps = {
  toDoList: ToDoList;
  onEdit: () => void;
};

export function ToDoListMenuCard({ toDoList, onEdit }: ToDoListMenuCardProps) {
  return (
    <Card>
      <Pressable
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

      <Pressable
        onPress={onEdit}
        hitSlop={8}
        className="absolute -right-3 -top-3 h-9 w-9 items-center justify-center rounded-full border border-border bg-white shadow-sm active:opacity-70"
      >
        <Text>✏️</Text>
      </Pressable>
    </Card>
  );
}
