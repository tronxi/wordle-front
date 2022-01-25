import { Component, OnInit } from '@angular/core';
import {WordleService} from "../services/wordle.service";

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss']
})
export class WordleComponent implements OnInit {
  element: HTMLElement | undefined;
  squares: string[][];
  numRow: number;
  numLetter: number;
  showAlert: boolean;
  showWin: boolean;
  showLost: boolean;
  showInvalid: boolean;
  canEnter: boolean;
  statusTypes: Map<string, number>;
  alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  keyboardStatus: Map<string, number>;
  buttonsIncluded = ["whatsapp", "telegram", "twitter", "facebook", "reddit"];
  failEmoji = "⬛";
  unorderedEmoji = "🟨";
  orderedEmoji = "🟩";
  description = "";
  responses: string [];


  constructor(private wordleService: WordleService) {
    this.showAlert = false;
    this.showWin = false;
    this.showLost = false;
    this.showInvalid = false;
    this.canEnter = true;
    this.numRow = 0;
    this.numLetter = 0;
    this.squares = [];
    this.statusTypes = new Map<string, number>();
    this.statusTypes.set("None", 0);
    this.statusTypes.set("Fail", 1);
    this.statusTypes.set("Unordered", 2);
    this.statusTypes.set("Ordered", 3);
    this.responses = [];
    this.keyboardStatus = new Map<string, number>();
    for(let letter of this.alphabet){
      this.keyboardStatus.set(letter, 0);
    }
    for(let i: number = 0; i < 6; i++) {
      this.squares[i] = [];
      for(let j: number = 0; j< 5; j++) {
        this.squares[i][j] = " ";
      }
    }
  }

  ngOnInit(): void {

  }

  clickKey(key: string): void {
    if(this.numLetter < 5){
      this.setLetterInSquare(this.numRow, this.numLetter, key);
      this.numLetter += 1;
    }
  }

  clickDel(): void {
    if(this.numLetter > 0) {
      this.numLetter -= 1;
      this.setLetterInSquare(this.numRow, this.numLetter, "");
    }
  }

  clickEnter(): void {
    if(!this.canEnter) return;
    this.canEnter = false;
    if(this.numLetter != 5) {
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 2000);
      this.canEnter = true;
      return;
    }
    let letters: string[] = [];
    for(let i = 0; i < 5; i++) {
      letters.push(this.squares[this.numRow][i]);
    }
    this.wordleService.wordle(letters).subscribe(response => {
      if(response.wordleStatus == "Invalid") {
        this.showInvalid = true;
        setTimeout(() => this.showInvalid = false, 2000);
        this.canEnter = true;
        return;
      }
      this.responses[this.numRow] = response.letterStatusList;
      this.markSquares(response.letterStatusList, letters);
      this.printKeyBoard();
      this.generateDescription();
      if(response.wordleStatus == "Completed") {
        this.showWin = true;
      } else {
        if(this.numRow === 5) {
          this.showLost = true;
        }else {
          this.numRow += 1;
          this.numLetter = 0;
        }
      }
      this.canEnter = true;
    }, error => {
      this.canEnter = true;
    });
  }

  generateDescription(): void {
    let row = this.numRow + 1;
    this.description = "Wordle " + row + "/6\n";
    for(let i: number = 0; i <= this.numRow; i++) {
      for(let j: number = 0; j < 5; j++) {
        console.log(this.responses[i][j]);
        let response = this.responses[i][j];
        if(response === "Fail") this.description += this.failEmoji;
        else if(response === "Unordered") this.description += this.unorderedEmoji;
        else if(response === "Ordered") this.description += this.orderedEmoji;
      }
      this.description += "\n";
    }
  }

  markSquares(letterStatusList: string[], letters: string[]): void {
    for(let i = 0; i < 5; i++) {
      let id = this.numRow.toString() + i;
      let keyboardStatus = this.keyboardStatus.get(letters[i]) || 0;
      let statusType = this.statusTypes.get(letterStatusList[i]) || 0;
      if(statusType > keyboardStatus) {
        this.keyboardStatus.set(letters[i], statusType);
      }
      if(letterStatusList[i] === "Fail")
        this.markSquareAsFailed(id);
      else if(letterStatusList[i] === "Ordered")
        this.markSquareAsOrdered(id);
      else if(letterStatusList[i] === "Unordered")
        this.markSquareAsUnordered(id);
    }
  }

  printKeyBoard(): void {
    for(let letter of this.alphabet) {
      let letterStatus = this.keyboardStatus.get(letter);
      letter = letter.toLowerCase();
      if(letterStatus == 1) this.markKeyAsFailed(letter);
      else if (letterStatus == 2) this.markKeyAsUnordered(letter);
      else if (letterStatus == 3) this.markKeyAsOrdered(letter);
    }
  }

  setLetterInSquare(numRow: number, numLetter: number, letter: string) : void {
    this.squares[numRow][numLetter] = letter;
  }

  markSquareAsFailed(key: string): void {
    let keyElement = document.getElementById(key) as HTMLElement;
    keyElement.setAttribute("class", "failed-square");
  }

  markSquareAsUnordered(key: string): void {
    let keyElement = document.getElementById(key) as HTMLElement;
    keyElement.setAttribute("class", "unordered-square");
  }

  markSquareAsOrdered(key: string): void {
    let keyElement = document.getElementById(key) as HTMLElement;
    keyElement.setAttribute("class", "ordered-square");
  }

  markKeyAsFailed(key: string): void {
    let keyElement = document.getElementById(key) as HTMLElement;
    keyElement.setAttribute("class", "failed-key");
  }

  markKeyAsUnordered(key: string): void {
    let keyElement = document.getElementById(key) as HTMLElement;
    keyElement.setAttribute("class", "unordered-key");
  }

  markKeyAsOrdered(key: string): void {
    let keyElement = document.getElementById(key) as HTMLElement;
    keyElement.setAttribute("class", "ordered-key");
  }

}
