import type { Db } from 'mongodb';

import { getKarmaCollection } from '../db';

export type KarmaAgg = {
  readonly _id: string;
  readonly from: readonly string[];
  readonly value: number;
};

const karmaAggregateGroup = {
  $group: { _id: '$to', from: { $push: '$from' }, value: { $sum: '$value' } },
} as const;

export const getKarmaForMember = async (memberId: string, db: Db) => {
  const karmaCollection = getKarmaCollection(db);

  const [agg] = await karmaCollection
    .aggregate<KarmaAgg | undefined>([{ $match: { to: memberId } }, karmaAggregateGroup])
    .toArray();
  return agg;
};

export const getKarmaForMembers = async (db: Db) => {
  const karmaCollection = getKarmaCollection(db);

  const agg = await karmaCollection
    .aggregate<KarmaAgg | undefined>([karmaAggregateGroup])
    .sort({ value: -1 })
    .limit(10)
    .toArray();
  return agg;
};

export const getEmojiForKarmaValue = (value: number) => {
  const adjustedValue = Math.floor(Math.sqrt(value + 1) - 1);
  const idx = Math.min(karmaEmojis.length, adjustedValue);
  return karmaEmojis[idx];
};
const karmaEmojis = [
  '👋',
  '👍',
  '👌',
  '💪',
  '🎖',
  '🥉',
  '🥈',
  '🥇',
  '🏅',
  '🙌',
  '🥰',
  '😍',
] as const;
