import { useErrorModal } from "@/components/feedback/ErrorModalProvider";
import { ToDoListMenuCard } from "@/components/menu/ToDoListMenuCard";
import { useState, useEffect } from "react";
import { deleteToDoList, getToDoLists } from "@/repositories/ToDoListRepository";
import { useSyncStatus } from "@/hooks/use-sync-status";
import { View, ActivityIndicator, FlatList, Pressable } from "react-native";
import { Image } from "expo-image";
import { Trash2 } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import type { ToDoList } from '@/services/utils/types';
import { ApiError } from "@/services/utils/api";
import CreateListModalForm from "./CreateListModalForm";
import UpdateListModalForm from "./UpdateListModalForm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type ToDoListMenuProps = {
  isSelecting: boolean;
  selectedIds: number[];
  onToggleSelected: (id: number) => void;
  onExitSelecting: () => void;
};

export default function ToDoListMenu({ isSelecting, selectedIds, onToggleSelected, onExitSelecting }: ToDoListMenuProps) {
  const { showError } = useErrorModal();
  const { syncVersion } = useSyncStatus();

  const [toDoLists, setToDoLists] = useState<ToDoList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);  
  const [editingToDoList, setEditingToDoList] = useState<ToDoList | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

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
  }, [showError, reloadCount, syncVersion]);

  const deleteSelected = async () => {
    setIsConfirmDeleteOpen(false);

    const results = await Promise.allSettled(selectedIds.map((id) => deleteToDoList(String(id))));

    const deletedIds = selectedIds.filter((_, index) => {
      const result = results[index];
      return result.status === 'fulfilled' || (result.reason instanceof ApiError && result.reason.status === 404);
    });
    setToDoLists((lists) => lists.filter((list) => !deletedIds.includes(list.id)));
    onExitSelecting();

    const failure = results.find(
      (result): result is PromiseRejectedResult =>
        result.status === 'rejected' && !(result.reason instanceof ApiError && result.reason.status === 404),
    );
    if (failure) {
      if (failure.reason instanceof ApiError) {
        showError(failure.reason);
      } else {
        throw failure.reason;
      }
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" className="mt-8" />;
  }

  return (
    <View className="flex-1">
    <FlatList
      data={toDoLists}
      keyExtractor={(toDoList) => String(toDoList.id)}
      renderItem={({ item }) => (
        <ToDoListMenuCard
          toDoList={item}
          onEdit={() => setEditingToDoList(item)}
          isSelecting={isSelecting}
          isSelected={selectedIds.includes(item.id)}
          onToggleSelected={() => onToggleSelected(item.id)}
        />
      )}
      extraData={[isSelecting, selectedIds]}
      contentContainerClassName="gap-5 px-3 pt-5 pb-28"
      ListEmptyComponent={<Text variant="muted">No lists yet.</Text>}
      refreshing={isRefreshing}
      onRefresh={refreshToDoLists}
    />

    {isSelecting ? (
      <Pressable
        onPress={() => setIsConfirmDeleteOpen(true)}
        disabled={selectedIds.length === 0}
        className={`absolute bottom-6 right-2 h-16 w-16 items-center justify-center rounded-full border border-border bg-white shadow-lg active:opacity-80 ${selectedIds.length === 0 ? 'opacity-40' : ''}`}
      >
        <Trash2 size={28} color="#dc2626" />
      </Pressable>
    ) : (
     <Pressable
        onPress={() => setIsCreateOpen(true)}
        className="absolute bottom-6 right-2 h-16 w-16 items-center justify-center rounded-full border border-border bg-white shadow-lg active:opacity-80"
      >
        <Image
          source={require('../../../assets/icons/task-list-icon-preview.svg')}
          style={{ width: 28, height: 28 }}
        />
     </Pressable>
    )}

      <CreateListModalForm
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(toDoList) => {
          setToDoLists((lists) => [toDoList, ...lists]);
          setIsCreateOpen(false);
        }}
      />

      {editingToDoList && (
        <UpdateListModalForm
          key={editingToDoList.id}
          toDoList={editingToDoList}
          onClose={() => setEditingToDoList(null)}
          onUpdated={(updated) => {
            setToDoLists((lists) => lists.map((list) => (list.id === updated.id ? updated : list)));
            setEditingToDoList(null);
          }}
        />
      )}

      <ConfirmDeleteModal
        visible={isConfirmDeleteOpen}
        count={selectedIds.length}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        onConfirm={deleteSelected}
      />
    </View>
  );

}
