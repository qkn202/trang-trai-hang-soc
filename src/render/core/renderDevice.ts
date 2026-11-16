// Mốc 0–1: RenderDevice & GPU Telemetry Contracts cho kiến trúc đồ hoạ 2.5D mới.
// Tách biệt hoàn toàn khỏi ParkSimulation — có thể bật/tắt qua `?renderer=canvas|webgl2|compare`.

export type RendererBackendMode = 'canvas' | 'webgl2' | 'compare';

export type GpuQualityTier = 'low' | 'medium' | 'high';

export interface GpuQualityProfile {
  tier: GpuQualityTier;
  maxGrassInstances: number;
  maxPointLights: number;
  bloomEnabled: boolean;
  dprCap: number;
}

export const GPU_QUALITY_PROFILES: Record<GpuQualityTier, GpuQualityProfile> = {
  low: {
    tier: 'low',
    maxGrassInstances: 800,
    maxPointLights: 4,
    bloomEnabled: false,
    dprCap: 1.35,
  },
  medium: {
    tier: 'medium',
    maxGrassInstances: 2500,
    maxPointLights: 8,
    bloomEnabled: true,
    dprCap: 1.75,
  },
  high: {
    tier: 'high',
    maxGrassInstances: 6000,
    maxPointLights: 16,
    bloomEnabled: true,
    dprCap: 2.0,
  },
};

export interface GpuFrameStats {
  backend: 'webgl2';
  fps: number;
  cpuCollectMs: number;
  drawCalls: number;
  terrainTiles: number;
  waterTiles: number;
  grassInstances: number;
  sortedSprites: number;
  particleInstances: number;
  activeLights: number;
  atlasLayers: number;
  atlasSpritesPacked: number;
  vramEstimateMb: number;
}

export interface GpuMockSettings {
  mode: RendererBackendMode;
  splitRatio: number; // 0..1 (vị trí thanh gạt so sánh trực tiếp Canvas2D <-> WebGL2)
  qualityTier: GpuQualityTier;
  lumosWandEnabled: boolean;
  windStrength: number; // 0..2
  bloomIntensity: number; // 0..1.6
  normalStrength: number; // 0..2
}
