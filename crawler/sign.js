const puppeteer = require('puppeteer')
const moment = require('moment')
const TIME_SCHEDULE = 1000 * 60 * 60 * 24 - 1000 * 30
let timeId = setTimeout(sign, TIME_SCHEDULE)

async function sign () {
  const USER_NAME = ''
  const PASSWORD = ''
  const TARGET_URL = 'https://sign-daily-completion.sdp.101.com/#/login'
  const TARGET_URL_SIGN = 'https://sign-daily-completion.sdp.101.com/#/sign'
  const TARGET_URL_DAILY = 'https://sign-daily-completion.sdp.101.com/#/daily'
  const USERNAME_SELECTOR = '#container > div.login > div.login-form > form > ul > li:nth-child(1) > label > input'
  const PASSWORD_SELECTOR = '#container > div.login > div.login-form > form > ul > li:nth-child(2) > label > input'
  const BUTTON_SELECTOR = '#container > div.login > div.login-form > form > div > button'

  const browser = await puppeteer.launch({
    // headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.goto(TARGET_URL)

  await page.click(USERNAME_SELECTOR)
  await page.keyboard.type(USER_NAME)

  await page.click(PASSWORD_SELECTOR)
  await page.keyboard.type(PASSWORD)

  await page.click(BUTTON_SELECTOR)

  const option = {
    fullPage: true
  }
  const TIME_FORMAT = 'YYYYMMDD-HHmmss'
  const TIME_GAP = 5 * 1000
  const IMAGE_FOLDER = './record/'

  await page.waitForNavigation()
  await page.waitFor(TIME_GAP)
  option.path = IMAGE_FOLDER + moment().format(TIME_FORMAT) + '-sign.png'
  await page.screenshot(option)

  await page.goto(TARGET_URL_DAILY)
  await page.waitFor(TIME_GAP)
  option.path = IMAGE_FOLDER + moment().format(TIME_FORMAT) + '-daily.png'
  await page.screenshot(option)


  browser.close()

  timeId && clearTimeout(timeId)
  console.log('sing finished at ' + new Date())
  timeId = setTimeout(sign, TIME_SCHEDULE)
}
