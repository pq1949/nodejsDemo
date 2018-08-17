
const puppeteer = require('puppeteer')
const CREDS = require('./creds')
const User = require('./models/user')
const moment =require('moment')

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

async function logUserEmail (listLength, page) {
  // const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(1) > div.d-flex > div > a';
  const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a';
  // const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(2) > div.d-flex > div > ul > li:nth-child(2) > a';
  const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > ul > li:nth-child(2) > a';

  for (let i = 1; i <= listLength; i++) {
    // change the index to the next child
    let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i)
    let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i)

    let username = await page.evaluate((sel) => {
      return document.querySelector(sel).getAttribute('href').replace('/', '')
    }, usernameSelector)

    let email = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.innerHTML : null
    }, emailSelector)

    // not all users have emails visible
    if (!email)
      continue

    console.log(username, ' -> ', email)

    // TODO save this user
    upsertUser({
      username: username,
      email: email,
      dateCrawled: new Date()
    })
  }
}

async function getNumPages (page) {
  const NUM_USER_SELECTOR = '#js-pjax-container > div > div.col-12.col-md-9.float-left.px-2.pt-3.pt-md-0.codesearch-results > div > div.d-flex.flex-column.flex-md-row.flex-justify-between.border-bottom.pb-3.position-relative > h3'

  let inner = await page.evaluate((sel) => {

    let html = document.querySelector(sel).innerHTML
    console.log('22222' + html)
    // format is: "69,803 users"
    return html.replace(',', '').replace('users', '').trim()
  }, NUM_USER_SELECTOR)

  let numUsers = parseInt(inner)

  console.log('numUsers: ', numUsers)

  /*
  * GitHub shows 10 resuls per page, so
  */
  let numPages = Math.ceil(numUsers / 10)
  return numPages
}

async function email () {
  const USERNAME_SELECTOR = '#login_field'
  const PASSWORD_SELECTOR = '#password'
  const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block'

  const userToSearch = 'john'
  const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`

  const LENGTH_SELECTOR_CLASS = 'user-list-item'

  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  await page.goto('https://github.com/login')

  await page.click(USERNAME_SELECTOR)
  await page.keyboard.type(CREDS.username)

  await page.click(PASSWORD_SELECTOR)
  await page.keyboard.type(CREDS.password)

  await page.click(BUTTON_SELECTOR)

  await page.waitForNavigation()

  await page.goto(searchUrl)
  await page.waitFor(3 * 1000)


  let numPages = await getNumPages(page);

  console.log('Numpages: ', numPages);

  for (let h = 1; h <= numPages; h++) {

    let pageUrl = searchUrl + '&p=' + h;

    await page.goto(pageUrl);
    await page.waitFor(2 * 1000)

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length
    }, LENGTH_SELECTOR_CLASS)

    console.log(`page[${h}] listLength:${listLength}`)

    await logUserEmail(listLength, page)
  }

}


function upsertUser(userObj) {
	// if this email exists, update the entry, don't insert
	const conditions = { email: userObj.email };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  userObj.dateCrawled = moment().format('YYYY-MM-DD HH:mm:ss:SSS')
	User.findOneAndUpdate(conditions, userObj, options, (err, result) => {
    if (err) throw err;
    console.log('%j insert info : %j',userObj, result)
  });
}

//screenshot()

email()



// refer:  https://github.com/csbun/thal/blob/master/README.md?from=singlemessage&isappinstalled=0
// https://github.com/emadehsan/thal
// https://github.com/csbun/thal

// api https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
