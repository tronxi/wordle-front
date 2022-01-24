import { Component, OnInit } from '@angular/core';
import {WordleService} from "../services/wordle.service";

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.css']
})
export class WordleComponent implements OnInit {
  element: HTMLElement | undefined;
  squares: string[][];
  numRow: number;
  numLetter: number;
  showAlert: boolean;
  showWin: boolean;
  showLost: boolean;

  constructor(private wordleService: WordleService) {
    this.showAlert = false;
    this.showWin = false;
    this.showLost = false;
    this.numRow = 0;
    this.numLetter = 0;
    this.squares = [];
    for(let i: number = 0; i < 10; i++) {
      this.squares[i] = [];
      for(let j: number = 0; j< 10; j++) {
        this.squares[i][j] = " ";
      }
    } }

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
    if(this.numLetter != 5) {
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 2000);
      return;
    }
    let letters = [];
    for(let i = 0; i < 5; i++) {
      letters.push(this.squares[this.numRow][i]);
    }
    this.wordleService.wordle(letters).subscribe(response => {
      this.markSquares(response.letterStatusList);
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
    });
  }

  markSquares(letterStatusList: string[]) {
    for(let i = 0; i < 5; i++) {
      let id = this.numRow.toString() + i;
      if(letterStatusList[i] === "Fail")
        this.markSquareAsFailed(id);
      else if(letterStatusList[i] === "Ordered")
        this.markSquareAsOrdered(id);
      else if(letterStatusList[i] === "Unordered")
        this.markSquareAsUnordered(id);
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
