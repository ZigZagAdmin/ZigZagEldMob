"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[503],{7236:(M,b,n)=>{n.d(b,{L:()=>D});var a=n(8256),h=n(4465),f=n(6994),m=n(6895),c=n(4006),g=n(7151);const _=function(u,v,o,d){return{"label-error":u,"input-label-top":v,"input-label-left":o,"no-label":d}};function e(u,v){if(1&u&&(a.TgZ(0,"div",5),a._uU(1),a.qZA()),2&u){const o=a.oxw();a.Q6J("ngClass",a.l5B(3,_,!o.valid,"top"===o.labelPosition,"left"===o.labelPosition,"none"===o.label)),a.xp6(1),a.AsE(" ",o.label,"",o.required?"*":""," ")}}function P(u,v){1&u&&a._UZ(0,"ion-spinner",6)}const y=function(u,v){return{"custom-input-top":u,"custom-input-left":v}},I=function(u,v,o){return{"input-fill":u,"validation-error":v,"input-left":o}};let D=(()=>{class u{constructor(o,d){this.toastService=o,this.shareService=d,this.type="text",this.placeholder="",this.fill=!0,this.loading=!1,this.validators=[],this.noValidation=!1,this.disabled=!1,this.required=!1,this.labelPosition="top",this.valueChange=new a.vpe,this.validationChange=new a.vpe,this.valid=!0}get value(){return this._value}set value(o){this._value!==o&&(this._value=o,this.valueChange.emit(o))}get validation(){return this._validation}set validation(o){this._validation!==o&&(this._validation=o,this.validationChange.emit(o))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(o=>{"reset"===o?this.valid=!0:o&&0!==o.length&&this.validateInput()})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(o){0!==o.target.value&&(this.valid=!0),this.value=o.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(o=>!!o.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(o.message),!1)),this.validation=this.valid)}}return u.\u0275fac=function(o){return new(o||u)(a.Y36(h.k),a.Y36(f.t))},u.\u0275cmp=a.Xpm({type:u,selectors:[["app-location-input"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",loading:"loading",validators:"validators",noValidation:"noValidation",disabled:"disabled",required:"required",labelPosition:"labelPosition",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:5,vars:15,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-container"],["autocomplete","one-time-code",1,"input-box",3,"type","ngModel","disabled","placeholder","ngClass","input","ngModelChange"],["class","input-loading","name","circular","color","medium",4,"ngIf"],[1,"input-label",3,"ngClass"],["name","circular","color","medium",1,"input-loading"]],template:function(o,d){1&o&&(a.TgZ(0,"div",0),a.YNc(1,e,2,8,"div",1),a.TgZ(2,"div",2)(3,"input",3),a.NdJ("input",function(C){return d.onInputChange(C)})("ngModelChange",function(C){return d.value=C}),a.qZA(),a.YNc(4,P,1,0,"ion-spinner",4),a.qZA()()),2&o&&(a.Q6J("ngClass",a.WLB(8,y,"top"===d.labelPosition,"left"===d.labelPosition)),a.xp6(1),a.Q6J("ngIf",d.label),a.xp6(2),a.Q6J("type",d.type)("ngModel",d.value)("disabled",d.disabled)("placeholder",d.placeholder)("ngClass",a.kEZ(11,I,d.fill,!d.valid,"left"===d.labelPosition)),a.xp6(1),a.Q6J("ngIf",d.loading))},dependencies:[m.mk,m.O5,c.Fj,c.JJ,c.On,g.PQ],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:500}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{width:100%;height:45px;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;border:1px solid var(--gray-200);background-color:#fff}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}.no-label[_ngcontent-%COMP%]{color:transparent!important}.input-container[_ngcontent-%COMP%]{position:relative}.input-loading[_ngcontent-%COMP%]{position:absolute;right:20px;top:18px;zoom:.7}"]}),u})()},8134:(M,b,n)=>{n.d(b,{y:()=>c});var a=n(6895),h=n(4006),f=n(7151),m=n(8256);let c=(()=>{class g{}return g.\u0275fac=function(e){return new(e||g)},g.\u0275mod=m.oAB({type:g}),g.\u0275inj=m.cJS({imports:[a.ez,h.u5,f.Pc]}),g})()},503:(M,b,n)=>{n.r(b),n.d(b,{InsertDvirPageModule:()=>w});var a=n(6895),h=n(4006),f=n(7151),m=n(5050),c=n(5861),g=n(4171),_=n(6321),e=n(8256),P=n(4382),y=n(849),I=n(9386),D=n(7219),u=n(7278),v=n(6994),o=n(4465),d=n(7940),T=n(3646),C=n(9534),O=n(2187),Z=n(4081),L=n(1585),x=n(7236);function U(s,p){1&s&&e._UZ(0,"ion-spinner",25)}const S=function(s){return{"no-display":s}};function J(s,p){if(1&s){const t=e.EpF();e.TgZ(0,"div",22)(1,"img",23),e.NdJ("load",function(){e.CHM(t);const r=e.oxw();return e.KtG(r.imageLoaded())}),e.qZA(),e.YNc(2,U,1,0,"ion-spinner",24),e.qZA()}if(2&s){const t=e.oxw();e.xp6(1),e.Q6J("ngClass",e.VKq(3,S,t.imageLoading))("src",t.dvir.signatureLink,e.LSH),e.xp6(1),e.Q6J("ngIf",t.imageLoading)}}function A(s,p){1&s&&(e.TgZ(0,"span"),e._uU(1,"Save"),e.qZA())}function E(s,p){1&s&&e._UZ(0,"ion-spinner",26)}const B=function(s){return{"disable-click":s}},V=[{path:"",component:(()=>{class s{constructor(t,i,r,l,z,j,H,G,X){this.databaseService=t,this.storage=i,this.dashboardService=r,this.internetService=l,this.navCtrl=z,this.utilityService=j,this.shareService=H,this.toastService=G,this.locationService=X,this.defectsVehicle=_.mK,this.defectsTrailers=_.Jk,this.signaturePadOptions={minWidth:2,maxWidth:3,backgroundColor:"#FFFFFF",penColor:"black"},this.DvirId="",this.dvirs=[],this.bReady=!1,this.vehicleUnit="",this.vehicleId="",this.driverId="",this.statusIcon="checkmark-circle-outline",this.networkStatus=!1,this.imageLoading=!1,this.dvir={dvirId:this.utilityService.uuidv4(),driver:{driverId:""},vehicle:{vehicleUnit:"",vehicleId:""},odometer:0,trailers:"",defectsVehicle:"",defectsTrailers:"",remarks:"",status:{code:"",name:""},location:{description:"",latitude:0,longitude:0},createDate:new Date((0,a.p6)(new Date,"yyyy-MM-ddTHH:mm:ss","en-US")).getTime(),createTimeZone:"",repairDate:0,repairTimeZone:"",signatureId:this.utilityService.uuidv4(),signatureBase64:"",signatureLink:""},this.validation={trailerName:!1,locationDescription:!1},this.locationDisable=!1,this.locationLoading=!1,this.vehicleUnitDisable=!1,this.lastStatus="",this.optionDisable=!0,this.loading=!1,this.signatureFound=!1}ngOnInit(){var t=this;return(0,c.Z)(function*(){t.locationLoading=!0,t.dvir.status.name="Vehicle Condition Satisfactory",t.dvir.status.code="VCS",t.dvir.defectsVehicle="",t.dvir.defectsTrailers="",t.initSignaturePad(),t.databaseSubscription=t.databaseService.databaseReadySubject.subscribe(i=>{i&&(t.bReady=i,t.databaseService.getCompany().subscribe(r=>{t.company=r}),t.databaseService.getDvirs().subscribe(r=>{t.dvirs=r}))}),yield t.locationService.getCurrentLocation().then(i=>{t.dvir.location=i,t.locationLoading=!1,t.locationDisable=!0,console.log(t.dvir.location.description)}).catch(i=>{t.locationLoading=!1,t.locationDisable=!1,t.dvir.location={locationType:"MANUAL",description:"",latitude:0,longitude:0},console.log(i)}),t.vehicleUnit=yield t.storage.get("vehicleUnit"),t.vehicleUnitDisable=!!t.vehicleUnit,t.vehicleId=yield t.storage.get("vehicleId"),t.driverId=yield t.storage.get("driverId"),t.networkSub=t.internetService.internetStatus$.subscribe(i=>{t.networkStatus=i})})()}ngOnDestroy(){this.shareService.destroyMessage()}checkSelectPresent(t){this.switchStatus(""===this.dvir.defectsTrailers&&""===this.dvir.defectsVehicle?"VCS":"D")}switchStatus(t){0!==t.length&&t!==this.lastStatus&&(this.lastStatus=t,this.dvir.status.code=t,this.dvir.status.name=_.bO.find(i=>i.code===t).name)}initSignaturePad(){const t=document.querySelector("canvas");t&&(this.signaturePad=new g.Z(t,this.signaturePadOptions),t.addEventListener("touchend",()=>{this.updateSignatureField()}))}updateSignatureField(){if(this.signaturePad&&!this.signaturePad.isEmpty()){const t=this.signaturePad.toDataURL().slice(22);this.dvir.signatureBase64=t}else this.dvir.signatureBase64=""}restoreSignature(){var t=this;return(0,c.Z)(function*(){const i=t.dvirs.find(r=>""!==r.signatureId&&"00000000-0000-0000-0000-000000000000"!==r.signatureId&&""!==r.signatureLink);i?(t.dvir.signatureBase64="",t.dvir.signatureLink=i.signatureLink,t.dvir.signatureId=i.signatureId,t.signatureFound=!0):(t.signatureFound=!1,t.toastService.showToast("No signature found on other daily logs."))})()}clearSignature(){this.signatureFound&&(this.signatureFound=!1,this.dvir.signatureLink=""),this.signaturePad&&(this.signaturePad.clear(),this.dvir.signatureBase64="")}imageLoaded(){this.imageLoading=!1}onSubmit(){var t=this;return(0,c.Z)(function*(){if(t.shareService.changeMessage("reset"),0===t.dvir.defectsTrailers.length&&(t.validation.trailerName=!0),t.shareService.changeMessage(t.utilityService.generateString(5)),t.utilityService.validateForm(t.validation)){if(0===t.dvir.signatureBase64.length&&0===t.dvir.signatureLink.length)return void t.toastService.showToast("Please sign the form before saving!");t.dvir.vehicle.vehicleUnit=t.vehicleUnit,t.dvir.vehicle.vehicleId=t.vehicleId,t.dvir.driver.driverId=t.driverId,!0===t.networkStatus?(t.loading=!0,t.dashboardService.updateDVIR(t.dvir).toPromise().then(function(){var i=(0,c.Z)(function*(r){r.signatureLink&&(t.dvir.signatureLink=r.signatureLink),yield t.updateDvirs(t.dvir,!0).then(()=>{console.log("DVIRs got updated on the server: ",r),t.loading=!1,t.navCtrl.navigateBack("/unitab/dvir")})});return function(r){return i.apply(this,arguments)}}()).catch(function(){var i=(0,c.Z)(function*(r){yield t.updateDvirs(t.dvir,!1).then(()=>{t.loading=!1,t.navCtrl.navigateBack("/unitab/dvir"),console.warn("Server Error: ",r),console.warn("Pushed dvirs in offline mode")})});return function(r){return i.apply(this,arguments)}}())):yield t.updateDvirs(t.dvir,!1).then(()=>{t.loading=!1,console.warn("Pushed dvirs in offline mode"),t.navCtrl.navigateBack("/unitab/dvir")})}})()}updateDvirs(t,i){var r=this;return(0,c.Z)(function*(){t.sent=i,r.dvirs.unshift(t),yield r.storage.set("dvirs",r.dvirs)})()}ionViewWillLeave(){this.databaseSubscription&&this.databaseSubscription.unsubscribe(),this.networkSub.unsubscribe()}goBack(){this.navCtrl.navigateBack("/unitab/dvir"),this.shareService.destroyMessage()}getHour(t){return(0,a.p6)(t,"LLL d'th', yyyy","en_US")}getTime(t){return(0,a.p6)(t,"hh:mm a","en_US")}}return s.\u0275fac=function(t){return new(t||s)(e.Y36(P.k),e.Y36(y.K),e.Y36(I.s),e.Y36(D.W),e.Y36(f.SH),e.Y36(u.t),e.Y36(v.t),e.Y36(o.k),e.Y36(d.a))},s.\u0275cmp=e.Xpm({type:s,selectors:[["app-insert-dvir"]],decls:44,vars:67,consts:[[3,"title","backButton","backButtonCallback"],[1,"padding-g",2,"padding-top","10px"],[1,"edit-form"],[1,"subtitle-lg"],[1,"edit-dvir-block"],[3,"label","fill","type","disabled","value","noValidation"],[1,"two-inputs"],[3,"label","fill","type","disabled","value","validation","valueChange","validationChange"],[3,"label","value","options","valueChange","changeDetection"],[3,"label","fill","type","value","validation","noValidation","valueChange","validationChange"],[1,"input-block-2"],[3,"half","value","disableOption","selectedValue","valueChange"],[3,"label","fill","type","value","noValidation","valueChange"],[1,"canvas-container"],["height","200",2,"touch-action","none","user-select","none",3,"ngClass"],["sPad",""],["class","image-container",4,"ngIf"],[1,"signature-buttons"],[1,"signature-button",3,"click"],[1,"btn","primary-btn",3,"ngClass","click"],[4,"ngIf"],["name","circular","color","light",4,"ngIf"],[1,"image-container"],[3,"ngClass","src","load"],["name","dots","color","dark",4,"ngIf"],["name","dots","color","dark"],["name","circular","color","light"]],template:function(t,i){1&t&&(e.TgZ(0,"ion-content")(1,"app-header",0),e.NdJ("backButtonCallback",function(){return i.goBack()}),e.qZA(),e.TgZ(2,"form",1)(3,"div",2)(4,"p",3),e._uU(5,"General Info"),e.qZA(),e.TgZ(6,"div",4),e._UZ(7,"app-input",5),e.TgZ(8,"div",6),e._UZ(9,"app-input",5)(10,"app-input",5),e.qZA(),e.TgZ(11,"app-location-input",7),e.NdJ("valueChange",function(l){return i.dvir.location.description=l})("validationChange",function(l){return i.validation.locationDescription=l}),e.qZA()(),e.TgZ(12,"p",3),e._uU(13,"Vehicle Info"),e.qZA(),e.TgZ(14,"div",4),e._UZ(15,"app-input",5)(16,"app-input",5),e.TgZ(17,"app-multiple-select",8),e.NdJ("valueChange",function(l){return i.dvir.defectsVehicle=l})("changeDetection",function(l){return i.checkSelectPresent(l)}),e.qZA()(),e.TgZ(18,"p",3),e._uU(19,"Trailer Info"),e.qZA(),e.TgZ(20,"div",4)(21,"app-input",9),e.NdJ("valueChange",function(l){return i.dvir.trailers=l})("validationChange",function(l){return i.validation.trailerName=l}),e.qZA(),e.TgZ(22,"app-multiple-select",8),e.NdJ("valueChange",function(l){return i.dvir.defectsTrailers=l})("changeDetection",function(l){return i.checkSelectPresent(l)}),e.qZA()(),e.TgZ(23,"p",3),e._uU(24,"Status"),e.qZA(),e.TgZ(25,"div",4)(26,"div",10)(27,"app-status-radio-button",11),e.NdJ("selectedValue",function(l){return i.switchStatus(l)})("valueChange",function(l){return i.dvir.status.code=l}),e.qZA()(),e.TgZ(28,"app-textarea",12),e.NdJ("valueChange",function(l){return i.dvir.comments=l}),e.qZA()(),e.TgZ(29,"p",3),e._uU(30,"Signature"),e.qZA(),e.TgZ(31,"div")(32,"div",13),e._UZ(33,"canvas",14,15),e.YNc(35,J,3,5,"div",16),e.qZA(),e.TgZ(36,"div",17)(37,"div",18),e.NdJ("click",function(){return i.clearSignature()}),e._uU(38,"Clear signature"),e.qZA(),e.TgZ(39,"div",18),e.NdJ("click",function(){return i.restoreSignature()}),e._uU(40,"Restore signature"),e.qZA()()(),e.TgZ(41,"button",19),e.NdJ("click",function(){return i.onSubmit()}),e.YNc(42,A,2,0,"span",20),e.YNc(43,E,1,0,"ion-spinner",21),e.qZA()()()()),2&t&&(e.xp6(1),e.Q6J("title","Insert Dvir")("backButton",!0),e.xp6(6),e.Q6J("label","Company")("fill",!0)("type","text")("disabled",!0)("value",null==i.company?null:i.company.name)("noValidation",!0),e.xp6(2),e.Q6J("label","Time")("fill",!0)("type","text")("disabled",!0)("value",i.getHour(i.dvir.createDate))("noValidation",!0),e.xp6(1),e.Q6J("label","none")("fill",!0)("type","text")("disabled",!0)("value",i.getTime(i.dvir.createDate))("noValidation",!0),e.xp6(1),e.Q6J("label","Location")("fill",!0)("type","text")("disabled",i.locationDisable)("value",i.dvir.location.description)("validation",i.validation.locationDescription),e.xp6(4),e.Q6J("label","Vehicle Name")("fill",!0)("type","text")("disabled",i.vehicleUnitDisable)("value",i.vehicleUnit)("noValidation",!0),e.xp6(1),e.Q6J("label","Odometer")("fill",!0)("type","text")("disabled",!0)("value",i.dvir.odometer.toString())("noValidation",!0),e.xp6(1),e.Q6J("label","Vehicle Defects (Optional)")("value",i.dvir.defectsVehicle)("options",i.defectsVehicle),e.xp6(4),e.Q6J("label","Trailer Name")("fill",!0)("type","text")("value",i.dvir.trailers)("validation",i.validation.trailerName)("noValidation",!i.dvir.defectsTrailers.length),e.xp6(1),e.Q6J("label","Trailer Defects (Optional)")("value",i.dvir.defectsTrailers)("options",i.defectsTrailers),e.xp6(5),e.Q6J("half",!0)("value",i.dvir.status.code)("disableOption",!0),e.xp6(1),e.Q6J("label","Comments")("fill",!0)("type","text")("value",i.dvir.comments)("noValidation",!0),e.xp6(5),e.Q6J("ngClass",e.VKq(63,S,i.signatureFound)),e.xp6(2),e.Q6J("ngIf",i.signatureFound),e.xp6(6),e.Q6J("ngClass",e.VKq(65,B,i.loading)),e.xp6(1),e.Q6J("ngIf",!i.loading),e.xp6(1),e.Q6J("ngIf",i.loading))},dependencies:[a.mk,a.O5,h._Y,h.JL,h.F,f.W2,f.PQ,T.G,C.D,O.a,Z.R,L.M,x.L],styles:[".input-block-2[_ngcontent-%COMP%]   textarea.input-2[_ngcontent-%COMP%]{height:89px;resize:none}.text-success[_ngcontent-%COMP%]{flex-grow:1;color:var(--success-500);font-size:16px;font-weight:500}.text-error[_ngcontent-%COMP%]{flex-grow:1;color:var(--error-500);font-size:16px;font-weight:600}.btn[_ngcontent-%COMP%]{width:100%;height:50px;border-radius:30px;margin-top:5px}.two-inputs[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;gap:10px}.signature-container[_ngcontent-%COMP%]{width:100%;background-color:var(--gray-100);border-radius:10px;padding:15px;display:flex;justify-content:center;align-items:center}.signature-container[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%]{width:100%;border-radius:10px}.signature-buttons[_ngcontent-%COMP%]{display:flex;gap:30px;margin-top:10px}.signature-button[_ngcontent-%COMP%]{font-size:15px;font-weight:500;color:var(--gray-500)}.canvas-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:100%;height:230px;max-width:500px;background-color:var(--gray-100);border-radius:10px;padding:15px}.canvas-container[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%]{width:100%;height:100%;border-radius:10px}.image-container[_ngcontent-%COMP%]{width:100%;background-color:#fff;border-radius:10px;display:flex;justify-content:center;align-items:center}.image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:10px}.no-display[_ngcontent-%COMP%]{display:none;width:0;height:0;border:none}"]}),s})()}];let k=(()=>{class s{}return s.\u0275fac=function(t){return new(t||s)},s.\u0275mod=e.oAB({type:s}),s.\u0275inj=e.cJS({imports:[m.Bz.forChild(V),m.Bz]}),s})();var N=n(4546),Q=n(7484),F=n(4166),R=n(8546),Y=n(4877),K=n(6330),W=n(8134);let w=(()=>{class s{}return s.\u0275fac=function(t){return new(t||s)},s.\u0275mod=e.oAB({type:s}),s.\u0275inj=e.cJS({imports:[a.ez,h.u5,h.UX,f.Pc,k,N.y,Q.T,F.v,R.w,Y.r,K._,W.y]}),s})()}}]);