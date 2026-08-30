#!/usr/bin/env python3
"""Capture both family-trip apps after loading and decoding every image."""

import argparse
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
APPS = ("istanbul-family-trip-2027", "dubai-family-trip-2027")
VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "mobile": {"width": 390, "height": 844},
}


def load_every_image(page):
    page.evaluate(
        """
        async () => {
          const step = Math.max(480, Math.floor(window.innerHeight * 0.75));
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 90));
          }
          window.scrollTo(0, 0);
        }
        """
    )
    page.evaluate(
        """
        async () => {
          const images = [...document.images];
          await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
        }
        """
    )
    page.wait_for_timeout(1800)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-origin", default="http://127.0.0.1:8765")
    parser.add_argument("--scope", default="family-trip-parity-v8")
    return parser.parse_args()


def main():
    args = parse_args()
    output = ROOT / ".omx" / "visual" / args.scope
    output.mkdir(parents=True, exist_ok=True)
    failures = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path=CHROME,
            headless=True,
            args=["--no-sandbox"],
        )
        for app in APPS:
            for mode, viewport in VIEWPORTS.items():
                page = browser.new_page(viewport=viewport, locale="ko-KR")
                page.goto(f"{args.base_origin.rstrip('/')}/{app}/", wait_until="networkidle")
                page.wait_for_selector(".place-card img")
                load_every_image(page)
                broken = page.locator("img").evaluate_all(
                    "imgs => imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc || img.src)"
                )
                overflow = page.evaluate(
                    "document.documentElement.scrollWidth > document.documentElement.clientWidth"
                )
                page.screenshot(path=output / f"{app.split('-')[0]}-{mode}-scrolled.png", full_page=True)
                print(f"{app} {mode}: broken_images={len(broken)} horizontal_overflow={overflow}")
                failures.extend(f"{app} {mode}: {url}" for url in broken)
                if overflow:
                    failures.append(f"{app} {mode}: horizontal overflow")
                page.close()
        browser.close()
    if failures:
        print("\n".join(failures))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
