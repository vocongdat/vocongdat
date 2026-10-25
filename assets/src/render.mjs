// Renders each card in cards.html to ../<name>.png at 2x.
// Usage: npm i puppeteer-core && node render.mjs [hero about ...]
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';

const names = process.argv.slice(2).length ? process.argv.slice(2)
  : ['hero', 'about', 'experience', 'work', 'toolkit', 'contact'];
const src = new URL('cards.html', import.meta.url).href;
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage();
await page.setViewport({ width: 1000, height: 1000, deviceScaleFactor: 2 });
for (const name of names) {
  await page.goto(`${src}#${name}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const card = await page.$(`#${name} .card`);
  const path = fileURLToPath(new URL(`../${name}.png`, import.meta.url));
  await card.screenshot({ path, omitBackground: true });
  console.log(name, (await card.boundingBox()).height);
}
await browser.close();
