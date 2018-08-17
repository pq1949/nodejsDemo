const puppeteer = require('puppeteer')

async function screenshot () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const option = {
    path: 'github.png',
    fullPage: true
  }
  await page.goto('https://github.com/trending')
  await page.screenshot(option)

  browser.close()
}

screenshot()
