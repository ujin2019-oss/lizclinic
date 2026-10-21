let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('../.tools/node_modules/playwright')); }
const fs = require('node:fs');
const assert = require('node:assert/strict');
const sizes = [360, 390, 768, 1024, 1440, 1920];
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  for (const width of sizes) {
    const directory = `.qa/v2/${width}`;
    fs.mkdirSync(directory, { recursive: true });
    const page = await browser.newPage({ viewport: { width, height: width < 768 ? 844 : 1000 }, isMobile: width < 768, hasTouch: width < 768 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1100);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 650) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await page.waitForTimeout(70);
    }
    await page.waitForTimeout(700);
    await page.evaluate(async () => { await Promise.all([...document.images].filter(i => !i.closest('[hidden]')).map(i => i.decode())); });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow ${width}`);
    assert.equal(await page.locator('main > section').count(), 9, 'Main sections');
    assert(await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
      return new Set(ids).size === ids.length && [...document.querySelectorAll('a[href^="#"]')].every(el => document.getElementById(el.hash.slice(1)));
    }), 'IDs and anchor targets');
    for (const section of ['philosophy', 'signature', 'experience', 'before-after', 'space', 'reservation', 'location']) {
      await page.locator(`#${section}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(650);
      await page.locator(`#${section}`).screenshot({ path: `${directory}/${section}.png`, style: '.site-header,.mobile-contact-bar,.skip-link{visibility:hidden!important}' });
    }
    // All concern categories, existing details, and focus behavior stay working.
    for (let i = 0; i < 4; i++) {
      await page.getByRole('tab').nth(i).click();
      const panel = page.getByRole('tabpanel');
      assert.equal(await panel.locator('article').count(), 3);
      await panel.locator('img').evaluateAll(images => Promise.all(images.map(i => i.decode())));
    }
    await page.locator('[data-select-category="pigment"]').click();
    assert.equal(await page.locator('#tab-pigment').getAttribute('aria-selected'), 'true');
    await page.locator('#tab-pigment').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#tab-texture').getAttribute('aria-selected'), 'true');
    const detail = page.getByRole('tabpanel').locator('[data-detail]').first();
    await detail.click();
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      assert(await page.locator('#info-dialog').evaluate(el => el.contains(document.activeElement)), 'Focus contained');
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(80);
    assert(await detail.evaluate(el => document.activeElement === el), 'Focus restored');
    for (const [selector, title] of [['#reservation [data-consult]', '상담 및 예약 안내'], ['#reservation [data-phone]', '전화 문의 안내'], ['[data-privacy]', '개인정보 관련 안내'], ['[data-portfolio]', '포트폴리오 안내'], ['[data-location]', '가상 위치 안내']]) {
      const trigger = page.locator(selector).first();
      await trigger.click();
      assert.equal(await page.locator('#dialog-title').textContent(), title);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(70);
      assert(await trigger.evaluate(el => document.activeElement === el));
    }
    // Comparison responds to actual mouse input as well as keyboard input.
    const slider = page.locator('#compare-range');
    await slider.scrollIntoViewIfNeeded();
    const rect = await slider.boundingBox();
    await page.mouse.move(rect.x + rect.width * .2, rect.y + rect.height / 2);
    await page.mouse.down();
    await page.mouse.move(rect.x + rect.width * .8, rect.y + rect.height / 2, { steps: 10 });
    await page.mouse.up();
    assert(Number(await slider.inputValue()) > 70, 'Mouse comparison drag');
    const beforeKey = Number(await slider.inputValue());
    await slider.focus();
    await page.keyboard.press('ArrowLeft');
    assert(Number(await slider.inputValue()) < beforeKey, 'Keyboard comparison');
    await page.keyboard.press('Home');
    assert.equal(await slider.inputValue(), '0');
    await page.keyboard.press('End');
    assert.equal(await slider.inputValue(), '100');
    if (width < 1200) {
      await page.locator('.menu-toggle').click();
      assert(await page.locator('#mobile-menu').isVisible());
      assert(await page.locator('body').evaluate(el => el.classList.contains('is-locked')));
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false');
      await page.locator('.menu-toggle').click();
      await page.locator('#mobile-menu a[href="#space"]').click();
      assert(!(await page.locator('#mobile-menu').isVisible()));
    }
    if (width < 768) {
      const cdp = await page.context().newCDPSession(page);
      const swipe = async (box, start, end, relativeY) => {
        const y = box.y + relativeY;
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width * start, y }] });
        for (let n = 1; n <= 8; n++) await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{ x: box.x + box.width * (start + (end - start) * n / 8), y }]});
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      };
      await slider.scrollIntoViewIfNeeded();
      const touchRect = await slider.boundingBox();
      await swipe(touchRect, .25, .72, touchRect.height / 2);
      await page.waitForTimeout(150);
      const value = Number(await slider.inputValue());
      assert(value > 60 && value < 85, `Touch comparison ${value}`);
      const track = page.getByRole('tabpanel').locator('.treatment-track');
      await track.scrollIntoViewIfNeeded();
      await swipe(await track.boundingBox(), .8, .15, 120);
      await page.waitForTimeout(600);
      assert(await track.evaluate(el => el.scrollLeft > 0), 'Card swipe');
      await page.locator('.mobile-contact-bar [data-consult]').click();
      assert(await page.locator('#info-dialog').isVisible());
      await page.keyboard.press('Escape');
      await page.waitForTimeout(80);
      const bar = await page.locator('.mobile-contact-bar').boundingBox();
      assert.equal(Math.round(bar.y + bar.height), 844, 'Bottom bar anchored');
      assert(bar.height >= 64);
      await page.locator('.footer-bottom a').scrollIntoViewIfNeeded();
      const footerLink = await page.locator('.footer-bottom a').boundingBox();
      assert(footerLink.y + footerLink.height <= bar.y, 'Footer not covered by contact bar');
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `${directory}/full.png`, fullPage: true });
    await page.screenshot({ path: `${directory}/hero.png` });
    assert.deepEqual(errors, []);
    results.push({ width, overflow: false, images: 'pass', tabs: '4/4', mouseAndKeyboardComparison: 'pass', touchComparison: width < 768 ? 'pass' : 'not applicable', menu: width < 1200 ? 'pass' : 'desktop', modalsAndFocus: 'pass', errors });
    console.log(`PASS ${width}`);
    await page.close();
  }
  const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 390, height: 640 }, isMobile: true });
  await reduced.goto('http://127.0.0.1:4173');
  assert.equal(await reduced.locator('.is-pending').count(), 0);
  await reduced.locator('.menu-toggle').click();
  await reduced.locator('#mobile-menu a[href="#location"]').click();
  assert(!(await reduced.locator('#mobile-menu').isVisible()), 'Short screen menu');
  await browser.close();
  fs.writeFileSync('.qa/v2/results.json', JSON.stringify({ results, reducedMotion: 'pass', shortScreenMenu: 'pass' }, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
