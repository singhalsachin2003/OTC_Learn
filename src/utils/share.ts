import { Share } from 'react-native';

import { shareUrl } from '../data/links';
import { track, type ShareSurface } from './analytics';

/**
 * What a shared product says. Written in the sharer's voice, because it lands
 * in their chat under their name — a line of app marketing pasted there reads
 * as something they did not write.
 */
export function productShareMessage(name: string, hook: string): string {
  return `${name} — ${hook}\n\nI am learning OTC derivatives with OTC Learn: ${shareUrl()}`;
}

/** What a shared quiz result says. Same voice, and the score is the point. */
export function resultShareMessage(
  name: string,
  score: number,
  total: number,
): string {
  return `I scored ${score}/${total} on ${name} in OTC Learn.\n\n${shareUrl()}`;
}

/**
 * The share sheet, funnelled through one module.
 *
 * Sharing is the only referral loop the app has that costs nothing, and it is
 * also entirely optional to the user: dismissing the sheet is a normal outcome,
 * not a failure. So this swallows everything — a device with no share targets
 * rejects the call, and an unhandled rejection from a tap that the user
 * deliberately cancelled would be absurd.
 *
 * The event is recorded on the attempt rather than the result. Android reports
 * every dismissal as a share and names no target, so "who they sent it to" and
 * "whether they went through with it" are questions this cannot answer, and
 * pretending otherwise would put a number in the sink that means nothing.
 */
export async function shareText(
  message: string,
  surface: ShareSurface,
): Promise<void> {
  track({ name: 'content_shared', surface });
  try {
    await Share.share({ message });
  } catch {
    // Nothing to do — the user keeps the screen they were on.
  }
}
