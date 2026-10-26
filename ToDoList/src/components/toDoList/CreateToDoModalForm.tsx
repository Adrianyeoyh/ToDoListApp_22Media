import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useErrorModal } from '@/components/feedback/ErrorModalProvider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { ApiError } from '@/services/utils/api';
import type { ToDo } from '@/services/utils/types';
import { createToDo } from '@/services/ToDoService';

type CreateToDoModalFormProps = {
  toDoListId: string;
  visible: boolean;
  onClose: () => void;
  onCreated: (toDo: ToDo) => void;
};


export default function CreateToDoModalForm({ toDoListId, visible, onClose, onCreated }: CreateToDoModalFormProps) {
  const { showError } = useErrorModal();
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const resetForm = () => {
    setDescription('');
    setDescriptionError(null);
  };

  const handleCreate = async () => {
    try {
      const toDo = await createToDo({ to_do_list_id: toDoListId, description: description.trim() });
      resetForm();
      onCreated(toDo);
    } catch (e) {
      if (e instanceof ApiError && e.status === 422) {
        setDescriptionError(e.body.errors?.description?.[0] ?? e.message);
      } else if (e instanceof ApiError) {
        showError(e);
      } else {
        throw e;
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
    <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>New To-Do</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            <Input value={description} onChangeText={setDescription} placeholder="What needs doing?" autoFocus />
            {descriptionError && <Text className="text-sm text-destructive">{descriptionError}</Text>}
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Pressable onPress={handleCancel} className="rounded-md px-4 py-2">
              <Text>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleCreate} className="rounded-md bg-primary px-4 py-2 active:opacity-80">
              <Text className="text-primary-foreground">Create</Text>
            </Pressable>
          </CardFooter>
        </Card>
      </View>
    </Modal>
  );
}