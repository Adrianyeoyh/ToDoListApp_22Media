import { createContext, useContext, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { ApiError } from '@/services/utils/api';

type ErrorModalContextValue = {
  showError: (error: ApiError, onRetry?: () => void) => void;};

const ErrorModalContext = createContext<ErrorModalContextValue | null>(null);

export function ErrorModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<{ error: ApiError; onRetry?: () => void } | null>(null);

  const showError = (error: ApiError, onRetry?: () => void) => {
    // Not reaching the server is not an error: the app carries on with local data and the offline banner shows instead.
    if (error.status === 0) {
      return;
    }
    setModal({ error, onRetry });
  };

  const closeModal = () => {
    setModal(null);
  };

  const retry = () => {
    closeModal();
    modal?.onRetry?.();
  };

  return (
    <ErrorModalContext.Provider value={{ showError }}>
      {children}

      <Modal visible={modal !== null} transparent animationType="fade" onRequestClose={closeModal}>
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>{modal?.error.message}</Text>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Pressable onPress={closeModal} className="rounded-md px-4 py-2">
                <Text>Close</Text>
              </Pressable>
              {modal?.onRetry && (
                <Pressable onPress={retry} className="rounded-md bg-primary px-4 py-2">
                  <Text className="text-primary-foreground">Try again</Text>
                </Pressable>
              )}
            </CardFooter>
          </Card>
        </View>
      </Modal>
    </ErrorModalContext.Provider>
  );
}

export function useErrorModal() {
  const context = useContext(ErrorModalContext);

  if (context === null) {
    throw new Error('useErrorModal must be used inside ErrorModalProvider');
  }

  return context;
}
