import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ASSET_KINDS, KIND_META, KIND_SHORT } from '@/features/cards/catalog';
import { Columns } from '@/features/cards/Columns';
import { useCards, type Column } from '@/features/cards/store';
import type { AssetKind } from '@/features/cards/types';
import { useTheme } from '@/theme/theme';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Button, Field, Screen, SectionHeader, Text } from '@/ui';

export default function MyCardScreen() {
  const { myCard, updateProfile, addEntry, removeEntry } = useCards();

  const [column, setColumn] = useState<Column>('needs');
  const [kind, setKind] = useState<AssetKind>('space');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [tags, setTags] = useState('');

  const canAdd = title.trim().length > 0 && tags.trim().length > 0;

  const submit = () => {
    if (!canAdd) return;

    addEntry(column, {
      kind,
      title: title.trim(),
      detail: detail.trim(),
      // Теги — общий словарь, поэтому приводим к нижнему регистру: «Fitness»
      // и «fitness» должны сходиться, а не считаться разными ключами.
      tags: tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0),
    });

    setTitle('');
    setDetail('');
    setTags('');
  };

  return (
    <Screen>
      <SectionHeader title="Моя карточка" subtitle="Её видят другие — и по ней идёт подбор" />

      <View style={styles.profile}>
        <Field label="Имя" value={myCard.name} onChangeText={(name) => updateProfile({ name })} />
        <Field label="Роль" value={myCard.role} onChangeText={(role) => updateProfile({ role })} />
        <Field label="Город" value={myCard.city} onChangeText={(city) => updateProfile({ city })} />
        <Field
          label="О себе"
          value={myCard.about}
          onChangeText={(about) => updateProfile({ about })}
          multiline
        />
      </View>

      <View style={styles.columns}>
        <Columns
          needs={myCard.needs}
          offers={myCard.offers}
          onRemoveNeed={(id) => removeEntry('needs', id)}
          onRemoveOffer={(id) => removeEntry('offers', id)}
        />
      </View>

      <View style={styles.form}>
        <SectionHeader title="Добавить строку" />

        <Choice
          options={[
            { value: 'needs', label: 'В требования' },
            { value: 'offers', label: 'В предложения' },
          ]}
          selected={column}
          onSelect={setColumn}
        />

        <View style={styles.kinds}>
          {ASSET_KINDS.map((item) => (
            <Chip
              key={item}
              label={KIND_SHORT[item]}
              selected={kind === item}
              onPress={() => setKind(item)}
            />
          ))}
        </View>

        <Text variant="captionSm" tone="faint">
          {column === 'needs' ? KIND_META[kind].needLabel : KIND_META[kind].offerLabel}
        </Text>

        <Field
          label="Суть"
          value={title}
          onChangeText={setTitle}
          placeholder="Площадка под встречи клуба"
        />
        <Field
          label="Условия"
          value={detail}
          onChangeText={setDetail}
          placeholder="Раз в две недели, 30–50 человек, вечер"
          multiline
        />
        <Field
          label="Теги через запятую"
          value={tags}
          onChangeText={setTags}
          placeholder="events, horeca"
        />

        <Text variant="captionSm" tone="muted">
          По тегам карточки и находят друг друга. Общий словарь: horeca, retail, fitness, it, saas,
          mobile, realestate, events, logistics, production, marketing, content, finance, hr, ops,
          consulting, franchise, export, beauty, education.
        </Text>

        <Button label="Добавить" onPress={submit} disabled={!canAdd} fullWidth />
      </View>
    </Screen>
  );
}

function Choice<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: readonly { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={styles.choice}>
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={selected === option.value}
          onPress={() => onSelect(option.value)}
        />
      ))}
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.ink : colors.surface,
          borderColor: selected ? colors.ink : colors.hairline,
        },
      ]}
    >
      <Text variant="captionSm" tone={selected ? 'onInk' : 'secondary'} uppercase>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profile: { gap: SPACING.lg },
  columns: { marginTop: SPACING.xl },
  form: { marginTop: SPACING.section, gap: SPACING.lg },
  choice: { flexDirection: 'row', gap: SPACING.sm },
  kinds: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
});
