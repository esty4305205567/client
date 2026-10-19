import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface CodeInputProps {
  /** ה-id של האריח הראשון, כדי ש-Label יפנה אליו */
  id: string;
  value: string;
  length: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  disabled?: boolean;
}

const clean = (text: string) => text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

// קוד משחק כאריחים נפרדים, באותו מראה של חדר ההמתנה: מעבר אוטומטי לאריח הבא, Backspace חוזר, הדבקה ממלאת את כולם
export function CodeInput({ id, value, length, onChange, onBlur, invalid, disabled }: CodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length }, (_, index) => value[index] ?? '');

  function focusTile(index: number) {
    const target = Math.min(Math.max(index, 0), length - 1);
    refs.current[target]?.focus();
    refs.current[target]?.select();
  }

  function fillFrom(index: number, text: string) {
    const next = chars.slice();
    const letters = clean(text).slice(0, length - index);
    letters.split('').forEach((char, offset) => {
      next[index + offset] = char;
    });
    onChange(next.join(''));
    focusTile(index + letters.length);
  }

  function onInput(index: number, text: string) {
    const typed = clean(text);
    if (typed === '') {
      const next = chars.slice();
      next[index] = '';
      onChange(next.join(''));
      return;
    }
    // אריח שכבר מלא והוקלד בו תו נוסף: התו החדש הוא האחרון
    fillFrom(index, typed.length === 2 && chars[index] ? typed.slice(-1) : typed);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === 'Backspace' && chars[index] === '' && index > 0) {
      event.preventDefault();
      const next = chars.slice();
      next[index - 1] = '';
      onChange(next.join(''));
      focusTile(index - 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTile(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTile(index + 1);
    }
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>, index: number) {
    event.preventDefault();
    fillFrom(index, event.clipboardData.getData('text'));
  }

  return (
    <div className="flex gap-2 sm:gap-3" dir="ltr" role="group" aria-label="קוד המשחק">
      {chars.map((char, index) => (
        <input
          key={index}
          id={index === 0 ? id : `${id}-${index + 1}`}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={char}
          disabled={disabled}
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={2}
          aria-label={`תו ${index + 1} מתוך ${length}`}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          onChange={(event) => onInput(index, event.target.value)}
          onKeyDown={(event) => onKeyDown(event, index)}
          onPaste={(event) => onPaste(event, index)}
          onFocus={(event) => event.target.select()}
          onBlur={index === length - 1 ? onBlur : undefined}
          className={cn(
            'h-14 w-11 rounded-lg border bg-background text-center font-mono text-3xl font-bold uppercase text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:h-16 sm:w-14 sm:text-4xl',
            invalid ? 'border-destructive' : char ? 'border-primary/60 text-primary' : 'border-input'
          )}
        />
      ))}
    </div>
  );
}
