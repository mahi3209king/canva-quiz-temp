import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Optimize for speed while maintaining quality
Config.setCodec('h264');
Config.setCrf(18); // High quality

// Ensure 9:16 aspect ratio
Config.setConcurrency(8);
