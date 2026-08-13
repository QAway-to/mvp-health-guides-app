import { useEffect, useRef, useState } from 'react';
import { AppState, View } from 'react-native';

import { SPACING } from '@/theme/tokens';
import { Button, ProgressBar, Text } from '@/ui';

function format(seconds: number): string {
  const safe = Math.max(0, Math.ceil(seconds));
  const mm = Math.floor(safe / 60);
  const ss = safe % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

/**
 * Таймер шага.
 *
 * Отсчёт ведётся от отметки времени, а не вычитанием тика: JS-таймеры на
 * свёрнутом приложении не идут, и счётчик «минус секунда за тик» отстал бы
 * ровно на то время, что человек бежал с погашенным экраном.
 */
export function StepTimer({ durationSec, onDone }: { durationSec: number; onDone?: () => void }) {
  const [remaining, setRemaining] = useState(durationSec);
  const [isRunning, setIsRunning] = useState(false);
  const endsAtRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    setRemaining(durationSec);
    setIsRunning(false);
    endsAtRef.current = null;
    doneRef.current = false;
  }, [durationSec]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const tick = () => {
      const endsAt = endsAtRef.current;
      if (endsAt === null) {
        return;
      }
      const left = (endsAt - Date.now()) / 1000;
      setRemaining(Math.max(0, left));

      if (left <= 0 && !doneRef.current) {
        doneRef.current = true;
        setIsRunning(false);
        onDone?.();
      }
    };

    const interval = setInterval(tick, 250);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        tick();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [isRunning, onDone]);

  const start = () => {
    endsAtRef.current = Date.now() + remaining * 1000;
    doneRef.current = false;
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    endsAtRef.current = null;
  };

  const reset = () => {
    pause();
    setRemaining(durationSec);
    doneRef.current = false;
  };

  const elapsed = durationSec > 0 ? 1 - remaining / durationSec : 1;

  return (
    <View style={{ gap: SPACING.md }}>
      <Text variant="displayXl" center>
        {format(remaining)}
      </Text>
      <ProgressBar value={elapsed} label="Прогресс шага" />
      <View style={{ flexDirection: 'row', gap: SPACING.sm, justifyContent: 'center' }}>
        <Button
          label={isRunning ? 'Пауза' : remaining === durationSec ? 'Запустить' : 'Продолжить'}
          variant="secondary"
          onPress={isRunning ? pause : start}
        />
        {remaining !== durationSec ? (
          <Button label="Сброс" variant="outline" onPress={reset} />
        ) : null}
      </View>
    </View>
  );
}
