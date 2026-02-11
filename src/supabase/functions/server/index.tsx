import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', logger(console.log))
app.use('*', cors())

const getSupabase = (env: any) => {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  )
}

const BUCKET_NAME = 'make-815bcb4c-images';

// Helper to normalize keys
const getKey = (nickname: string) => `entry:${nickname.toLowerCase().trim()}`;

app.get('/make-server-815bcb4c/entries', async (c) => {
  try {
    const entries = await kv.getByPrefix('entry:');
    // entries is an array of values.
    // We might want to sort them? KV doesn't guarantee order.
    // Sort by created date if we had one, or name.
    // Let's rely on frontend sorting or return as is.
    return c.json({ entries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return c.json({ error: 'Failed to fetch entries' }, 500);
  }
})

app.post('/make-server-815bcb4c/entries', async (c) => {
  try {
    const { entry, oldNickname } = await c.req.json();
    
    if (!entry || !entry.nickname) {
      return c.json({ error: 'Nickname is required' }, 400);
    }

    const newKey = getKey(entry.nickname);
    
    // Check uniqueness if nickname is new or changed
    const isNicknameChanged = oldNickname && getKey(oldNickname) !== newKey;
    const isNewEntry = !oldNickname;

    if (isNewEntry || isNicknameChanged) {
      const existing = await kv.get(newKey);
      if (existing) {
        return c.json({ error: `Nickname "${entry.nickname}" is already taken! Please choose another.` }, 409);
      }
    }

    // If nickname changed, delete old key
    if (isNicknameChanged) {
      await kv.del(getKey(oldNickname));
    }

    // Save new entry
    await kv.set(newKey, entry);

    return c.json({ success: true, entry });
  } catch (error) {
    console.error('Error saving entry:', error);
    return c.json({ error: 'Failed to save entry' }, 500);
  }
})

app.post('/make-server-815bcb4c/upload', async (c) => {
  try {
    const supabase = getSupabase(Deno.env.toObject());
    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b: any) => b.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false, // Private bucket as per instructions
        fileSizeLimit: 5242880, // 5MB
      });
    }

    // Upload file
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload image' }, 500);
    }

    // Get Signed URL (valid for 10 years ~ 315360000 seconds for simplicity, or 1 year)
    // Actually standard signed URLs expire. 
    // If we want persistent URLs in our KV store, we should technically generate them on read.
    // BUT, the `entries` endpoint is just returning JSON.
    // To solve this properly:
    // 1. Store the `path` (fileName) in the KV store entry, not the full URL.
    // 2. In `GET /entries`, iterate and sign URLs? That's slow for many entries.
    // Alternative: Public bucket.
    // Instructions say: "provide the frontend with signed URLs via .createSignedUrl() because the buckets are private."
    // Okay, so I should probably store the `path` in KV, and resign on fetch?
    // Or just generate a long-lived signed URL (e.g. 1 week) and return it.
    // Let's generate a signed URL for 1 year (31536000 seconds).
    
    const { data: signedData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000);

    return c.json({ url: signedData?.signedUrl });
  } catch (error) {
    console.error('Error in upload:', error);
    return c.json({ error: 'Server upload failed' }, 500);
  }
})

Deno.serve(app.fetch)
