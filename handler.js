'use strict';
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports.hello = async event => {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: await page.title(),
          input: event,
        },
        null,
        2
      ),
    };
  } catch (e) {
    return {
      statusCode: 503,
      body: JSON.stringify(
        {
          message: e.message,
          input: event,
        },
        null,
        2
      ),
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
