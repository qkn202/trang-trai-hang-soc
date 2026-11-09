import { WeatherKind } from '../types/game';

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export type BgmWeather =
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'storm'
  | 'snow'
  | 'fog'
  | 'fireflies'
  | WeatherKind;

export type BgmMood = 'day' | 'night' | 'festival' | 'storm' | 'rain';

/**
 * Pure function to evaluate the active adaptive BGM mood.
 *
 * Priority Matrix:
 * 1. festivalActive -> 'festival' (festive celebrations override all weather and times)
 * 2. weather === 'storm' -> 'storm' (thunderstorms bring dramatic bad-weather tension)
 * 3. weather in ['rain', 'snow', 'fog'] -> 'rain' (gentle atmospheric rain & winter)
 * 4. timeOfDay in ['night', 'dusk'] -> 'night' (peaceful, wistful after-hours)
 * 5. otherwise -> 'day' (sunlit cozy countryside)
 */
export function pickBgmMood(
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night',
  weather: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' | 'fireflies' | WeatherKind,
  festivalActive: boolean
): BgmMood {
  if (festivalActive) {
    return 'festival';
  }
  if (weather === 'storm') {
    return 'storm';
  }
  if (weather === 'rain' || weather === 'snow' || weather === 'fog') {
    return 'rain';
  }
  if (timeOfDay === 'night' || timeOfDay === 'dusk') {
    return 'night';
  }
  return 'day';
}
