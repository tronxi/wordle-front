import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit {

  @Input()
  text: string;

  constructor() {
    this.text = '';
  }

  ngOnInit(): void {
  }

}
