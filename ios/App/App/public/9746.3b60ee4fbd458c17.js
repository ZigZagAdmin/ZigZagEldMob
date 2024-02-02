"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[9746,3646,8871,4576,4546],{3646:(C,v,e)=>{e.d(v,{G:()=>n});var t=e(8256),h=e(6895);function g(a,l){if(1&a){const r=t.EpF();t.TgZ(0,"img",6),t.NdJ("click",function(){t.CHM(r);const f=t.oxw();return t.KtG(f.goBack())}),t.qZA()}}const s=["*"];let n=(()=>{class a{constructor(){this.backButton=!1,this.backButtonCallback=new t.vpe}ngOnInit(){}goBack(){this.backButtonCallback.emit()}}return a.\u0275fac=function(r){return new(r||a)},a.\u0275cmp=t.Xpm({type:a,selectors:[["app-header"]],inputs:{title:"title",subtitle:"subtitle",backButton:"backButton"},outputs:{backButtonCallback:"backButtonCallback"},ngContentSelectors:s,decls:9,vars:3,consts:[[1,"title-container","padding-g"],[2,"display","flex","justify-content","space-between","align-items","center"],[1,"title-back"],["src","../../../assets/imgs/back-arrow.png",3,"click",4,"ngIf"],[1,"page-title"],[1,"subtitle","custom-subtitle"],["src","../../../assets/imgs/back-arrow.png",3,"click"]],template:function(r,u){1&r&&(t.F$t(),t.TgZ(0,"div",0)(1,"div",1)(2,"div",2),t.YNc(3,g,1,0,"img",3),t.TgZ(4,"div",4),t._uU(5),t.qZA()(),t.Hsn(6),t.qZA(),t.TgZ(7,"div",5),t._uU(8),t.qZA()()),2&r&&(t.xp6(3),t.Q6J("ngIf",u.backButton),t.xp6(2),t.Oqu(u.title),t.xp6(3),t.hij(" ",u.subtitle," "))},dependencies:[h.O5],styles:[".title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.title-back[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px}.title-back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;height:20px}.custom-subtitle[_ngcontent-%COMP%]{margin-left:35px}.title-container[_ngcontent-%COMP%]{padding-bottom:0}"]}),a})()},4546:(C,v,e)=>{e.d(v,{y:()=>n});var t=e(6895),h=e(4006),g=e(7151),s=e(8256);let n=(()=>{class a{}return a.\u0275fac=function(r){return new(r||a)},a.\u0275mod=s.oAB({type:a}),a.\u0275inj=s.cJS({imports:[t.ez,h.u5,g.Pc]}),a})()},2187:(C,v,e)=>{e.d(v,{a:()=>f});var t=e(8256),h=e(4465),g=e(6994),s=e(6895),n=e(4006);const a=function(i,d,o,c){return{"label-error":i,"input-label-top":d,"input-label-left":o,"no-label":c}};function l(i,d){if(1&i&&(t.TgZ(0,"div",3),t._uU(1),t.qZA()),2&i){const o=t.oxw();t.Q6J("ngClass",t.l5B(3,a,!o.valid,"top"===o.labelPosition,"left"===o.labelPosition,"none"===o.label)),t.xp6(1),t.AsE(" ",o.label,"",o.required?"*":""," ")}}const r=function(i,d){return{"custom-input-top":i,"custom-input-left":d}},u=function(i,d,o){return{"input-fill":i,"validation-error":d,"input-left":o}};let f=(()=>{class i{constructor(o,c){this.toastService=o,this.shareService=c,this.type="text",this.placeholder="",this.fill=!0,this.validators=[],this.noValidation=!1,this.disabled=!1,this.required=!1,this.labelPosition="top",this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0}get value(){return this._value}set value(o){this._value!==o&&(this._value=o,this.valueChange.emit(o))}get validation(){return this._validation}set validation(o){this._validation!==o&&(this._validation=o,this.validationChange.emit(o))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(o=>{"reset"===o?this.valid=!0:o&&0!==o.length&&this.validateInput()})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(o){0!==o.target.value&&(this.valid=!0),this.value=o.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(o=>!!o.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(o.message),!1)),this.validation=this.valid)}}return i.\u0275fac=function(o){return new(o||i)(t.Y36(h.k),t.Y36(g.t))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-input"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",validators:"validators",noValidation:"noValidation",disabled:"disabled",required:"required",labelPosition:"labelPosition",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:14,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],["autocomplete","one-time-code",1,"input-box",3,"type","ngModel","disabled","placeholder","ngClass","input","ngModelChange"],[1,"input-label",3,"ngClass"]],template:function(o,c){1&o&&(t.TgZ(0,"div",0),t.YNc(1,l,2,8,"div",1),t.TgZ(2,"input",2),t.NdJ("input",function(x){return c.onInputChange(x)})("ngModelChange",function(x){return c.value=x}),t.qZA()()),2&o&&(t.Q6J("ngClass",t.WLB(7,r,"top"===c.labelPosition,"left"===c.labelPosition)),t.xp6(1),t.Q6J("ngIf",c.label),t.xp6(1),t.Q6J("type",c.type)("ngModel",c.value)("disabled",c.disabled)("placeholder",c.placeholder)("ngClass",t.kEZ(10,u,c.fill,!c.valid,"left"===c.labelPosition)))},dependencies:[s.mk,s.O5,n.Fj,n.JJ,n.On],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:500}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{width:100%;height:45px;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;border:1px solid var(--gray-200);background-color:#fff}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}.no-label[_ngcontent-%COMP%]{color:transparent!important}"]}),i})()},4166:(C,v,e)=>{e.d(v,{v:()=>n});var t=e(6895),h=e(4006),g=e(7151),s=e(8256);let n=(()=>{class a{}return a.\u0275fac=function(r){return new(r||a)},a.\u0275mod=s.oAB({type:a}),a.\u0275inj=s.cJS({imports:[t.ez,h.u5,g.Pc]}),a})()},4081:(C,v,e)=>{e.d(v,{R:()=>r});var t=e(8256),h=e(4465),g=e(6994),s=e(6895);const n=function(u){return{"label-error":u}};function a(u,f){if(1&u&&(t.TgZ(0,"div",3),t._uU(1),t.qZA()),2&u){const i=t.oxw();t.Q6J("ngClass",t.VKq(2,n,!i.valid)),t.xp6(1),t.Oqu(i.label)}}const l=function(u,f){return{"input-fill":u,"validation-error":f}};let r=(()=>{class u{constructor(i,d){this.toastService=i,this.shareService=d,this.type="text",this.placeholder="",this.fill=!0,this.disabled=!1,this.validators=[],this.noValidation=!1,this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0}get value(){return this._value}set value(i){this._value!==i&&(this._value=i,this.valueChange.emit(i))}get validation(){return this._validation}set validation(i){this._validation!==i&&(this._validation=i,this.validationChange.emit(i))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(i=>{"reset"===i?this.valid=!0:i&&0!==i.length&&this.validateInput()})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(i){0!==i.target.value&&(this.valid=!0),this.value=i.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(i=>!!i.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(i.message),!1)),this.validation=this.valid)}}return u.\u0275fac=function(i){return new(i||u)(t.Y36(h.k),t.Y36(g.t))},u.\u0275cmp=t.Xpm({type:u,selectors:[["app-textarea"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",disabled:"disabled",validators:"validators",noValidation:"noValidation",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:7,consts:[[1,"custom-input"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-box",3,"disabled","placeholder","ngClass","input"],[1,"input-label",3,"ngClass"]],template:function(i,d){1&i&&(t.TgZ(0,"div",0),t.YNc(1,a,2,4,"div",1),t.TgZ(2,"textarea",2),t.NdJ("input",function(c){return d.onInputChange(c)}),t.qZA()()),2&i&&(t.xp6(1),t.Q6J("ngIf",d.label),t.xp6(1),t.Q6J("disabled",d.disabled)("placeholder",d.placeholder)("ngClass",t.WLB(4,l,d.fill,!d.valid)))},dependencies:[s.mk,s.O5],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content;display:flex;flex-direction:column;gap:5px}.input-label[_ngcontent-%COMP%]{font-size:14px;font-weight:400;color:var(--gray-500)}.input-box[_ngcontent-%COMP%]{width:100%;height:100px;resize:none;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;background-color:#fff;border:1px solid var(--gray-200)}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)!important}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}"]}),u})()},4877:(C,v,e)=>{e.d(v,{r:()=>n});var t=e(6895),h=e(4006),g=e(7151),s=e(8256);let n=(()=>{class a{}return a.\u0275fac=function(r){return new(r||a)},a.\u0275mod=s.oAB({type:a}),a.\u0275inj=s.cJS({imports:[t.ez,h.u5,g.Pc]}),a})()},9746:(C,v,e)=>{e.r(v),e.d(v,{SendLogsPageModule:()=>T});var t=e(6895),h=e(4006),g=e(7151),s=e(5050),n=e(8256),a=e(6994),l=e(7278),r=e(3646),u=e(2187),f=e(4081);const d=[{path:"",component:(()=>{class p{constructor(m,_,M){this.navCtrl=m,this.shareService=_,this.utilityService=M,this.dataTransferType="",this.comments="",this.loading=!1,this.validation={dataTransferType:!1,comments:!1}}ngOnInit(){}ngOnDestroy(){this.shareService.destroyMessage()}submit(){this.shareService.changeMessage(this.utilityService.generateString(5)),this.utilityService.validateForm(this.validation)&&(this.loading=!0,this.loading=!1,this.goBack())}goBack(){this.navCtrl.navigateBack("unitab/inspection")}}return p.\u0275fac=function(m){return new(m||p)(n.Y36(g.SH),n.Y36(a.t),n.Y36(l.t))},p.\u0275cmp=n.Xpm({type:p,selectors:[["app-send-logs"]],decls:12,vars:14,consts:[[3,"title","backButton","backButtonCallback"],[1,"btn","secondary-btn"],[1,"edit-form","padding-g"],[3,"label","fill","type","value","disabled","validation","valueChange","validationChange"],[1,"btns-flex"],[1,"btn","secondary-btn",3,"click"],[1,"btn","primary-btn",3,"click"]],template:function(m,_){1&m&&(n.TgZ(0,"ion-content")(1,"app-header",0),n.NdJ("backButtonCallback",function(){return _.goBack()}),n.TgZ(2,"button",1),n._uU(3,"7 Days + Today"),n.qZA()(),n.TgZ(4,"div",2)(5,"app-input",3),n.NdJ("valueChange",function(P){return _.dataTransferType=P})("validationChange",function(P){return _.validation.dataTransferType=P}),n.qZA(),n.TgZ(6,"app-textarea",3),n.NdJ("valueChange",function(P){return _.comments=P})("validationChange",function(P){return _.validation.comments=P}),n.qZA(),n.TgZ(7,"div",4)(8,"button",5),n.NdJ("click",function(){return _.goBack()}),n._uU(9,"Back"),n.qZA(),n.TgZ(10,"button",6),n.NdJ("click",function(){return _.submit()}),n._uU(11,"Send"),n.qZA()()()()),2&m&&(n.xp6(1),n.Q6J("title","Send Logs")("backButton",!0),n.xp6(4),n.Q6J("label","Data Transfer Type")("fill",!1)("type","text")("value",_.dataTransferType)("disabled",_.loading)("validation",_.validation.dataTransferType),n.xp6(1),n.Q6J("label","Comment")("fill",!1)("type","text")("value",_.comments)("disabled",_.loading)("validation",_.validation.comments))},dependencies:[g.W2,r.G,u.a,f.R],styles:[".btn[_ngcontent-%COMP%]{border-radius:30px;padding:10px 15px}.btns-flex[_ngcontent-%COMP%]{width:100%}.btns-flex[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{flex-grow:1;height:50px}"]}),p})()}];let o=(()=>{class p{}return p.\u0275fac=function(m){return new(m||p)},p.\u0275mod=n.oAB({type:p}),p.\u0275inj=n.cJS({imports:[s.Bz.forChild(d),s.Bz]}),p})();var c=e(4546),O=e(4166),x=e(4877);let T=(()=>{class p{}return p.\u0275fac=function(m){return new(m||p)},p.\u0275mod=n.oAB({type:p}),p.\u0275inj=n.cJS({imports:[t.ez,h.u5,g.Pc,o,c.y,O.v,x.r]}),p})()},6994:(C,v,e)=>{e.d(v,{t:()=>s});var t=e(7579),h=e(1135),g=e(8256);let s=(()=>{class n{constructor(){this.editDataDetails=[],this.subject=new t.x,this.messageSource=new h.X(this.editDataDetails),this.currentMessage=this.messageSource.asObservable()}changeMessage(l){this.messageSource.next(l)}destroyMessage(){this.messageSource.next("")}}return n.\u0275fac=function(l){return new(l||n)},n.\u0275prov=g.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),n})()},7278:(C,v,e)=>{e.d(v,{t:()=>g});var t=e(8256),h=e(849);let g=(()=>{class s{constructor(a){this.storage=a}generateString(a){const l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let r=" ";const u=l.length;for(let f=0;f<a;f++)r+=l.charAt(Math.floor(Math.random()*u));return r}validateForm(a){let l=!0;for(const r in a)l=l&&a[r];return l}uuidv4(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){const l=16*Math.random()|0;return("x"==a?l:3&l|8).toString(16)})}}return s.\u0275fac=function(a){return new(a||s)(t.LFG(h.K))},s.\u0275prov=t.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"}),s})()}}]);