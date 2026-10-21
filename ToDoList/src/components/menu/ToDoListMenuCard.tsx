import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime, parseApiTimestamp } from "@/lib/format-date";
import type { ToDoList } from "@/services/utils/types";

type ToDoListMenuCardProps = {
  toDoList: ToDoList;
};

export function ToDoListMenuCard({ toDoList }: ToDoListMenuCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">{toDoList.name}</CardTitle>
        <CardDescription>
          Last updated at:{" "}
          {formatDateTime(parseApiTimestamp(toDoList.updated_at))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
