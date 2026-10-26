import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Trash2 } from 'lucide-react-native';

import { useErrorModal } from '@/components/feedback/ErrorModalProvider';
import { Card, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Text } from '@/components/ui/text';
import { formatDateTime, parseApiTimestamp } from '@/lib/format-date';
import { cn } from '@/lib/utils';
import { updateToDo } from '@/services/ToDoService';
import { ApiError } from '@/services/utils/api';
import type { ToDo } from '@/services/utils/types';

type ToDoItemProps = {
  toDo: ToDo;
  onUpdated: (toDo: ToDo) => void;
  onDelete: (toDo: ToDo) => void;
};

export default function ToDoItem({ toDo, onUpdated, onDelete }: ToDoItemProps) {
  const { showError } = useErrorModal();
  const [isDone, setIsDone] = useState(toDo.is_done);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(toDo.description);

  const toggleDone = async (checked: boolean) => {
    setIsDone(checked);
    try {
      onUpdated(await updateToDo(toDo.id, { is_done: checked }));
    } catch (e) {
      setIsDone(!checked);
      if (e instanceof ApiError) {
        showError(e);
      } else {
        throw e;
      }
    }
  };

  const saveDescription = async () => {
    setIsEditing(false);
    const trimmed = description.trim();
    if (trimmed === '' || trimmed === toDo.description) {
      setDescription(toDo.description);
      return;
    }
    setDescription(trimmed);
    try {
      onUpdated(await updateToDo(toDo.id, { description: trimmed }));
    } catch (e) {
      setDescription(toDo.description);
      if (e instanceof ApiError) {
        showError(e);
      } else {
        throw e;
      }
    }
  };

  const renderDeleteAction = () => (
    <Pressable
      onPress={() => onDelete(toDo)}
      className="ml-3 w-20 items-center justify-center rounded-xl bg-red-600 active:opacity-80"
    >
      <Trash2 size={24} color="white" />
    </Pressable>
  );

  const descriptionClassName = cn('text-sm text-muted-foreground', isDone && 'line-through');

  return (
    <ReanimatedSwipeable
      renderRightActions={renderDeleteAction}
      onSwipeableOpen={() => onDelete(toDo)}
      rightThreshold={60}
      friction={1.5}
      overshootRight={false}
    >
      <Card className="gap-2 p-4">
        <View className="flex-row items-center gap-3">
          <Checkbox checked={isDone} onCheckedChange={toggleDone} />
          {isEditing ? (
            <TextInput
              value={description}
              onChangeText={setDescription}
              onBlur={saveDescription}
              autoFocus
              multiline
              submitBehavior="blurAndSubmit"
              className={cn('flex-1 p-0', descriptionClassName)}
              style={{ paddingVertical: 0, includeFontPadding: false }}
            />
          ) : (
            <Pressable onPress={() => setIsEditing(true)} className="flex-1">
              <CardDescription className={descriptionClassName}>{description}</CardDescription>
            </Pressable>
          )}
        </View>

        <View className="ml-[7px] flex-row items-end gap-2">
          <View className="mb-[7px] h-3 w-3 rounded-bl-md border-b border-l border-border" />
          <Text className="text-xs text-muted-foreground">
            Last updated {formatDateTime(parseApiTimestamp(toDo.updated_at))}
          </Text>
        </View>
      </Card>
    </ReanimatedSwipeable>
  );
}
