// app/item/[id].tsx
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useErrorModal } from '@/components/feedback/ErrorModalProvider';
import { ToDo, ToDoList } from '@/services/utils/types';
import { getToDoList } from '@/services/ToDoListService';
import { ApiError } from '@/services/utils/api';

export default function ToDoListScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { showError } = useErrorModal();   
  
    const [toDoList, setToDoList] = useState<ToDoList | null>(null);
    const [toDos, setToDos] = useState<ToDo[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState(false);   
    const [reloadCount, setReloadCount] = useState(0);
    
    const refreshToDoLists = () => {
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
          showError(e, refreshToDoLists);}
          else throw e;
        } finally {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      };
      loadToDoList();
    }, [id, showError, reloadCount]);
    
  
  
    if (isLoading) {
      return <ActivityIndicator size="large" className="mt-8" />;
    }
  return (
    <View>
        <Text>{toDoList?.name}</Text>
        
      
    </View>
  );
}