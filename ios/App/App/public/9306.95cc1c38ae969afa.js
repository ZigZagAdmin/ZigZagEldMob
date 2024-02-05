"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[9306],{9306:(x,v,o)=>{o.r(v),o.d(v,{LogCertifyPageModule:()=>U});var d=o(6895),y=o(4006),u=o(7151),f=o(5050),g=o(5861),h=o(3905),m=o(4128),p=o(4171),t=o(8256),C=o(4382),L=o(4465),I=o(9386),E=o(849),k=o(7278),S=o(3646);const D=["sPad"];function Z(n,s){1&n&&t._UZ(0,"ion-spinner",22)}const P=function(n){return{"no-display":n}};function M(n,s){if(1&n){const e=t.EpF();t.TgZ(0,"div",18),t._UZ(1,"img",19),t.TgZ(2,"img",20),t.NdJ("load",function(){t.CHM(e);const a=t.oxw();return t.KtG(a.imageLoaded())}),t.qZA(),t.YNc(3,Z,1,0,"ion-spinner",21),t.qZA()}if(2&n){const e=t.oxw();t.xp6(1),t.Q6J("src",e.signatureLink,t.LSH),t.xp6(1),t.Q6J("ngClass",t.VKq(4,P,e.imageLoading))("src",e.logDaily.form.signatureLink,t.LSH),t.xp6(1),t.Q6J("ngIf",e.imageLoading)}}function T(n,s){1&n&&(t.TgZ(0,"span"),t._uU(1,"Save"),t.qZA())}function _(n,s){1&n&&t._UZ(0,"ion-spinner",23)}const O=function(n){return{"disable-click":n}},A=function(n,s){return{"btn-disabled":n,"disable-click":s}},B=[{path:"",component:(()=>{class n{constructor(e,i,a,r,l,c,b){this.navCtrl=e,this.route=i,this.databaseService=a,this.toastService=r,this.dashboardService=l,this.storage=c,this.utilityService=b,this.loading=!1,this.logDate="",this.logId="",this.logDailies=[],this.logEvents=[],this.timeZones={},this.timeZone="",this.signature="",this.signatureFound=!1,this.foundSignatureId="",this.imageLoading=!1,this.signatureLink="",this.isConfirmButtonActive=!1,this.signaturePadOptions={minWidth:2,maxWidth:3,backgroundColor:"#FFFFFF",penColor:"black"}}ngOnInit(){this.timeZones=this.utilityService.checkSeason();let e=this.storage.get("timeZone"),i=(0,h.z)(this.route.queryParams),a=(0,h.z)(this.databaseService.getLogDailies()),r=(0,h.z)(this.databaseService.getLogEvents()),l=this.storage.get("vehicleId");(0,m.D)([i,e,a,r,l]).subscribe(([c,b,N,Q,w])=>{this.logDate=c.date,this.logId=c.logId,this.timeZone=b,this.vehicleId=w,this.logDailies=N,this.logDaily=this.logDailies.find(z=>z.logDailyId===this.logId),this.logEvents=Q})}ngAfterViewInit(){this.initSignaturePad()}ngOnDestroy(){}goBack(){this.navCtrl.navigateBack(["log-item",this.logId])}initSignaturePad(){const e=this.signaturePad.nativeElement;e&&(this.signaturePadEl=new p.Z(e,this.signaturePadOptions),e.addEventListener("touchend",()=>{this.updateSignatureField()}))}restoreSignature(){var e=this;return(0,g.Z)(function*(){const i=e.logDailies.find(a=>""!==a.form.signatureId&&"00000000-0000-0000-0000-000000000000"!==a.form.signatureId);i?(e.signature="",e.signatureLink=i.form.signatureLink,e.foundSignatureId=i.form.signatureId,e.signatureFound=!0,e.activateSave()):(e.signatureFound=!1,e.toastService.showToast("No signature found on other daily logs."))})()}updateSignatureField(){if(this.signaturePad&&!this.signaturePadEl.isEmpty()){const e=this.signaturePadEl.toDataURL().slice(22);this.signature=e}else this.signature="";this.activateSave()}clearSignature(){this.signatureFound&&(this.signatureFound=!1),this.signaturePad&&(this.signaturePadEl.clear(),this.signature=""),this.isConfirmButtonActive=!1}save(){var e,i=this;this.loading=!0,this.signatureFound?(this.logDaily.form.signatureId=this.foundSignatureId,this.logDaily.certified=!0):(this.logDaily.form.signatureId=this.utilityService.uuidv4(),this.logDaily.form.signature=this.signature,this.logDaily.certified=!0);const a=this.logEvents[this.logEvents.length-1];let r={logEventId:this.utilityService.uuidv4(),companyId:"",driverId:this.logDaily.driverId,eventTime:{logDate:(0,d.p6)(new Date,"yyyy-MM-ddTHH:mm:ss","en_US",this.timeZones[this.timeZone]),timeStamp:(new Date).getTime(),timeStampEnd:(new Date).getTime(),timeZone:""},vehicle:{vehicleId:this.vehicleId},eld:{eldId:"00000000-0000-0000-0000-000000000000",macAddress:"",serialNumber:""},location:{locationType:"AUTOMATIC",description:"2mi from Chisinau, Chisinau",latitude:0,longitude:0},sequenceNumber:a?a.sequenceNumber+1:1,type:{name:"Certification (1)",code:"CERTIFICATION_1"},recordStatus:{name:"Driver",code:"DRIVER"},recordOrigin:{name:"Active",code:"ACTIVE"},odometer:0,engineHours:0,malfunction:!1,dataDiagnosticEvent:!1,certificationDate:null===(e=this.logDaily)||void 0===e?void 0:e.logDate,comment:"",eventDataCheck:"",inspection:!1};this.updateLogEvents(r,!1),this.dashboardService.updateLogEvent(r).subscribe(l=>{this.updateIndexLogEvents(r,!0),console.log("Certification LogEvent is on server:",l)},function(){var l=(0,g.Z)(function*(c){console.log("Cerification LogEvent Pushed in offline logEvents array")});return function(c){return l.apply(this,arguments)}}()),this.dashboardService.updateLogDaily(this.logDaily).subscribe(l=>{this.toastService.showToast("Successfully signed the log certification.","success"),this.loading=!1,this.updateLocalStorage(),this.goBack()},function(){var l=(0,g.Z)(function*(c){i.loading=!1,i.toastService.showToast("Could not update the signture. Uploading offline only."),i.updateLocalStorage(),i.goBack()});return function(c){return l.apply(this,arguments)}}())}updateLogEvents(e,i){var a=this;return(0,g.Z)(function*(){e.sent=i,a.logEvents.push(e),yield a.storage.set("logEvents",a.logEvents)})()}updateIndexLogEvents(e,i){var a=this;return(0,g.Z)(function*(){e.sent=i;const r=a.logEvents.findIndex(l=>l.logEventId===e.logEventId);-1!==r&&(a.logEvents[r]=e),yield a.storage.set("logEvents",a.logEvents)})()}activateSave(){this.isConfirmButtonActive=!!(this.signature&&0!==this.signature.length||this.signatureLink&&0!==this.signatureLink.length)}imageLoaded(){this.imageLoading=!1}updateLocalStorage(){var e=this;return(0,g.Z)(function*(){let i=yield e.storage.get("logDailies"),a=i.findIndex(r=>r.logDailyId===e.logDaily.logDailyId);i.splice(a,1,e.logDaily),yield e.storage.set("logDailies",i),console.log("log-certify: logDailies updated in the storage")})()}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(u.SH),t.Y36(f.gz),t.Y36(C.k),t.Y36(L.k),t.Y36(I.s),t.Y36(E.K),t.Y36(k.t))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-log-certify"]],viewQuery:function(e,i){if(1&e&&t.Gf(D,5),2&e){let a;t.iGM(a=t.CRH())&&(i.signaturePad=a.first)}},decls:26,vars:22,consts:[[3,"fullscreen","forceOverscroll"],[3,"title","backButton","backButtonCallback"],[1,"date-label"],[1,"main-container","padding-g"],[1,"canvas-container"],["height","290",2,"touch-action","none","user-select","none",3,"ngClass"],["sPad",""],["class","image-container",4,"ngIf"],[1,"signature-buttons"],[1,"signature-button",3,"click"],[2,"display","flex","flex-direction","column","gap","20px"],[1,"confirm-checkbox"],[1,"checkbox-text"],[1,"confirm-buttons"],[1,"custom-btn","secondary-btn",3,"ngClass","click"],[1,"custom-btn","primary-btn",3,"ngClass","disabled","click"],[4,"ngIf"],["name","circular","color","light","class","spinner",4,"ngIf"],[1,"image-container"],[3,"src"],[3,"ngClass","src","load"],["name","dots","color","dark",4,"ngIf"],["name","dots","color","dark"],["name","circular","color","light",1,"spinner"]],template:function(e,i){1&e&&(t.TgZ(0,"ion-content",0)(1,"app-header",1),t.NdJ("backButtonCallback",function(){return i.goBack()}),t.TgZ(2,"div",2),t._uU(3),t.ALo(4,"date"),t.qZA()(),t.TgZ(5,"div",3)(6,"div")(7,"div",4),t._UZ(8,"canvas",5,6),t.YNc(10,M,4,6,"div",7),t.qZA(),t.TgZ(11,"div",8)(12,"div",9),t.NdJ("click",function(){return i.clearSignature()}),t._uU(13,"Clear signature"),t.qZA(),t.TgZ(14,"div",9),t.NdJ("click",function(){return i.restoreSignature()}),t._uU(15,"Restore signature"),t.qZA()()(),t.TgZ(16,"div",10)(17,"div",11)(18,"div",12),t._uU(19,"I hereby certify that my data entries and my record of duty status for this 24-hour period are true and correct."),t.qZA()(),t.TgZ(20,"div",13)(21,"button",14),t.NdJ("click",function(){return i.goBack()}),t._uU(22,"Back"),t.qZA(),t.TgZ(23,"button",15),t.NdJ("click",function(){return i.save()}),t.YNc(24,T,2,0,"span",16),t.YNc(25,_,1,0,"ion-spinner",17),t.qZA()()()()()),2&e&&(t.Q6J("fullscreen",!0)("forceOverscroll",!1),t.xp6(1),t.Q6J("title","Certify")("backButton",!0),t.xp6(2),t.Oqu(t.xi3(4,12,i.logDate,"EEEE, MMM d")),t.xp6(5),t.Q6J("ngClass",t.VKq(15,P,i.signatureFound)),t.xp6(2),t.Q6J("ngIf",i.signatureFound),t.xp6(11),t.Q6J("ngClass",t.VKq(17,O,i.loading)),t.xp6(2),t.Q6J("ngClass",t.WLB(19,A,!i.isConfirmButtonActive,i.loading))("disabled",!i.isConfirmButtonActive),t.xp6(1),t.Q6J("ngIf",!i.loading),t.xp6(1),t.Q6J("ngIf",i.loading))},dependencies:[d.mk,d.O5,u.W2,u.PQ,S.G,d.uU],styles:[".main-container[_ngcontent-%COMP%]{width:100%;height:calc(100% - 47px);display:flex;flex-direction:column;justify-content:space-between}.date-label[_ngcontent-%COMP%]{color:var(--gray-700);font-size:18px;font-weight:600}.canvas-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:100%;height:320px;max-width:500px;background-color:var(--gray-100);border-radius:10px;padding:15px}.canvas-container[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%]{width:100%;height:100%;border-radius:10px}.signature-buttons[_ngcontent-%COMP%]{display:flex;gap:30px;margin-top:10px}.signature-button[_ngcontent-%COMP%]{font-size:15px;font-weight:500;color:var(--gray-500)}.confirm-buttons[_ngcontent-%COMP%]{display:flex;gap:15px}.custom-btn[_ngcontent-%COMP%]{flex:1;display:flex;justify-content:center;align-items:center;padding:15px;border-radius:30px;font-size:16px;font-weight:600;max-height:49px}.confirm-checkbox[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:15px}.checkbox-text[_ngcontent-%COMP%]{font-size:14px;color:var(--gray-700);font-weight:500}ion-checkbox[_ngcontent-%COMP%]{--size: 20px;--checkbox-background-checked: var(--success-500);--border-color: var(--gray-200);--border-color-checked: transparent;--checkmark-width: 2px}ion-checkbox[_ngcontent-%COMP%]::part(container){border-radius:50%}.btn-disabled[_ngcontent-%COMP%]{background-color:var(--gray-500)!important}.spinner[_ngcontent-%COMP%]{transform:scale(.9)}.image-container[_ngcontent-%COMP%]{width:100%;background-color:#fff;border-radius:10px;display:flex;justify-content:center;align-items:center}.image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:10px}.no-display[_ngcontent-%COMP%]{display:none;width:0;height:0;border:none}"]}),n})()}];let F=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[f.Bz.forChild(B),f.Bz]}),n})();var J=o(4546);let U=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[d.ez,y.u5,u.Pc,F,J.y]}),n})()},3905:(x,v,o)=>{o.d(v,{z:()=>u});var d=o(6805),y=o(930);function u(f,g){const h="object"==typeof g;return new Promise((m,p)=>{const t=new y.Hp({next:C=>{m(C),t.unsubscribe()},error:p,complete:()=>{h?m(g.defaultValue):p(new d.K)}});f.subscribe(t)})}}}]);