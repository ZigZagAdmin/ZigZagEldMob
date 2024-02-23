"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[6696,4546],{4546:(M,C,e)=>{e.d(C,{y:()=>c});var t=e(6895),h=e(4006),g=e(7151),r=e(8256);let c=(()=>{class o{}return o.\u0275fac=function(u){return new(u||o)},o.\u0275mod=r.oAB({type:o}),o.\u0275inj=r.cJS({imports:[t.ez,h.u5,g.Pc]}),o})()},2187:(M,C,e)=>{e.d(C,{a:()=>p});var t=e(8256),h=e(4465),g=e(6994),r=e(6895),c=e(4006);const o=function(v,i,a,n){return{"label-error":v,"input-label-top":i,"input-label-left":a,"no-label":n}};function l(v,i){if(1&v&&(t.TgZ(0,"div",3),t._uU(1),t.qZA()),2&v){const a=t.oxw();t.Q6J("ngClass",t.l5B(3,o,!a.valid,"top"===a.labelPosition,"left"===a.labelPosition,"none"===a.label)),t.xp6(1),t.AsE(" ",a.label,"",a.required?"*":""," ")}}const u=function(v,i){return{"custom-input-top":v,"custom-input-left":i}},d=function(v,i,a,n){return{"input-fill":v,"validation-error":i,"input-left":a,"disable-input-opacity":n}};let p=(()=>{class v{constructor(a,n,s){this.toastService=a,this.shareService=n,this.elementRef=s,this.type="text",this.placeholder="",this.fill=!0,this.validators=[],this.noValidation=!1,this.disabled=!1,this.showDisabled=!1,this.required=!1,this.labelPosition="top",this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0}get value(){return this._value}set value(a){this._value!==a&&(this._value=a,this.valueChange.emit(a))}get validation(){return this._validation}set validation(a){this._validation!==a&&(this._validation=a,this.validationChange.emit(a))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(a=>{"reset"===a?this.valid=!0:"invalidate"!==a||this.noValidation?a&&0!==a.length&&this.validateInput():this.valid=!1})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(a){0!==a.target.value&&(this.valid=!0),this.value=a.target.value,this.valueChange.emit(this.value)}validateInput(){!this.noValidation&&null!==this.elementRef.nativeElement.offsetParent&&(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(a=>!!a.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(a.message),!1)),this.validation=this.valid)}}return v.\u0275fac=function(a){return new(a||v)(t.Y36(h.k),t.Y36(g.t),t.Y36(t.SBq))},v.\u0275cmp=t.Xpm({type:v,selectors:[["app-input"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",validators:"validators",noValidation:"noValidation",disabled:"disabled",showDisabled:"showDisabled",required:"required",labelPosition:"labelPosition",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:15,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],["autocomplete","one-time-code",1,"input-box",3,"type","ngModel","readonly","placeholder","ngClass","input","ngModelChange"],[1,"input-label",3,"ngClass"]],template:function(a,n){1&a&&(t.TgZ(0,"div",0),t.YNc(1,l,2,8,"div",1),t.TgZ(2,"input",2),t.NdJ("input",function(f){return n.onInputChange(f)})("ngModelChange",function(f){return n.value=f}),t.qZA()()),2&a&&(t.Q6J("ngClass",t.WLB(7,u,"top"===n.labelPosition,"left"===n.labelPosition)),t.xp6(1),t.Q6J("ngIf",n.label),t.xp6(1),t.Q6J("type",n.type)("ngModel",n.value)("readonly",n.disabled)("placeholder",n.placeholder)("ngClass",t.l5B(10,d,n.fill,!n.valid,"left"===n.labelPosition,n.showDisabled)))},dependencies:[r.mk,r.O5,c.Fj,c.JJ,c.On],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:400}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{width:100%;height:45px;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;border:1px solid var(--gray-200);background-color:transparent}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}.no-label[_ngcontent-%COMP%]{color:transparent!important}"]}),v})()},4166:(M,C,e)=>{e.d(C,{v:()=>c});var t=e(6895),h=e(4006),g=e(7151),r=e(8256);let c=(()=>{class o{}return o.\u0275fac=function(u){return new(u||o)},o.\u0275mod=r.oAB({type:o}),o.\u0275inj=r.cJS({imports:[t.ez,h.u5,g.Pc]}),o})()},7236:(M,C,e)=>{e.d(C,{L:()=>n});var t=e(8256),h=e(4465),g=e(6994),r=e(6895),c=e(4006),o=e(7151);const l=function(s,f,_,m){return{"label-error":s,"input-label-top":f,"input-label-left":_,"no-label":m}};function u(s,f){if(1&s&&(t.TgZ(0,"div",7),t._uU(1),t.qZA()),2&s){const _=t.oxw();t.Q6J("ngClass",t.l5B(3,l,!_.valid,"top"===_.labelPosition,"left"===_.labelPosition,"none"===_.label)),t.xp6(1),t.AsE(" ",_.label,"",_.required?"*":""," ")}}function d(s,f){1&s&&t._UZ(0,"img",8)}function p(s,f){1&s&&t._UZ(0,"ion-spinner",9)}const v=function(s,f){return{"custom-input-top":s,"custom-input-left":f}},i=function(s,f,_,m){return{"input-fill":s,"validation-error":f,"input-left":_,"disable-input-opacity":m}},a=function(s){return{"disable-fetch":s}};let n=(()=>{class s{constructor(_,m){this.toastService=_,this.shareService=m,this.type="text",this.placeholder="",this.fill=!0,this.loading=!1,this.validators=[],this.noValidation=!1,this.disabled=!1,this.showDisabled=!1,this.required=!1,this.labelPosition="top",this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.gpsCallback=new t.vpe,this.valid=!0}get value(){return this._value}set value(_){this._value!==_&&(this._value=_,this._value&&0!==this._value.length&&this.validateInput(),this.valueChange.emit(_))}get validation(){return this._validation}set validation(_){this._validation!==_&&(this._validation=_,this.validationChange.emit(_))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(_=>{"reset"===_?this.valid=!0:"invalidate"!==_||this.noValidation?_&&0!==_.length&&this.validateInput():this.valid=!1})}triggerGps(){this.gpsCallback.emit()}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(_){0!==_.target.value&&(this.valid=!0),this.value=_.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(_=>!!_.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(_.message),!1)),this.validation=this.valid)}}return s.\u0275fac=function(_){return new(_||s)(t.Y36(h.k),t.Y36(g.t))},s.\u0275cmp=t.Xpm({type:s,selectors:[["app-location-input"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",loading:"loading",validators:"validators",noValidation:"noValidation",disabled:"disabled",showDisabled:"showDisabled",required:"required",labelPosition:"labelPosition",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange",gpsCallback:"gpsCallback"},decls:7,vars:20,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-container"],["autocomplete","one-time-code",1,"input-box",3,"type","ngModel","readonly","placeholder","ngClass","input","ngModelChange"],[1,"input-fetch",3,"ngClass","click"],["src","../../../assets/icon/gps.svg",4,"ngIf"],["class","input-loading","name","circular","color","medium",4,"ngIf"],[1,"input-label",3,"ngClass"],["src","../../../assets/icon/gps.svg"],["name","circular","color","medium",1,"input-loading"]],template:function(_,m){1&_&&(t.TgZ(0,"div",0),t.YNc(1,u,2,8,"div",1),t.TgZ(2,"div",2)(3,"input",3),t.NdJ("input",function(P){return m.onInputChange(P)})("ngModelChange",function(P){return m.value=P}),t.qZA(),t.TgZ(4,"div",4),t.NdJ("click",function(){return m.triggerGps()}),t.YNc(5,d,1,0,"img",5),t.YNc(6,p,1,0,"ion-spinner",6),t.qZA()()()),2&_&&(t.Q6J("ngClass",t.WLB(10,v,"top"===m.labelPosition,"left"===m.labelPosition)),t.xp6(1),t.Q6J("ngIf",m.label),t.xp6(2),t.Q6J("type",m.type)("ngModel",m.value)("readonly",m.disabled||m.loading)("placeholder",m.placeholder)("ngClass",t.l5B(13,i,m.fill,!m.valid,"left"===m.labelPosition,m.showDisabled)),t.xp6(1),t.Q6J("ngClass",t.VKq(18,a,m.loading)),t.xp6(1),t.Q6J("ngIf",!m.loading),t.xp6(1),t.Q6J("ngIf",m.loading))},dependencies:[r.mk,r.O5,c.Fj,c.JJ,c.On,o.PQ],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:400}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{width:100%;height:45px;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;border:1px solid var(--gray-200);background-color:#fff}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}.no-label[_ngcontent-%COMP%]{color:transparent!important}.input-container[_ngcontent-%COMP%]{position:relative}.input-fetch[_ngcontent-%COMP%]{position:absolute;width:24px;height:45px;right:12px;top:0px;display:flex;justify-content:center;align-items:center}.input-fetch[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center}.input-fetch[_ngcontent-%COMP%]   ion-spinner[_ngcontent-%COMP%]{zoom:.7}.disable-fetch[_ngcontent-%COMP%]{pointer-events:none}"]}),s})()},8134:(M,C,e)=>{e.d(C,{y:()=>c});var t=e(6895),h=e(4006),g=e(7151),r=e(8256);let c=(()=>{class o{}return o.\u0275fac=function(u){return new(u||o)},o.\u0275mod=r.oAB({type:o}),o.\u0275inj=r.cJS({imports:[t.ez,h.u5,g.Pc]}),o})()},1585:(M,C,e)=>{e.d(C,{M:()=>v});var t=e(8256),h=e(7278),g=e(6895),r=e(7151);const c=function(i,a,n){return{"label-error":i,"input-label-top":a,"input-label-left":n}};function o(i,a){if(1&i&&(t.TgZ(0,"div",6),t._uU(1),t.qZA()),2&i){const n=t.oxw();t.Q6J("ngClass",t.kEZ(3,c,!n.valid,"top"===n.labelPosition,"left"===n.labelPosition)),t.xp6(1),t.AsE(" ",n.label,"",n.required?"*":""," ")}}function l(i,a){if(1&i){const n=t.EpF();t.TgZ(0,"div",12),t.NdJ("click",function(){const f=t.CHM(n),_=f.$implicit,m=f.index,T=t.oxw(2);return t.KtG(T.triggerCheck(_,m))}),t.TgZ(1,"div",13),t._uU(2),t.qZA(),t.TgZ(3,"div",14),t._UZ(4,"ion-checkbox",15),t.qZA()()}if(2&i){const n=a.$implicit;t.xp6(2),t.Oqu(n.value),t.xp6(2),t.Q6J("checked",n.checked)}}function u(i,a){if(1&i){const n=t.EpF();t.TgZ(0,"div",7),t.YNc(1,l,5,2,"div",8),t.qZA(),t.TgZ(2,"div",9)(3,"div",10),t.NdJ("click",function(){t.CHM(n);const f=t.oxw();return t.KtG(f.closeModal())}),t._uU(4,"Cancel"),t.qZA(),t.TgZ(5,"div",11),t.NdJ("click",function(){t.CHM(n);const f=t.oxw();return t.KtG(f.submit())}),t._uU(6,"Submit"),t.qZA()()}if(2&i){const n=t.oxw();t.xp6(1),t.Q6J("ngForOf",n.optionsCheck)}}const d=function(i,a){return{"custom-input-top":i,"custom-input-left":a}},p=function(i,a,n){return{"input-fill":i,"validation-error":a,"input-left":n}};let v=(()=>{class i{constructor(n){this.utilityService=n,this.fill=!0,this.validators=[],this.noValidation=!1,this.required=!1,this.labelPosition="top",this.changeDetection=new t.vpe,this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0,this.isModalOpen=!1,this.optionsCheck=[],this.lastStatus=[],this.id=""}get value(){return this._value}set value(n){this._value!==n&&(this._value=n,this.valueChange.emit(n),this.changeDetection.emit(n))}get validation(){return this._validation}set validation(n){this._validation!==n&&(this._validation=n,this.validationChange.emit(n))}ngOnInit(){if(this.id=this.utilityService.generateString(8),this.optionsCheck=this.options.map(n=>({value:n,checked:!1})),this._value&&0!==this._value.length){const n=this._value.split(", ");this.optionsCheck.forEach(s=>n.forEach(f=>s.value===f?s.checked=!0:null))}this.lastStatus=this.cloneArray(this.optionsCheck)}triggerCheck(n,s){const f=this.optionsCheck.find(_=>_.value===n.value);f.checked=!f.checked}openModal(){this.isModalOpen=!0}closeModal(){this.isModalOpen=!1,this.optionsCheck=this.cloneArray(this.lastStatus)}submit(){let n=[];this.optionsCheck.forEach(s=>!0===s.checked?n.push(s.value):null),this.value=n.join(", "),this.lastStatus=this.cloneArray(this.optionsCheck),this.isModalOpen=!1}cloneArray(n){return JSON.parse(JSON.stringify(n))}}return i.\u0275fac=function(n){return new(n||i)(t.Y36(h.t))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-multiple-select"]],inputs:{label:"label",fill:"fill",validators:"validators",noValidation:"noValidation",required:"required",labelPosition:"labelPosition",options:"options",value:"value",validation:"validation"},outputs:{changeDetection:"changeDetection",valueChange:"valueChange",validationChange:"validationChange"},decls:8,vars:14,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-box",3,"id","ngClass","click"],[1,"input-box-value"],["src","assets/icon/bottom-arrow-18.svg"],["id","custom-modal",3,"isOpen","trigger"],[1,"input-label",3,"ngClass"],["id","optionBox",1,"option-box"],["class","select-option",3,"click",4,"ngFor","ngForOf"],[1,"submit-buttons"],[1,"action-button","default",3,"click"],[1,"action-button","primary",2,"color","#fcfcfc",3,"click"],[1,"select-option",3,"click"],[1,"select-value"],[1,"select-icon"],[3,"checked"]],template:function(n,s){1&n&&(t.TgZ(0,"div",0),t.YNc(1,o,2,7,"div",1),t.TgZ(2,"div",2),t.NdJ("click",function(){return s.openModal()}),t.TgZ(3,"div",3),t._uU(4),t.qZA(),t._UZ(5,"img",4),t.qZA(),t.TgZ(6,"ion-modal",5),t.YNc(7,u,7,1,"ng-template"),t.qZA()()),2&n&&(t.Q6J("ngClass",t.WLB(7,d,"top"===s.labelPosition,"left"===s.labelPosition)),t.xp6(1),t.Q6J("ngIf",s.label),t.xp6(1),t.Q6J("id",s.id)("ngClass",t.kEZ(10,p,s.fill,!s.valid,"left"===s.labelPosition)),t.xp6(2),t.Oqu(s.value||"No option selected"),t.xp6(2),t.Q6J("isOpen",s.isModalOpen)("trigger",s.id))},dependencies:[g.mk,g.sg,g.O5,r.nz,r.ki,r.w],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:400}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:15px;width:100%;height:45px;border-radius:10px;padding:10px 15px;font-size:14px;font-weight:400;color:var(--gray-500);border:1px solid var(--gray-200);background-position:right 15px center}.input-box[_ngcontent-%COMP%]   .input-box-value[_ngcontent-%COMP%]{flex:1 calc(92% - 15px);box-sizing:border-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.input-box[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{flex:1 8%;width:18px;height:18px}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}ion-modal#custom-modal[_ngcontent-%COMP%]{--width: fit-content;--min-width: 80%;--max-height: 70%;--overflow: hidden;--height: fit-content;--border-radius: 10px;--box-shadow: 0 28px 48px rgba(0, 0, 0, .4)}.option-box[_ngcontent-%COMP%]{display:flex;flex-direction:column;width:100%;padding:10px 0;overflow:auto;max-height:500px}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]{width:100%;display:flex;justify-content:space-between;align-items:center;padding:12px 20px;transition:all .2s}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]:active{background-color:var(--gray-100)}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]   .select-value[_ngcontent-%COMP%]{color:var(--gray-700)}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]   .select-icon[_ngcontent-%COMP%]{display:flex;align-items:center}ion-checkbox[_ngcontent-%COMP%]{--size: 20px;--checkbox-background-checked: var(--success-500);--border-color: var(--gray-200);--checkbox-background: var(--gray-100);--border-color-checked: transparent;--checkmark-width: 2px;pointer-events:none}ion-checkbox[_ngcontent-%COMP%]::part(container){border-radius:50%}.submit-buttons[_ngcontent-%COMP%]{display:flex;align-items:center;gap:5px;width:100%;padding:10px 20px;border-top:1px solid var(--gray-100)}.submit-buttons[_ngcontent-%COMP%]   .action-button[_ngcontent-%COMP%]{flex:1;font-size:15px;display:flex;justify-content:center;align-items:center;padding:10px;border-radius:50px;cursor:pointer}.default[_ngcontent-%COMP%]{color:var(--gray-500);background-color:var(--gray-100)}.primary[_ngcontent-%COMP%]{color:var(--gray-25);background-color:var(--primary-600)}@media screen and (max-height: 799px){.option-box[_ngcontent-%COMP%]{max-height:400px}}@media screen and (max-height: 659px){.option-box[_ngcontent-%COMP%]{max-height:350px}}"]}),i})()},6330:(M,C,e)=>{e.d(C,{_:()=>c});var t=e(6895),h=e(4006),g=e(7151),r=e(8256);let c=(()=>{class o{}return o.\u0275fac=function(u){return new(u||o)},o.\u0275mod=r.oAB({type:o}),o.\u0275inj=r.cJS({imports:[t.ez,h.u5,g.Pc]}),o})()},8546:(M,C,e)=>{e.d(C,{w:()=>c});var t=e(6895),h=e(4006),g=e(7151),r=e(8256);let c=(()=>{class o{}return o.\u0275fac=function(u){return new(u||o)},o.\u0275mod=r.oAB({type:o}),o.\u0275inj=r.cJS({imports:[t.ez,h.u5,g.Pc]}),o})()},9534:(M,C,e)=>{e.d(C,{D:()=>o});var t=e(8256),h=e(6895),g=e(7151);const r=function(l){return{"disable-option":l}};function c(l,u){if(1&l){const d=t.EpF();t.TgZ(0,"div",3),t.NdJ("click",function(){const i=t.CHM(d).$implicit,a=t.oxw();return t.KtG(a.select(i))}),t.TgZ(1,"div",4)(2,"div",5),t._UZ(3,"img",6),t.qZA(),t.TgZ(4,"div",7),t._uU(5),t.qZA()(),t.TgZ(6,"div",8),t._UZ(7,"ion-checkbox",9),t.qZA()()}if(2&l){const d=u.$implicit,p=t.oxw();t.Q6J("ngClass",t.VKq(5,r,("VCS"===d.value||"D"===d.value)&&p.disableOption&&p.half||"VCS"===d.value&&p.disableOption&&!p.half)),t.xp6(3),t.Q6J("src","success"===d.icon?"assets/icon/shield-tick.svg":"assets/icon/shield-cross.svg",t.LSH),t.xp6(1),t.Q6J("ngClass",d.icon),t.xp6(1),t.Oqu(d.label),t.xp6(2),t.Q6J("checked",d.checked)}}let o=(()=>{class l{constructor(){this.data=[{icon:"success",label:"Vehicle Condition Satisfactory",value:"VCS",checked:!1},{icon:"error",label:"Has Defects",value:"D",checked:!1},{icon:"success",label:"Defects Corrected",value:"DC",checked:!1},{icon:"error",label:"Defects Need Not Be Corrected",value:"DNNBC",checked:!1}],this.dataHalf=[{icon:"success",label:"Vehicle Condition Satisfactory",value:"VCS",checked:!1},{icon:"error",label:"Has Defects",value:"D",checked:!1}],this.half=!1,this.disableOption=!1,this.selectedValue=new t.vpe,this.valueChange=new t.vpe}get value(){return this._value}set value(d){this._value!==d&&(this._value=d,this.changeCurrentValue(),this.valueChange.emit(d))}ngOnInit(){this.changeCurrentValue()}changeCurrentValue(){if(0!==this._value.length){let d=this.data.find(p=>p.value===this._value);this.select(d)}}select(d){let p=this.data.findIndex(i=>i.value===d.value),v=[];v=this.half?this.dataHalf:this.data,v.forEach(i=>i.checked=!1),v[p].checked=!0,this.selectedValue.emit(v[p].value)}}return l.\u0275fac=function(d){return new(d||l)},l.\u0275cmp=t.Xpm({type:l,selectors:[["app-status-radio-button"]],inputs:{half:"half",disableOption:"disableOption",value:"value"},outputs:{selectedValue:"selectedValue",valueChange:"valueChange"},decls:4,vars:1,consts:[[1,"status-title"],[1,"list-container"],["class","list-item",3,"ngClass","click",4,"ngFor","ngForOf"],[1,"list-item",3,"ngClass","click"],[1,"item-data"],[1,"status-icon"],[3,"src"],[1,"status-label",3,"ngClass"],[1,"item-checkbox"],[3,"checked"]],template:function(d,p){1&d&&(t.TgZ(0,"div",0),t._uU(1,"Status"),t.qZA(),t.TgZ(2,"div",1),t.YNc(3,c,8,7,"div",2),t.qZA()),2&d&&(t.xp6(3),t.Q6J("ngForOf",p.half?p.dataHalf:p.data))},dependencies:[h.mk,h.sg,g.nz,g.w],styles:[".list-container[_ngcontent-%COMP%]{width:100%;display:flex;flex-direction:column;gap:10px}.list-item[_ngcontent-%COMP%]{width:100%;border:none;border-radius:10px;background-color:var(--gray-100);padding:15px;display:flex;align-items:center;justify-content:space-between}.item-data[_ngcontent-%COMP%]{display:flex;align-items:center;gap:5px}.status-icon[_ngcontent-%COMP%]{width:24px;height:24px}.status-label[_ngcontent-%COMP%]{font-size:16px;font-weight:600;color:var(--gray-500)}.item-checkbox[_ngcontent-%COMP%]{display:flex;align-items:center}ion-checkbox[_ngcontent-%COMP%]{--size: 20px;--checkbox-background-checked: var(--success-500);--border-color: transparent;--border-color-checked: transparent;--checkmark-width: 2px}ion-checkbox[_ngcontent-%COMP%]::part(container){border-radius:50%}.success[_ngcontent-%COMP%]{color:var(--success-500)}.error[_ngcontent-%COMP%]{color:var(--error-500)}.status-title[_ngcontent-%COMP%]{font-size:15px;font-weight:500;color:var(--gray-500);margin-bottom:5px}.disable-option[_ngcontent-%COMP%]{pointer-events:none}"]}),l})()},7484:(M,C,e)=>{e.d(C,{T:()=>c});var t=e(6895),h=e(4006),g=e(7151),r=e(8256);let c=(()=>{class o{}return o.\u0275fac=function(u){return new(u||o)},o.\u0275mod=r.oAB({type:o}),o.\u0275inj=r.cJS({imports:[t.ez,h.u5,g.Pc]}),o})()},4081:(M,C,e)=>{e.d(C,{R:()=>d});var t=e(8256),h=e(4465),g=e(6994),r=e(6895),c=e(4006);const o=function(p){return{"label-error":p}};function l(p,v){if(1&p&&(t.TgZ(0,"div",3),t._uU(1),t.qZA()),2&p){const i=t.oxw();t.Q6J("ngClass",t.VKq(2,o,!i.valid)),t.xp6(1),t.Oqu(i.label)}}const u=function(p,v){return{"input-fill":p,"validation-error":v}};let d=(()=>{class p{constructor(i,a){this.toastService=i,this.shareService=a,this.type="text",this.placeholder="",this.fill=!0,this.disabled=!1,this.validators=[],this.noValidation=!1,this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0}get value(){return this._value}set value(i){this._value!==i&&(this._value=i,this.valueChange.emit(i))}get validation(){return this._validation}set validation(i){this._validation!==i&&(this._validation=i,this.validationChange.emit(i))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(i=>{"reset"===i?this.valid=!0:"invalidate"!==i||this.noValidation?i&&0!==i.length&&this.validateInput():this.valid=!1})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(i){0!==i.target.value&&(this.valid=!0),this.value=i.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(i=>!!i.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(i.message),!1)),this.validation=this.valid)}}return p.\u0275fac=function(i){return new(i||p)(t.Y36(h.k),t.Y36(g.t))},p.\u0275cmp=t.Xpm({type:p,selectors:[["app-textarea"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",disabled:"disabled",validators:"validators",noValidation:"noValidation",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:8,consts:[[1,"custom-input"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-box",3,"ngModel","readonly","placeholder","ngClass","input","ngModelChange"],[1,"input-label",3,"ngClass"]],template:function(i,a){1&i&&(t.TgZ(0,"div",0),t.YNc(1,l,2,4,"div",1),t.TgZ(2,"textarea",2),t.NdJ("input",function(s){return a.onInputChange(s)})("ngModelChange",function(s){return a.value=s}),t.qZA()()),2&i&&(t.xp6(1),t.Q6J("ngIf",a.label),t.xp6(1),t.Q6J("ngModel",a.value)("readonly",a.disabled)("placeholder",a.placeholder)("ngClass",t.WLB(5,u,a.fill,!a.valid)))},dependencies:[r.mk,r.O5,c.Fj,c.JJ,c.On],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content;display:flex;flex-direction:column;gap:5px}.input-label[_ngcontent-%COMP%]{font-size:14px;font-weight:400;color:var(--gray-500)}.input-box[_ngcontent-%COMP%]{width:100%;height:100px;resize:none;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;background-color:var(--all-background);border:1px solid var(--gray-200)}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)!important}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}"]}),p})()},4877:(M,C,e)=>{e.d(C,{r:()=>c});var t=e(6895),h=e(4006),g=e(7151),r=e(8256);let c=(()=>{class o{}return o.\u0275fac=function(u){return new(u||o)},o.\u0275mod=r.oAB({type:o}),o.\u0275inj=r.cJS({imports:[t.ez,h.u5,g.Pc]}),o})()},8924:(M,C,e)=>{e.d(C,{Eb:()=>t,Rk:()=>r,W3:()=>g,bm:()=>h});const t={ET:"UTC-4",EST:"UTC-5",EDT:"UTC-4",CT:"UTC-5",CST:"UTC-6",CDT:"UTC-5",MT:"UTC-6",MST:"UTC-7",MDT:"UTC-6",PT:"UTC-7",PST:"UTC-8",PDT:"UTC-7",AT:"UTC-8",AKT:"UTC-8",AKST:"UTC-9",AKDT:"UTC-8",HT:"UTC-9",HST:"UTC-10",HAST:"UTC-9"},h={ET:"UTC-5",EST:"UTC-5",EDT:"UTC-4",CT:"UTC-6",CST:"UTC-6",CDT:"UTC-5",MT:"UTC-7",MST:"UTC-7",MDT:"UTC-6",PT:"UTC-8",PST:"UTC-8",PDT:"UTC-7",AT:"UTC-9",AKT:"UTC-9",AKST:"UTC-9",AKDT:"UTC-8",HT:"UTC-10",HST:"UTC-10",HAST:"UTC-9"},g={ET:"UTC-5",EST:"UTC-5",EDT:"UTC-4",CT:"UTC-6",CST:"UTC-6",CDT:"UTC-5",MT:"UTC-7",MST:"UTC-7",MDT:"UTC-6",PT:"UTC-8",PST:"UTC-8",PDT:"UTC-7",AT:"UTC-9",AKT:"UTC-9",AKST:"UTC-9",AKDT:"UTC-8",HT:"UTC-10",HST:"UTC-10",HAST:"UTC-9"},r={2024:{summer:17100288e5,winter:173059194e4},2025:{summer:17414784e5,winter:176204154e4},2026:{summer:1772928e6,winter:179349114e4},2027:{summer:18049824e5,winter:182554554e4}}},546:(M,C,e)=>{e.d(C,{o:()=>g});var t=e(1135),h=e(8256);let g=(()=>{class r{constructor(){this.messageSource=new t.X(null),this.currentMessage=this.messageSource.asObservable()}changeMessage(o){this.messageSource.next(o)}}return r.\u0275fac=function(o){return new(o||r)},r.\u0275prov=h.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"}),r})()},6994:(M,C,e)=>{e.d(C,{t:()=>r});var t=e(7579),h=e(1135),g=e(8256);let r=(()=>{class c{constructor(){this.editDataDetails=[],this.subject=new t.x,this.messageSource=new h.X(this.editDataDetails),this.currentMessage=this.messageSource.asObservable()}changeMessage(l){this.messageSource.next(l)}destroyMessage(){this.messageSource.next("")}}return c.\u0275fac=function(l){return new(l||c)},c.\u0275prov=g.Yz7({token:c,factory:c.\u0275fac,providedIn:"root"}),c})()},7278:(M,C,e)=>{e.d(C,{t:()=>r});var t=e(8924),h=e(8256),g=e(849);let r=(()=>{class c{constructor(l){this.storage=l}generateString(l){const u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let d=" ";const p=u.length;for(let v=0;v<l;v++)d+=u.charAt(Math.floor(Math.random()*p));return d}validateForm(l){let u=!0;for(const d in l)u=u&&l[d];return u}uuidv4(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(l){const u=16*Math.random()|0;return("x"==l?u:3&u|8).toString(16)})}msToTime(l){let u=Math.floor(l/1e3%60),d=Math.floor(l/6e4%60),p=Math.floor(l/36e5);return p=p<10?"0"+p:p,d=d<10?"0"+d:d,u=u<10?"0"+u:u,p+"h "+d+"min "+u+"s"}checkSeason(){return(new Date).getTime()>=t.Rk[(new Date).getFullYear().toString()].summer&&(new Date).getTime()<t.Rk[(new Date).getFullYear().toString()].winter?t.Eb:t.bm}getEldLocation(l){return l.split(",").map(u=>parseFloat(u))}}return c.\u0275fac=function(l){return new(l||c)(h.LFG(g.K))},c.\u0275prov=h.Yz7({token:c,factory:c.\u0275fac,providedIn:"root"}),c})()},6321:(M,C,e)=>{e.d(C,{Jk:()=>h,bO:()=>g,mK:()=>t});const t=["Air Compressor","Battery","Body","Brake Accessories","Coupling Devices","Drive Line","Exhaust","Fluid Levels","Front Axle","Headlights","Horn","Muffler","Parking Breaks","Reflectors","Service Breaks","Starter","Suspension System","Tire Chains","Transmission","Turn Indicators","Windows","Wipers & Washers","Air Lines","Belts & Hoses","Clutch","Defroster","Engine","Fifth Wheel","Frame & Assembly","Fuel Tanks","Heater","Mirrors","Oil Level","Radiator Level","Safety Equipment","Service Door","Steering","Tail Lights","Tires","Trip Recorder","Wheels & Rims","Windshield"],h=["Brake Connections","Coupling Devices","Doors","Landing Gear","Other","Roof","Suspension System","Wheels & Rims","Breaks","Coupling Pin","Hitch","Lights","Reflectors","Straps","Tarpaulin"],g=[{code:"VCS",name:"Vehicle Condition Satisfactory"},{code:"D",name:"Has Defects"},{code:"DC",name:"Defects Corrected"},{code:"DNNBC",name:"Defects Need Not Be Corrected"}]}}]);