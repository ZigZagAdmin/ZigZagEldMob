import { Component, OnInit, Input } from '@angular/core';
import { DVIRs } from 'src/app/models/dvirs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {

  @Input() dvir!: DVIRs

  constructor() { }

  ngOnInit() {}

}
