// Build-time stub for SunoApi to prevent any initialization during build

export const DEFAULT_MODEL = 'chirp-v3-5';

export interface AudioInfo {
  id: string;
  title?: string;
  image_url?: string;
  lyric?: string;
  audio_url?: string;
  video_url?: string;
  created_at: string;
  model_name: string;
  gpt_description_prompt?: string;
  prompt?: string;
  status: string;
  type?: string;
  tags?: string;
  negative_tags?: string;
  duration?: string;
  error_message?: string;
}

// Dummy API that throws errors for all methods
const dummyApi = {
  generate: async () => { throw new Error('API not available during build'); },
  custom_generate: async () => { throw new Error('API not available during build'); },
  extendAudio: async () => { throw new Error('API not available during build'); },
  generateLyrics: async () => { throw new Error('API not available during build'); },
  generateStems: async () => { throw new Error('API not available during build'); },
  get: async () => { throw new Error('API not available during build'); },
  getClip: async () => { throw new Error('API not available during build'); },
  get_credits: async () => { throw new Error('API not available during build'); },
  getPersonaPaginated: async () => { throw new Error('API not available during build'); },
  getLyricAlignment: async () => { throw new Error('API not available during build'); },
  concatenate: async () => { throw new Error('API not available during build'); }
};

export const sunoApi = async (cookie?: string) => {
  console.log('Using build-time SunoApi stub');
  return dummyApi;
};

export default class SunoApi {
  constructor(cookie: string) {
    console.log('Using build-time SunoApi class stub');
  }
}