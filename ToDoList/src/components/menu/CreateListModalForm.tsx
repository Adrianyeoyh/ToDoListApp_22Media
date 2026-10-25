import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { useErrorModal } from '@/components/feedback/ErrorModalProvider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { createToDoList } from '@/services/ToDoListService';
import { ApiError } from '@/services/utils/api';
import type { ToDoList } from '@/services/utils/types';

type CreateListModalFormProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: (toDoList: ToDoList) => void;
};


export default function CreateListModalForm({ visible, onClose, onCreated }: CreateListModalFormProps) {
  const { showError } = useErrorModal();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setNameError(null);
  };

  const handleCreate = async () => {
    try {
      const toDoList = await createToDoList(name.trim());
      resetForm();
      onCreated(toDoList);
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

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
    <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>New list</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            <Input value={name} onChangeText={setName} placeholder='My New To Do List' autoFocus />
            {nameError && <Text className="text-sm text-destructive">{nameError}</Text>}
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