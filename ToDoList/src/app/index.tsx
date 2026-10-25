import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import type { ToDoList } from "@/services/utils/types";
import { getToDoLists } from "@/services/ToDoListService";
import { useErrorModal } from '@/components/feedback/ErrorModalProvider';

export default function HomeScreen() {
  const { showError } = useErrorModal();   // ← pulls showError out of the context

  const [toDoLists, setToDoLists] = useState<ToDoList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToDoLists = async () => {
      try {
        setIsLoading(true);
        const res: ToDoList[] = await getToDoLists();
        setToDoLists(res);
      } catch (e) {
        showError(e);
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
