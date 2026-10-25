import { useErrorModal } from "@/components/feedback/ErrorModalProvider";
import { ToDoListMenuCard } from "@/components/menu/ToDoListMenuCard";
import { useState, useEffect } from "react";
import { getToDoLists } from "@/services/ToDoListService";
import { View, ActivityIndicator, FlatList, Pressable } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import type { ToDoList } from '@/services/utils/types';
import { ApiError } from "@/services/utils/api";
import CreateListModalForm from "./CreateListModalForm";


export default function ToDoListMenu() {
  const { showError } = useErrorModal();   

  const [toDoLists, setToDoLists] = useState<ToDoList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);   
  const [reloadCount, setReloadCount] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);   // ← new

  const refreshToDoLists = () => {
    setIsRefreshing(true);
    setReloadCount((count) => count + 1);
  };

  useEffect(() => {
    const loadToDoLists = async () => {
      try {
        setIsLoading(true);
        const res: ToDoList[] = await getToDoLists();
        setToDoLists(res);
      } catch (e) {
        if (e instanceof ApiError) {
        showError(e, refreshToDoLists);}
        else throw e;
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };
    loadToDoLists();
  }, [showError, reloadCount]);
  


  if (isLoading) {
    return <ActivityIndicator size="large" className="mt-8" />;
  }

  return (
    <View className="flex-1">
    <FlatList
      data={toDoLists}
      keyExtractor={(toDoList) => String(toDoList.id)}
      renderItem={({ item }) => <ToDoListMenuCard toDoList={item} />}
      contentContainerClassName="gap-3 pt-4"
      ListEmptyComponent={<Text variant="muted">No lists yet.</Text>}
      refreshing={isRefreshing}
      onRefresh={refreshToDoLists}
    />
     <Pressable
        onPress={() => setIsCreateOpen(true)}
        className="absolute bottom-6 right-2 h-16 w-16 items-center justify-center rounded-full border border-border bg-white shadow-lg active:opacity-80"
      >
        <Image
          source={require('../../../assets/icons/task-list-icon-preview.svg')}
          style={{ width: 28, height: 28 }}
        />
      </Pressable>

      <CreateListModalForm
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(toDoList) => {
          setToDoLists((lists) => [toDoList, ...lists]);
          setIsCreateOpen(false);
        }}
      />
    </View>
  );

}