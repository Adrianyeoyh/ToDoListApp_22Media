import { useState } from 'react';
import { View } from 'react-native';

import { useErrorModal } from '@/components/feedback/ErrorModalProvider';
import { Checkbox } from '@/components/ui/checkbox';
import { Text } from '@/components/ui/text';
import { updateToDo } from '@/services/ToDoService';
import { ApiError } from '@/services/utils/api';
import type { ToDo } from '@/services/utils/types';

type ToDoItemProps = {
  toDo: ToDo;
};

export default function ToDoItem({ toDo }: ToDoItemProps) {
  const { showError } = useErrorModal();
  const [isDone, setIsDone] = useState(toDo.is_done);

  const toggleDone = async (checked: boolean) => {
    setIsDone(checked);                                
    try {
      await updateToDo(toDo.to_do_list_id, { is_done: checked});
    } 
    catch (e) {
        setIsDone(!checked);                            
        if (e instanceof ApiError) {
            showError(e);
        } else {
            throw e;
        }
        }
    };

  return (
    <View className="flex-row items-center gap-3">
      <Checkbox checked={isDone} onCheckedChange={toggleDone} />
      <Text className={isDone ? 'text-muted-foreground line-through' : ''}>{toDo.description}</Text>
    </View>
  );
}