/**
 * Converts text in english to braille code.
 * Write all code related to the DOM Manipulation here.
 * Using the english-to-braille mapper convert the text
 * in english language to that in the equivalent braille
 * code.
 */
import englishToBrailleLiteralSet from './english-to-braille.js';

const englishBrailleCodeMap = new Map(englishToBrailleLiteralSet);

const sourceElementNode = document.getElementById('sourceLangText');
const targetElementNode = document.getElementById('targetLangText');

const convertEnglishToBraille = textInEnglish => textInEnglish.split('').map(literal => englishBrailleCodeMap.get(literal)).join('');

const convertEnglishToBrailleAndDisplayOutput = (sourceElement, targetElement) => {
  targetElement.innerHTML = convertEnglishToBraille(sourceElement.value);
};


document.getElementById('btnConvertEnglishToBraille')
  .addEventListener('click', () => convertEnglishToBrailleAndDisplayOutput(sourceElementNode, targetElementNode));
