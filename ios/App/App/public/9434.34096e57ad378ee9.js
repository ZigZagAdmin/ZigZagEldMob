"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[9434],{9434:(v,p,r)=>{r.r(p),r.d(p,{ion_loading:()=>x});var m=r(5861),t=r(9816),c=r(6406),g=r(3982),b=r(3577),l=r(1397),y=r(2854),n=r(9613);r(3457);const d=i=>{const o=(0,n.c)(),e=(0,n.c)(),s=(0,n.c)();return e.addElement(i.querySelector("ion-backdrop")).fromTo("opacity",.01,"var(--backdrop-opacity)").beforeStyles({"pointer-events":"none"}).afterClearStyles(["pointer-events"]),s.addElement(i.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.01,transform:"scale(1.1)"},{offset:1,opacity:1,transform:"scale(1)"}]),o.addElement(i).easing("ease-in-out").duration(200).addAnimation([e,s])},u=i=>{const o=(0,n.c)(),e=(0,n.c)(),s=(0,n.c)();return e.addElement(i.querySelector("ion-backdrop")).fromTo("opacity","var(--backdrop-opacity)",0),s.addElement(i.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.99,transform:"scale(1)"},{offset:1,opacity:0,transform:"scale(0.9)"}]),o.addElement(i).easing("ease-in-out").duration(200).addAnimation([e,s])},f=i=>{const o=(0,n.c)(),e=(0,n.c)(),s=(0,n.c)();return e.addElement(i.querySelector("ion-backdrop")).fromTo("opacity",.01,"var(--backdrop-opacity)").beforeStyles({"pointer-events":"none"}).afterClearStyles(["pointer-events"]),s.addElement(i.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.01,transform:"scale(1.1)"},{offset:1,opacity:1,transform:"scale(1)"}]),o.addElement(i).easing("ease-in-out").duration(200).addAnimation([e,s])},h=i=>{const o=(0,n.c)(),e=(0,n.c)(),s=(0,n.c)();return e.addElement(i.querySelector("ion-backdrop")).fromTo("opacity","var(--backdrop-opacity)",0),s.addElement(i.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.99,transform:"scale(1)"},{offset:1,opacity:0,transform:"scale(0.9)"}]),o.addElement(i).easing("ease-in-out").duration(200).addAnimation([e,s])},x=class{constructor(i){(0,t.r)(this,i),this.didPresent=(0,t.d)(this,"ionLoadingDidPresent",7),this.willPresent=(0,t.d)(this,"ionLoadingWillPresent",7),this.willDismiss=(0,t.d)(this,"ionLoadingWillDismiss",7),this.didDismiss=(0,t.d)(this,"ionLoadingDidDismiss",7),this.didPresentShorthand=(0,t.d)(this,"didPresent",7),this.willPresentShorthand=(0,t.d)(this,"willPresent",7),this.willDismissShorthand=(0,t.d)(this,"willDismiss",7),this.didDismissShorthand=(0,t.d)(this,"didDismiss",7),this.delegateController=(0,l.d)(this),this.triggerController=(0,l.e)(),this.customHTMLEnabled=c.c.get("innerHTMLTemplatesEnabled",g.E),this.presented=!1,this.onBackdropTap=()=>{this.dismiss(void 0,l.B)},this.overlayIndex=void 0,this.delegate=void 0,this.hasController=!1,this.keyboardClose=!0,this.enterAnimation=void 0,this.leaveAnimation=void 0,this.message=void 0,this.cssClass=void 0,this.duration=0,this.backdropDismiss=!1,this.showBackdrop=!0,this.spinner=void 0,this.translucent=!1,this.animated=!0,this.htmlAttributes=void 0,this.isOpen=!1,this.trigger=void 0}onIsOpenChange(i,o){!0===i&&!1===o?this.present():!1===i&&!0===o&&this.dismiss()}triggerChanged(){const{trigger:i,el:o,triggerController:e}=this;i&&e.addClickListener(o,i)}connectedCallback(){(0,l.j)(this.el),this.triggerChanged()}componentWillLoad(){if(void 0===this.spinner){const i=(0,c.b)(this);this.spinner=c.c.get("loadingSpinner",c.c.get("spinner","ios"===i?"lines":"crescent"))}}componentDidLoad(){!0===this.isOpen&&(0,b.r)(()=>this.present())}disconnectedCallback(){this.triggerController.removeClickListener()}present(){var i=this;return(0,m.Z)(function*(){void 0!==i.currentTransition&&(yield i.currentTransition),yield i.delegateController.attachViewToDom(),i.currentTransition=(0,l.f)(i,"loadingEnter",d,f),yield i.currentTransition,i.duration>0&&(i.durationTimeout=setTimeout(()=>i.dismiss(),i.duration+10)),i.currentTransition=void 0})()}dismiss(i,o){var e=this;return(0,m.Z)(function*(){e.durationTimeout&&clearTimeout(e.durationTimeout),e.currentTransition=(0,l.g)(e,i,o,"loadingLeave",u,h);const s=yield e.currentTransition;return s&&e.delegateController.removeViewFromDom(),s})()}onDidDismiss(){return(0,l.h)(this.el,"ionLoadingDidDismiss")}onWillDismiss(){return(0,l.h)(this.el,"ionLoadingWillDismiss")}renderLoadingMessage(i){const{customHTMLEnabled:o,message:e}=this;return o?(0,t.h)("div",{class:"loading-content",id:i,innerHTML:(0,g.a)(e)}):(0,t.h)("div",{class:"loading-content",id:i},e)}render(){const{message:i,spinner:o,htmlAttributes:e,overlayIndex:s}=this,E=(0,c.b)(this),_=`loading-${s}-msg`;return(0,t.h)(t.H,Object.assign({role:"dialog","aria-modal":"true","aria-labelledby":void 0!==i?_:null,tabindex:"-1"},e,{style:{zIndex:`${4e4+this.overlayIndex}`},onIonBackdropTap:this.onBackdropTap,class:Object.assign(Object.assign({},(0,y.g)(this.cssClass)),{[E]:!0,"overlay-hidden":!0,"loading-translucent":this.translucent})}),(0,t.h)("ion-backdrop",{visible:this.showBackdrop,tappable:this.backdropDismiss}),(0,t.h)("div",{tabindex:"0"}),(0,t.h)("div",{class:"loading-wrapper ion-overlay-wrapper"},o&&(0,t.h)("div",{class:"loading-spinner"},(0,t.h)("ion-spinner",{name:o,"aria-hidden":"true"})),void 0!==i&&this.renderLoadingMessage(_)),(0,t.h)("div",{tabindex:"0"}))}get el(){return(0,t.f)(this)}static get watchers(){return{isOpen:["onIsOpenChange"],trigger:["triggerChanged"]}}};x.style={ios:".sc-ion-loading-ios-h{--min-width:auto;--width:auto;--min-height:auto;--height:auto;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;outline:none;font-family:var(--ion-font-family, inherit);contain:strict;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-ion-loading-ios-h{display:none}.loading-wrapper.sc-ion-loading-ios{display:-ms-flexbox;display:flex;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);opacity:0;z-index:10}ion-spinner.sc-ion-loading-ios{color:var(--spinner-color)}.sc-ion-loading-ios-h{--background:var(--ion-overlay-background-color, var(--ion-color-step-100, #f9f9f9));--max-width:270px;--max-height:90%;--spinner-color:var(--ion-color-step-600, #666666);--backdrop-opacity:var(--ion-backdrop-opacity, 0.3);color:var(--ion-text-color, #000);font-size:14px}.loading-wrapper.sc-ion-loading-ios{border-radius:8px;-webkit-padding-start:34px;padding-inline-start:34px;-webkit-padding-end:34px;padding-inline-end:34px;padding-top:24px;padding-bottom:24px}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){.loading-translucent.sc-ion-loading-ios-h .loading-wrapper.sc-ion-loading-ios{background-color:rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}}.loading-content.sc-ion-loading-ios{font-weight:bold}.loading-spinner.sc-ion-loading-ios+.loading-content.sc-ion-loading-ios{-webkit-margin-start:16px;margin-inline-start:16px}",md:".sc-ion-loading-md-h{--min-width:auto;--width:auto;--min-height:auto;--height:auto;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;outline:none;font-family:var(--ion-font-family, inherit);contain:strict;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-ion-loading-md-h{display:none}.loading-wrapper.sc-ion-loading-md{display:-ms-flexbox;display:flex;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);opacity:0;z-index:10}ion-spinner.sc-ion-loading-md{color:var(--spinner-color)}.sc-ion-loading-md-h{--background:var(--ion-color-step-50, #f2f2f2);--max-width:280px;--max-height:90%;--spinner-color:var(--ion-color-primary, #3880ff);--backdrop-opacity:var(--ion-backdrop-opacity, 0.32);color:var(--ion-color-step-850, #262626);font-size:14px}.loading-wrapper.sc-ion-loading-md{border-radius:2px;-webkit-padding-start:24px;padding-inline-start:24px;-webkit-padding-end:24px;padding-inline-end:24px;padding-top:24px;padding-bottom:24px;-webkit-box-shadow:0 16px 20px rgba(0, 0, 0, 0.4);box-shadow:0 16px 20px rgba(0, 0, 0, 0.4)}.loading-spinner.sc-ion-loading-md+.loading-content.sc-ion-loading-md{-webkit-margin-start:16px;margin-inline-start:16px}"}},2854:(v,p,r)=>{r.d(p,{c:()=>c,g:()=>b,h:()=>t,o:()=>y});var m=r(5861);const t=(n,a)=>null!==a.closest(n),c=(n,a)=>"string"==typeof n&&n.length>0?Object.assign({"ion-color":!0,[`ion-color-${n}`]:!0},a):a,b=n=>{const a={};return(n=>void 0!==n?(Array.isArray(n)?n:n.split(" ")).filter(d=>null!=d).map(d=>d.trim()).filter(d=>""!==d):[])(n).forEach(d=>a[d]=!0),a},l=/^[a-z][a-z0-9+\-.]*:/,y=function(){var n=(0,m.Z)(function*(a,d,u,f){if(null!=a&&"#"!==a[0]&&!l.test(a)){const h=document.querySelector("ion-router");if(h)return null!=d&&d.preventDefault(),h.push(a,u,f)}return!1});return function(d,u,f,h){return n.apply(this,arguments)}}()}}]);