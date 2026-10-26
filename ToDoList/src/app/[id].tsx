import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useErrorModal } from '@/components/feedback/ErrorModalProvider';
import { ToDo, ToDoList } from '@/services/utils/types';
import { getToDoList } from '@/services/ToDoListService';
import { ApiError } from '@/services/utils/api';
import { Text } from '@/components/ui/text';
import ToDoItem from '@/components/toDoList/toDo';
import CreateToDoModalForm from '@/components/toDoList/CreateToDoModalForm';

export default function ToDoListScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { showError } = useErrorModal();   
  
    const [toDoList, setToDoList] = useState<ToDoList | null>(null);
    const [toDos, setToDos] = useState<ToDo[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState(false);   
    const [reloadCount, setReloadCount] = useState(0);
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);  

    
    const refreshToDoList = () => {
      setIsRefreshing(true);
      setReloadCount((count) => count + 1);
    };
  
    useEffect(() => {
      const loadToDoList = async () => {
        try {
          setIsLoading(true);
          const res: ToDoList = await getToDoList(id);
          setToDoList(res);
          setToDos(res.todos);
        } catch (e) {
          if (e instanceof ApiError) {
          showError(e, refreshToDoList);}
          else throw e;
        } finally {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      };
      loadToDoList();
    }, [id, showError, reloadCount]);
    

    const replaceToDo = (updated: ToDo) => {
      setToDos((current) => current.map((toDo) => (toDo.id === updated.id ? updated : toDo)));
    };

    if (isLoading) {
      return <ActivityIndicator size="large" className="mt-8" />;
    }
  return (
      <View className="flex-1 bg-background p-6">        
        <View className="flex-1">
          <Text variant="h3">{toDoList?.name}</Text>
          <FlatList data={toDos}
              keyExtractor={(toDo) => String(toDo.id)}
              renderItem={({ item }) => <ToDoItem toDo={item} onUpdated={replaceToDo} />}
              contentContainerClassName="gap-3 pt-4"
              ListEmptyComponent={<Text variant="muted">No To-Dos Yet.</Text>}
              refreshing={isRefreshing}
              onRefresh={refreshToDoList} />

          <Pressable onPress={() => setIsCreateOpen(true)}
          className="absolute bottom-6 right-2 h-16 w-16 items-center justify-center rounded-full border border-border bg-white shadow-lg active:opacity-80"
          >
            <Plus size={28} color="#111" />
          </Pressable>

          <CreateToDoModalForm
                  toDoListId={id}
                  visible={isCreateOpen}
                  onClose={() => setIsCreateOpen(false)}
                  onCreated={(toDo) => {
                    setToDos((current) => [...current, toDo]);
                    setIsCreateOpen(false);
                  }}
          />
        </View>
    </View>
  );
}