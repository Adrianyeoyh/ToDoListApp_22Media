import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime, parseApiTimestamp } from "@/lib/format-date";
import type { ToDoList } from "@/services/utils/types";
import { router } from "expo-router";
import { Pressable } from "react-native";

type ToDoListMenuCardProps = {
  toDoList: ToDoList;
};

export function ToDoListMenuCard({ toDoList }: ToDoListMenuCardProps) {
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
    </Card>
  );
}
