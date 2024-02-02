"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5605],{2187:(f,h,i)=>{i.d(h,{a:()=>_});var t=i(8256),d=i(4465),p=i(6994),c=i(6895),u=i(4006);const o=function(n,s,e,l){return{"label-error":n,"input-label-top":s,"input-label-left":e,"no-label":l}};function r(n,s){if(1&n&&(t.TgZ(0,"div",3),t._uU(1),t.qZA()),2&n){const e=t.oxw();t.Q6J("ngClass",t.l5B(3,o,!e.valid,"top"===e.labelPosition,"left"===e.labelPosition,"none"===e.label)),t.xp6(1),t.AsE(" ",e.label,"",e.required?"*":""," ")}}const g=function(n,s){return{"custom-input-top":n,"custom-input-left":s}},a=function(n,s,e){return{"input-fill":n,"validation-error":s,"input-left":e}};let _=(()=>{class n{constructor(e,l){this.toastService=e,this.shareService=l,this.type="text",this.placeholder="",this.fill=!0,this.validators=[],this.noValidation=!1,this.disabled=!1,this.required=!1,this.labelPosition="top",this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0}get value(){return this._value}set value(e){this._value!==e&&(this._value=e,this.valueChange.emit(e))}get validation(){return this._validation}set validation(e){this._validation!==e&&(this._validation=e,this.validationChange.emit(e))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(e=>{"reset"===e?this.valid=!0:e&&0!==e.length&&this.validateInput()})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(e){0!==e.target.value&&(this.valid=!0),this.value=e.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(e=>!!e.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(e.message),!1)),this.validation=this.valid)}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(d.k),t.Y36(p.t))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-input"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",validators:"validators",noValidation:"noValidation",disabled:"disabled",required:"required",labelPosition:"labelPosition",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:14,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],["autocomplete","one-time-code",1,"input-box",3,"type","ngModel","disabled","placeholder","ngClass","input","ngModelChange"],[1,"input-label",3,"ngClass"]],template:function(e,l){1&e&&(t.TgZ(0,"div",0),t.YNc(1,r,2,8,"div",1),t.TgZ(2,"input",2),t.NdJ("input",function(m){return l.onInputChange(m)})("ngModelChange",function(m){return l.value=m}),t.qZA()()),2&e&&(t.Q6J("ngClass",t.WLB(7,g,"top"===l.labelPosition,"left"===l.labelPosition)),t.xp6(1),t.Q6J("ngIf",l.label),t.xp6(1),t.Q6J("type",l.type)("ngModel",l.value)("disabled",l.disabled)("placeholder",l.placeholder)("ngClass",t.kEZ(10,a,l.fill,!l.valid,"left"===l.labelPosition)))},dependencies:[c.mk,c.O5,u.Fj,u.JJ,u.On],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:500}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{width:100%;height:45px;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;border:1px solid var(--gray-200);background-color:#fff}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}.no-label[_ngcontent-%COMP%]{color:transparent!important}"]}),n})()},4166:(f,h,i)=>{i.d(h,{v:()=>u});var t=i(6895),d=i(4006),p=i(7151),c=i(8256);let u=(()=>{class o{}return o.\u0275fac=function(g){return new(g||o)},o.\u0275mod=c.oAB({type:o}),o.\u0275inj=c.cJS({imports:[t.ez,d.u5,p.Pc]}),o})()},1585:(f,h,i)=>{i.d(h,{M:()=>_});var t=i(8256),d=i(6895),p=i(7151);const c=function(n,s,e){return{"label-error":n,"input-label-top":s,"input-label-left":e}};function u(n,s){if(1&n&&(t.TgZ(0,"div",6),t._uU(1),t.qZA()),2&n){const e=t.oxw();t.Q6J("ngClass",t.kEZ(3,c,!e.valid,"top"===e.labelPosition,"left"===e.labelPosition)),t.xp6(1),t.AsE(" ",e.label,"",e.required?"*":""," ")}}function o(n,s){if(1&n){const e=t.EpF();t.TgZ(0,"div",12),t.NdJ("click",function(){const v=t.CHM(e),m=v.$implicit,C=v.index,M=t.oxw(2);return t.KtG(M.triggerCheck(m,C))}),t.TgZ(1,"div",13),t._uU(2),t.qZA(),t.TgZ(3,"div",14),t._UZ(4,"ion-checkbox",15),t.qZA()()}if(2&n){const e=s.$implicit;t.xp6(2),t.Oqu(e.value),t.xp6(2),t.Q6J("checked",e.checked)}}function r(n,s){if(1&n){const e=t.EpF();t.TgZ(0,"div",7),t.YNc(1,o,5,2,"div",8),t.qZA(),t.TgZ(2,"div",9)(3,"div",10),t.NdJ("click",function(){t.CHM(e);const v=t.oxw();return t.KtG(v.closeModal())}),t._uU(4,"Cancel"),t.qZA(),t.TgZ(5,"div",11),t.NdJ("click",function(){t.CHM(e);const v=t.oxw();return t.KtG(v.submit())}),t._uU(6,"Submit"),t.qZA()()}if(2&n){const e=t.oxw();t.xp6(1),t.Q6J("ngForOf",e.optionsCheck)}}const g=function(n,s){return{"custom-input-top":n,"custom-input-left":s}},a=function(n,s,e){return{"input-fill":n,"validation-error":s,"input-left":e}};let _=(()=>{class n{constructor(){this.fill=!0,this.validators=[],this.noValidation=!1,this.required=!1,this.labelPosition="top",this.changeDetection=new t.vpe,this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0,this.isModalOpen=!1,this.optionsCheck=[],this.lastStatus=[]}get value(){return this._value}set value(e){this._value!==e&&(this._value=e,this.valueChange.emit(e),this.changeDetection.emit(e))}get validation(){return this._validation}set validation(e){this._validation!==e&&(this._validation=e,this.validationChange.emit(e))}ngOnInit(){if(this.optionsCheck=this.options.map(e=>({value:e,checked:!1})),this._value&&0!==this._value.length){const e=this._value.split(", ");this.optionsCheck.forEach(l=>e.forEach(v=>l.value===v?l.checked=!0:null))}this.lastStatus=this.cloneArray(this.optionsCheck)}triggerCheck(e,l){const v=this.optionsCheck.find(m=>m.value===e.value);v.checked=!v.checked}openModal(){this.isModalOpen=!0}closeModal(){this.isModalOpen=!1,this.optionsCheck=this.cloneArray(this.lastStatus)}submit(){let e=[];this.optionsCheck.forEach(l=>!0===l.checked?e.push(l.value):null),this.value=e.join(", "),this.lastStatus=this.cloneArray(this.optionsCheck),this.isModalOpen=!1}cloneArray(e){return JSON.parse(JSON.stringify(e))}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-multiple-select"]],inputs:{label:"label",fill:"fill",validators:"validators",noValidation:"noValidation",required:"required",labelPosition:"labelPosition",options:"options",value:"value",validation:"validation"},outputs:{changeDetection:"changeDetection",valueChange:"valueChange",validationChange:"validationChange"},decls:8,vars:12,consts:[[1,"custom-input",3,"ngClass"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-box",3,"ngClass","click"],[1,"input-box-value"],["src","assets/icon/bottom-arrow-18.svg"],["id","custom-modal",3,"isOpen"],[1,"input-label",3,"ngClass"],["id","optionBox",1,"option-box"],["class","select-option",3,"click",4,"ngFor","ngForOf"],[1,"submit-buttons"],[1,"action-button","default",3,"click"],[1,"action-button","primary",3,"click"],[1,"select-option",3,"click"],[1,"select-value"],[1,"select-icon"],[3,"checked"]],template:function(e,l){1&e&&(t.TgZ(0,"div",0),t.YNc(1,u,2,7,"div",1),t.TgZ(2,"div",2),t.NdJ("click",function(){return l.openModal()}),t.TgZ(3,"div",3),t._uU(4),t.qZA(),t._UZ(5,"img",4),t.qZA(),t.TgZ(6,"ion-modal",5),t.YNc(7,r,7,1,"ng-template"),t.qZA()()),2&e&&(t.Q6J("ngClass",t.WLB(5,g,"top"===l.labelPosition,"left"===l.labelPosition)),t.xp6(1),t.Q6J("ngIf",l.label),t.xp6(1),t.Q6J("ngClass",t.kEZ(8,a,l.fill,!l.valid,"left"===l.labelPosition)),t.xp6(2),t.Oqu(l.value||"No option selected"),t.xp6(2),t.Q6J("isOpen",l.isModalOpen))},dependencies:[d.mk,d.sg,d.O5,p.nz,p.ki,p.w],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content}.custom-input-top[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.custom-input-left[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px}.input-label[_ngcontent-%COMP%]{color:var(--gray-500)}.input-label-top[_ngcontent-%COMP%]{font-size:14px;font-weight:500}.input-label-left[_ngcontent-%COMP%]{flex:1;font-size:15px;font-weight:600}.input-box[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:15px;width:100%;height:45px;border-radius:10px;padding:10px 15px;font-size:14px;font-weight:400;color:var(--gray-500);border:1px solid var(--gray-200);background-position:right 15px center}.input-box[_ngcontent-%COMP%]   .input-box-value[_ngcontent-%COMP%]{flex:1 calc(92% - 15px);box-sizing:border-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.input-box[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{flex:1 8%;width:18px;height:18px}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)}.input-left[_ngcontent-%COMP%]{flex:1}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}ion-modal#custom-modal[_ngcontent-%COMP%]{--width: fit-content;--min-width: 80%;--max-height: 70%;--overflow: hidden;--height: fit-content;--border-radius: 10px;--box-shadow: 0 28px 48px rgba(0, 0, 0, .4)}.option-box[_ngcontent-%COMP%]{display:flex;flex-direction:column;width:100%;padding:10px 0;overflow:auto;max-height:500px}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]{width:100%;display:flex;justify-content:space-between;align-items:center;padding:12px 20px;transition:all .2s}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]:active{background-color:var(--gray-100)}.option-box[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]   .select-icon[_ngcontent-%COMP%]{display:flex;align-items:center}ion-checkbox[_ngcontent-%COMP%]{--size: 20px;--checkbox-background-checked: var(--success-500);--border-color: var(--gray-200);--checkbox-background: var(--gray-100);--border-color-checked: transparent;--checkmark-width: 2px;pointer-events:none}ion-checkbox[_ngcontent-%COMP%]::part(container){border-radius:50%}.submit-buttons[_ngcontent-%COMP%]{display:flex;align-items:center;gap:5px;width:100%;padding:10px 20px;border-top:1px solid var(--gray-100)}.submit-buttons[_ngcontent-%COMP%]   .action-button[_ngcontent-%COMP%]{flex:1;font-size:15px;display:flex;justify-content:center;align-items:center;padding:10px;border-radius:50px;cursor:pointer}.default[_ngcontent-%COMP%]{color:var(--gray-500);background-color:var(--gray-100)}.primary[_ngcontent-%COMP%]{color:var(--gray-25);background-color:var(--primary-600)}@media screen and (max-height: 799px){.option-box[_ngcontent-%COMP%]{max-height:400px}}@media screen and (max-height: 659px){.option-box[_ngcontent-%COMP%]{max-height:350px}}"]}),n})()},6330:(f,h,i)=>{i.d(h,{_:()=>u});var t=i(6895),d=i(4006),p=i(7151),c=i(8256);let u=(()=>{class o{}return o.\u0275fac=function(g){return new(g||o)},o.\u0275mod=c.oAB({type:o}),o.\u0275inj=c.cJS({imports:[t.ez,d.u5,p.Pc]}),o})()},8546:(f,h,i)=>{i.d(h,{w:()=>u});var t=i(6895),d=i(4006),p=i(7151),c=i(8256);let u=(()=>{class o{}return o.\u0275fac=function(g){return new(g||o)},o.\u0275mod=c.oAB({type:o}),o.\u0275inj=c.cJS({imports:[t.ez,d.u5,p.Pc]}),o})()},9534:(f,h,i)=>{i.d(h,{D:()=>o});var t=i(8256),d=i(6895),p=i(7151);const c=function(r){return{"disable-option":r}};function u(r,g){if(1&r){const a=t.EpF();t.TgZ(0,"div",3),t.NdJ("click",function(){const s=t.CHM(a).$implicit,e=t.oxw();return t.KtG(e.select(s))}),t.TgZ(1,"div",4)(2,"div",5),t._UZ(3,"img",6),t.qZA(),t.TgZ(4,"div",7),t._uU(5),t.qZA()(),t.TgZ(6,"div",8),t._UZ(7,"ion-checkbox",9),t.qZA()()}if(2&r){const a=g.$implicit,_=t.oxw();t.Q6J("ngClass",t.VKq(5,c,("VCS"===a.value||"D"===a.value)&&_.disableOption&&_.half||"VCS"===a.value&&_.disableOption&&!_.half)),t.xp6(3),t.Q6J("src","success"===a.icon?"assets/icon/shield-tick.svg":"assets/icon/shield-cross.svg",t.LSH),t.xp6(1),t.Q6J("ngClass",a.icon),t.xp6(1),t.Oqu(a.label),t.xp6(2),t.Q6J("checked",a.checked)}}let o=(()=>{class r{constructor(){this.data=[{icon:"success",label:"Vehicle Condition Satisfactory",value:"VCS",checked:!1},{icon:"error",label:"Has Defects",value:"D",checked:!1},{icon:"success",label:"Defects Corrected",value:"DC",checked:!1},{icon:"error",label:"Defects Need Not Be Corrected",value:"DNNBC",checked:!1}],this.dataHalf=[{icon:"success",label:"Vehicle Condition Satisfactory",value:"VCS",checked:!1},{icon:"error",label:"Has Defects",value:"D",checked:!1}],this.half=!1,this.disableOption=!1,this.selectedValue=new t.vpe,this.valueChange=new t.vpe}get value(){return this._value}set value(a){this._value!==a&&(this._value=a,this.changeCurrentValue(),this.valueChange.emit(a))}ngOnInit(){this.changeCurrentValue()}changeCurrentValue(){if(0!==this._value.length){let a=this.data.find(_=>_.value===this._value);this.select(a)}}select(a){let _=this.data.findIndex(s=>s.value===a.value),n=[];n=this.half?this.dataHalf:this.data,n.forEach(s=>s.checked=!1),n[_].checked=!0,this.selectedValue.emit(n[_].value)}}return r.\u0275fac=function(a){return new(a||r)},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-status-radio-button"]],inputs:{half:"half",disableOption:"disableOption",value:"value"},outputs:{selectedValue:"selectedValue",valueChange:"valueChange"},decls:4,vars:1,consts:[[1,"status-title"],[1,"list-container"],["class","list-item",3,"ngClass","click",4,"ngFor","ngForOf"],[1,"list-item",3,"ngClass","click"],[1,"item-data"],[1,"status-icon"],[3,"src"],[1,"status-label",3,"ngClass"],[1,"item-checkbox"],[3,"checked"]],template:function(a,_){1&a&&(t.TgZ(0,"div",0),t._uU(1,"Status"),t.qZA(),t.TgZ(2,"div",1),t.YNc(3,u,8,7,"div",2),t.qZA()),2&a&&(t.xp6(3),t.Q6J("ngForOf",_.half?_.dataHalf:_.data))},dependencies:[d.mk,d.sg,p.nz,p.w],styles:[".list-container[_ngcontent-%COMP%]{width:100%;display:flex;flex-direction:column;gap:10px}.list-item[_ngcontent-%COMP%]{width:100%;border:none;border-radius:10px;background-color:var(--gray-100);padding:15px;display:flex;align-items:center;justify-content:space-between}.item-data[_ngcontent-%COMP%]{display:flex;align-items:center;gap:5px}.status-icon[_ngcontent-%COMP%]{width:24px;height:24px}.status-label[_ngcontent-%COMP%]{font-size:16px;font-weight:600;color:var(--gray-500)}.item-checkbox[_ngcontent-%COMP%]{display:flex;align-items:center}ion-checkbox[_ngcontent-%COMP%]{--size: 20px;--checkbox-background-checked: var(--success-500);--border-color: transparent;--border-color-checked: transparent;--checkmark-width: 2px}ion-checkbox[_ngcontent-%COMP%]::part(container){border-radius:50%}.success[_ngcontent-%COMP%]{color:var(--success-500)}.error[_ngcontent-%COMP%]{color:var(--error-500)}.status-title[_ngcontent-%COMP%]{font-size:15px;font-weight:500;color:var(--gray-500);margin-bottom:5px}.disable-option[_ngcontent-%COMP%]{pointer-events:none}"]}),r})()},7484:(f,h,i)=>{i.d(h,{T:()=>u});var t=i(6895),d=i(4006),p=i(7151),c=i(8256);let u=(()=>{class o{}return o.\u0275fac=function(g){return new(g||o)},o.\u0275mod=c.oAB({type:o}),o.\u0275inj=c.cJS({imports:[t.ez,d.u5,p.Pc]}),o})()},4081:(f,h,i)=>{i.d(h,{R:()=>g});var t=i(8256),d=i(4465),p=i(6994),c=i(6895);const u=function(a){return{"label-error":a}};function o(a,_){if(1&a&&(t.TgZ(0,"div",3),t._uU(1),t.qZA()),2&a){const n=t.oxw();t.Q6J("ngClass",t.VKq(2,u,!n.valid)),t.xp6(1),t.Oqu(n.label)}}const r=function(a,_){return{"input-fill":a,"validation-error":_}};let g=(()=>{class a{constructor(n,s){this.toastService=n,this.shareService=s,this.type="text",this.placeholder="",this.fill=!0,this.disabled=!1,this.validators=[],this.noValidation=!1,this.valueChange=new t.vpe,this.validationChange=new t.vpe,this.valid=!0}get value(){return this._value}set value(n){this._value!==n&&(this._value=n,this.valueChange.emit(n))}get validation(){return this._validation}set validation(n){this._validation!==n&&(this._validation=n,this.validationChange.emit(n))}ngOnInit(){this.validateSubscription=this.shareService.currentMessage.subscribe(n=>{"reset"===n?this.valid=!0:n&&0!==n.length&&this.validateInput()})}ngOnDestroy(){this.validateSubscription.unsubscribe()}onInputChange(n){0!==n.target.value&&(this.valid=!0),this.value=n.target.value,this.valueChange.emit(this.value)}validateInput(){this.noValidation||(0===this.value.length?(this.valid=!1,this.toastService.showToast("Field required")):this.value.length>0&&(this.valid=!0),this.value.length>=0&&0!==this.validators.length&&this.validators.every(n=>!!n.regex.test(this.value)||(this.valid=!0,this.toastService.showToast(n.message),!1)),this.validation=this.valid)}}return a.\u0275fac=function(n){return new(n||a)(t.Y36(d.k),t.Y36(p.t))},a.\u0275cmp=t.Xpm({type:a,selectors:[["app-textarea"]],inputs:{label:"label",type:"type",placeholder:"placeholder",fill:"fill",disabled:"disabled",validators:"validators",noValidation:"noValidation",value:"value",validation:"validation"},outputs:{valueChange:"valueChange",validationChange:"validationChange"},decls:3,vars:7,consts:[[1,"custom-input"],["class","input-label",3,"ngClass",4,"ngIf"],[1,"input-box",3,"disabled","placeholder","ngClass","input"],[1,"input-label",3,"ngClass"]],template:function(n,s){1&n&&(t.TgZ(0,"div",0),t.YNc(1,o,2,4,"div",1),t.TgZ(2,"textarea",2),t.NdJ("input",function(l){return s.onInputChange(l)}),t.qZA()()),2&n&&(t.xp6(1),t.Q6J("ngIf",s.label),t.xp6(1),t.Q6J("disabled",s.disabled)("placeholder",s.placeholder)("ngClass",t.WLB(4,r,s.fill,!s.valid)))},dependencies:[c.mk,c.O5],styles:[".custom-input[_ngcontent-%COMP%]{width:100%;height:-moz-fit-content;height:fit-content;display:flex;flex-direction:column;gap:5px}.input-label[_ngcontent-%COMP%]{font-size:14px;font-weight:400;color:var(--gray-500)}.input-box[_ngcontent-%COMP%]{width:100%;height:100px;resize:none;border-radius:10px;padding:15px;font-size:14px;font-weight:400;color:var(--gray-500)!important;background-color:#fff;border:1px solid var(--gray-200)}.input-box[_ngcontent-%COMP%]:focus{color:var(--gray-500)!important;outline:none;border:1px solid var(--gray-300)}.input-fill[_ngcontent-%COMP%]{border:none!important;background-color:var(--gray-100)!important}.validation-error[_ngcontent-%COMP%]{border:1px solid var(--error-600)!important}.validation-error[_ngcontent-%COMP%]:focus{border:1px solid var(--error-600)!important}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}"]}),a})()},4877:(f,h,i)=>{i.d(h,{r:()=>u});var t=i(6895),d=i(4006),p=i(7151),c=i(8256);let u=(()=>{class o{}return o.\u0275fac=function(g){return new(g||o)},o.\u0275mod=c.oAB({type:o}),o.\u0275inj=c.cJS({imports:[t.ez,d.u5,p.Pc]}),o})()},6994:(f,h,i)=>{i.d(h,{t:()=>c});var t=i(7579),d=i(1135),p=i(8256);let c=(()=>{class u{constructor(){this.editDataDetails=[],this.subject=new t.x,this.messageSource=new d.X(this.editDataDetails),this.currentMessage=this.messageSource.asObservable()}changeMessage(r){this.messageSource.next(r)}destroyMessage(){this.messageSource.next("")}}return u.\u0275fac=function(r){return new(r||u)},u.\u0275prov=p.Yz7({token:u,factory:u.\u0275fac,providedIn:"root"}),u})()},6321:(f,h,i)=>{i.d(h,{Jk:()=>d,bO:()=>p,mK:()=>t});const t=["Air Compressor","Battery","Body","Brake Accessories","Coupling Devices","Drive Line","Exhaust","Fluid Levels","Front Axle","Headlights","Horn","Muffler","Parking Breaks","Reflectors","Service Breaks","Starter","Suspension System","Tire Chains","Transmission","Turn Indicators","Windows","Wipers & Washers","Air Lines","Belts & Hoses","Clutch","Defroster","Engine","Fifth Wheel","Frame & Assembly","Fuel Tanks","Heater","Mirrors","Oil Level","Radiator Level","Safety Equipment","Service Door","Steering","Tail Lights","Tires","Trip Recorder","Wheels & Rims","Windshield"],d=["Brake Connections","Coupling Devices","Doors","Landing Gear","Other","Roof","Suspension System","Wheels & Rims","Breaks","Coupling Pin","Hitch","Lights","Reflectors","Straps","Tarpaulin"],p=[{code:"VCS",name:"Vehicle Condition Satisfactory"},{code:"D",name:"Has Defects"},{code:"DC",name:"Defects Corrected"},{code:"DNNBC",name:"Defects Need Not Be Corrected"}]}}]);