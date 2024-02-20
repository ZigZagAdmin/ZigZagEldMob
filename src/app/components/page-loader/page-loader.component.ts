import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss'],
})
export class PageLoaderComponent  implements OnInit {

  @Input() height: string = 'calc(100% - 52px)'; 

  constructor() { }

  ngOnInit() {}

}
