import * as React from 'react';
import type { ToastProps } from '@/components/ui/Toast';

// מבוסס על use-toast של shadcn/ui. אפשר לקרוא ל-toast() גם מחוץ לרכיבי React
// (למשל מ-QueryCache), ולכן המצב חי במודול ולא ב-Context.

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY_MS = 300; // זמן לאנימציית היציאה
const AUTO_DISMISS_MS: Record<ToastVariant, number> = {
  success: 1500,
  default: 2500,
  destructive: 3500,
  conflict: 3500,
};

export type ToastVariant = 'default' | 'success' | 'destructive' | 'conflict';

export interface ToasterToast extends Omit<ToastProps, 'title'> {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
}

type ToastInput = Omit<ToasterToast, 'id'> & { durationMs?: number };

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

let counter = 0;
function nextId(): string {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  return String(counter);
}

const removeTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleRemoval(toastId: string): void {
  if (removeTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    removeTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY_MS);
  removeTimeouts.set(toastId, timeout);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case 'UPDATE_TOAST':
      return {
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };
    case 'DISMISS_TOAST': {
      const { toastId } = action;
      if (toastId) {
        scheduleRemoval(toastId);
      } else {
        state.toasts.forEach((t) => scheduleRemoval(t.id));
      }
      return {
        toasts: state.toasts.map((t) =>
          toastId === undefined || t.id === toastId ? { ...t, open: false } : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      return {
        toasts: action.toastId === undefined ? [] : state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action): void {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function toast(input: ToastInput) {
  const id = nextId();

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });
  const update = (next: Omit<ToasterToast, 'id'>) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...next, id } });

  const { durationMs, ...toastProps } = input;
  const autoDismissMs = durationMs ?? AUTO_DISMISS_MS[input.variant ?? 'default'];

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...toastProps,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });

  setTimeout(dismiss, autoDismissMs);

  return { id, dismiss, update };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
