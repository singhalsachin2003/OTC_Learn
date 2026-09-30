#!/usr/bin/env python3
"""The six Story frames, re-composed for the Instagram feed at 1080x1350.

Same content, different canvas. Stories are 9:16 with a dead band at the foot for
the link sticker; the feed caps at 4:5 and has no sticker, so the type scale comes
down, the margins tighten, and frame 6 points at the bio instead of at a sticker.
Nothing here claims the app is free without saying what is free.
"""
import os
from PIL import Image, ImageDraw, ImageFont

FD = os.path.expanduser("~/mkt/fonts")
OUT = os.path.expanduser("~/stories/feed")
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1350
M = 84
TOP = 210
FLOOR = 1250

BG, INK, BODY, MICRO, ACC = "#EAE8E0", "#181611", "#3C3A35", "#696761", "#2A75BA"
DARK, DINK, DBODY, DMICR = "#181611", "#FFFFFF", "#C9C5BD", "#9B9791"
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
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur:
                out.append(cur)
            cur = w
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
    ink, micro = (DINK, DMICR) if dark else (INK, MICRO)
    tracked(d, "OTC LEARN", F(27, "ExtraBold"), M, 108, micro, 4.5)
    lbl = f"{n}/{total}"
    d.text((W - M - d.textlength(lbl, font=F(27, "Bold")), 108), lbl,
           font=F(27, "Bold"), fill=micro)
    return img, d, ink, (DBODY if dark else BODY), micro


def headline(d, text, y, ink, size=72, lead=86):
    f = F(size, "ExtraBold")
    for ln in wrap(d, text, f, W - M * 2):
        d.text((M, y), ln, font=f, fill=ink)
        y += lead
    return y


def rule(d, y, w=116):
    d.rectangle([M, y, M + w, y + 7], fill=ACC)
    return y + 7


def para(d, text, y, color, size=36, lead=50):
    f = F(size, "Regular")
    for ln in wrap(d, text, f, W - M * 2):
        d.text((M, y), ln, font=f, fill=color)
        y += lead
    return y


def footnote(d, text, color, size=30, var="SemiBold"):
    d.text((M, FLOOR - 46), text, font=F(size, var), fill=color)


def save(img, name):
    p = os.path.join(OUT, name)
    img.save(p, "PNG", optimize=True)
    print(f"  {name:<30} {img.size[0]}x{img.size[1]}")


def s1():
    img, d, ink, body, micro = frame(1, 6)
    y = headline(d, "The derivatives everyone in the room pretends to understand.", TOP, ink)
    y = rule(d, y + 28) + 34
    y = para(d, "Sixty-six products. A five-step lesson, a worked example and a "
                "question bank on every one.", y, body)
    y = 940
    x = M
    for big, small in (("66", "PRODUCTS"), ("1,224", "QUESTIONS"), ("0", "ADS OR TRACKERS")):
        d.text((x, y), big, font=F(64, "ExtraBold"), fill=ink)
        tracked(d, small, F(21, "Bold"), x, y + 82, micro, 1.8)
        x += 300
    footnote(d, "Free on Google Play", ink)
    save(img, "feed-1-opening.png")


def s2():
    img, d, ink, body, micro = frame(2, 6, dark=True)
    tracked(d, "DESK QUIZ · INTEREST RATE", F(25, "Bold"), M, 168, ACC, 2.5)
    y = headline(d, "$200m swap. The fixed payer pays 3%. The floating leg sets "
                    "at 3.8% for the year.", TOP + 60, ink, 62, 76)
    y = rule(d, y + 34) + 38
    y = para(d, "What actually settles?", y, ink, 48, 60)
    para(d, "Answer next.", y + 16, micro, 34, 46)
    save(img, "feed-2-question.png")


def s3():
    img, d, ink, body, micro = frame(3, 6, dark=True)
    tracked(d, "ANSWER", F(25, "Bold"), M, 168, ACC, 2.5)
    y = headline(d, "$1.6m, one way.", TOP + 50, ink, 82, 98)
    y = rule(d, y + 26) + 38
    y = para(d, "Gross, the trade moves $6m one way and $7.6m the other. It settles "
                "net: a single payment from the floating payer to the fixed payer.",
             y, body, 38, 54)
    y = para(d, "$200m of notional changes hands as $1.6m of cash. That is why "
                "notional is a measuring stick, not an exposure.", y + 26, body, 38, 54)
    footnote(d, "Every answer in the app comes with the why", micro)
    save(img, "feed-3-answer.png")


def s4():
    img, d, ink, body, micro = frame(4, 6)
    y = headline(d, "Thirty-six products, free forever.", TOP, ink)
    y = rule(d, y + 28) + 34
    y = para(d, "Interest rate, FX, credit, equity and commodity — plus the collateral, "
                "clearing, valuation and ISDA architecture underneath them.", y, body)
    y = para(d, "A subscription adds Exotics, Risk & the Greeks, twelve Case Studies "
                "and Alternative Underlyings. What shipped free stays free.", y + 26, body)
    footnote(d, "You can read the app without ever seeing a purchase screen", micro)
    save(img, "feed-4-free.png")


def s5():
    img, d, ink, body, micro = frame(5, 6)
    y = headline(d, "No ads. No trackers. No account needed.", TOP, ink)
    y = rule(d, y + 28) + 34
    y = para(d, "No advertising identifiers and no analytics. Every lesson, term and "
                "question in the free catalogue ships inside the app, so it works on "
                "the underground.", y, body)
    y = para(d, "Sign in only if you want progress to survive a reinstall. It is off "
                "until you ask for it.", y + 26, body)
    save(img, "feed-5-privacy.png")


def s6():
    img, d, ink, body, micro = frame(6, 6, dark=True)
    y = headline(d, "One product at a time.", TOP + 60, ink, 80, 96)
    y = rule(d, y + 28) + 38
    y = para(d, "OTC Learn, on Android. Thirty-six products free, offline, no account.",
             y, body, 40, 56)
    d.text((M, FLOOR - 96), "Link in bio", font=F(42, "ExtraBold"), fill=ACC)
    save(img, "feed-6-install.png")


if __name__ == "__main__":
    print("\nOTC Learn — feed carousel, 4:5")
    for fn in (s1, s2, s3, s4, s5, s6):
        fn()
