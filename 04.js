// @ts-check
const fs = require("fs");

class Board {
  static id = 0;
  /** @type {number} */
  id;
  /** @type {Array<Array<number>>} */
  rows = [];
  /** @type {Array<Array<number>>} */
  columns = [];
  /** @type {Array<number>} */
  numbers = [];

  /**
   * @param {string} content
   */
  constructor(content) {
    this.id = Board.id++;
    const lines = content.split("\n").map((l) => l.trimStart());
    this.rows = lines.map((line) => line.split(/ +/).map(Number));

    // build columns
    for (let i = 0; i < 5; i++) {
      this.columns.push([this.rows[0][i], this.rows[1][i], this.rows[2][i], this.rows[3][i], this.rows[4][i]]);
    }
  }

  /**
   * @returns {boolean}
   */
  isWinner() {
    return (
      this.rows.some((row) => row.every((n) => this.numbers.includes(n))) ||
      this.columns.some((row) => row.every((n) => this.numbers.includes(n)))
    );
  }

  score() {
    const sumUnmarked = this._allRowNumber()
      .filter((n) => !this.numbers.includes(n))
      .reduce((a, b) => a + b, 0);

    return sumUnmarked * this.numbers[this.numbers.length - 1];
  }

  _allRowNumber() {
    return this.rows.reduce((row, acc) => [...acc, ...row], []);
  }
}

const content = fs.readFileSync("./04.txt").toString().split("\n\n");
const numbers = content.shift().split(",").map(Number);
const getBoards = () => content.map((row) => new Board(row));

function partA() {
  console.group("Part A");
  const boards = getBoards();

  for (const number of numbers) {
    for (const board of boards) {
      board.numbers.push(number);

      if (board.isWinner()) {
        console.log("board #%s has win with score %s", board.id, board.score());
        return console.groupEnd();
      }
    }
  }
  console.groupEnd();
}

function partB() {
  console.group("Part B");
  const boards = getBoards();

  let boardWinIds = [];

  for (const number of numbers) {
    for (const board of boards.filter((b) => !boardWinIds.includes(b.id))) {
      board.numbers.push(number);

      if (board.isWinner()) {
        boardWinIds.push(board.id);
      }
    }
  }

  const lastBoardId = boardWinIds.pop();
  const lastBoard = boards.find((b) => b.id === lastBoardId);

  console.log("last score %s", lastBoard.score());
  console.groupEnd();
}

partA();
partB();
