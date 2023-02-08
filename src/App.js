import React  from 'react';
import { useState } from 'react';

export default function Form() {
  const [yourBoard, setYourBoard] = useState("");
  const [theirBoard, setTheirBoard] = useState("");
  const [answer, setAnswer] = useState("");
  const [yourBoardToShare, setYourBoardToShare] = useState("");
  const [yourCode, setYourCode] = useState("");
  const [theirCode, setTheirCode] = useState("");
  const [yourGuess, setYourGuess] = useState("");
  const [history, setHistory] = useState([Array(6).fill(null)]);
  const [guessHistory, setGuessHistory] = useState([Array(6).fill(null)]);
  const [turn, setTurn] = useState(0);

  function addGuess(turn, history, yourGuess, theirCode) {
    history[turn] = check(yourGuess, boardToString(codeToBoard(theirCode)));
    guessHistory[turn] = yourGuess;
    setGuessHistory(guessHistory);
    setHistory(history);
    setTurn(turn + 1);
  }

  return (
    <React.Fragment>
      <h1>Metawordle</h1>
      <h2>Instructions</h2>
      <p>The goal of Metawordle is to guess what someone else guessed in Wordle!</p>
      <p>To play, have a friend play a game of Wordle. After they're done, have them type the guesses they made in <b>Share code</b> section below and select <b>Generate shareable code</b>. Have them share the code with you, then paste the code in the <b>Code from a friend</b> box. Try to guess what they tried during their full Wordle game by typing in your guess in the <b>Your guesses of their guesses</b> box and selecting <b>Guess</b>! Make sure to include your guess of all the words from their game including the last. Once you've entered your guess, you'll see which letters you guessed correctly according to this key:
	<ul>
	  <li>⬛ means that this letter didn't show up anywhere in your friend's game. Keep trying!</li>
	  <li>🟩 means you guessed the correct letter. Good job!</li>
	  <li>🟨 means this letter is somewhere in the same row in your friend's game, excluding the green squares.</li>
	  <li>🟦 means this letter is somewhere in the same column in your friend's game, excluding the green squares.</li>
	  <li>🟪 means this letter is somewhere in the non-green squares in your friend's game, but not the same column or row.</li>
	</ul>
    Have fun!
      </p>
      <h2>Play with a shared code</h2>
      <label>
        Code from a friend
	<br/>
        <textarea
	  rows="7"
          value={theirCode}
          onChange={e => setTheirCode(e.target.value)}
        />
      </label>
      <br/>
      {theirCode !== "" &&
       <div>
	 <label>
	   Results of their Wordle game
	   <br/>
	   <p style={{ whiteSpace: "pre-wrap" }}>{wordleCheck(codeToBoard(theirCode))}</p>
	   <h3>{lastWord(codeToBoard(theirCode))}</h3>
	 </label>
       </div>
      }
      <br/>
      <label>
        Your guess of their guesses
	<br/>
        <textarea
	  rows="6"
          value={yourGuess}
          onChange={e => setYourGuess(e.target.value)}
        />
	<br/>
	<button onClick={() => addGuess(turn, history, yourGuess, theirCode)}>
          Guess
	</button>
	<br/>
	{turn !== 0 &&
	 <div>
	   <p style={{ whiteSpace: "pre-wrap" }}>{historyToStringWithGuess(history, guessHistory)}</p>
	   <br/>
	   <button onClick={() => {navigator.clipboard.writeText(historyToString(history))}}>
             Copy to clipboard
	   </button>
	 </div>
	}
      </label>
      <hr/>
      <h2>Share code</h2>
      <label>
        Your Wordle guesses
	<br/>
        <textarea
	  rows="6"
          value={yourBoardToShare}
          onChange={e => setYourBoardToShare(e.target.value)}
        />
      </label>
      <br/>
      <button onClick={() => setYourCode(boardToCode(yourBoardToShare))}>
        Generate shareable code
      </button>
      {yourBoardToShare !== "" && yourCode !== "" &&
       <div>
	 <p style={{ whiteSpace: "pre-wrap" }}>{yourCode}</p>
	 <br/>
	 <button onClick={() => {navigator.clipboard.writeText(yourCode)}}>
           Copy code to clipboard
	 </button>
       </div>
      }
      <hr/>
      <h2>Guess checker</h2>
      <label>
        Your Wordle guesses
	<br/>
        <textarea
	  rows="6"
          value={yourBoard}
          onChange={e => setYourBoard(e.target.value)}
        />
	<br/>
      </label>
      <label>
        Their guesses of your guesses
	<br/>
        <textarea
	  type="textarea"
	  rows="6"
          value={theirBoard}
          onChange={e => setTheirBoard(e.target.value)}
        />
	<br/>
      </label>
    <button onClick={() => setAnswer(boardToString(check(theirBoard, yourBoard)))}>
        Check
      </button>
      <br/>
      {yourBoard !== "" && theirBoard !== "" &&
       <div>
	 <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
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
      if (
	(letter === yoursArray[yourWordIdx][yourLetterIdx])
	  && (answer[wordIdx][letterIdx] === "⬛")
      ) {
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
  for (let i = 0; i < board.length; i++) {
    let word = board[i];
    for (let j = 0; j < word.length; j++) {
      answer += word[j];
    }
    answer += "\n";
  }
  return answer.trim();
}

function historyToString(history) {
  let answer = "";
  for (let i = 0; i < history.length; i++) {
    if (history[i] === null) {
      return answer.trim();
    }
    answer += "Round " + String(i) + "\n";
    answer += boardToString(history[i]);
    answer += "\n";
  }
  return answer.trim();
}

function historyToStringWithGuess(history, guessHistory) {
  let answer = "";
  for (let i = 0; i < history.length; i++) {
    if (history[i] === null) {
      return answer.trim();
    }
    answer += "Round " + String(i) + "\n";
    let guessWords = guessHistory[i].trim().toUpperCase().split("\n");
    for (let j = 0; j < history[i].length; j++) {
      let word = history[i][j];
      for (let letter of word) {
	answer += letter;
      }
      answer += " " + guessWords[j] + "\n";
    }
  }
  return answer.trim();
}

function boardToCode(board) {
  board = board.trim().toLowerCase().split("\n");
  let code = "";
  // Use a random seed to make it harder to recognize numbers. Pad with zeros.
  let seed = Math.floor(Math.random() * 100);
  code += ("000" + String(seed)).slice(-3);

  for (let word of board) {
    code += "\n";
    for (let letter of word) {
      seed += letter.charCodeAt(0);
      seed %= 1000;
      code += (
	"000" + String(seed) + "|"
      ).slice(-4);
    }
    code = code.slice(0, -1);
  }

  return code;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function codeToBoard(code) {
  code = code.trim().split("\n");
  var board = new Array(code.length - 1);
  let seed = Number(code[0]);
  for (let i = 0; i < code.length - 1; i++) {
    var word = new Array(5);
    let wordCode = code[i + 1];
    let charCodes = wordCode.split("|");
    for (let j = 0; j < 5; j++) {
      word[j] = String.fromCharCode(mod((charCodes[j] - seed), 1000));
      seed += charCodes[j];
      seed %= 1000;
    }
    board[i] = word;
  }
  return board;
}
function lastWord(board) {
  try {
    var last = "";
    for (let letter of board[board.length - 1]) {
      last += letter;
    }
    return last.toUpperCase();
  }
  catch (err) {
    return "";
  }
}

function wordleCheck(board) {
  try {
    var correct = board[board.length - 1];
    var answer = new Array(board.length);
    for (let i = 0; i < answer.length; i++) {
      answer[i] = checkWord(board[i], correct);
    }
    return boardToString(answer);
  }
  catch (err) {
    return "";
  }
}

function checkWord(guess, correct) {
  var squares = Array(5).fill("⬛");
  var correctArray = [...correct];
  for (let i = 0; i < 5; i++) {
    if (guess[i] === correct[i]) {
      squares[i] = "🟩";
      correctArray[i] = null;
    }
  }
  for (let letterIdx = 0; letterIdx < 5; letterIdx++) {
    for (let correctLetterIdx = 0; correctLetterIdx < 5; correctLetterIdx++) {
      if (
	(guess[letterIdx] === correctArray[correctLetterIdx])
	  && (squares[letterIdx] === "⬛")
      ) {
	squares[letterIdx] = "🟨";
	correctArray[correctLetterIdx] = null;
	break;
      }
    }
  }
  return squares;
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
	if (
	  (theirs[wordIdx][letterIdx] === yoursArray[wordIdx][yourLetterIdx])
	    && (answer[wordIdx][letterIdx] === "⬛")
	) {
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
	if (
	  (theirs[wordIdx][letterIdx] === yoursArray[yourWordIdx][letterIdx])
	    && (answer[wordIdx][letterIdx] === "⬛")
	) {
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

  return answer;
}
