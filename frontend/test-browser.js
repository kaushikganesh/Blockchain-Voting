import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  const content = await page.content();
  console.log("HTML length:", content.length);
  const rootContent = await page.$eval('#root', el => el.innerHTML);
  import('fs').then(fs => fs.writeFileSync('test-output.html', rootContent));
  console.log("Root content inside #root:", rootContent.length);

  await browser.close();
})();
