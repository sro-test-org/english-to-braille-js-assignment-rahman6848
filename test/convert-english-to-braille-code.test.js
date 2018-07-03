const should = require('should');
const puppeteer = require('puppeteer');
const StaticServer = require('static-server');

let page, browser, server;

describe('English to Braille Converter', () => {
  before(async () => {
    // Creates server to serve static files
    server = new StaticServer({
      rootPath: process.cwd(),
      port: 8080,
    });
    // kick starts the server
    server.start();

    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
  });

  it('Should have all the required elements', async () => {
    const sourceLangElement = await page.evaluate(() => document.getElementById('sourceLangText'));
    const btnConvertEnglishToBrailleElement = await page.evaluate(() => document.getElementById('btnConvertEnglishToBraille'));
    const targetLangTextElement = await page.evaluate(() => document.getElementById('targetLangText'));

    sourceLangElement.should.not.be.null();
    btnConvertEnglishToBrailleElement.should.not.be.null();
    targetLangTextElement.should.not.be.null();
  });

  it('Should be able convert from English to Braille', async () => {
    // Types text and triggers click event to convert english to braille
    await page.evaluate(() => {
      document.getElementById('sourceLangText').value = "Hello World";
      document.getElementById('btnConvertEnglishToBraille').click();
    });

    // Fetches the converted text
    const targetLangText = await page.evaluate(() => document.getElementById('targetLangText').innerHTML);

    targetLangText.should.not.be.null();
    targetLangText.should.be.an.instanceOf(String);
    targetLangText.should.be.exactly('⠠⠓⠑⠇⠇⠕ ⠠⠺⠕⠗⠇⠙');

    browser.close();
    server.stop();
  });
});
