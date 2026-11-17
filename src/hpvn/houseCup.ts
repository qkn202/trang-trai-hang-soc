// HPVN: House points are the server's (functions/games/trang-trai-hang-soc-boards.js). The page keeps no point counter
// and stores nothing about the cup, in the save or on the device: this is a memory copy of the server's numbers.
// The load and every save reply carry the member's own numbers; op 'cup' adds the week's totals per HPVN house.
import { request } from './bridge';
import type { HouseName } from '../types/game';

export interface HouseCupView {
  weekKey?: string;
  houses?: Record<HouseName, number>; // this week, every member of the house
  house?: string | null; // the member's HPVN house (null: none, no points)
  memberTodayPoints: number;
  memberDailyCap: number;
  memberBank: number; // points toward the next «Cúp Đợt» reward
  memberTier: number;
  perTier: number;
}

const HOUSES: HouseName[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
const n = (value: unknown) => Math.max(0, Math.floor(Number(value) || 0));
let view: HouseCupView | null = null;
let listener: () => void = () => {};

export const houseCup = (): HouseCupView | null => view;
export const setHouseCupListener = (fn: () => void) => { listener = fn; };
/** The week's points of one house, 0 until the server answered. */
export const houseWeekPoints = (house: HouseName): number => view?.houses?.[house] ?? 0;

/** Takes a server reply (load/save `cup`, or op 'cup'); anything missing keeps the last server value. */
export function applyHouseCup(raw: unknown): void {
  if (!raw || typeof raw !== 'object') return;
  const r = raw as Record<string, unknown>;
  const houses = r.houses && typeof r.houses === 'object' ? (r.houses as Record<string, unknown>) : null;
  view = {
    ...view,
    ...(typeof r.weekKey === 'string' ? { weekKey: r.weekKey } : {}),
    ...(houses ? { houses: Object.fromEntries(HOUSES.map((h) => [h, n(houses[h])])) as Record<HouseName, number> } : {}),
    ...('house' in r ? { house: typeof r.house === 'string' ? r.house : null } : {}),
    memberTodayPoints: n(r.memberTodayPoints),
    memberDailyCap: n(r.memberDailyCap),
    memberBank: n(r.memberBank),
    memberTier: Math.max(1, n(r.memberTier)),
    perTier: n(r.perTier) || 300,
  };
  listener();
}

let inFlight: Promise<HouseCupView | null> | null = null;
let fetchedAt = 0;
/** The week's totals (op 'cup'); one call in flight, at most one a minute. */
export function fetchHouseCup(): Promise<HouseCupView | null> {
  if (inFlight) return inFlight;
  if (Date.now() - fetchedAt < 60_000) return Promise.resolve(view);
  fetchedAt = Date.now();
  inFlight = request('farm', { op: 'cup' })
    .then((reply) => { applyHouseCup(reply); return view; })
    .finally(() => { inFlight = null; });
  return inFlight;
}
