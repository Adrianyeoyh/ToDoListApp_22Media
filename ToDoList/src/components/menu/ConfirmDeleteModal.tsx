import { Modal, Pressable, View } from 'react-native';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

type ConfirmDeleteModalProps = {
  visible: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({ visible, count, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Confirm Delete?</CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="muted">
              {count === 1 ? 'This list and its to-dos' : `These ${count} lists and their to-dos`} will be deleted.
            </Text>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Pressable onPress={onCancel} className="rounded-md px-4 py-2">
              <Text>Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} className="rounded-md px-4 py-2 active:opacity-70">
              <Text className="font-semibold text-destructive">Delete</Text>
            </Pressable>
          </CardFooter>
        </Card>
      </View>
    </Modal>
  );
}
