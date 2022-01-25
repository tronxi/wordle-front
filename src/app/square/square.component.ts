import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {

  @Input()
  text: string;

  constructor() {
    this.text = ' ';
  }

  ngOnInit(): void {
  }

}
