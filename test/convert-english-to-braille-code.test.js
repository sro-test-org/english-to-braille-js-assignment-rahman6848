const should = require('should');
const puppeteer = require('puppeteer');
const StaticServer = require('static-server');

const buynan = require('bunyan');
const bFormat = require('bunyan-format');
const formatOut = bFormat({ outputMode: 'short' });
const log = buynan.createLogger({ name: 'Test', stream: formatOut, level: 'debug' });


let page, browser, server;

describe('English to Braille Converter', () => {
  before(async () => {
    // Creates server to serve static files
    log.debug('Creating the Static Server');
    server = new StaticServer({
      rootPath: process.cwd(),
      port: 8080,
    });

    // kick starts the server
    log.debug('Starting the static server');
    server.start();

    // Launching Puppeteer and creating a new page
    log.debug('Launching the puppeteer and creating new page');
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
  });

  it('Should have all the required elements', async () => {
    log.debug('Checking if all the elements are present');
    const sourceLangElement = await page.evaluate(() =>
      document.getElementById('sourceLangText'));
    const btnConvertEnglishToBrailleElement = await page.evaluate(() =>
      document.getElementById('btnConvertEnglishToBraille'));
    const targetLangTextElement = await page.evaluate(() =>
      document.getElementById('targetLangText'));

    should.exist(sourceLangElement, "The sourceLangElement is removed. Seems you have modified the index.html");
    should.exist(btnConvertEnglishToBrailleElement, "The button with id `btnConvertEnglishToBraille` is removed. Seems you have modified index.html")
    should.exist(targetLangTextElement, "The targetLangText element is removed. Seems you have modified the index.html");
  });

  it('Should be able convert from English to Braille', async () => {
    // Types text and triggers click event to convert english to braille
    log.debug('Puppeteer typing the text and triggering the button click');
    await page.evaluate(() => {
      document.getElementById('sourceLangText').value = "Hello World";
      document.getElementById('btnConvertEnglishToBraille').click();
    });

    // Fetches the converted text
    log.debug('Fetch the converted text from the target element');
    const targetLangText = await page.evaluate(() =>
      document.getElementById('targetLangText').innerHTML);

    targetLangText.should.not.be.null();
    targetLangText.should.be.an.instanceOf(String);
    targetLangText.should.be.exactly('⠠⠓⠑⠇⠇⠕ ⠠⠺⠕⠗⠇⠙', "The converted Braille code didn't match with the expected code. Seems some issue in the logic to convert the text to the braille code. Try fixing it.");

    // Closing the browser and stopping the static server
    log.debug('Closing the headless browser and stopping the static server');
    browser.close();
    server.stop();
  });
});
