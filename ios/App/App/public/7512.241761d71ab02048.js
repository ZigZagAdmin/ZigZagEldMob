"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[7512,4546],{4449:(D,m,a)=>{function l(c){return function n(c){return new DataView(Uint8Array.from(c).buffer)}(c.trim().split(" ").filter(_=>""!==_).map(_=>parseInt(_,16)))}function u(c){return function y(c){return Array.from(new Uint8Array(c.buffer))}(c).map(Z=>{let _=Z.toString(16);return 1==_.length&&(_="0"+_),_}).join(" ")}function b(c){if("string"==typeof c)return c;if("number"==typeof c)return function v(c){return`0000${c.toString(16).padStart(4,"0")}-0000-1000-8000-00805f9b34fb`}(c);throw new Error("Invalid UUID")}function E(c){const Z={};if(c)return c.forEach((_,p)=>{Z[p.toString()]=_}),Z}a.d(m,{FF:()=>u,GA:()=>E,JA:()=>b,_j:()=>l})},4546:(D,m,a)=>{a.d(m,{y:()=>v});var n=a(6895),y=a(4006),g=a(7151),i=a(8256);let v=(()=>{class l{}return l.\u0275fac=function(b){return new(b||l)},l.\u0275mod=i.oAB({type:l}),l.\u0275inj=i.cJS({imports:[n.ez,y.u5,g.Pc]}),l})()},4166:(D,m,a)=>{a.d(m,{v:()=>v});var n=a(6895),y=a(4006),g=a(7151),i=a(8256);let v=(()=>{class l{}return l.\u0275fac=function(b){return new(b||l)},l.\u0275mod=i.oAB({type:l}),l.\u0275inj=i.cJS({imports:[n.ez,y.u5,g.Pc]}),l})()},2569:(D,m,a)=>{a.d(m,{G:()=>p});var n=a(5861),y=a(7423),g=a(4449);const i=(0,y.fo)("BluetoothLe",{web:()=>a.e(2728).then(a.bind(a,2728)).then(f=>new f.BluetoothLeWeb)}),v=()=>{let f=Promise.resolve();return e=>new Promise((t,r)=>{f=f.then(()=>e()).then(t).catch(r)})};function l(f){return f?v():e=>e()}function u(f){if("string"!=typeof f)throw new Error(`Invalid UUID type ${typeof f}. Expected string.`);if(!((f=f.toLowerCase()).search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/)>=0))throw new Error(`Invalid UUID format ${f}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);return f}const E=new class b{constructor(){this.scanListener=null,this.eventListeners=new Map,this.queue=l(!0)}enableQueue(){this.queue=l(!0)}disableQueue(){this.queue=l(!1)}initialize(e){var t=this;return(0,n.Z)(function*(){yield t.queue((0,n.Z)(function*(){yield i.initialize(e)}))})()}isEnabled(){var e=this;return(0,n.Z)(function*(){return yield e.queue((0,n.Z)(function*(){return(yield i.isEnabled()).value}))})()}requestEnable(){var e=this;return(0,n.Z)(function*(){yield e.queue((0,n.Z)(function*(){yield i.requestEnable()}))})()}enable(){var e=this;return(0,n.Z)(function*(){yield e.queue((0,n.Z)(function*(){yield i.enable()}))})()}disable(){var e=this;return(0,n.Z)(function*(){yield e.queue((0,n.Z)(function*(){yield i.disable()}))})()}startEnabledNotifications(e){var t=this;return(0,n.Z)(function*(){yield t.queue((0,n.Z)(function*(){var r;const o="onEnabledChanged";yield null===(r=t.eventListeners.get(o))||void 0===r?void 0:r.remove();const s=yield i.addListener(o,d=>{e(d.value)});t.eventListeners.set(o,s),yield i.startEnabledNotifications()}))})()}stopEnabledNotifications(){var e=this;return(0,n.Z)(function*(){yield e.queue((0,n.Z)(function*(){var t;const r="onEnabledChanged";yield null===(t=e.eventListeners.get(r))||void 0===t?void 0:t.remove(),e.eventListeners.delete(r),yield i.stopEnabledNotifications()}))})()}isLocationEnabled(){var e=this;return(0,n.Z)(function*(){return yield e.queue((0,n.Z)(function*(){return(yield i.isLocationEnabled()).value}))})()}openLocationSettings(){var e=this;return(0,n.Z)(function*(){yield e.queue((0,n.Z)(function*(){yield i.openLocationSettings()}))})()}openBluetoothSettings(){var e=this;return(0,n.Z)(function*(){yield e.queue((0,n.Z)(function*(){yield i.openBluetoothSettings()}))})()}openAppSettings(){var e=this;return(0,n.Z)(function*(){yield e.queue((0,n.Z)(function*(){yield i.openAppSettings()}))})()}setDisplayStrings(e){var t=this;return(0,n.Z)(function*(){yield t.queue((0,n.Z)(function*(){yield i.setDisplayStrings(e)}))})()}requestDevice(e){var t=this;return(0,n.Z)(function*(){return e=e?t.validateRequestBleDeviceOptions(e):void 0,yield t.queue((0,n.Z)(function*(){return yield i.requestDevice(e)}))})()}requestLEScan(e,t){var r=this;return(0,n.Z)(function*(){e=r.validateRequestBleDeviceOptions(e),yield r.queue((0,n.Z)(function*(){var o;yield null===(o=r.scanListener)||void 0===o?void 0:o.remove(),r.scanListener=yield i.addListener("onScanResult",s=>{const d=Object.assign(Object.assign({},s),{manufacturerData:r.convertObject(s.manufacturerData),serviceData:r.convertObject(s.serviceData),rawAdvertisement:s.rawAdvertisement?r.convertValue(s.rawAdvertisement):void 0});t(d)}),yield i.requestLEScan(e)}))})()}stopLEScan(){var e=this;return(0,n.Z)(function*(){yield e.queue((0,n.Z)(function*(){var t;yield null===(t=e.scanListener)||void 0===t?void 0:t.remove(),e.scanListener=null,yield i.stopLEScan()}))})()}getDevices(e){var t=this;return(0,n.Z)(function*(){if(!Array.isArray(e))throw new Error("deviceIds must be an array");return t.queue((0,n.Z)(function*(){return(yield i.getDevices({deviceIds:e})).devices}))})()}getConnectedDevices(e){var t=this;return(0,n.Z)(function*(){if(!Array.isArray(e))throw new Error("services must be an array");return e=e.map(u),t.queue((0,n.Z)(function*(){return(yield i.getConnectedDevices({services:e})).devices}))})()}connect(e,t,r){var o=this;return(0,n.Z)(function*(){yield o.queue((0,n.Z)(function*(){var s;if(t){const d=`disconnected|${e}`;yield null===(s=o.eventListeners.get(d))||void 0===s?void 0:s.remove();const h=yield i.addListener(d,()=>{t(e)});o.eventListeners.set(d,h)}yield i.connect(Object.assign({deviceId:e},r))}))})()}createBond(e,t){var r=this;return(0,n.Z)(function*(){yield r.queue((0,n.Z)(function*(){yield i.createBond(Object.assign({deviceId:e},t))}))})()}isBonded(e){var t=this;return(0,n.Z)(function*(){return yield t.queue((0,n.Z)(function*(){return(yield i.isBonded({deviceId:e})).value}))})()}disconnect(e){var t=this;return(0,n.Z)(function*(){yield t.queue((0,n.Z)(function*(){yield i.disconnect({deviceId:e})}))})()}getServices(e){var t=this;return(0,n.Z)(function*(){return yield t.queue((0,n.Z)(function*(){return(yield i.getServices({deviceId:e})).services}))})()}discoverServices(e){var t=this;return(0,n.Z)(function*(){yield t.queue((0,n.Z)(function*(){yield i.discoverServices({deviceId:e})}))})()}getMtu(e){var t=this;return(0,n.Z)(function*(){return yield t.queue((0,n.Z)(function*(){return(yield i.getMtu({deviceId:e})).value}))})()}requestConnectionPriority(e,t){var r=this;return(0,n.Z)(function*(){yield r.queue((0,n.Z)(function*(){yield i.requestConnectionPriority({deviceId:e,connectionPriority:t})}))})()}readRssi(e){var t=this;return(0,n.Z)(function*(){return yield t.queue((0,n.Z)(function*(){const o=yield i.readRssi({deviceId:e});return parseFloat(o.value)}))})()}read(e,t,r,o){var s=this;return(0,n.Z)(function*(){return t=u(t),r=u(r),yield s.queue((0,n.Z)(function*(){const h=yield i.read(Object.assign({deviceId:e,service:t,characteristic:r},o));return s.convertValue(h.value)}))})()}write(e,t,r,o,s){var d=this;return(0,n.Z)(function*(){return t=u(t),r=u(r),d.queue((0,n.Z)(function*(){if(null==o||!o.buffer)throw new Error("Invalid data.");let h=o;"web"!==y.dV.getPlatform()&&(h=(0,g.FF)(o)),yield i.write(Object.assign({deviceId:e,service:t,characteristic:r,value:h},s))}))})()}writeWithoutResponse(e,t,r,o,s){var d=this;return(0,n.Z)(function*(){t=u(t),r=u(r),yield d.queue((0,n.Z)(function*(){if(null==o||!o.buffer)throw new Error("Invalid data.");let h=o;"web"!==y.dV.getPlatform()&&(h=(0,g.FF)(o)),yield i.writeWithoutResponse(Object.assign({deviceId:e,service:t,characteristic:r,value:h},s))}))})()}readDescriptor(e,t,r,o,s){var d=this;return(0,n.Z)(function*(){return t=u(t),r=u(r),o=u(o),yield d.queue((0,n.Z)(function*(){const S=yield i.readDescriptor(Object.assign({deviceId:e,service:t,characteristic:r,descriptor:o},s));return d.convertValue(S.value)}))})()}writeDescriptor(e,t,r,o,s,d){var h=this;return(0,n.Z)(function*(){return t=u(t),r=u(r),o=u(o),h.queue((0,n.Z)(function*(){if(null==s||!s.buffer)throw new Error("Invalid data.");let S=s;"web"!==y.dV.getPlatform()&&(S=(0,g.FF)(s)),yield i.writeDescriptor(Object.assign({deviceId:e,service:t,characteristic:r,descriptor:o,value:S},d))}))})()}startNotifications(e,t,r,o){var s=this;return(0,n.Z)(function*(){t=u(t),r=u(r),yield s.queue((0,n.Z)(function*(){var d;const h=`notification|${e}|${t}|${r}`;yield null===(d=s.eventListeners.get(h))||void 0===d?void 0:d.remove();const S=yield i.addListener(h,x=>{o(s.convertValue(null==x?void 0:x.value))});s.eventListeners.set(h,S),yield i.startNotifications({deviceId:e,service:t,characteristic:r})}))})()}stopNotifications(e,t,r){var o=this;return(0,n.Z)(function*(){t=u(t),r=u(r),yield o.queue((0,n.Z)(function*(){var s;const d=`notification|${e}|${t}|${r}`;yield null===(s=o.eventListeners.get(d))||void 0===s?void 0:s.remove(),o.eventListeners.delete(d),yield i.stopNotifications({deviceId:e,service:t,characteristic:r})}))})()}validateRequestBleDeviceOptions(e){return e.services&&(e.services=e.services.map(u)),e.optionalServices&&(e.optionalServices=e.optionalServices.map(u)),e}convertValue(e){return"string"==typeof e?(0,g._j)(e):void 0===e?new DataView(new ArrayBuffer(0)):e}convertObject(e){if(void 0===e)return;const t={};for(const r of Object.keys(e))t[r]=this.convertValue(e[r]);return t}};var c=a(5479),Z=a(1135),_=a(8256);let p=(()=>{class f{constructor(){this.bluetoothStatusSubject=new Z.X(null)}initialize(){var t=this;return(0,n.Z)(function*(){yield E.initialize().catch(r=>t.requestBluetoothPermission())})()}getBluetoothState(){var t=this;return(0,n.Z)(function*(){return t.bluetoothStatusSubject.next(yield E.isEnabled().catch(()=>!1)),yield E.isEnabled().catch(()=>!1)})()}requestBluetoothPermission(t,r){var o=this;return(0,n.Z)(function*(){yield E.requestEnable().then(()=>o.bluetoothStatusSubject.next(!0),(0,n.Z)(function*(){t&&confirm((r?"You need to to give bluetooth permissions!":"You must enable bluetooth to use this feature!")+"\n Proceed to settings?")?yield c.QR.open({optionAndroid:c.ux.ApplicationDetails,optionIOS:c.$$.App}):o.bluetoothStatusSubject.next(!1)})).catch(s=>o.bluetoothStatusSubject.next(!1))})()}getBluetoothStatusObservable(){return this.bluetoothStatusSubject.asObservable()}}return f.\u0275fac=function(t){return new(t||f)},f.\u0275prov=_.Yz7({token:f,factory:f.\u0275fac,providedIn:"root"}),f})()},6994:(D,m,a)=>{a.d(m,{t:()=>i});var n=a(7579),y=a(1135),g=a(8256);let i=(()=>{class v{constructor(){this.editDataDetails=[],this.subject=new n.x,this.messageSource=new y.X(this.editDataDetails),this.currentMessage=this.messageSource.asObservable()}changeMessage(u){this.messageSource.next(u)}destroyMessage(){this.messageSource.next("")}}return v.\u0275fac=function(u){return new(u||v)},v.\u0275prov=g.Yz7({token:v,factory:v.\u0275fac,providedIn:"root"}),v})()},7278:(D,m,a)=>{a.d(m,{t:()=>g});var n=a(8256),y=a(849);let g=(()=>{class i{constructor(l){this.storage=l}generateString(l){const u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let b=" ";const E=u.length;for(let c=0;c<l;c++)b+=u.charAt(Math.floor(Math.random()*E));return b}validateForm(l){let u=!0;for(const b in l)u=u&&l[b];return u}uuidv4(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(l){const u=16*Math.random()|0;return("x"==l?u:3&u|8).toString(16)})}}return i.\u0275fac=function(l){return new(l||i)(n.LFG(y.K))},i.\u0275prov=n.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()}}]);