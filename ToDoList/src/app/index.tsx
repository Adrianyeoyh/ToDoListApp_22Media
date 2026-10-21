import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import type { ToDoList } from "@/services/utils/types";
import { getToDoLists } from "@/services/ToDoListService";
import { ApiError } from "@/services/utils/api";
import { getErrorMessage } from "@/lib/get-error-message";

export default function HomeScreen() {
  const [toDoLists, setToDoLists] = useState<ToDoList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadToDoLists = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const res: ToDoList[] = await getToDoLists();
        setToDoLists(res);
      } catch (e) {
        setErrorMessage(getErrorMessage(e))
      } finally {
        setIsLoading(false);
      }
    };
    loadToDoLists();
  }, []);

  return (
    <View className="flex-1 bg-background p-4">
      <Text variant="h3">My Lists</Text>
      {/* <Text variant="muted">{toDoLists.length} lists, loading: {String(isLoading)}, error: {errorMessage ?? 'none'}</Text> */}
    </View>
  );
}
