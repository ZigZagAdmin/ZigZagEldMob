"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[7018,3646,8871,4576,4546],{3646:(C,m,n)=>{n.d(m,{G:()=>i});var e=n(8256),v=n(6895);function g(o,r){if(1&o){const t=e.EpF();e.TgZ(0,"img",6),e.NdJ("click",function(){e.CHM(t);const _=e.oxw();return e.KtG(_.goBack())}),e.qZA()}}const c=["*"];let i=(()=>{class o{constructor(){this.backButton=!1,this.backButtonCallback=new e.vpe}ngOnInit(){}goBack(){this.backButtonCallback.emit()}}return o.\u0275fac=function(t){return new(t||o)},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-header"]],inputs:{title:"title",subtitle:"subtitle",backButton:"backButton"},outputs:{backButtonCallback:"backButtonCallback"},ngContentSelectors:c,decls:9,vars:3,consts:[[1,"title-container","padding-g"],[2,"display","flex","justify-content","space-between","align-items","center"],[1,"title-back"],["src","../../../assets/imgs/back-arrow.png",3,"click",4,"ngIf"],[1,"page-title"],[1,"subtitle","custom-subtitle"],["src","../../../assets/imgs/back-arrow.png",3,"click"]],template:function(t,f){1&t&&(e.F$t(),e.TgZ(0,"div",0)(1,"div",1)(2,"div",2),e.YNc(3,g,1,0,"img",3),e.TgZ(4,"div",4),e._uU(5),e.qZA()(),e.Hsn(6),e.qZA(),e.TgZ(7,"div",5),e._uU(8),e.qZA()()),2&t&&(e.xp6(3),e.Q6J("ngIf",f.backButton),e.xp6(2),e.Oqu(f.title),e.xp6(3),e.hij(" ",f.subtitle," "))},dependencies:[v.O5],styles:[".title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.title-back[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px}.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;height:20px}.custom-subtitle[_ngcontent-%COMP%]{margin-left:35px}.title-container[_ngcontent-%COMP%]{padding-bottom:0}"]}),o})()},4546:(C,m,n)=>{n.d(m,{y:()=>i});var e=n(6895),v=n(4006),g=n(6114),c=n(8256);let i=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=c.oAB({type:o}),o.\u0275inj=c.cJS({imports:[e.ez,v.u5,g.Pc]}),o})()},2187:(C,m,n)=>{n.d(m,{a:()=>_});var e=n(8256),v=n(4465),g=n(6994),c=n(6895),i=n(4006);const o=function(u,h,l,p){return{"label-error":u,"input-label-top":h,"input-label-left":l,"no-label":p}};function r(u,h){if(1&u&&(e.TgZ(0,"div",3),e._uU(1),e.qZA()),2&u){const l=e.oxw();e.Q6J("ngClass",e.l5B(3,o,!l.valid,"top"===l.labelPosition,"left"===l.labelPosition,"none"===l.label)),e.xp6(1),e.AsE(" ",l.label,"",l.required?"*":""," ")}}const t=function(u,h){return{"custom-input-top":u,"custom-input-left":h}},f=function(u,h,l){return{"input-fill":u,"validation-error":h,"input-left":l}};let _=(()=>{class u{constructor(l,p){this.toastService=l,this.shareService=p,this.type="text",this.placeholder="",this.fill=!0,this.validators=[],this.noValidation=!1,this.disabled=!1,this.required=!1,this.labelPosition="top",this.valueChange=new e.vpe,this.validationChange=new e.vpe,this.valid=!0}get value(){return this._value}set value(l){this._value!==l&&(this._value=l,this.valueChange.emit(l))}get validation(){return this._validation}set validation(l){this._validation!==l&&(this._validation=l,this.validationChange.emit(l))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(l=>{"reset"===l?this.valid=!0:l&&0!==l.length&&this.validateInput()})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(l){0!==l.target.value&&(this.valid=!0),this.value=l.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(l=>!!l.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(l.message),!1)),this.validation=this.valid)}}return u.\u0275fac=function(l){return new(l||u)(e.Y36(v.k),e.Y36(g.t))},u.\u0275cmp=e.Xpm({type:u,selectors:[["app-input"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",validators:"validators",noValidation:"noValidation",disabled:"disabled",required:"required",labelPosition:"labelPosition",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:14,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],["autocomplete","one-time-code",1,"input-box",3,"type","ngModel","disabled","placeholder","ngClass","input","ngModelChange"],[1,"input-label",3,"ngClass"]],template:function(l,p){1&l&&(e.TgZ(0,"div",0),e.YNc(1,r,2,8,"div",1),e.TgZ(2,"input",2),e.NdJ("input",function(b){return p.onInputChange(b)})("ngModelChange",function(b){return p.value=b}),e.qZA()()),2&l&&(e.Q6J("ngClass",e.WLB(7,t,"top"===p.labelPosition,"left"===p.labelPosition)),e.xp6(1),e.Q6J("ngIf",p.label),e.xp6(1),e.Q6J("type",p.type)("ngModel",p.value)("disabled",p.disabled)("placeholder",p.placeholder)("ngClass",e.kEZ(10,f,p.fill,!p.valid,"left"===p.labelPosition)))},dependencies:[c.mk,c.O5,i.Fj,i.JJ,i.On],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:500}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{width:100%;height:45px;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;border:1px solid var(--gray-200);background-color:#fff}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}.no-label[_ngcontent-%COMP%]{color:transparent!important}"]}),u})()},4166:(C,m,n)=>{n.d(m,{v:()=>i});var e=n(6895),v=n(4006),g=n(6114),c=n(8256);let i=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=c.oAB({type:o}),o.\u0275inj=c.cJS({imports:[e.ez,v.u5,g.Pc]}),o})()},7018:(C,m,n)=>{n.r(m),n.d(m,{AccountPageModule:()=>E});var e=n(6895),v=n(4006),g=n(6114),c=n(5050),i=n(5861),o=n(3905),r=n(4128),t=n(8256),f=n(4382),_=n(849),u=n(3646),h=n(2187);const p=[{path:"",component:(()=>{class d{constructor(s,a,P){this.navCtrl=s,this.databaseService=a,this.storage=P,this.pageLoading=!1,this.timeZone=""}ngOnInit(){var s=this;return(0,i.Z)(function*(){s.pageLoading=!0;let a=(0,o.z)(s.databaseService.getDrivers()),P=(0,o.z)(s.databaseService.getCompany()),T=s.storage.get("TimeZoneCity"),D=s.storage.get("language");(0,r.D)([a,P,T,D]).subscribe(([I,A,B,Z])=>{s.driver=I[0],s.company=A,s.timeZone=B,s.language=Z,s.language=s.language.toUpperCase()})})()}goBack(){this.navCtrl.navigateBack("unitab/others")}}return d.\u0275fac=function(s){return new(s||d)(t.Y36(g.SH),t.Y36(f.k),t.Y36(_.K))},d.\u0275cmp=t.Xpm({type:d,selectors:[["app-account"]],decls:20,vars:63,consts:[[3,"forceOverscroll"],[3,"title","backButton","backButtonCallback"],[2,"display","flex","flex-direction","column","height","calc(100% - 47px)"],[1,"edit-dvir-block","padding-g"],[3,"label","fill","type","disabled","value","noValidation"],[2,"display","flex","gap","15px"],[2,"flex","1","display","flex","align-items","flex-end"],[1,"reminder"],["src","assets/icon/reminder.svg","alt","reminder"],[1,"reminder-text"]],template:function(s,a){1&s&&(t.TgZ(0,"ion-content",0)(1,"app-header",1),t.NdJ("backButtonCallback",function(){return a.goBack()}),t.qZA(),t.TgZ(2,"div",2)(3,"div",3),t._UZ(4,"app-input",4)(5,"app-input",4)(6,"app-input",4),t.TgZ(7,"div",5),t._UZ(8,"app-input",4)(9,"app-input",4)(10,"app-input",4),t.qZA(),t._UZ(11,"app-input",4)(12,"app-input",4)(13,"app-input",4)(14,"app-input",4),t.qZA(),t.TgZ(15,"div",6)(16,"div",7),t._UZ(17,"img",8),t.TgZ(18,"p",9),t._uU(19,"In order to change your information please contact your fleet manager"),t.qZA()()()()()),2&s&&(t.Q6J("forceOverscroll",!1),t.xp6(1),t.Q6J("title","Account")("backButton",!0),t.xp6(3),t.Q6J("label","Name")("fill",!0)("type","text")("disabled",!0)("value",null==a.driver?null:a.driver.name)("noValidation",!0),t.xp6(1),t.Q6J("label","Email")("fill",!0)("type","text")("disabled",!0)("value",null==a.driver?null:a.driver.email)("noValidation",!0),t.xp6(1),t.Q6J("label","Phone Number")("fill",!0)("type","text")("disabled",!0)("value",null==a.driver?null:a.driver.phoneNumber)("noValidation",!0),t.xp6(2),t.Q6J("label","License")("fill",!0)("type","text")("disabled",!0)("value",(null==a.driver||null==a.driver.driverInfo?null:a.driver.driverInfo.licenseCountry)+", "+(null==a.driver||null==a.driver.driverInfo?null:a.driver.driverInfo.licenseNumber))("noValidation",!0),t.xp6(1),t.Q6J("label","Time Zone")("fill",!0)("type","text")("disabled",!0)("value",a.timeZone)("noValidation",!0),t.xp6(1),t.Q6J("label","Odometer")("fill",!0)("type","text")("disabled",!0)("value",null==a.driver||null==a.driver.driverInfo||null==a.driver.driverInfo.settings||null==a.driver.driverInfo.settings.hoursOfService?null:a.driver.driverInfo.settings.hoursOfService.odometerUnit)("noValidation",!0),t.xp6(1),t.Q6J("label","Carrier")("fill",!0)("type","text")("disabled",!0)("value",null==a.company?null:a.company.name)("noValidation",!0),t.xp6(1),t.Q6J("label","Main Office Address")("fill",!0)("type","text")("disabled",!0)("value",(null==a.company||null==a.company.mainOffice?null:a.company.mainOffice.street)+", "+(null==a.company||null==a.company.mainOffice?null:a.company.mainOffice.city)+", "+(null==a.company||null==a.company.mainOffice?null:a.company.mainOffice.stateProvinceCode)+" "+(null==a.company||null==a.company.mainOffice?null:a.company.mainOffice.zipCode)+", "+(null==a.company||null==a.company.mainOffice?null:a.company.mainOffice.countryCode))("noValidation",!0),t.xp6(1),t.Q6J("label","Home Terminal Address")("fill",!0)("type","text")("disabled",!0)("value",(null==a.company?null:a.company.terminals[0].street)+", "+(null==a.company?null:a.company.terminals[0].city)+", "+(null==a.company?null:a.company.terminals[0].stateProvinceCode)+" "+(null==a.company?null:a.company.terminals[0].zipCode)+", "+(null==a.company?null:a.company.terminals[0].countryCode))("noValidation",!0),t.xp6(1),t.Q6J("label","Language")("fill",!0)("type","text")("disabled",!0)("value",a.language)("noValidation",!0))},dependencies:[g.W2,u.G,h.a],styles:[".three-inputs[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;gap:15px}.reminder[_ngcontent-%COMP%]{margin:0 20px 20px}"]}),d})()}];let M=(()=>{class d{}return d.\u0275fac=function(s){return new(s||d)},d.\u0275mod=t.oAB({type:d}),d.\u0275inj=t.cJS({imports:[c.Bz.forChild(p),c.Bz]}),d})();var b=n(4546),O=n(4166);let E=(()=>{class d{}return d.\u0275fac=function(s){return new(s||d)},d.\u0275mod=t.oAB({type:d}),d.\u0275inj=t.cJS({imports:[e.ez,v.u5,g.Pc,M,b.y,O.v]}),d})()},6994:(C,m,n)=>{n.d(m,{t:()=>c});var e=n(7579),v=n(1135),g=n(8256);let c=(()=>{class i{constructor(){this.editDataDetails=[],this.subject=new e.x,this.messageSource=new v.X(this.editDataDetails),this.currentMessage=this.messageSource.asObservable()}changeMessage(r){this.messageSource.next(r)}destroyMessage(){this.messageSource.next("")}}return i.\u0275fac=function(r){return new(r||i)},i.\u0275prov=g.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()},4465:(C,m,n)=>{n.d(m,{k:()=>c});var e=n(5861),v=n(8256),g=n(6114);let c=(()=>{class i{constructor(r){this.toastController=r}showToast(r,t="danger",f=1e3){var _=this;return(0,e.Z)(function*(){_.currentToast&&(yield _.dismissToast());const u=yield _.toastController.create({message:r,duration:f,color:t});_.currentToast=u,u.onDidDismiss().then(()=>{_.currentToast=null}),u.present()})()}dismissToast(){var r=this;return(0,e.Z)(function*(){r.currentToast&&(yield r.toastController.dismiss(),r.currentToast=null)})()}}return i.\u0275fac=function(r){return new(r||i)(v.LFG(g.yF))},i.\u0275prov=v.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()},3905:(C,m,n)=>{n.d(m,{z:()=>g});var e=n(6805),v=n(2961);function g(c,i){const o="object"==typeof i;return new Promise((r,t)=>{const f=new v.Hp({next:_=>{r(_),f.unsubscribe()},error:t,complete:()=>{o?r(i.defaultValue):t(new e.K)}});c.subscribe(f)})}}}]);