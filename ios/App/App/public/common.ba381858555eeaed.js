"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[8592],{6022:(O,f,r)=>{r.d(f,{c:()=>l});var t=r(9816),h=r(7864),d=r(1898);const l=(n,e)=>{let i,s;const v=(_,m,w)=>{if(typeof document>"u")return;const y=document.elementFromPoint(_,m);y&&e(y)?y!==i&&(C(),p(y,w)):C()},p=(_,m)=>{i=_,s||(s=i);const w=i;(0,t.w)(()=>w.classList.add("ion-activated")),m()},C=(_=!1)=>{if(!i)return;const m=i;(0,t.w)(()=>m.classList.remove("ion-activated")),_&&s!==i&&i.click(),i=void 0};return(0,d.createGesture)({el:n,gestureName:"buttonActiveDrag",threshold:0,onStart:_=>v(_.currentX,_.currentY,h.a),onMove:_=>v(_.currentX,_.currentY,h.b),onEnd:()=>{C(!0),(0,h.h)(),s=void 0}})}},2225:(O,f,r)=>{r.d(f,{g:()=>t});const t=(e,i,s,v,p)=>d(e[1],i[1],s[1],v[1],p).map(C=>h(e[0],i[0],s[0],v[0],C)),h=(e,i,s,v,p)=>p*(3*i*Math.pow(p-1,2)+p*(-3*s*p+3*s+v*p))-e*Math.pow(p-1,3),d=(e,i,s,v,p)=>n((v-=p)-3*(s-=p)+3*(i-=p)-(e-=p),3*s-6*i+3*e,3*i-3*e,e).filter(_=>_>=0&&_<=1),n=(e,i,s,v)=>{if(0===e)return((e,i,s)=>{const v=i*i-4*e*s;return v<0?[]:[(-i+Math.sqrt(v))/(2*e),(-i-Math.sqrt(v))/(2*e)]})(i,s,v);const p=(3*(s/=e)-(i/=e)*i)/3,C=(2*i*i*i-9*i*s+27*(v/=e))/27;if(0===p)return[Math.pow(-C,1/3)];if(0===C)return[Math.sqrt(-p),-Math.sqrt(-p)];const _=Math.pow(C/2,2)+Math.pow(p/3,3);if(0===_)return[Math.pow(C/2,.5)-i/3];if(_>0)return[Math.pow(-C/2+Math.sqrt(_),1/3)-Math.pow(C/2+Math.sqrt(_),1/3)-i/3];const m=Math.sqrt(Math.pow(-p/3,3)),w=Math.acos(-C/(2*Math.sqrt(Math.pow(-p/3,3)))),y=2*Math.pow(m,1/3);return[y*Math.cos(w/3)-i/3,y*Math.cos((w+2*Math.PI)/3)-i/3,y*Math.cos((w+4*Math.PI)/3)-i/3]}},5062:(O,f,r)=>{r.d(f,{i:()=>t});const t=h=>h&&""!==h.dir?"rtl"===h.dir.toLowerCase():"rtl"===(null==document?void 0:document.dir.toLowerCase())},6602:(O,f,r)=>{r.r(f),r.d(f,{startFocusVisible:()=>l});const t="ion-focused",d=["Tab","ArrowDown","Space","Escape"," ","Shift","Enter","ArrowLeft","ArrowRight","ArrowUp","Home","End"],l=n=>{let e=[],i=!0;const s=n?n.shadowRoot:document,v=n||document.body,p=M=>{e.forEach(g=>g.classList.remove(t)),M.forEach(g=>g.classList.add(t)),e=M},C=()=>{i=!1,p([])},_=M=>{i=d.includes(M.key),i||p([])},m=M=>{if(i&&void 0!==M.composedPath){const g=M.composedPath().filter(c=>!!c.classList&&c.classList.contains("ion-focusable"));p(g)}},w=()=>{s.activeElement===v&&p([])};return s.addEventListener("keydown",_),s.addEventListener("focusin",m),s.addEventListener("focusout",w),s.addEventListener("touchstart",C),s.addEventListener("mousedown",C),{destroy:()=>{s.removeEventListener("keydown",_),s.removeEventListener("focusin",m),s.removeEventListener("focusout",w),s.removeEventListener("touchstart",C),s.removeEventListener("mousedown",C)},setFocus:p}}},8689:(O,f,r)=>{r.d(f,{c:()=>h});var t=r(3577);const h=e=>{const i=e;let s;return{hasLegacyControl:()=>{if(void 0===s){const p=void 0!==i.label||d(i),C=i.hasAttribute("aria-label")||i.hasAttribute("aria-labelledby")&&null===i.shadowRoot,_=(0,t.h)(i);s=!0===i.legacy||!p&&!C&&null!==_}return s}}},d=e=>null!==e.shadowRoot&&!!(l.includes(e.tagName)&&null!==e.querySelector('[slot="label"]')||n.includes(e.tagName)&&""!==e.textContent),l=["ION-RANGE"],n=["ION-TOGGLE","ION-CHECKBOX","ION-RADIO"]},7864:(O,f,r)=>{r.d(f,{a:()=>l,b:()=>n,c:()=>d,d:()=>i,h:()=>e});const t={getEngine(){var s;const v=window;return v.TapticEngine||(null===(s=v.Capacitor)||void 0===s?void 0:s.isPluginAvailable("Haptics"))&&v.Capacitor.Plugins.Haptics},available(){var s;const v=window;return!!this.getEngine()&&("web"!==(null===(s=v.Capacitor)||void 0===s?void 0:s.getPlatform())||typeof navigator<"u"&&void 0!==navigator.vibrate)},isCordova:()=>!!window.TapticEngine,isCapacitor:()=>!!window.Capacitor,impact(s){const v=this.getEngine();if(!v)return;const p=this.isCapacitor()?s.style.toUpperCase():s.style;v.impact({style:p})},notification(s){const v=this.getEngine();if(!v)return;const p=this.isCapacitor()?s.style.toUpperCase():s.style;v.notification({style:p})},selection(){this.impact({style:"light"})},selectionStart(){const s=this.getEngine();s&&(this.isCapacitor()?s.selectionStart():s.gestureSelectionStart())},selectionChanged(){const s=this.getEngine();s&&(this.isCapacitor()?s.selectionChanged():s.gestureSelectionChanged())},selectionEnd(){const s=this.getEngine();s&&(this.isCapacitor()?s.selectionEnd():s.gestureSelectionEnd())}},h=()=>t.available(),d=()=>{h()&&t.selection()},l=()=>{h()&&t.selectionStart()},n=()=>{h()&&t.selectionChanged()},e=()=>{h()&&t.selectionEnd()},i=s=>{h()&&t.impact(s)}},7366:(O,f,r)=>{r.d(f,{a:()=>t,b:()=>m,c:()=>i,d:()=>w,e:()=>b,f:()=>e,g:()=>y,h:()=>d,i:()=>h,j:()=>a,k:()=>u,l:()=>s,m:()=>C,n:()=>M,o:()=>p,p:()=>n,q:()=>l,r:()=>o,s:()=>x,t:()=>_,u:()=>g,v:()=>c,w:()=>v});const t="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-miterlimit='10' stroke-width='48' d='M244 400L100 256l144-144M120 256h292' class='ionicon-fill-none'/></svg>",h="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 268l144 144 144-144M256 392V100' class='ionicon-fill-none'/></svg>",d="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M368 64L144 256l224 192V64z'/></svg>",l="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 144l192 224 192-224H64z'/></svg>",n="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M448 368L256 144 64 368h384z'/></svg>",e="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M416 128L192 384l-96-96' class='ionicon-fill-none ionicon-stroke-width'/></svg>",i="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M328 112L184 256l144 144' class='ionicon-fill-none'/></svg>",s="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 184l144 144 144-144' class='ionicon-fill-none'/></svg>",v="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M136 208l120-104 120 104M136 304l120 104 120-104' stroke-width='48' stroke-linecap='round' stroke-linejoin='round' class='ionicon-fill-none'/></svg>",p="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",C="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",_="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z'/></svg>",m="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 11-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 01-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0122.62-22.62L256 233.37l52.69-52.68a16 16 0 0122.62 22.62L278.63 256z'/></svg>",w="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M400 145.49L366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z'/></svg>",y="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='192' stroke-linecap='round' stroke-linejoin='round' class='ionicon-fill-none ionicon-stroke-width'/></svg>",M="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='48'/><circle cx='416' cy='256' r='48'/><circle cx='96' cy='256' r='48'/></svg>",g="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-miterlimit='10' d='M80 160h352M80 256h352M80 352h352' class='ionicon-fill-none ionicon-stroke-width'/></svg>",c="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 384h384v-42.67H64zm0-106.67h384v-42.66H64zM64 128v42.67h384V128z'/></svg>",o="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M400 256H112' class='ionicon-fill-none ionicon-stroke-width'/></svg>",a="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M96 256h320M96 176h320M96 336h320' class='ionicon-fill-none ionicon-stroke-width'/></svg>",u="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-linejoin='round' stroke-width='44' d='M118 304h276M118 208h276' class='ionicon-fill-none'/></svg>",x="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z' stroke-miterlimit='10' class='ionicon-fill-none ionicon-stroke-width'/><path stroke-linecap='round' stroke-miterlimit='10' d='M338.29 338.29L448 448' class='ionicon-fill-none ionicon-stroke-width'/></svg>",b="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M464 428L339.92 303.9a160.48 160.48 0 0030.72-94.58C370.64 120.37 298.27 48 209.32 48S48 120.37 48 209.32s72.37 161.32 161.32 161.32a160.48 160.48 0 0094.58-30.72L428 464zM209.32 319.69a110.38 110.38 0 11110.37-110.37 110.5 110.5 0 01-110.37 110.37z'/></svg>"},2055:(O,f,r)=>{r.d(f,{I:()=>e,a:()=>p,b:()=>n,c:()=>m,d:()=>y,f:()=>C,g:()=>v,i:()=>s,p:()=>w,r:()=>M,s:()=>_});var t=r(5861),h=r(3577),d=r(1178);const n="ion-content",e=".ion-content-scroll-host",i=`${n}, ${e}`,s=g=>"ION-CONTENT"===g.tagName,v=function(){var g=(0,t.Z)(function*(c){return s(c)?(yield new Promise(o=>(0,h.c)(c,o)),c.getScrollElement()):c});return function(o){return g.apply(this,arguments)}}(),p=g=>g.querySelector(e)||g.querySelector(i),C=g=>g.closest(i),_=(g,c)=>s(g)?g.scrollToTop(c):Promise.resolve(g.scrollTo({top:0,left:0,behavior:c>0?"smooth":"auto"})),m=(g,c,o,a)=>s(g)?g.scrollByPoint(c,o,a):Promise.resolve(g.scrollBy({top:o,left:c,behavior:a>0?"smooth":"auto"})),w=g=>(0,d.b)(g,n),y=g=>{if(s(g)){const o=g.scrollY;return g.scrollY=!1,o}return g.style.setProperty("overflow","hidden"),!0},M=(g,c)=>{s(g)?g.scrollY=c:g.style.removeProperty("overflow")}},9240:(O,f,r)=>{r.d(f,{g:()=>h});var t=r(1178);const h=(l,n,e)=>{const i=null==l?0:l.toString().length,s=d(i,n);if(void 0===e)return s;try{return e(i,n)}catch(v){return(0,t.a)("Exception in provided `counterFormatter`.",v),s}},d=(l,n)=>`${l} / ${n}`},5234:(O,f,r)=>{r.r(f),r.d(f,{KEYBOARD_DID_CLOSE:()=>h,KEYBOARD_DID_OPEN:()=>t,copyVisualViewport:()=>c,keyboardDidClose:()=>w,keyboardDidOpen:()=>_,keyboardDidResize:()=>m,resetKeyboardAssist:()=>i,setKeyboardClose:()=>C,setKeyboardOpen:()=>p,startKeyboardAssist:()=>s,trackViewportChanges:()=>g});const t="ionKeyboardDidShow",h="ionKeyboardDidHide";let l={},n={},e=!1;const i=()=>{l={},n={},e=!1},s=o=>{v(o),o.visualViewport&&(n=c(o.visualViewport),o.visualViewport.onresize=()=>{g(o),_()||m(o)?p(o):w(o)&&C(o)})},v=o=>{o.addEventListener("keyboardDidShow",a=>p(o,a)),o.addEventListener("keyboardDidHide",()=>C(o))},p=(o,a)=>{y(o,a),e=!0},C=o=>{M(o),e=!1},_=()=>!e&&l.width===n.width&&(l.height-n.height)*n.scale>150,m=o=>e&&!w(o),w=o=>e&&n.height===o.innerHeight,y=(o,a)=>{const x=new CustomEvent(t,{detail:{keyboardHeight:a?a.keyboardHeight:o.innerHeight-n.height}});o.dispatchEvent(x)},M=o=>{const a=new CustomEvent(h);o.dispatchEvent(a)},g=o=>{l=Object.assign({},n),n=c(o.visualViewport)},c=o=>({width:Math.round(o.width),height:Math.round(o.height),offsetTop:o.offsetTop,offsetLeft:o.offsetLeft,pageTop:o.pageTop,pageLeft:o.pageLeft,scale:o.scale})},9852:(O,f,r)=>{r.d(f,{c:()=>h});var t=r(3457);const h=d=>{let l,n,e;const i=()=>{l=()=>{e=!0,d&&d(!0)},n=()=>{e=!1,d&&d(!1)},null==t.w||t.w.addEventListener("keyboardWillShow",l),null==t.w||t.w.addEventListener("keyboardWillHide",n)};return i(),{init:i,destroy:()=>{null==t.w||t.w.removeEventListener("keyboardWillShow",l),null==t.w||t.w.removeEventListener("keyboardWillHide",n),l=n=void 0},isKeyboardVisible:()=>e}}},7741:(O,f,r)=>{r.d(f,{S:()=>h});const h={bubbles:{dur:1e3,circles:9,fn:(d,l,n)=>{const e=d*l/n-d+"ms",i=2*Math.PI*l/n;return{r:5,style:{top:9*Math.sin(i)+"px",left:9*Math.cos(i)+"px","animation-delay":e}}}},circles:{dur:1e3,circles:8,fn:(d,l,n)=>{const e=l/n,i=d*e-d+"ms",s=2*Math.PI*e;return{r:5,style:{top:9*Math.sin(s)+"px",left:9*Math.cos(s)+"px","animation-delay":i}}}},circular:{dur:1400,elmDuration:!0,circles:1,fn:()=>({r:20,cx:48,cy:48,fill:"none",viewBox:"24 24 48 48",transform:"translate(0,0)",style:{}})},crescent:{dur:750,circles:1,fn:()=>({r:26,style:{}})},dots:{dur:750,circles:3,fn:(d,l)=>({r:6,style:{left:9-9*l+"px","animation-delay":-110*l+"ms"}})},lines:{dur:1e3,lines:8,fn:(d,l,n)=>({y1:14,y2:26,style:{transform:`rotate(${360/n*l+(l<n/2?180:-180)}deg)`,"animation-delay":d*l/n-d+"ms"}})},"lines-small":{dur:1e3,lines:8,fn:(d,l,n)=>({y1:12,y2:20,style:{transform:`rotate(${360/n*l+(l<n/2?180:-180)}deg)`,"animation-delay":d*l/n-d+"ms"}})},"lines-sharp":{dur:1e3,lines:12,fn:(d,l,n)=>({y1:17,y2:29,style:{transform:`rotate(${30*l+(l<6?180:-180)}deg)`,"animation-delay":d*l/n-d+"ms"}})},"lines-sharp-small":{dur:1e3,lines:12,fn:(d,l,n)=>({y1:12,y2:20,style:{transform:`rotate(${30*l+(l<6?180:-180)}deg)`,"animation-delay":d*l/n-d+"ms"}})}}},7539:(O,f,r)=>{r.r(f),r.d(f,{createSwipeBackGesture:()=>n});var t=r(3577),h=r(5062),d=r(1898);r(4349);const n=(e,i,s,v,p)=>{const C=e.ownerDocument.defaultView;let _=(0,h.i)(e);const w=o=>_?-o.deltaX:o.deltaX;return(0,d.createGesture)({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:o=>(_=(0,h.i)(e),(o=>{const{startX:u}=o;return _?u>=C.innerWidth-50:u<=50})(o)&&i()),onStart:s,onMove:o=>{const u=w(o)/C.innerWidth;v(u)},onEnd:o=>{const a=w(o),u=C.innerWidth,x=a/u,b=(o=>_?-o.velocityX:o.velocityX)(o),E=b>=0&&(b>.2||a>u/2),P=(E?1-x:x)*u;let S=0;if(P>5){const D=P/Math.abs(b);S=Math.min(D,540)}p(E,x<=0?.01:(0,t.l)(0,x,.9999),S)}})}},2145:(O,f,r)=>{r.d(f,{w:()=>h});var t=r(8256);let h=(()=>{class d{constructor(){this.leftCallback=new t.vpe,this.rightCallback=new t.vpe}ngOnInit(){}left(){this.leftCallback.emit()}right(){this.rightCallback.emit()}}return d.\u0275fac=function(n){return new(n||d)},d.\u0275cmp=t.Xpm({type:d,selectors:[["app-scroll-toolbar"]],inputs:{title:"title"},outputs:{leftCallback:"leftCallback",rightCallback:"rightCallback"},decls:7,vars:1,consts:[[1,"toolbar-container"],[1,"arrow"],["src","../../../assets/imgs/back-arrow.png",3,"click"],[1,"tool-content"],["src","../../../assets/imgs/back-arrow.png",1,"rotate",3,"click"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0)(1,"div",1)(2,"img",2),t.NdJ("click",function(){return e.left()}),t.qZA()(),t.TgZ(3,"div",3),t._uU(4),t.qZA(),t.TgZ(5,"div",1)(6,"img",4),t.NdJ("click",function(){return e.right()}),t.qZA()()()),2&n&&(t.xp6(4),t.Oqu(e.title))},styles:[".toolbar-container[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:30px 30px 0}.arrow[_ngcontent-%COMP%]{margin:0;padding:0;display:flex;align-items:center}.arrow[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;height:20px}.tool-content[_ngcontent-%COMP%]{font-size:17px;font-weight:600;color:var(--gray-700)}.rotate[_ngcontent-%COMP%]{transform:rotate(180deg)}"]}),d})()},5351:(O,f,r)=>{r.d(f,{J:()=>n});var t=r(6895),h=r(4006),d=r(6114),l=r(8256);let n=(()=>{class e{}return e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=l.oAB({type:e}),e.\u0275inj=l.cJS({imports:[t.ez,h.u5,d.Pc]}),e})()},4762:(O,f,r)=>{r.d(f,{Z:()=>h});var t=r(8256);let h=(()=>{class d{}return d.\u0275fac=function(n){return new(n||d)},d.\u0275cmp=t.Xpm({type:d,selectors:[["app-explore-container"]],inputs:{name:"name"},decls:7,vars:1,consts:[["id","container"],["target","_blank","rel","noopener noreferrer","href","https://ionicframework.com/docs/components"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0)(1,"strong"),t._uU(2),t.qZA(),t.TgZ(3,"p"),t._uU(4,"Explore "),t.TgZ(5,"a",1),t._uU(6,"UI Components"),t.qZA()()()),2&n&&(t.xp6(2),t.Oqu(e.name))},styles:["#container[_ngcontent-%COMP%]{text-align:center;position:absolute;left:0;right:0;top:50%;transform:translateY(-50%)}#container[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:20px;line-height:26px}#container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;line-height:22px;color:#8c8c8c;margin:0}#container[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none}"]}),d})()},581:(O,f,r)=>{r.d(f,{e:()=>n});var t=r(6895),h=r(4006),d=r(6114),l=r(8256);let n=(()=>{class e{}return e.\u0275fac=function(s){return new(s||e)},e.\u0275mod=l.oAB({type:e}),e.\u0275inj=l.cJS({imports:[t.ez,h.u5,d.Pc]}),e})()},6357:(O,f,r)=>{r.d(f,{e:()=>g});var t=r(8256),h=r(4529),d=r(6114),l=r(4382),n=r(6895),e=r(3646);let i=(()=>{class c{transform(a){let u;switch(Number(a)%10){case 1:return u="st",a+u;case 2:return u="nd",a+u;case 3:return u="rd",a+u;default:return u="th",a+u}}}return c.\u0275fac=function(a){return new(a||c)},c.\u0275pipe=t.Yjl({name:"ordinal",type:c,pure:!0}),c})();function s(c,o){1&c&&t._UZ(0,"img",12)}function v(c,o){1&c&&t._UZ(0,"img",13)}function p(c,o){if(1&c&&(t.TgZ(0,"div",14)(1,"div",15),t._UZ(2,"img",16),t.TgZ(3,"p",17),t._uU(4,"Vehicle Defects"),t.qZA()(),t.TgZ(5,"p",18),t._uU(6),t.qZA()()),2&c){const a=t.oxw();t.xp6(6),t.Oqu(a.dvir.DefectsVehicle)}}function C(c,o){if(1&c&&(t.TgZ(0,"div",14)(1,"div",15),t._UZ(2,"img",16),t.TgZ(3,"p",17),t._uU(4,"Trailer Defects"),t.qZA()(),t.TgZ(5,"p",18),t._uU(6),t.qZA()()),2&c){const a=t.oxw();t.xp6(6),t.Oqu(a.dvir.DefectsTrailers)}}function _(c,o){if(1&c&&(t.TgZ(0,"div",14)(1,"div",15),t._UZ(2,"img",19),t.TgZ(3,"p",20),t._uU(4),t.qZA()()()),2&c){const a=t.oxw();t.xp6(4),t.Oqu(a.dvir.StatusName)}}let m=(()=>{class c{constructor(){}ngOnInit(){}}return c.\u0275fac=function(a){return new(a||c)},c.\u0275cmp=t.Xpm({type:c,selectors:[["app-card"]],inputs:{dvir:"dvir"},decls:25,vars:23,consts:[[1,"dvir-card"],[1,"date-block"],["src","assets/icon/dvir-has-defects.svg","alt","defect",4,"ngIf"],["src","assets/icon/green-point.svg","alt","no-defects",4,"ngIf"],[1,"subtitle"],[1,"text-14-600"],[1,"names"],[1,"name"],["src","assets/icon/truck-fast.svg","alt","truck"],[1,"text-1"],["src","assets/icon/trailer.svg","alt","truck"],["class","state",4,"ngIf"],["src","assets/icon/dvir-has-defects.svg","alt","defect"],["src","assets/icon/green-point.svg","alt","no-defects"],[1,"state"],[1,"state-block"],["src","assets/icon/warning-2.svg","alt","warning"],[1,"text-14-600-err"],[1,"defs"],["src","assets/icon/tick-circle.svg","alt","all good"],[1,"text-14-600-succ"]],template:function(a,u){1&a&&(t.TgZ(0,"div",0)(1,"div",1),t.YNc(2,s,1,0,"img",2),t.YNc(3,v,1,0,"img",3),t.TgZ(4,"p",4),t._uU(5),t.ALo(6,"date"),t.ALo(7,"ordinal"),t.ALo(8,"date"),t.ALo(9,"date"),t.qZA(),t.TgZ(10,"p",5),t._uU(11),t.ALo(12,"date"),t.qZA()(),t.TgZ(13,"div",6)(14,"div",7),t._UZ(15,"img",8),t.TgZ(16,"p",9),t._uU(17,"Vehicle Name"),t.qZA()(),t.TgZ(18,"div",7),t._UZ(19,"img",10),t.TgZ(20,"p",9),t._uU(21,"Trailer Name"),t.qZA()()(),t.YNc(22,p,7,1,"div",11),t.YNc(23,C,7,1,"div",11),t.YNc(24,_,5,1,"div",11),t.qZA()),2&a&&(t.xp6(2),t.Q6J("ngIf",u.dvir.DefectsVehicle||u.dvir.DefectsTrailers),t.xp6(1),t.Q6J("ngIf","VCS"===u.dvir.StatusCode),t.xp6(2),t.lnq("",t.xi3(6,9,u.dvir.CreateDate,"EEE, MMM")," ",t.lcZ(7,12,t.xi3(8,14,u.dvir.CreateDate,"d"))," ",t.xi3(9,17,u.dvir.CreateDate,"y"),""),t.xp6(6),t.Oqu(t.xi3(12,20,u.dvir.CreateDate,"hh:mm a")),t.xp6(11),t.Q6J("ngIf",u.dvir.DefectsVehicle),t.xp6(1),t.Q6J("ngIf",u.dvir.DefectsTrailers),t.xp6(1),t.Q6J("ngIf","VCS"===u.dvir.StatusCode))},dependencies:[n.O5,n.uU,i],styles:[".dvir-card[_ngcontent-%COMP%]{width:100%;display:flex;flex-direction:column;gap:10px;background-color:var(--gray-100);border-radius:10px;padding:15px}.dvir-card[_ngcontent-%COMP%]   .date-block[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px}.dvir-card[_ngcontent-%COMP%]   .date-block[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{flex-grow:1}.dvir-card[_ngcontent-%COMP%]   .names[_ngcontent-%COMP%]{width:100%;display:flex;align-items:center}.dvir-card[_ngcontent-%COMP%]   .names[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%]{width:50%;display:flex;align-items:center;gap:10px}.dvir-card[_ngcontent-%COMP%]   .state[_ngcontent-%COMP%]   .state-block[_ngcontent-%COMP%]{display:flex;align-items:center;gap:5px;margin-bottom:5px}.dvir-card[_ngcontent-%COMP%]   .state[_ngcontent-%COMP%]   .state-block[_ngcontent-%COMP%]   .text-14-600-err[_ngcontent-%COMP%]{color:var(--error-600)}.dvir-card[_ngcontent-%COMP%]   .state[_ngcontent-%COMP%]   .state-block[_ngcontent-%COMP%]   .text-14-600-succ[_ngcontent-%COMP%]{color:var(--success-600)}.dvir-card[_ngcontent-%COMP%]   .state[_ngcontent-%COMP%]   .defs[_ngcontent-%COMP%]{color:var(--gray-700, #344054);font-size:14px;font-weight:500;line-height:150%}"]}),c})();function w(c,o){if(1&c){const a=t.EpF();t.TgZ(0,"app-card",7),t.NdJ("click",function(){const b=t.CHM(a).$implicit,T=t.oxw(2);return t.KtG(T.editDvir(b))}),t.qZA()}2&c&&t.Q6J("dvir",o.$implicit)}function y(c,o){if(1&c&&(t.TgZ(0,"div",5),t.YNc(1,w,1,1,"app-card",6),t.qZA()),2&c){const a=t.oxw();t.xp6(1),t.Q6J("ngForOf",a.dvirs)}}function M(c,o){1&c&&(t.TgZ(0,"div",8),t._uU(1,"No data."),t.qZA())}let g=(()=>{class c{constructor(a,u,x){this.route=a,this.navCtrl=u,this.databaseService=x,this.bLoading=!0,this.bReady=!1,this.dvirs=[],this.pickedVehicle=""}ngOnInit(){console.log("init dvirs"),this.databaseSubscription=this.databaseService.databaseReadySubject.subscribe(a=>{a&&(this.bReady=a,this.databaseSubscription=this.databaseService.getDvirs().subscribe(u=>{this.dvirs=u}))}),this.paramsSubscription=this.route.params.subscribe(a=>{console.log("after ngOnInit dvir"),this.bReady&&(this.databaseSubscription=this.databaseService.getDvirs().subscribe(u=>{this.dvirs=u,console.log(this.dvirs)}))})}editDvir(a){console.log(a.DVIRId),this.navCtrl.navigateForward(["/edit-dvir",{dvirId:a.DVIRId}])}insertDvir(){this.navCtrl.navigateForward("/insert-dvir")}ionViewWillLeave(){this.databaseSubscription&&this.databaseSubscription.unsubscribe()}}return c.\u0275fac=function(a){return new(a||c)(t.Y36(h.gz),t.Y36(d.SH),t.Y36(l.k))},c.\u0275cmp=t.Xpm({type:c,selectors:[["app-dvir"]],decls:6,vars:4,consts:[[3,"forceOverscroll"],[3,"title"],[1,"dvir-add",3,"click"],["class","dvirs-list",4,"ngIf"],["class","no-data",4,"ngIf"],[1,"dvirs-list"],[3,"dvir","click",4,"ngFor","ngForOf"],[3,"dvir","click"],[1,"no-data"]],template:function(a,u){1&a&&(t.TgZ(0,"ion-content",0)(1,"app-header",1)(2,"div",2),t.NdJ("click",function(){return u.insertDvir()}),t._uU(3,"+"),t.qZA()(),t.YNc(4,y,2,1,"div",3),t.YNc(5,M,2,0,"div",4),t.qZA()),2&a&&(t.Q6J("forceOverscroll",!1),t.xp6(1),t.Q6J("title","Select Duty Status"),t.xp6(3),t.Q6J("ngIf",0!==u.dvirs.length),t.xp6(1),t.Q6J("ngIf",0===u.dvirs.length))},dependencies:[n.sg,n.O5,d.W2,e.G,m],styles:[".dvirs-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:15px;padding:30px}.dvir-add[_ngcontent-%COMP%]{width:32px;height:32px;font-size:20px;display:flex;justify-content:center;align-items:center;color:var(--gray-25);background-color:var(--primary-600);border-radius:10px}.no-data[_ngcontent-%COMP%]{width:100%;height:calc(100% - 152px);display:flex;justify-content:center;align-items:center}"]}),c})()},4323:(O,f,r)=>{r.r(f),r.d(f,{InspectionPageModule:()=>_});var t=r(6895),h=r(4006),d=r(6114),l=r(4529),n=r(8256),e=r(4382),i=r(3646);const v=[{path:"",component:(()=>{class m{constructor(y,M){this.navCtrl=y,this.databaseService=M,this.logDailies=[],this.bReady=!1}ngOnInit(){this.databaseSubscription=this.databaseService.databaseReadySubject.subscribe(y=>{y&&(this.bReady=y,this.databaseService.getLogDailies().subscribe(M=>{this.logDailies=M,this.LogDailiesId=this.logDailies[0].logDailyId,console.log(this.LogDailiesId)}))})}onStartInspectionClick(){this.navCtrl.navigateForward(["/inspection-preview",{logId:this.LogDailiesId,page:"inspection"}])}onSendLogsClick(){this.navCtrl.navigateForward("/send-logs")}ionViewWillLeave(){this.databaseSubscription&&this.databaseSubscription.unsubscribe()}}return m.\u0275fac=function(y){return new(y||m)(n.Y36(d.SH),n.Y36(e.k))},m.\u0275cmp=n.Xpm({type:m,selectors:[["app-inspection"]],decls:26,vars:2,consts:[[3,"forceOverscroll"],[3,"title"],[1,"edit-form","padding-g"],[1,"flex-b"],[1,"subtitle"],[1,"btn","primary-btn",3,"click"],[1,"btn","secondary-btn"],[1,"text-2"]],template:function(y,M){1&y&&(n.TgZ(0,"ion-content",0),n._UZ(1,"app-header",1),n.TgZ(2,"div",2)(3,"div",3)(4,"p",4),n._uU(5,"Inspection"),n.qZA(),n.TgZ(6,"button",5),n.NdJ("click",function(){return M.onStartInspectionClick()}),n._uU(7,"Start Inspection"),n.qZA()(),n.TgZ(8,"p",4),n._uU(9,"Inspect logs for the 24-hour period and the previous days for one HOS cycle"),n.qZA(),n.TgZ(10,"button",6),n._uU(11,"7 Days + Today"),n.qZA(),n.TgZ(12,"p",7),n._uU(13,"Press on \u201cStart Inspection\u201d Button and give your phone to the officer"),n.qZA(),n._UZ(14,"hr"),n.TgZ(15,"div",3)(16,"p",4),n._uU(17,"Send Logs"),n.qZA(),n.TgZ(18,"button",5),n.NdJ("click",function(){return M.onSendLogsClick()}),n._uU(19,"Send Logs"),n.qZA()(),n.TgZ(20,"p",4),n._uU(21,"Send logs for 24-hour period and the previous days for one HOS cycle"),n.qZA(),n.TgZ(22,"button",6),n._uU(23,"7 Days + Today"),n.qZA(),n.TgZ(24,"p",7),n._uU(25,"Send your logs to the officer if they request"),n.qZA()()()),2&y&&(n.Q6J("forceOverscroll",!1),n.xp6(1),n.Q6J("title","DOT Inspection"))},dependencies:[d.W2,i.G],styles:[".edit-form[_ngcontent-%COMP%]{overflow:hidden}.btn[_ngcontent-%COMP%]{align-self:center;border-radius:30px;padding:10px 15px}hr[_ngcontent-%COMP%]{width:100%;height:1px;background-color:#e4e7ec}"]}),m})()}];let p=(()=>{class m{}return m.\u0275fac=function(y){return new(y||m)},m.\u0275mod=n.oAB({type:m}),m.\u0275inj=n.cJS({imports:[l.Bz.forChild(v),l.Bz]}),m})();var C=r(4546);let _=(()=>{class m{}return m.\u0275fac=function(y){return new(y||m)},m.\u0275mod=n.oAB({type:m}),m.\u0275inj=n.cJS({imports:[t.ez,h.u5,d.Pc,p,C.y]}),m})()},2505:(O,f,r)=>{r.r(f),r.d(f,{OthersPageModule:()=>M});var t=r(6895),h=r(4006),d=r(6114),l=r(4529),n=r(5861),e=r(8256),i=r(4382),s=r(9386),v=r(7219),p=r(849),C=r(3646);const m=[{path:"",component:(()=>{class g{constructor(o,a,u,x,b){this.navCtrl=o,this.databaseService=a,this.dashboardService=u,this.internetService=x,this.storage=b,this.logHistories=[],this.networkStatus=!1,this.TimeZoneCity="",this.vehicleId="",this.driverId="",this.companyId="",this.bReady=!1}ngOnInit(){var o=this;return(0,n.Z)(function*(){console.log("init hos"),o.vehicleId=yield o.storage.get("vehicleId"),o.driverId=yield o.storage.get("driverId"),o.companyId=yield o.storage.get("companyId"),o.TimeZoneCity=yield o.storage.get("TimeZoneCity"),o.bAuthorized=yield o.storage.get("bAuthorized"),o.databaseSubscription=o.databaseService.databaseReadySubject.subscribe(a=>{a&&(o.bReady=a,o.databaseService.getLogHistories().subscribe(u=>{o.logHistories=u}))}),o.networkSub=o.internetService.internetStatus$.subscribe(a=>{o.networkStatus=a,console.log("Intenet Status"+a)})})()}onVehicleClick(){localStorage.setItem("showBackButton",JSON.stringify(!0)),this.navCtrl.navigateForward("/select-vehicle")}onCoDriverClick(){this.navCtrl.navigateForward("/co-driver")}onAccountClick(){this.navCtrl.navigateForward("/account")}onRulesClick(){this.navCtrl.navigateForward("/rules")}onInformationClick(){this.navCtrl.navigateForward("/information")}onLogoutClick(){var o=this;if(!0===this.bAuthorized){const a=this.logHistories[this.logHistories.length-1];a.DateEnd=(0,t.p6)((new Date).toLocaleString("en-US",{timeZone:this.TimeZoneCity}),"yyyy-MM-ddTHH:mm:ss","en_US");let u={City:"",CoDriverId:"",Comment:"",CountryCode:"",DataDiagnosticEvent:!1,DateBgn:(0,t.p6)((new Date).toLocaleString("en-US",{timeZone:this.TimeZoneCity}),"yyyy-MM-ddTHH:mm:ss","en_US"),DateEnd:(0,t.p6)((new Date).toLocaleString("en-US",{timeZone:this.TimeZoneCity}),"yyyy-MM-ddTHH:mm:ss","en_US"),DistanceSince:0,DriverId:this.driverId,ELDId:"00000000-0000-0000-0000-000000000000",EngineHours:0,EventDataCheck:"",EventRecordOriginCode:"DRIVER",EventRecordOriginName:"Driver",EventRecordStatusCode:"ACTIVE",EventRecordStatusName:"Active",EventSequenceNumber:a?a.EventSequenceNumber+1:1,EventTypeCode:"LOGOUT",EventTypeName:"Logout",EventTypeType:"LOGOUT",Latitude:0,LocationDescription:"2mi from Chisinau, Chisinau",LocationDescriptionManual:"",LocationSourceCode:"AUTOMATIC",LocationSourceName:"Location generated when connected to ECM",LogDailiesId:"",LogHistoriesId:this.uuidv4(),Longitude:0,Malfunction:!1,Odometer:0,PositioningCode:"AUTOMATIC",PositioningName:"Automatic",SendLogToInspector:!1,StateProvinceCode:"",VehicleId:this.vehicleId};this.logHistories.push(u),this.storage.set("bAuthorized",!1),this.storage.set("logHistories",this.logHistories),this.dashboardService.updateLogHistory(u).subscribe(x=>{console.log("Logout LogHistory is updated on server:",x)},function(){var x=(0,n.Z)(function*(b){console.log("Internet Status"+o.networkStatus);let T={url:"api/eldDashboard/UploadLogDailies",body:u},E=yield o.storage.get("offlineArray");E.push(T),yield o.storage.set("offlineArray",E),console.log("Logout LogHistory Pushed in offlineArray")});return function(b){return x.apply(this,arguments)}}()),this.dashboardService.updateLogHistory(a).subscribe(x=>{console.log("Predposlednii LogHistory is updated on server:",x)},function(){var x=(0,n.Z)(function*(b){console.log("Internet Status"+o.networkStatus);let T={url:"api/eldDashboard/UploadLogHistories",body:a},E=yield o.storage.get("offlineArray");E.push(T),yield o.storage.set("offlineArray",E),console.log("Predposlednii LogHistory Pushed in offlineArray")});return function(b){return x.apply(this,arguments)}}())}this.storage.remove("accessToken"),this.storage.remove("pickedVehicle"),this.navCtrl.navigateForward("/login")}uuidv4(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(o){const a=16*Math.random()|0;return("x"==o?a:3&a|8).toString(16)})}ionViewWillLeave(){this.databaseSubscription&&this.databaseSubscription.unsubscribe(),this.networkSub.unsubscribe()}}return g.\u0275fac=function(o){return new(o||g)(e.Y36(d.SH),e.Y36(i.k),e.Y36(s.s),e.Y36(v.W),e.Y36(p.K))},g.\u0275cmp=e.Xpm({type:g,selectors:[["app-others"]],decls:30,vars:1,consts:[[3,"title"],[1,"edit-form","padding-g"],[1,"other-items"],[1,"other-item",3,"click"],["src","assets/icon/truck.svg","alt","vehicle"],[1,"text-14-600"],["src","assets/icon/co-driver.svg","alt","co-driver"],["src","assets/icon/my-account.svg","alt","my account"],["src","assets/icon/rules.svg","alt","rules"],["src","assets/icon/information.svg","alt","information"],["src","assets/icon/logout.svg","alt","logout"]],template:function(o,a){1&o&&(e.TgZ(0,"ion-content"),e._UZ(1,"app-header",0),e.TgZ(2,"div",1)(3,"div",2)(4,"div",3),e.NdJ("click",function(){return a.onVehicleClick()}),e._UZ(5,"img",4),e.TgZ(6,"p",5),e._uU(7,"Vehicle"),e.qZA()(),e.TgZ(8,"div",3),e.NdJ("click",function(){return a.onCoDriverClick()}),e._UZ(9,"img",6),e.TgZ(10,"p",5),e._uU(11,"Co-Driver"),e.qZA()()(),e.TgZ(12,"div",2)(13,"div",3),e.NdJ("click",function(){return a.onAccountClick()}),e._UZ(14,"img",7),e.TgZ(15,"p",5),e._uU(16,"My Account"),e.qZA()(),e.TgZ(17,"div",3),e.NdJ("click",function(){return a.onRulesClick()}),e._UZ(18,"img",8),e.TgZ(19,"p",5),e._uU(20,"Rules"),e.qZA()()(),e.TgZ(21,"div",2)(22,"div",3),e.NdJ("click",function(){return a.onInformationClick()}),e._UZ(23,"img",9),e.TgZ(24,"p",5),e._uU(25,"Information"),e.qZA()(),e.TgZ(26,"div",3),e.NdJ("click",function(){return a.onLogoutClick()}),e._UZ(27,"img",10),e.TgZ(28,"p",5),e._uU(29,"Logout"),e.qZA()()()()()),2&o&&(e.xp6(1),e.Q6J("title","Others"))},dependencies:[d.W2,C.G],styles:[".other-items[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;gap:20px}.other-items[_ngcontent-%COMP%]   .other-item[_ngcontent-%COMP%]{flex-grow:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;background-color:var(--gray-100);height:100px;max-width:calc(50% - 10px);border-radius:20px;padding:20px}.edit-form[_ngcontent-%COMP%]{gap:20px}"]}),g})()}];let w=(()=>{class g{}return g.\u0275fac=function(o){return new(o||g)},g.\u0275mod=e.oAB({type:g}),g.\u0275inj=e.cJS({imports:[l.Bz.forChild(m),l.Bz]}),g})();var y=r(4546);let M=(()=>{class g{}return g.\u0275fac=function(o){return new(o||g)},g.\u0275mod=e.oAB({type:g}),g.\u0275inj=e.cJS({imports:[t.ez,h.u5,d.Pc,w,y.y]}),g})()}}]);