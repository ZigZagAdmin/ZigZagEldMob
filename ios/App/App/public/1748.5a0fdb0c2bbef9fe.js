"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[1748,4546],{7772:(g,v,e)=>{e.d(v,{U:()=>a});var t=e(8256),u=e(6895),_=e(6114);const s=function(o){return{"background-color":o}};function l(o,p){if(1&o){const r=t.EpF();t.TgZ(0,"div",2),t.NdJ("click",function(){const d=t.CHM(r).$implicit,i=t.oxw();return t.KtG(i.select(d))}),t.TgZ(1,"div",3),t._UZ(2,"div",4),t.TgZ(3,"div",5),t._uU(4),t.qZA()(),t.TgZ(5,"div",6),t._UZ(6,"ion-checkbox",7),t.qZA()()}if(2&o){const r=p.$implicit;t.xp6(2),t.Q6J("ngStyle",t.VKq(3,s,r.color)),t.xp6(2),t.Oqu(r.label),t.xp6(2),t.Q6J("checked",r.checked)}}let a=(()=>{class o{constructor(){this.data=[{color:"var(--gray-300)",label:"Off Duty",value:"OFF",checked:!1},{color:"var(--primary-800)",label:"Sleeper Berth",value:"SB",checked:!1},{color:"var(--success-500)",label:"On Duty",value:"ON",checked:!1},{color:"var(--warning-500)",label:"Driving",value:"D",checked:!1},{color:"#AF5FFE",label:"Personal Conveyance",value:"PC",checked:!1},{color:"var(--error-500)",label:"Yard Moves",value:"YM",checked:!1}],this.selectedValue=new t.vpe}ngOnInit(){}select(r){let c=this.data.findIndex(n=>n.value===r.value);this.data.forEach(n=>n.checked=!1),this.data[c].checked=!0,this.selectedValue.emit(this.data[c].value)}}return o.\u0275fac=function(r){return new(r||o)},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-duty-radio-button"]],outputs:{selectedValue:"selectedValue"},decls:2,vars:1,consts:[[1,"list-container"],["class","list-item",3,"click",4,"ngFor","ngForOf"],[1,"list-item",3,"click"],[1,"item-data"],[1,"status-color",3,"ngStyle"],[1,"status-label"],[1,"item-checkbox"],[3,"checked"]],template:function(r,c){1&r&&(t.TgZ(0,"div",0),t.YNc(1,l,7,5,"div",1),t.qZA()),2&r&&(t.xp6(1),t.Q6J("ngForOf",c.data))},dependencies:[u.sg,u.PC,_.nz,_.w],styles:[".list-container[_ngcontent-%COMP%]{width:100%;display:flex;flex-direction:column;gap:15px}.list-item[_ngcontent-%COMP%]{width:100%;border:none;border-radius:10px;background-color:var(--gray-100);padding:15px;display:flex;align-items:center;justify-content:space-between}.item-data[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px}.status-color[_ngcontent-%COMP%]{width:15px;height:15px;border-radius:50%}.status-label[_ngcontent-%COMP%]{font-size:16px;font-weight:500;color:var(--gray-500)}.item-checkbox[_ngcontent-%COMP%]{display:flex;align-items:center}ion-checkbox[_ngcontent-%COMP%]{--size: 20px;--checkbox-background-checked: var(--success-500);--border-color: transparent;--border-color-checked: transparent;--checkmark-width: 2px}ion-checkbox[_ngcontent-%COMP%]::part(container){border-radius:50%}"]}),o})()},2218:(g,v,e)=>{e.d(v,{H:()=>l});var t=e(6895),u=e(4006),_=e(6114),s=e(8256);let l=(()=>{class a{}return a.\u0275fac=function(p){return new(p||a)},a.\u0275mod=s.oAB({type:a}),a.\u0275inj=s.cJS({imports:[t.ez,u.u5,_.Pc]}),a})()},4546:(g,v,e)=>{e.d(v,{y:()=>l});var t=e(6895),u=e(4006),_=e(6114),s=e(8256);let l=(()=>{class a{}return a.\u0275fac=function(p){return new(p||a)},a.\u0275mod=s.oAB({type:a}),a.\u0275inj=s.cJS({imports:[t.ez,u.u5,_.Pc]}),a})()},2187:(g,v,e)=>{e.d(v,{a:()=>c});var t=e(8256),u=e(4465),_=e(6994),s=e(6895),l=e(4006);const a=function(n,d,i){return{"label-error":n,"input-label-top":d,"input-label-left":i}};function o(n,d){if(1&n&&(t.TgZ(0,"div",3),t._uU(1),t.qZA()),2&n){const i=t.oxw();t.Q6J("ngClass",t.kEZ(3,a,!i.valid,"top"===i.labelPosition,"left"===i.labelPosition)),t.xp6(1),t.AsE(" ",i.label,"",i.required?"*":""," ")}}const p=function(n,d){return{"custom-input-top":n,"custom-input-left":d}},r=function(n,d,i){return{"input-fill":n,"validation-error":d,"input-left":i}};let c=(()=>{class n{constructor(i,h){this.toastService=i,this.shareService=h,this.type="text",this.placeholder="",this.fill=!0,this.validators=[],this.noValidation=!1,this.disabled=!1,this.required=!1,this.labelPosition="top",this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0}get value(){return this._value}set value(i){this._value!==i&&(this._value=i,this.valueChange.emit(i))}get validation(){return this._validation}set validation(i){this._validation!==i&&(this._validation=i,this.validationChange.emit(i))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(i=>{i&&0!==i.length&&this.validateInput()})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(i){0!==i.target.value&&(this.valid=!0),this.value=i.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(i=>!!i.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(i.message),!1)),this.validation=this.valid)}}return n.\u0275fac=function(i){return new(i||n)(t.Y36(u.k),t.Y36(_.t))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-input"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",validators:"validators",noValidation:"noValidation",disabled:"disabled",required:"required",labelPosition:"labelPosition",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:14,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-box",3,"type","ngModel","disabled","placeholder","ngClass","input","ngModelChange"],[1,"input-label",3,"ngClass"]],template:function(i,h){1&i&&(t.TgZ(0,"div",0),t.YNc(1,o,2,7,"div",1),t.TgZ(2,"input",2),t.NdJ("input",function(f){return h.onInputChange(f)})("ngModelChange",function(f){return h.value=f}),t.qZA()()),2&i&&(t.Q6J("ngClass",t.WLB(7,p,"top"===h.labelPosition,"left"===h.labelPosition)),t.xp6(1),t.Q6J("ngIf",h.label),t.xp6(1),t.Q6J("type",h.type)("ngModel",h.value)("disabled",h.disabled)("placeholder",h.placeholder)("ngClass",t.kEZ(10,r,h.fill,!h.valid,"left"===h.labelPosition)))},dependencies:[s.mk,s.O5,l.Fj,l.JJ,l.On],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:500}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{width:100%;height:45px;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;border:1px solid var(--gray-200);background-color:#fff}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}"]}),n})()},4166:(g,v,e)=>{e.d(v,{v:()=>l});var t=e(6895),u=e(4006),_=e(6114),s=e(8256);let l=(()=>{class a{}return a.\u0275fac=function(p){return new(p||a)},a.\u0275mod=s.oAB({type:a}),a.\u0275inj=s.cJS({imports:[t.ez,u.u5,_.Pc]}),a})()},4081:(g,v,e)=>{e.d(v,{R:()=>p});var t=e(8256),u=e(4465),_=e(6994),s=e(6895);const l=function(r){return{"label-error":r}};function a(r,c){if(1&r&&(t.TgZ(0,"div",3),t._uU(1),t.qZA()),2&r){const n=t.oxw();t.Q6J("ngClass",t.VKq(2,l,!n.valid)),t.xp6(1),t.Oqu(n.label)}}const o=function(r,c){return{"input-fill":r,"validation-error":c}};let p=(()=>{class r{constructor(n,d){this.toastService=n,this.shareService=d,this.type="text",this.placeholder="",this.fill=!0,this.validators=[],this.noValidation=!1,this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0}get value(){return this._value}set value(n){this._value!==n&&(this._value=n,this.valueChange.emit(n))}get validation(){return this._validation}set validation(n){this._validation!==n&&(this._validation=n,this.validationChange.emit(n))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(n=>{n&&0!==n.length&&this.validateInput()})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(n){0!==n.target.value&&(this.valid=!0),this.value=n.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(n=>!!n.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(n.message),!1)),console.log(this.valid),this.validation=this.valid)}}return r.\u0275fac=function(n){return new(n||r)(t.Y36(u.k),t.Y36(_.t))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-textarea"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",validators:"validators",noValidation:"noValidation",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:6,consts:[[1,"custom-input"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-box",3,"placeholder","ngClass","input"],[1,"input-label",3,"ngClass"]],template:function(n,d){1&n&&(t.TgZ(0,"div",0),t.YNc(1,a,2,4,"div",1),t.TgZ(2,"textarea",2),t.NdJ("input",function(h){return d.onInputChange(h)}),t.qZA()()),2&n&&(t.xp6(1),t.Q6J("ngIf",d.label),t.xp6(1),t.Q6J("placeholder",d.placeholder)("ngClass",t.WLB(3,o,d.fill,!d.valid)))},dependencies:[s.mk,s.O5],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content;display:flex;flex-direction:column;gap:5px}.input-label[_ngcontent-%COMP%]{font-size:14px;font-weight:400;color:var(--gray-700)}.input-box[_ngcontent-%COMP%]{width:100%;height:100px;resize:none;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;border:1px solid var(--gray-200)}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}"]}),r})()},4877:(g,v,e)=>{e.d(v,{r:()=>l});var t=e(6895),u=e(4006),_=e(6114),s=e(8256);let l=(()=>{class a{}return a.\u0275fac=function(p){return new(p||a)},a.\u0275mod=s.oAB({type:a}),a.\u0275inj=s.cJS({imports:[t.ez,u.u5,_.Pc]}),a})()},6994:(g,v,e)=>{e.d(v,{t:()=>s});var t=e(7579),u=e(1135),_=e(8256);let s=(()=>{class l{constructor(){this.editDataDetails=[],this.subject=new t.x,this.messageSource=new u.X(this.editDataDetails),this.currentMessage=this.messageSource.asObservable()}changeMessage(o){this.messageSource.next(o)}destroyMessage(){this.messageSource.next("")}}return l.\u0275fac=function(o){return new(o||l)},l.\u0275prov=_.Yz7({token:l,factory:l.\u0275fac,providedIn:"root"}),l})()},4465:(g,v,e)=>{e.d(v,{k:()=>s});var t=e(5861),u=e(8256),_=e(6114);let s=(()=>{class l{constructor(o){this.toastController=o}showToast(o,p="danger",r=1e3){var c=this;return(0,t.Z)(function*(){c.currentToast&&(yield c.dismissToast());const n=yield c.toastController.create({message:o,duration:r,color:p});c.currentToast=n,n.onDidDismiss().then(()=>{c.currentToast=null}),n.present()})()}dismissToast(){var o=this;return(0,t.Z)(function*(){o.currentToast&&(yield o.toastController.dismiss(),o.currentToast=null)})()}}return l.\u0275fac=function(o){return new(o||l)(u.LFG(_.yF))},l.\u0275prov=u.Yz7({token:l,factory:l.\u0275fac,providedIn:"root"}),l})()}}]);