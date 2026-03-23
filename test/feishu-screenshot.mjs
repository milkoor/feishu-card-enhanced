import { chromium } from 'playwright';

const CHAT_ID = 'oc_fb5466a176c6ba097c0e331daf8fff1e';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  try {
    console.log('Opening Feishu web app...');
    await page.goto('https://feishu.cn');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: '/tmp/feishu-01-home.png' });
    console.log('Screenshot saved: /tmp/feishu-01-home.png');
    
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if we need to log in
    const url = page.url();
    console.log('Current URL:', url);
    
    if (url.includes('login') || url.includes('passport')) {
      console.log('⚠️ Login required. Please log in manually in the browser window.');
      console.log('After logging in, navigate to the chat and press Enter here.');
      console.log('URL format: https://feishu.cn/client/#/chat/' + CHAT_ID);
      await page.waitForTimeout(60000); // Wait 60 seconds
    } else {
      console.log('Already logged in. Navigating to chat...');
      await page.goto(`https://feishu.cn/client/#/chat/${CHAT_ID}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '/tmp/feishu-02-chat.png' });
      console.log('Screenshot saved: /tmp/feishu-02-chat.png');
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/tmp/feishu-error.png' });
    console.log('Error screenshot: /tmp/feishu-error.png');
  }
  
  await browser.close();
  console.log('Done.');
}

main().catch(console.error);
