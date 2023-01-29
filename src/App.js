import React  from 'react';
import { useState } from 'react';

export default function Form() {
  const [yourBoard, setYourBoard] = useState('');
  const [theirBoard, setTheirBoard] = useState('');
  const [answer, setAnswer] = useState('');
  return (
    <React.Fragment>
      <h1>Metawordle</h1>
      <label>
        Your Wordle guesses:
        <textarea
	  rows="6"
          value={yourBoard}
          onChange={e => setYourBoard(e.target.value)}
        />
      </label>
      <br/>
      <hr/>
      <label>
        Their guesses of your guesses:
        <textarea
	  type="textarea"
	  rows="6"
          value={theirBoard}
          onChange={e => setTheirBoard(e.target.value)}
        />
      </label>
      <br/>
      <hr/>
      <button onClick={() => setAnswer(check(theirBoard, yourBoard))}>
        Check
      </button>
      <br/>
      {yourBoard !== '' && theirBoard !== '' &&
       <div>
	 <p style={{ whiteSpace: 'pre-wrap' }}>{answer}</p>
	 <br/>
	 <button onClick={() => {navigator.clipboard.writeText(answer)}}>
           Copy to clipboard
	 </button>
       </div>
      }
    </React.Fragment>
  );
}

function purpleInner(letter, wordIdx, letterIdx, yoursArray, answer) {
  for (let yourWordIdx = 0; yourWordIdx < yoursArray.length; yourWordIdx++) {
    for (
      let yourLetterIdx = 0;
      yourLetterIdx < yoursArray[yourWordIdx].length;
      yourLetterIdx++
    ) {
      if (letter === yoursArray[yourWordIdx][yourLetterIdx]) {
	answer[wordIdx][letterIdx] = "🟪";
	yoursArray[yourWordIdx][yourLetterIdx] = null;
	return [answer, yoursArray];
      }
    }
  }
  return [answer, yoursArray];
}

function boardToString(board) {
  let answer = "";
  for (let word of board) {
    for (let letter of word) {
      answer += letter;
    }
    answer += "\n";
  }
  return answer.trim()
}

function check(theirs, yours) {
  theirs = theirs.trim().toLowerCase().split("\n");
  yours = yours.trim().toLowerCase().split("\n");

  if (theirs.length !== yours.length) {
    return "Guess must have the same number of words.";
  }
  for (let i = 0; i < theirs.length; i++) {
    if (theirs[i].length !== 5) {
      return "All of their words must have five letters.";
    }
  }
  for (let i = 0; i < yours.length; i++) {
    if (yours[i].length !== 5) {
      return "All of your words must have five letters.";
    }
  }

  var answer = new Array(theirs.length);
  for (let i = 0; i < answer.length; i++) {
    answer[i] = Array(5).fill("⬛");
  }

  var yoursArray = new Array(yours.length);
  for (let i = 0; i < yours.length; i++) {
    yoursArray[i] = new Array(5);
    for (let j = 0; j < yours[i].length; j++) {
      yoursArray[i][j] = yours[i].charAt(j);
    }
  }

  for (let wordIdx = 0; wordIdx < theirs.length; wordIdx++) {
    for (let letterIdx = 0; letterIdx < theirs[wordIdx].length; letterIdx++) {
      if (theirs[wordIdx][letterIdx] === yours[wordIdx][letterIdx]) {
	answer[wordIdx][letterIdx] = "🟩";
	yoursArray[wordIdx][letterIdx] = null;
      }
    }
  }

  for (let wordIdx = 0; wordIdx < theirs.length; wordIdx++) {
    for (let letterIdx = 0; letterIdx < theirs[wordIdx].length; letterIdx++) {
      for (
	let yourLetterIdx = 0;
	yourLetterIdx < yoursArray[wordIdx].length;
	yourLetterIdx++
      ) {
	if (theirs[wordIdx][letterIdx] === yoursArray[wordIdx][yourLetterIdx]) {
	  answer[wordIdx][letterIdx] = "🟨";
	  yoursArray[wordIdx][yourLetterIdx] = null;
	  break;
	}
      }
    }
  }

  for (let wordIdx = 0; wordIdx < theirs.length; wordIdx++) {
    for (let letterIdx = 0; letterIdx < theirs[wordIdx].length; letterIdx++) {
      for (
	let yourWordIdx = 0;
	yourWordIdx < yoursArray.length;
	yourWordIdx++
      ) {
	if (theirs[wordIdx][letterIdx] === yoursArray[yourWordIdx][letterIdx]) {
	  answer[wordIdx][letterIdx] = "🟦";
	  yoursArray[yourWordIdx][letterIdx] = null;
	  break;
	}
      }
    }
  }

  for (let wordIdx = 0; wordIdx < theirs.length; wordIdx++) {
    for (let letterIdx = 0; letterIdx < theirs[wordIdx].length; letterIdx++) {
      [answer, yoursArray] = purpleInner(
	theirs[wordIdx][letterIdx],
	wordIdx,
	letterIdx,
	yoursArray,
	answer
      );
    }
  }

  return boardToString(answer);
}
