import * as migration_20260928_051056 from './20260928_051056';
import * as migration_20261008_081801_website_images from './20261008_081801_website_images';
import * as migration_20261015_120000_hero_video from './20261015_120000_hero_video';

export const migrations = [
  {
    up: migration_20260928_051056.up,
    down: migration_20260928_051056.down,
    name: '20260928_051056',
  },
  {
    up: migration_20261008_081801_website_images.up,
    down: migration_20261008_081801_website_images.down,
    name: '20261008_081801_website_images'
  },
  {
    up: migration_20261015_120000_hero_video.up,
    down: migration_20261015_120000_hero_video.down,
    name: '20261015_120000_hero_video',
  },
];
