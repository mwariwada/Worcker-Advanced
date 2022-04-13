"use strict";

let allWords = [...allFiveLetterWords];

const nmbrOfLttrs = 5;
const letter1 = document.getElementById("letter--1");
const letter2 = document.getElementById("letter--2");
const letter3 = document.getElementById("letter--3");
const letter4 = document.getElementById("letter--4");
const letter5 = document.getElementById("letter--5");
const wordsDisplay = document.getElementById("wordsDiv");
const runButton = document.getElementById("goButton");
const tryAgain = document.getElementById("againButton");
const lttrsBttns = document.getElementById("letters-buttons");
const rounds = document.getElementById("rounds");
const laps = document.getElementById("laps");
const delayField = document.getElementById("delay");
const letters = [letter1, letter2, letter3, letter4, letter5];
let delay = 0;
let numberOfRuns = 0;
let numberOfLaps = 0;
let numberOfTries = 0;
let arry = [];
let avg = 0;
let lapNumberCounter = 0;
let lapAvg = 0;
let numberOfRunsCounter = 0; //Counter for number of Runs done
let counter3 = 0;
let counter4 = 0;
let counter5 = 0;
let counter6 = 0;

let wordsWithDoubleLetters = [];
let possibleLetters = {};
let notPossibleLetters = [];
const blankChar = ".";
const emptyWord = blankChar.repeat(nmbrOfLttrs);
let enteredWord = emptyWord;
let wordsWithoutDoubleLetters = "";
let guessWord = "";

const clearInputFields = () => letters.forEach((letter) => (letter.value = ""));

const clearColors = () =>
  letters.forEach((letter) => (letter.style.backgroundColor = ""));

const clearAll = () => {
  clearColors();
  clearInputFields();
};

const setLetters = (word) => {
  letters.forEach((letter, i) => {
    letter.value = word[i];
  });
};

const setNotes = (textToSet, textToSet2) => {
  notes1.textContent = textToSet;
  notes2.textContent = textToSet2;
};

const getRandom = (arrayWithLength) =>
  Math.floor(Math.random() * arrayWithLength.length);

let correctWord = allWords[getRandom(allWords)];

const getAllWordsWithDoubleLetters = function (arr) {
  arr.forEach((word) => {
    for (let i = 0; i < word.length; i++) {
      if (word.split(`${word[i]}`).length > 2) {
        wordsWithDoubleLetters.push(word);
        return;
      }
    }
  });

  return function (arrayWithWordsWithDoubleLetters) {
    const localArr = [...arr];
    arrayWithWordsWithDoubleLetters.forEach((word) => {
      localArr.splice(arr.indexOf(word), 1);
    });
    return localArr;
  };
};

const setWordsDisplay = (words) => {
  wordsDisplay.textContent = words.join(",").replaceAll(",", "\n");
};

const setArrayWithWordsWithoutDoubleLetters =
  getAllWordsWithDoubleLetters(allWords);

wordsWithoutDoubleLetters = setArrayWithWordsWithoutDoubleLetters(
  wordsWithDoubleLetters
);

setWordsDisplay(wordsWithoutDoubleLetters);

const replaceCharAt = function (index, replacement, str) {
  //Error handling
  if (index >= str.length) {
    return str.valueOf();
  }

  return str.substring(0, index) + replacement.value + str.substring(index + 1);
};

const getWordsWithALetterInIt = function (arr, letter) {
  const arr2 = arr.filter((word) => word.includes(letter));
  return arr2;
};

const getWord = () => {
  let word = "";
  letters.forEach((letter) => {
    word += letter.value;
  });
  return word;
};

const wordsWithDefiniteLetters = function () {
  //No letters known for certain
  if (enteredWord !== emptyWord) {
    const regWord = new RegExp(enteredWord, "g");
    return allWords.filter(
      (word) => word.match(regWord) && !word.match(getWord())
    );
  } else {
    return allWords;
  }
};

const wordsWithPossibleLettersInCorrectPosition = (words) => {
  let words1 = [...words];
  for (const [letter, positions] of Object.entries(possibleLetters)) {
    //Gets all words with the letter in it
    words1 = getWordsWithALetterInIt(words1, letter);
    positions.forEach((position) => {
      words1 = words1.filter((word) => word[position] !== letter);
    });
  }
  return words1;
};

const wordsWithoutPossibleLetters = (words) => {
  let words1 = [...words];
  if (notPossibleLetters) {
    notPossibleLetters.forEach((letter) => {
      words1 = words1.filter((word) => !word.includes(letter));
    });
  }
  return words1;
};

const searchForWords = function () {
  wordsDisplay.textContent = wordsWithoutPossibleLetters(
    wordsWithPossibleLettersInCorrectPosition(wordsWithDefiniteLetters())
  )
    .join(",")
    .replaceAll(",", "\n");
};

const checkWord = function () {
  letters.forEach(function (letter, i) {
    const backgroundColor = letter.style.backgroundColor;
    if (backgroundColor === "green") {
      enteredWord = replaceCharAt(i, letter, enteredWord);
    } else if (backgroundColor === "orange") {
      if (possibleLetters[letter.value]) {
        const positions = possibleLetters[letter.value];
        positions.push(i);
      } else possibleLetters[letter.value] = [i];
    } else {
      letter.value && notPossibleLetters.push(letter.value);
    }
  });
  searchForWords();
  setNotes("Words retrieved! Let's run it again", "Getting new word.");
};

const playAgain = () => {
  clearAll();
  wordsWithDoubleLetters = [];
  possibleLetters = {};
  notPossibleLetters = [];
  enteredWord = emptyWord;
  setWordsDisplay(wordsWithoutDoubleLetters);
  correctWord = allWords[getRandom(allWords)];
  guessWord = allWords[getRandom(allWords)];
  numberOfTries = 0;
};

const playNew = () => {
  numberOfRunsCounter = 0;
  avg = 0;
  playAgain();
};

const playExtraNew = () => {
  runButton.style.display = "inline";
  counter3 = 0;
  counter4 = 0;
  counter5 = 0;
  counter6 = 0;
  lapAvg = 0;
  playNew();
};

tryAgain.addEventListener("click", playExtraNew);

//New code
const setBackgroundColors = () => {
  letters.forEach(function (letterMain, i) {
    const letter = letterMain.value;
    if (correctWord.includes(letter))
      letterMain.style.backgroundColor = "orange";
    if (correctWord[i] === letter) letterMain.style.backgroundColor = "green";
  });

  setNotes("Colors set.", "Now getting all possible words to choose from");
};

const setInitial = () => {
  delay = Number(delayField.value) * 100;
  numberOfRuns = Number(rounds.value);
  numberOfLaps = Number(laps.value);
  runButton.style.display = "none"; //Hide the run button
  guessWord = allWords[getRandom(allWords)]; //Set guessWord to random word
  setLetters(guessWord); //Set the game to begin with the first guess
  console.log(`Round: ${numberOfRunsCounter + 1}`);
  resolve();
};

const resolve = () => {
  // numberOfTries || console.log(`The correct word is: ${correctWord}`);
  numberOfTries++; //how many times have we tried to guess the word
  setNotes(
    "The word entered is: " + guessWord,
    " Now analyzing the word, determining colors, please wait"
  );
  setTimeout(function () {
    setBackgroundColors();
  }, delay * 1);
  setTimeout(function () {
    checkWord();
    arry = wordsWithoutPossibleLetters(
      wordsWithPossibleLettersInCorrectPosition(wordsWithDefiniteLetters())
    );
    clearAll();
  }, delay * 2);
  setTimeout(function () {
    if (arry.length !== 0) {
      guessWord = arry[getRandom(arry)]; //Set the guessWord to be equal to a random word from the remaining list
      setLetters(guessWord);
      resolve();
    } else {
      setNotes("We have a winner!");
      numberOfRunsCounter++;
      avg += numberOfTries; //Add the number of tries we have tried to guess to the current set average
      if (numberOfRunsCounter === numberOfRuns) {
        const thisSetAvg = Math.round(avg / numberOfRuns);
        console.log(
          `Lap # ${lapNumberCounter + 1}s average is: ${thisSetAvg}` + "\n \n"
        );
        if (thisSetAvg === 5) counter5++;
        if (thisSetAvg === 4) counter4++;
        if (thisSetAvg === 3) counter3++;
        if (thisSetAvg === 6) counter6++;
        const countersArray = [counter3, counter4, counter5, counter6];
        lapNumberCounter++;
        lapAvg += Math.round(thisSetAvg);
        if (lapNumberCounter === numberOfLaps) {
          const finalAvg = Math.round(lapAvg / numberOfLaps);
          console.log(
            `The average of all ${numberOfLaps} laps is: ${finalAvg}`
          );
          lapNumberCounter = 0;
          const biggestNumber = Math.max(...countersArray);
          const secondBiggest = Math.max(
            ...countersArray.filter(
              (numberOfRunsCounter) => numberOfRunsCounter !== biggestNumber
            )
          );
          notes1.textContent = `There is a ${Math.round(
            (biggestNumber / numberOfLaps) * 100
          )}% chance of getting it on the ${finalAvg}th try`;
          notes2.textContent = `And there is a ${Math.round(
            (secondBiggest / numberOfLaps) * 100
          )}% chance of getting a on the  ${
            countersArray.indexOf(secondBiggest) + 3
          }th try`;
        } else {
          playNew();
          setInitial();
        }
      } else {
        playAgain();
        setInitial();
      }
    }
  }, delay * 3);
};

runButton.addEventListener("click", setInitial);
