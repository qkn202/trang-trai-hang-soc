// HPVN: the cup view is a memory copy of server replies; a member reply keeps the week totals it does not carry.
import { expect, it } from 'vitest';
import { applyHouseCup, houseCup, houseWeekPoints } from '../../hpvn/houseCup';

it('keeps only server numbers, merging member replies into the last week totals', () => {
  expect([houseCup(), houseWeekPoints('Gryffindor')]).toEqual([null, 0]);
  applyHouseCup({ weekKey: '2026-W46', houses: { Gryffindor: 95, Ravenclaw: '60', Bogus: 9 }, house: 'Ravenclaw', memberTodayPoints: 60, memberDailyCap: 60, memberBank: 60, memberTier: 1, perTier: 300 });
  expect([houseWeekPoints('Gryffindor'), houseWeekPoints('Ravenclaw'), houseWeekPoints('Slytherin')]).toEqual([95, 60, 0]);
  applyHouseCup({ memberTodayPoints: 20, memberDailyCap: 60, memberBank: 10, memberTier: 4, perTier: 300 }); // a save reply
  expect(houseCup()).toMatchObject({ weekKey: '2026-W46', house: 'Ravenclaw', memberBank: 10, memberTier: 4, memberTodayPoints: 20 });
  applyHouseCup({ house: null, memberTodayPoints: -5 });
  expect(houseCup()).toMatchObject({ house: null, memberTodayPoints: 0, memberTier: 1, perTier: 300 });
});
