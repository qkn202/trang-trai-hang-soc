import { describe, expect, it } from 'vitest';
import {
  CANDY_HOGWARTS_TOTAL_LEVELS,
  generateCandyHogwartsLevel,
} from '../../data/candyHogwartsLevels';
import { CandyHogwartsEngine } from '../candyHogwartsEngine';

describe('Match-3 Bùa Gặt 7.777-Stage Solvability & Progressive Balance Audit', () => {
  it('verifies zero impossible special_order / horcrux / lock / ingredient budgets across all 1..7777 levels', () => {
    const violations: Array<{ levelId: number; reason: string }> = [];

    for (let id = 1; id <= CANDY_HOGWARTS_TOTAL_LEVELS; id++) {
      const lv = generateCandyHogwartsLevel(id);
      if (lv.moves < 13) {
        violations.push({ levelId: id, reason: `moves=${lv.moves} < 13` });
      }
      let activeCells = 0;
      for (let r = 0; r < lv.size; r++) {
        for (let c = 0; c < lv.size; c++) {
          if (lv.mask[r]?.[c] === 1) activeCells++;
        }
      }
      if (activeCells < 24) {
        violations.push({ levelId: id, reason: `activeCells=${activeCells} too small` });
      }
      if (lv.ingredientTarget > 0 && lv.ingredientExitCells.length === 0) {
        violations.push({ levelId: id, reason: 'missing ingredient exit cells' });
      }

      for (const obj of lv.objectives) {
        const target = obj.target ?? 0;
        if (obj.type === 'special_order') {
          if (obj.specialKind === 'color_bomb') {
            if (target > Math.min(4, Math.floor(lv.moves * 0.25))) {
              violations.push({
                levelId: id,
                reason: `color_bomb target=${target} > budget for moves=${lv.moves}`,
              });
            }
            if (target >= 3 && lv.numColors > 5) {
              violations.push({
                levelId: id,
                reason: `color_bomb target=${target} forced numColors=${lv.numColors}`,
              });
            }
          } else if (obj.specialKind === 'wrapped' && target > Math.min(6, Math.floor(lv.moves * 0.42))) {
            violations.push({
              levelId: id,
              reason: `wrapped target=${target} > budget for moves=${lv.moves}`,
            });
          } else if (obj.specialKind === 'seeker' && target > Math.min(7, Math.floor(lv.moves * 0.48))) {
            violations.push({
              levelId: id,
              reason: `seeker target=${target} > budget for moves=${lv.moves}`,
            });
          } else if (obj.specialKind === 'striped' && target > Math.min(8, Math.floor(lv.moves * 0.54))) {
            violations.push({
              levelId: id,
              reason: `striped target=${target} > budget for moves=${lv.moves}`,
            });
          }
        } else if (obj.type === 'horcrux' && target > lv.moves - 4) {
          violations.push({ levelId: id, reason: `horcrux=${target} vs moves=${lv.moves}` });
        } else if (obj.type === 'ingredient' && target > Math.floor(lv.moves * 0.6)) {
          violations.push({ levelId: id, reason: `ingredient=${target} vs moves=${lv.moves}` });
        } else if (obj.type === 'key_lock' && target > lv.moves) {
          violations.push({ levelId: id, reason: `key_lock=${target} vs moves=${lv.moves}` });
        } else if (obj.type === 'cauldron' && target > lv.moves) {
          violations.push({ levelId: id, reason: `cauldron=${target} vs moves=${lv.moves}` });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('plays opening and special_order stages cleanly with instantAnimations and zero deadlocks', async () => {
    const engine = new CandyHogwartsEngine(null);

    for (const stageId of [1, 15, 45, 89, 250, 777, 2500, 7777]) {
      engine.loadLevel(generateCandyHogwartsLevel(stageId), {
        house: 'ravenclaw',
        instantAnimations: true,
      });
      expect(engine.status).toBe('playing');
      expect(engine.movesLeft).toBeGreaterThanOrEqual(13);
      for (let turn = 0; turn < 3 && engine.status === 'playing' && engine.movesLeft > 0; turn++) {
        const mv = engine.findAnyValidMove();
        expect(mv).not.toBeNull();
        if (mv) {
          await engine.trySwap(mv[0], mv[1]);
        }
      }
      expect(engine.movesUsed).toBeGreaterThanOrEqual(1);
    }
  });
});
