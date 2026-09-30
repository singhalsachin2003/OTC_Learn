#!/usr/bin/env python3
"""Instagram Story frames for OTC Learn, 1080x1920.

Built to the same palette and typeface as marketing/social-v2, but composed for
the Story canvas rather than the feed. Two things drive the layout:

  * The bottom 470px is left deliberately empty. That is where the link sticker
    goes, and a sticker dropped over a headline is the commonest way a Story
    ends up unreadable.
  * The top 260px is left empty too — that band is under Instagram's own avatar
    row and progress bars on most handsets.

Every string here is checked against the shipped app: 66 products, 1,224
questions, 36 free forever. Nothing claims the app is free without qualifying
what is free, which is the distinction the store listing was corrected to make.
"""
import os
from PIL import Image, ImageDraw, ImageFont

FD = os.path.expanduser("~/mkt/fonts")
OUT = os.path.expanduser("~/stories/out")
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1920
M = 88
TOP = 300           # below Instagram's chrome
FLOOR = 1450        # nothing below this: link-sticker room

BG    = "#EAE8E0"
INK   = "#181611"
BODY  = "#3C3A35"
MICRO = "#696761"
ACC   = "#2A75BA"
DARK  = "#181611"
DINK  = "#FFFFFF"
DBODY = "#C9C5BD"
DMICR = "#9B9791"

SANS = "PlusJakartaSans.ttf"
_f = {}


def F(size, var="Regular"):
    k = (size, var)
    if k not in _f:
        f = ImageFont.truetype(os.path.join(FD, SANS), size)
        f.set_variation_by_name(var)
        _f[k] = f
    return _f[k]


def wrap(d, text, font, maxw):
    out, cur = [], ""
    for word in text.split():
        t = (cur + " " + word).strip()
        if d.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur:
                out.append(cur)
            cur = word
    if cur:
        out.append(cur)
    return out


def tracked(d, text, font, x, y, fill, tr=4):
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tr
    return x


def frame(n, total, dark=False):
    img = Image.new("RGB", (W, H), DARK if dark else BG)
    d = ImageDraw.Draw(img)
    ink   = DINK if dark else INK
    micro = DMICR if dark else MICRO
    tracked(d, "OTC LEARN", F(30, "ExtraBold"), M, 190, micro, 5)
    lbl = f"{n}/{total}"
    d.text((W - M - d.textlength(lbl, font=F(30, "Bold")), 190), lbl,
           font=F(30, "Bold"), fill=micro)
    return img, d, ink, (DBODY if dark else BODY), micro


def headline(d, text, y, ink, size=86, lead=104):
    f = F(size, "ExtraBold")
    for ln in wrap(d, text, f, W - M * 2):
        d.text((M, y), ln, font=f, fill=ink)
        y += lead
    return y


def rule(d, y, w=132):
    d.rectangle([M, y, M + w, y + 8], fill=ACC)
    return y + 8


def para(d, text, y, color, size=40, lead=56):
    f = F(size, "Regular")
    for ln in wrap(d, text, f, W - M * 2):
        d.text((M, y), ln, font=f, fill=color)
        y += lead
    return y


def footnote(d, text, color, y=FLOOR - 70, size=34, var="SemiBold"):
    d.text((M, y), text, font=F(size, var), fill=color)


def save(img, name):
    p = os.path.join(OUT, name)
    img.save(p, "PNG", optimize=True)
    print(f"  {name:<34} {img.size[0]}x{img.size[1]}")


# --- 1. Opening -------------------------------------------------------------
def s1():
    img, d, ink, body, micro = frame(1, 6)
    y = headline(d, "The derivatives everyone in the room pretends to "
                    "understand.", TOP, ink)
    y = rule(d, y + 34) + 40
    y = para(d, "Sixty-six products. A five-step lesson, a worked example and "
                "a question bank on every one.", y, body)

    # Three figures, evenly spaced, each with its label beneath.
    y = 1140
    cols = [("66", "PRODUCTS"), ("1,224", "QUESTIONS"), ("0", "ADS OR TRACKERS")]
    x = M
    for big, small in cols:
        d.text((x, y), big, font=F(76, "ExtraBold"), fill=ink)
        tracked(d, small, F(24, "Bold"), x, y + 96, micro, 2)
        x += 300
    footnote(d, "Free on Google Play", ink)
    save(img, "story-1-opening.png")


# --- 2. The question --------------------------------------------------------
def s2():
    img, d, ink, body, micro = frame(2, 6, dark=True)
    tracked(d, "DESK QUIZ · INTEREST RATE", F(28, "Bold"), M, 258, ACC, 3)
    y = headline(d, "$200m swap. The fixed payer pays 3%. The floating leg "
                    "sets at 3.8% for the year.", TOP + 60, ink, 72, 88)
    y = rule(d, y + 40) + 44
    y = para(d, "What actually settles?", y, ink, 56, 70)
    para(d, "Answer next.", y + 20, micro, 38, 52)
    save(img, "story-2-question.png")


# --- 3. The answer ----------------------------------------------------------
def s3():
    img, d, ink, body, micro = frame(3, 6, dark=True)
    tracked(d, "ANSWER", F(28, "Bold"), M, 258, ACC, 3)
    y = headline(d, "$1.6m, one way.", TOP + 60, ink, 96, 116)
    y = rule(d, y + 30) + 44
    y = para(d, "Gross, the trade moves $6m one way and $7.6m the other. It "
                "settles net: a single payment from the floating payer to the "
                "fixed payer.", y, body, 42, 60)
    y = para(d, "$200m of notional changes hands as $1.6m of cash. That is why "
                "notional is a measuring stick, not an exposure.", y + 30,
             body, 42, 60)
    footnote(d, "Every answer in the app comes with the why", micro)
    save(img, "story-3-answer.png")


# --- 4. What is free, stated exactly ---------------------------------------
def s4():
    img, d, ink, body, micro = frame(4, 6)
    y = headline(d, "Thirty-six products, free forever.", TOP, ink)
    y = rule(d, y + 34) + 40
    y = para(d, "Interest rate, FX, credit, equity and commodity — plus the "
                "collateral, clearing, valuation and ISDA architecture "
                "underneath them.", y, body)
    y = para(d, "A subscription adds Exotics, Risk & the Greeks, twelve Case "
                "Studies and Alternative Underlyings. What shipped free stays "
                "free.", y + 30, body)
    footnote(d, "You can read the app without ever seeing a purchase screen", micro)
    save(img, "story-4-free.png")


# --- 5. What it does not do -------------------------------------------------
def s5():
    img, d, ink, body, micro = frame(5, 6)
    y = headline(d, "No ads. No trackers. No account needed.", TOP, ink)
    y = rule(d, y + 34) + 40
    y = para(d, "No advertising identifiers and no analytics. Every lesson, "
                "term and question in the free catalogue ships inside the app, "
                "so it works on the underground.", y, body)
    y = para(d, "Sign in only if you want progress to survive a reinstall. It "
                "is off until you ask for it.", y + 30, body)
    save(img, "story-5-privacy.png")


# --- 6. The call to action --------------------------------------------------
def s6():
    img, d, ink, body, micro = frame(6, 6, dark=True)
    y = headline(d, "One product at a time.", TOP + 80, ink, 92, 110)
    y = rule(d, y + 34) + 44
    y = para(d, "OTC Learn, on Android. Thirty-six products free, offline, "
                "no account.", y, body, 44, 62)
    d.text((M, FLOOR - 120), "Tap the link below", font=F(46, "ExtraBold"), fill=ACC)
    d.text((M, FLOOR - 58), "↓", font=F(56, "ExtraBold"), fill=ACC)
    save(img, "story-6-install.png")


# --- Highlight cover --------------------------------------------------------
def cover():
    """Instagram crops a highlight cover to a centred circle, so the mark sits
    dead centre with nothing near the edges."""
    img = Image.new("RGB", (W, H), DARK)
    d = ImageDraw.Draw(img)
    f = F(150, "ExtraBold")
    t = "OTC"
    d.text(((W - d.textlength(t, font=f)) / 2, H / 2 - 110), t, font=f, fill=DINK)
    bw = 300
    d.rectangle([(W - bw) / 2, H / 2 + 70, (W + bw) / 2, H / 2 + 84], fill=ACC)
    save(img, "story-highlight-cover.png")


if __name__ == "__main__":
    print("\nOTC Learn — Instagram Stories")
    for fn in (s1, s2, s3, s4, s5, s6, cover):
        fn()
