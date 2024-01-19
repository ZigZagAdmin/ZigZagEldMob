"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[4621,3646],{3646:(Z,x,i)=>{i.d(x,{G:()=>t});var e=i(8256),f=i(6895);function y(c,p){if(1&c){const d=e.EpF();e.TgZ(0,"img",6),e.NdJ("click",function(){e.CHM(d);const _=e.oxw();return e.KtG(_.goBack())}),e.qZA()}}const h=["*"];let t=(()=>{class c{constructor(){this.backButton=!1,this.backButtonCallback=new e.vpe}ngOnInit(){}goBack(){this.backButtonCallback.emit()}}return c.\u0275fac=function(d){return new(d||c)},c.\u0275cmp=e.Xpm({type:c,selectors:[["app-header"]],inputs:{title:"title",subtitle:"subtitle",backButton:"backButton"},outputs:{backButtonCallback:"backButtonCallback"},ngContentSelectors:h,decls:9,vars:3,consts:[[1,"title-container","padding-g"],[2,"display","flex","justify-content","space-between","align-items","center"],[1,"title-back"],["src","../../../assets/imgs/back-arrow.png",3,"click",4,"ngIf"],[1,"page-title"],[1,"subtitle","custom-subtitle"],["src","../../../assets/imgs/back-arrow.png",3,"click"]],template:function(d,g){1&d&&(e.F$t(),e.TgZ(0,"div",0)(1,"div",1)(2,"div",2),e.YNc(3,y,1,0,"img",3),e.TgZ(4,"div",4),e._uU(5),e.qZA()(),e.Hsn(6),e.qZA(),e.TgZ(7,"div",5),e._uU(8),e.qZA()()),2&d&&(e.xp6(3),e.Q6J("ngIf",g.backButton),e.xp6(2),e.Oqu(g.title),e.xp6(3),e.hij(" ",g.subtitle," "))},dependencies:[f.O5],styles:[".title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.title-back[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px}.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;height:20px}.custom-subtitle[_ngcontent-%COMP%]{margin-left:35px}.title-container[_ngcontent-%COMP%]{padding-bottom:0}"]}),c})()},4621:(Z,x,i)=>{i.r(x),i.d(x,{EditDutyStatusPageModule:()=>O});var e=i(6895),f=i(4006),y=i(6114),h=i(4529),t=i(8256),c=i(3646),p=i(2187),d=i(4081),g=i(7772);function _(a,u){if(1&a&&(t.O4$(),t.TgZ(0,"g",62)(1,"g",63),t._UZ(2,"line",9),t.TgZ(3,"g",64),t._UZ(4,"line",65)(5,"line",66)(6,"line",67),t.qZA(),t.TgZ(7,"g",68),t._UZ(8,"line",65)(9,"line",66)(10,"line",67),t.qZA(),t.TgZ(11,"g",69),t._UZ(12,"line",70)(13,"line",71)(14,"line",72),t.qZA(),t.TgZ(15,"g",73),t._UZ(16,"line",70)(17,"line",71)(18,"line",72),t.qZA()()()),2&a){const n=u.$implicit;t.xp6(1),t.Udp("transform","translateX("+60*n+"px)")}}function b(a,u){if(1&a&&(t.O4$(),t._UZ(0,"line",76)),2&a){const n=t.oxw().$implicit;t.uIk("x1",n.x1)("x2",n.x1)("y1",n.y1)("y2",n.yV)}}function v(a,u){if(1&a&&(t.O4$(),t.TgZ(0,"g",74),t._UZ(1,"line"),t.YNc(2,b,1,4,"line",75),t.qZA()),2&a){const n=u.$implicit;t.xp6(1),t.Tol(n.class),t.uIk("x1",n.x1)("x2",n.x2)("y1",n.y1)("y2",n.y2),t.xp6(1),t.Q6J("ngIf",n.yV>0)}}const k=function(a){return{"btn-disabled":a}},T=[{path:"",component:(()=>{class a{constructor(n,s){this.nacCtrl=n,this.route=s,this.selectedButton="",this.currentStatus="",this.currentDay="",this.statusesOnDay=[],this.logEvents=[],this.isConfirmButtonActive=!1,this.graphicsHour=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],this.eventGraphicLine=[]}ngOnInit(){this.urlSubscription=this.route.queryParams.subscribe(n=>{this.backUrl=n.url,this.currentStatus=n.currentStatus})}ngOnDestroy(){}goBack(){this.nacCtrl.navigateBack(this.backUrl)}drawGraph(){var n;const s=["OFF","SB","D","ON","PC","YM"];this.eventGraphicLine=[],this.statusesOnDay=[];let r=null,l=null,m="";this.xBgn=0,this.xEnd=0,this.xBgnV=0,this.yBgnV=0,this.currentDay=null===(n=this.logDaily)||void 0===n?void 0:n.logDate,this.logEvents.forEach(o=>{if(s.includes(o.type.code)&&(m=o.eventTime.timeStampEnd?new Date(o.eventTime.timeStampEnd).toISOString():(new Date).toISOString(),"0001-01-01T00:00:00"==m&&(m=(0,e.p6)((new Date).toLocaleString("en-US",{timeZone:this.TimeZoneCity}),"yyyy-MM-ddTHH:mm:ss","en_US")),(0,e.p6)(new Date(o.eventTime.timeStamp),"yyyy-MM-dd","en_US")<=(0,e.p6)(new Date(this.currentDay),"yyyy-MM-dd","en_US")&&(0,e.p6)(new Date(this.currentDay),"yyyy-MM-dd","en_US")<=(0,e.p6)(new Date(m),"yyyy-MM-dd","en_US"))){switch(r=new Date(o.eventTime.timeStamp),this.xBgn=r.toLocaleDateString()===new Date(this.currentDay).toLocaleDateString()?60*r.getHours()+r.getMinutes():0,l=new Date(m),this.xEnd=l.toLocaleDateString()===new Date(this.currentDay).toLocaleDateString()?60*l.getHours()+l.getMinutes():1440,o.type.code){case"OFF":case"PC":this.yBgn=25,this.yEnd=25;break;case"SB":this.yBgn=75,this.yEnd=75;break;case"D":this.yBgn=125,this.yEnd=125;break;case"ON":case"YM":this.yBgn=175,this.yEnd=175}switch(o.type.code){case"OFF":this.eventGraphicLine.push({x1:this.xBgn,y1:this.yBgn,x2:this.xEnd,y2:this.yEnd,yV:this.yBgnV,class:"eventStatusOFF",name:"",historyId:o.logEventId,status:0,statusClick:0});break;case"SB":this.eventGraphicLine.push({x1:this.xBgn,y1:this.yBgn,x2:this.xEnd,y2:this.yEnd,yV:this.yBgnV,class:"eventStatusSB",name:"",historyId:o.logEventId,status:0,statusClick:0});break;case"D":this.eventGraphicLine.push({x1:this.xBgn,y1:this.yBgn,x2:this.xEnd,y2:this.yEnd,yV:this.yBgnV,class:"eventStatusD",name:"",historyId:o.logEventId,status:0,statusClick:0});break;case"ON":this.eventGraphicLine.push({x1:this.xBgn,y1:this.yBgn,x2:this.xEnd,y2:this.yEnd,yV:this.yBgnV,class:"eventStatusON",name:"",historyId:o.logEventId,status:0,statusClick:0});break;case"PC":this.eventGraphicLine.push({x1:this.xBgn,y1:this.yBgn,x2:this.xEnd,y2:this.yEnd,yV:this.yBgnV,class:"eventStatusPC",name:"",historyId:o.logEventId,status:0,statusClick:0});break;case"YM":this.eventGraphicLine.push({x1:this.xBgn,y1:this.yBgn,x2:this.xEnd,y2:this.yEnd,yV:this.yBgnV,class:"eventStatusYM",name:"",historyId:o.logEventId,status:0,statusClick:0})}this.xBgnV=this.xEnd,this.yBgnV=this.yEnd,this.statusesOnDay.push(o)}})}save(){}selectButton(n){this.selectedButton=n,this.isConfirmButtonActive=this.selectedButton!==this.currentStatus}}return a.\u0275fac=function(n){return new(n||a)(t.Y36(y.SH),t.Y36(h.gz))},a.\u0275cmp=t.Xpm({type:a,selectors:[["app-edit-duty-status"]],decls:99,vars:33,consts:[[3,"fullscreen","forceOverscroll"],[3,"title","backButton","backButtonCallback"],[1,"padding-g",2,"display","flex","flex-direction","column","gap","20px"],[1,"card-info"],["preserveAspectRatio","xMidYMid","viewBox","0 0 1600 270"],["transform","translate(65, 40)",1,"grid"],["x","0","y","0","width","1440","height","200","rx","8","ry","8",1,"border"],["class","",4,"ngFor","ngForOf"],["transform","translate(1440, 0)",1,"column"],["x1","0","x2","0","y1","0","y2","200"],["x1","0","x2","1440","y1","0","y2","0",1,"row"],["x1","0","x2","1440","y1","50","y2","50",1,"row"],["x1","0","x2","1440","y1","100","y2","100",1,"row"],["x1","0","x2","1440","y1","150","y2","150",1,"row"],["x1","0","x2","1440","y1","200","y2","200",1,"row"],["transform","translate(35, 40)",1,"duty-status-labels"],["transform","translate(15, 25)","text-anchor","end","dy","0.35em",1,"label"],["transform","translate(15, 75)","text-anchor","end","dy","0.35em",1,"label"],["transform","translate(15, 125)","text-anchor","end","dy","0.35em",1,"label"],["transform","translate(15, 175)","text-anchor","end","dy","0.35em",1,"label"],["transform","translate(65, 40)",1,"hour-labels"],["transform","translate(0, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(60, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(120, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(180, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(240, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(300, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(360, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(420, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(480, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(540, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(600, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(660, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(720, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(780, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(840, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(900, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(960, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(1020, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(1080, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(1140, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(1200, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(1260, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(1320, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(1380, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(1440, 10)","text-anchor","middle","dy","-1em",1,"label"],["transform","translate(1520, 40)",1,"durations"],["transform","translate(0, 25)","dy","0.35em",1,"label"],["transform","translate(0, 75)","dy","0.35em",1,"label"],["transform","translate(0, 125)","dy","0.35em",1,"label"],["transform","translate(0, 175)","dy","0.35em",1,"label"],["transform","translate(65, 40)",1,"eventLine"],["class","eventRecord",4,"ngFor","ngForOf"],[1,"time-inputs"],[3,"label","fill","labelPosition","type","value","noValidation","valueChange"],[1,"status-change"],[3,"selectedValue"],[1,"location-comments"],[3,"label","fill","type","value","noValidation","valueChange"],[1,"confirm-buttons"],[1,"custom-btn","secondary-btn",3,"click"],[1,"custom-btn","primary-btn",3,"ngClass","disabled","click"],[1,""],[1,"column"],["transform","translate(0, 0)",1,"cell","top"],["x1","15","x2","15","y1","0","y2","17.5"],["x1","30","x2","30","y1","0","y2","35"],["x1","45","x2","45","y1","0","y2","17.5"],["transform","translate(0, 50)",1,"cell","top"],["transform","translate(0, 100)",1,"cell","bottom"],["x1","15","x2","15","y1","50","y2","32.5"],["x1","30","x2","30","y1","50","y2","15"],["x1","45","x2","45","y1","50","y2","32.5"],["transform","translate(0, 150)",1,"cell","bottom"],[1,"eventRecord"],["class","vertical",4,"ngIf"],[1,"vertical"]],template:function(n,s){1&n&&(t.TgZ(0,"ion-content",0)(1,"app-header",1),t.NdJ("backButtonCallback",function(){return s.goBack()}),t.qZA(),t.TgZ(2,"div",2)(3,"div",3),t.O4$(),t.TgZ(4,"svg",4)(5,"g",5),t._UZ(6,"rect",6),t.YNc(7,_,19,2,"g",7),t.TgZ(8,"g",8),t._UZ(9,"line",9),t.qZA(),t._UZ(10,"line",10)(11,"line",11)(12,"line",12)(13,"line",13)(14,"line",14),t.qZA(),t.TgZ(15,"g",15)(16,"text",16),t._uU(17,"OFF"),t.qZA(),t.TgZ(18,"text",17),t._uU(19,"SB"),t.qZA(),t.TgZ(20,"text",18),t._uU(21,"D"),t.qZA(),t.TgZ(22,"text",19),t._uU(23,"ON"),t.qZA()(),t.TgZ(24,"g",20)(25,"text",21),t._uU(26,"M"),t.qZA(),t.TgZ(27,"text",22),t._uU(28,"1"),t.qZA(),t.TgZ(29,"text",23),t._uU(30,"2"),t.qZA(),t.TgZ(31,"text",24),t._uU(32,"3"),t.qZA(),t.TgZ(33,"text",25),t._uU(34,"4"),t.qZA(),t.TgZ(35,"text",26),t._uU(36,"5"),t.qZA(),t.TgZ(37,"text",27),t._uU(38,"6"),t.qZA(),t.TgZ(39,"text",28),t._uU(40,"7"),t.qZA(),t.TgZ(41,"text",29),t._uU(42,"8"),t.qZA(),t.TgZ(43,"text",30),t._uU(44,"9"),t.qZA(),t.TgZ(45,"text",31),t._uU(46,"10"),t.qZA(),t.TgZ(47,"text",32),t._uU(48,"11"),t.qZA(),t.TgZ(49,"text",33),t._uU(50,"N"),t.qZA(),t.TgZ(51,"text",34),t._uU(52,"1"),t.qZA(),t.TgZ(53,"text",35),t._uU(54,"2"),t.qZA(),t.TgZ(55,"text",36),t._uU(56,"3"),t.qZA(),t.TgZ(57,"text",37),t._uU(58,"4"),t.qZA(),t.TgZ(59,"text",38),t._uU(60,"5"),t.qZA(),t.TgZ(61,"text",39),t._uU(62,"6"),t.qZA(),t.TgZ(63,"text",40),t._uU(64,"7"),t.qZA(),t.TgZ(65,"text",41),t._uU(66,"8"),t.qZA(),t.TgZ(67,"text",42),t._uU(68,"9"),t.qZA(),t.TgZ(69,"text",43),t._uU(70,"10"),t.qZA(),t.TgZ(71,"text",44),t._uU(72,"11"),t.qZA(),t.TgZ(73,"text",45),t._uU(74,"M"),t.qZA()(),t.TgZ(75,"g",46)(76,"text",47),t._uU(77,"00:00"),t.qZA(),t.TgZ(78,"text",48),t._uU(79,"00:00"),t.qZA(),t.TgZ(80,"text",49),t._uU(81,"00:00"),t.qZA(),t.TgZ(82,"text",50),t._uU(83,"00:00"),t.qZA()(),t.TgZ(84,"g",51),t.YNc(85,v,3,7,"g",52),t.qZA()()(),t.kcU(),t.TgZ(86,"div",53)(87,"app-input",54),t.NdJ("valueChange",function(l){return s.location=l}),t.qZA(),t.TgZ(88,"app-input",54),t.NdJ("valueChange",function(l){return s.location=l}),t.qZA()(),t.TgZ(89,"div",55)(90,"app-duty-radio-button",56),t.NdJ("selectedValue",function(l){return s.selectButton(l)}),t.qZA()(),t.TgZ(91,"div",57)(92,"app-input",54),t.NdJ("valueChange",function(l){return s.location=l}),t.qZA(),t.TgZ(93,"app-textarea",58),t.NdJ("valueChange",function(l){return s.comments=l}),t.qZA()(),t.TgZ(94,"div",59)(95,"button",60),t.NdJ("click",function(){return s.goBack()}),t._uU(96,"Back"),t.qZA(),t.TgZ(97,"button",61),t.NdJ("click",function(){return s.save()}),t._uU(98,"Save"),t.qZA()()()()),2&n&&(t.Q6J("fullscreen",!0)("forceOverscroll",!1),t.xp6(1),t.Q6J("title","Edit Duty Status")("backButton",!0),t.xp6(6),t.Q6J("ngForOf",s.graphicsHour),t.xp6(78),t.Q6J("ngForOf",s.eventGraphicLine),t.xp6(2),t.Q6J("label","Start Time (CT)")("fill",!0)("labelPosition","top")("type","text")("value",s.location)("noValidation",!0),t.xp6(1),t.Q6J("label","End Time (CT)")("fill",!0)("labelPosition","top")("type","text")("value",s.location)("noValidation",!0),t.xp6(4),t.Q6J("label","Location)")("fill",!0)("labelPosition","top")("type","text")("value",s.location)("noValidation",!0),t.xp6(1),t.Q6J("label","Comments")("fill",!0)("type","text")("value",s.comments)("noValidation",!0),t.xp6(4),t.Q6J("ngClass",t.VKq(31,k,!s.isConfirmButtonActive))("disabled",!s.isConfirmButtonActive))},dependencies:[e.mk,e.sg,e.O5,y.W2,c.G,p.a,d.R,g.U],styles:["svg[_ngcontent-%COMP%]:not(:root){overflow:hidden}svg[_ngcontent-%COMP%]{display:block;width:100%}.SVGline[_ngcontent-%COMP%]{stroke:#141;stroke-width:3}rect[_ngcontent-%COMP%]{fill:transparent}rect.eventBorder[_ngcontent-%COMP%]{fill:transparent;stroke-opacity:0;transition:fill .3s ease;cursor:pointer}line[_ngcontent-%COMP%]{stroke:#94a4d7;stroke-width:.5}.eventStatusOFF[_ngcontent-%COMP%]{stroke:#c6c6c6;stroke-width:5}.eventStatusSB[_ngcontent-%COMP%]{stroke:#1f3140;stroke-width:5}.eventStatusD[_ngcontent-%COMP%]{stroke:#3c763d;stroke-width:5}.eventStatusON[_ngcontent-%COMP%]{stroke:#d58512;stroke-width:5}.eventStatusPC[_ngcontent-%COMP%]{stroke:#c6c6c6;stroke-width:5;stroke-dasharray:7}.eventStatusYM[_ngcontent-%COMP%]{stroke:#d58512;stroke-width:5;stroke-dasharray:7}.eventStatusNP[_ngcontent-%COMP%]{stroke-width:3;stroke:#3c763d}.eventStatusLogin[_ngcontent-%COMP%]{stroke-width:3;stroke:#0321fc;stroke-dasharray:6}.eventStatusLogout[_ngcontent-%COMP%]{stroke-width:3;stroke:red;stroke-dasharray:6}.vertical[_ngcontent-%COMP%]{stroke:#002ed0}.horizontalRed[_ngcontent-%COMP%]{stroke:#db2828;stroke-width:7}.confirm-buttons[_ngcontent-%COMP%]{display:flex;gap:15px}.custom-btn[_ngcontent-%COMP%]{flex:1;padding:15px;border-radius:30px;font-size:16px;font-weight:600}.time-inputs[_ngcontent-%COMP%]{display:flex;gap:10px}.location-comments[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:30px}.location-comments[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]{height:100px}"]}),a})()}];let C=(()=>{class a{}return a.\u0275fac=function(n){return new(n||a)},a.\u0275mod=t.oAB({type:a}),a.\u0275inj=t.cJS({imports:[h.Bz.forChild(T),h.Bz]}),a})();var S=i(4546),B=i(4166),P=i(4877),E=i(2218);let O=(()=>{class a{}return a.\u0275fac=function(n){return new(n||a)},a.\u0275mod=t.oAB({type:a}),a.\u0275inj=t.cJS({imports:[e.ez,f.u5,y.Pc,C,S.y,B.v,P.r,E.H]}),a})()}}]);