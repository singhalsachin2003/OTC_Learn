/**
 * Push the store listing text in `STORE_LISTING.md` to Play. Run with
 * `npm run sync:listing` — which changes nothing — and `-- --commit` to publish.
 *
 * ```bash
 * npm run sync:listing              # diff the doc against what is live
 * npm run sync:listing -- --commit  # send the doc's text to Play for review
 * ```
 *
 * **Why this exists.** This repo is where the drift did real damage. The custom
 * store listing sat on an August snapshot from 17 August to 27 September saying
 * "Twenty products across five asset classes" when there were thirty-six, and
 * missing the Market Foundations class entirely — so anyone who searched ISDA,
 * XVA, collateral or central clearing, all of which are in its 500-keyword
 * target list, was shown a listing that never used the word. Six weeks, and
 * nothing compared the copy in this repo against the copy in the console.
 *
 * Cornerstone had the mirror image on 27 September: a live description 1,080
 * characters shorter than its doc, missing the sections that explained the
 * subscription it had been selling since v1.1. Same cause both times.
 *
 * Ported from Cornerstone on 2026-09-27, in JavaScript because this repo's
 * scripts are. Two differences, both in where things live: the package, and the
 * doc is `STORE_LISTING.md` at the repo root rather than under `docs/`.
 *
 * **It does not touch custom store listings.** No Play API reaches them — they
 * are Console-only. After committing here, open Grow users → Store presence →
 * Store listings and bring each custom listing into step by hand, in the same
 * sitting. A custom listing is a copy, not an overlay: it keeps its old text
 * silently until somebody edits it. That is exactly how this repo lost six
 * weeks.
 */
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC = join(HERE, '..', 'STORE_LISTING.md');

const PACKAGE = 'com.otclearn.app';
const KEY_PATH = join(
  homedir(),
  '.config',
  'otc-learn',
  'play-service-account.json',
);
const API =
  'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';
const LANGUAGE = 'en-GB';

const LIMITS = { title: 30, shortDescription: 80, fullDescription: 4000 };
const HEADINGS = {
  title: '### App name',
  shortDescription: '### Short description',
  fullDescription: '### Full description',
};

const commit = process.argv.includes('--commit');

/** The first fenced block under a heading. The doc is the source of truth. */
function block(markdown, heading) {
  const at = markdown.indexOf(heading);
  if (at === -1) throw new Error(`STORE_LISTING.md has no "${heading}" heading`);
  const fence = /```\n([\s\S]*?)\n```/.exec(markdown.slice(at));
  if (!fence) throw new Error(`no fenced block under "${heading}"`);
  return fence[1];
}

const base64url = (value) =>
  Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString(
    'base64url',
  );

async function accessToken() {
  const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
  const issued = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url({ alg: 'RS256', typ: 'JWT' })}.${base64url({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/androidpublisher',
    aud: 'https://oauth2.googleapis.com/token',
    exp: issued + 3600,
    iat: issued,
  })}`;
  const signature = createSign('RSA-SHA256')
    .update(unsigned)
    .sign(key.private_key, 'base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const body = await response.json();
  if (!body.access_token)
    throw new Error(`Token exchange failed: ${JSON.stringify(body)}`);
  return body.access_token;
}

async function call(url, token, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${response.status} ${url}\n${text}`);
  return text ? JSON.parse(text) : {};
}

async function main() {
  const doc = readFileSync(DOC, 'utf8');
  const wanted = Object.fromEntries(
    Object.entries(HEADINGS).map(([field, heading]) => [
      field,
      block(doc, heading),
    ]),
  );

  // Over a limit is rejected on commit anyway; say so before touching the API.
  let refused = false;
  for (const [field, limit] of Object.entries(LIMITS)) {
    if (wanted[field].length > limit) {
      console.error(
        `✗ ${field} is ${wanted[field].length} characters, over Play's ${limit}`,
      );
      refused = true;
    }
  }
  if (refused) process.exit(1);

  const token = await accessToken();
  const edit = await call(`${API}/${PACKAGE}/edits`, token, { method: 'POST' });

  try {
    const live = await call(
      `${API}/${PACKAGE}/edits/${edit.id}/listings/${LANGUAGE}`,
      token,
    );
    const changed = Object.keys(LIMITS).filter(
      (f) => (live[f] ?? '') !== wanted[f],
    );

    for (const field of Object.keys(LIMITS)) {
      const mark = changed.includes(field) ? '~' : ' ';
      console.log(
        `${mark} ${field}: live ${(live[field] ?? '').length} → doc ${wanted[field].length} (limit ${LIMITS[field]})`,
      );
    }

    if (changed.length === 0) {
      console.log('\nThe listing already matches the doc. Nothing to do.');
    } else if (!commit) {
      console.log(
        `\n${changed.length} field(s) differ. Re-run with --commit to send them for review.`,
      );
    } else {
      await call(`${API}/${PACKAGE}/edits/${edit.id}/listings/${LANGUAGE}`, token, {
        method: 'PUT',
        body: JSON.stringify({ language: LANGUAGE, ...wanted }),
      });
      await call(`${API}/${PACKAGE}/edits/${edit.id}:commit`, token, {
        method: 'POST',
      });
      console.log(
        `\nCommitted ${changed.join(', ')}. Play reviews listing changes before they appear.`,
      );
      console.log(
        'Now bring the custom store listing "Keywords" into step by hand — the API cannot.',
      );
      return;
    }
  } finally {
    if (!commit) {
      await fetch(`${API}/${PACKAGE}/edits/${edit.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
