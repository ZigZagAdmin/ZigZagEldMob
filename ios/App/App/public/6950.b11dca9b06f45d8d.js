"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[6950,3646,8871,4546],{3646:(f,p,e)=>{e.d(p,{G:()=>i});var t=e(8256),v=e(6895);function g(a,l){if(1&a){const n=t.EpF();t.TgZ(0,"img",6),t.NdJ("click",function(){t.CHM(n);const h=t.oxw();return t.KtG(h.goBack())}),t.qZA()}}const u=["*"];let i=(()=>{class a{constructor(){this.backButton=!1,this.backButtonCallback=new t.vpe}ngOnInit(){}goBack(){this.backButtonCallback.emit()}}return a.\u0275fac=function(n){return new(n||a)},a.\u0275cmp=t.Xpm({type:a,selectors:[["app-header"]],inputs:{title:"title",subtitle:"subtitle",backButton:"backButton"},outputs:{backButtonCallback:"backButtonCallback"},ngContentSelectors:u,decls:9,vars:3,consts:[[1,"title-container","padding-g"],[2,"display","flex","justify-content","space-between","align-items","center"],[1,"title-back"],["src","../../../assets/imgs/back-arrow.png",3,"click",4,"ngIf"],[1,"page-title"],[1,"subtitle","custom-subtitle"],["src","../../../assets/imgs/back-arrow.png",3,"click"]],template:function(n,C){1&n&&(t.F$t(),t.TgZ(0,"div",0)(1,"div",1)(2,"div",2),t.YNc(3,g,1,0,"img",3),t.TgZ(4,"div",4),t._uU(5),t.qZA()(),t.Hsn(6),t.qZA(),t.TgZ(7,"div",5),t._uU(8),t.qZA()()),2&n&&(t.xp6(3),t.Q6J("ngIf",C.backButton),t.xp6(2),t.Oqu(C.title),t.xp6(3),t.hij(" ",C.subtitle," "))},dependencies:[v.O5],styles:[".title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.title-back[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px}.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;height:20px}.custom-subtitle[_ngcontent-%COMP%]{margin-left:35px}.title-container[_ngcontent-%COMP%]{padding-bottom:0}"]}),a})()},4546:(f,p,e)=>{e.d(p,{y:()=>i});var t=e(6895),v=e(4006),g=e(6114),u=e(8256);let i=(()=>{class a{}return a.\u0275fac=function(n){return new(n||a)},a.\u0275mod=u.oAB({type:a}),a.\u0275inj=u.cJS({imports:[t.ez,v.u5,g.Pc]}),a})()},2187:(f,p,e)=>{e.d(p,{a:()=>h});var t=e(8256),v=e(4465),g=e(6994),u=e(6895),i=e(4006);const a=function(c,_,o){return{"label-error":c,"input-label-top":_,"input-label-left":o}};function l(c,_){if(1&c&&(t.TgZ(0,"div",3),t._uU(1),t.qZA()),2&c){const o=t.oxw();t.Q6J("ngClass",t.kEZ(3,a,!o.valid,"top"===o.labelPosition,"left"===o.labelPosition)),t.xp6(1),t.AsE(" ",o.label,"",o.required?"*":""," ")}}const n=function(c,_){return{"custom-input-top":c,"custom-input-left":_}},C=function(c,_,o){return{"input-fill":c,"validation-error":_,"input-left":o}};let h=(()=>{class c{constructor(o,d){this.toastService=o,this.shareService=d,this.type="text",this.placeholder="",this.fill=!0,this.validators=[],this.noValidation=!1,this.disabled=!1,this.required=!1,this.labelPosition="top",this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0}get value(){return this._value}set value(o){this._value!==o&&(this._value=o,this.valueChange.emit(o))}get validation(){return this._validation}set validation(o){this._validation!==o&&(this._validation=o,this.validationChange.emit(o))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(o=>{o&&0!==o.length&&this.validateInput()})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(o){0!==o.target.value&&(this.valid=!0),this.value=o.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(o=>!!o.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(o.message),!1)),this.validation=this.valid)}}return c.\u0275fac=function(o){return new(o||c)(t.Y36(v.k),t.Y36(g.t))},c.\u0275cmp=t.Xpm({type:c,selectors:[["app-input"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",validators:"validators",noValidation:"noValidation",disabled:"disabled",required:"required",labelPosition:"labelPosition",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:14,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-box",3,"type","ngModel","disabled","placeholder","ngClass","input","ngModelChange"],[1,"input-label",3,"ngClass"]],template:function(o,d){1&o&&(t.TgZ(0,"div",0),t.YNc(1,l,2,7,"div",1),t.TgZ(2,"input",2),t.NdJ("input",function(O){return d.onInputChange(O)})("ngModelChange",function(O){return d.value=O}),t.qZA()()),2&o&&(t.Q6J("ngClass",t.WLB(7,n,"top"===d.labelPosition,"left"===d.labelPosition)),t.xp6(1),t.Q6J("ngIf",d.label),t.xp6(1),t.Q6J("type",d.type)("ngModel",d.value)("disabled",d.disabled)("placeholder",d.placeholder)("ngClass",t.kEZ(10,C,d.fill,!d.valid,"left"===d.labelPosition)))},dependencies:[u.mk,u.O5,i.Fj,i.JJ,i.On],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:500}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{width:100%;height:45px;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;border:1px solid var(--gray-200);background-color:#fff}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}"]}),c})()},4166:(f,p,e)=>{e.d(p,{v:()=>i});var t=e(6895),v=e(4006),g=e(6114),u=e(8256);let i=(()=>{class a{}return a.\u0275fac=function(n){return new(n||a)},a.\u0275mod=u.oAB({type:a}),a.\u0275inj=u.cJS({imports:[t.ez,v.u5,g.Pc]}),a})()},6950:(f,p,e)=>{e.r(p),e.d(p,{ConnectMacPageModule:()=>x});var t=e(6895),v=e(4006),g=e(6114),u=e(4529),i=e(5861);const l=(0,e(7423).fo)("Geolocation",{web:()=>e.e(4561).then(e.bind(e,4561)).then(s=>new s.GeolocationWeb)});var n=e(8256),C=e(849),h=e(4382),c=e(7278),_=e(6994),o=e(3646),d=e(2187);const O=[{path:"",component:(()=>{class s{constructor(r,m,P,b,B){this.storage=r,this.navCtrl=m,this.storageService=P,this.utilityService=b,this.shareService=B,this.macAddress="",this.validation={macAddress:!1}}ngOnInit(){}ngOnDestroy(){this.shareService.destroyMessage()}getVehicle(){this.storageService.getVehicles().subscribe(r=>{this.vehicle=r[0],console.log(r)},r=>console.log(r))}goBack(){this.navCtrl.navigateBack("/select-vehicle")}ionViewWillEnter(){this.getVehicle(),this.storage.get("vehicleUnit").then(r=>{this.pickedVehicle=r})}getLocation(){return(0,i.Z)(function*(){const r=yield l.getCurrentPosition();console.log("location = ",r)})()}continueDisconected(){this.navCtrl.navigateRoot("/unitab",{animated:!0,animationDirection:"forward"})}redirectToVehicle(){this.navCtrl.navigateBack("/select-vehicle",{replaceUrl:!0})}connect(){this.shareService.changeMessage(this.utilityService.generateString(5)),this.utilityService.validateForm(this.validation)}handleRefresh(r){setTimeout(()=>{r.target.complete()},1e3)}}return s.\u0275fac=function(r){return new(r||s)(n.Y36(C.K),n.Y36(g.SH),n.Y36(h.k),n.Y36(c.t),n.Y36(_.t))},s.\u0275cmp=n.Xpm({type:s,selectors:[["app-connect-mac"]],decls:15,vars:10,consts:[[3,"forceOverscroll","fullscreen"],[3,"title","subtitle","backButton","backButtonCallback"],[1,"connect-wrapper","padding-g"],[1,"input-container"],[1,"input-block","custom-block"],[3,"label","fill","type","value","validation","valueChange","validationChange"],[1,"btn","primary-btn","custom-button",3,"click"],[1,"or-container"],[1,"line"],[1,"word"],[1,"btn","secondary-btn",3,"click"]],template:function(r,m){1&r&&(n.TgZ(0,"ion-content",0)(1,"app-header",1),n.NdJ("backButtonCallback",function(){return m.goBack()}),n.qZA(),n.TgZ(2,"div",2)(3,"div",3)(4,"div",4)(5,"app-input",5),n.NdJ("valueChange",function(b){return m.macAddress=b})("validationChange",function(b){return m.validation.macAddress=b}),n.qZA()(),n.TgZ(6,"button",6),n.NdJ("click",function(){return m.connect()}),n._uU(7,"Connect"),n.qZA()(),n.TgZ(8,"div",7),n._UZ(9,"div",8),n.TgZ(10,"div",9),n._uU(11,"or"),n.qZA(),n._UZ(12,"div",8),n.qZA(),n.TgZ(13,"button",10),n.NdJ("click",function(){return m.continueDisconected()}),n._uU(14," Continue disconnected "),n.qZA()()()),2&r&&(n.Q6J("forceOverscroll",!1)("fullscreen",!0),n.xp6(1),n.Q6J("title","Connect to ELD")("subtitle","Vehicle Unit: "+(null==m.vehicle?null:m.vehicle.vehicleUnit))("backButton",!0),n.xp6(4),n.Q6J("label","MAC Address")("fill",!1)("type","text")("value",m.macAddress)("validation",m.validation.macAddress))},dependencies:[g.W2,o.G,d.a],styles:[".connect-wrapper[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:20px}.connect-wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{width:100%;height:45px;border-radius:41px}.title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.title-back[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px}.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;height:20px}.custom-subtitle[_ngcontent-%COMP%]{margin-left:35px}.title-container[_ngcontent-%COMP%]{padding-bottom:0}.input-container[_ngcontent-%COMP%]{display:flex;align-items:flex-end;gap:10px}.custom-button[_ngcontent-%COMP%]{flex:1;border-radius:8px!important;padding:15px 10px}.custom-block[_ngcontent-%COMP%]{flex:4;width:100%}.or-container[_ngcontent-%COMP%]{display:flex;gap:20px;align-items:center}.or-container[_ngcontent-%COMP%]   .word[_ngcontent-%COMP%]{font-size:14px;font-weight:400;color:var(--gray-500)}.or-container[_ngcontent-%COMP%]   .line[_ngcontent-%COMP%]{width:100%;height:0px;border-top:1px solid var(--gray-300)}"]}),s})()}];let y=(()=>{class s{}return s.\u0275fac=function(r){return new(r||s)},s.\u0275mod=n.oAB({type:s}),s.\u0275inj=n.cJS({imports:[u.Bz.forChild(O),u.Bz]}),s})();var T=e(4546),D=e(4166);let x=(()=>{class s{}return s.\u0275fac=function(r){return new(r||s)},s.\u0275mod=n.oAB({type:s}),s.\u0275inj=n.cJS({imports:[t.ez,v.u5,g.Pc,y,T.y,D.v]}),s})()},6994:(f,p,e)=>{e.d(p,{t:()=>u});var t=e(7579),v=e(1135),g=e(8256);let u=(()=>{class i{constructor(){this.editDataDetails=[],this.subject=new t.x,this.messageSource=new v.X(this.editDataDetails),this.currentMessage=this.messageSource.asObservable()}changeMessage(l){this.messageSource.next(l)}destroyMessage(){this.messageSource.next("")}}return i.\u0275fac=function(l){return new(l||i)},i.\u0275prov=g.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()},4465:(f,p,e)=>{e.d(p,{k:()=>u});var t=e(5861),v=e(8256),g=e(6114);let u=(()=>{class i{constructor(l){this.toastController=l}showToast(l,n="danger",C=1e3){var h=this;return(0,t.Z)(function*(){h.currentToast&&(yield h.dismissToast());const c=yield h.toastController.create({message:l,duration:C,color:n});h.currentToast=c,c.onDidDismiss().then(()=>{h.currentToast=null}),c.present()})()}dismissToast(){var l=this;return(0,t.Z)(function*(){l.currentToast&&(yield l.toastController.dismiss(),l.currentToast=null)})()}}return i.\u0275fac=function(l){return new(l||i)(v.LFG(g.yF))},i.\u0275prov=v.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()}}]);