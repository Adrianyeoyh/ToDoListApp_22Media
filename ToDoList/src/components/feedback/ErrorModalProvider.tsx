import { createContext, useContext, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { getErrorMessage } from '@/lib/get-error-message';

type ErrorModalContextValue = {
  showError: (caughtError: unknown, onRetry?: () => void) => void;
};

const ErrorModalContext = createContext<ErrorModalContextValue | null>(null);

export function ErrorModalProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<{ message: string; onRetry?: () => void } | null>(null);

  const showError = (caughtError: unknown, onRetry?: () => void) => {
    setError({ message: getErrorMessage(caughtError), onRetry });
  };

  const closeModal = () => {
    setError(null);
  };

  const retry = () => {
    closeModal();
    error?.onRetry?.();
  };

  return (
    <ErrorModalContext.Provider value={{ showError }}>
      {children}

      <Modal visible={error !== null} transparent animationType="fade" onRequestClose={closeModal}>
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>{error?.message}</Text>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Pressable onPress={closeModal} className="rounded-md px-4 py-2">
                <Text>Close</Text>
              </Pressable>
              {error?.onRetry && (
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
