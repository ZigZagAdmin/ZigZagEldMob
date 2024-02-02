"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5058,3646,8871,4576,4546],{3646:(C,v,i)=>{i.d(v,{G:()=>p});var o=i(8256),h=i(6895);function s(l,u){if(1&l){const e=o.EpF();o.TgZ(0,"img",6),o.NdJ("click",function(){o.CHM(e);const _=o.oxw();return o.KtG(_.goBack())}),o.qZA()}}const d=["*"];let p=(()=>{class l{constructor(){this.backButton=!1,this.backButtonCallback=new o.vpe}ngOnInit(){}goBack(){this.backButtonCallback.emit()}}return l.\u0275fac=function(e){return new(e||l)},l.\u0275cmp=o.Xpm({type:l,selectors:[["app-header"]],inputs:{title:"title",subtitle:"subtitle",backButton:"backButton"},outputs:{backButtonCallback:"backButtonCallback"},ngContentSelectors:d,decls:9,vars:3,consts:[[1,"title-container","padding-g"],[2,"display","flex","justify-content","space-between","align-items","center"],[1,"title-back"],["src","../../../assets/imgs/back-arrow.png",3,"click",4,"ngIf"],[1,"page-title"],[1,"subtitle","custom-subtitle"],["src","../../../assets/imgs/back-arrow.png",3,"click"]],template:function(e,f){1&e&&(o.F$t(),o.TgZ(0,"div",0)(1,"div",1)(2,"div",2),o.YNc(3,s,1,0,"img",3),o.TgZ(4,"div",4),o._uU(5),o.qZA()(),o.Hsn(6),o.qZA(),o.TgZ(7,"div",5),o._uU(8),o.qZA()()),2&e&&(o.xp6(3),o.Q6J("ngIf",f.backButton),o.xp6(2),o.Oqu(f.title),o.xp6(3),o.hij(" ",f.subtitle," "))},dependencies:[h.O5],styles:[".title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.title-back[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px}.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;height:20px}.custom-subtitle[_ngcontent-%COMP%]{margin-left:35px}.title-container[_ngcontent-%COMP%]{padding-bottom:0}"]}),l})()},4546:(C,v,i)=>{i.d(v,{y:()=>p});var o=i(6895),h=i(4006),s=i(7151),d=i(8256);let p=(()=>{class l{}return l.\u0275fac=function(e){return new(e||l)},l.\u0275mod=d.oAB({type:l}),l.\u0275inj=d.cJS({imports:[o.ez,h.u5,s.Pc]}),l})()},8546:(C,v,i)=>{i.d(v,{w:()=>p});var o=i(6895),h=i(4006),s=i(7151),d=i(8256);let p=(()=>{class l{}return l.\u0275fac=function(e){return new(e||l)},l.\u0275mod=d.oAB({type:l}),l.\u0275inj=d.cJS({imports:[o.ez,h.u5,s.Pc]}),l})()},5058:(C,v,i)=>{i.r(v),i.d(v,{CoDriverPageModule:()=>H});var o=i(6895),h=i(4006),s=i(7151),d=i(5050),p=i(5861),l=i(3905),u=i(4128),e=i(8256),f=i(4465),_=i(849),P=i(4382),D=i(9386),M=i(3646);const O=function(n,c,t){return{"label-error":n,"input-label-top":c,"input-label-left":t}};function k(n,c){if(1&n&&(e.TgZ(0,"div",6),e._uU(1),e.qZA()),2&n){const t=e.oxw();e.Q6J("ngClass",e.kEZ(3,O,!t.valid,"top"===t.labelPosition,"left"===t.labelPosition)),e.xp6(1),e.AsE(" ",t.label,"",t.required?"*":""," ")}}function y(n,c){if(1&n){const t=e.EpF();e.TgZ(0,"div",12),e.NdJ("click",function(){const r=e.CHM(t),g=r.$implicit,m=r.index,b=e.oxw(2);return e.KtG(b.triggerCheck(g,m))}),e.TgZ(1,"div",13),e._uU(2),e.qZA(),e.TgZ(3,"div",14),e._UZ(4,"ion-checkbox",15),e.qZA()()}if(2&n){const t=c.$implicit;e.xp6(2),e.Oqu(t.value),e.xp6(2),e.Q6J("checked",t.checked)}}function T(n,c){if(1&n){const t=e.EpF();e.TgZ(0,"div",7),e.YNc(1,y,5,2,"div",8),e.qZA(),e.TgZ(2,"div",9)(3,"div",10),e.NdJ("click",function(){e.CHM(t);const r=e.oxw();return e.KtG(r.closeModal())}),e._uU(4,"Cancel"),e.qZA(),e.TgZ(5,"div",11),e.NdJ("click",function(){e.CHM(t);const r=e.oxw();return e.KtG(r.submit())}),e._uU(6,"Submit"),e.qZA()()}if(2&n){const t=e.oxw();e.xp6(1),e.Q6J("ngForOf",t.optionsCheck)}}const E=function(n,c){return{"custom-input-top":n,"custom-input-left":c}},Z=function(n,c,t){return{"input-fill":n,"validation-error":c,"input-left":t}};let A=(()=>{class n{constructor(){this.fill=!0,this.validators=[],this.noValidation=!1,this.required=!1,this.labelPosition="top",this.changeDetection=new e.vpe,this.valueChange=new e.vpe,this.validationChange=new e.vpe,this.valid=!0,this.isModalOpen=!1,this.optionsCheck=[],this.lastStatus=[]}get value(){return this._value}set value(t){this._value!==t&&(this._value=t,this.valueChange.emit(t),this.changeDetection.emit(t))}get validation(){return this._validation}set validation(t){this._validation!==t&&(this._validation=t,this.validationChange.emit(t))}ngOnInit(){if(this.optionsCheck=this.options.map(t=>({value:t,checked:!1})),this._value&&0!==this._value.length){const t=this._value.split(", ");this.optionsCheck.forEach(a=>t.forEach(r=>a.value===r?a.checked=!0:null))}this.lastStatus=this.cloneArray(this.optionsCheck)}triggerCheck(t,a){this.optionsCheck.forEach(g=>g.checked=!1);const r=this.optionsCheck.find(g=>g.value===t.value);r.checked=!r.checked}openModal(){this.isModalOpen=!0}closeModal(){this.isModalOpen=!1,this.optionsCheck=this.cloneArray(this.lastStatus)}submit(){let t=[];this.optionsCheck.forEach(a=>!0===a.checked?t.push(a.value):null),this.value=t.join(", "),this.lastStatus=this.cloneArray(this.optionsCheck),this.isModalOpen=!1}cloneArray(t){return JSON.parse(JSON.stringify(t))}}return n.\u0275fac=function(t){return new(t||n)},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-select"]],inputs:{label:"label",fill:"fill",validators:"validators",noValidation:"noValidation",required:"required",labelPosition:"labelPosition",options:"options",value:"value",validation:"validation"},outputs:{changeDetection:"changeDetection",valueChange:"valueChange",validationChange:"validationChange"},decls:8,vars:12,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-box",3,"ngClass","click"],[1,"input-box-value"],["src","assets/icon/bottom-arrow-18.svg"],["id","custom-modal",3,"isOpen"],[1,"input-label",3,"ngClass"],["id","optionBox",1,"option-box"],["class","select-option",3,"click",4,"ngFor","ngForOf"],[1,"submit-buttons"],[1,"action-button","default",3,"click"],[1,"action-button","primary",3,"click"],[1,"select-option",3,"click"],[1,"select-value"],[1,"select-icon"],[3,"checked"]],template:function(t,a){1&t&&(e.TgZ(0,"div",0),e.YNc(1,k,2,7,"div",1),e.TgZ(2,"div",2),e.NdJ("click",function(){return a.openModal()}),e.TgZ(3,"div",3),e._uU(4),e.qZA(),e._UZ(5,"img",4),e.qZA(),e.TgZ(6,"ion-modal",5),e.YNc(7,T,7,1,"ng-template"),e.qZA()()),2&t&&(e.Q6J("ngClass",e.WLB(5,E,"top"===a.labelPosition,"left"===a.labelPosition)),e.xp6(1),e.Q6J("ngIf",a.label),e.xp6(1),e.Q6J("ngClass",e.kEZ(8,Z,a.fill,!a.valid,"left"===a.labelPosition)),e.xp6(2),e.Oqu(a.value||"No option selected"),e.xp6(2),e.Q6J("isOpen",a.isModalOpen))},dependencies:[o.mk,o.sg,o.O5,s.nz,s.ki,s.w],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:500}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:15px;width:100%;height:45px;border-radius:10px;padding:10px 15px;font-size:14px;font-weight:400;color:var(--gray-500);border:1px solid var(--gray-200);background-position:right 15px center}.input-box[_ngcontent-%COMP%]   .input-box-value[_ngcontent-%COMP%]{flex:1 calc(92% - 15px);box-sizing:border-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.input-box[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{flex:1 8%;width:18px;height:18px}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}ion-modal#custom-modal[_ngcontent-%COMP%]{--width: fit-content;--min-width: 80%;--max-height: 70%;--overflow: hidden;--height: fit-content;--border-radius: 10px;--box-shadow: 0 28px 48px rgba(0, 0, 0, .4)}.option-box[_ngcontent-%COMP%]{display:flex;flex-direction:column;width:100%;padding:10px 0;overflow:auto;max-height:500px}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]{width:100%;display:flex;justify-content:space-between;align-items:center;padding:12px 20px;transition:all .2s}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]:active{background-color:var(--gray-100)}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]   .select-icon[_ngcontent-%COMP%]{display:flex;align-items:center}ion-checkbox[_ngcontent-%COMP%]{--size: 20px;--checkbox-background-checked: var(--success-500);--border-color: var(--gray-200);--checkbox-background: var(--gray-100);--border-color-checked: transparent;--checkmark-width: 2px;pointer-events:none}ion-checkbox[_ngcontent-%COMP%]::part(container){border-radius:50%}.submit-buttons[_ngcontent-%COMP%]{display:flex;align-items:center;gap:5px;width:100%;padding:10px 20px;border-top:1px solid var(--gray-100)}.submit-buttons[_ngcontent-%COMP%]   .action-button[_ngcontent-%COMP%]{flex:1;font-size:15px;display:flex;justify-content:center;align-items:center;padding:10px;border-radius:50px;cursor:pointer}.default[_ngcontent-%COMP%]{color:var(--gray-500);background-color:var(--gray-100)}.primary[_ngcontent-%COMP%]{color:var(--gray-25);background-color:var(--primary-600)}@media screen and (max-height: 799px){.option-box[_ngcontent-%COMP%]{max-height:400px}}@media screen and (max-height: 659px){.option-box[_ngcontent-%COMP%]{max-height:350px}}"]}),n})();function B(n,c){1&n&&(e.TgZ(0,"span"),e._uU(1,"Save"),e.qZA())}function S(n,c){1&n&&e._UZ(0,"ion-spinner",9)}const I=function(n){return{"disable-click":n}};function w(n,c){if(1&n){const t=e.EpF();e.TgZ(0,"div",4)(1,"app-select",5),e.NdJ("changeDetection",function(){e.CHM(t);const r=e.oxw();return e.KtG(r.showSelection())})("valueChange",function(r){e.CHM(t);const g=e.oxw();return e.KtG(g.chosenDriver=r)}),e.qZA(),e.TgZ(2,"button",6),e.NdJ("click",function(){e.CHM(t);const r=e.oxw();return e.KtG(r.save())}),e.YNc(3,B,2,0,"span",7),e.YNc(4,S,1,0,"ion-spinner",8),e.qZA()()}if(2&n){const t=e.oxw();e.xp6(1),e.Q6J("label","Select Co-Driver")("value",t.chosenDriver)("options",t.coDriverNames),e.xp6(1),e.Q6J("ngClass",e.VKq(6,I,t.loading)),e.xp6(1),e.Q6J("ngIf",!t.loading),e.xp6(1),e.Q6J("ngIf",t.loading)}}function N(n,c){1&n&&(e.TgZ(0,"div",10),e._UZ(1,"ion-spinner",11),e.TgZ(2,"div"),e._uU(3,"LOADING"),e.qZA()())}const J=[{path:"",component:(()=>{class n{constructor(t,a,r,g,m){this.navCtrl=t,this.toastService=a,this.storage=r,this.databaseService=g,this.dashboardService=m,this.chosenDriver="None",this.coDrivers=[],this.coDriverNames=[],this.loading=!1,this.logDailies=[],this.pageLoading=!1}ngOnInit(){var t=this;return(0,p.Z)(function*(){t.pageLoading=!0;let a=t.storage.get("driverId"),r=t.storage.get("coDriver"),g=t.storage.get("coDrivers"),m=(0,l.z)(t.databaseService.getLogDailies());(0,u.D)([a,r,g,m]).subscribe(([b,z,F,Q])=>{t.coDriver=z,F.forEach(x=>x.driverId!==b?t.coDrivers.push(x):null),t.coDrivers.forEach(x=>t.coDriverNames.push(x.name)),t.coDriverNames.unshift("None"),t.logDailies=Q,t.chosenDriver=0===Object.keys(t.coDriver).length||"00000000-0000-0000-0000-000000000000"===t.coDriver.driverId?"None":t.coDriver.firstName+" "+t.coDriver.lastName,t.pageLoading=!1})})()}save(){var t=this;return(0,p.Z)(function*(){t.loading=!0,t.logDailies[0].form.coDriver=t.coDriver,yield t.storage.set("coDriver",t.coDriver),yield t.dashboardService.updateLogDaily(t.logDailies[0]).toPromise().then(function(){var a=(0,p.Z)(function*(r){console.log("LogDaily (durationStatuses) is updated on server:",r),yield t.storage.set("logDailies",t.logDailies),t.goBack(),t.loading=!1,0!==t.chosenDriver.length&&"None"!==t.chosenDriver&&t.toastService.showToast(t.chosenDriver+" is now your co-driver","medium"),0!==t.chosenDriver.length&&"None"===t.chosenDriver&&t.toastService.showToast("You have no co-driver now","medium")});return function(r){return a.apply(this,arguments)}}()).catch(function(){var a=(0,p.Z)(function*(r){yield t.storage.set("logDailies",t.logDailies),console.log("Pushed in offline logDailies"),t.goBack(),t.loading=!1});return function(r){return a.apply(this,arguments)}}())})()}showSelection(){this.coDriver="None"===this.chosenDriver?{driverId:"00000000-0000-0000-0000-000000000000",driverIdentifier:null,driverInfo:null,email:null,firstName:null,lastName:null}:this.coDrivers.find(t=>t.name===this.chosenDriver)||{driverId:"00000000-0000-0000-0000-000000000000",driverIdentifier:null,driverInfo:null,email:null,firstName:null,lastName:null}}goBack(){this.navCtrl.navigateBack("unitab/others")}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(s.SH),e.Y36(f.k),e.Y36(_.K),e.Y36(P.k),e.Y36(D.s))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-co-driver"]],decls:4,vars:6,consts:[[3,"fullscreen","forceOverscroll"],[3,"title","backButton","backButtonCallback"],["class","padding-g","style","display: flex; flex-direction: column; gap: 20px",4,"ngIf"],["class","spinner-container",4,"ngIf"],[1,"padding-g",2,"display","flex","flex-direction","column","gap","20px"],[3,"label","value","options","changeDetection","valueChange"],[1,"btn","primary-btn",3,"ngClass","click"],[4,"ngIf"],["name","circular","color","light",4,"ngIf"],["name","circular","color","light"],[1,"spinner-container"],["color","dark"]],template:function(t,a){1&t&&(e.TgZ(0,"ion-content",0)(1,"app-header",1),e.NdJ("backButtonCallback",function(){return a.goBack()}),e.qZA(),e.YNc(2,w,5,8,"div",2),e.YNc(3,N,4,0,"div",3),e.qZA()),2&t&&(e.Q6J("fullscreen",!0)("forceOverscroll",!1),e.xp6(1),e.Q6J("title","Co-Driver")("backButton",!0),e.xp6(1),e.Q6J("ngIf",!a.pageLoading),e.xp6(1),e.Q6J("ngIf",a.pageLoading))},dependencies:[o.mk,o.O5,s.W2,s.PQ,M.G,A],styles:[".btn[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;margin-top:10px;width:100%;height:50px;border-radius:30px}.btn[_ngcontent-%COMP%]   ion-spinner[_ngcontent-%COMP%]{zoom:.8}.spinner-container[_ngcontent-%COMP%]{width:100%;height:calc(100% - 114px);display:flex;justify-content:center;align-items:center;flex-direction:column;font-size:14px;gap:5px}.spinner-container[_ngcontent-%COMP%]   ion-spinner[_ngcontent-%COMP%]{width:30px;height:30px}"]}),n})()}];let U=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[d.Bz.forChild(J),d.Bz]}),n})();var K=i(4546),L=i(8546);let H=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[o.ez,h.u5,s.Pc,U,K.y,L.w]}),n})()},3905:(C,v,i)=>{i.d(v,{z:()=>s});var o=i(6805),h=i(930);function s(d,p){const l="object"==typeof p;return new Promise((u,e)=>{const f=new h.Hp({next:_=>{u(_),f.unsubscribe()},error:e,complete:()=>{l?u(p.defaultValue):e(new o.K)}});d.subscribe(f)})}}}]);