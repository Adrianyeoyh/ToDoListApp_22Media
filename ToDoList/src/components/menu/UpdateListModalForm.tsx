import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { useErrorModal } from '@/components/feedback/ErrorModalProvider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { updateToDoList } from '@/repositories/ToDoListRepository';
import { ApiError } from '@/services/utils/api';
import type { ToDoList } from '@/services/utils/types';

type UpdateListModalFormProps = {
  toDoList: ToDoList;
  onClose: () => void;
  onUpdated: (toDoList: ToDoList) => void;
};

export default function UpdateListModalForm({ toDoList, onClose, onUpdated }: UpdateListModalFormProps) {
  const { showError } = useErrorModal();
  const [name, setName] = useState(toDoList.name);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      const updated = await updateToDoList(String(toDoList.id), name.trim());
      onUpdated(updated);
    } catch (e) {
      if (e instanceof ApiError && e.status === 422) {
        setNameError(e.body.errors?.name?.[0] ?? e.message);
      } else if (e instanceof ApiError) {
        showError(e);
      } else {
        throw e;
      }
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Rename list</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            <Input value={name} onChangeText={setName} placeholder="List name" autoFocus selectTextOnFocus />
            {nameError && <Text className="text-sm text-destructive">{nameError}</Text>}
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Pressable onPress={onClose} className="rounded-md px-4 py-2">
              <Text>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleSave} className="rounded-md bg-primary px-4 py-2 active:opacity-80">
              <Text className="text-primary-foreground">Save</Text>
            </Pressable>
          </CardFooter>
        </Card>
      </View>
    </Modal>
  );
}
