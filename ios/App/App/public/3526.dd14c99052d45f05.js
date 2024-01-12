"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[3526,3646,8871,4546],{3646:(v,s,n)=>{n.d(s,{G:()=>e});var t=n(8256),p=n(6895);function c(a,u){if(1&a){const l=t.EpF();t.TgZ(0,"img",6),t.NdJ("click",function(){t.CHM(l);const m=t.oxw();return t.KtG(m.goBack())}),t.qZA()}}const r=["*"];let e=(()=>{class a{constructor(){this.backButton=!1,this.backButtonCallback=new t.vpe}ngOnInit(){}goBack(){this.backButtonCallback.emit()}}return a.\u0275fac=function(l){return new(l||a)},a.\u0275cmp=t.Xpm({type:a,selectors:[["app-header"]],inputs:{title:"title",subtitle:"subtitle",backButton:"backButton"},outputs:{backButtonCallback:"backButtonCallback"},ngContentSelectors:r,decls:9,vars:3,consts:[[1,"title-container","padding-g"],[2,"display","flex","justify-content","space-between","align-items","center"],[1,"title-back"],["src","../../../assets/imgs/back-arrow.png",3,"click",4,"ngIf"],[1,"page-title"],[1,"subtitle","custom-subtitle"],["src","../../../assets/imgs/back-arrow.png",3,"click"]],template:function(l,d){1&l&&(t.F$t(),t.TgZ(0,"div",0)(1,"div",1)(2,"div",2),t.YNc(3,c,1,0,"img",3),t.TgZ(4,"div",4),t._uU(5),t.qZA()(),t.Hsn(6),t.qZA(),t.TgZ(7,"div",5),t._uU(8),t.qZA()()),2&l&&(t.xp6(3),t.Q6J("ngIf",d.backButton),t.xp6(2),t.Oqu(d.title),t.xp6(3),t.hij(" ",d.subtitle," "))},dependencies:[p.O5],styles:[".title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.title-back[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px}.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;height:20px}.custom-subtitle[_ngcontent-%COMP%]{margin-left:35px}.title-container[_ngcontent-%COMP%]{padding-bottom:0}@media (prefers-color-scheme: dark){.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{filter:invert(1)}}"]}),a})()},4546:(v,s,n)=>{n.d(s,{y:()=>e});var t=n(6895),p=n(4006),c=n(6114),r=n(8256);let e=(()=>{class a{}return a.\u0275fac=function(l){return new(l||a)},a.\u0275mod=r.oAB({type:a}),a.\u0275inj=r.cJS({imports:[t.ez,p.u5,c.Pc]}),a})()},3526:(v,s,n)=>{n.r(s),n.d(s,{RulesPageModule:()=>_});var t=n(6895),p=n(4006),c=n(6114),r=n(4529),e=n(8256),a=n(3646);const l=[{path:"",component:(()=>{class o{constructor(i){this.navCtrl=i}ngOnInit(){}goBack(){this.navCtrl.navigateBack("unitab/others")}}return o.\u0275fac=function(i){return new(i||o)(e.Y36(c.SH))},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-rules"]],decls:54,vars:3,consts:[[3,"forceOverscroll"],[3,"title","backButton","backButtonCallback"],[2,"display","flex","flex-direction","column","height","calc(100% - 57px)"],[1,"edit-dvir-block","padding-g"],[1,"flex-b"],[1,"text-2"],[1,"btn","secondary-btn"],[1,"btn","error-btn"],[1,"btn","success-btn"],[2,"flex","1","display","flex","align-items","flex-end"],[1,"reminder"],["src","assets/icon/reminder.svg","alt","reminder"],[1,"reminder-text"]],template:function(i,Z){1&i&&(e.TgZ(0,"ion-content",0)(1,"app-header",1),e.NdJ("backButtonCallback",function(){return Z.goBack()}),e.qZA(),e.TgZ(2,"div",2)(3,"div",3)(4,"div",4)(5,"p",5),e._uU(6,"Cycle Rule"),e.qZA(),e.TgZ(7,"div",6),e._uU(8,"USA 70 hour / 8 day"),e.qZA()(),e.TgZ(9,"div",4)(10,"p",5),e._uU(11,"Cargo Type"),e.qZA(),e.TgZ(12,"div",6),e._uU(13,"Property"),e.qZA()(),e.TgZ(14,"div",4)(15,"p",5),e._uU(16,"Rest Break"),e.qZA(),e.TgZ(17,"div",6),e._uU(18,"30 Min Required"),e.qZA()(),e.TgZ(19,"div",4)(20,"p",5),e._uU(21,"Restart"),e.qZA(),e.TgZ(22,"div",6),e._uU(23,"34 hours Restart"),e.qZA()(),e.TgZ(24,"div",4)(25,"p",5),e._uU(26,"16-hour short-haul exeption"),e.qZA(),e.TgZ(27,"div",7),e._uU(28,"Forbidden"),e.qZA()(),e.TgZ(29,"div",4)(30,"p",5),e._uU(31,"Personal Conveyance"),e.qZA(),e.TgZ(32,"div",8),e._uU(33,"Allowed"),e.qZA()(),e.TgZ(34,"div",4)(35,"p",5),e._uU(36,"Yard Moves"),e.qZA(),e.TgZ(37,"div",8),e._uU(38,"Allowed"),e.qZA()(),e.TgZ(39,"div",4)(40,"p",5),e._uU(41,"Unlinited Trilerlease"),e.qZA(),e.TgZ(42,"div",7),e._uU(43,"Forbidden"),e.qZA()(),e.TgZ(44,"div",4)(45,"p",5),e._uU(46,"Unlimited Shipping Documents"),e.qZA(),e.TgZ(47,"div",7),e._uU(48,"Forbidden"),e.qZA()()(),e.TgZ(49,"div",9)(50,"div",10),e._UZ(51,"img",11),e.TgZ(52,"p",12),e._uU(53,"In order to change your information please contact your fleet manager"),e.qZA()()()()()),2&i&&(e.Q6J("forceOverscroll",!1),e.xp6(1),e.Q6J("title","Rules")("backButton",!0))},dependencies:[c.W2,a.G],styles:[".edit-dvir-block[_ngcontent-%COMP%]{flex:1}.reminder[_ngcontent-%COMP%]{flex:1;margin:0 30px 30px}.btn[_ngcontent-%COMP%]{border-radius:30px;padding:10px 15px}"]}),o})()}];let d=(()=>{class o{}return o.\u0275fac=function(i){return new(i||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[r.Bz.forChild(l),r.Bz]}),o})();var m=n(4546);let _=(()=>{class o{}return o.\u0275fac=function(i){return new(i||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[t.ez,p.u5,c.Pc,d,m.y]}),o})()}}]);