"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[503],{503:(R,h,l)=>{l.r(h),l.d(h,{InsertDvirPageModule:()=>B});var f=l(6895),n=l(4006),g=l(6114),S=l(4529),p=l(5861),y=l(4171),e=l(8256),C=l(4382),Z=l(849),T=l(9386),b=l(7219),x=l(3646);function I(i,u){if(1&i&&(e.TgZ(0,"option",32),e._uU(1),e.qZA()),2&i){const t=u.$implicit;e.Q6J("value",t),e.xp6(1),e.Oqu(t)}}function A(i,u){if(1&i&&(e.TgZ(0,"option",32),e._uU(1),e.qZA()),2&i){const t=u.$implicit;e.Q6J("value",t),e.xp6(1),e.Oqu(t)}}function k(i,u){1&i&&e._UZ(0,"img",33)}function V(i,u){1&i&&e._UZ(0,"img",34)}function P(i,u){1&i&&e._UZ(0,"img",33)}function U(i,u){1&i&&e._UZ(0,"img",34)}const N=[{path:"",component:(()=>{class i{constructor(t,r,a,c,o,s){this.databaseService=t,this.formBuilder=r,this.storage=a,this.dashboardService=c,this.internetService=o,this.navCtrl=s,this.defectsVehicle=["Air Compressor","Battery","Body","Brake Accessories","Coupling Devices","Drive Line","Exhaust","Fluid Levels","Front Axle","Headlights","Horn","Muffler","Parking Breaks","Reflectors","Service Breaks","Starter","Suspension System","Tire Chains","Transmission","Turn Indicators","Windows","Wipers & Washers","Air Lines","Belts & Hoses","Clutch","Defroster","Engine","Fifth Wheel","Frame & Assembly","Fuel Tanks","Heater","Mirrors","Oil Level","Radiator Level","Safety Equipment","Service Door","Steering","Tail Lights","Tires","Trip Recorder","Wheels & Rims","Windshield"],this.defectsTrailers=["Brake Connections","Coupling Devices","Doors","Landing Gear","Other","Roof","Suspension System","Wheels & Rims","Breaks","Coupling Pin","Hitch","Lights","Reflectors","Straps","Tarpaulin"],this.DvirStatuses1=[{StatusCode:"VCS",StatusName:"Vehicle Condition Satisfactory"},{StatusCode:"D",StatusName:"Has Defects"},{StatusCode:"DC",StatusName:"Defects Corrected"},{StatusCode:"DNNBC",StatusName:"Defects Need Not Be Corrected"}],this.DvirStatuses=[{StatusCode:"VCS",StatusName:"Vehicle Condition Satisfactory"},{StatusCode:"D",StatusName:"Has Defects"}],this.signaturePadOptions={minWidth:2,maxWidth:3,backgroundColor:"#FFFFFF",penColor:"black"},this.DvirId="",this.dvirs=[],this.bReady=!1,this.pickedVehicle="",this.vehicleId="",this.driverId="",this.statusIcon="checkmark-circle-outline",this.networkStatus=!1,this.form=this.formBuilder.group({Date:[(new Date).toISOString().slice(0,19)],Time:[(new Date).toISOString().slice(0,19)],LocationDescription:["3mi from Chisinau, Chisinau"],VehicleUnit:[""],Trailers:[""],Odometer:["0"],DefectsVehicle:[""],DefectsTrailers:[""],Remarks:[""],StatusName:["Vehicle Condition Satisfactory",n.kI.required],StatusCode:["VCS",n.kI.required],Comments:[""],Signature:["",n.kI.required]})}ngOnInit(){var t=this;return(0,p.Z)(function*(){var r,a,c;t.initSignaturePad(),t.databaseSubscription=t.databaseService.databaseReadySubject.subscribe(o=>{o&&(t.bReady=o,t.databaseService.getCompany().subscribe(s=>{t.company=s}),t.databaseService.getDvirs().subscribe(s=>{t.dvirs=s}))}),t.pickedVehicle=yield t.storage.get("pickedVehicle"),t.vehicleId=yield t.storage.get("vehicleId"),t.driverId=yield t.storage.get("driverId"),null===(r=t.form.get("DefectsVehicle"))||void 0===r||r.valueChanges.subscribe(o=>{t.updateDvirStatusCode(o,t.form.value.DefectsTrailers||[])}),null===(a=t.form.get("DefectsTrailers"))||void 0===a||a.valueChanges.subscribe(o=>{t.updateDvirStatusCode(t.form.value.DefectsVehicle||[],o)}),null===(c=t.form.get("DefectsTrailers"))||void 0===c||c.valueChanges.subscribe(o=>{const s=t.form.get("Trailers");o&&o.length>0?null==s||s.setValidators(n.kI.required):null==s||s.clearValidators(),null==s||s.updateValueAndValidity()}),t.networkSub=t.internetService.internetStatus$.subscribe(o=>{t.networkStatus=o,console.log("Intenet Status"+o)})})()}switchStatus(t){this.form.value.StatusCode=t}updateDvirStatusCode(t,r){this.form.patchValue({StatusCode:t.length>0||r.length>0?"D":"VCS"})}isStatusDisabled(t){return(this.form.value.DefectsVehicle||[]).length>0||(this.form.value.DefectsTrailers||[]).length>0?"VCS"===t:"D"===t}getCurrentDate(){return(new Date).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}getCurrentTime(){return(new Date).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0})}initSignaturePad(){const t=document.querySelector("canvas");t&&(this.signaturePad=new y.Z(t,this.signaturePadOptions),t.addEventListener("touchend",()=>{this.updateSignatureField()}))}updateSignatureField(){if(this.signaturePad&&!this.signaturePad.isEmpty()){const t=this.signaturePad.toDataURL().slice(22);this.form.patchValue({Signature:t})}else this.form.patchValue({Signature:""})}clearSignature(){this.signaturePad&&(this.signaturePad.clear(),this.form.patchValue({Signature:""}))}onSubmit(){var t=this;return(0,p.Z)(function*(){if(t.form.valid){const r=t.form.value.StatusCode,a=t.DvirStatuses.find(d=>d.StatusCode===r),c=(null==a?void 0:a.StatusName)||"",o=Array.isArray(t.form.value.DefectsVehicle)?t.form.value.DefectsVehicle.join(", "):t.form.value.DefectsVehicle||"",s=Array.isArray(t.form.value.DefectsTrailers)?t.form.value.DefectsTrailers.join(", "):t.form.value.DefectsTrailers||"",m={DVIRId:t.uuidv4(),CreateDate:(0,f.p6)(new Date,"yyyy-MM-ddTHH:mm:ss","en-US"),VehicleUnit:t.pickedVehicle,VehicleId:t.vehicleId,DriverId:t.driverId,Trailers:t.form.value.Trailers,Odometer:t.form.value.Odometer,DefectsVehicle:o,DefectsTrailers:s,Remarks:t.form.value.Remarks||"",StatusCode:r,StatusName:c,Latitude:"0",Longitude:"0",LocationDescription:t.form.value.LocationDescription,Signature:t.form.value.Signature,MechanicSignature:"",RepairDate:""};if(!0===t.networkStatus)t.dashboardService.updateDVIR(m).subscribe(d=>{console.log("DVIR is on server:",d)},function(){var d=(0,p.Z)(function*(v){console.log("Internet Status"+t.networkStatus);let O={url:"api/EldDashboard/uploadDVIR",body:m},D=yield t.storage.get("offlineArray");D.push(O),yield t.storage.set("offlineArray",D),console.log("Pushed in offlineArray")});return function(v){return d.apply(this,arguments)}}());else{let d={url:"api/EldDashboard/uploadDVIR",body:m},v=yield t.storage.get("offlineArray");v.push(d),yield t.storage.set("offlineArray",v),console.log("Pushed in offlineArray")}t.dvirs.unshift(m),yield t.storage.set("dvirs",t.dvirs),t.navCtrl.navigateBack("/unitab/dvir")}})()}uuidv4(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){const r=16*Math.random()|0;return("x"==t?r:3&r|8).toString(16)})}ionViewWillLeave(){this.databaseSubscription&&this.databaseSubscription.unsubscribe(),this.networkSub.unsubscribe()}goBack(){this.navCtrl.navigateBack("/unitab/dvir")}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(C.k),e.Y36(n.qu),e.Y36(Z.K),e.Y36(T.s),e.Y36(b.W),e.Y36(g.SH))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-insert-dvir"]],decls:80,vars:11,consts:[[3,"title","backButton","backButtonCallback"],[1,"padding-g",2,"padding-top","10px",3,"formGroup","ngSubmit"],[1,"edit-form"],[1,"subtitle-lg"],[1,"edit-dvir-block"],[1,"input-block-2"],[1,"text-2","weight-500"],["type","text","readonly","",1,"input-2","readonly",3,"value"],[1,"two-inputs"],["type","text","formControlName","Date","readonly","",1,"input-2","readonly","width-50"],["type","text","formControlName","Time","readonly","",1,"input-2","readonly","width-50"],["type","text","formControlName","LocationDescription","readonly","",1,"input-2","readonly"],["type","text","formControlName","VehicleUnit","readonly","",1,"input-2","readonly"],["type","text","formControlName","Odometer","readonly","",1,"input-2","readonly"],["type","text","formControlName","DefectsVehicle",1,"input-2","select"],[3,"value",4,"ngFor","ngForOf"],["type","text","formControlName","Trailers",1,"input-2"],["type","text","formControlName","DefectsTrailers",1,"input-2","select"],[1,"statuses"],[1,"status",3,"click"],["src","assets/icon/satis-success.svg","alt","ok"],[1,"text-success"],["src","assets/icon/circle-white.svg","alt","circle",4,"ngIf"],["src","assets/icon/check-mark.svg","alt","circle",4,"ngIf"],["src","assets/icon/satis-error.svg","alt","ok"],[1,"text-error"],["formControlName","Comments","name","comments","id","","cols","30","rows","10",1,"input-2"],[1,"ion-justify-content-center"],["size","auto"],["width","250","height","200",2,"touch-action","none","border","1px solid black"],["sPad",""],["color","success","expand","block",1,"btn","primary-btn",3,"disabled","click"],[3,"value"],["src","assets/icon/circle-white.svg","alt","circle"],["src","assets/icon/check-mark.svg","alt","circle"]],template:function(t,r){1&t&&(e.TgZ(0,"ion-content")(1,"app-header",0),e.NdJ("backButtonCallback",function(){return r.goBack()}),e.qZA(),e.TgZ(2,"form",1),e.NdJ("ngSubmit",function(){return r.onSubmit()}),e.TgZ(3,"div",2)(4,"p",3),e._uU(5,"General Info"),e.qZA(),e.TgZ(6,"div",4)(7,"div",5)(8,"p",6),e._uU(9,"Company"),e.qZA(),e._UZ(10,"input",7),e.qZA(),e.TgZ(11,"div",5)(12,"p",6),e._uU(13,"Time"),e.qZA(),e.TgZ(14,"div",8),e._UZ(15,"input",9)(16,"input",10),e.qZA()(),e.TgZ(17,"div",5)(18,"p",6),e._uU(19,"Location"),e.qZA(),e._UZ(20,"input",11),e.qZA()(),e.TgZ(21,"p",3),e._uU(22,"Vehicle Info"),e.qZA(),e.TgZ(23,"div",4)(24,"div",5)(25,"p",6),e._uU(26,"Vehicle Name"),e.qZA(),e._UZ(27,"input",12),e.qZA(),e.TgZ(28,"div",5)(29,"p",6),e._uU(30,"Odometer"),e.qZA(),e._UZ(31,"input",13),e.qZA(),e.TgZ(32,"div",5)(33,"p",6),e._uU(34,"Vehicle Defects (Optional)"),e.qZA(),e.TgZ(35,"select",14),e.YNc(36,I,2,2,"option",15),e.qZA()()(),e.TgZ(37,"p",3),e._uU(38,"Trailer Info"),e.qZA(),e.TgZ(39,"div",4)(40,"div",5)(41,"p",6),e._uU(42,"Trailer Name"),e.qZA(),e._UZ(43,"input",16),e.qZA(),e.TgZ(44,"div",5)(45,"p",6),e._uU(46,"Trailer Defects (Optional)"),e.qZA(),e.TgZ(47,"select",17),e.YNc(48,A,2,2,"option",15),e.qZA()()(),e.TgZ(49,"p",3),e._uU(50,"Status"),e.qZA(),e.TgZ(51,"div",4)(52,"div",5)(53,"p",6),e._uU(54,"Status"),e.qZA(),e.TgZ(55,"div",18)(56,"div",19),e.NdJ("click",function(){return r.switchStatus("VCS")}),e._UZ(57,"img",20),e.TgZ(58,"p",21),e._uU(59,"Satisfactory Condition"),e.qZA(),e.YNc(60,k,1,0,"img",22),e.YNc(61,V,1,0,"img",23),e.qZA(),e.TgZ(62,"div",19),e.NdJ("click",function(){return r.switchStatus("D")}),e._UZ(63,"img",24),e.TgZ(64,"p",25),e._uU(65,"Has Defects"),e.qZA(),e.YNc(66,P,1,0,"img",22),e.YNc(67,U,1,0,"img",23),e.qZA()()(),e.TgZ(68,"div",5)(69,"p",6),e._uU(70,"Comments"),e.qZA(),e._UZ(71,"textarea",26),e.qZA()(),e.TgZ(72,"p",3),e._uU(73,"Signature"),e.qZA(),e.TgZ(74,"ion-row",27)(75,"ion-col",28),e._UZ(76,"canvas",29,30),e.qZA()(),e.TgZ(78,"button",31),e.NdJ("click",function(){return r.onSubmit()}),e._uU(79,"Save"),e.qZA()()()()),2&t&&(e.xp6(1),e.Q6J("title","Insert Dvir")("backButton",!0),e.xp6(1),e.Q6J("formGroup",r.form),e.xp6(8),e.Q6J("value",null==r.company?null:r.company.name),e.xp6(26),e.Q6J("ngForOf",r.defectsVehicle),e.xp6(12),e.Q6J("ngForOf",r.defectsTrailers),e.xp6(12),e.Q6J("ngIf","VCS"!==r.form.value.StatusCode),e.xp6(1),e.Q6J("ngIf","VCS"===r.form.value.StatusCode),e.xp6(5),e.Q6J("ngIf","D"!==r.form.value.StatusCode),e.xp6(1),e.Q6J("ngIf","D"===r.form.value.StatusCode),e.xp6(11),e.Q6J("disabled",!r.form.valid))},dependencies:[f.sg,f.O5,n._Y,n.YN,n.Kr,n.Fj,n.EJ,n.JJ,n.JL,n.sg,n.u,g.wI,g.W2,g.Nd,x.G],styles:[".input-block-2[_ngcontent-%COMP%]   textarea.input-2[_ngcontent-%COMP%]{height:89px;resize:none}.text-success[_ngcontent-%COMP%]{flex-grow:1;color:var(--success-500);font-size:16px;font-weight:500}.text-error[_ngcontent-%COMP%]{flex-grow:1;color:var(--error-500);font-size:16px;font-weight:600}.btn[_ngcontent-%COMP%]{width:100%;height:50px;border-radius:30px}"]}),i})()}];let _=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[S.Bz.forChild(N),S.Bz]}),i})();var q=l(4546);let B=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[f.ez,n.u5,n.UX,g.Pc,_,q.y]}),i})()}}]);