import { File, Paths } from 'expo-file-system';

export function readJson<T>(fileName: string, fallback: T): T {
  const file = new File(Paths.document, fileName);
  if (!file.exists) {
    return fallback;
  }
  try {
    return JSON.parse(file.textSync()) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(fileName: string, value: unknown) {
  const file = new File(Paths.document, fileName);
  if (!file.exists) {
    file.create();
  }
  file.write(JSON.stringify(value));
}
