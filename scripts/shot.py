"""Screenshot one section of the site at desktop and mobile widths, plus layout checks.

Usage: python scripts/shot.py <url> <section-id>
  e.g. python scripts/shot.py http://localhost:5173/#/ projects
       python scripts/shot.py https://eason-site-xi.vercel.app/#/ projects

Needs Playwright for Python (pip install playwright) and a local Chrome install.
Writes desktop.png and mobile.png to <temp dir>/eason-site-shots/ and prints the paths.
"""

import sys
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

VIEWPORTS = [('desktop', 1440, 900, 1), ('mobile', 390, 844, 2)]

# Runs in the page. Keep this file ASCII-only: a raw middle dot here once broke the Python source encoding.
CHECKS = '''(id) => {
  const sec = document.getElementById(id)
  const list = sec.querySelector('ul')
  return {
    overflowX: document.documentElement.scrollWidth > innerWidth,
    gridColumns: list ? getComputedStyle(list).gridTemplateColumns : null,
    smallTapTargets: [...sec.querySelectorAll('a, button')]
      .filter((el) => el.getBoundingClientRect().height < 44)
      .map((el) => el.innerText.split('\\n')[0]),
  }
}'''


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    url, section_id = sys.argv[1], sys.argv[2]
    out = Path(tempfile.gettempdir()) / 'eason-site-shots'
    out.mkdir(exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome')
        for name, width, height, scale in VIEWPORTS:
            page = browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=scale)
            errors = []
            page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
            page.on('pageerror', lambda e: errors.append(f'pageerror: {e}'))
            page.goto(url, wait_until='networkidle')

            # The sticky site header otherwise gets painted into the middle of an element screenshot
            page.add_style_tag(content='header { position: static !important; }')

            section = page.locator(f'#{section_id}')
            section.scroll_into_view_if_needed()
            page.wait_for_timeout(1500)  # let whileInView entrance animations finish
            path = out / f'{name}.png'
            section.screenshot(path=str(path))

            print(name, path, page.evaluate(CHECKS, section_id), 'errors:', errors)
            page.close()
        browser.close()


if __name__ == '__main__':
    main()
