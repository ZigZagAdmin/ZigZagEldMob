"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5746,3646,8871,4546],{3646:(C,s,e)=>{e.d(s,{G:()=>n});var t=e(8256),m=e(6895);function l(a,u){if(1&a){const c=t.EpF();t.TgZ(0,"img",6),t.NdJ("click",function(){t.CHM(c);const p=t.oxw();return t.KtG(p.goBack())}),t.qZA()}}const i=["*"];let n=(()=>{class a{constructor(){this.backButton=!1,this.backButtonCallback=new t.vpe}ngOnInit(){}goBack(){this.backButtonCallback.emit()}}return a.\u0275fac=function(c){return new(c||a)},a.\u0275cmp=t.Xpm({type:a,selectors:[["app-header"]],inputs:{title:"title",subtitle:"subtitle",backButton:"backButton"},outputs:{backButtonCallback:"backButtonCallback"},ngContentSelectors:i,decls:9,vars:3,consts:[[1,"title-container","padding-g"],[2,"display","flex","justify-content","space-between","align-items","center"],[1,"title-back"],["src","../../../assets/imgs/back-arrow.png",3,"click",4,"ngIf"],[1,"page-title"],[1,"subtitle","custom-subtitle"],["src","../../../assets/imgs/back-arrow.png",3,"click"]],template:function(c,g){1&c&&(t.F$t(),t.TgZ(0,"div",0)(1,"div",1)(2,"div",2),t.YNc(3,l,1,0,"img",3),t.TgZ(4,"div",4),t._uU(5),t.qZA()(),t.Hsn(6),t.qZA(),t.TgZ(7,"div",5),t._uU(8),t.qZA()()),2&c&&(t.xp6(3),t.Q6J("ngIf",g.backButton),t.xp6(2),t.Oqu(g.title),t.xp6(3),t.hij(" ",g.subtitle," "))},dependencies:[m.O5],styles:[".title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.title-back[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px}.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;height:20px}.custom-subtitle[_ngcontent-%COMP%]{margin-left:35px}.title-container[_ngcontent-%COMP%]{padding-bottom:0}@media (prefers-color-scheme: dark){.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{filter:invert(1)}}"]}),a})()},4546:(C,s,e)=>{e.d(s,{y:()=>n});var t=e(6895),m=e(4006),l=e(6114),i=e(8256);let n=(()=>{class a{}return a.\u0275fac=function(c){return new(c||a)},a.\u0275mod=i.oAB({type:a}),a.\u0275inj=i.cJS({imports:[t.ez,m.u5,l.Pc]}),a})()},5746:(C,s,e)=>{e.r(s),e.d(s,{CoDriverPageModule:()=>v});var t=e(6895),m=e(4006),l=e(6114),i=e(4529),n=e(8256),a=e(3646);const c=[{path:"",component:(()=>{class o{constructor(r){this.navCtrl=r}ngOnInit(){}goBack(){this.navCtrl.navigateBack("unitab/others")}}return o.\u0275fac=function(r){return new(r||o)(n.Y36(l.SH))},o.\u0275cmp=n.Xpm({type:o,selectors:[["app-co-driver"]],decls:4,vars:4,consts:[[3,"fullscreen","forceOverscroll"],[3,"title","backButton","backButtonCallback"],[1,"padding-g","no-data"]],template:function(r,f){1&r&&(n.TgZ(0,"ion-content",0)(1,"app-header",1),n.NdJ("backButtonCallback",function(){return f.goBack()}),n.qZA(),n.TgZ(2,"div",2),n._uU(3,"No data."),n.qZA()()),2&r&&(n.Q6J("fullscreen",!0)("forceOverscroll",!1),n.xp6(1),n.Q6J("title","Co-Driver")("backButton",!0))},dependencies:[l.W2,a.G],styles:[".no-data[_ngcontent-%COMP%]{width:100%;height:calc(100% - 57px);display:flex;justify-content:center;align-items:center}"]}),o})()}];let g=(()=>{class o{}return o.\u0275fac=function(r){return new(r||o)},o.\u0275mod=n.oAB({type:o}),o.\u0275inj=n.cJS({imports:[i.Bz.forChild(c),i.Bz]}),o})();var p=e(4546);let v=(()=>{class o{}return o.\u0275fac=function(r){return new(r||o)},o.\u0275mod=n.oAB({type:o}),o.\u0275inj=n.cJS({imports:[t.ez,m.u5,l.Pc,g,p.y]}),o})()}}]);