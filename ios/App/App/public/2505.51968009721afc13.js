"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2505,4546],{4546:(x,h,o)=>{o.d(h,{y:()=>c});var v=o(6895),f=o(4006),d=o(6114),g=o(8256);let c=(()=>{class s{}return s.\u0275fac=function(m){return new(m||s)},s.\u0275mod=g.oAB({type:s}),s.\u0275inj=g.cJS({imports:[v.ez,f.u5,d.Pc]}),s})()},8924:(x,h,o)=>{o.d(h,{EQ:()=>f});const f={ET:"UTC-4",CT:"UTC-5",MT:"UTC-6",PT:"UTC-7",AT:"UTC-8",HT:"UTC-10"}},2505:(x,h,o)=>{o.r(h),o.d(h,{OthersPageModule:()=>z});var v=o(6895),f=o(4006),d=o(6114),g=o(5050),c=o(5861),s=o(3905),a=o(4128),m=o(8924),t=o(8256),_=o(4382),b=o(9386),P=o(7219),M=o(849),E=o(7278),k=o(3646);function Z(n,p){if(1&n){const e=t.EpF();t.TgZ(0,"div",23),t.NdJ("click",function(){t.CHM(e);const i=t.oxw(2);return t.KtG(i.toggleCheck())}),t._UZ(1,"ion-checkbox",24),t.TgZ(2,"div",25),t._uU(3,"Remember me next time"),t.qZA()()}if(2&n){const e=t.oxw(2);t.xp6(1),t.Q6J("checked",e.autoLogin)}}function S(n,p){1&n&&(t.TgZ(0,"span"),t._uU(1,"Log Out"),t.qZA())}function U(n,p){1&n&&t._UZ(0,"ion-spinner",29)}const y=function(n){return{"disable-click":n}};function I(n,p){if(1&n){const e=t.EpF();t.TgZ(0,"div",26),t.NdJ("click",function(){t.CHM(e);const i=t.oxw(2);return t.KtG(i.onLogoutClick())}),t.YNc(1,S,2,0,"span",27),t.YNc(2,U,1,0,"ion-spinner",28),t.qZA()}if(2&n){const e=t.oxw(2);t.Q6J("ngClass",t.VKq(3,y,e.loading)),t.xp6(1),t.Q6J("ngIf",!e.loading),t.xp6(1),t.Q6J("ngIf",e.loading)}}function L(n,p){if(1&n){const e=t.EpF();t.TgZ(0,"div",30),t.NdJ("click",function(){t.CHM(e);const i=t.oxw(2);return t.KtG(i.goSwitchStatus())}),t._uU(1,"Switch status"),t.qZA()}}const A=function(n){return{"label-error":n}},w=function(n){return{"submit-buttons-error":n}};function D(n,p){if(1&n){const e=t.EpF();t.TgZ(0,"div",14)(1,"div",15),t._uU(2),t.qZA(),t.TgZ(3,"div",16),t._uU(4),t.TgZ(5,"span",17),t._uU(6),t.qZA()(),t.YNc(7,Z,4,1,"div",18),t.qZA(),t.TgZ(8,"div",19)(9,"div",20),t.NdJ("click",function(){t.CHM(e);const i=t.oxw();return t.KtG(i.closeModal())}),t._uU(10,"Cancel"),t.qZA(),t.YNc(11,I,3,5,"div",21),t.YNc(12,L,2,0,"div",22),t.qZA()}if(2&n){const e=t.oxw();t.xp6(2),t.Oqu(e.isForbidden(e.lastStatusCode)?"Unable to log out":"Log Out"),t.xp6(2),t.hij(" ","Your current status: ",""),t.xp6(1),t.Q6J("ngClass",t.VKq(9,A,e.isForbidden(e.lastStatusCode))),t.xp6(1),t.Oqu(e.statusList[e.lastStatusCode]),t.xp6(1),t.Q6J("ngIf",!e.isForbidden(e.lastStatusCode)),t.xp6(1),t.Q6J("ngClass",t.VKq(11,w,e.isForbidden(e.lastStatusCode))),t.xp6(1),t.Q6J("ngClass",t.VKq(13,y,e.loading)),t.xp6(2),t.Q6J("ngIf",!e.isForbidden(e.lastStatusCode)),t.xp6(1),t.Q6J("ngIf",e.isForbidden(e.lastStatusCode))}}const F=[{path:"",component:(()=>{class n{constructor(e,r,i,u,l,T){this.navCtrl=e,this.databaseService=r,this.dashboardService=i,this.internetService=u,this.storage=l,this.utilityService=T,this.logEvents=[],this.networkStatus=!1,this.TimeZoneCity="",this.vehicleId="",this.driverId="",this.companyId="",this.bReady=!1,this.isModalOpen=!1,this.lastStatusCode="",this.autoLogin=!0,this.loading=!1,this.statusList={OFF:"Off Duty",SB:"Sleeper Berth",ON:"On Duty",D:"Driving",PC:"Personal Conveyance",YM:"Yard Moves"},this.forbiddenStatuses=["ON","D","PC","YM"]}ngOnInit(){}ionViewWillEnter(){var e=this;return(0,c.Z)(function*(){console.log("ohters page");let r=e.storage.get("vehicleId"),i=e.storage.get("driverId"),u=e.storage.get("companyId"),l=e.storage.get("TimeZoneCity"),T=e.storage.get("bAuthorized"),K=e.storage.get("lastStatusCode"),B=e.storage.get("autoLogin"),R=(0,s.z)(e.databaseService.getLogEvents());(0,a.D)([r,i,u,l,T,K,B,R]).subscribe(([C,H,Q,Y,V,W,O,G])=>{e.vehicleId=C,e.driverId=H,e.companyId=Q,e.TimeZoneCity=Y,e.bAuthorized=V,e.lastStatusCode=W,null!=O&&(e.autoLogin=O),e.logEvents=G}),e.networkSub=e.internetService.internetStatus$.subscribe(C=>{e.networkStatus=C,console.log("Intenet Status"+C)})})()}onVehicleClick(){localStorage.setItem("showBackButton",JSON.stringify(!0)),this.navCtrl.navigateForward("/select-vehicle")}onCoDriverClick(){this.navCtrl.navigateForward("/co-driver")}onAccountClick(){this.navCtrl.navigateForward("/account")}onRulesClick(){this.navCtrl.navigateForward("/rules")}onInformationClick(){this.navCtrl.navigateForward("/information")}logoutConfirm(){this.isModalOpen=!0}onLogoutClick(){var e=this;return(0,c.Z)(function*(){if(!0===e.bAuthorized){e.loading=!0;const r=e.logEvents[e.logEvents.length-1];r&&(r.eventTime.timeStampEnd=new Date((0,v.p6)(new Date,"yyyy-MM-ddTHH:mm:ss","en_US",m.EQ[e.TimeZoneCity])).getTime());let i={logEventId:e.utilityService.uuidv4(),companyId:"",driverId:e.driverId,eventTime:{logDate:(0,v.p6)(new Date,"yyyy-MM-ddTHH:mm:ss","en_US",m.EQ[e.TimeZoneCity]),timeStamp:(new Date).getTime(),timeStampEnd:(new Date).getTime(),timeZone:""},vehicle:{vehicleId:e.vehicleId},location:{locationType:"AUTOMATIC",description:"2mi from Chisinau, Chisinau",latitude:0,longitude:0},sequenceNumber:r?r.sequenceNumber+1:1,type:{name:"Logout",code:"LOGOUT"},recordStatus:{name:"Driver",code:"DRIVER"},recordOrigin:{name:"Active",code:"ACTIVE"},odometer:0,engineHours:0,malfunction:!1,dataDiagnosticEvent:!1,certificationDate:"",comment:"",eventDataCheck:"",inspection:!1};e.storage.set("bAuthorized",!1),e.storage.set("autoLogin",e.autoLogin),yield e.updateLogEvents(i,!1),yield e.dashboardService.updateLogEvent(i).toPromise().then(function(){var u=(0,c.Z)(function*(l){console.log("Login LogEvents got updated on the server: ",l),yield e.updateIndexLogEvents(i,!0)});return function(l){return u.apply(this,arguments)}}()).catch(function(){var u=(0,c.Z)(function*(l){console.log("Internet Status: "+e.networkStatus),console.log("Login LogEvent in offline logEvents array")});return function(l){return u.apply(this,arguments)}}()),yield e.updateIndexLogEvents(r,!1),yield e.dashboardService.updateLogEvent(r).toPromise().then(function(){var u=(0,c.Z)(function*(l){console.log("Second Last LogEvent is updated on server:",l),yield e.updateIndexLogEvents(r,!0)});return function(l){return u.apply(this,arguments)}}()).catch(function(){var u=(0,c.Z)(function*(l){console.log("Internet Status: "+e.networkStatus),console.log("Second Last LogEvent Pushed in offline logEvents array")});return function(l){return u.apply(this,arguments)}}())}e.loading=!1,e.storage.remove("accessToken"),e.storage.remove("pickedVehicle"),e.isModalOpen=!1,setTimeout(()=>e.navCtrl.navigateForward("/login",{replaceUrl:!0}),0)})()}toggleCheck(){this.autoLogin=!this.autoLogin}isForbidden(e){return this.forbiddenStatuses.includes(e)}updateLogEvents(e,r){var i=this;return(0,c.Z)(function*(){e.sent=r,i.logEvents.push(e),yield i.storage.set("logEvents",i.logEvents)})()}updateIndexLogEvents(e,r){var i=this;return(0,c.Z)(function*(){e.sent=r;const u=i.logEvents.findIndex(l=>l.logEventId===e.logEventId);-1!==u&&(i.logEvents[u]=e),yield i.storage.set("logEvents",i.logEvents)})()}goSwitchStatus(){this.isModalOpen=!1,setTimeout(()=>this.navCtrl.navigateBack("unitab/hos"),0)}closeModal(){this.isModalOpen=!1}ionViewWillLeave(){this.databaseSubscription&&this.databaseSubscription.unsubscribe(),this.networkSub.unsubscribe()}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(d.SH),t.Y36(_.k),t.Y36(b.s),t.Y36(P.W),t.Y36(M.K),t.Y36(E.t))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-others"]],decls:32,vars:3,consts:[[3,"forceOverscroll"],[3,"title"],[1,"edit-form","padding-g"],[1,"other-items"],[1,"other-item",3,"click"],["src","assets/icon/truck.svg","alt","vehicle"],[1,"text-14-600"],["src","assets/icon/co-driver.svg","alt","co-driver"],["src","assets/icon/my-account.svg","alt","my account"],["src","assets/icon/rules.svg","alt","rules"],["src","assets/icon/information.svg","alt","information"],["src","assets/icon/logout.svg","alt","logout"],["id","trigger-log-out-modal",1,"text-14-600"],["id","custom-modal","trigger","trigger-log-out-modal",3,"isOpen"],[1,"modal-box"],[1,"modal-title"],[1,"modal-status"],[2,"font-size","16px","font-weight","600",3,"ngClass"],["class","autologin-checkbox",3,"click",4,"ngIf"],[1,"submit-buttons",3,"ngClass"],[1,"action-button","default",3,"ngClass","click"],["class","action-button primary",3,"ngClass","click",4,"ngIf"],["class","action-button error",3,"click",4,"ngIf"],[1,"autologin-checkbox",3,"click"],[3,"checked"],[1,"autologin-checkbox-label"],[1,"action-button","primary",3,"ngClass","click"],[4,"ngIf"],["name","circular","color","light","class","spinner",4,"ngIf"],["name","circular","color","light",1,"spinner"],[1,"action-button","error",3,"click"]],template:function(e,r){1&e&&(t.TgZ(0,"ion-content",0),t._UZ(1,"app-header",1),t.TgZ(2,"div",2)(3,"div",3)(4,"div",4),t.NdJ("click",function(){return r.onVehicleClick()}),t._UZ(5,"img",5),t.TgZ(6,"p",6),t._uU(7,"Vehicle"),t.qZA()(),t.TgZ(8,"div",4),t.NdJ("click",function(){return r.onCoDriverClick()}),t._UZ(9,"img",7),t.TgZ(10,"p",6),t._uU(11,"Co-Driver"),t.qZA()()(),t.TgZ(12,"div",3)(13,"div",4),t.NdJ("click",function(){return r.onAccountClick()}),t._UZ(14,"img",8),t.TgZ(15,"p",6),t._uU(16,"My Account"),t.qZA()(),t.TgZ(17,"div",4),t.NdJ("click",function(){return r.onRulesClick()}),t._UZ(18,"img",9),t.TgZ(19,"p",6),t._uU(20,"Rules"),t.qZA()()(),t.TgZ(21,"div",3)(22,"div",4),t.NdJ("click",function(){return r.onInformationClick()}),t._UZ(23,"img",10),t.TgZ(24,"p",6),t._uU(25,"Information"),t.qZA()(),t.TgZ(26,"div",4),t.NdJ("click",function(){return r.logoutConfirm()}),t._UZ(27,"img",11),t.TgZ(28,"p",12),t._uU(29,"Logout"),t.qZA()()()(),t.TgZ(30,"ion-modal",13),t.YNc(31,D,13,15,"ng-template"),t.qZA()()),2&e&&(t.Q6J("forceOverscroll",!1),t.xp6(1),t.Q6J("title","Others"),t.xp6(29),t.Q6J("isOpen",r.isModalOpen))},dependencies:[v.mk,v.O5,d.nz,d.W2,d.PQ,d.ki,d.w,k.G],styles:[".other-items[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;gap:20px}.other-items[_ngcontent-%COMP%]   .other-item[_ngcontent-%COMP%]{flex-grow:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;background-color:var(--gray-100);height:100px;max-width:calc(50% - 10px);border-radius:20px;padding:20px}.edit-form[_ngcontent-%COMP%]{gap:20px}ion-modal#custom-modal[_ngcontent-%COMP%]{--width: fit-content;--min-width: 80%;--max-height: 100%;--overflow: hidden;--height: fit-content;--border-radius: 10px;--box-shadow: 0 28px 48px rgba(0, 0, 0, .4);pointer-events:none}.submit-buttons[_ngcontent-%COMP%]{display:flex;align-items:center;gap:5px;width:100%;padding:15px 20px 20px}.submit-buttons[_ngcontent-%COMP%]   .action-button[_ngcontent-%COMP%]{flex:1;font-size:15px;display:flex;justify-content:center;align-items:center;height:38px;padding:10px;border-radius:50px;cursor:pointer}.submit-buttons-error[_ngcontent-%COMP%]{padding-top:25px}.modal-box[_ngcontent-%COMP%]{padding:20px 20px 0;display:flex;flex-direction:column;gap:10px}.modal-title[_ngcontent-%COMP%]{font-size:18px;font-weight:600}.modal-status[_ngcontent-%COMP%]{font-size:15px}.default[_ngcontent-%COMP%]{color:var(--gray-500);background-color:var(--gray-100)}.primary[_ngcontent-%COMP%]{color:var(--gray-25);background-color:var(--primary-600)}.error[_ngcontent-%COMP%]{color:var(--gray-25);background-color:var(--error-600);font-weight:600}.label-error[_ngcontent-%COMP%]{color:var(--error-600)}.autologin-checkbox[_ngcontent-%COMP%]{width:-moz-fit-content;width:fit-content;display:flex;align-items:center;gap:10px;margin-top:15px}.autologin-checkbox[_ngcontent-%COMP%]   .autologin-checkbox-label[_ngcontent-%COMP%]{font-size:15px}.spinner[_ngcontent-%COMP%]{transform:scale(.7)}ion-checkbox[_ngcontent-%COMP%]{--size: 16px;--checkbox-background-checked: var(--success-500);--border-color: var(--gray-200);--checkbox-background: var(--gray-100);--border-color-checked: transparent;--checkmark-width: 2px;pointer-events:none}ion-checkbox[_ngcontent-%COMP%]::part(container){border-radius:50%}"]}),n})()}];let J=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[g.Bz.forChild(F),g.Bz]}),n})();var N=o(4546);let z=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[v.ez,f.u5,d.Pc,J,N.y]}),n})()},7278:(x,h,o)=>{o.d(h,{t:()=>d});var v=o(8256),f=o(849);let d=(()=>{class g{constructor(s){this.storage=s}generateString(s){const a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let m=" ";const t=a.length;for(let _=0;_<s;_++)m+=a.charAt(Math.floor(Math.random()*t));return m}validateForm(s){let a=!0;for(const m in s)a=a&&s[m];return a}uuidv4(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(s){const a=16*Math.random()|0;return("x"==s?a:3&a|8).toString(16)})}}return g.\u0275fac=function(s){return new(s||g)(v.LFG(f.K))},g.\u0275prov=v.Yz7({token:g,factory:g.\u0275fac,providedIn:"root"}),g})()},3905:(x,h,o)=>{o.d(h,{z:()=>d});var v=o(6805),f=o(2961);function d(g,c){const s="object"==typeof c;return new Promise((a,m)=>{const t=new f.Hp({next:_=>{a(_),t.unsubscribe()},error:m,complete:()=>{s?a(c.defaultValue):m(new v.K)}});g.subscribe(t)})}}}]);