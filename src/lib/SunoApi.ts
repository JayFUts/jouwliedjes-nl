import axios, { AxiosInstance } from 'axios';
// import UserAgent from 'user-agents'; // Moved to conditional import
// import pino from 'pino'; // Moved to conditional import
import yn from 'yn';
import { isPage, sleep, waitForRequests } from '@/lib/utils';
import * as cookie from 'cookie';
import { randomUUID } from 'node:crypto';
// import { Solver } from '@2captcha/captcha-solver'; // Dynamically imported to avoid build issues
// import { paramsCoordinates } from '@2captcha/captcha-solver/dist/structs/2captcha'; // Type imported dynamically

// Type declaration for Solver to avoid TypeScript issues
interface Solver {
  coordinates(payload: any): Promise<any>;
  badReport(captchaId: string): Promise<void>;
}

// import { BrowserContext, Page, Locator, chromium, firefox } from 'rebrowser-playwright-core'; // Moved to conditional import
// import { createCursor, Cursor } from 'ghost-cursor-playwright'; // Moved to conditional import
import { promises as fs } from 'fs';
import path from 'node:path';

// Type declarations for conditional imports
interface BrowserContext {}
interface Page {}
interface Locator {}
interface Cursor {}

export const DEFAULT_MODEL = 'chirp-v3-5';

// Lazy initialization functions
const getCache = () => {
  const globalForSunoApi = global as unknown as { sunoApiCache?: Map<string, SunoApi> };
  if (!globalForSunoApi.sunoApiCache) {
    globalForSunoApi.sunoApiCache = new Map<string, SunoApi>();
  }
  return globalForSunoApi.sunoApiCache;
};

const getLogger = () => {
  // Build-safe logger initialization
  if (process.env.NETLIFY === 'true' || process.env.NEXT_PHASE === 'phase-production-build') {
    return { 
      info: (...args: any[]) => console.log(...args), 
      error: (...args: any[]) => console.error(...args), 
      warn: (...args: any[]) => console.warn(...args) 
    };
  }
  
  try {
    const pino = require('pino');
    return pino();
  } catch (error) {
    return { 
      info: (...args: any[]) => console.log(...args), 
      error: (...args: any[]) => console.error(...args), 
      warn: (...args: any[]) => console.warn(...args) 
    };
  }
};

export interface AudioInfo {
  id: string; // Unique identifier for the audio
  title?: string; // Title of the audio
  image_url?: string; // URL of the image associated with the audio
  lyric?: string; // Lyrics of the audio
  audio_url?: string; // URL of the audio file
  video_url?: string; // URL of the video associated with the audio
  created_at: string; // Date and time when the audio was created
  model_name: string; // Name of the model used for audio generation
  gpt_description_prompt?: string; // Prompt for GPT description
  prompt?: string; // Prompt for audio generation
  status: string; // Status
  type?: string;
  tags?: string; // Genre of music.
  negative_tags?: string; // Negative tags of music.
  duration?: string; // Duration of the audio
  error_message?: string; // Error message if any
}

interface PersonaResponse {
  persona: {
    id: string;
    name: string;
    description: string;
    image_s3_id: string;
    root_clip_id: string;
    clip: any; // You can define a more specific type if needed
    user_display_name: string;
    user_handle: string;
    user_image_url: string;
    persona_clips: Array<{
      clip: any; // You can define a more specific type if needed
    }>;
    is_suno_persona: boolean;
    is_trashed: boolean;
    is_owned: boolean;
    is_public: boolean;
    is_public_approved: boolean;
    is_loved: boolean;
    upvote_count: number;
    clip_count: number;
  };
  total_results: number;
  current_page: number;
  is_following: boolean;
}

class SunoApi {
  private static BASE_URL: string = 'https://studio-api.prod.suno.com';
  private static CLERK_BASE_URL: string = 'https://clerk.suno.com';
  private static CLERK_VERSION = '5.15.0';

  private readonly client: AxiosInstance;
  private sid?: string;
  private currentToken?: string;
  private deviceId?: string;
  private userAgent?: string;
  private cookies: Record<string, string | undefined>;
  private solver?: Solver;
  private ghostCursorEnabled = yn(process.env.BROWSER_GHOST_CURSOR, { default: false });
  private cursor?: Cursor;

  constructor(cookies: string) {
    try {
      // Build-safe user agent generation
      if (process.env.NETLIFY === 'true' || process.env.NEXT_PHASE === 'phase-production-build') {
        this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      } else {
        try {
          const UserAgent = require('user-agents');
          this.userAgent = new UserAgent(/Macintosh/).random().toString();
        } catch (error) {
          this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        }
      }
      this.cookies = cookie.parse(cookies);
      this.deviceId = this.cookies.ajs_anonymous_id || randomUUID();
      this.client = axios.create({
        withCredentials: true,
        headers: {
          'Affiliate-Id': 'undefined',
          'Device-Id': `"${this.deviceId}"`,
          'x-suno-client': 'Android prerelease-4nt180t 1.0.42',
          'X-Requested-With': 'com.suno.android',
          'sec-ch-ua': '"Chromium";v="130", "Android WebView";v="130", "Not?A_Brand";v="99"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'User-Agent': this.userAgent
        }
      });
      this.client.interceptors.request.use(config => {
        if (this.currentToken && !config.headers.Authorization)
          config.headers.Authorization = `Bearer ${this.currentToken}`;
        const cookiesArray = Object.entries(this.cookies).map(([key, value]) => 
          cookie.serialize(key, value as string)
        );
        config.headers.Cookie = cookiesArray.join('; ');
        return config;
      });
      this.client.interceptors.response.use(resp => {
        const setCookieHeader = resp.headers['set-cookie'];
        if (Array.isArray(setCookieHeader)) {
          const newCookies = cookie.parse(setCookieHeader.join('; '));
          for (const [key, value] of Object.entries(newCookies)) {
            this.cookies[key] = value;
          }
        }
        return resp;
      })
    } catch (error) {
      getLogger().error('Error in SunoApi constructor:', error);
      // Initialize with minimal setup if constructor fails
      this.userAgent = 'fallback-agent';
      this.cookies = {};
      this.deviceId = 'fallback-device';
      this.client = axios.create();
    }
  }

  public async init(): Promise<SunoApi> {
    //await this.getClerkLatestVersion();
    await this.getAuthToken();
    await this.keepAlive();
    return this;
  }

  private getSolver(): Solver {
    // If the solver hasn't been created yet...
    if (!this.solver) {
      // Skip solver initialization during build
      if (process.env.NEXT_PHASE === 'phase-production-build' || 
          process.env.NETLIFY === 'true' ||
          process.env.BUILD_ID !== undefined) {
        this.solver = {
          coordinates: async () => {
            throw new Error('Captcha solver is not available during build.');
          },
          badReport: async () => {
            getLogger().warn('Cannot report bad captcha during build');
          }
        } as Solver;
        return this.solver;
      }

      console.log('Initializing 2Captcha solver on demand...');
      try {
        // Dynamic import to avoid build-time issues
        const { Solver } = require('@2captcha/captcha-solver');
        // Use placeholder key to avoid build failure
        this.solver = new Solver(process.env.TWOCAPTCHA_KEY || 'dummy_key');
        getLogger().info('2Captcha solver initialized successfully');
      } catch (error) {
        getLogger().error('Failed to initialize 2Captcha solver:', error);
        // Fall back to the dummy solver if initialization fails
        this.solver = {
          coordinates: async () => {
            throw new Error('Captcha solver is not available. Please check your 2Captcha key and configuration.');
          },
          badReport: async () => {
            getLogger().warn('Cannot report bad captcha: solver not available');
          }
        } as Solver;
      }
    }

    // At this point, `this.solver` is guaranteed to be defined.
    return this.solver!;
  }

  /**
   * Get the clerk package latest version id.
   * This method is commented because we are now using a hard-coded Clerk version, hence this method is not needed.
   
  private async getClerkLatestVersion() {
    // URL to get clerk version ID
    const getClerkVersionUrl = `${SunoApi.JSDELIVR_BASE_URL}/v1/package/npm/@clerk/clerk-js`;
    // Get clerk version ID
    const versionListResponse = await this.client.get(getClerkVersionUrl);
    if (!versionListResponse?.data?.['tags']['latest']) {
      throw new Error(
        'Failed to get clerk version info, Please try again later'
      );
    }
    // Save clerk version ID for auth
    SunoApi.clerkVersion = versionListResponse?.data?.['tags']['latest'];
  }
  */

  /**
   * Get the session ID and save it for later use.
   */
  private async getAuthToken() {
    getLogger().info('Getting the session ID');
    // URL to get session ID
    const getSessionUrl = `${SunoApi.CLERK_BASE_URL}/v1/client?_is_native=true&_clerk_js_version=${SunoApi.CLERK_VERSION}`;
    // Get session ID
    const sessionResponse = await this.client.get(getSessionUrl, {
      headers: { Authorization: this.cookies.__client }
    });
    if (!sessionResponse?.data?.response?.last_active_session_id) {
      throw new Error(
        'Failed to get session id, you may need to update the SUNO_COOKIE'
      );
    }
    // Save session ID for later use
    this.sid = sessionResponse.data.response.last_active_session_id;
  }

  /**
   * Keep the session alive.
   * @param isWait Indicates if the method should wait for the session to be fully renewed before returning.
   */
  public async keepAlive(isWait?: boolean): Promise<void> {
    if (!this.sid) {
      throw new Error('Session ID is not set. Cannot renew token.');
    }
    // URL to renew session token
    const renewUrl = `${SunoApi.CLERK_BASE_URL}/v1/client/sessions/${this.sid}/tokens?_is_native=true&_clerk_js_version=${SunoApi.CLERK_VERSION}`;
    // Renew session token
    getLogger().info('KeepAlive...\n');
    const renewResponse = await this.client.post(renewUrl, {}, {
      headers: { Authorization: this.cookies.__client }
    });
    if (isWait) {
      await sleep(1, 2);
    }
    const newToken = renewResponse.data.jwt;
    // Update Authorization field in request header with the new JWT token
    this.currentToken = newToken;
  }

  /**
   * Get the session token (not to be confused with session ID) and save it for later use.
   */
  private async getSessionToken() {
    const tokenResponse = await this.client.post(
      `${SunoApi.BASE_URL}/api/user/create_session_id/`,
      {
        session_properties: JSON.stringify({ deviceId: this.deviceId }),
        session_type: 1
      }
    );
    return tokenResponse.data.session_id;
  }

  private async captchaRequired(): Promise<boolean> {
    const resp = await this.client.post(`${SunoApi.BASE_URL}/api/c/check`, {
      ctype: 'generation'
    });
    getLogger().info(resp.data);
    return resp.data.required;
  }

  /**
   * Clicks on a locator or XY vector. This method is made because of the difference between ghost-cursor-playwright and Playwright methods
   */
  private async click(target: Locator|Page, position?: { x: number, y: number }): Promise<void> {
    if (this.ghostCursorEnabled) {
      let pos: any = isPage(target) ? { x: 0, y: 0 } : await target.boundingBox();
      if (position) 
        pos = {
          ...pos,
          x: pos.x + position.x,
          y: pos.y + position.y,
          width: null,
          height: null,
        };
      return this.cursor?.actions.click({
        target: pos
      });
    } else {
      if (isPage(target))
        return target.mouse.click(position?.x ?? 0, position?.y ?? 0);
      else
        return target.click({ force: true, position });
    }
  }

  /**
   * Get the BrowserType from the `BROWSER` environment variable.
   * @returns {BrowserType} chromium, firefox or webkit. Default is chromium
   */
  private getBrowserType() {
    const browser = process.env.BROWSER?.toLowerCase();
    switch (browser) {
      case 'firefox':
        return firefox;
      /*case 'webkit': ** doesn't work with rebrowser-patches
      case 'safari':
        return webkit;*/
      default:
        return chromium;
    }
  }

  /**
   * Launches a browser with the necessary cookies
   * @returns {BrowserContext}
   */
  private async launchBrowser(): Promise<BrowserContext> {
    const args = [
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-features=site-per-process',
      '--disable-features=IsolateOrigins',
      '--disable-extensions',
      '--disable-infobars'
    ];
    // Check for GPU acceleration, as it is recommended to turn it off for Docker
    if (yn(process.env.BROWSER_DISABLE_GPU, { default: false }))
      args.push('--enable-unsafe-swiftshader',
        '--disable-gpu',
        '--disable-setuid-sandbox');
    const browser = await this.getBrowserType().launch({
      args,
      headless: yn(process.env.BROWSER_HEADLESS, { default: true })
    });
    const context = await browser.newContext({ userAgent: this.userAgent, locale: process.env.BROWSER_LOCALE, viewport: null });
    const cookies = [];
    const lax: 'Lax' | 'Strict' | 'None' = 'Lax';
    cookies.push({
      name: '__session',
      value: this.currentToken+'',
      domain: '.suno.com',
      path: '/',
      sameSite: lax
    });
    for (const key in this.cookies) {
      cookies.push({
        name: key,
        value: this.cookies[key]+'',
        domain: '.suno.com',
        path: '/',
        sameSite: lax
      })
    }
    await context.addCookies(cookies);
    return context;
  }

  /**
   * Checks for CAPTCHA verification and solves the CAPTCHA if needed
   * @returns {string|null} hCaptcha token. If no verification is required, returns null
   */
  public async getCaptcha(): Promise<string|null> {
    if (!await this.captchaRequired())
      return null;

    getLogger().info('CAPTCHA required. Launching browser...')
    const browser = await this.launchBrowser();
    const page = await browser.newPage();
    await page.goto('https://suno.com/create', { referer: 'https://www.google.com/', waitUntil: 'domcontentloaded', timeout: 0 });

    getLogger().info('Waiting for Suno interface to load');
    // await page.locator('.react-aria-GridList').waitFor({ timeout: 60000 });
    await page.waitForResponse('**/api/project/**\\?**', { timeout: 60000 }); // wait for song list API call

    if (this.ghostCursorEnabled)
      this.cursor = await createCursor(page);
    
    getLogger().info('Triggering the CAPTCHA');
    try {
      await page.getByLabel('Close').click({ timeout: 2000 }); // close all popups
      // await this.click(page, { x: 318, y: 13 });
    } catch(e) {}

    const textarea = page.locator('.custom-textarea');
    await this.click(textarea);
    await textarea.pressSequentially('Lorem ipsum', { delay: 80 });

    const button = page.locator('button[aria-label="Create"]').locator('div.flex');
    this.click(button);

    const controller = new AbortController();
    new Promise<void>(async (resolve, reject) => {
      const frame = page.frameLocator('iframe[title*="hCaptcha"]');
      const challenge = frame.locator('.challenge-container');
      try {
        let wait = true;
        while (true) {
          if (wait)
            await waitForRequests(page, controller.signal);
          const drag = (await challenge.locator('.prompt-text').first().innerText()).toLowerCase().includes('drag');
          let captcha: any;
          for (let j = 0; j < 3; j++) { // try several times because sometimes 2Captcha could return an error
            try {
              getLogger().info('Sending the CAPTCHA to 2Captcha');
              const payload: any = {
                body: (await challenge.screenshot({ timeout: 5000 })).toString('base64'),
                lang: process.env.BROWSER_LOCALE
              };
              if (drag) {
                // Say to the worker that he needs to click
                payload.textinstructions = 'CLICK on the shapes at their edge or center as shown above—please be precise!';
                try {
                  // Skip file operations during build
                  if (process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.NETLIFY === 'true' ||
                      process.env.BUILD_ID !== undefined) {
                    payload.imginstructions = '';
                  } else {
                    const cwd = process.cwd();
                    const instructionsPath = path.join(cwd, 'public', 'drag-instructions.jpg');
                    payload.imginstructions = (await fs.readFile(instructionsPath)).toString('base64');
                  }
                } catch (error) {
                  getLogger().warn('Could not load drag instructions image:', error);
                  payload.imginstructions = '';
                }
              }
              captcha = await this.getSolver().coordinates(payload);
              break;
            } catch(err: any) {
              getLogger().info(err.message);
              if (j != 2)
                getLogger().info('Retrying...');
              else
                throw err;
            }
          } 
          if (drag) {
            const challengeBox = await challenge.boundingBox();
            if (challengeBox == null)
              throw new Error('.challenge-container boundingBox is null!');
            if (captcha.data.length % 2) {
              getLogger().info('Solution does not have even amount of points required for dragging. Requesting new solution...');
              this.getSolver().badReport(captcha.id);
              wait = false;
              continue;
            }
            for (let i = 0; i < captcha.data.length; i += 2) {
              const data1 = captcha.data[i];
              const data2 = captcha.data[i+1];
              getLogger().info(JSON.stringify(data1) + JSON.stringify(data2));
              await page.mouse.move(challengeBox.x + +data1.x, challengeBox.y + +data1.y);
              await page.mouse.down();
              await sleep(1.1); // wait for the piece to be 'unlocked'
              await page.mouse.move(challengeBox.x + +data2.x, challengeBox.y + +data2.y, { steps: 30 });
              await page.mouse.up();
            }
            wait = true;
          } else {
            for (const data of captcha.data) {
              getLogger().info(data);
              await this.click(challenge, { x: +data.x, y: +data.y });
            };
          }
          this.click(frame.locator('.button-submit')).catch(e => {
            if (e.message.includes('viewport')) // when hCaptcha window has been closed due to inactivity,
              this.click(button); // click the Create button again to trigger the CAPTCHA
            else
              throw e;
          });
        }
      } catch(e: any) {
        if (e.message.includes('been closed') // catch error when closing the browser
          || e.message == 'AbortError') // catch error when waitForRequests is aborted
          resolve();
        else
          reject(e);
      }
    }).catch(e => {
      browser.browser()?.close();
      throw e;
    });
    return (new Promise((resolve, reject) => {
      page.route('**/api/generate/v2/**', async (route: any) => {
        try {
          getLogger().info('hCaptcha token received. Closing browser');
          route.abort();
          browser.browser()?.close();
          controller.abort();
          const request = route.request();
          this.currentToken = request.headers().authorization.split('Bearer ').pop();
          resolve(request.postDataJSON().token);
        } catch(err) {
          reject(err);
        }
      });
    }));
  }

  /**
   * Imitates Cloudflare Turnstile loading error. Unused right now, left for future
   */
  private async getTurnstile() {
    return this.client.post(
      `https://clerk.suno.com/v1/client?__clerk_api_version=2021-02-05&_clerk_js_version=${SunoApi.CLERK_VERSION}&_method=PATCH`,
      { captcha_error: '300030,300030,300030' },
      { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
  }

  /**
   * Generate a song based on the prompt.
   * @param prompt The text prompt to generate audio from.
   * @param make_instrumental Indicates if the generated audio should be instrumental.
   * @param wait_audio Indicates if the method should wait for the audio file to be fully generated before returning.
   * @returns
   */
  public async generate(
    prompt: string,
    make_instrumental: boolean = false,
    model?: string,
    wait_audio: boolean = false
  ): Promise<AudioInfo[]> {
    await this.keepAlive(false);
    const startTime = Date.now();
    const audios = await this.generateSongs(
      prompt,
      false,
      undefined,
      undefined,
      make_instrumental,
      model,
      wait_audio
    );
    const costTime = Date.now() - startTime;
    getLogger().info('Generate Response:\n' + JSON.stringify(audios, null, 2));
    getLogger().info('Cost time: ' + costTime);
    return audios;
  }

  /**
   * Calls the concatenate endpoint for a clip to generate the whole song.
   * @param clip_id The ID of the audio clip to concatenate.
   * @returns A promise that resolves to an AudioInfo object representing the concatenated audio.
   * @throws Error if the response status is not 200.
   */
  public async concatenate(clip_id: string): Promise<AudioInfo> {
    await this.keepAlive(false);
    const payload: any = { clip_id: clip_id };

    const response = await this.client.post(
      `${SunoApi.BASE_URL}/api/generate/concat/v2/`,
      payload,
      {
        timeout: 10000 // 10 seconds timeout
      }
    );
    if (response.status !== 200) {
      throw new Error('Error response:' + response.statusText);
    }
    return response.data;
  }

  /**
   * Generates custom audio based on provided parameters.
   *
   * @param prompt The text prompt to generate audio from.
   * @param tags Tags to categorize the generated audio.
   * @param title The title for the generated audio.
   * @param make_instrumental Indicates if the generated audio should be instrumental.
   * @param wait_audio Indicates if the method should wait for the audio file to be fully generated before returning.
   * @param negative_tags Negative tags that should not be included in the generated audio.
   * @returns A promise that resolves to an array of AudioInfo objects representing the generated audios.
   */
  public async custom_generate(
    prompt: string,
    tags: string,
    title: string,
    make_instrumental: boolean = false,
    model?: string,
    wait_audio: boolean = false,
    negative_tags?: string
  ): Promise<AudioInfo[]> {
    const startTime = Date.now();
    const audios = await this.generateSongs(
      prompt,
      true,
      tags,
      title,
      make_instrumental,
      model,
      wait_audio,
      negative_tags
    );
    const costTime = Date.now() - startTime;
    getLogger().info(
      'Custom Generate Response:\n' + JSON.stringify(audios, null, 2)
    );
    getLogger().info('Cost time: ' + costTime);
    return audios;
  }

  /**
   * Generates songs based on the provided parameters.
   *
   * @param prompt The text prompt to generate songs from.
   * @param isCustom Indicates if the generation should consider custom parameters like tags and title.
   * @param tags Optional tags to categorize the song, used only if isCustom is true.
   * @param title Optional title for the song, used only if isCustom is true.
   * @param make_instrumental Indicates if the generated song should be instrumental.
   * @param wait_audio Indicates if the method should wait for the audio file to be fully generated before returning.
   * @param negative_tags Negative tags that should not be included in the generated audio.
   * @param task Optional indication of what to do. Enter 'extend' if extending an audio, otherwise specify null.
   * @param continue_clip_id 
   * @returns A promise that resolves to an array of AudioInfo objects representing the generated songs.
   */
  private async generateSongs(
    prompt: string,
    isCustom: boolean,
    tags?: string,
    title?: string,
    make_instrumental?: boolean,
    model?: string,
    wait_audio: boolean = false,
    negative_tags?: string,
    task?: string,
    continue_clip_id?: string,
    continue_at?: string | number
  ): Promise<AudioInfo[]> {
    await this.keepAlive();
    const payload: any = {
      make_instrumental: make_instrumental,
      mv: model || DEFAULT_MODEL,
      prompt: '',
      generation_type: 'TEXT',
      continue_at: continue_at,
      continue_clip_id: continue_clip_id,
      task: task,
      token: await this.getCaptcha()
    };
    if (isCustom) {
      payload.tags = tags;
      payload.title = title;
      payload.negative_tags = negative_tags;
      payload.prompt = prompt;
    } else {
      payload.gpt_description_prompt = prompt;
    }
    getLogger().info(
      'generateSongs payload:\n' +
        JSON.stringify(
          {
            prompt: prompt,
            isCustom: isCustom,
            tags: tags,
            title: title,
            make_instrumental: make_instrumental,
            wait_audio: wait_audio,
            negative_tags: negative_tags,
            payload: payload
          },
          null,
          2
        )
    );
    const response = await this.client.post(
      `${SunoApi.BASE_URL}/api/generate/v2/`,
      payload,
      {
        timeout: 10000 // 10 seconds timeout
      }
    );
    if (response.status !== 200) {
      throw new Error('Error response:' + response.statusText);
    }
    const songIds = response.data.clips.map((audio: any) => audio.id);
    //Want to wait for music file generation
    if (wait_audio) {
      const startTime = Date.now();
      let lastResponse: AudioInfo[] = [];
      await sleep(5, 5);
      while (Date.now() - startTime < 100000) {
        const response = await this.get(songIds);
        const allCompleted = response.every(
          (audio) => audio.status === 'streaming' || audio.status === 'complete'
        );
        const allError = response.every((audio) => audio.status === 'error');
        if (allCompleted || allError) {
          return response;
        }
        lastResponse = response;
        await sleep(3, 6);
        await this.keepAlive(true);
      }
      return lastResponse;
    } else {
      return response.data.clips.map((audio: any) => ({
        id: audio.id,
        title: audio.title,
        image_url: audio.image_url,
        lyric: audio.metadata.prompt,
        audio_url: audio.audio_url,
        video_url: audio.video_url,
        created_at: audio.created_at,
        model_name: audio.model_name,
        status: audio.status,
        gpt_description_prompt: audio.metadata.gpt_description_prompt,
        prompt: audio.metadata.prompt,
        type: audio.metadata.type,
        tags: audio.metadata.tags,
        negative_tags: audio.metadata.negative_tags,
        duration: audio.metadata.duration
      }));
    }
  }

  /**
   * Generates lyrics based on a given prompt.
   * @param prompt The prompt for generating lyrics.
   * @returns The generated lyrics text.
   */
  public async generateLyrics(prompt: string): Promise<string> {
    await this.keepAlive(false);
    // Initiate lyrics generation
    const generateResponse = await this.client.post(
      `${SunoApi.BASE_URL}/api/generate/lyrics/`,
      { prompt }
    );
    const generateId = generateResponse.data.id;

    // Poll for lyrics completion
    let lyricsResponse = await this.client.get(
      `${SunoApi.BASE_URL}/api/generate/lyrics/${generateId}`
    );
    while (lyricsResponse?.data?.status !== 'complete') {
      await sleep(2); // Wait for 2 seconds before polling again
      lyricsResponse = await this.client.get(
        `${SunoApi.BASE_URL}/api/generate/lyrics/${generateId}`
      );
    }

    // Return the generated lyrics text
    return lyricsResponse.data;
  }

  /**
   * Extends an existing audio clip by generating additional content based on the provided prompt.
   *
   * @param audioId The ID of the audio clip to extend.
   * @param prompt The prompt for generating additional content.
   * @param continueAt Extend a new clip from a song at mm:ss(e.g. 00:30). Default extends from the end of the song.
   * @param tags Style of Music.
   * @param title Title of the song.
   * @returns A promise that resolves to an AudioInfo object representing the extended audio clip.
   */
  public async extendAudio(
    audioId: string,
    prompt: string = '',
    continueAt: string,
    tags: string = '',
    negative_tags: string = '',
    title: string = '',
    model?: string,
    wait_audio?: boolean
  ): Promise<AudioInfo[]> {
    return this.generateSongs(prompt, true, tags, title, false, model, wait_audio, negative_tags, 'extend', audioId, continueAt);
  }

  /**
   * Generate stems for a song.
   * @param song_id The ID of the song to generate stems for.
   * @returns A promise that resolves to an AudioInfo object representing the generated stems.
   */
  public async generateStems(song_id: string): Promise<AudioInfo[]> {
    await this.keepAlive(false);
    const response = await this.client.post(
      `${SunoApi.BASE_URL}/api/edit/stems/${song_id}`, {}
    );

    console.log('generateStems response:\n', response?.data);
    return response.data.clips.map((clip: any) => ({
      id: clip.id,
      status: clip.status,
      created_at: clip.created_at,
      title: clip.title,
      stem_from_id: clip.metadata.stem_from_id,
      duration: clip.metadata.duration
    }));
  }


  /**
   * Get the lyric alignment for a song.
   * @param song_id The ID of the song to get the lyric alignment for.
   * @returns A promise that resolves to an object containing the lyric alignment.
   */
  public async getLyricAlignment(song_id: string): Promise<object> {
    await this.keepAlive(false);
    const response = await this.client.get(`${SunoApi.BASE_URL}/api/gen/${song_id}/aligned_lyrics/v2/`);

    console.log(`getLyricAlignment ~ response:`, response.data);
    return response.data?.aligned_words.map((transcribedWord: any) => ({
      word: transcribedWord.word,
      start_s: transcribedWord.start_s,
      end_s: transcribedWord.end_s,
      success: transcribedWord.success,
      p_align: transcribedWord.p_align
    }));
  }

  /**
   * Processes the lyrics (prompt) from the audio metadata into a more readable format.
   * @param prompt The original lyrics text.
   * @returns The processed lyrics text.
   */
  private parseLyrics(prompt: string): string {
    // Assuming the original lyrics are separated by a specific delimiter (e.g., newline), we can convert it into a more readable format.
    // The implementation here can be adjusted according to the actual lyrics format.
    // For example, if the lyrics exist as continuous text, it might be necessary to split them based on specific markers (such as periods, commas, etc.).
    // The following implementation assumes that the lyrics are already separated by newlines.

    // Split the lyrics using newline and ensure to remove empty lines.
    const lines = prompt.split('\n').filter((line) => line.trim() !== '');

    // Reassemble the processed lyrics lines into a single string, separated by newlines between each line.
    // Additional formatting logic can be added here, such as adding specific markers or handling special lines.
    return lines.join('\n');
  }

  /**
   * Retrieves audio information for the given song IDs.
   * @param songIds An optional array of song IDs to retrieve information for.
   * @param page An optional page number to retrieve audio information from.
   * @returns A promise that resolves to an array of AudioInfo objects.
   */
  public async get(
    songIds?: string[],
    page?: string | null
  ): Promise<AudioInfo[]> {
    await this.keepAlive(false);
    let url = new URL(`${SunoApi.BASE_URL}/api/feed/v2`);
    if (songIds) {
      url.searchParams.append('ids', songIds.join(','));
    }
    if (page) {
      url.searchParams.append('page', page);
    }
    getLogger().info('Get audio status: ' + url.href);
    const response = await this.client.get(url.href, {
      // 10 seconds timeout
      timeout: 10000
    });

    const audios = response.data.clips;

    return audios.map((audio: any) => ({
      id: audio.id,
      title: audio.title,
      image_url: audio.image_url,
      lyric: audio.metadata.prompt
        ? this.parseLyrics(audio.metadata.prompt)
        : '',
      audio_url: audio.audio_url,
      video_url: audio.video_url,
      created_at: audio.created_at,
      model_name: audio.model_name,
      status: audio.status,
      gpt_description_prompt: audio.metadata.gpt_description_prompt,
      prompt: audio.metadata.prompt,
      type: audio.metadata.type,
      tags: audio.metadata.tags,
      duration: audio.metadata.duration,
      error_message: audio.metadata.error_message
    }));
  }

  /**
   * Retrieves information for a specific audio clip.
   * @param clipId The ID of the audio clip to retrieve information for.
   * @returns A promise that resolves to an object containing the audio clip information.
   */
  public async getClip(clipId: string): Promise<object> {
    await this.keepAlive(false);
    const response = await this.client.get(
      `${SunoApi.BASE_URL}/api/clip/${clipId}`
    );
    return response.data;
  }

  public async get_credits(): Promise<object> {
    await this.keepAlive(false);
    const response = await this.client.get(
      `${SunoApi.BASE_URL}/api/billing/info/`
    );
    return {
      credits_left: response.data.total_credits_left,
      period: response.data.period,
      monthly_limit: response.data.monthly_limit,
      monthly_usage: response.data.monthly_usage
    };
  }

  public async getPersonaPaginated(personaId: string, page: number = 1): Promise<PersonaResponse> {
    await this.keepAlive(false);
    
    const url = `${SunoApi.BASE_URL}/api/persona/get-persona-paginated/${personaId}/?page=${page}`;
    
    getLogger().info(`Fetching persona data: ${url}`);
    
    const response = await this.client.get(url, {
      timeout: 10000 // 10 seconds timeout
    });

    if (response.status !== 200) {
      throw new Error('Error response: ' + response.statusText);
    }

    return response.data;
  }
}

export const sunoApi = async (cookie?: string) => {
  // More comprehensive build-time detection
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                     process.env.NODE_ENV === undefined ||
                     process.env.NETLIFY === 'true' ||
                     process.env.BUILD_ID !== undefined ||
                     typeof window !== 'undefined' ||
                     !process.env.RUNTIME_ENV;
  
  if (isBuildTime) {
    console.log('Build-time detected, returning dummy API');
    // Return a dummy API that won't initialize anything during build
    return {
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
    } as any;
  }

  const resolvedCookie = cookie && cookie.includes('__client') ? cookie : process.env.SUNO_COOKIE; // Check for bad `Cookie` header (It's too expensive to actually parse the cookies *here*)
  if (!resolvedCookie) {
    getLogger().info('No cookie provided! Aborting...\nPlease provide a cookie either in the .env file or in the Cookie header of your request.')
    throw new Error('Please provide a cookie either in the .env file or in the Cookie header of your request.');
  }

  // Check if the instance for this cookie already exists in the cache
  const cachedInstance = getCache().get(resolvedCookie);
  if (cachedInstance)
    return cachedInstance;

  // If not, create a new instance and initialize it
  const instance = await new SunoApi(resolvedCookie).init();
  // Cache the initialized instance
  getCache().set(resolvedCookie, instance);

  return instance;
};