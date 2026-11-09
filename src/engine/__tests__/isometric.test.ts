import { describe, expect, it } from 'vitest';
import { GRID_SIZE } from '../../data/zones';
import {
  Camera,
  centerCameraOnGrid,
  gridToScreen,
  rotateCamera90,
  rotateGridPoint,
  rotateGridRect,
  screenToGrid,
  unrotateGridPoint,
  worldIso,
} from '../isometric';

describe('isometric.ts - Phép chiếu Isometric & Xoay 90°', () => {
  describe('rotateGridPoint & unrotateGridPoint', () => {
    it('Góc xoay 0 (mặc định) giữ nguyên toạ độ', () => {
      const p = rotateGridPoint(14, 20, 0);
      expect(p.rx).toBe(14);
      expect(p.ry).toBe(20);

      const un = unrotateGridPoint(p.rx, p.ry, 0);
      expect(un.fgx).toBe(14);
      expect(un.fgy).toBe(20);
    });

    it('Xoay 90°, 180°, 270° bảo toàn khứ hồi qua unrotateGridPoint', () => {
      const testPoints = [
        { gx: 0, gy: 0 },
        { gx: 10, gy: 25 },
        { gx: 36, gy: 36 },
        { gx: 18.5, gy: 22.25 },
      ];

      const rotations: Array<0 | 1 | 2 | 3> = [0, 1, 2, 3];

      for (const rot of rotations) {
        for (const pt of testPoints) {
          const r = rotateGridPoint(pt.gx, pt.gy, rot);
          const un = unrotateGridPoint(r.rx, r.ry, rot);
          expect(un.fgx).toBeCloseTo(pt.gx, 5);
          expect(un.fgy).toBeCloseTo(pt.gy, 5);
        }
      }
    });

    it('Xoay 4 lần 90° bằng rotateGridPoint quay trở về điểm ban đầu', () => {
      let cur = { rx: 12, ry: 19 };
      const original = { ...cur };

      // Mỗi lần xoay 90° tương ứng góc 1
      for (let i = 0; i < 4; i++) {
        const next = rotateGridPoint(cur.rx, cur.ry, 1);
        cur = next;
      }
      expect(cur.rx).toBe(original.rx);
      expect(cur.ry).toBe(original.ry);
    });
  });

  describe('rotateGridRect', () => {
    it('Bảo toàn diện tích bounding box khi xoay', () => {
      const rect0 = rotateGridRect(10, 15, 2, 3, 0);
      expect(rect0.rbw).toBe(2);
      expect(rect0.rbh).toBe(3);

      const rect1 = rotateGridRect(10, 15, 2, 3, 1);
      // Xoay 90°: chiều rộng và chiều cao đổi chỗ
      expect(rect1.rbw).toBe(3);
      expect(rect1.rbh).toBe(2);

      const rect2 = rotateGridRect(10, 15, 2, 3, 2);
      expect(rect2.rbw).toBe(2);
      expect(rect2.rbh).toBe(3);

      const rect3 = rotateGridRect(10, 15, 2, 3, 3);
      expect(rect3.rbw).toBe(3);
      expect(rect3.rbh).toBe(2);
    });
  });

  describe('worldIso, gridToScreen & screenToGrid', () => {
    it('worldIso tại gốc (0,0) cho toạ độ thế giới (0,0)', () => {
      const w = worldIso(0, 0, 0);
      expect(w.wx).toBe(0);
      expect(w.wy).toBe(0);
    });

    it('gridToScreen và screenToGrid chuyển đổi khứ hồi chuẩn xác ở elevation 0', () => {
      const cam: Camera = { x: 500, y: 300, zoom: 1.0, viewRot: 0 };
      const viewW = 1280;
      const viewH = 720;

      const testTiles = [
        { gx: 10, gy: 12 },
        { gx: 20, gy: 25 },
        { gx: 5, gy: 30 },
      ];

      for (const t of testTiles) {
        // Lấy tâm ô (t.gx + 0.5, t.gy + 0.5)
        const screen = gridToScreen(t.gx + 0.5, t.gy + 0.5, cam, viewW, viewH);
        const picked = screenToGrid(screen.sx, screen.sy, cam, viewW, viewH);

        expect(picked.gx).toBe(t.gx);
        expect(picked.gy).toBe(t.gy);
      }
    });

    it('centerCameraOnGrid đặt camera đúng toạ độ thế giới isometric', () => {
      const cam: Camera = { x: 0, y: 0, zoom: 1.0, viewRot: 0 };
      centerCameraOnGrid(cam, 16, 18);

      const expected = worldIso(16, 18, 0);
      expect(cam.x).toBe(expected.wx);
      expect(cam.y).toBe(expected.wy);
    });

    it('rotateCamera90 xoay 4 lần đưa viewRot về góc ban đầu', () => {
      const cam: Camera = { x: 200, y: 150, zoom: 1.2, viewRot: 0 };
      centerCameraOnGrid(cam, 16.0, 18.0);

      rotateCamera90(cam, 1);
      expect(cam.viewRot).toBe(1);

      rotateCamera90(cam, 1);
      expect(cam.viewRot).toBe(2);

      rotateCamera90(cam, 1);
      expect(cam.viewRot).toBe(3);

      rotateCamera90(cam, 1);
      expect(cam.viewRot).toBe(0);
    });
  });
});
