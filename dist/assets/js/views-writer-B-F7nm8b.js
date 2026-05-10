var eo=Object.defineProperty,to=Object.defineProperties;var lo=Object.getOwnPropertyDescriptors;var Sn=Object.getOwnPropertySymbols;var no=Object.prototype.hasOwnProperty,ao=Object.prototype.propertyIsEnumerable;var In=(_,h,k)=>h in _?eo(_,h,{enumerable:!0,configurable:!0,writable:!0,value:k}):_[h]=k,Me=(_,h)=>{for(var k in h||(h={}))no.call(h,k)&&In(_,k,h[k]);if(Sn)for(var k of Sn(h))ao.call(h,k)&&In(_,k,h[k]);return _},St=(_,h)=>to(_,lo(h));var H=(_,h,k)=>new Promise((P,ne)=>{var Q=E=>{try{z(k.next(E))}catch(Z){ne(Z)}},x=E=>{try{z(k.throw(E))}catch(Z){ne(Z)}},z=E=>E.done?P(E.value):Promise.resolve(E.value).then(Q,x);z((k=k.apply(_,h)).next())});import{x as Tn,b as Jl,v as zn,F as so,a as Kl,at as Ot,aw as kl,i as An,j as Pn,n as Xl,p as Yl,t as It,l as oo,O as io,W as xl,E as y,av as ro,ap as uo,z as co,ax as vo,L as po,S as mo,T as fo,aL as Cl,an as go,ao as yo,B as ol,M as ho,G as Bl,H as Nl,aM as jl,aX as _o,b2 as Yt,aa as ql,a3 as wo,aJ as bo,aK as Co,b8 as $o,q as ko,aT as xo,aH as Vo,g as So,aE as Io,aF as To,be as Ll,y as zo,s as Dn,f as Mt,N as Ao,ai as Po,by as Do}from"./element-plus-C_7IrEJO.js";import"./vendor-DXLg7Vhh.js";import{a as Vl,u as Zl}from"./components-Z0l7V6Vo.js";import{Y as Mo,c as Eo,b as Uo,a as Fo,Z as Ro,_ as Wo,$ as Oo}from"./config-ClvvgGln.js";import{m as Bo}from"./marked-DvBXB48e.js";import{b as qe,w as se}from"./services-BoXrtPHW.js";import{r as g,M as m,P as l,S as _e,a0 as t,W as n,F as ie,ae as re,Z as I,$ as v,c as be,L as u,_ as r,u as N,O as G,d as Rt,n as Ql,a5 as Mn,X as Ct,a1 as Bt,j as No,aB as En,ay as en,ac as Gl,aq as jo,p as zt,m as qo,z as Go,a2 as il,R as Zt,ar as Hl,Y as Lo,ai as Ho}from"./vue-vendor-COwbQDW_.js";import{T as Jo,E as Ko}from"./editor-RqwkOT35.js";import{m as Wt}from"./views-analysis-C7_ihQEJ.js";const Xo={class:"master-creation"},Yo={class:"step-nav"},Zo={key:0,class:"step-content"},Qo={class:"category-tabs"},ei={class:"genre-grid"},ti=["onClick"],li={class:"genre-icon"},ni={class:"genre-name"},ai={class:"genre-desc"},si={class:"genre-tags"},oi={class:"step-actions"},ii={key:1,class:"step-content"},ri={class:"category-tabs"},ui={class:"style-grid"},di=["onClick"],ci={class:"style-header"},vi={class:"style-avatar"},pi={class:"style-info"},mi={class:"style-name"},fi={class:"style-award"},gi={class:"style-desc"},yi={class:"style-techniques"},hi={class:"step-actions"},_i={key:2,class:"step-content"},wi={class:"technique-categories"},bi={class:"group-title"},Ci={class:"technique-list"},$i=["onClick"],ki={class:"technique-header"},xi={class:"technique-icon"},Vi={class:"technique-name"},Si={class:"technique-desc"},Ii={class:"step-actions"},Ti={key:3,class:"step-content"},zi={class:"config-summary"},Ai={key:0,class:"summary-item"},Pi={class:"summary-value"},Di={key:1,class:"summary-item"},Mi={class:"summary-value"},Ei={key:2,class:"summary-item"},Ui={class:"summary-value"},Fi={key:0,class:"creation-progress"},Ri={class:"progress-steps"},Wi={class:"progress-icon"},Oi={class:"progress-label"},Bi={class:"progress-message"},Ni={key:1,class:"creation-result"},ji={class:"result-header"},qi={class:"result-actions"},Gi={key:0,class:"review-section"},Li=["innerHTML"],Hi={class:"result-content"},Ji=["innerHTML"],Ki={class:"step-actions"},Xi={__name:"MasterCreation",setup(_){const h=Zl(),k=g(1),P=g("网络小说"),ne=g(null),Q=g(Ro()),x=g("all"),z=g(null),E=g(Wo()),Z=g([]),Ae=g(Mo()),ye=g({theme:"",outline:"",wordCount:2e3,refinementMode:"full"}),Ve=g(!1),Ce=g(""),ue=g(null),ve=g([{label:"📝 生成初稿",status:"waiting"},{label:"🔧 应用技法",status:"waiting"},{label:"✨ 深度润色",status:"waiting"},{label:"🏆 终审评审",status:"waiting"}]),Pe=be(()=>Q.value.filter(j=>j.category===P.value)),xe=be(()=>x.value==="all"?E.value:E.value.filter(j=>j.category===x.value)),Ee=()=>{ne.value=null},nt=()=>{},Ge=j=>{const w=Z.value.indexOf(j);w>-1?Z.value.splice(w,1):Z.value.push(j)},O=()=>{k.value<4&&k.value++},X=()=>{k.value>1&&k.value--},me=j=>{const w=Eo(j);return w?`${w.icon} ${w.name}`:""},$e=j=>{const w=Uo(j);return w?`${w.avatar} ${w.name}`:""},he=j=>{const w=Fo(j);return w?`${w.icon} ${w.name}`:""},de=j=>j?Bo(j):"",Xe=()=>H(this,null,function*(){if(!ye.value.theme){y.warning("请输入作品主题");return}if(!h.isApiConfigured){y.warning("请先配置API密钥");return}Ve.value=!0,ue.value=null,ve.value=[{label:"📝 生成初稿",status:"waiting"},{label:"🔧 应用技法",status:"waiting"},{label:"✨ 深度润色",status:"waiting"},{label:"🏆 终审评审",status:"waiting"}];try{const j={genreId:ne.value,styleId:z.value,techniqueIds:Z.value,theme:ye.value.theme,outline:ye.value.outline,characters:h.characters,worldSettings:h.worldSettings,wordCount:ye.value.wordCount,refinementMode:ye.value.refinementMode},w=yield h.masterCreation(j,oe=>{Ce.value=oe.message,oe.step===1?ve.value[0].status=oe.status==="completed"?"completed":"generating":oe.step===2?(ve.value[0].status="completed",ve.value[1].status=oe.status==="completed"?"completed":"generating"):oe.step===3?(ve.value[1].status="completed",ve.value[2].status=oe.status==="completed"?"completed":"generating"):oe.step===4&&(ve.value[2].status="completed",ve.value[3].status=oe.status==="completed"?"completed":"generating")});w&&(ue.value=w,ve.value.forEach(oe=>oe.status="completed"),y.success("大师创作完成！"))}catch(j){y.error("创作失败: "+j.message)}finally{Ve.value=!1}}),ee=()=>{var j;(j=ue.value)!=null&&j.content&&(navigator.clipboard.writeText(ue.value.content),y.success("内容已复制到剪贴板"))},C=()=>{ue.value=null,ve.value.forEach(j=>j.status="waiting"),Ce.value=""};return(j,w)=>{const oe=so,Se=Tn,ke=Kl,Re=Jl,Qe=Pn,K=An,$=Yl,L=Xl,J=zn;return u(),m("div",Xo,[l("div",Yo,[l("div",{class:_e(["step-item",{active:k.value>=1,completed:k.value>1}])},[...w[8]||(w[8]=[l("div",{class:"step-number"},"1",-1),l("div",{class:"step-label"},"选择类型",-1)])],2),l("div",{class:_e(["step-line",{active:k.value>1}])},null,2),l("div",{class:_e(["step-item",{active:k.value>=2,completed:k.value>2}])},[...w[9]||(w[9]=[l("div",{class:"step-number"},"2",-1),l("div",{class:"step-label"},"选择风格",-1)])],2),l("div",{class:_e(["step-line",{active:k.value>2}])},null,2),l("div",{class:_e(["step-item",{active:k.value>=3,completed:k.value>3}])},[...w[10]||(w[10]=[l("div",{class:"step-number"},"3",-1),l("div",{class:"step-label"},"文学技法",-1)])],2),l("div",{class:_e(["step-line",{active:k.value>3}])},null,2),l("div",{class:_e(["step-item",{active:k.value>=4}])},[...w[11]||(w[11]=[l("div",{class:"step-number"},"4",-1),l("div",{class:"step-label"},"开始创作",-1)])],2)]),k.value===1?(u(),m("div",Zo,[w[17]||(w[17]=l("h2",{class:"section-title"},"📚 选择创作类型",-1)),w[18]||(w[18]=l("p",{class:"section-desc"},"选择你要创作的作品类型，系统会为你匹配最佳的创作模板",-1)),l("div",Qo,[t(Se,{modelValue:P.value,"onUpdate:modelValue":w[0]||(w[0]=B=>P.value=B),onChange:Ee},{default:n(()=>[t(oe,{label:"网络小说"},{default:n(()=>[...w[12]||(w[12]=[r("网络小说",-1)])]),_:1}),t(oe,{label:"严肃文学"},{default:n(()=>[...w[13]||(w[13]=[r("严肃文学",-1)])]),_:1}),t(oe,{label:"诗歌"},{default:n(()=>[...w[14]||(w[14]=[r("诗歌",-1)])]),_:1}),t(oe,{label:"剧本"},{default:n(()=>[...w[15]||(w[15]=[r("剧本",-1)])]),_:1})]),_:1},8,["modelValue"])]),l("div",ei,[(u(!0),m(ie,null,re(Pe.value,B=>(u(),m("div",{key:B.id,class:_e(["genre-card",{selected:ne.value===B.id}]),onClick:Ie=>ne.value=B.id},[l("div",li,v(B.icon),1),l("div",ni,v(B.name),1),l("div",ai,v(B.description),1),l("div",si,[(u(!0),m(ie,null,re(B.bestFor,Ie=>(u(),m("span",{key:Ie,class:"genre-tag"},v(Ie),1))),128))])],10,ti))),128))]),l("div",oi,[t(Re,{type:"primary",size:"large",disabled:!ne.value,onClick:O},{default:n(()=>[w[16]||(w[16]=r(" 下一步：选择风格 ",-1)),t(ke,null,{default:n(()=>[t(N(Ot))]),_:1})]),_:1},8,["disabled"])])])):I("",!0),k.value===2?(u(),m("div",ii,[w[26]||(w[26]=l("h2",{class:"section-title"},"🎨 选择大师风格",-1)),w[27]||(w[27]=l("p",{class:"section-desc"},"选择一位文学大师的风格作为创作参考，AI将模仿其独特的写作手法",-1)),l("div",ri,[t(Se,{modelValue:x.value,"onUpdate:modelValue":w[1]||(w[1]=B=>x.value=B),onChange:nt},{default:n(()=>[t(oe,{label:"all"},{default:n(()=>[...w[19]||(w[19]=[r("全部",-1)])]),_:1}),t(oe,{label:"严肃文学"},{default:n(()=>[...w[20]||(w[20]=[r("严肃文学",-1)])]),_:1}),t(oe,{label:"世界文学"},{default:n(()=>[...w[21]||(w[21]=[r("世界文学",-1)])]),_:1}),t(oe,{label:"网络小说"},{default:n(()=>[...w[22]||(w[22]=[r("网络小说",-1)])]),_:1})]),_:1},8,["modelValue"])]),l("div",ui,[(u(!0),m(ie,null,re(xe.value,B=>(u(),m("div",{key:B.id,class:_e(["style-card",{selected:z.value===B.id}]),onClick:Ie=>z.value=B.id},[l("div",ci,[l("span",vi,v(B.avatar),1),l("div",pi,[l("div",mi,v(B.name),1),l("div",fi,v(B.award),1)])]),l("div",gi,v(B.description),1),l("div",yi,[(u(!0),m(ie,null,re(B.techniques,Ie=>(u(),m("span",{key:Ie,class:"tech-tag"},v(Ie),1))),128))])],10,di))),128))]),l("div",hi,[t(Re,{size:"large",onClick:X},{default:n(()=>[t(ke,null,{default:n(()=>[t(N(kl))]),_:1}),w[23]||(w[23]=r(" 上一步 ",-1))]),_:1}),t(Re,{type:"primary",size:"large",disabled:!z.value,onClick:O},{default:n(()=>[w[24]||(w[24]=r(" 下一步：文学技法 ",-1)),t(ke,null,{default:n(()=>[t(N(Ot))]),_:1})]),_:1},8,["disabled"]),t(Re,{size:"large",onClick:w[2]||(w[2]=B=>{z.value=null,O()})},{default:n(()=>[w[25]||(w[25]=r(" 跳过 ",-1)),t(ke,null,{default:n(()=>[t(N(Ot))]),_:1})]),_:1})])])):I("",!0),k.value===3?(u(),m("div",_i,[w[31]||(w[31]=l("h2",{class:"section-title"},"🔧 选择文学技法",-1)),w[32]||(w[32]=l("p",{class:"section-desc"},"选择要应用的文学技法，可多选。技法将在创作后自动应用到作品中",-1)),l("div",wi,[(u(!0),m(ie,null,re(Ae.value,(B,Ie)=>(u(),m("div",{key:Ie,class:"technique-group"},[l("h3",bi,v(Ie),1),l("div",Ci,[(u(!0),m(ie,null,re(B,Ue=>(u(),m("div",{key:Ue.id,class:_e(["technique-card",{selected:Z.value.includes(Ue.id)}]),onClick:pe=>Ge(Ue.id)},[l("div",ki,[l("span",xi,v(Ue.icon),1),l("span",Vi,v(Ue.name),1)]),l("div",Si,v(Ue.description),1)],10,$i))),128))])]))),128))]),l("div",Ii,[t(Re,{size:"large",onClick:X},{default:n(()=>[t(ke,null,{default:n(()=>[t(N(kl))]),_:1}),w[28]||(w[28]=r(" 上一步 ",-1))]),_:1}),t(Re,{type:"primary",size:"large",onClick:O},{default:n(()=>[w[29]||(w[29]=r(" 下一步：开始创作 ",-1)),t(ke,null,{default:n(()=>[t(N(Ot))]),_:1})]),_:1}),t(Re,{size:"large",onClick:w[3]||(w[3]=B=>{Z.value=[],O()})},{default:n(()=>[w[30]||(w[30]=r(" 跳过 ",-1)),t(ke,null,{default:n(()=>[t(N(Ot))]),_:1})]),_:1})])])):I("",!0),k.value===4?(u(),m("div",Ti,[w[45]||(w[45]=l("h2",{class:"section-title"},"🚀 开始大师创作",-1)),l("div",zi,[ne.value?(u(),m("div",Ai,[w[33]||(w[33]=l("span",{class:"summary-label"},"创作类型",-1)),l("span",Pi,v(me(ne.value)),1)])):I("",!0),z.value?(u(),m("div",Di,[w[34]||(w[34]=l("span",{class:"summary-label"},"大师风格",-1)),l("span",Mi,v($e(z.value)),1)])):I("",!0),Z.value.length>0?(u(),m("div",Ei,[w[35]||(w[35]=l("span",{class:"summary-label"},"文学技法",-1)),l("span",Ui,v(Z.value.map(B=>he(B)).join("、")),1)])):I("",!0)]),t(J,{model:ye.value,"label-width":"100px",class:"creation-form"},{default:n(()=>[t(K,{label:"作品主题"},{default:n(()=>[t(Qe,{modelValue:ye.value.theme,"onUpdate:modelValue":w[4]||(w[4]=B=>ye.value.theme=B),placeholder:"请输入作品主题，如：一个乡村教师的坚守与孤独",type:"textarea",rows:3},null,8,["modelValue"])]),_:1}),t(K,{label:"作品大纲"},{default:n(()=>[t(Qe,{modelValue:ye.value.outline,"onUpdate:modelValue":w[5]||(w[5]=B=>ye.value.outline=B),placeholder:"可选：输入大纲或故事梗概",type:"textarea",rows:4},null,8,["modelValue"])]),_:1}),t(K,{label:"目标字数"},{default:n(()=>[t(L,{modelValue:ye.value.wordCount,"onUpdate:modelValue":w[6]||(w[6]=B=>ye.value.wordCount=B),style:{width:"200px"}},{default:n(()=>[t($,{label:"500字（短篇片段）",value:500}),t($,{label:"1000字（短篇）",value:1e3}),t($,{label:"2000字（中篇片段）",value:2e3}),t($,{label:"3000字（中篇）",value:3e3}),t($,{label:"5000字（长篇章节）",value:5e3}),t($,{label:"8000字（长篇章节）",value:8e3})]),_:1},8,["modelValue"])]),_:1}),t(K,{label:"精修模式"},{default:n(()=>[t(Se,{modelValue:ye.value.refinementMode,"onUpdate:modelValue":w[7]||(w[7]=B=>ye.value.refinementMode=B)},{default:n(()=>[t(oe,{label:"full"},{default:n(()=>[...w[36]||(w[36]=[r("完整精修（推荐）",-1)])]),_:1}),t(oe,{label:"draft"},{default:n(()=>[...w[37]||(w[37]=[r("仅生成初稿",-1)])]),_:1}),t(oe,{label:"polish"},{default:n(()=>[...w[38]||(w[38]=[r("初稿+润色",-1)])]),_:1})]),_:1},8,["modelValue"]),w[39]||(w[39]=l("div",{class:"form-tip"}," 完整精修：初稿 → 技法应用 → 深度润色 → 终审评审 ",-1))]),_:1})]),_:1},8,["model"]),Ve.value?(u(),m("div",Fi,[l("div",Ri,[(u(!0),m(ie,null,re(ve.value,B=>(u(),m("div",{key:B.label,class:_e(["progress-step",B.status])},[l("div",Wi,[B.status==="completed"?(u(),G(ke,{key:0},{default:n(()=>[t(N(It))]),_:1})):B.status==="generating"?(u(),G(ke,{key:1,class:"spinning"},{default:n(()=>[t(N(oo))]),_:1})):(u(),G(ke,{key:2},{default:n(()=>[t(N(io))]),_:1}))]),l("span",Oi,v(B.label),1)],2))),128))]),l("div",Bi,v(Ce.value),1)])):I("",!0),ue.value?(u(),m("div",Ni,[l("div",ji,[w[42]||(w[42]=l("h3",null,"✅ 创作完成",-1)),l("div",qi,[t(Re,{type:"primary",onClick:ee},{default:n(()=>[...w[40]||(w[40]=[r("复制内容",-1)])]),_:1}),t(Re,{onClick:C},{default:n(()=>[...w[41]||(w[41]=[r("重新创作",-1)])]),_:1})])]),ue.value.review?(u(),m("div",Gi,[w[43]||(w[43]=l("h4",null,"🏆 终审评审报告",-1)),l("div",{class:"review-content",innerHTML:de(ue.value.review)},null,8,Li)])):I("",!0),l("div",Hi,[l("div",{class:"content-text",innerHTML:de(ue.value.content)},null,8,Ji)])])):I("",!0),l("div",Ki,[t(Re,{size:"large",onClick:X},{default:n(()=>[t(ke,null,{default:n(()=>[t(N(kl))]),_:1}),w[44]||(w[44]=r(" 上一步 ",-1))]),_:1}),t(Re,{type:"primary",size:"large",loading:Ve.value,disabled:!ye.value.theme,onClick:Xe},{default:n(()=>[Ve.value?I("",!0):(u(),G(ke,{key:0},{default:n(()=>[t(N(xl))]),_:1})),r(" "+v(Ve.value?"创作中...":"开始大师创作"),1)]),_:1},8,["loading","disabled"])])])):I("",!0)])}}},Yi=Vl(Xi,[["__scopeId","data-v-e5130e27"]]),u1=Object.freeze(Object.defineProperty({__proto__:null,default:Yi},Symbol.toStringTag,{value:"Module"})),Zi={class:"writer-container"},Qi={class:"title-bar"},er={class:"title-left"},tr={class:"novel-title"},lr={class:"tabs-bar"},nr={class:"main-content"},ar={class:"left-panel"},sr={class:"panel-content"},or={class:"card-header"},ir={class:"chapters-list"},rr=["onClick"],ur={class:"chapter-info"},dr={class:"chapter-meta"},cr={class:"chapter-desc chapter-desc-truncated"},vr={class:"chapter-actions"},pr={key:0,class:"empty-chapters"},mr={class:"panel-content"},fr={class:"card-header"},gr={class:"character-actions"},yr={class:"characters-list"},hr=["onClick"],_r={class:"character-avatar"},wr=["src"],br={key:1,class:"default-avatar"},Cr={class:"character-info"},$r={class:"character-meta"},kr={key:1,class:"age-text"},xr={class:"character-desc character-desc-truncated"},Vr={key:1,class:"character-tags"},Sr={class:"character-actions"},Ir={key:0,class:"empty-state"},Tr={class:"panel-content"},zr={class:"card-header"},Ar={class:"world-actions"},Pr={class:"worldview-list"},Dr=["onClick"],Mr={class:"worldview-header"},Er={class:"worldview-description worldview-description-truncated"},Ur={key:1,class:"worldview-description"},Fr={class:"worldview-meta"},Rr={class:"create-time"},Wr={key:0,class:"ai-generated"},Or={class:"worldview-actions"},Br={key:0,class:"empty-state"},Nr={class:"panel-content"},jr={class:"card-header"},qr={class:"corpus-list"},Gr={class:"corpus-content"},Lr={class:"corpus-header"},Hr={class:"corpus-preview corpus-preview-truncated"},Jr={class:"corpus-actions"},Kr={key:0,class:"empty-state"},Xr={class:"panel-content"},Yr={class:"card-header"},Zr={class:"events-timeline"},Qr={class:"event-content"},eu={class:"event-header"},tu={class:"event-actions"},lu={class:"event-desc event-desc-truncated"},nu={class:"event-meta"},au={class:"event-time"},su={key:0,class:"empty-state"},ou={class:"editor-panel"},iu={class:"editor-header"},ru={class:"editor-header-left"},uu={class:"chapter-title"},du={class:"chapter-meta"},cu={class:"word-count"},vu={key:1,class:"saving-indicator"},pu={class:"editor-header-right"},mu={class:"editor-container"},fu={class:"editor-wrapper"},gu={class:"empty-editor"},yu={class:"form-item-with-ai"},hu={class:"form-item-with-ai"},_u={class:"ai-button-group",style:{"margin-top":"8px"}},wu={key:0,style:{"margin-top":"8px"}},bu={class:"form-item-with-ai"},Cu={key:0,class:"streaming-status-card"},$u=["innerHTML"],ku={class:"chapter-generate-content"},xu={class:"generate-config-section"},Vu={class:"config-header"},Su={class:"config-left"},Iu={class:"materials-section"},Tu={class:"section-header"},zu={class:"tab-header"},Au={class:"tab-count"},Pu={class:"materials-grid"},Du=["onClick"],Mu={class:"material-header"},Eu={class:"material-name"},Uu={class:"material-desc"},Fu={class:"material-tags"},Ru={key:0,class:"empty-materials"},Wu={class:"tab-header"},Ou={class:"tab-count"},Bu={class:"materials-grid"},Nu=["onClick"],ju={class:"material-header"},qu={class:"material-name"},Gu={class:"material-desc"},Lu={key:0,class:"empty-materials"},Hu={class:"tab-header"},Ju={class:"tab-count"},Ku={class:"materials-grid"},Xu=["onClick"],Yu={class:"material-header"},Zu={class:"material-name"},Qu={class:"material-desc"},ed={key:0,class:"empty-materials"},td={class:"tab-header"},ld={class:"tab-count"},nd={class:"materials-grid"},ad=["onClick"],sd={class:"material-header"},od={class:"material-name"},id={class:"material-desc"},rd={class:"material-meta"},ud={class:"event-time"},dd={key:0,class:"empty-materials"},cd={class:"tab-header"},vd={class:"tab-count"},pd={class:"context-tab-actions"},md={class:"materials-list"},fd=["onClick"],gd={class:"chapter-material-header"},yd={class:"chapter-material-name"},hd={class:"chapter-material-tags"},_d={class:"chapter-material-desc"},wd={key:0,class:"chapter-material-content"},bd={class:"content-preview"},Cd={key:0,class:"empty-materials"},$d={class:"prompt-section"},kd={class:"section-header"},xd={class:"category-selection-modern"},Vd={class:"category-grid"},Sd=["onClick"],Id={class:"category-icon"},Td={class:"category-name"},zd={class:"prompt-selection-modern"},Ad={class:"prompt-header"},Pd={class:"prompt-list-modern"},Dd=["onClick"],Md={class:"prompt-content"},Ed={class:"prompt-title"},Ud={class:"prompt-desc"},Fd={class:"prompt-meta"},Rd={class:"prompt-tags"},Wd={class:"prompt-actions"},Od={key:0,class:"empty-prompts"},Bd={key:0,class:"variables-section"},Nd={class:"variables-header"},jd={class:"variables-form"},qd={class:"variable-label"},Gd={key:0,class:"context-variable-container"},Ld={class:"context-chapter-option"},Hd={class:"chapter-title"},Jd={class:"chapter-meta"},Kd={class:"word-count"},Xd={class:"context-actions"},Yd={key:1,class:"preview-section"},Zd={class:"preview-header"},Qd={class:"preview-actions"},ec={class:"preview-content"},tc={class:"dialog-footer"},lc={class:"action-buttons"},nc={class:"batch-generate-content"},ac={class:"character-type-options"},sc={style:{display:"flex",gap:"10px","align-items":"center"}},oc={key:0,class:"selected-prompt-info"},ic={class:"streaming-content-container"},rc=["innerHTML"],uc={class:"results-header"},dc={class:"result-actions"},cc={class:"generated-characters-grid"},vc=["onClick"],pc={class:"character-header"},mc={class:"character-avatar-preview"},fc={class:"default-avatar"},gc={class:"character-basic-info"},yc={class:"character-meta"},hc={class:"age-text"},_c={class:"selection-indicator"},wc={class:"character-details"},bc={class:"detail-item"},Cc={class:"detail-item"},$c={class:"detail-item"},kc={key:0,class:"character-tags-preview"},xc={class:"dialog-footer"},Vc={class:"world-generate-content"},Sc={class:"world-type-options"},Ic={style:{display:"flex",gap:"10px","align-items":"center"}},Tc={key:0,class:"selected-prompt-info"},zc={class:"streaming-content-container"},Ac=["innerHTML"],Pc={class:"results-header"},Dc={class:"result-actions"},Mc={class:"generated-settings-list"},Ec=["onClick"],Uc={class:"setting-header"},Fc={class:"setting-basic-info"},Rc={class:"selection-indicator"},Wc={class:"setting-content"},Oc={class:"dialog-footer"},Bc={class:"prompt-dialog-content"},Nc={class:"prompt-list"},jc={class:"prompt-cards"},qc=["onClick"],Gc={class:"prompt-card-header"},Lc={class:"prompt-card-description"},Hc={class:"prompt-card-tags"},Jc={key:0,class:"empty-prompts"},Kc={key:0,class:"prompt-variables"},Xc={key:1,class:"final-prompt"},Yc={key:0,class:"streaming-content-area"},Zc={class:"streaming-header"},Qc={class:"streaming-content"},ev={class:"streaming-text-plain"},tv={class:"optimize-dialog-content"},lv={class:"current-text-section"},nv={class:"section-header"},av={class:"text-info"},sv={class:"current-text-content"},ov={class:"text-actions"},iv={class:"optimize-prompt-section"},rv={class:"section-header"},uv={class:"optimize-type-selection"},dv={class:"type-options"},cv={class:"optimize-prompt-selection"},vv={class:"prompt-header"},pv={class:"prompt-list-optimize"},mv=["onClick"],fv={class:"prompt-content"},gv={class:"prompt-title"},yv={class:"prompt-desc"},hv={class:"prompt-meta"},_v={class:"prompt-tags"},wv={class:"prompt-actions"},bv={key:0,class:"empty-prompts"},Cv={key:0,class:"optimize-variables"},$v={class:"variables-header"},kv={class:"variables-form"},xv={class:"variable-label"},Vv={key:1,class:"optimize-preview"},Sv={class:"preview-header"},Iv={class:"preview-actions"},Tv={class:"preview-content"},zv={class:"optimize-actions"},Av={class:"action-info"},Pv={class:"action-buttons"},Dv={class:"ai-single-chapter-content"},Mv={key:0,class:"custom-prompt-status"},Ev={class:"prompt-preview"},Uv={key:1,class:"streaming-content-area"},Fv={class:"streaming-header"},Rv={class:"streaming-content"},Wv={class:"streaming-text-plain"},Ov={class:"ai-batch-chapter-content"},Bv={key:0,class:"custom-prompt-status"},Nv={class:"prompt-preview"},jv={class:"prompt-content-preview"},qv={class:"prompt-content-text"},Gv={key:0,class:"final-prompt-section"},Lv={class:"prompt-content-text final-prompt"},Hv={key:1,class:"streaming-content-area"},Jv={class:"streaming-header"},Kv={class:"streaming-content"},Xv={class:"streaming-text-plain"},Yv={class:"ai-optimize-content"},Zv={key:0,class:"streaming-content-area"},Qv={class:"streaming-content"},ep=["innerHTML"],tp={key:1,class:"optimized-content"},lp={key:2,class:"empty-result"},np={class:"new-optimize-container"},ap={class:"card-header"},sp={class:"prompt-selection"},op={class:"prompt-list"},ip=["onClick"],rp={class:"prompt-title"},up={class:"prompt-desc"},dp={key:0,class:"empty-prompts"},cp={class:"custom-prompt"},vp={class:"original-content-preview"},pp={class:"content-stats"},mp={class:"card-header"},fp={key:0,class:"streaming-area"},gp={class:"streaming-header"},yp={class:"streaming-content-box"},hp={class:"streaming-text"},_p={key:1,class:"result-area"},wp={class:"result-content"},bp={class:"result-stats"},Cp={key:2,class:"empty-result"},$p={class:"dialog-footer"},kp={class:"new-continue-container"},xp={class:"continue-direction"},Vp={class:"continue-word-count"},Sp={class:"current-content-preview"},Ip={class:"content-stats"},Tp={class:"card-header"},zp={key:0,class:"streaming-area"},Ap={class:"streaming-header"},Pp={class:"streaming-content-box"},Dp={class:"streaming-text"},Mp={key:1,class:"result-area"},Ep={class:"result-content"},Up={class:"result-stats"},Fp={key:2,class:"empty-result"},Rp={class:"dialog-footer"},Wp={__name:"Writer",setup(_){const h=En(),k=en(),P=Zl(),ne=()=>{const a=qe.getConfig();return!a.apiKey||!a.baseURL?(Mt.confirm("检测到您还未配置AI API，需要先配置API密钥才能使用AI功能。是否前往配置？","需要配置API",{confirmButtonText:"去配置",cancelButtonText:"稍后配置",type:"warning"}).then(()=>{k.push("/config")}).catch(()=>{}),!1):!0},Q=()=>ne(),x=g(null),z=g([]),E=g(null),Z=g(""),Ae=g(!1),ye=g(!1),Ve=g(!1),Ce=g(null),ue=No(),ve=g("editor"),Pe=g(!1),xe=g(!1),Ee=g(!1),nt=g(!1),Ge=g("grammar"),O=g(""),X=g(!1),me=g(""),$e=g(null),he=g(!1),de=g(""),Xe=g([]),ee=g(null),C=g({}),j=g(""),w=g(!1),oe=g(null),Se=g({}),ke=g(""),Re=g("characters"),Qe=g(!1),K=g(null),$=g("content"),L=g({characters:[],worldSettings:[],corpus:[],events:[],chapters:[]}),J=g([]),B=g({wordCount:2e3,style:"third-person",focus:""}),Ie=g([{key:"content",name:"基础正文",icon:"📝"},{key:"content-dialogue",name:"对话生成",icon:"💬"},{key:"content-scene",name:"场景描写",icon:"🏞️"},{key:"content-action",name:"动作情节",icon:"⚡"},{key:"content-psychology",name:"心理描写",icon:"🧠"}]),Ue=g(!1),pe=g({count:5,includeMainCharacters:!0,includeSupportingCharacters:!0,includeMinorCharacters:!0,customPrompt:"",autoAssignRoles:!0}),yt=g(!1),Le=g([]),rl=g([]),At=g(null),ul=g({}),Nt=g(""),ht=g(!1),q=g({count:3,includeGeography:!0,includeCulture:!0,includeHistory:!0,includeMagic:!1,includeTechnology:!1,includePolitics:!1,includeReligion:!1,includeEconomy:!1,includeRaces:!1,includeLanguage:!1,customPrompt:""}),_t=g(!1),He=g([]),Qt=g(!1),vt=g(null),rt=g({}),$t=g(""),pt=g(!1),et=g(!1),kt=g(!1),fe=g({title:"",plotRequirement:"",template:"general"}),Te=g({count:3,plotRequirement:"",template:"general"}),F=g(null),U=g({}),We=g(""),ut=g(["promptContent"]),wt=g(null),Oe=g({}),Fe=g(""),ce=g({optimizeType:"grammar",customRequirement:"",originalContent:"",optimizedContent:""}),le=g(!1),te=g({originalContent:"",optimizedContent:"",customPrompt:"",selectedPrompt:null,mode:"full",isOptimizing:!1}),jt=be(()=>Xe.value.filter(a=>a.category==="polish")),xt=g(""),dt=g(!1),at=g(!1),mt=g({direction:"",wordCount:500,isStreaming:!1}),Ye=g(""),bt=g(!1),Je=g([]),Pt=be(()=>P.worldSettings),tt=g([]),Ze=g([]),qt=g(!1),Gt=g(!1),Lt=g(!1),Ht=g(!1),Be=g({title:"",description:"",status:"draft"}),Un=g({wordCount:2e3,style:"third-person",focus:""}),M=g({id:null,name:"",role:"supporting",gender:"male",age:25,appearance:"",personality:"",background:"",tags:[],avatar:""}),dl=g(""),De=g({id:null,title:"",description:"",category:"setting",details:""}),st=g({id:null,title:"",type:"description",content:"",tags:[]}),Ne=g({id:null,title:"",description:"",chapter:"",time:"",importance:"normal"}),Fn={},Rn={placeholder:"开始您的创作...",MENU_CONF:{uploadImage:{server:"/api/upload-image",fieldName:"file",maxFileSize:5*1024*1024,allowedFileTypes:["image/*"]}}},cl=be(()=>Z.value.replace(/<[^>]*>/g,"").length),Wn=()=>{ft(),k.push("/novels")},vl=a=>{ft(),On(a)},On=a=>{(!a.status||a.status==="outline")&&(a.status="draft"),E.value=a,Z.value=a.content||""},ft=()=>{E.value&&(E.value.content=Z.value,E.value.wordCount=cl.value,E.value.updatedAt=new Date,ze())},Sl=()=>{Ce.value=null,Be.value={title:"",description:"",status:"draft"},Ve.value=!0},Bn=a=>{Ce.value=a,Be.value={title:a.title,description:a.description||"",status:a.status||"draft"},Ve.value=!0},Nn=()=>{if(!Be.value.title.trim()){y.warning("请输入章节标题");return}if(Ce.value)Ce.value.title=Be.value.title,Ce.value.description=Be.value.description,Ce.value.status=Be.value.status,y.success("章节信息已更新");else{const a={id:Date.now(),title:Be.value.title,description:Be.value.description,content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:Be.value.status};z.value.push(a),y.success("章节创建成功"),setTimeout(()=>{vl(a)},100)}Ve.value=!1},jn=a=>{Mt.confirm(`确定要删除章节《${a.title}》吗？`,"确认删除",{type:"warning"}).then(()=>{var i;const e=z.value.findIndex(o=>o.id===a.id);e>-1&&(z.value.splice(e,1),((i=E.value)==null?void 0:i.id)===a.id&&(E.value=null,Z.value="",z.value.length>0&&setTimeout(()=>{vl(z.value[0])},100)),ze(),y.success("章节已删除"))}).catch(()=>{})},qn=a=>{ue.value=a},Gn=a=>{switch(a){case"manual":Sl();break;case"ai-single":Fs();break;case"ai-batch":Rs();break}},Ln=(a,e)=>{switch(a){case"edit":Bn(e);break;case"generate":on(e);break;case"delete":jn(e);break}},Il=a=>({draft:"warning",completed:"success",published:"primary"})[a]||"warning",pl=a=>({draft:"草稿",completed:"完成",published:"发表"})[a]||"草稿",tn=()=>({grammar:"语法润色",style:"文风优化",emotion:"情感增强",logic:"逻辑梳理"})[Ge.value]||"优化",Hn=a=>({grammar:`
1. 检查并修正语法错误、错别字、标点符号问题
2. 优化句式结构，使表达更加流畅
3. 保持原文的意思和风格不变
4. 提升文字的准确性和规范性`,style:`
1. 优化文字表达，使语言更加优美流畅
2. 增强文字的感染力和表现力
3. 统一文章的语言风格
4. 保持故事情节和人物性格不变`,emotion:`
1. 加强情感描写，使情感表达更加深刻
2. 增加心理描写和情感细节
3. 提升读者的情感共鸣
4. 保持情节发展的合理性`,logic:`
1. 梳理故事情节的逻辑关系
2. 检查人物行为的合理性
3. 优化情节发展的连贯性
4. 确保时间线和因果关系清晰`})[a]||"进行全面优化",Jn=()=>{X.value=!1,xe.value=!1,Pe.value=!1,Ee.value=!1,O.value="",me.value="",$e.value=null,y.info("已停止AI生成")};Rt(O,()=>{X.value&&zt(()=>{const a=document.querySelector(".streaming-content");a&&(a.scrollTop=a.scrollHeight)})});const Kn=()=>{const a=localStorage.getItem("prompts");if(a)try{Xe.value=JSON.parse(a)}catch(e){console.error("加载提示词失败:",e),Xe.value=ln(),nn()}else Xe.value=ln(),nn()},ln=()=>[{id:1,title:"小说大纲生成器",category:"outline",description:"根据关键词和类型生成详细的小说大纲",content:`请为我创作一个{类型}小说的大纲，主题是{主题}，主角是{主角设定}。要求包含：
1. 故事背景设定
2. 主要人物介绍
3. 核心冲突
4. 章节大纲（至少10章）
5. 结局走向`,tags:["大纲","结构","创作"],isDefault:!0},{id:2,title:"基础章节生成器",category:"content",description:"基于章节大纲生成详细的正文内容",content:`请为小说《{小说标题}》的章节《{章节标题}》写正文内容。

章节大纲：{章节大纲}

要求：
1. 字数控制在{目标字数}字左右
2. 采用{写作视角}视角
3. 包含丰富的对话、描写和细节
4. 保持情节连贯性
5. 突出{重点内容}`,tags:["正文","章节","基础生成"],isDefault:!0},{id:6,title:"全素材章节生成器",category:"content",description:"结合人物、世界观、语料库等素材生成章节内容",content:`请为小说《{小说标题}》的章节《{章节标题}》写正文内容。

章节大纲：{章节大纲}

{主要人物}

{世界观设定}

{参考语料}

{前文概要}

创作要求：
1. 字数控制在{目标字数}字左右
2. 采用{写作视角}视角
3. 突出重点：{重点内容}
4. 充分运用提供的人物设定和世界观背景
5. 参考语料库的写作风格和表达方式
6. 与前文保持连贯性和一致性
7. 包含丰富的对话、心理活动、环境描写`,tags:["全素材","章节","综合生成"],isDefault:!0},{id:7,title:"对话驱动生成器",category:"content-dialogue",description:"以对话为主导的章节内容生成",content:`请为小说《{小说标题}》的章节《{章节标题}》写正文内容，重点突出对话。

章节大纲：{章节大纲}
参与对话人物：{主要人物}

创作要求：
1. 字数控制在{目标字数}字左右
2. 对话占60%以上篇幅
3. 通过对话推进情节发展
4. 展现人物性格和关系
5. 适当加入动作和心理描写
6. 对话要符合人物身份和性格
7. 重点内容：{重点内容}`,tags:["对话","人物","互动"],isDefault:!0},{id:8,title:"场景描写生成器",category:"content-scene",description:"以环境和场景描写为主的内容生成",content:`请为小说《{小说标题}》的章节《{章节标题}》写正文内容，重点突出场景描写。

章节大纲：{章节大纲}
场景设定：{世界观设定}

创作要求：
1. 字数控制在{目标字数}字左右
2. 详细描写环境氛围
3. 通过场景烘托情节
4. 调动读者五感体验
5. 场景与情节相辅相成
6. 体现世界观特色
7. 重点内容：{重点内容}`,tags:["场景","环境","氛围"],isDefault:!0},{id:9,title:"动作剧情生成器",category:"content-action",description:"以动作和情节推进为主的内容生成",content:`请为小说《{小说标题}》的章节《{章节标题}》写正文内容，重点突出动作情节。

章节大纲：{章节大纲}
主要人物：{主要人物}

创作要求：
1. 字数控制在{目标字数}字左右
2. 节奏紧凑，情节推进迅速
3. 动作描写清晰流畅
4. 突出冲突和转折
5. 保持紧张感和悬念
6. 角色行动符合性格
7. 重点内容：{重点内容}`,tags:["动作","情节","冲突"],isDefault:!0},{id:10,title:"心理描写生成器",category:"content-psychology",description:"以心理活动和内心独白为主的内容生成",content:`请为小说《{小说标题}》的章节《{章节标题}》写正文内容，重点突出心理描写。

章节大纲：{章节大纲}
主角心境：{重点内容}
人物背景：{主要人物}

创作要求：
1. 字数控制在{目标字数}字左右
2. 深入挖掘人物内心世界
3. 心理活动要真实细腻
4. 体现人物成长变化
5. 内心冲突与外在情节呼应
6. 适当运用意识流技巧
7. 展现人物独特思维方式`,tags:["心理","内心","情感"],isDefault:!0},{id:3,title:"文本润色优化",category:"polish",description:"优化文本的表达和文采，提升阅读体验",content:`请帮我润色以下文本，要求：
1. 保持原意不变
2. 提升文采和表达力
3. 优化句式结构
4. 增强画面感

原文：{原文内容}`,tags:["润色","优化","文采"],isDefault:!0},{id:4,title:"智能续写助手",category:"continue",description:"基于现有内容进行智能续写",content:`请为小说《{小说标题}》的章节《{章节标题}》续写内容。

当前已写内容：
{当前内容}

续写要求：
1. 保持原有风格和语调
2. 情节自然连贯
3. 长度约{续写字数}字
4. 推进剧情发展`,tags:["续写","连贯","发展"],isDefault:!0},{id:5,title:"基础人物设定生成器",category:"character",description:"生成详细的人物设定和背景故事",content:`你是一个专业的角色生成器。请为小说《{小说标题}》创建一个{角色类型}角色。

【重要】必须严格按照以下格式输出，不要添加任何额外的解释或文字：

外貌：身高一米七五，黑发黑眼，面容清秀
性格：温和友善，聪明机智，有时略显内向
背景：出身书香门第，自幼受到良好教育，立志成为学者
标签：知识分子,温和,聪慧

请完全按照以上示例格式生成角色信息，必须包含：外貌、性格、背景、标签这4个字段。

角色设定：
- 姓名：{姓名}
- 角色定位：{角色定位}
- 性别：{性别}
- 年龄：{年龄}岁
- 小说类型：{小说类型}

开始生成：`,tags:["人设","角色","背景"],isDefault:!0},{id:11,title:"主角人设生成器",category:"character",description:"专门生成主角的详细人设",content:`请为小说《{小说标题}》创建一个主角角色：
- 姓名：{姓名}
- 性别：{性别}
- 年龄：{年龄}岁
- 故事类型：{小说类型}

作为主角，请特别注重：
1. 独特的外貌特征（要有记忆点）
2. 复杂的性格层次（优缺点并存）
3. 深刻的成长背景（解释其动机）
4. 核心能力或天赋
5. 内心的矛盾与追求
6. 与剧情相关的重要关系
7. 主角光环的合理体现

请按以下格式返回：
外貌：[具有主角特质的外貌描述]
性格：[复杂立体的性格设定]
背景：[能够支撑主角成长的背景故事]
标签：[主角,核心,关键词1,关键词2]`,tags:["主角","核心人设","成长"],isDefault:!0},{id:12,title:"反派角色生成器",category:"character",description:"生成有深度的反派角色设定",content:`请为小说《{小说标题}》创建一个反派角色：
- 姓名：{姓名}
- 性别：{性别}
- 年龄：{年龄}岁
- 与主角的关系：{关系设定}

作为反派，请注重：
1. 威胁感十足的外貌特征
2. 具有说服力的行事动机（不是纯粹的恶）
3. 与主角形成对比的成长经历
4. 强大的能力或权势
5. 复杂的内心世界（有人性的一面）
6. 与主角的深层联系或相似性
7. 符合逻辑的行为准则

请按以下格式返回：
外貌：[具有威胁感的外貌描述]
性格：[复杂的反派性格]
背景：[解释其成为反派的原因]
标签：[反派,对立,关键词1,关键词2]`,tags:["反派","对立","复杂"],isDefault:!0},{id:13,title:"配角人设生成器",category:"character",description:"生成功能性强的配角设定",content:`请为小说《{小说标题}》创建一个配角：
- 姓名：{姓名}
- 性别：{性别}
- 年龄：{年龄}岁
- 角色功能：{角色作用}

作为配角，请着重：
1. 有特色的外貌（易于区分）
2. 鲜明的性格标签（便于记忆）
3. 与主要剧情相关的背景
4. 特定的技能或知识
5. 与主要角色的关系定位
6. 推动剧情的功能性
7. 适度的个人魅力

请按以下格式返回：
外貌：[有特色的外貌描述]
性格：[鲜明的性格特点]
背景：[功能性背景设定]
标签：[配角,功能,关键词1,关键词2]`,tags:["配角","功能性","特色"],isDefault:!0},{id:14,title:"古风人物生成器",category:"character",description:"专门生成古代背景的人物设定",content:`请为古风小说《{小说标题}》创建一个角色：
- 姓名：{姓名}（需要古风韵味）
- 性别：{性别}
- 年龄：{年龄}岁
- 身份地位：{社会地位}

古风特色要求：
1. 符合古代审美的外貌描述
2. 体现古代文化的气质性格
3. 合乎历史背景的成长经历
4. 古代社会的技能才艺
5. 符合身份的言行举止
6. 古典文学的描写风格

请按以下格式返回：
外貌：[古典美学的外貌描述]
性格：[古代文化底蕴的性格]
背景：[符合历史的身世背景]
标签：[古风,雅致,关键词1,关键词2]`,tags:["古风","历史","文化"],isDefault:!0},{id:15,title:"现代都市人物生成器",category:"character",description:"生成现代都市背景的人物设定",content:`请为现代都市小说《{小说标题}》创建一个角色：
- 姓名：{姓名}
- 性别：{性别}
- 年龄：{年龄}岁
- 职业：{职业设定}

现代都市特色：
1. 现代时尚的外貌风格
2. 都市生活塑造的性格
3. 现代社会的成长背景
4. 职场或生活技能
5. 现代人的价值观念
6. 都市节奏的生活方式

请按以下格式返回：
外貌：[现代时尚的外貌描述]
性格：[都市生活的性格特征]
背景：[现代社会的成长环境]
标签：[都市,现代,关键词1,关键词2]`,tags:["现代","都市","职场"],isDefault:!0},{id:16,title:"玄幻修仙人物生成器",category:"character",description:"生成玄幻修仙类的人物设定",content:`请为玄幻修仙小说《{小说标题}》创建一个角色：
- 姓名：{姓名}（需要仙侠韵味）
- 性别：{性别}
- 年龄：{年龄}岁
- 修为境界：{修为等级}

玄幻修仙特色：
1. 超凡脱俗的仙侠外貌
2. 修炼塑造的独特气质
3. 修仙世界的成长历程
4. 法术神通或武学技能
5. 修仙者的心境修为
6. 与修仙体系的关联

请按以下格式返回：
外貌：[仙侠风格的外貌描述]
性格：[修仙者的气质性格]
背景：[修仙世界的成长背景]
标签：[修仙,超凡,关键词1,关键词2]`,tags:["玄幻","修仙","超凡"],isDefault:!0},{id:17,title:"科幻未来人物生成器",category:"character",description:"生成科幻未来背景的人物设定",content:`请为科幻小说《{小说标题}》创建一个角色：
- 姓名：{姓名}（可以是代号或未来风格）
- 性别：{性别}
- 年龄：{年龄}岁
- 科技背景：{科技设定}

科幻未来特色：
1. 科技感十足的外貌特征
2. 未来社会影响的性格
3. 科技文明的成长环境
4. 高科技技能或改造
5. 未来价值观和思维
6. 与科技设定的关联

请按以下格式返回：
外貌：[科幻风格的外貌描述]
性格：[未来文明的性格特征]
背景：[科技社会的成长背景]
标签：[科幻,未来,关键词1,关键词2]`,tags:["科幻","未来","科技"],isDefault:!0},{id:22,title:"批量角色生成器",category:"character",description:"一次性生成多个角色的专用模板",content:`你是一个专业的小说角色生成器。请严格按照指定格式为小说《{小说标题}》生成{生成数量}个人物角色。

【重要】必须严格按照以下格式输出，不要添加任何额外的解释或文字：

角色1：
姓名：张三
角色：主角
性别：男
年龄：25
外貌：身高一米八，浓眉大眼，面容坚毅
性格：勇敢正直，有些冲动，但心地善良
背景：出身农家，自幼习武，立志成为英雄
标签：主角,勇敢,正义

角色2：
姓名：李美娜
角色：配角
性别：女
年龄：22
外貌：身材娇小，长发飘逸，眼神清澈动人
性格：温柔善良，聪明机智，偶尔有些任性
背景：大家闺秀，从小接受良好教育，精通琴棋书画
标签：配角,温柔,才女

请完全按照以上示例格式生成{生成数量}个角色，每个角色都必须包含：姓名、角色、性别、年龄、外貌、性格、背景、标签这8个字段。

小说设定：
- 标题：{小说标题}
- 类型：{小说类型}
- 简介：{小说简介}

角色类型要求：{角色类型}

特殊要求：{特殊要求}

开始生成：`,tags:["批量","多角色","团队"],isDefault:!0},{id:18,title:"基础世界观生成器",category:"worldview",description:"生成小说的基础世界观设定",content:`请为小说《{小说标题}》生成{生成数量}个世界观设定。

小说信息：
- 类型：{小说类型}
- 简介：{小说简介}

设定类型：{设定类型}

特殊要求：{特殊要求}

请为每个设定生成详细信息，格式如下：

设定1：
标题：[设定标题]
类型：[设定类型]
描述：[详细描述，包含具体规则、特点、影响等]

设定2：
...

请确保设定之间具有关联性和一致性。`,tags:["世界观","设定","基础"],isDefault:!0},{id:19,title:"魔法体系生成器",category:"worldview",description:"专门生成魔法系统的世界观设定",content:`请为小说《{小说标题}》设计一套完整的魔法体系。

小说类型：{小说类型}
魔法特色要求：{特殊要求}

请包含以下内容：
1. 魔法的基本原理和来源
2. 魔法等级划分系统
3. 施法方式和条件
4. 魔法的限制和代价
5. 魔法在社会中的地位
6. 主要魔法流派或分类

格式：
标题：[魔法体系名称]
类型：魔法体系
描述：[详细的魔法体系说明]`,tags:["魔法","体系","玄幻"],isDefault:!0},{id:20,title:"社会政治生成器",category:"worldview",description:"生成社会制度和政治结构设定",content:`请为小说《{小说标题}》设计社会政治结构。

小说类型：{小说类型}
政治特色：{特殊要求}

请详细设定：
1. 国家或政权形式
2. 社会等级制度
3. 权力分配机制
4. 法律和规则体系
5. 主要政治势力
6. 社会矛盾和冲突

格式：
标题：[政治体系名称]
类型：政治制度
描述：[详细的政治社会结构说明]`,tags:["政治","社会","制度"],isDefault:!0},{id:21,title:"批量章节大纲生成器",category:"outline",description:"一次性生成多个章节大纲的专用模板",content:`请为小说《{小说标题}》生成{生成章节数量}个章节大纲。

小说信息：
- 标题：{小说标题}
- 类型：{小说类型}
- 简介：{小说简介}

已有章节：
{已有章节}

生成要求：
- 生成数量：{生成章节数量}个章节
- 情节要求：{情节要求}
- 模板类型：{模板类型}

请确保：
1. 每个章节都有引人入胜的标题
2. 大纲内容详细具体，包含主要情节点
3. 章节之间有逻辑连贯性
4. 推进整体故事发展
5. 符合小说类型和风格

请严格按照以下格式输出：

章节1：
标题：[章节标题]
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]

章节2：
标题：[章节标题]
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]

继续按此格式生成所有{生成章节数量}个章节。`,tags:["批量","章节","大纲"],isDefault:!0},{id:22,title:"连续剧情章节生成器",category:"outline",description:"生成连续发展的章节剧情",content:`请为小说《{小说标题}》设计{生成章节数量}个连续章节的剧情发展。

故事背景：
- 小说类型：{小说类型}
- 当前进度：{已有章节}
- 剧情要求：{情节要求}

设计重点：
1. 每个章节都有明确的冲突点
2. 章节间形成起承转合的节奏
3. 逐步推进主线剧情
4. 适当安排高潮和缓冲
5. 为后续发展埋下伏笔

输出格式：

章节1：
标题：[吸引人的章节标题]
大纲：[包含冲突、发展、转折的详细大纲]

章节2：
标题：[承接上章的章节标题]
大纲：[推进剧情的详细内容描述]

请生成完整的{生成章节数量}个章节。`,tags:["连续","剧情","节奏"],isDefault:!0},{id:23,title:"类型化章节生成器",category:"outline",description:"根据小说类型特色生成章节",content:`请为{小说类型}小说《{小说标题}》生成{生成章节数量}个具有类型特色的章节。

类型特色要求：
- 充分体现{小说类型}的特点
- 符合该类型读者的期待
- 包含该类型的经典元素
- 情节要求：{情节要求}

已有基础：{已有章节}

请确保每个章节都：
1. 突出{小说类型}的核心魅力
2. 包含该类型的必备元素
3. 节奏符合类型特点
4. 有明确的看点和爽点
5. 推进整体故事架构

格式要求：

章节1：
标题：[体现类型特色的标题]
大纲：[包含类型元素的详细大纲]

章节2：
标题：[延续类型风格的标题]
大纲：[深化类型特色的内容描述]

生成{生成章节数量}个章节。`,tags:["类型化","特色","风格"],isDefault:!0},{id:24,title:"地理环境生成器",category:"worldview",description:"生成世界的地理环境和自然设定",content:`请为小说《{小说标题}》设计地理环境。

小说类型：{小说类型}
环境特点：{特殊要求}

请详细描述：
1. 大陆或世界整体布局
2. 主要地形地貌特征
3. 气候和自然现象
4. 特殊的地理奇观
5. 资源分布情况
6. 地理对文明的影响

格式：
标题：[地理区域名称]
类型：地理环境
描述：[详细的地理环境描述]`,tags:["地理","环境","自然"],isDefault:!0}],nn=()=>{try{localStorage.setItem("prompts",JSON.stringify(Xe.value))}catch(a){console.error("保存提示词失败:",a)}},el=a=>Xe.value.filter(e=>e.category===a),Xn=a=>{console.log("openPromptDialog 被调用，category:",a,"showAIBatchChapterDialog:",et.value),de.value=a,he.value=!0,ee.value=null,C.value={},j.value="",M.value&&setTimeout(()=>{an()},100)},Yn=a=>{ee.value=a,C.value={};const e=a.content.match(/\{([^}]+)\}/g);e&&e.forEach(i=>{const o=i.slice(1,-1);C.value[o]=""}),de.value==="character"&&M.value&&an(),de.value==="worldview"&&ht.value&&Ts(),de.value==="outline"&&et.value&&(console.log("selectPrompt中检测到批量章节生成，调用autoFillBatchChapterVariables"),setTimeout(()=>{al()},50)),de.value==="outline"&&pt.value&&(console.log("selectPrompt中检测到单章生成，调用autoFillSingleChapterVariables"),setTimeout(()=>{Wl()},50)),ot()},an=()=>{var i,o,d;if(de.value!=="character")return;C.value.小说标题=((i=x.value)==null?void 0:i.title)||"未命名小说",C.value.姓名=M.value.name||"",C.value.性别=M.value.gender==="male"?"男":M.value.gender==="female"?"女":"其他",C.value.年龄=((o=M.value.age)==null?void 0:o.toString())||"25";const a={protagonist:"主角",supporting:"配角",antagonist:"反派",minor:"次要角色"};C.value.角色定位=a[M.value.role]||"配角",C.value.角色类型=a[M.value.role]||"配角";const e=((d=x.value)==null?void 0:d.genre)||"现代";C.value.小说类型=e,M.value.role==="antagonist"&&(C.value.关系设定="与主角对立的敌人"),M.value.role==="supporting"&&(C.value.角色作用="协助主角发展剧情"),e.includes("古风")||e.includes("古代")?C.value.社会地位="普通百姓":e.includes("现代")||e.includes("都市")?C.value.职业设定="上班族":e.includes("玄幻")||e.includes("修仙")?C.value.修为等级="练气期":e.includes("科幻")&&(C.value.科技设定="星际文明时代"),ot()},ot=()=>{if(!ee.value){j.value="";return}let a=ee.value.content;Object.keys(C.value).forEach(e=>{const i=C.value[e]||`{${e}}`;a=a.replace(new RegExp(`\\{${e}\\}`,"g"),i)}),j.value=a,de.value==="outline"&&et.value&&console.log("generateFinalPrompt - 批量章节生成:",{提示词标题:ee.value.title,已有章节变量值:C.value.已有章节?C.value.已有章节.substring(0,300)+"...":"未设置",最终提示词包含已有章节:a.includes("已有章节"),最终提示词包含章节标题关键词:a.includes("第")&&a.includes("章"),所有变量:Object.keys(C.value)})};Rt(C,()=>{ot()},{deep:!0}),Rt(B,()=>{ee.value&&Qe.value&&(C.value.目标字数=B.value.wordCount.toString(),C.value.写作视角=Kt(B.value.style),C.value.重点内容=B.value.focus||"按大纲发展",K.value&&J.value.length===0&&Tl(),ot())},{deep:!0}),Rt(L,()=>{if(ee.value&&Qe.value){if(L.value.characters.length>0){const a=L.value.characters.map(e=>`${e.name}（${e.role}）：${e.personality||"暂无描述"}`).join(`
`);C.value.主要人物=a}else C.value.主要人物&&(C.value.主要人物="");if(L.value.worldSettings.length>0){const a=L.value.worldSettings.map(e=>`${e.title}：${e.description||"暂无描述"}`).join(`
`);C.value.世界观设定=a}else C.value.世界观设定&&(C.value.世界观设定="");if(L.value.corpus.length>0){const a=L.value.corpus.map(e=>`【${e.title}】${e.content}`).join(`

`);C.value.参考语料=a}else C.value.参考语料&&(C.value.参考语料="");if(L.value.chapters.length>0){const a=L.value.chapters.map(e=>{let o=`第${fl(e)}章《${e.title}》
`;if(e.description&&(o+=`章节大纲：${e.description}
`),e.content&&e.content.trim()){const d=gl(e.content,500);o+=`章节内容：${d}${e.content.length>500?"...":""}`}return o}).join(`

`);C.value.前文概要=a}else C.value.前文概要&&(C.value.前文概要="");ot()}},{deep:!0});const Zn=()=>({outline:"章节大纲",content:"基础正文","content-dialogue":"对话生成","content-scene":"场景描写","content-action":"动作情节","content-psychology":"心理描写",polish:"文本优化",continue:"智能续写",character:"人物生成",worldview:"世界观生成"})[de.value]||"提示词",Qn=()=>{ee.value=null,C.value={},j.value=""},ea=()=>H(this,null,function*(){try{yield navigator.clipboard.writeText(j.value),y.success("提示词已复制到剪贴板")}catch(a){y.error("复制失败")}}),sn=()=>{k.push("/prompts")},ta=()=>{if(!ee.value||!j.value){y.warning("请选择提示词并填充变量");return}if(de.value==="character"&&Ue.value){At.value=ee.value,ul.value=Me({},C.value),Nt.value=j.value,he.value=!1,y.success("已选择批量生成角色提示词");return}if(de.value==="worldview"&&ht.value){vt.value=ee.value,rt.value=Me({},C.value),$t.value=j.value,he.value=!1,y.success("已选择世界观生成提示词");return}if(de.value==="outline"&&pt.value){Wl(),setTimeout(()=>{ot(),wt.value=ee.value,Oe.value=Me({},C.value),Fe.value=j.value,console.log("保存单章提示词信息:",{提示词标题:ee.value.title,章节标题:fe.value.title,情节要求:fe.value.plotRequirement,最终提示词长度:j.value.length}),he.value=!1,y.success('已选择单章生成提示词，请点击"生成章节"按钮开始生成')},100);return}if(de.value==="outline"&&et.value){console.log("确认批量章节提示词，重新填充变量确保包含前5章信息"),al(),setTimeout(()=>{ot(),F.value=ee.value,U.value=Me({},C.value),We.value=j.value,console.log("保存批量章节提示词信息:",{提示词标题:ee.value.title,变量数量:Object.keys(C.value).length,已有章节变量:C.value.已有章节?C.value.已有章节.substring(0,200)+"...":"未找到",最终提示词长度:j.value.length,最终提示词包含前5章信息:j.value.includes("第")&&j.value.includes("章")}),he.value=!1,y.success('已选择批量生成章节提示词，请点击"批量生成"按钮开始生成')},100);return}switch(de.value){case"outline":wa(j.value);break;case"content":mn(j.value);break;case"polish":fn(j.value);break;case"continue":Da(j.value);break;case"character":Ma(j.value);break;case"worldview":y.success("世界观提示词已准备就绪");break;default:y.warning("未知的提示词类型");return}he.value=!1,y.success("正在使用自定义提示词生成内容...")},on=a=>{K.value=a,Qe.value=!0,L.value={characters:[],worldSettings:[],corpus:[],events:[],chapters:[]},Tl(),B.value={wordCount:2e3,style:"third-person",focus:""},ee.value=null,C.value={},j.value=""},rn=()=>{var a;if(ee.value){if(et.value){al();return}if(K.value){if(C.value.小说标题=((a=x.value)==null?void 0:a.title)||"未命名小说",C.value.章节标题=K.value.title||"",C.value.章节大纲=K.value.description||"暂无大纲",C.value.目标字数=B.value.wordCount.toString(),C.value.写作视角=Kt(B.value.style),C.value.重点内容=B.value.focus||"按大纲发展",L.value.characters.length>0){const e=L.value.characters.map(i=>`${i.name}（${i.role}）：${i.personality||"暂无描述"}`).join(`
`);C.value.主要人物=e}if(L.value.worldSettings.length>0){const e=L.value.worldSettings.map(i=>`${i.title}：${i.description||"暂无描述"}`).join(`
`);C.value.世界观设定=e}if(L.value.corpus.length>0){const e=L.value.corpus.map(i=>`【${i.title}】${i.content}`).join(`

`);C.value.参考语料=e}if(J.value.length>0){const i=J.value.map(o=>z.value.find(d=>d.id===o)).filter(Boolean).map(o=>{let p=`第${fl(o)}章《${o.title}》
`;if(o.description&&(p+=`章节大纲：${o.description}
`),o.content&&o.content.trim()){const c=gl(o.content,500);p+=`章节内容：${c}${o.content.length>500?"...":""}`}return p}).join(`

`);C.value.前文概要=i}else K.value&&J.value.length===0&&Tl();ot()}}},ml=(a,e)=>{const i=L.value[a],o=i.findIndex(d=>d.id===e.id);o>-1?i.splice(o,1):i.push(e)},la=a=>{ee.value=a,C.value={};const e=a.content.match(/\{([^}]+)\}/g);e&&e.forEach(i=>{const o=i.slice(1,-1);C.value[o]=""}),zt(()=>{rn()})},na=a=>({setting:"primary",magic:"danger",politics:"warning",geography:"success",history:"info"})[a]||"info",aa=a=>({setting:"世界设定",magic:"魔法体系",politics:"政治势力",geography:"地理环境",history:"历史背景"})[a]||a,sa=a=>({description:"success",dialogue:"primary",emotion:"warning",action:"danger",psychology:"info"})[a]||"info",oa=a=>({description:"场景描述",dialogue:"对话模板",emotion:"情感表达",action:"动作描写",psychology:"心理描写"})[a]||a,ia=a=>({high:"danger",normal:"primary",low:"info"})[a]||"primary",ra=be(()=>{if(!z.value||!K.value)return[];const a=z.value.findIndex(e=>e.id===K.value.id);return a<=0?[]:z.value.slice(0,a).filter(e=>e.content&&e.content.trim())}),Et=be(()=>z.value?z.value.filter(a=>a.description||a.content&&a.content.trim()).map(a=>({id:a.id,title:a.title,description:a.description,content:a.content,status:a.status,wordCount:a.wordCount||0,chapterIndex:fl(a)})):[]),fl=a=>z.value.findIndex(e=>e.id===a.id)+1,gl=(a,e=80)=>{if(!a)return"";let i=a.replace(/<[^>]*>/g,"");return i=i.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'"),i=i.replace(/\s+/g," ").trim(),i.length>e?i.substring(0,e):i},tl=()=>{if(J.value.length>0){const e=J.value.map(i=>z.value.find(o=>o.id===i)).filter(Boolean).map(i=>{let d=`第${fl(i)}章《${i.title}》
`;if(i.description&&(d+=`章节大纲：${i.description}
`),i.content&&i.content.trim()){const p=gl(i.content,500);d+=`章节内容：${p}${i.content.length>500?"...":""}`}return d}).join(`

`);C.value.前文概要=e}else C.value.前文概要="";ot()},Tl=()=>{if(!K.value||!z.value.length){J.value=[];return}const a=z.value.findIndex(i=>i.id===K.value.id);if(a<=0){J.value=[];return}const e=z.value.slice(0,a).filter(i=>i.description||i.content&&i.content.trim()).slice(-2);J.value=e.map(i=>i.id),tl()},ua=()=>{J.value=[],tl(),y.success("已清空前文概要选择")},da=a=>{const e=J.value.indexOf(a);e>-1?J.value.splice(e,1):J.value.push(a),tl()},ca=()=>{J.value=Et.value.map(a=>a.id),tl(),y.success(`已选择所有${Et.value.length}个章节`)},va=()=>{Ue.value=!0,pe.value={count:5,includeMainCharacters:!0,includeSupportingCharacters:!0,includeMinorCharacters:!0,customPrompt:"",autoAssignRoles:!0},rl.value=[],Le.value=[]},un=()=>H(this,null,function*(){var a,e,i,o;if(Q()){yt.value=!0,rl.value=[],Le.value=[],O.value="",X.value=!0,me.value="batchCharacters";try{let d="";const p=[];pe.value.includeMainCharacters&&p.push("主角"),pe.value.includeSupportingCharacters&&p.push("配角"),pe.value.includeMinorCharacters&&p.push("次要角色"),At.value&&Nt.value?d=`=== 小说基本信息 ===
小说标题：${((a=x.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${(()=>{var b;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(b=x.value)==null?void 0:b.genre]||"通用小说"})()}
小说简介：${((e=x.value)==null?void 0:e.description)||"暂无简介"}

=== 角色生成要求 ===
${Nt.value}

=== 生成配置 ===
生成数量：${pe.value.count}个角色
角色类型：${p.join("、")}

${pe.value.customPrompt?`额外要求：${pe.value.customPrompt}`:""}

请根据小说信息和以上提示词生成${pe.value.count}个角色，角色类型应该包括：${p.join("、")}。确保角色设定符合小说的世界观和风格。`:d=`=== 小说基本信息 ===
小说标题：${((i=x.value)==null?void 0:i.title)||"未命名小说"}
小说类型：${(()=>{var b;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(b=x.value)==null?void 0:b.genre]||"通用小说"})()}
小说简介：${((o=x.value)==null?void 0:o.description)||"暂无简介"}

=== 角色生成任务 ===
你是一个专业的小说角色生成器。请严格按照指定格式为上述小说生成${pe.value.count}个人物角色。

【重要】必须严格按照以下格式输出，不要添加任何额外的解释或文字：

角色1：
姓名：张三
角色：主角
性别：男
年龄：25
外貌：身高一米八，浓眉大眼，面容坚毅
性格：勇敢正直，有些冲动，但心地善良
背景：出身农家，自幼习武，立志成为英雄
标签：主角,勇敢,正义

角色2：
姓名：李美娜
角色：配角
性别：女
年龄：22
外貌：身材娇小，长发飘逸，眼神清澈动人
性格：温柔善良，聪明机智，偶尔有些任性
背景：大家闺秀，从小接受良好教育，精通琴棋书画
标签：配角,温柔,才女

请完全按照以上示例格式生成${pe.value.count}个角色，每个角色都必须包含：姓名、角色、性别、年龄、外貌、性格、背景、标签这8个字段。

=== 生成要求 ===
角色类型要求：${p.join("、")}
${pe.value.customPrompt?`特殊要求：${pe.value.customPrompt}`:""}

请确保所有角色设定都符合小说的世界观、类型和风格特点。

开始生成：`;const c=`

=== 重要格式要求 ===
无论上述提示词如何，你必须严格按照以下格式输出，不得有任何偏差：

请生成${pe.value.count}个角色，角色类型包括：${p.join("、")}

角色1：
姓名：[角色姓名]
角色：[主角/配角/反派/次要角色]
性别：[男/女/其他]
年龄：[数字]
外貌：[详细外貌描述]
性格：[性格特点描述]
背景：[背景故事]
标签：[标签1,标签2,标签3]

角色2：
姓名：[角色姓名]
角色：[主角/配角/反派/次要角色]
性别：[男/女/其他]
年龄：[数字]
外貌：[详细外貌描述]
性格：[性格特点描述]
背景：[背景故事]
标签：[标签1,标签2,标签3]

继续按此格式直到生成完所有${pe.value.count}个角色。每个角色必须包含这8个字段。角色类型应该在${p.join("、")}中选择。`,S=d+c;console.log("=== 批量角色生成最终提示词 ==="),console.log(S),console.log("=== 提示词结束 ===");const D=yield qe.generateTextStream(S,{maxTokens:null,temperature:.8,type:"character"},(f,b)=>{O.value=b,dn(b),zt(()=>{const T=document.querySelector(".streaming-content");T&&(T.scrollTop=T.scrollHeight)})});dn(D),y.success(`成功生成 ${Le.value.length} 个角色`)}catch(d){console.error("批量生成角色失败:",d),y.error(`批量生成失败: ${d.message}`)}finally{yt.value=!1,X.value=!1,O.value=""}}}),dn=a=>{if(!a||!a.trim()){Le.value=[];return}console.log("=== 开始解析角色信息 ==="),console.log("角色原始内容:",a),console.log("内容长度:",a.length),console.log("内容前300字符:",a.substring(0,300));const e=d=>{const p={id:Date.now()+Math.random()*1e3,name:"",role:"supporting",gender:"male",age:25,appearance:"",personality:"",background:"",tags:[],avatar:"",createdAt:new Date,generated:!0},c=[/(?:姓名|名字|角色名|name)\s*[：:]\s*([^\n\r]+)/i,/^([^\n\r：:]{1,10})\s*[：:]?\s*(?:是|为|作为)/,/^([^\n\r：:]{2,8})(?:\s|$)/];for(const ge of c){const A=d.match(ge);if(A&&A[1]&&A[1].trim()){p.name=A[1].trim(),console.log("提取到姓名:",p.name);break}}const S=[/(?:角色|职责|定位|类型)\s*[：:]\s*([^\n\r]+)/i,/(主角|配角|反派|次要角色|男主|女主|反面角色|支持角色)/i];for(const ge of S){const A=d.match(ge);if(A&&A[1]){const R=A[1].trim();R.includes("主角")||R.includes("男主")||R.includes("女主")?p.role="protagonist":R.includes("反派")||R.includes("反面")?p.role="antagonist":R.includes("配角")||R.includes("支持")?p.role="supporting":p.role="minor",console.log("提取到角色类型:",p.role);break}}const D=[/(?:性别|gender)\s*[：:]\s*([^\n\r]+)/i,/(男性|女性|男|女|male|female)/i];for(const ge of D){const A=d.match(ge);if(A&&A[1]){const R=A[1].trim().toLowerCase();R.includes("女")||R.includes("female")?p.gender="female":R.includes("男")||R.includes("male")?p.gender="male":p.gender="other",console.log("提取到性别:",p.gender);break}}const f=[/(?:年龄|age)\s*[：:]\s*(\d+)/i,/(\d+)\s*(?:岁|years)/i,/年龄[约大概]*\s*(\d+)/i];for(const ge of f){const A=d.match(ge);if(A&&A[1]){const R=parseInt(A[1]);if(!isNaN(R)&&R>0&&R<200){p.age=R,console.log("提取到年龄:",p.age);break}}}const b=[/(?:外貌|外观|长相|appearance)\s*[：:]\s*([^\n\r姓名角色性别年龄性格背景标签]+)/i,/外貌特征[：:]([^\n\r姓名角色性别年龄性格背景标签]+)/i,/长得([^\n\r姓名角色性别年龄性格背景标签]+)/i];for(const ge of b){const A=d.match(ge);if(A&&A[1]&&A[1].trim()){p.appearance=A[1].trim(),console.log("提取到外貌:",p.appearance.substring(0,50));break}}const T=[/(?:性格|个性|personality)\s*[：:]\s*([^\n\r姓名角色性别年龄外貌背景标签]+)/i,/性格特点[：:]([^\n\r姓名角色性别年龄外貌背景标签]+)/i,/为人([^\n\r姓名角色性别年龄外貌背景标签]+)/i];for(const ge of T){const A=d.match(ge);if(A&&A[1]&&A[1].trim()){p.personality=A[1].trim(),console.log("提取到性格:",p.personality.substring(0,50));break}}const V=[/(?:背景|经历|身世|background)\s*[：:]\s*([^\n\r姓名角色性别年龄外貌性格标签]+)/i,/出身([^\n\r姓名角色性别年龄外貌性格标签]+)/i,/来自([^\n\r姓名角色性别年龄外貌性格标签]+)/i];for(const ge of V){const A=d.match(ge);if(A&&A[1]&&A[1].trim()){p.background=A[1].trim(),console.log("提取到背景:",p.background.substring(0,50));break}}const ae=[/(?:标签|tags?)\s*[：:]\s*([^\n\r]+)/i,/特征[：:]([^\n\r]+)/i];for(const ge of ae){const A=d.match(ge);if(A&&A[1]&&A[1].trim()){p.tags=A[1].trim().split(/[,，\s]+/).map(R=>R.trim()).filter(R=>R),console.log("提取到标签:",p.tags);break}}return p};let i=[];a.match(/角色\d+[：:]/)?(i=a.split(/角色\d+[：:]/i).filter(d=>d.trim()),console.log("使用角色编号分割，得到",i.length,"个块")):a.match(/#{1,3}\s+/)?(i=a.split(/#{1,3}\s+/).filter(d=>d.trim()),console.log("使用标题分割，得到",i.length,"个块")):a.match(/^\d+\./m)?(i=a.split(/^\d+\./m).filter(d=>d.trim()),console.log("使用数字列表分割，得到",i.length,"个块")):(a.match(/姓名[：:]/g)||[]).length>1?(i=a.split(/(?=姓名[：:])/).filter(d=>d.trim()),console.log("使用姓名字段分割，得到",i.length,"个块")):(i=a.split(/\n\s*\n/).filter(d=>d.trim()),i.length===1&&(i=[a]),console.log("使用空行分割，得到",i.length,"个块")),i.forEach((d,p)=>{console.log(`块${p}内容:`,d.substring(0,100)+(d.length>100?"...":""))});const o=[];i.forEach((d,p)=>{var S,D,f,b;if(!d.trim())return;console.log(`=== 处理角色块 ${p} ===`),console.log("块内容:",d);const c=e(d);if(!c.name){const T=(S=d.split(`
`)[0])==null?void 0:S.trim();T&&T.length<20&&!T.includes("：")&&!T.includes(":")&&(c.name=T.replace(/^[^\u4e00-\u9fa5a-zA-Z]*/,"").trim()),c.name||(c.name=`角色${p+1}`)}!c.appearance&&(c.personality||c.background)&&(c.appearance="外貌特征待补充"),!c.personality&&(c.appearance||c.background)&&(c.personality="性格特点待补充"),!c.background&&(c.appearance||c.personality)&&(c.background="背景故事待补充"),c.tags.length===0&&(c.tags=[c.role==="protagonist"?"主角":"配角"]),console.log(`最终角色结果 ${p}:`,{name:c.name,role:c.role,gender:c.gender,age:c.age,appearance:((D=c.appearance)==null?void 0:D.substring(0,50))+"...",personality:((f=c.personality)==null?void 0:f.substring(0,50))+"...",background:((b=c.background)==null?void 0:b.substring(0,50))+"...",tags:c.tags}),c.name&&c.name!=="角色"&&o.push(c)}),console.log("角色最终解析结果数量:",o.length),Le.value=o},pa=()=>{const a=Le.value.filter(e=>e.selected!==!1);if(a.length===0){y.warning("请选择要添加的角色");return}Je.value.push(...a),ze(),Ue.value=!1,y.success(`成功添加 ${a.length} 个角色`)},ma=a=>{a.selected=a.selected===!1},zl=a=>({protagonist:"danger",supporting:"primary",antagonist:"warning",minor:"info"})[a]||"info",Al=a=>({protagonist:"主角",supporting:"配角",antagonist:"反派",minor:"次要角色"})[a]||"配角",cn=a=>({male:"男",female:"女",other:"其他"})[a]||"男",Pl=a=>{if(!a)return"";let e=a.replace(/\n/g,"<br/>");return e=e.replace(/(角色\d+：)/g,'<strong style="color: #409eff; font-size: 16px;">$1</strong>'),e=e.replace(/(设定\d+：)/g,'<strong style="color: #409eff; font-size: 16px;">$1</strong>'),e=e.replace(/(姓名|角色|性别|年龄|外貌|性格|背景|标签)：/g,'<strong style="color: #67c23a;">$1：</strong>'),e=e.replace(/(标题|类型|描述)：/g,'<strong style="color: #67c23a;">$1：</strong>'),e},fa=a=>({地理环境:"success",文化社会:"primary",历史背景:"warning",魔法体系:"danger",科技水平:"info",其他:""})[a]||"",ga=()=>{ht.value=!0,q.value={count:3,includeGeography:!0,includeCulture:!0,includeHistory:!0,includeMagic:!1,includeTechnology:!1,customPrompt:""},He.value=[]},Vt=a=>({fantasy:"玄幻修仙",urban:"都市现代",scifi:"科幻未来",historical:"历史古代",mystery:"悬疑推理",wuxia:"武侠江湖","western-fantasy":"西方奇幻",apocalypse:"末世灾难",romance:"言情小说",military:"军事战争",game:"游戏竞技",business:"商战职场"})[a]||"通用小说",vn=()=>H(this,null,function*(){var a,e,i,o,d,p;if(Q()){_t.value=!0,He.value=[],O.value="",X.value=!0,me.value="worldSettings";try{let c="";if(vt.value&&$t.value)c=`=== 小说基本信息 ===
小说标题：${((a=x.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${Vt((e=x.value)==null?void 0:e.genre)}
小说简介：${((i=x.value)==null?void 0:i.description)||"暂无简介"}

=== 世界观生成要求 ===
${$t.value}

请根据小说信息和以上要求生成${q.value.count}个世界观设定，确保设定符合小说的整体风格和世界观。`,console.log("使用自定义世界观提示词:",c);else{const D=[];q.value.includeGeography&&D.push("地理环境"),q.value.includeCulture&&D.push("文化社会"),q.value.includeHistory&&D.push("历史背景"),q.value.includeMagic&&D.push("魔法体系"),q.value.includeTechnology&&D.push("科技水平"),q.value.includePolitics&&D.push("政治势力"),q.value.includeReligion&&D.push("宗教信仰"),q.value.includeEconomy&&D.push("经济贸易"),q.value.includeRaces&&D.push("种族设定"),q.value.includeLanguage&&D.push("语言文字"),c=`=== 小说基本信息 ===
小说标题：${((o=x.value)==null?void 0:o.title)||"未命名小说"}
小说类型：${Vt((d=x.value)==null?void 0:d.genre)}
小说简介：${((p=x.value)==null?void 0:p.description)||"暂无简介"}

=== 世界观生成任务 ===
请为上述小说生成${q.value.count}个世界观设定。

=== 生成要求 ===
设定类型要求：${D.join("、")}
${q.value.customPrompt?`特殊要求：${q.value.customPrompt}`:""}

请为每个设定生成详细信息，格式如下：

设定1：
标题：[设定标题]
类型：[设定类型]
描述：[详细描述，包含具体的设定内容、规则、特点等]

设定2：
...

请确保所有设定都符合小说的类型、风格和世界观，设定之间具有关联性和一致性。`,console.log("使用默认世界观提示词")}const S=yield qe.generateTextStream(c,{maxTokens:null,temperature:.8,type:"worldview"},(D,f)=>{O.value=f,pn(f),zt(()=>{const b=document.querySelector(".streaming-content");b&&(b.scrollTop=b.scrollHeight)})});pn(S),y.success(`成功生成 ${He.value.length} 个世界观设定`)}catch(c){console.error("AI生成世界观设定失败:",c),y.error(`世界观生成失败: ${c.message}`)}finally{_t.value=!1,X.value=!1,O.value=""}}}),pn=a=>{if(!a||!a.trim()){He.value=[];return}console.log("原始内容:",a);let e=[];if(a.includes("设定1：")||a.includes("设定2："))e=a.split(/设定\d+[：:]/i).filter(o=>o.trim());else if(a.includes("## ")||a.includes("# "))e=a.split(/#{1,3}\s+/).filter(o=>o.trim());else if(a.includes("1.")||a.includes("2."))e=a.split(/\d+\./).filter(o=>o.trim());else if(a.includes("**")&&a.includes("标题："))e=a.split(/\*\*[^*]+\*\*/).filter(o=>o.trim());else if(a.split("标题：").length>2)e=a.split("标题：").filter(o=>o.trim()),e=e.map((o,d)=>d===0&&!o.includes("标题：")?null:o.includes("标题：")?o:"标题："+o).filter(o=>o!==null);else{const o=a.split(/\n\s*\n/).filter(d=>d.trim());o.length>1?e=o:e=[a]}console.log("分割后的块数:",e.length);const i=[];if(e.forEach((o,d)=>{if(!o.trim())return;console.log(`处理块 ${d}:`,o.substring(0,100));const p=o.split(`
`).map(f=>f.trim()).filter(f=>f),c={id:Date.now()+d*1e3,title:"",type:"其他",description:"",createdAt:new Date,generated:!0};let S=!1,D=[];if(p.forEach((f,b)=>{if(f.startsWith("标题：")||f.startsWith("标题:"))c.title=f.replace(/标题[：:]/,"").trim(),S=!1;else if(f.startsWith("类型：")||f.startsWith("类型:"))c.type=f.replace(/类型[：:]/,"").trim(),S=!1;else if(f.startsWith("描述：")||f.startsWith("描述:")){const T=f.replace(/描述[：:]/,"").trim();T?D=[T]:D=[],S=!0}else S&&f&&!f.match(/^(标题|类型|描述)[：:]/)?D.push(f):!c.title&&b===0?c.title=f.replace(/^[^\u4e00-\u9fa5a-zA-Z]*/,"").trim():!S&&f&&!f.match(/^(标题|类型|描述)[：:]/)&&(D.push(f),S=!0)}),D.length>0&&(c.description=D.join(`
`).trim()),!c.title)if(c.description&&c.description.length>0){const f=c.description.split(`
`)[0];if(f.length<=50)c.title=f,c.description=c.description.split(`
`).slice(1).join(`
`).trim();else{const b=f.split(/[。！？.!?]/)[0];b.length<=30?c.title=b:c.title=`世界观设定${d+1}`}}else c.title=`世界观设定${d+1}`;if(!c.title&&!c.description){const f=o.trim();if(f.length>0){const b=f.split(`
`)[0].trim();b.length<=50&&b.length>0?(c.title=b,c.description=f.split(`
`).slice(1).join(`
`).trim()||"详细设定内容"):(c.title=`世界观设定${d+1}`,c.description=f)}}(!c.description||c.description.trim()==="")&&(c.description="暂无描述"),console.log(`解析结果 ${d}:`,{title:c.title,type:c.type,description:c.description.substring(0,100)+(c.description.length>100?"...":"")}),c.title&&c.title.trim()!==""&&i.push(c)}),i.length===0&&a.trim().length>0){const o=a.trim().split(`
`).filter(d=>d.trim());if(o.length>0){const d={id:Date.now(),title:o[0].length<=50?o[0]:"世界观设定",type:"其他",description:o.length>1?o.slice(1).join(`
`):o[0],createdAt:new Date,generated:!0};i.push(d),console.log("创建默认设定:",d)}}console.log("最终解析结果数量:",i.length),He.value=i},ya=()=>{const a=He.value.filter(e=>e.selected!==!1);if(a.length===0){y.warning("请选择要添加的世界观设定");return}a.forEach(e=>{P.addWorldSetting(e)}),ze(),ht.value=!1,y.success(`成功添加 ${a.length} 个世界观设定`)},ha=a=>{a.selected=a.selected===!1},_a=()=>H(this,null,function*(){var a,e,i;if(Q()){if(!((a=De.value.title)!=null&&a.trim())){y.warning("请先输入设定标题");return}Qt.value=!0,O.value="",X.value=!0,me.value="worldSetting",De.value.description="";try{const o={setting:"世界设定",magic:"魔法体系",politics:"政治势力",geography:"地理环境",history:"历史背景"}[De.value.category]||"世界设定",d=`=== 小说基本信息 ===
小说标题：${((e=x.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=x.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((i=x.value)==null?void 0:i.description)||"暂无简介"}

=== 世界观设定生成任务 ===
请为上述小说生成世界观设定的详细描述。

=== 设定信息 ===
- 设定标题：${De.value.title}
- 设定类别：${o}

=== 生成要求 ===
请生成详细的设定描述，包括：
1. 具体的设定内容和规则
2. 在小说世界中的作用和意义
3. 与其他设定的关联性
4. 对故事情节的影响

要求描述详细、生动，符合小说的类型、风格和整体世界观。`,p=yield qe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"worldview"},(c,S)=>{O.value=S,De.value.description=S});De.value.description=p,y.success("AI世界观设定生成完成")}catch(o){console.error("AI生成世界观设定失败:",o),y.error(`设定生成失败: ${o.message}`)}finally{Qt.value=!1,X.value=!1,O.value=""}}}),wa=a=>H(this,null,function*(){var e,i;if(Q()){Pe.value=!0,X.value=!0,me.value="chapter",O.value="";try{console.log("使用自定义提示词生成章节:",a);const o=`=== 小说基本信息 ===
小说标题：${((e=x.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=x.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((i=x.value)==null?void 0:i.description)||"暂无简介"}

=== 章节生成要求 ===
${a}

请确保生成的章节符合小说的整体风格、类型和世界观设定。`,d=yield qe.generateTextStream(o,{maxTokens:null,temperature:.8,type:"outline"},(c,S)=>{O.value=S});if(!d.trim())throw new Error("AI返回内容为空");const p=Ml(d);p.forEach((c,S)=>{const D={id:Date.now()+S,title:c.title||`AI生成章节 ${z.value.length+S+1}`,description:c.description||c.outline||"暂无描述",content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};z.value.push(D)}),y.success(`成功生成${p.length}个章节大纲`),ze()}catch(o){console.error("AI生成章节失败:",o),y.error(`章节生成失败: ${o.message}`)}finally{Pe.value=!1,X.value=!1,O.value=""}}}),mn=a=>H(this,null,function*(){var e,i;if(Q()){if(!E.value){y.warning("请先选择一个章节");return}xe.value=!0,X.value=!0,me.value="content",O.value="",$e.value=E.value;try{console.log("使用自定义提示词生成正文:",a);const o=wl(),d=B.value;let p=`=== 小说基本信息 ===
小说标题：${((e=x.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var b;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(b=x.value)==null?void 0:b.genre]||"通用小说"})()}
小说简介：${((i=x.value)==null?void 0:i.description)||"暂无简介"}

=== 当前章节信息 ===
章节标题：${E.value.title}
章节大纲：${E.value.description||"暂无大纲"}

=== 生成配置（用户最新设置） ===
目标字数：约${d.wordCount}字
写作视角：${Kt(d.style)}
重点内容：${d.focus||"按大纲发展"}

`;if(L.value.characters.length>0){const f=L.value.characters;p+=`=== 主要人物设定 ===
${f.map(b=>`- ${b.name}（${b.role}）：${b.personality||"暂无描述"}`).join(`
`)}

`}if(L.value.worldSettings.length>0){const f=L.value.worldSettings;p+=`=== 世界观设定 ===
${f.map(b=>`- ${b.title}：${b.description||"暂无描述"}`).join(`
`)}

`}if(L.value.corpus.length>0&&(p+=`=== 参考语料 ===
${L.value.corpus.map(f=>`【${f.title}】${f.content}`).join(`

`)}

`),L.value.events.length>0){const f=L.value.events;p+=`=== 相关事件线 ===
${f.map(b=>`- 第${b.chapter}章：${b.title} - ${b.description||"暂无描述"}`).join(`
`)}

【事件线要求】本章内容需要考虑以上事件的影响和发展，确保情节的连贯性和合理性。

`}let c=[];if(J.value&&J.value.length>0&&(c=J.value.map(f=>z.value.find(b=>b.id===f)).filter(Boolean)),c.length>0){const f=c.map(b=>`第${z.value.findIndex(V=>V.id===b.id)+1}章：${b.title}`).join("、");console.log(`正在使用以下章节作为上下文参考：${f}`),y.info({message:`使用上下文：${f}`,duration:3e3}),p+=`=== 前文概要（必须保持连贯） ===
${c.map(b=>`第${z.value.findIndex(V=>V.id===b.id)+1}章《${b.title}》：${b.description||"暂无概要"}`).join(`
`)}

=== 前文详细内容（保持文风和情节连贯） ===`,c.forEach(b=>{const T=z.value.findIndex(V=>V.id===b.id)+1;if(b.description&&(p+=`
【第${T}章大纲】
${b.description}
`),b.content&&b.content.trim()){const V=b.content.replace(/<[^>]*>/g,"").trim();if(V.length<=1e3)p+=`
【第${T}章内容】
${V}
`;else{const ae=V.substring(0,500),ge=V.slice(-500);p+=`
【第${T}章开头部分】
${ae}

【第${T}章结尾部分】
${ge}
`}}}),p+=`
【重要】必须确保本章内容与选定的前文章节在以下方面保持连贯：
- 人物性格和行为逻辑一致
- 时间线和事件发展合理
- 情节推进自然流畅
- 世界观设定保持统一
- 文风和叙述风格保持一致
- 与前文情节自然衔接，特别是与最后章节的结尾部分

`}p+=`=== 核心生成要求 ===
${a}

=== 写作要求（必须严格遵守） ===
1. 保持${Kt(d.style)}的叙述方式
2. 字数控制在${d.wordCount}字左右
3. 重点突出：${d.focus||"按大纲推进剧情"}
4. 严格按照章节大纲发展情节，不得偏离主线剧情
5. 与前文内容保持逻辑连贯，人物行为符合已建立的性格
6. 世界观、人物设定、时间线必须与前文保持一致
7. 确保本章有明确的开始、发展、高潮、结尾

=== 质量标准 ===
1. 情节发展必须合理，不出现逻辑漏洞
2. 人物对话符合各自的性格特点
3. 环境描写与已建立的世界观一致
4. 节奏控制得当，张弛有度
5. 语言风格与整部小说保持统一

【警告】绝对不能：
- 偏离章节大纲的主要情节
- 改变已确定的人物性格
- 违背已建立的世界观设定
- 出现与前文矛盾的内容

请确保生成的正文符合小说的整体风格、类型和世界观设定，与章节大纲保持一致。`,console.log("=== 发送给AI的完整提示词 ==="),console.log("选中的上下文章节:",c.map(f=>`第${z.value.findIndex(b=>b.id===f.id)+1}章：${f.title}`)),console.log(p),console.log("=== 提示词结束 ===");const S=yield qe.generateTextStream(p,{maxTokens:null,temperature:.8,type:"generation"},(f,b)=>{var V,ae;console.log("提示词生成流式回调:",f.length,"字符，总长度:",b.length),O.value=b;const T=Xt(b,E.value.title);((V=$e.value)==null?void 0:V.id)===((ae=E.value)==null?void 0:ae.id)&&(Z.value=T,Ae.value=!0)});if(!S.trim())throw new Error("AI返回内容为空");const D=Xt(S,E.value.title);Z.value=D,Ae.value=!0,E.value.status="draft",y.success("正文生成成功"),setTimeout(()=>{ft(),ze()},1e3)}catch(o){console.error("AI生成正文失败:",o),y.error(`正文生成失败: ${o.message}`)}finally{xe.value=!1,X.value=!1,O.value="",$e.value=null}}}),fn=(a=null)=>H(this,null,function*(){var e,i;if(Q()){if(!E.value||!Z.value){y.warning("请先选择章节并添加内容");return}Ee.value=!0,X.value=!0,me.value="optimize",O.value="",$e.value=E.value;try{let o=a;a||(oe.value?o=ke.value:o=gn());const d=`=== 小说基本信息 ===
小说标题：${((e=x.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=x.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((i=x.value)==null?void 0:i.description)||"暂无简介"}

=== 当前章节信息 ===
章节标题：${E.value.title}
章节大纲：${E.value.description||"暂无大纲"}

=== 优化要求 ===
${o}

=== 原文内容 ===
${_l()}

请确保优化后的内容符合小说的整体风格、类型和世界观设定。`,p=yield qe.generateTextStream(d,{maxTokens:null,temperature:.7,type:"optimize"},(c,S)=>{console.log("优化流式回调:",c.length,"字符，总长度:",S.length),O.value=S});Z.value=p,Ae.value=!0,y.success("文本优化完成"),w.value=!1,setTimeout(()=>{ft(),ze()},1e3)}catch(o){console.error("文本优化失败:",o),y.error(`优化失败: ${o.message}`)}finally{Ee.value=!1,X.value=!1}}}),ba=()=>{oe.value=null,Se.value={},ke.value=""},yl=()=>JSON.parse(localStorage.getItem("prompts")||"[]").filter(e=>e.category==="polish"||e.category==="optimize"),Ca=()=>{const a=yl();console.log("刷新优化提示词:",a.length)},$a=a=>{oe.value=a;const e={},i=a.content.match(/\{\{([^}]+)\}\}/g);i&&i.forEach(o=>{const d=o.replace(/\{\{|\}\}/g,"");e[d]=""}),Se.value=e,hl()},ka=()=>{oe.value&&(Object.keys(Se.value).forEach(a=>{var e,i;a.includes("文本")||a.includes("内容")?Se.value[a]=_l().substring(0,200)+"...":a.includes("类型")||a.includes("风格")?Se.value[a]=((e=x.value)==null?void 0:e.genre)||"通用":(a.includes("章节")||a.includes("标题"))&&(Se.value[a]=((i=E.value)==null?void 0:i.title)||"")}),hl())},hl=()=>{if(!oe.value){ke.value=gn();return}let a=oe.value.content;Object.keys(Se.value).forEach(e=>{const i=Se.value[e]||`[${e}]`;a=a.replace(new RegExp(`\\{\\{${e}\\}\\}`,"g"),i)}),ke.value=a},_l=()=>Z.value?Z.value.replace(/<[^>]*>/g,"").trim():"",ll=()=>_l().length,xa=()=>{y.info("已选择全部文本")},Va=()=>{y.info("已清空选择")},Sa=()=>{oe.value=null,Se.value={},hl()},gn=()=>{const a=Hn(Ge.value);return`请对以下小说内容进行${tn()}。

优化要求：
${a}

请返回优化后的内容，保持原文的故事情节和人物性格不变。`},Ia=()=>{k.push("/prompts-library")},Ta=()=>{ke.value&&(navigator.clipboard.writeText(ke.value),y.success("提示词已复制到剪贴板"))},za=()=>{y.info("您可以直接在预览框中编辑提示词")},Aa=()=>{var a;Dl()&&Mt.alert(`优化类型：${tn()}
文本长度：${ll()} 字
预估费用：¥${(ll()*.001).toFixed(3)}
使用提示词：${((a=oe.value)==null?void 0:a.title)||"默认提示词"}`,"优化预览",{confirmButtonText:"确定"})},Dl=()=>ll()>0&&(oe.value||Ge.value),Pa=()=>{const a=ll(),e=(a*.001).toFixed(3);return`文本${a}字，预估费用¥${e}`},Da=a=>H(this,null,function*(){var i,o;if(!Q())return;if(!E.value){y.warning("请先选择一个章节");return}if(!Z.value||Z.value.trim().length<50){y.warning("请先写一些内容，AI将基于现有内容进行续写");return}xe.value=!0,X.value=!0,me.value="continue",O.value="",$e.value=E.value;const e=Z.value;try{console.log("使用自定义提示词续写:",a);const d=wl(),p=Un.value;let c=`=== 小说基本信息 ===
小说标题：${((i=x.value)==null?void 0:i.title)||"未命名小说"}
小说类型：${(()=>{var b;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(b=x.value)==null?void 0:b.genre]||"通用小说"})()}
小说简介：${((o=x.value)==null?void 0:o.description)||"暂无简介"}

=== 当前章节信息 ===
章节标题：${E.value.title}
章节大纲：${E.value.description||"暂无大纲"}

=== 生成配置 ===
生成类型：${ns($.value)}
写作视角：${Kt(p.style)}
重点内容：${p.focus||"按大纲发展"}

`;d.characters.length>0&&p.useCharacters&&(c+=`=== 主要人物设定 ===
${d.characters.map(f=>`- ${f.name}（${f.role}）：${f.personality||"暂无描述"}`).join(`
`)}

`),d.worldSettings.length>0&&p.useWorldview&&(c+=`=== 世界观设定 ===
${d.worldSettings.map(f=>`- ${f.title}：${f.description||"暂无描述"}`).join(`
`)}

`),c+=`=== 已有内容（必须保持连贯） ===
${e}

=== 续写要求 ===
${a}

=== 核心约束（必须严格遵守） ===
1. 【连贯性】必须与已有内容在语言风格、情节发展、人物行为上完全连贯
2. 【一致性】人物性格、世界观设定、时间线必须与前文保持一致
3. 【逻辑性】情节发展必须符合逻辑，不能出现突兀的转折
4. 【主题控制】不得偏离章节大纲的主要情节线

=== 写作要求 ===
1. 基于已有内容的风格和语调继续创作
2. 保持${Kt(p.style)}的叙述方式
3. 保持情节的连贯性和逻辑性
4. 符合章节大纲的发展方向
5. 根据生成类型重点突出：${as($.value)}
6. 突出重点：${p.focus||"按大纲推进剧情"}

=== 质量标准 ===
1. 续写内容与前文无缝衔接，读者感受不到断层
2. 人物对话和行为符合已建立的性格特点
3. 情节推进自然流畅，不出现逻辑跳跃
4. 语言风格与前文完全一致

【警告】绝对不能：
- 改变已有内容中人物的性格特点
- 违背已建立的情节设定
- 出现与前文矛盾的描述
- 偏离章节大纲的发展方向

请确保续写内容符合小说的整体风格、类型和世界观设定，与前文保持完美连贯性。`;const S=yield qe.generateTextStream(c,{maxTokens:null,temperature:.8,type:"continue"},(f,b)=>{var V,ae;const T=Xt(b,"");O.value=T,((V=$e.value)==null?void 0:V.id)===((ae=E.value)==null?void 0:ae.id)&&(Z.value=e+`
`+T,Ae.value=!0)});if(!S.trim())throw new Error("AI返回内容为空");const D=Xt(S,"");Z.value=e+`
`+D,Ae.value=!0,y.success("续写完成"),setTimeout(()=>{ft(),ze()},1e3)}catch(d){console.error("AI续写失败:",d),y.error(`续写失败: ${d.message}`),Z.value=e}finally{xe.value=!1,X.value=!1,O.value="",$e.value=null}}),Ma=a=>H(this,null,function*(){var e,i;if(Q()){if(!M.value.name.trim()){y.warning("请先输入角色姓名");return}X.value=!0,me.value="character",O.value="",M.value.appearance="",M.value.personality="",M.value.background="",M.value.tags=[];try{console.log("使用自定义提示词生成人物:",a);const p=`=== 小说基本信息 ===
小说标题：${((e=x.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var f;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(f=x.value)==null?void 0:f.genre]||"通用小说"})()}
小说简介：${((i=x.value)==null?void 0:i.description)||"暂无简介"}

=== 角色基本设定 ===
- 姓名：${M.value.name}
- 角色定位：${M.value.role==="protagonist"?"主角":M.value.role==="antagonist"?"反派":"配角"}
- 性别：${M.value.gender==="male"?"男":M.value.gender==="female"?"女":"其他"}
- 年龄：${M.value.age}岁

=== 角色生成要求 ===
${a}

请确保角色设定符合小说的世界观、类型和风格特点。`+`

=== 重要格式要求 ===
无论上述提示词如何，你必须严格按照以下格式输出，不得有任何偏差：

外貌：[详细外貌描述]
性格：[性格特点描述]
背景：[背景故事]
标签：[标签1,标签2,标签3]

必须包含这4个字段，每个字段占一行。`;console.log("=== 自定义提示词角色生成最终提示词 ==="),console.log(p),console.log("=== 提示词结束 ===");const S=(yield qe.generateTextStream(p,{maxTokens:null,temperature:.8,type:"character"},(D,f)=>{O.value=f;const b=f.split(`
`);for(const T of b){const V=T.trim();if(V.startsWith("外貌："))M.value.appearance=V.replace("外貌：","").trim();else if(V.startsWith("性格："))M.value.personality=V.replace("性格：","").trim();else if(V.startsWith("背景："))M.value.background=V.replace("背景：","").trim();else if(V.startsWith("标签：")){const ae=V.replace("标签：","").trim();ae&&(M.value.tags=ae.split(",").map(ge=>ge.trim()).filter(ge=>ge))}}})).split(`
`);for(const D of S){const f=D.trim();if(f.startsWith("外貌："))M.value.appearance=f.replace("外貌：","").trim();else if(f.startsWith("性格："))M.value.personality=f.replace("性格：","").trim();else if(f.startsWith("背景："))M.value.background=f.replace("背景：","").trim();else if(f.startsWith("标签：")){const b=f.replace("标签：","").trim();M.value.tags=b.split(",").map(T=>T.trim()).filter(T=>T)}}y.success("AI角色生成完成")}catch(o){console.error("AI生成角色失败:",o),y.error(`角色生成失败: ${o.message}`)}finally{X.value=!1,O.value=""}}}),Ea=()=>H(this,null,function*(){var a,e;if(Q()){nt.value=!0;try{const i=Be.value.title||"新章节",o=wl(),d=`=== 小说基本信息 ===
小说标题：${((a=x.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=x.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((e=x.value)==null?void 0:e.description)||"暂无简介"}

=== 章节大纲生成任务 ===
请为上述小说的章节《${i}》生成详细大纲。

章节标题：${i}

${o.characters.length>0?`主要人物：
${o.characters.map(c=>`- ${c.name}（${c.role}）`).join(`
`)}`:""}

${o.worldSettings.length>0?`世界观设定：
${o.worldSettings.map(c=>`- ${c.title}`).join(`
`)}`:""}

已有章节：
${z.value.map((c,S)=>`第${S+1}章：${c.title} - ${c.description||"暂无描述"}`).join(`
`)}

=== 核心约束（必须严格遵守） ===
1. 【主题控制】大纲必须服务于小说的主线剧情，不得偏离主题
2. 【连贯性】与前文章节在情节、人物、世界观上保持完全连贯
3. 【逻辑性】情节发展必须符合逻辑，人物行为合理
4. 【完整性】确保章节有明确的目标和完整的结构

=== 大纲生成要求 ===
1. 生成该章节的详细内容大纲
2. 包含具体的情节发展和转折点
3. 标明重要的人物出场和互动
4. 设计关键的场景和冲突
5. 安排章节的起承转合
6. 明确章节在整体故事中的作用

=== 质量标准 ===
1. 大纲内容与小说主题高度契合
2. 情节发展自然流畅，无逻辑漏洞
3. 人物行为符合已建立的性格特点
4. 与前文章节形成有机整体

【警告】绝对不能：
- 偏离小说的主线剧情
- 违背已建立的世界观设定
- 出现与前文矛盾的情节
- 设计不符合人物性格的行为

请生成详细的章节大纲：`;if(console.log("开始AI生成章节大纲:",d),!(yield qe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"outline"},(c,S)=>{Be.value.description=S})).trim())throw new Error("AI返回内容为空");y.success("章节大纲生成成功")}catch(i){console.error("AI生成大纲失败:",i),y.error(`大纲生成失败: ${i.message}`)}finally{nt.value=!1}}}),Ua=()=>{var a;if(!((a=E.value)!=null&&a.description)){y.warning("请先为章节添加大纲描述");return}on(E.value)},Fa=()=>{if(!Q())return;let a="";if(ue.value)try{a=ue.value.getSelectionText()||""}catch(e){console.warn("获取选择文本失败:",e),a=""}if(a.trim())te.value.originalContent=a.trim(),te.value.mode="selection",y.info("检测到选择内容，将优化选择的文本");else{const e=Z.value.replace(/<[^>]*>/g,"").trim();if(!e){y.warning("当前章节没有内容可以优化");return}te.value.originalContent=e,te.value.mode="full",y.info("未检测到选择内容，将优化整篇文章")}le.value=!0},yn=be(()=>te.value.originalContent.trim()&&(te.value.selectedPrompt||te.value.customPrompt.trim())),Ra=a=>{te.value.selectedPrompt=a,console.log("选择润色提示词:",a.title)},hn=be(()=>Z.value.trim().length>=50),Wa=()=>{if(Q()){if(!E.value){y.warning("请先选择一个章节");return}if(!Z.value||Z.value.trim().length<50){y.warning("请先写一些内容，AI将基于现有内容进行续写");return}mt.value.direction="",mt.value.wordCount=500,Ye.value="",bt.value=!1,at.value=!0}},Oa=()=>Z.value?Z.value.replace(/<[^>]*>/g,"").trim():"",Ba=()=>{mt.value.direction="",mt.value.wordCount=500,Ye.value="",bt.value=!1},Na=()=>H(this,null,function*(){var a,e;if(!hn.value){y.warning("内容太少，无法进行续写");return}bt.value=!0,Ye.value="";try{const i=wl(),o=Z.value.replace(/<[^>]*>/g,"").trim();let d=`=== 小说基本信息 ===
小说标题：${((a=x.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=x.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((e=x.value)==null?void 0:e.description)||"暂无简介"}

=== 当前章节信息 ===
章节标题：${E.value.title}
章节大纲：${E.value.description||"暂无大纲"}

=== 续写任务 ===
请为上述小说的当前章节续写内容。

=== 已有内容（必须保持连贯） ===
${o}

${i.characters.length>0?`=== 主要人物设定 ===
${i.characters.map(c=>`- ${c.name}：${c.personality||"暂无描述"}`).join(`
`)}

`:""}=== 续写要求 ===
1. 基于已有内容的风格和语调继续创作
2. 保持情节的连贯性和逻辑性
3. 符合章节大纲的发展方向
4. 续写长度约${mt.value.wordCount}字`;mt.value.direction.trim()&&(d+=`
5. 续写方向：${mt.value.direction.trim()}`),d+=`

=== 核心约束（必须严格遵守） ===
1. 【连贯性】必须与已有内容在语言风格、情节发展、人物行为上完全连贯
2. 【一致性】人物性格、世界观设定、时间线必须与前文保持一致
3. 【逻辑性】情节发展必须符合逻辑，不能出现突兀的转折
4. 【主题控制】不得偏离章节大纲的主要情节线

请直接输出续写内容，无需额外说明：`,console.log("开始新的AI续写:",d.substring(0,200)+"...");const p=yield qe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"continue"},(c,S)=>{Ye.value=S});if(!p.trim())throw new Error("AI返回内容为空");Ye.value=p.trim(),y.success("续写完成")}catch(i){console.error("AI续写失败:",i),y.error(`续写失败: ${i.message}`)}finally{bt.value=!1}}),ja=()=>{bt.value=!1,y.info("已停止续写")},qa=()=>H(this,null,function*(){if(!Ye.value){y.warning("没有可复制的内容");return}try{yield navigator.clipboard.writeText(Ye.value),y.success("续写内容已复制到剪贴板")}catch(a){console.error("复制失败:",a),y.error("复制失败，请手动复制")}}),Ga=()=>{if(!Ye.value){y.warning("没有可追加的内容");return}const a=Xt(Ye.value,"");Z.value=Z.value+`
`+a,Ae.value=!0,y.success("续写内容已追加到文章"),at.value=!1,setTimeout(()=>{ft()},1e3)},La=()=>{te.value.optimizedContent="",te.value.customPrompt="",te.value.selectedPrompt=null,xt.value="",dt.value=!1},Ha=()=>H(this,null,function*(){if(!yn.value){y.warning("请选择润色类型或输入自定义要求");return}dt.value=!0,xt.value="",te.value.optimizedContent="";try{let a="";te.value.selectedPrompt?a=te.value.selectedPrompt.content:te.value.customPrompt.trim()&&(a=te.value.customPrompt.trim());const e=`${a}

原始内容：
${te.value.originalContent}

请直接输出优化后的内容，无需额外说明：`;console.log("开始新的AI优化:",e.substring(0,200)+"...");const i=yield qe.generateTextStream(e,{maxTokens:null,temperature:.7,type:"optimize"},(o,d)=>{xt.value=d});if(!i.trim())throw new Error("AI返回内容为空");te.value.optimizedContent=i.trim(),y.success("内容润色完成")}catch(a){console.error("AI润色失败:",a),y.error(`润色失败: ${a.message}`)}finally{dt.value=!1,xt.value=""}}),Ja=()=>{dt.value=!1,xt.value="",y.info("已停止润色")},Ka=()=>H(this,null,function*(){if(!te.value.optimizedContent){y.warning("没有可复制的内容");return}try{yield navigator.clipboard.writeText(te.value.optimizedContent),y.success("内容已复制到剪贴板")}catch(a){console.error("复制失败:",a),y.error("复制失败，请手动复制")}}),Xa=()=>{if(!te.value.optimizedContent){y.warning("没有可替换的内容");return}try{ue.value&&te.value.mode==="selection"?ue.value.getSelectionText()?(ue.value.insertText(te.value.optimizedContent),y.success("选择内容已替换为润色结果"),Ae.value=!0,le.value=!1,setTimeout(()=>{ft()},1e3)):y.warning("未找到选择的内容，请重新选择要替换的文本"):y.warning("当前不是选择模式或编辑器未就绪")}catch(a){console.error("替换失败:",a),y.error("替换失败")}},Ya=()=>{if(!te.value.optimizedContent){y.warning("没有可替换的内容");return}Mt.confirm("确定要用润色后的内容替换整篇文章吗？此操作不可撤销。","确认替换",{confirmButtonText:"确定替换",cancelButtonText:"取消",type:"warning"}).then(()=>{var e;const a=Xt(te.value.optimizedContent,((e=E.value)==null?void 0:e.title)||"");Z.value=a,Ae.value=!0,y.success("全文内容已替换为润色结果"),le.value=!1,setTimeout(()=>{ft()},1e3)}).catch(()=>{})},Ml=a=>{console.log("原始AI响应:",a);const e=[()=>Za(a),()=>Qa(a),()=>es(a),()=>ts(a),()=>ls(a)];for(const i of e){const o=i();if(o&&o.length>0)return console.log("解析成功，使用策略:",i.name,"，章节数:",o.length),o.forEach((d,p)=>{var c;return console.log(`第${p+1}章: ${d.title} - ${(c=d.description)==null?void 0:c.substring(0,50)}...`)}),o}return console.warn("所有解析策略都失败，创建默认章节"),[{title:"AI生成章节",description:a.substring(0,300)+(a.length>300?"...":"")}]},Za=a=>{console.log("策略1: 按章节号分割");const e=[],i=/章节(\d+)[：:\s]*[\r\n]/gi,o=[];let d;for(;(d=i.exec(a))!==null;)o.push({index:d.index,number:parseInt(d[1]),fullMatch:d[0]});if(console.log("找到章节标记:",o.length,"个"),o.length===0){const p=a.split(/章节\d+[：:]/i).filter(c=>c.trim());if(console.log("宽松匹配找到块数:",p.length),p.length<=1)return null;p.forEach((c,S)=>{if(S===0&&!c.includes("标题"))return;const D=c.split(`
`).filter(T=>T.trim());let f=`第${S}章`,b="";for(const T of D){const V=T.trim();V.match(/^标题[：:]/)?f=V.replace(/^标题[：:]/,"").trim():V.match(/^大纲[：:]/)?b=V.replace(/^大纲[：:]/,"").trim():b&&!V.match(/^(标题|大纲)/)?b+=`
`+V:!b&&!V.match(/^(标题|大纲)/)&&V.length>0&&(b=V)}f&&b&&e.push({title:f,description:b})})}else for(let p=0;p<o.length;p++){const c=o[p],S=o[p+1],D=c.index+c.fullMatch.length,f=S?S.index:a.length,b=a.substring(D,f).trim();console.log(`处理章节${c.number}:`,b.substring(0,100));const T=b.split(`
`).filter(ge=>ge.trim());let V=`第${c.number}章`,ae="";for(const ge of T){const A=ge.trim();A.match(/^标题[：:]/)?V=A.replace(/^标题[：:]/,"").trim():A.match(/^大纲[：:]/)?ae=A.replace(/^大纲[：:]/,"").trim():ae&&!A.match(/^(标题|大纲)/)?ae+=`
`+A:!ae&&!A.match(/^(标题|大纲)/)&&A.length>0&&(ae=A)}V&&ae&&(e.push({title:V,description:ae}),console.log(`成功解析章节${c.number}: ${V}`))}return console.log("策略1解析结果:",e.length,"个章节"),e.length>0?e:null},Qa=a=>{const e=[],i=a.split(`
`);let o=null;for(const d of i){const p=d.trim();p.match(/^标题[：:]/)?(o&&o.title&&o.description&&e.push(o),o={title:p.replace(/^标题[：:]/,"").trim(),description:""}):p.match(/^大纲[：:]/)?o&&(o.description=p.replace(/^大纲[：:]/,"").trim()):o&&o.description&&p&&!p.match(/^(标题|大纲|章节)/)&&(o.description+=`
`+p)}return o&&o.title&&o.description&&e.push(o),e.length>0?e:null},es=a=>{const e=[],i=/第\d+章[：:\s]*([^\n]+)/g;let o;const d=[];for(;(o=i.exec(a))!==null;)d.push({index:o.index,title:o[1].trim(),fullMatch:o[0]});if(d.length===0)return null;for(let p=0;p<d.length;p++){const c=d[p],S=d[p+1],D=c.index+c.fullMatch.length,f=S?S.index:a.length,b=a.substring(D,f).trim();b&&e.push({title:c.title,description:b})}return e.length>0?e:null},ts=a=>{const e=a.split(/\n\s*\n/).filter(o=>o.trim());if(e.length<2)return null;const i=[];for(const o of e){const d=o.split(`
`).filter(S=>S.trim());if(d.length<2)continue;const p=d[0].trim(),c=d.slice(1).join(`
`).trim();p&&c&&p.length<100&&i.push({title:p,description:c})}return i.length>0?i:null},ls=a=>{const e=[],i=a.split(`
`).filter(p=>p.trim());let o="",d="";for(let p=0;p<i.length;p++){const c=i[p].trim();(c.length<50&&(c.includes("章")||c.includes("第")||c.match(/^\d+[\.\、]/))&&!c.includes("：")&&!c.includes(":")||(p===0||i[p-1].trim()==="")&&c.length<30&&c.length>3)&&d.length>20?(o&&d&&e.push({title:o,description:d.trim()}),o=c,d=""):o?d+=(d?`
`:"")+c:o=c}return o&&d&&e.push({title:o,description:d.trim()}),e.length>0?e:null},Jt=a=>({general:"通用章节模板，平衡叙述和对话",battle:"战斗场景模板，突出动作和紧张感",emotion:"情感戏模板，重点描写心理和情感",turning:"转折剧情模板，制造悬念和反转"})[a]||"通用模板",Ut=()=>{if(console.log("getRecentChaptersDetail 被调用，当前章节数量:",z.value.length),z.value.length===0)return console.log("返回：暂无已有章节"),"暂无已有章节";const a=Math.min(5,z.value.length),e=z.value.slice(-a);console.log("最近章节数量:",a,"章节详情:",e.map(o=>({title:o.title,description:o.description,wordCount:o.wordCount})));const i=e.map((o,d)=>{let c=`第${z.value.length-a+d+1}章《${o.title}》`;return o.description&&o.description.trim()?c+=`
章节大纲：${o.description}`:c+=`
章节大纲：暂无大纲描述`,o.wordCount&&o.wordCount>0&&(c+=`
字数：${o.wordCount}字`),c}).join(`

`);return console.log("最终返回的章节详情:",i),i},Kt=a=>({"first-person":"第一人称","third-person":"第三人称",omniscient:"全知视角"})[a]||"第三人称",ns=a=>({content:"基础正文（标准章节内容生成）","content-dialogue":"对话生成（以对话为主的内容）","content-scene":"场景描写（环境氛围描写）","content-action":"动作情节（动作和冲突为主）","content-psychology":"心理描写（内心活动和情感）"})[a]||"基础正文",as=a=>({content:"平衡叙述、对话、心理描写、环境描写，创造完整的章节内容","content-dialogue":"重点突出人物对话，通过对话推进情节，展现人物性格和关系","content-scene":"详细描写环境、氛围、场景细节，营造身临其境的感觉","content-action":"重点描写动作场面、冲突情节，节奏紧凑，充满张力","content-psychology":"深入刻画人物内心活动、情感变化、心理冲突"})[a]||"平衡各种描写手法，创造丰富的内容",Xt=(a,e)=>{let i=a.trim();return i.includes(e)||(i=`<h3>${e}</h3>

${i}`),i.split(`
`).filter(p=>p.trim()).map(p=>{const c=p.trim();return c.startsWith("#")||c===e?`<h3>${c.replace(/^#+\s*/,"")}</h3>`:c.startsWith('"')||c.startsWith('"')||c.startsWith("「")?`<p class="dialogue">${c}</p>`:`<p>${c}</p>`}).join("")},wl=()=>{var i;const a=z.value.findIndex(o=>{var d;return o.id===((d=E.value)==null?void 0:d.id)}),e=z.value.slice(0,a);return{characters:Je.value,worldSettings:Pt.value,corpus:tt.value,events:Ze.value,previousChapters:e,currentNovelInfo:x.value,totalChapters:z.value.length,currentChapterIndex:a+1,storyProgress:a/Math.max(z.value.length-1,1),recentEvents:Ze.value.filter(o=>o.chapter&&parseInt(o.chapter)<=a+1).slice(-3),activeCharacters:Je.value.filter(o=>o.role==="protagonist"||o.role==="antagonist"),storyTheme:((i=x.value)==null?void 0:i.genre)||"通用"}},El=()=>{M.value={id:null,name:"",role:"supporting",gender:"male",age:25,appearance:"",personality:"",background:"",tags:[],avatar:""},qt.value=!0},_n=a=>{M.value=Me({},a),qt.value=!0},ss=()=>{if(!M.value.name.trim()){y.warning("请输入角色姓名");return}if(M.value.id){const a=Je.value.findIndex(e=>e.id===M.value.id);a>-1&&(Je.value[a]=Me({},M.value)),y.success("角色信息已更新")}else{const a=St(Me({},M.value),{id:Date.now(),createdAt:new Date});Je.value.push(a),y.success("角色创建成功")}qt.value=!1,ze()},os=()=>H(this,null,function*(){var a,e;if(Q()){if(!M.value.name.trim()){y.warning("请先输入角色姓名");return}X.value=!0,me.value="character",O.value="",M.value.appearance="",M.value.personality="",M.value.background="",M.value.tags=[];try{const d=`=== 小说基本信息 ===
小说标题：${((a=x.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${(()=>{var D;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(D=x.value)==null?void 0:D.genre]||"通用小说"})()}
小说简介：${((e=x.value)==null?void 0:e.description)||"暂无简介"}

=== 角色生成任务 ===
你是一个专业的角色生成器。请为上述小说中的角色《${M.value.name}》生成详细信息。

【重要】必须严格按照以下格式输出，不要添加任何额外的解释或文字：

外貌：身高一米七五，黑发黑眼，面容清秀
性格：温和友善，聪明机智，有时略显内向
背景：出身书香门第，自幼受到良好教育，立志成为学者
标签：知识分子,温和,聪慧

请完全按照以上示例格式生成角色信息，必须包含：外貌、性格、背景、标签这4个字段。

=== 角色基本设定 ===
- 姓名：${M.value.name}
- 角色定位：${M.value.role==="protagonist"?"主角":M.value.role==="antagonist"?"反派":"配角"}
- 性别：${M.value.gender==="male"?"男":M.value.gender==="female"?"女":"其他"}
- 年龄：${M.value.age}岁

请确保角色设定符合小说的世界观、类型和风格特点。

开始生成：`+`

=== 重要格式要求 ===
无论上述提示词如何，你必须严格按照以下格式输出，不得有任何偏差：

外貌：[详细外貌描述]
性格：[性格特点描述]
背景：[背景故事]
标签：[标签1,标签2,标签3]

必须包含这4个字段，每个字段占一行。`;console.log("=== 单个角色生成最终提示词 ==="),console.log(d),console.log("=== 提示词结束 ===");const c=(yield qe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"character"},(S,D)=>{O.value=D;const f=D.split(`
`);for(const b of f){const T=b.trim();if(T.startsWith("外貌："))M.value.appearance=T.replace("外貌：","").trim();else if(T.startsWith("性格："))M.value.personality=T.replace("性格：","").trim();else if(T.startsWith("背景："))M.value.background=T.replace("背景：","").trim();else if(T.startsWith("标签：")){const V=T.replace("标签：","").trim();V&&(M.value.tags=V.split(",").map(ae=>ae.trim()).filter(ae=>ae))}}})).split(`
`);for(const S of c){const D=S.trim();if(D.startsWith("外貌："))M.value.appearance=D.replace("外貌：","").trim();else if(D.startsWith("性格："))M.value.personality=D.replace("性格：","").trim();else if(D.startsWith("背景："))M.value.background=D.replace("背景：","").trim();else if(D.startsWith("标签：")){const f=D.replace("标签：","").trim();M.value.tags=f.split(",").map(b=>b.trim()).filter(b=>b)}}y.success("AI角色生成完成")}catch(i){console.error("AI生成角色失败:",i),y.error(`角色生成失败: ${i.message}`)}finally{X.value=!1,O.value=""}}}),wn=()=>{const a=dl.value.trim();a&&!M.value.tags.includes(a)&&(M.value.tags.push(a),dl.value="")},is=a=>{M.value.tags.splice(a,1)},rs=(a,e)=>{switch(a){case"edit":_n(e);break;case"delete":us(e);break}},us=a=>{Mt.confirm(`确定要删除角色《${a.name}》吗？`,"确认删除",{type:"warning",confirmButtonText:"删除",cancelButtonText:"取消",confirmButtonClass:"el-button--danger"}).then(()=>{const e=Je.value.findIndex(i=>i.id===a.id);e>-1&&(Je.value.splice(e,1),y.success("角色已删除"),ze())}).catch(()=>{})},Ul=()=>{De.value={title:"",description:"",category:"setting",details:""},Gt.value=!0},bn=a=>{De.value=Me({},a),Gt.value=!0},ds=a=>{Mt.confirm(`确定要删除设定《${a.title}》吗？`,"确认删除",{type:"warning"}).then(()=>{P.removeWorldSetting(a.id),y.success("设定已删除"),ze()}).catch(()=>{})},cs=(a,e)=>{switch(a){case"edit":bn(e);break;case"duplicate":vs(e);break;case"delete":ds(e);break}},vs=a=>{const e=St(Me({},a),{id:new Date().getTime(),title:a.title+" (副本)",createdAt:new Date,generated:!1});P.addWorldSetting(e),y.success("设定已复制"),ze()},ps=a=>a?new Date(a).toLocaleDateString("zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}):"",Fl=()=>{st.value={id:null,title:"",type:"description",content:"",tags:[]},Lt.value=!0},ms=a=>{st.value=Me({},a),Lt.value=!0},fs=a=>H(this,null,function*(){try{yield Mt.confirm(`确定要删除语料"${a.title}"吗？`,"删除确认",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"});const e=tt.value.findIndex(i=>i.id===a.id);e>-1&&(tt.value.splice(e,1),y.success("语料删除成功"))}catch(e){}}),Rl=()=>{var a;Ne.value={id:null,title:"",description:"",chapter:((a=E.value)==null?void 0:a.title)||"",time:new Date().toISOString().slice(0,16),importance:"normal"},Ht.value=!0},gs=a=>{Ne.value=Me({},a),Ht.value=!0},ys=()=>{if(!Ne.value.title.trim()){y.warning("请输入事件标题");return}if(Ne.value.id){const a=Ze.value.findIndex(e=>e.id===Ne.value.id);a>-1&&(Ze.value[a]=Me({},Ne.value)),y.success("事件信息已更新")}else{const a=St(Me({},Ne.value),{id:Date.now(),createdAt:new Date});Ze.value.push(a),y.success("事件创建成功")}Ht.value=!1,ze()},hs=a=>{Mt.confirm(`确定要删除事件《${a.title}》吗？`,"确认删除",{type:"warning"}).then(()=>{const e=Ze.value.findIndex(i=>i.id===a.id);e>-1&&(Ze.value.splice(e,1),y.success("事件已删除"),ze())}).catch(()=>{})},_s=(a,e)=>{switch(a){case"edit":gs(e);break;case"delete":hs(e);break}},ws=()=>{if(!E.value)return;const a=z.value.findIndex(e=>e.id===E.value.id);a>-1&&(z.value[a].status=E.value.status,z.value[a].updatedAt=new Date),ft(),ze(),y.success(`章节状态已更新为：${pl(E.value.status)}`)},bs=()=>{if(!De.value.title.trim()){y.warning("请输入设定标题");return}if(De.value.id)P.updateWorldSetting(De.value.id,De.value),y.success("设定信息已更新");else{const a=St(Me({id:new Date().getTime()},De.value),{createdAt:new Date});P.addWorldSetting(a),y.success("设定创建成功")}Gt.value=!1,ze()},Cs=()=>{if(!st.value.title.trim()){y.warning("请输入语料标题");return}if(st.value.id){const a=tt.value.findIndex(e=>e.id===st.value.id);a>-1&&(tt.value[a]=Me({},st.value)),y.success("语料信息已更新")}else{const a=St(Me({},st.value),{id:Date.now(),createdAt:new Date});tt.value.push(a),y.success("语料创建成功")}Lt.value=!1,ze()};let nl=null;const $s=()=>{nl&&clearTimeout(nl),nl=setTimeout(()=>{ks()},2e3)},ks=()=>{E.value&&(ye.value=!0,setTimeout(()=>{ft(),ye.value=!1},300))},ze=()=>{if(!x.value)return;const a=z.value.reduce((d,p)=>d+(p.wordCount||0),0),e=St(Me({},x.value),{chapterList:z.value,characters:Je.value,worldSettings:P.worldSettings,corpusData:tt.value,events:Ze.value,updatedAt:new Date,wordCount:a,chapters:z.value.length,totalWords:a}),i=JSON.parse(localStorage.getItem("novels")||"[]"),o=i.findIndex(d=>d.id===x.value.id);o>-1?i[o]=e:i.push(e),localStorage.setItem("novels",JSON.stringify(i))},Cn=()=>{const a=parseInt(h.query.novelId);if(a){const i=JSON.parse(localStorage.getItem("novels")||"[]").find(o=>o.id===a);i?(x.value=i,i.chapterList&&(z.value=i.chapterList.map(o=>{let d=o.status||"draft";return d==="outline"&&(d="draft"),St(Me({},o),{createdAt:new Date(o.createdAt),updatedAt:new Date(o.updatedAt),status:d})}),z.value.length>0&&vl(z.value[0]),ze()),Je.value=i.characters||[],P.worldSettings.splice(0,P.worldSettings.length),i.worldSettings&&i.worldSettings.length>0&&i.worldSettings.forEach(o=>{P.worldSettings.push(o)}),tt.value=i.corpusData||[],Ze.value=i.events||[]):(y.error("小说不存在"),k.push("/novels"))}else y.error("缺少小说ID参数"),k.push("/novels")};Ql(()=>{Cn(),Kn()}),Mn(()=>{nl&&clearTimeout(nl),ft(),ue.value&&ue.value.destroy()}),Rt(()=>h.query.novelId,()=>{h.query.novelId&&(E.value=null,Z.value="",Cn())});const xs=()=>{de.value="character",he.value=!0,ee.value=null,C.value={},j.value=""},Vs=()=>{At.value=null,ul.value={},Nt.value=""},Ss=()=>{de.value="worldview",he.value=!0,ee.value=null,C.value={},j.value=""},Is=()=>{vt.value=null,rt.value={},$t.value=""},Ts=()=>{var e,i,o;if(!vt.value)return;rt.value.小说标题=((e=x.value)==null?void 0:e.title)||"未命名小说",rt.value.小说类型=Vt((i=x.value)==null?void 0:i.genre),rt.value.小说简介=((o=x.value)==null?void 0:o.description)||"暂无简介",rt.value.生成数量=q.value.count.toString();const a=[];q.value.includeGeography&&a.push("地理环境"),q.value.includeCulture&&a.push("文化社会"),q.value.includeHistory&&a.push("历史背景"),q.value.includeMagic&&a.push("魔法体系"),q.value.includeTechnology&&a.push("科技水平"),q.value.includePolitics&&a.push("政治势力"),q.value.includeReligion&&a.push("宗教信仰"),q.value.includeEconomy&&a.push("经济贸易"),q.value.includeRaces&&a.push("种族设定"),q.value.includeLanguage&&a.push("语言文字"),rt.value.设定类型=a.join("、"),rt.value.特殊要求=q.value.customPrompt||"符合小说世界观设定",zs()},zs=()=>{if(!vt.value){$t.value="";return}let a=vt.value.content;Object.keys(rt.value).forEach(e=>{const i=rt.value[e]||`{${e}}`;a=a.replace(new RegExp(`\\{${e}\\}`,"g"),i)}),$t.value=a},As=()=>{L.value={characters:[],worldSettings:[],corpus:[],events:[],chapters:[]},J.value=[],C.value.前文概要&&(C.value.前文概要="",ot()),y.success("已清空所有选择")},bl=a=>{switch(a){case"characters":L.value.characters=[...Je.value];break;case"worldSettings":L.value.worldSettings=[...Pt.value];break;case"corpus":L.value.corpus=[...tt.value];break;case"events":L.value.events=[...Ze.value];break;case"chapters":L.value.chapters=[...ra.value];break}const e=a==="characters"?"人物":a==="worldSettings"?"世界观":a==="corpus"?"语料":a==="events"?"事件线":a==="chapters"?"章节":"素材";y.success(`已选择所有${e}`)},Ps=()=>{ee.value=null,C.value={},j.value="",y.info("已切换到默认提示词")},Ds=()=>{y.success("提示词列表已刷新")},Ms=()=>{k.push("/prompts-library")},Es=()=>{j.value&&(navigator.clipboard.writeText(j.value),y.success("提示词已复制到剪贴板"))},Us=()=>{y.info("您可以直接在预览框中编辑提示词")},$n=()=>H(this,null,function*(){if(!ee.value){y.warning("请先选择提示词模板");return}if(!E.value){y.warning("请先选择要生成内容的章节");return}if(Q()){xe.value=!0,Qe.value=!1;try{yield mn(j.value)}catch(a){console.error("生成失败:",a),y.error("生成失败: "+a.message)}finally{xe.value=!1}}}),Fs=()=>{fe.value={title:"",plotRequirement:"",template:"general"},pt.value=!0},Rs=()=>{Te.value={count:3,plotRequirement:"",template:"general"},et.value=!0},Ws=()=>{fe.value={title:"",plotRequirement:"",template:"general"},wt.value=null,Oe.value={},Fe.value="",O.value="",X.value=!1},Os=()=>{Te.value={count:3,plotRequirement:"",template:"general"},F.value=null,U.value={},We.value="",ut.value=["promptContent"],O.value="",X.value=!1},Bs=()=>{ce.value={optimizeType:"grammar",customRequirement:"",originalContent:"",optimizedContent:""},O.value="",X.value=!1},Ns=()=>H(this,null,function*(){var a,e,i;if(Q()){if(!fe.value.title.trim()){y.warning("请输入章节标题");return}Pe.value=!0,X.value=!0,me.value="single-chapter",O.value="";try{if(wt.value&&Fe.value){console.log("使用自定义提示词生成单章"),yield Hs(Fe.value);return}const o=`=== 小说基本信息 ===
小说标题：${((a=x.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${Vt((e=x.value)==null?void 0:e.genre)}
小说简介：${((i=x.value)==null?void 0:i.description)||"暂无简介"}

=== 单章生成任务 ===
【重要提醒】：请只生成一个章节的大纲，不要生成多个章节！

目标章节信息：
- 章节标题：${fe.value.title}
- 情节要求：${fe.value.plotRequirement||"请根据章节标题合理发展"}
- 模板类型：${Jt(fe.value.template)}
- 章节序号：第${z.value.length+1}章

已有章节概况：
${z.value.map((c,S)=>`第${S+1}章：${c.title} - ${c.description||"暂无描述"}`).join(`
`)}

【核心要求】：
1. 只生成一个章节（第${z.value.length+1}章）的详细大纲
2. 使用用户指定的章节标题：${fe.value.title}
3. 严格遵循用户的情节要求：${fe.value.plotRequirement||"按章节标题合理发展"}
4. 与前文保持逻辑连贯性，推进主线剧情发展
5. 包含具体的情节要点、人物发展、重要事件等
6. 不要生成多个章节，只生成一个章节的内容

请严格按照以下格式返回（只返回一个章节）：
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]`;console.log("开始AI生成单章大纲:",o);const d=yield qe.generateTextStream(o,{maxTokens:null,temperature:.8,type:"outline"},(c,S)=>{O.value=S});if(!d.trim())throw new Error("AI返回内容为空");const p={id:Date.now(),title:fe.value.title,description:d.replace(/^大纲：/,"").trim(),content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};z.value.push(p),pt.value=!1,y.success("单章大纲生成成功"),ze()}catch(o){console.error("AI生成单章失败:",o),y.error(`单章生成失败: ${o.message}`)}finally{Pe.value=!1,X.value=!1,O.value=""}}}),js=()=>H(this,null,function*(){var a,e,i;if(Q()){if(console.log("开始批量生成章节"),console.log("当前章节列表:",z.value.map(o=>({title:o.title,description:o.description}))),F.value&&We.value){console.log("使用自定义提示词生成"),yield Xs(We.value);return}console.log("使用默认模板生成"),Pe.value=!0,X.value=!0,me.value="batch-chapters",O.value="";try{const o=Te.value.count,d=Te.value.plotRequirement,p=Te.value.template;console.log("批量生成章节配置检查:",{count:o,plotRequirement:d,template:p,formData:Te.value});const c=[];for(let b=1;b<=o;b++)c.push(`章节${b}：
标题：[章节标题]
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]`);const S=`=== 小说基本信息 ===
小说标题：${((a=x.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${Vt((e=x.value)==null?void 0:e.genre)}
小说简介：${((i=x.value)==null?void 0:i.description)||"暂无简介"}

=== 章节生成任务 ===
请为上述小说生成${o}个章节大纲。

【用户具体要求】：
- 生成章节数量：${o}个章节（不多不少）
- 用户情节要求：${d||"请根据小说主题合理发展"}
- 模板类型：${Jt(p)}
- 每个章节包含：标题、详细大纲描述
- 章节之间要有逻辑连贯性
- 严格遵循用户的情节要求，围绕用户指定的情节发展

已有章节：${z.value.length}个

=== 前文章节信息（重要参考） ===
${Ut()}

请严格按照以下格式返回${o}个章节：

${c.join(`

`)}

【重要约束】：
1. 必须严格按照"章节X："格式开始每个章节（X为数字1到${o}）
2. 每个章节必须包含"标题："和"大纲："两个字段
3. 必须生成完整的${o}个章节，缺一不可
4. 确保格式完全一致，便于程序解析
5. 不要生成超过${o}个章节
6. 不要生成少于${o}个章节

请现在开始生成${o}个章节大纲：`;console.log("批量生成章节最终提示词:",S),console.log("请求生成章节数量:",o),console.log("前5章详细信息:",Ut());const D=yield qe.generateTextStream(S,{maxTokens:null,temperature:.8,type:"outline"},(b,T)=>{O.value=T});if(!D.trim())throw new Error("AI返回内容为空");console.log("AI响应长度:",D.length),console.log("AI响应内容:",D);const f=Ml(D);console.log("解析结果:",f),console.log("期望生成数量:",o,"实际解析数量:",f.length),f.length!==o&&(console.warn(`警告：期望生成${o}个章节，但实际解析出${f.length}个章节`),y.warning(`期望生成${o}个章节，但实际解析出${f.length}个章节`)),f.forEach((b,T)=>{const V={id:Date.now()+T,title:b.title||`AI生成章节 ${z.value.length+T+1}`,description:b.description||b.outline||"暂无描述",content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};z.value.push(V),console.log(`添加章节 ${T+1}:`,V.title)}),et.value=!1,y.success(`成功生成${f.length}个章节大纲`),ze()}catch(o){console.error("AI批量生成章节失败:",o),y.error(`批量生成失败: ${o.message}`)}finally{Pe.value=!1,X.value=!1,O.value=""}}}),qs=()=>H(this,null,function*(){if(Q()){if(!ce.value.originalContent.trim()){y.warning("请输入需要优化的内容");return}Ee.value=!0,X.value=!0,me.value="optimize",O.value="",ce.value.optimizedContent="";try{let a="";switch(ce.value.optimizeType){case"grammar":a="请对以下文本进行语法润色，修正语法错误，提升表达流畅度";break;case"style":a="请对以下文本进行文风优化，提升文学性和可读性";break;case"emotion":a="请对以下文本进行情感增强，加强情感表达和感染力";break;case"logic":a="请对以下文本进行逻辑梳理，优化结构和逻辑关系";break;case"custom":a=ce.value.customRequirement||"请对以下文本进行优化";break}const e=`${a}：

原始内容：
${ce.value.originalContent}

要求：
1. 保持原意不变
2. 优化表达方式
3. 提升整体质量
4. 直接输出优化后的内容，无需说明

优化后内容：`;console.log("开始AI优化内容:",e);const i=yield qe.generateTextStream(e,{maxTokens:null,temperature:.7,type:"optimize"},(o,d)=>{O.value=d,ce.value.optimizedContent=d});if(!i.trim())throw new Error("AI返回内容为空");ce.value.optimizedContent=i,y.success("内容优化完成")}catch(a){console.error("AI优化失败:",a),y.error(`优化失败: ${a.message}`)}finally{Ee.value=!1,X.value=!1,O.value=""}}}),Gs=()=>{E.value&&ce.value.optimizedContent?(E.value.content=ce.value.optimizedContent,Z.value=ce.value.optimizedContent,Ae.value=!0,kt.value=!1,y.success("优化内容已应用到当前章节")):y.warning("无法应用优化内容")},Ls=()=>{de.value="outline",he.value=!0},Hs=a=>H(this,null,function*(){var e,i,o;if(Q()){Pe.value=!0,X.value=!0,me.value="single-chapter",O.value="";try{const d=`=== 用户输入信息 ===
章节标题：${fe.value.title}
情节要求：${fe.value.plotRequirement||"请根据章节标题合理发展"}
模板类型：${Jt(fe.value.template)}

=== 小说基本信息 ===
小说标题：${((e=x.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${Vt((i=x.value)==null?void 0:i.genre)}
小说简介：${((o=x.value)==null?void 0:o.description)||"暂无简介"}

=== 已有章节概况 ===
${z.value.map((S,D)=>`第${D+1}章：${S.title} - ${S.description||"暂无描述"}`).join(`
`)}

=== 基于以上信息，请按照以下要求生成章节 ===
${a}

=== 重要约束 ===
【关键】：请只生成一个章节的大纲，不要生成多个章节！

1. 只生成一个章节（第${z.value.length+1}章）的详细大纲
2. 必须使用用户指定的章节标题：${fe.value.title}
3. 必须遵循用户的情节要求：${fe.value.plotRequirement||"按章节标题合理发展"}
4. 与已有章节保持逻辑连贯性，推进主线剧情发展
5. 包含具体的情节要点、人物发展、重要事件等
6. 不要生成多个章节，无论提示词中是否提到"10章"等内容，都只生成一个章节

请严格按照以下格式返回（只返回一个章节）：
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]`;console.log("使用自定义提示词生成单章:",d.substring(0,300)+"...");const p=yield qe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"outline"},(S,D)=>{O.value=D});if(!p.trim())throw new Error("AI返回内容为空");const c={id:Date.now(),title:fe.value.title,description:p.replace(/^大纲：/,"").trim(),content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};z.value.push(c),pt.value=!1,y.success("使用自定义提示词生成单章成功"),ze()}catch(d){console.error("使用自定义提示词生成单章失败:",d),y.error(`单章生成失败: ${d.message}`)}finally{Pe.value=!1,X.value=!1,O.value=""}}}),Js=()=>{console.log("打开批量章节提示词选择对话框"),console.log("当前章节数量:",z.value.length),console.log("当前章节列表:",z.value.map(a=>({title:a.title,description:a.description}))),de.value="outline",he.value=!0,zt(()=>{ee.value&&(console.log("nextTick中调用autoFillBatchChapterVariables"),al())})},al=()=>{var e,i,o;if(!ee.value){console.log("autoFillBatchChapterVariables: 没有选中的提示词");return}console.log("开始自动填充批量章节变量"),C.value.小说标题=((e=x.value)==null?void 0:e.title)||"未命名小说",C.value.小说类型=Vt((i=x.value)==null?void 0:i.genre),C.value.小说简介=((o=x.value)==null?void 0:o.description)||"暂无简介",C.value.生成章节数量=Te.value.count.toString(),C.value.情节要求=Te.value.plotRequirement||"请根据小说主题合理发展",C.value.模板类型=Jt(Te.value.template);const a=Ut();C.value.已有章节=a,console.log("批量章节变量填充完成:",{小说标题:C.value.小说标题,已有章节:a.substring(0,200)+"...",变量数量:Object.keys(C.value).length}),ot()},Wl=()=>{var e,i,o;if(!ee.value){console.log("autoFillSingleChapterVariables: 没有选中的提示词");return}console.log("开始自动填充单章变量"),C.value.小说标题=((e=x.value)==null?void 0:e.title)||"未命名小说",C.value.小说类型=Vt((i=x.value)==null?void 0:i.genre),C.value.小说简介=((o=x.value)==null?void 0:o.description)||"暂无简介",C.value.章节标题=fe.value.title||"",C.value.情节要求=fe.value.plotRequirement||"请根据章节标题合理发展",C.value.模板类型=Jt(fe.value.template);const a=Ut();C.value.已有章节=a,console.log("单章变量填充完成:",{小说标题:C.value.小说标题,章节标题:C.value.章节标题,情节要求:C.value.情节要求,变量数量:Object.keys(C.value).length}),ot()};Rt(()=>Te.value,()=>{et.value&&ee.value&&de.value==="outline"&&(console.log("批量章节表单变化，重新填充提示词变量"),al())},{deep:!0}),Rt(()=>fe.value,()=>{pt.value&&ee.value&&de.value==="outline"&&(console.log("单章表单变化，重新填充提示词变量"),Wl())},{deep:!0});const Ks=()=>{de.value="optimize",he.value=!0},Xs=a=>H(this,null,function*(){var e,i,o;if(Q()){Pe.value=!0,X.value=!0,me.value="batch-chapters",O.value="";try{const d=Te.value.count,p=Te.value.plotRequirement,c=Te.value.template;console.log("使用自定义提示词批量生成章节配置检查:",{count:d,plotRequirement:p,template:c,customPrompt:a.substring(0,200)+"..."}),console.log("使用自定义提示词:",{原始提示词长度:a.length,是否包含已有章节:a.includes("已有章节"),前5章详细信息:Ut().substring(0,300)+"..."});const S=Ut(),D=`=== 用户输入信息 ===
生成数量：${d}个章节
用户情节要求：${p||"请根据小说主题合理发展"}
模板类型：${Jt(c)}

=== 小说基本信息 ===
小说标题：${((e=x.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${Vt((i=x.value)==null?void 0:i.genre)}
小说简介：${((o=x.value)==null?void 0:o.description)||"暂无简介"}

=== 前文章节信息（重要参考） ===
${S}

=== 基于以上信息，请按照以下要求生成新章节 ===
${a}`;console.log("添加前5章信息后的提示词长度:",D.length),console.log("确认包含章节信息:",D.includes("第")&&D.includes("章"));const f=`${D}

=== 重要格式约束（必须严格遵守） ===
无论上述提示词如何，你必须严格按照以下格式输出${d}个章节，不得有任何偏差：

章节1：
标题：[章节标题]
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]

章节2：
标题：[章节标题]
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]

章节3：
标题：[章节标题]
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]

【核心约束】：
1. 必须严格按照"章节X："格式开始每个章节（X为数字1到${d}）
2. 每个章节必须包含"标题："和"大纲："两个字段
3. 必须生成完整的${d}个章节，缺一不可
4. 确保格式完全一致，便于程序解析
5. 不要生成超过${d}个章节
6. 不要生成少于${d}个章节
7. 标题要简洁有吸引力
8. 大纲要详细具体，包含具体的情节发展
9. 严格遵循用户的情节要求：${p||"请根据小说主题合理发展"}

请现在开始生成${d}个章节大纲：`;console.log("使用自定义提示词批量生成 - 最终提示词:"),console.log("==================== 完整提示词开始 ===================="),console.log(f),console.log("==================== 完整提示词结束 ===================="),console.log("请求生成章节数量:",d),console.log("前5章详细信息:",Ut());const b=yield qe.generateTextStream(f,{maxTokens:null,temperature:.8,type:"outline"},(V,ae)=>{O.value=ae});if(!b.trim())throw new Error("AI返回内容为空");console.log("AI响应长度:",b.length),console.log("AI响应内容:",b);const T=Ml(b);console.log("解析结果:",T),console.log("期望生成数量:",d,"实际解析数量:",T.length),T.length!==d&&(console.warn(`警告：期望生成${d}个章节，但实际解析出${T.length}个章节`),y.warning(`期望生成${d}个章节，但实际解析出${T.length}个章节`)),T.forEach((V,ae)=>{const ge={id:Date.now()+ae,title:V.title||`AI生成章节 ${z.value.length+ae+1}`,description:V.description||V.outline||"暂无描述",content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};z.value.push(ge),console.log(`添加章节 ${ae+1}:`,ge.title)}),et.value=!1,y.success(`成功使用自定义提示词生成${T.length}个章节大纲`),ze()}catch(d){console.error("AI批量生成章节失败:",d),y.error(`批量生成失败: ${d.message}`)}finally{Pe.value=!1,X.value=!1,O.value=""}}});return(a,e)=>{var Vn;const i=Kl,o=Jl,d=vo,p=ro,c=yo,S=go,D=fo,f=po,b=mo,T=uo,V=Yl,ae=Xl,ge=_o,A=Pn,R=An,gt=zn,lt=co,ct=$o,Ol=Tn,sl=ko,Ke=Co,Dt=bo,it=xo,kn=So,Ys=To,Zs=Io,xn=zo,Qs=Dn;return u(),m("div",Zi,[l("div",Qi,[l("div",er,[t(o,{onClick:Wn,size:"small"},{default:n(()=>[t(i,null,{default:n(()=>[t(N(kl))]),_:1}),e[111]||(e[111]=r(" 返回列表 ",-1))]),_:1}),l("span",tr,v(((Vn=x.value)==null?void 0:Vn.title)||"小说编辑"),1)])]),l("div",lr,[t(p,{modelValue:ve.value,"onUpdate:modelValue":e[0]||(e[0]=s=>ve.value=s),class:"main-tabs"},{default:n(()=>[t(d,{label:"📝 编辑",name:"editor"}),t(d,{label:"👥 人物",name:"characters"}),t(d,{label:"🌍 世界观",name:"worldview"}),t(d,{label:"📚 语料库",name:"corpus"}),t(d,{label:"📊 事件线",name:"events"})]),_:1},8,["modelValue"])]),l("div",nr,[l("div",ar,[Ct(l("div",sr,[t(T,{shadow:"never",class:"chapters-card"},{header:n(()=>[l("div",or,[e[116]||(e[116]=l("span",null,"📝 章节列表",-1)),t(D,{onCommand:Gn},{dropdown:n(()=>[t(S,null,{default:n(()=>[t(c,{command:"manual"},{default:n(()=>[...e[113]||(e[113]=[r("手动创建",-1)])]),_:1}),t(c,{command:"ai-single"},{default:n(()=>[...e[114]||(e[114]=[r("AI生成单章",-1)])]),_:1}),t(c,{command:"ai-batch"},{default:n(()=>[...e[115]||(e[115]=[r("AI批量生成",-1)])]),_:1})]),_:1})]),default:n(()=>[t(o,{size:"small",type:"primary"},{default:n(()=>[t(i,null,{default:n(()=>[t(N(ol))]),_:1}),e[112]||(e[112]=r(" 新增章节 ",-1)),t(i,null,{default:n(()=>[t(N(ho))]),_:1})]),_:1})]),_:1})])]),default:n(()=>[l("div",ir,[(u(!0),m(ie,null,re(z.value,(s,W)=>{var Y;return u(),m("div",{key:s.id,class:_e(["chapter-item",{active:((Y=E.value)==null?void 0:Y.id)===s.id}]),onClick:je=>vl(s)},[l("div",ur,[l("h4",null,"第"+v(W+1)+"章",1),l("p",null,v(s.title),1),l("div",dr,[l("span",null,v(s.wordCount||0)+"字",1),s.status?(u(),G(f,{key:0,type:Il(s.status),size:"small"},{default:n(()=>[r(v(pl(s.status)),1)]),_:2},1032,["type"])):I("",!0)]),s.description?(u(),G(b,{key:0,content:s.description,placement:"top-start",disabled:s.description.length<=50,effect:"light","show-after":300},{default:n(()=>[l("p",cr,v(s.description.length>50?s.description.substring(0,50)+"...":s.description),1)]),_:2},1032,["content","disabled"])):I("",!0)]),l("div",vr,[t(D,{onCommand:je=>Ln(je,s)},{dropdown:n(()=>[t(S,null,{default:n(()=>[t(c,{command:"edit"},{default:n(()=>[...e[117]||(e[117]=[r("编辑信息",-1)])]),_:1}),t(c,{command:"generate"},{default:n(()=>[...e[118]||(e[118]=[r("AI生成正文",-1)])]),_:1}),t(c,{divided:"",command:"delete"},{default:n(()=>[...e[119]||(e[119]=[r("删除",-1)])]),_:1})]),_:1})]),default:n(()=>[t(o,{size:"small",type:"text"},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Cl))]),_:1})]),_:1})]),_:1},8,["onCommand"])])],10,rr)}),128)),z.value.length===0?(u(),m("div",pr,[e[121]||(e[121]=l("p",null,"暂无章节",-1)),t(o,{size:"small",type:"primary",onClick:Sl},{default:n(()=>[...e[120]||(e[120]=[r(" 创建第一章 ",-1)])]),_:1})])):I("",!0)])]),_:1})],512),[[Bt,ve.value==="editor"]]),Ct(l("div",mr,[t(T,{shadow:"never"},{header:n(()=>[l("div",fr,[e[124]||(e[124]=l("span",null,"👥 人物角色",-1)),l("div",gr,[t(o,{size:"small",type:"primary",onClick:El},{default:n(()=>[t(i,null,{default:n(()=>[t(N(ol))]),_:1}),e[122]||(e[122]=r(" 新增 ",-1))]),_:1}),t(o,{size:"small",type:"success",onClick:va},{default:n(()=>[...e[123]||(e[123]=[r(" 🤖 AI批量生成 ",-1)])]),_:1})])])]),default:n(()=>[l("div",yr,[(u(!0),m(ie,null,re(Je.value,s=>{var W;return u(),m("div",{key:s.id,class:"character-item"},[l("div",{class:"character-content",onClick:Y=>_n(s)},[l("div",_r,[s.avatar?(u(),m("img",{key:0,src:s.avatar},null,8,wr)):(u(),m("div",br,v(((W=s.name)==null?void 0:W.charAt(0))||"？"),1))]),l("div",Cr,[l("h4",null,v(s.name),1),l("div",$r,[t(f,{type:zl(s.role),size:"small"},{default:n(()=>[r(v(Al(s.role)),1)]),_:2},1032,["type"]),s.gender?(u(),G(f,{key:0,type:"info",size:"small"},{default:n(()=>[r(v(cn(s.gender)),1)]),_:2},1024)):I("",!0),s.age?(u(),m("span",kr,v(s.age)+"岁",1)):I("",!0)]),s.personality?(u(),G(b,{key:0,content:s.personality,placement:"right",disabled:s.personality.length<=60,effect:"light","show-after":300},{default:n(()=>[l("p",xr,v(s.personality.length>60?s.personality.substring(0,60)+"...":s.personality),1)]),_:2},1032,["content","disabled"])):I("",!0),s.tags&&s.tags.length?(u(),m("div",Vr,[(u(!0),m(ie,null,re(s.tags,Y=>(u(),G(f,{key:Y,size:"small"},{default:n(()=>[r(v(Y),1)]),_:2},1024))),128))])):I("",!0)])],8,hr),l("div",Sr,[t(D,{onCommand:Y=>rs(Y,s),trigger:"click"},{dropdown:n(()=>[t(S,null,{default:n(()=>[t(c,{command:"edit"},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Bl))]),_:1}),e[125]||(e[125]=r(" 编辑 ",-1))]),_:1}),t(c,{command:"delete",divided:""},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Nl))]),_:1}),e[126]||(e[126]=r(" 删除 ",-1))]),_:1})]),_:1})]),default:n(()=>[t(o,{size:"small",type:"text",onClick:e[1]||(e[1]=Gl(()=>{},["stop"]))},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Cl))]),_:1})]),_:1})]),_:1},8,["onCommand"])])])}),128)),Je.value.length===0?(u(),m("div",Ir,[e[128]||(e[128]=l("p",null,"暂无人物设定",-1)),t(o,{size:"small",onClick:El},{default:n(()=>[...e[127]||(e[127]=[r("创建第一个角色",-1)])]),_:1})])):I("",!0)])]),_:1})],512),[[Bt,ve.value==="characters"]]),Ct(l("div",Tr,[t(T,{shadow:"never"},{header:n(()=>[l("div",zr,[e[131]||(e[131]=l("span",null,"🌍 世界观设定",-1)),l("div",Ar,[t(o,{size:"small",type:"primary",onClick:Ul},{default:n(()=>[t(i,null,{default:n(()=>[t(N(ol))]),_:1}),e[129]||(e[129]=r(" 新增 ",-1))]),_:1}),t(o,{size:"small",type:"success",onClick:ga},{default:n(()=>[...e[130]||(e[130]=[r(" 🤖 AI生成 ",-1)])]),_:1})])])]),default:n(()=>[l("div",Pr,[(u(!0),m(ie,null,re(Pt.value,s=>(u(),m("div",{key:s.id,class:"worldview-item"},[l("div",{class:"worldview-content",onClick:W=>bn(s)},[l("div",Mr,[l("h4",null,v(s.title),1),t(f,{type:na(s.category)},{default:n(()=>[r(v(aa(s.category)),1)]),_:2},1032,["type"])]),s.description?(u(),G(b,{key:0,content:s.description,placement:"right",disabled:s.description.length<=80,effect:"light","show-after":300},{default:n(()=>[l("p",Er,v(s.description.length>80?s.description.substring(0,80)+"...":s.description),1)]),_:2},1032,["content","disabled"])):(u(),m("p",Ur,"暂无描述")),l("div",Fr,[l("span",Rr,v(ps(s.createdAt)),1),s.generated?(u(),m("span",Wr,"AI生成")):I("",!0)])],8,Dr),l("div",Or,[t(D,{onCommand:W=>cs(W,s),trigger:"click"},{dropdown:n(()=>[t(S,null,{default:n(()=>[t(c,{command:"edit"},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Bl))]),_:1}),e[132]||(e[132]=r(" 编辑 ",-1))]),_:1}),t(c,{command:"duplicate"},{default:n(()=>[t(i,null,{default:n(()=>[t(N(jl))]),_:1}),e[133]||(e[133]=r(" 复制 ",-1))]),_:1}),t(c,{command:"delete",divided:""},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Nl))]),_:1}),e[134]||(e[134]=r(" 删除 ",-1))]),_:1})]),_:1})]),default:n(()=>[t(o,{size:"small",type:"text",onClick:e[2]||(e[2]=Gl(()=>{},["stop"]))},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Cl))]),_:1})]),_:1})]),_:1},8,["onCommand"])])]))),128)),Pt.value.length===0?(u(),m("div",Br,[e[136]||(e[136]=l("p",null,"暂无世界观设定",-1)),t(o,{size:"small",onClick:Ul},{default:n(()=>[...e[135]||(e[135]=[r("创建第一个设定",-1)])]),_:1})])):I("",!0)])]),_:1})],512),[[Bt,ve.value==="worldview"]]),Ct(l("div",Nr,[t(T,{shadow:"never"},{header:n(()=>[l("div",jr,[e[138]||(e[138]=l("span",null,"📚 语料库",-1)),t(o,{size:"small",type:"primary",onClick:Fl},{default:n(()=>[t(i,null,{default:n(()=>[t(N(ol))]),_:1}),e[137]||(e[137]=r(" 新增 ",-1))]),_:1})])]),default:n(()=>[l("div",qr,[(u(!0),m(ie,null,re(tt.value,s=>(u(),m("div",{key:s.id,class:"corpus-item"},[l("div",Gr,[l("div",Lr,[l("h4",null,v(s.title),1),t(f,{type:sa(s.type)},{default:n(()=>[r(v(oa(s.type)),1)]),_:2},1032,["type"])]),t(b,{content:s.content,placement:"right",disabled:s.content.length<=100,effect:"light","show-after":300},{default:n(()=>[l("p",Hr,v(s.content.length>100?s.content.substring(0,100)+"...":s.content),1)]),_:2},1032,["content","disabled"])]),l("div",Jr,[t(o,{size:"small",onClick:W=>ms(s)},{default:n(()=>[...e[139]||(e[139]=[r("编辑",-1)])]),_:1},8,["onClick"]),t(o,{size:"small",type:"danger",onClick:W=>fs(s)},{default:n(()=>[...e[140]||(e[140]=[r("删除",-1)])]),_:1},8,["onClick"])])]))),128)),tt.value.length===0?(u(),m("div",Kr,[e[142]||(e[142]=l("p",null,"暂无语料数据",-1)),t(o,{size:"small",onClick:Fl},{default:n(()=>[...e[141]||(e[141]=[r("添加第一个语料",-1)])]),_:1})])):I("",!0)])]),_:1})],512),[[Bt,ve.value==="corpus"]]),Ct(l("div",Xr,[t(T,{shadow:"never"},{header:n(()=>[l("div",Yr,[e[144]||(e[144]=l("span",null,"📊 事件时间线",-1)),t(o,{size:"small",type:"primary",onClick:Rl},{default:n(()=>[t(i,null,{default:n(()=>[t(N(ol))]),_:1}),e[143]||(e[143]=r(" 新增 ",-1))]),_:1})])]),default:n(()=>[l("div",Zr,[(u(!0),m(ie,null,re(Ze.value,s=>(u(),m("div",{key:s.id,class:"event-item"},[e[147]||(e[147]=l("div",{class:"event-marker"},null,-1)),l("div",Qr,[l("div",eu,[l("h4",null,v(s.title),1),l("div",tu,[t(D,{onCommand:W=>_s(W,s),trigger:"click"},{dropdown:n(()=>[t(S,null,{default:n(()=>[t(c,{command:"edit"},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Bl))]),_:1}),e[145]||(e[145]=r(" 编辑 ",-1))]),_:1}),t(c,{command:"delete",divided:""},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Nl))]),_:1}),e[146]||(e[146]=r(" 删除 ",-1))]),_:1})]),_:1})]),default:n(()=>[t(o,{size:"small",type:"text",onClick:e[3]||(e[3]=Gl(()=>{},["stop"]))},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Cl))]),_:1})]),_:1})]),_:1},8,["onCommand"])])]),t(b,{content:s.description,placement:"right",disabled:s.description.length<=80,effect:"light","show-after":300},{default:n(()=>[l("p",lu,v(s.description.length>80?s.description.substring(0,80)+"...":s.description),1)]),_:2},1032,["content","disabled"]),l("div",nu,[t(f,{size:"small"},{default:n(()=>[r(v(s.chapter),1)]),_:2},1024),l("span",au,v(s.time),1)])])]))),128)),Ze.value.length===0?(u(),m("div",su,[e[149]||(e[149]=l("p",null,"暂无事件记录",-1)),t(o,{size:"small",onClick:Rl},{default:n(()=>[...e[148]||(e[148]=[r("添加第一个事件",-1)])]),_:1})])):I("",!0)])]),_:1})],512),[[Bt,ve.value==="events"]])]),l("div",ou,[E.value?(u(),G(T,{key:0,shadow:"never"},{header:n(()=>[l("div",iu,[l("div",ru,[l("h3",uu,"✍️ "+v(E.value.title),1),l("div",du,[l("span",cu,v(cl.value)+"字",1),E.value.status?(u(),G(ae,{key:0,modelValue:E.value.status,"onUpdate:modelValue":e[4]||(e[4]=s=>E.value.status=s),size:"small",style:{width:"80px"},onChange:ws,"popper-class":"chapter-status-dropdown"},{default:n(()=>[t(V,{label:"草稿",value:"draft"}),t(V,{label:"完成",value:"completed"}),t(V,{label:"发表",value:"published"})]),_:1},8,["modelValue"])):I("",!0),ye.value?(u(),m("span",vu,"● 保存中...")):I("",!0)])]),l("div",pu,[t(ge,null,{default:n(()=>[t(o,{size:"small",onClick:Ua,disabled:!E.value.description},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Yt))]),_:1}),e[150]||(e[150]=r(" 根据大纲生成 ",-1))]),_:1},8,["disabled"]),t(o,{size:"small",onClick:Wa},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Ot))]),_:1}),e[151]||(e[151]=r(" 续写 ",-1))]),_:1}),t(o,{size:"small",onClick:Fa},{default:n(()=>[t(i,null,{default:n(()=>[t(N(ql))]),_:1}),e[152]||(e[152]=r(" 优化 ",-1))]),_:1})]),_:1})])])]),default:n(()=>[l("div",mu,[l("div",fu,[t(N(Jo),{editor:ue.value,defaultConfig:Fn,mode:"default",style:{"border-bottom":"1px solid #e4e7ed"}},null,8,["editor"]),t(N(Ko),{modelValue:Z.value,"onUpdate:modelValue":e[5]||(e[5]=s=>Z.value=s),defaultConfig:Rn,mode:"default",onOnCreated:qn,onOnChange:$s,style:{"overflow-y":"hidden"}},null,8,["modelValue"])])])]),_:1})):(u(),G(T,{key:1,shadow:"never"},{default:n(()=>[l("div",gu,[t(i,{class:"empty-icon"},{default:n(()=>[t(N(wo))]),_:1}),e[154]||(e[154]=l("p",null,"请选择或创建一个章节开始编辑",-1)),t(o,{type:"primary",onClick:Sl},{default:n(()=>[...e[153]||(e[153]=[r("创建第一章",-1)])]),_:1})])]),_:1}))])]),t(lt,{modelValue:Ve.value,"onUpdate:modelValue":e[10]||(e[10]=s=>Ve.value=s),title:Ce.value?"编辑章节":"新增章节",width:"600px"},{footer:n(()=>[t(o,{onClick:e[9]||(e[9]=s=>Ve.value=!1)},{default:n(()=>[...e[156]||(e[156]=[r("取消",-1)])]),_:1}),t(o,{type:"primary",onClick:Nn},{default:n(()=>[...e[157]||(e[157]=[r("确定",-1)])]),_:1})]),default:n(()=>[t(gt,{model:Be.value,"label-width":"80px"},{default:n(()=>[t(R,{label:"章节标题"},{default:n(()=>[t(A,{modelValue:Be.value.title,"onUpdate:modelValue":e[6]||(e[6]=s=>Be.value.title=s),placeholder:"请输入章节标题"},null,8,["modelValue"])]),_:1}),t(R,{label:"章节简介"},{default:n(()=>[l("div",yu,[t(A,{modelValue:Be.value.description,"onUpdate:modelValue":e[7]||(e[7]=s=>Be.value.description=s),type:"textarea",rows:4,placeholder:"简要描述本章节内容..."},null,8,["modelValue"]),t(o,{size:"small",type:"primary",onClick:Ea,loading:nt.value,style:{"margin-top":"8px"}},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Yt))]),_:1}),e[155]||(e[155]=r(" AI生成大纲 ",-1))]),_:1},8,["loading"])])]),_:1}),t(R,{label:"章节状态"},{default:n(()=>[t(ae,{modelValue:Be.value.status,"onUpdate:modelValue":e[8]||(e[8]=s=>Be.value.status=s)},{default:n(()=>[t(V,{label:"草稿",value:"draft"}),t(V,{label:"完成",value:"completed"}),t(V,{label:"发表",value:"published"})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue","title"]),t(lt,{modelValue:qt.value,"onUpdate:modelValue":e[21]||(e[21]=s=>qt.value=s),title:"编辑角色",width:"700px"},{footer:n(()=>[t(o,{onClick:e[20]||(e[20]=s=>qt.value=!1)},{default:n(()=>[...e[164]||(e[164]=[r("取消",-1)])]),_:1}),t(o,{type:"primary",onClick:ss},{default:n(()=>[...e[165]||(e[165]=[r("保存",-1)])]),_:1})]),default:n(()=>[t(gt,{model:M.value,"label-width":"80px"},{default:n(()=>[t(Dt,{gutter:20},{default:n(()=>[t(Ke,{span:12},{default:n(()=>[t(R,{label:"姓名"},{default:n(()=>[t(A,{modelValue:M.value.name,"onUpdate:modelValue":e[11]||(e[11]=s=>M.value.name=s)},null,8,["modelValue"])]),_:1}),t(R,{label:"角色"},{default:n(()=>[t(ae,{modelValue:M.value.role,"onUpdate:modelValue":e[12]||(e[12]=s=>M.value.role=s)},{default:n(()=>[t(V,{label:"主角",value:"protagonist"}),t(V,{label:"配角",value:"supporting"}),t(V,{label:"反派",value:"antagonist"}),t(V,{label:"路人",value:"minor"})]),_:1},8,["modelValue"])]),_:1}),t(R,{label:"性别"},{default:n(()=>[t(Ol,{modelValue:M.value.gender,"onUpdate:modelValue":e[13]||(e[13]=s=>M.value.gender=s)},{default:n(()=>[t(ct,{label:"male"},{default:n(()=>[...e[158]||(e[158]=[r("男",-1)])]),_:1}),t(ct,{label:"female"},{default:n(()=>[...e[159]||(e[159]=[r("女",-1)])]),_:1}),t(ct,{label:"other"},{default:n(()=>[...e[160]||(e[160]=[r("其他",-1)])]),_:1})]),_:1},8,["modelValue"])]),_:1}),t(R,{label:"年龄"},{default:n(()=>[t(sl,{modelValue:M.value.age,"onUpdate:modelValue":e[14]||(e[14]=s=>M.value.age=s),min:0,max:1e3},null,8,["modelValue"])]),_:1})]),_:1}),t(Ke,{span:12},{default:n(()=>[t(R,{label:"外貌"},{default:n(()=>[t(A,{modelValue:M.value.appearance,"onUpdate:modelValue":e[15]||(e[15]=s=>M.value.appearance=s),type:"textarea",rows:3},null,8,["modelValue"])]),_:1}),t(R,{label:"性格"},{default:n(()=>[t(A,{modelValue:M.value.personality,"onUpdate:modelValue":e[16]||(e[16]=s=>M.value.personality=s),type:"textarea",rows:3},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),t(R,{label:"背景故事"},{default:n(()=>[l("div",hu,[t(A,{modelValue:M.value.background,"onUpdate:modelValue":e[17]||(e[17]=s=>M.value.background=s),type:"textarea",rows:4},null,8,["modelValue"]),l("div",_u,[t(o,{size:"small",type:"primary",onClick:os,style:{flex:"1"}},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Yt))]),_:1}),e[161]||(e[161]=r(" AI生成角色信息 ",-1))]),_:1}),t(o,{size:"small",onClick:e[18]||(e[18]=s=>Xn("character")),style:{"margin-left":"8px"}},{default:n(()=>[...e[162]||(e[162]=[r(" 📝 提示词 ",-1)])]),_:1})])])]),_:1}),t(R,{label:"标签"},{default:n(()=>[t(A,{modelValue:dl.value,"onUpdate:modelValue":e[19]||(e[19]=s=>dl.value=s),placeholder:"输入标签后按回车",onKeyup:jo(wn,["enter"])},{append:n(()=>[t(o,{onClick:wn},{default:n(()=>[...e[163]||(e[163]=[r("添加",-1)])]),_:1})]),_:1},8,["modelValue"]),M.value.tags.length>0?(u(),m("div",wu,[(u(!0),m(ie,null,re(M.value.tags,(s,W)=>(u(),G(f,{key:W,closable:"",onClose:Y=>is(W),style:{"margin-right":"8px"}},{default:n(()=>[r(v(s),1)]),_:2},1032,["onClose"]))),128))])):I("",!0)]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),t(lt,{modelValue:Gt.value,"onUpdate:modelValue":e[26]||(e[26]=s=>Gt.value=s),title:"编辑世界观设定",width:"600px"},{footer:n(()=>[t(o,{onClick:e[25]||(e[25]=s=>Gt.value=!1)},{default:n(()=>[...e[168]||(e[168]=[r("取消",-1)])]),_:1}),t(o,{type:"primary",onClick:bs},{default:n(()=>[...e[169]||(e[169]=[r("保存",-1)])]),_:1})]),default:n(()=>[t(gt,{model:De.value,"label-width":"80px"},{default:n(()=>[t(R,{label:"设定标题"},{default:n(()=>[t(A,{modelValue:De.value.title,"onUpdate:modelValue":e[22]||(e[22]=s=>De.value.title=s)},null,8,["modelValue"])]),_:1}),t(R,{label:"类别"},{default:n(()=>[t(ae,{modelValue:De.value.category,"onUpdate:modelValue":e[23]||(e[23]=s=>De.value.category=s)},{default:n(()=>[t(V,{label:"世界设定",value:"setting"}),t(V,{label:"魔法体系",value:"magic"}),t(V,{label:"政治势力",value:"politics"}),t(V,{label:"地理环境",value:"geography"}),t(V,{label:"历史背景",value:"history"})]),_:1},8,["modelValue"])]),_:1}),t(R,{label:"详细描述"},{default:n(()=>[l("div",bu,[t(A,{modelValue:De.value.description,"onUpdate:modelValue":e[24]||(e[24]=s=>De.value.description=s),type:"textarea",rows:6},null,8,["modelValue"]),t(o,{size:"small",type:"primary",onClick:_a,loading:Qt.value,style:{"margin-top":"8px"}},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Yt))]),_:1}),e[166]||(e[166]=r(" AI生成描述 ",-1))]),_:1},8,["loading"])])]),_:1})]),_:1},8,["model"]),X.value&&me.value==="worldSetting"?(u(),m("div",Cu,[e[167]||(e[167]=l("div",{class:"streaming-header"},[l("span",{class:"streaming-title"},"🤖 AI正在生成世界观设定...")],-1)),l("div",{class:"streaming-content-display",innerHTML:Pl(O.value)},null,8,$u)])):I("",!0)]),_:1},8,["modelValue"]),t(lt,{modelValue:Lt.value,"onUpdate:modelValue":e[31]||(e[31]=s=>Lt.value=s),title:"编辑语料",width:"700px"},{footer:n(()=>[t(o,{onClick:e[30]||(e[30]=s=>Lt.value=!1)},{default:n(()=>[...e[170]||(e[170]=[r("取消",-1)])]),_:1}),t(o,{type:"primary",onClick:Cs},{default:n(()=>[...e[171]||(e[171]=[r("保存",-1)])]),_:1})]),default:n(()=>[t(gt,{model:st.value,"label-width":"80px"},{default:n(()=>[t(R,{label:"标题"},{default:n(()=>[t(A,{modelValue:st.value.title,"onUpdate:modelValue":e[27]||(e[27]=s=>st.value.title=s)},null,8,["modelValue"])]),_:1}),t(R,{label:"类型"},{default:n(()=>[t(ae,{modelValue:st.value.type,"onUpdate:modelValue":e[28]||(e[28]=s=>st.value.type=s)},{default:n(()=>[t(V,{label:"场景描述",value:"description"}),t(V,{label:"对话模板",value:"dialogue"}),t(V,{label:"情感表达",value:"emotion"}),t(V,{label:"动作描写",value:"action"}),t(V,{label:"心理描写",value:"psychology"})]),_:1},8,["modelValue"])]),_:1}),t(R,{label:"内容"},{default:n(()=>[t(A,{modelValue:st.value.content,"onUpdate:modelValue":e[29]||(e[29]=s=>st.value.content=s),type:"textarea",rows:8},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),t(lt,{modelValue:Ht.value,"onUpdate:modelValue":e[38]||(e[38]=s=>Ht.value=s),title:"编辑事件",width:"600px"},{footer:n(()=>[t(o,{onClick:e[37]||(e[37]=s=>Ht.value=!1)},{default:n(()=>[...e[176]||(e[176]=[r("取消",-1)])]),_:1}),t(o,{type:"primary",onClick:ys},{default:n(()=>[...e[177]||(e[177]=[r("保存",-1)])]),_:1})]),default:n(()=>[t(gt,{model:Ne.value,"label-width":"80px"},{default:n(()=>[t(R,{label:"事件标题"},{default:n(()=>[t(A,{modelValue:Ne.value.title,"onUpdate:modelValue":e[32]||(e[32]=s=>Ne.value.title=s)},null,8,["modelValue"])]),_:1}),t(R,{label:"相关章节"},{default:n(()=>[t(ae,{modelValue:Ne.value.chapter,"onUpdate:modelValue":e[33]||(e[33]=s=>Ne.value.chapter=s),placeholder:"选择章节"},{default:n(()=>[(u(!0),m(ie,null,re(z.value,s=>(u(),G(V,{key:s.id,label:s.title,value:s.title},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),t(R,{label:"时间线"},{default:n(()=>[t(A,{modelValue:Ne.value.time,"onUpdate:modelValue":e[34]||(e[34]=s=>Ne.value.time=s),placeholder:"如：第三天傍晚"},null,8,["modelValue"])]),_:1}),t(R,{label:"重要程度"},{default:n(()=>[t(Ol,{modelValue:Ne.value.importance,"onUpdate:modelValue":e[35]||(e[35]=s=>Ne.value.importance=s)},{default:n(()=>[t(ct,{label:"low"},{default:n(()=>[...e[172]||(e[172]=[r("次要",-1)])]),_:1}),t(ct,{label:"normal"},{default:n(()=>[...e[173]||(e[173]=[r("一般",-1)])]),_:1}),t(ct,{label:"high"},{default:n(()=>[...e[174]||(e[174]=[r("重要",-1)])]),_:1}),t(ct,{label:"critical"},{default:n(()=>[...e[175]||(e[175]=[r("关键",-1)])]),_:1})]),_:1},8,["modelValue"])]),_:1}),t(R,{label:"事件描述"},{default:n(()=>[t(A,{modelValue:Ne.value.description,"onUpdate:modelValue":e[36]||(e[36]=s=>Ne.value.description=s),type:"textarea",rows:4},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),t(lt,{modelValue:Qe.value,"onUpdate:modelValue":e[50]||(e[50]=s=>Qe.value=s),title:"AI生成章节内容",width:"1200px",onClose:e[51]||(e[51]=s=>Qe.value=!1)},{footer:n(()=>[l("div",tc,[l("div",lc,[t(o,{onClick:e[49]||(e[49]=s=>Qe.value=!1)},{default:n(()=>[...e[208]||(e[208]=[r("取消",-1)])]),_:1}),t(o,{type:"primary",onClick:$n,loading:xe.value,disabled:!ee.value},{default:n(()=>[t(i,null,{default:n(()=>[t(N(xl))]),_:1}),r(" "+v(xe.value?"生成中...":"开始生成"),1)]),_:1},8,["loading","disabled"])])])]),default:n(()=>[l("div",ku,[l("div",xu,[t(T,{shadow:"hover",class:"config-card-modern"},{header:n(()=>[l("div",Vu,[l("div",Su,[e[178]||(e[178]=l("span",{class:"config-title"},"⚙️ 生成配置",-1)),t(f,{type:"info",size:"small"},{default:n(()=>{var s;return[r(v(((s=E.value)==null?void 0:s.title)||"未选择章节"),1)]}),_:1})]),t(o,{type:"primary",onClick:$n,loading:xe.value,disabled:!ee.value,size:"small"},{default:n(()=>[t(i,null,{default:n(()=>[t(N(xl))]),_:1}),r(" "+v(xe.value?"生成中":"生成"),1)]),_:1},8,["loading","disabled"])])]),default:n(()=>[t(Dt,{gutter:16},{default:n(()=>[t(Ke,{span:8},{default:n(()=>[t(R,{label:"目标字数",class:"config-item"},{default:n(()=>[t(sl,{modelValue:B.value.wordCount,"onUpdate:modelValue":e[39]||(e[39]=s=>B.value.wordCount=s),min:500,max:5e3,size:"small","controls-position":"right"},null,8,["modelValue"])]),_:1})]),_:1}),t(Ke,{span:8},{default:n(()=>[t(R,{label:"写作视角",class:"config-item"},{default:n(()=>[t(ae,{modelValue:B.value.style,"onUpdate:modelValue":e[40]||(e[40]=s=>B.value.style=s),size:"small",style:{width:"100%"}},{default:n(()=>[t(V,{label:"第一人称",value:"first-person"}),t(V,{label:"第三人称",value:"third-person"}),t(V,{label:"全知视角",value:"omniscient"})]),_:1},8,["modelValue"])]),_:1})]),_:1}),t(Ke,{span:8},{default:n(()=>[t(R,{label:"重点内容",class:"config-item"},{default:n(()=>[t(A,{modelValue:B.value.focus,"onUpdate:modelValue":e[41]||(e[41]=s=>B.value.focus=s),placeholder:"本章重点内容...",size:"small"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})]),t(Dt,{gutter:20,style:{"margin-top":"16px"}},{default:n(()=>[t(Ke,{span:14},{default:n(()=>[l("div",Iu,[l("div",Tu,[e[180]||(e[180]=l("h4",{class:"section-title"},"📚 创作素材",-1)),t(o,{size:"small",onClick:As},{default:n(()=>[...e[179]||(e[179]=[r("清空选择",-1)])]),_:1})]),t(p,{modelValue:Re.value,"onUpdate:modelValue":e[46]||(e[46]=s=>Re.value=s),class:"materials-tabs"},{default:n(()=>[t(d,{label:"👥 人物角色",name:"characters"},{default:n(()=>[l("div",zu,[l("span",Au,"已选择 "+v(L.value.characters.length)+"/"+v(Je.value.length),1),Je.value.length>0?(u(),G(o,{key:0,size:"small",onClick:e[42]||(e[42]=s=>bl("characters"))},{default:n(()=>[...e[181]||(e[181]=[r("全选",-1)])]),_:1})):I("",!0)]),l("div",Pu,[(u(!0),m(ie,null,re(Je.value,s=>{var W,Y;return u(),m("div",{key:s.id,class:_e(["material-card",{selected:L.value.characters.some(je=>je.id===s.id)}]),onClick:je=>ml("characters",s)},[l("div",Mu,[l("span",Eu,v(s.name),1),t(f,{type:zl(s.role),size:"small"},{default:n(()=>[r(v(Al(s.role)),1)]),_:2},1032,["type"])]),l("p",Uu,v(((W=s.personality)==null?void 0:W.substring(0,40))||"暂无描述")+"...",1),l("div",Fu,[(u(!0),m(ie,null,re((Y=s.tags)==null?void 0:Y.slice(0,2),je=>(u(),G(f,{key:je,size:"small"},{default:n(()=>[r(v(je),1)]),_:2},1024))),128))])],10,Du)}),128))]),Je.value.length===0?(u(),m("div",Ru,[e[183]||(e[183]=l("p",null,"暂无人物角色",-1)),t(o,{size:"small",onClick:El},{default:n(()=>[...e[182]||(e[182]=[r("创建角色",-1)])]),_:1})])):I("",!0)]),_:1}),t(d,{label:"🌍 世界观",name:"worldSettings"},{default:n(()=>[l("div",Wu,[l("span",Ou,"已选择 "+v(L.value.worldSettings.length)+"/"+v(Pt.value.length),1),Pt.value.length>0?(u(),G(o,{key:0,size:"small",onClick:e[43]||(e[43]=s=>bl("worldSettings"))},{default:n(()=>[...e[184]||(e[184]=[r("全选",-1)])]),_:1})):I("",!0)]),l("div",Bu,[(u(!0),m(ie,null,re(Pt.value,s=>{var W;return u(),m("div",{key:s.id,class:_e(["material-card",{selected:L.value.worldSettings.some(Y=>Y.id===s.id)}]),onClick:Y=>ml("worldSettings",s)},[l("div",ju,[l("span",qu,v(s.title),1),s.category?(u(),G(f,{key:0,size:"small"},{default:n(()=>[r(v(s.category),1)]),_:2},1024)):I("",!0)]),l("p",Gu,v(((W=s.description)==null?void 0:W.substring(0,50))||"暂无描述")+"...",1)],10,Nu)}),128))]),Pt.value.length===0?(u(),m("div",Lu,[e[186]||(e[186]=l("p",null,"暂无世界观设定",-1)),t(o,{size:"small",onClick:Ul},{default:n(()=>[...e[185]||(e[185]=[r("创建设定",-1)])]),_:1})])):I("",!0)]),_:1}),t(d,{label:"📝 语料库",name:"corpus"},{default:n(()=>[l("div",Hu,[l("span",Ju,"已选择 "+v(L.value.corpus.length)+"/"+v(tt.value.length),1),tt.value.length>0?(u(),G(o,{key:0,size:"small",onClick:e[44]||(e[44]=s=>bl("corpus"))},{default:n(()=>[...e[187]||(e[187]=[r("全选",-1)])]),_:1})):I("",!0)]),l("div",Ku,[(u(!0),m(ie,null,re(tt.value,s=>{var W;return u(),m("div",{key:s.id,class:_e(["material-card",{selected:L.value.corpus.some(Y=>Y.id===s.id)}]),onClick:Y=>ml("corpus",s)},[l("div",Yu,[l("span",Zu,v(s.title),1)]),l("p",Qu,v(((W=s.content)==null?void 0:W.substring(0,40))||"暂无内容")+"...",1)],10,Xu)}),128))]),tt.value.length===0?(u(),m("div",ed,[e[189]||(e[189]=l("p",null,"暂无语料库",-1)),t(o,{size:"small",onClick:Fl},{default:n(()=>[...e[188]||(e[188]=[r("创建语料",-1)])]),_:1})])):I("",!0)]),_:1}),t(d,{label:"📅 事件线",name:"events"},{default:n(()=>[l("div",td,[l("span",ld,"已选择 "+v(L.value.events.length)+"/"+v(Ze.value.length),1),Ze.value.length>0?(u(),G(o,{key:0,size:"small",onClick:e[45]||(e[45]=s=>bl("events"))},{default:n(()=>[...e[190]||(e[190]=[r("全选",-1)])]),_:1})):I("",!0)]),l("div",nd,[(u(!0),m(ie,null,re(Ze.value,s=>{var W;return u(),m("div",{key:s.id,class:_e(["material-card",{selected:L.value.events.some(Y=>Y.id===s.id)}]),onClick:Y=>ml("events",s)},[l("div",sd,[l("span",od,v(s.title),1),t(f,{type:ia(s.importance),size:"small"},{default:n(()=>[r("第"+v(s.chapter)+"章",1)]),_:2},1032,["type"])]),l("p",id,v(((W=s.description)==null?void 0:W.substring(0,40))||"暂无描述")+"...",1),l("div",rd,[l("span",ud,v(s.time||"时间未定"),1)])],10,ad)}),128))]),Ze.value.length===0?(u(),m("div",dd,[e[192]||(e[192]=l("p",null,"暂无事件线",-1)),t(o,{size:"small",onClick:Rl},{default:n(()=>[...e[191]||(e[191]=[r("创建事件",-1)])]),_:1})])):I("",!0)]),_:1}),t(d,{label:"📖 上下文内容",name:"chapters"},{default:n(()=>[l("div",cd,[l("span",vd,"已选择 "+v(J.value.length)+"/"+v(Et.value.length),1),l("div",pd,[Et.value.length>0?(u(),G(o,{key:0,size:"small",onClick:ca},{default:n(()=>[...e[193]||(e[193]=[r("全选",-1)])]),_:1})):I("",!0)])]),l("div",md,[(u(!0),m(ie,null,re(Et.value,s=>(u(),m("div",{key:s.id,class:_e(["chapter-material-card",{selected:J.value.includes(s.id)}]),onClick:W=>da(s.id)},[l("div",gd,[l("span",yd,"第"+v(s.chapterIndex)+"章 "+v(s.title),1),l("div",hd,[t(f,{type:Il(s.status),size:"small"},{default:n(()=>[r(v(pl(s.status)),1)]),_:2},1032,["type"]),t(f,{size:"small",type:"info"},{default:n(()=>[r(v(s.wordCount)+"字",1)]),_:2},1024)])]),l("p",_d,v(s.description||"暂无大纲"),1),s.content?(u(),m("div",wd,[l("span",bd,v(gl(s.content,80))+"...",1)])):I("",!0)],10,fd))),128))]),Et.value.length===0?(u(),m("div",Cd,[e[195]||(e[195]=l("p",null,"暂无可选择的章节",-1)),t(o,{size:"small",onClick:a.addChapter},{default:n(()=>[...e[194]||(e[194]=[r("创建章节",-1)])]),_:1},8,["onClick"])])):I("",!0)]),_:1})]),_:1},8,["modelValue"])])]),_:1}),t(Ke,{span:10},{default:n(()=>[l("div",$d,[l("div",kd,[e[197]||(e[197]=l("h4",{class:"section-title"},"📝 提示词模板",-1)),t(o,{size:"small",onClick:Ps},{default:n(()=>[...e[196]||(e[196]=[r("使用默认",-1)])]),_:1})]),l("div",xd,[e[198]||(e[198]=l("div",{class:"category-header"},[l("span",null,"🏷️ 正文类型")],-1)),l("div",Vd,[(u(!0),m(ie,null,re(Ie.value,s=>(u(),m("div",{key:s.key,class:_e(["category-card",{active:$.value===s.key}]),onClick:W=>$.value=s.key},[l("span",Id,v(s.icon),1),l("span",Td,v(s.name),1)],10,Sd))),128))])]),l("div",zd,[l("div",Ad,[l("span",null,"可用模板 ("+v(el($.value).length)+")",1),t(o,{size:"small",onClick:Ds},{default:n(()=>[...e[199]||(e[199]=[r("刷新",-1)])]),_:1})]),l("div",Pd,[(u(!0),m(ie,null,re(el($.value),s=>{var W,Y,je;return u(),m("div",{key:s.id,class:_e(["prompt-item-modern",{active:((W=ee.value)==null?void 0:W.id)===s.id}]),onClick:Ft=>la(s)},[l("div",Md,[l("h5",Ed,v(s.title),1),l("p",Ud,v(s.description),1),l("div",Fd,[l("div",Rd,[(u(!0),m(ie,null,re((Y=s.tags)==null?void 0:Y.slice(0,2),Ft=>(u(),G(f,{key:Ft,size:"small"},{default:n(()=>[r(v(Ft),1)]),_:2},1024))),128))])])]),l("div",Wd,[((je=ee.value)==null?void 0:je.id)===s.id?(u(),G(i,{key:0,class:"selected-icon"},{default:n(()=>[t(N(It))]),_:1})):I("",!0)])],10,Dd)}),128))]),el($.value).length===0?(u(),m("div",Od,[e[201]||(e[201]=l("p",null,"暂无该类型的提示词模板",-1)),t(o,{size:"small",onClick:Ms},{default:n(()=>[...e[200]||(e[200]=[r("创建模板",-1)])]),_:1})])):I("",!0)]),ee.value&&Object.keys(C.value).length>0?(u(),m("div",Bd,[l("div",Nd,[e[203]||(e[203]=l("span",null,"📋 变量配置",-1)),t(o,{size:"small",onClick:rn},{default:n(()=>[...e[202]||(e[202]=[r("智能填充",-1)])]),_:1})]),l("div",jd,[(u(!0),m(ie,null,re(C.value,(s,W)=>(u(),m("div",{key:W,class:"variable-item"},[l("label",qd,v(W),1),W==="前文概要"?(u(),m("div",Gd,[t(ae,{modelValue:J.value,"onUpdate:modelValue":e[47]||(e[47]=Y=>J.value=Y),multiple:"",placeholder:"选择章节作为前文参考",onChange:tl,size:"small",style:{width:"100%"},"max-collapse-tags":"3"},{default:n(()=>[(u(!0),m(ie,null,re(Et.value,Y=>(u(),G(V,{key:Y.id,label:`第${Y.chapterIndex}章 ${Y.title} (${Y.wordCount}字)`,value:Y.id},{default:n(()=>[l("div",Ld,[l("span",Hd,"第"+v(Y.chapterIndex)+"章 "+v(Y.title),1),l("div",Jd,[t(f,{type:Il(Y.status),size:"small"},{default:n(()=>[r(v(pl(Y.status)),1)]),_:2},1032,["type"]),l("span",Kd,v(Y.wordCount)+"字",1)])])]),_:2},1032,["label","value"]))),128))]),_:1},8,["modelValue"]),l("div",Xd,[J.value.length>0?(u(),G(o,{key:0,size:"small",onClick:ua},{default:n(()=>[...e[204]||(e[204]=[r("清空",-1)])]),_:1})):I("",!0)])])):(u(),G(A,{key:1,modelValue:C.value[W],"onUpdate:modelValue":Y=>C.value[W]=Y,type:["章节大纲","主要人物","世界观设定","参考语料"].includes(W)?"textarea":"text",rows:2,placeholder:"请输入"+W,onInput:ot,size:"small"},null,8,["modelValue","onUpdate:modelValue","type","placeholder"]))]))),128))])])):I("",!0),ee.value?(u(),m("div",Yd,[l("div",Zd,[e[207]||(e[207]=l("span",null,"👀 最终提示词",-1)),l("div",Qd,[t(o,{size:"small",onClick:Es},{default:n(()=>[...e[205]||(e[205]=[r("复制",-1)])]),_:1}),t(o,{size:"small",onClick:Us},{default:n(()=>[...e[206]||(e[206]=[r("编辑",-1)])]),_:1})])]),l("div",ec,[t(A,{modelValue:j.value,"onUpdate:modelValue":e[48]||(e[48]=s=>j.value=s),type:"textarea",rows:8,readonly:"",placeholder:"请选择提示词并填充变量",class:"preview-textarea"},null,8,["modelValue"])])])):I("",!0)])]),_:1})]),_:1})])]),_:1},8,["modelValue"]),t(lt,{modelValue:Ue.value,"onUpdate:modelValue":e[61]||(e[61]=s=>Ue.value=s),title:"AI批量生成角色",width:"900px",onClose:e[62]||(e[62]=s=>Ue.value=!1)},{footer:n(()=>[l("div",xc,[t(o,{onClick:e[60]||(e[60]=s=>Ue.value=!1)},{default:n(()=>[...e[222]||(e[222]=[r("取消",-1)])]),_:1}),!yt.value&&Le.value.length===0?(u(),G(o,{key:0,type:"primary",onClick:un,disabled:!pe.value.includeMainCharacters&&!pe.value.includeSupportingCharacters&&!pe.value.includeMinorCharacters},{default:n(()=>[...e[223]||(e[223]=[r(" 🚀 开始生成 ",-1)])]),_:1},8,["disabled"])):I("",!0),!yt.value&&Le.value.length>0?(u(),G(o,{key:1,onClick:un},{default:n(()=>[...e[224]||(e[224]=[r(" 🔄 重新生成 ",-1)])]),_:1})):I("",!0),!yt.value&&Le.value.length>0?(u(),G(o,{key:2,type:"primary",onClick:pa},{default:n(()=>[...e[225]||(e[225]=[r(" ✅ 添加选中角色 ",-1)])]),_:1})):I("",!0)])]),default:n(()=>[l("div",nc,[!yt.value&&Le.value.length===0?(u(),G(T,{key:0,shadow:"never",class:"config-section"},{header:n(()=>[...e[209]||(e[209]=[l("span",null,"⚙️ 生成配置",-1)])]),default:n(()=>[t(gt,{"label-width":"120px",size:"default"},{default:n(()=>[t(Dt,{gutter:20},{default:n(()=>[t(Ke,{span:12},{default:n(()=>[t(R,{label:"生成数量"},{default:n(()=>[t(sl,{modelValue:pe.value.count,"onUpdate:modelValue":e[52]||(e[52]=s=>pe.value.count=s),min:2,max:10},null,8,["modelValue"])]),_:1})]),_:1}),t(Ke,{span:12},{default:n(()=>[t(R,{label:"角色类型"},{default:n(()=>[l("div",ac,[t(it,{modelValue:pe.value.includeMainCharacters,"onUpdate:modelValue":e[53]||(e[53]=s=>pe.value.includeMainCharacters=s)},{default:n(()=>[...e[210]||(e[210]=[r("主角",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:pe.value.includeSupportingCharacters,"onUpdate:modelValue":e[54]||(e[54]=s=>pe.value.includeSupportingCharacters=s)},{default:n(()=>[...e[211]||(e[211]=[r("配角",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:pe.value.includeMinorCharacters,"onUpdate:modelValue":e[55]||(e[55]=s=>pe.value.includeMinorCharacters=s)},{default:n(()=>[...e[212]||(e[212]=[r("次要角色",-1)])]),_:1},8,["modelValue"])])]),_:1})]),_:1})]),_:1}),t(R,{label:"使用提示词"},{default:n(()=>[l("div",sc,[t(o,{type:"primary",plain:"",size:"small",onClick:xs},{default:n(()=>[...e[213]||(e[213]=[r(" 📝 选择提示词 ",-1)])]),_:1}),At.value?(u(),m("span",oc," 已选择："+v(At.value.title),1)):I("",!0),At.value?(u(),G(o,{key:1,link:"",size:"small",type:"danger",onClick:Vs},{default:n(()=>[...e[214]||(e[214]=[r(" 清除 ",-1)])]),_:1})):I("",!0)])]),_:1}),t(R,{label:"特殊要求"},{default:n(()=>[t(A,{modelValue:pe.value.customPrompt,"onUpdate:modelValue":e[56]||(e[56]=s=>pe.value.customPrompt=s),type:"textarea",rows:3,placeholder:"例如：需要包含反派角色、特定职业角色、具有魔法能力的角色等..."},null,8,["modelValue"])]),_:1}),t(R,{label:"智能分配"},{default:n(()=>[t(it,{modelValue:pe.value.autoAssignRoles,"onUpdate:modelValue":e[57]||(e[57]=s=>pe.value.autoAssignRoles=s)},{default:n(()=>[...e[215]||(e[215]=[r("自动平衡角色关系和重要性",-1)])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})):I("",!0),yt.value?(u(),G(T,{key:1,shadow:"never",class:"streaming-section"},{header:n(()=>[...e[216]||(e[216]=[l("span",null,"🤖 AI正在生成角色...",-1)])]),default:n(()=>[l("div",ic,[l("div",{class:"streaming-content",innerHTML:Pl(O.value)},null,8,rc)])]),_:1})):I("",!0),!yt.value&&Le.value.length>0?(u(),G(T,{key:2,shadow:"never",class:"results-section"},{header:n(()=>[l("div",uc,[l("span",null,"✨ 生成结果 ("+v(Le.value.length)+"个角色)",1),l("div",dc,[t(o,{size:"small",onClick:e[58]||(e[58]=()=>Le.value.forEach(s=>s.selected=!0))},{default:n(()=>[...e[217]||(e[217]=[r("全选",-1)])]),_:1}),t(o,{size:"small",onClick:e[59]||(e[59]=()=>Le.value.forEach(s=>s.selected=!1))},{default:n(()=>[...e[218]||(e[218]=[r("全不选",-1)])]),_:1})])])]),default:n(()=>[l("div",cc,[(u(!0),m(ie,null,re(Le.value,s=>{var W,Y;return u(),m("div",{key:s.id,class:_e(["generated-character-card",{selected:s.selected!==!1}]),onClick:je=>ma(s)},[l("div",pc,[l("div",mc,[l("div",fc,v(((W=s.name)==null?void 0:W.charAt(0))||"？"),1)]),l("div",gc,[l("h4",null,v(s.name),1),l("div",yc,[t(f,{type:zl(s.role),size:"small"},{default:n(()=>[r(v(Al(s.role)),1)]),_:2},1032,["type"]),t(f,{type:"info",size:"small"},{default:n(()=>[r(v(cn(s.gender)),1)]),_:2},1024),l("span",hc,v(s.age)+"岁",1)])]),l("div",_c,[s.selected!==!1?(u(),G(i,{key:0,class:"selected-icon"},{default:n(()=>[t(N(It))]),_:1})):I("",!0)])]),l("div",wc,[l("div",bc,[e[219]||(e[219]=l("label",null,"外貌：",-1)),l("p",null,v(s.appearance||"暂无描述"),1)]),l("div",Cc,[e[220]||(e[220]=l("label",null,"性格：",-1)),l("p",null,v(s.personality||"暂无描述"),1)]),l("div",$c,[e[221]||(e[221]=l("label",null,"背景：",-1)),l("p",null,v(s.background||"暂无描述"),1)]),(Y=s.tags)!=null&&Y.length?(u(),m("div",kc,[(u(!0),m(ie,null,re(s.tags,je=>(u(),G(f,{key:je,size:"small"},{default:n(()=>[r(v(je),1)]),_:2},1024))),128))])):I("",!0)])],10,vc)}),128))])]),_:1})):I("",!0)])]),_:1},8,["modelValue"]),t(lt,{modelValue:ht.value,"onUpdate:modelValue":e[78]||(e[78]=s=>ht.value=s),title:"AI生成世界观设定",width:"800px",onClose:e[79]||(e[79]=s=>ht.value=!1)},{footer:n(()=>[l("div",Oc,[t(o,{onClick:e[77]||(e[77]=s=>ht.value=!1)},{default:n(()=>[...e[242]||(e[242]=[r("取消",-1)])]),_:1}),!_t.value&&He.value.length===0?(u(),G(o,{key:0,type:"primary",onClick:vn,disabled:!q.value.includeGeography&&!q.value.includeCulture&&!q.value.includeHistory&&!q.value.includeMagic&&!q.value.includeTechnology&&!q.value.includePolitics&&!q.value.includeReligion&&!q.value.includeEconomy&&!q.value.includeRaces&&!q.value.includeLanguage},{default:n(()=>[...e[243]||(e[243]=[r(" 🚀 开始生成 ",-1)])]),_:1},8,["disabled"])):I("",!0),!_t.value&&He.value.length>0?(u(),G(o,{key:1,onClick:vn},{default:n(()=>[...e[244]||(e[244]=[r(" 🔄 重新生成 ",-1)])]),_:1})):I("",!0),!_t.value&&He.value.length>0?(u(),G(o,{key:2,type:"primary",onClick:ya},{default:n(()=>[...e[245]||(e[245]=[r(" ✅ 添加选中设定 ",-1)])]),_:1})):I("",!0)])]),default:n(()=>[l("div",Vc,[!_t.value&&He.value.length===0?(u(),G(T,{key:0,shadow:"never",class:"config-section"},{header:n(()=>[...e[226]||(e[226]=[l("span",null,"⚙️ 生成配置",-1)])]),default:n(()=>[t(gt,{"label-width":"120px",size:"default"},{default:n(()=>[t(R,{label:"生成数量"},{default:n(()=>[t(sl,{modelValue:q.value.count,"onUpdate:modelValue":e[63]||(e[63]=s=>q.value.count=s),min:1,max:8},null,8,["modelValue"])]),_:1}),t(R,{label:"设定类型"},{default:n(()=>[l("div",Sc,[t(it,{modelValue:q.value.includeGeography,"onUpdate:modelValue":e[64]||(e[64]=s=>q.value.includeGeography=s)},{default:n(()=>[...e[227]||(e[227]=[r("地理环境",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:q.value.includeCulture,"onUpdate:modelValue":e[65]||(e[65]=s=>q.value.includeCulture=s)},{default:n(()=>[...e[228]||(e[228]=[r("文化社会",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:q.value.includeHistory,"onUpdate:modelValue":e[66]||(e[66]=s=>q.value.includeHistory=s)},{default:n(()=>[...e[229]||(e[229]=[r("历史背景",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:q.value.includeMagic,"onUpdate:modelValue":e[67]||(e[67]=s=>q.value.includeMagic=s)},{default:n(()=>[...e[230]||(e[230]=[r("魔法体系",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:q.value.includeTechnology,"onUpdate:modelValue":e[68]||(e[68]=s=>q.value.includeTechnology=s)},{default:n(()=>[...e[231]||(e[231]=[r("科技水平",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:q.value.includePolitics,"onUpdate:modelValue":e[69]||(e[69]=s=>q.value.includePolitics=s)},{default:n(()=>[...e[232]||(e[232]=[r("政治势力",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:q.value.includeReligion,"onUpdate:modelValue":e[70]||(e[70]=s=>q.value.includeReligion=s)},{default:n(()=>[...e[233]||(e[233]=[r("宗教信仰",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:q.value.includeEconomy,"onUpdate:modelValue":e[71]||(e[71]=s=>q.value.includeEconomy=s)},{default:n(()=>[...e[234]||(e[234]=[r("经济贸易",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:q.value.includeRaces,"onUpdate:modelValue":e[72]||(e[72]=s=>q.value.includeRaces=s)},{default:n(()=>[...e[235]||(e[235]=[r("种族设定",-1)])]),_:1},8,["modelValue"]),t(it,{modelValue:q.value.includeLanguage,"onUpdate:modelValue":e[73]||(e[73]=s=>q.value.includeLanguage=s)},{default:n(()=>[...e[236]||(e[236]=[r("语言文字",-1)])]),_:1},8,["modelValue"])])]),_:1}),t(R,{label:"使用提示词"},{default:n(()=>[l("div",Ic,[t(o,{type:"primary",plain:"",size:"small",onClick:Ss},{default:n(()=>[...e[237]||(e[237]=[r(" 📝 选择提示词 ",-1)])]),_:1}),vt.value?(u(),m("span",Tc," 已选择："+v(vt.value.title),1)):I("",!0),vt.value?(u(),G(o,{key:1,link:"",size:"small",type:"danger",onClick:Is},{default:n(()=>[...e[238]||(e[238]=[r(" 清除 ",-1)])]),_:1})):I("",!0)])]),_:1}),t(R,{label:"特殊要求"},{default:n(()=>[t(A,{modelValue:q.value.customPrompt,"onUpdate:modelValue":e[74]||(e[74]=s=>q.value.customPrompt=s),type:"textarea",rows:3,placeholder:"例如：需要包含特定的种族设定、独特的政治制度、特殊的自然现象等..."},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):I("",!0),_t.value?(u(),G(T,{key:1,shadow:"never",class:"streaming-section"},{header:n(()=>[...e[239]||(e[239]=[l("span",null,"🤖 AI正在生成世界观设定...",-1)])]),default:n(()=>[l("div",zc,[l("div",{class:"streaming-content",innerHTML:Pl(O.value)},null,8,Ac)])]),_:1})):I("",!0),!_t.value&&He.value.length>0?(u(),G(T,{key:2,shadow:"never",class:"results-section"},{header:n(()=>[l("div",Pc,[l("span",null,"✨ 生成结果 ("+v(He.value.length)+"个设定)",1),l("div",Dc,[t(o,{size:"small",onClick:e[75]||(e[75]=()=>He.value.forEach(s=>s.selected=!0))},{default:n(()=>[...e[240]||(e[240]=[r("全选",-1)])]),_:1}),t(o,{size:"small",onClick:e[76]||(e[76]=()=>He.value.forEach(s=>s.selected=!1))},{default:n(()=>[...e[241]||(e[241]=[r("全不选",-1)])]),_:1})])])]),default:n(()=>[l("div",Mc,[(u(!0),m(ie,null,re(He.value,s=>(u(),m("div",{key:s.id,class:_e(["generated-setting-card",{selected:s.selected!==!1}]),onClick:W=>ha(s)},[l("div",Uc,[l("div",Fc,[l("h4",null,v(s.title),1),t(f,{type:fa(s.type),size:"small"},{default:n(()=>[r(v(s.type),1)]),_:2},1032,["type"])]),l("div",Rc,[s.selected!==!1?(u(),G(i,{key:0,class:"selected-icon"},{default:n(()=>[t(N(It))]),_:1})):I("",!0)])]),l("div",Wc,[l("p",null,v(s.description||"暂无描述"),1)])],10,Ec))),128))])]),_:1})):I("",!0)])]),_:1},8,["modelValue"]),t(lt,{modelValue:he.value,"onUpdate:modelValue":e[82]||(e[82]=s=>he.value=s),title:"选择提示词",width:"800px",onClose:Qn},{footer:n(()=>[t(o,{onClick:e[81]||(e[81]=s=>he.value=!1)},{default:n(()=>[...e[253]||(e[253]=[r("取消",-1)])]),_:1}),ee.value?(u(),G(o,{key:0,onClick:ea},{default:n(()=>[...e[254]||(e[254]=[r("复制提示词",-1)])]),_:1})):I("",!0),ee.value?(u(),G(o,{key:1,type:"primary",onClick:ta,loading:X.value&&me.value==="batch-chapters"},{default:n(()=>[r(v(X.value&&me.value==="batch-chapters"?"生成中...":"使用此提示词"),1)]),_:1},8,["loading"])):I("",!0)]),default:n(()=>[l("div",Bc,[l("div",Nc,[l("h4",null,v(Zn())+" 提示词",1),l("div",jc,[(u(!0),m(ie,null,re(el(de.value),s=>{var W;return u(),m("div",{key:s.id,class:_e(["prompt-card",{active:((W=ee.value)==null?void 0:W.id)===s.id}]),onClick:Y=>Yn(s)},[l("div",Gc,[l("h5",null,v(s.title),1)]),l("div",Lc,[l("p",null,v(s.description),1)]),l("div",Hc,[(u(!0),m(ie,null,re(s.tags,Y=>(u(),G(f,{key:Y,size:"small"},{default:n(()=>[r(v(Y),1)]),_:2},1024))),128))])],10,qc)}),128))]),el(de.value).length===0?(u(),m("div",Jc,[e[247]||(e[247]=l("p",null,"暂无该类型的提示词",-1)),t(o,{type:"primary",onClick:sn},{default:n(()=>[...e[246]||(e[246]=[r("去提示词库添加",-1)])]),_:1})])):I("",!0)]),ee.value&&Object.keys(C.value).length>0?(u(),m("div",Kc,[e[248]||(e[248]=l("h4",null,"填充变量",-1)),t(gt,{"label-width":"120px",size:"small"},{default:n(()=>[(u(!0),m(ie,null,re(C.value,(s,W)=>(u(),G(R,{key:W,label:W+"："},{default:n(()=>[t(A,{modelValue:C.value[W],"onUpdate:modelValue":Y=>C.value[W]=Y,placeholder:"请输入"+W,onInput:ot},null,8,["modelValue","onUpdate:modelValue","placeholder"])]),_:2},1032,["label"]))),128))]),_:1})])):I("",!0),ee.value?(u(),m("div",Xc,[e[249]||(e[249]=l("h4",null,"最终提示词预览",-1)),t(A,{modelValue:j.value,"onUpdate:modelValue":e[80]||(e[80]=s=>j.value=s),type:"textarea",rows:8,readonly:"",placeholder:"请先选择提示词并填充变量"},null,8,["modelValue"])])):I("",!0)]),X.value&&me.value==="batch-chapters"&&et.value?(u(),m("div",Yc,[t(T,{shadow:"never",class:"streaming-card"},{header:n(()=>[l("div",Zc,[e[252]||(e[252]=l("span",null,"🔄 AI正在批量生成章节大纲...",-1)),t(f,{type:"success",size:"small"},{default:n(()=>[...e[250]||(e[250]=[r("实时生成中...",-1)])]),_:1}),t(o,{size:"small",onClick:Jn},{default:n(()=>[...e[251]||(e[251]=[r("停止生成",-1)])]),_:1})])]),default:n(()=>[l("div",Qc,[l("pre",ev,v(O.value),1)])]),_:1})])):I("",!0)]),_:1},8,["modelValue"]),t(lt,{modelValue:w.value,"onUpdate:modelValue":e[86]||(e[86]=s=>w.value=s),title:"AI文本优化",width:"1000px",onClose:ba},{default:n(()=>[l("div",tv,[t(Dt,{gutter:20},{default:n(()=>[t(Ke,{span:12},{default:n(()=>{var s;return[l("div",lv,[l("div",nv,[e[255]||(e[255]=l("h4",{class:"section-title"},"📝 当前文本",-1)),l("div",av,[l("span",null,"字数："+v(ll()),1),l("span",null,"章节："+v(((s=E.value)==null?void 0:s.title)||"未选择"),1)])]),l("div",sv,[t(A,{value:_l(),type:"textarea",rows:12,readonly:"",placeholder:"请先选择文本内容",class:"current-text-area"},null,8,["value"])]),l("div",ov,[t(o,{size:"small",onClick:xa},{default:n(()=>[...e[256]||(e[256]=[r("全选文本",-1)])]),_:1}),t(o,{size:"small",onClick:Va},{default:n(()=>[...e[257]||(e[257]=[r("清空选择",-1)])]),_:1})])])]}),_:1}),t(Ke,{span:12},{default:n(()=>[l("div",iv,[l("div",rv,[e[259]||(e[259]=l("h4",{class:"section-title"},"🔧 优化配置",-1)),t(o,{size:"small",onClick:Sa},{default:n(()=>[...e[258]||(e[258]=[r("使用默认",-1)])]),_:1})]),l("div",uv,[e[265]||(e[265]=l("div",{class:"type-header"},"优化类型",-1)),l("div",dv,[t(Ol,{modelValue:Ge.value,"onUpdate:modelValue":e[83]||(e[83]=s=>Ge.value=s),direction:"vertical"},{default:n(()=>[t(ct,{label:"grammar"},{default:n(()=>[...e[260]||(e[260]=[r("语法润色",-1)])]),_:1}),t(ct,{label:"style"},{default:n(()=>[...e[261]||(e[261]=[r("文风优化",-1)])]),_:1}),t(ct,{label:"emotion"},{default:n(()=>[...e[262]||(e[262]=[r("情感增强",-1)])]),_:1}),t(ct,{label:"logic"},{default:n(()=>[...e[263]||(e[263]=[r("逻辑梳理",-1)])]),_:1}),t(ct,{label:"custom"},{default:n(()=>[...e[264]||(e[264]=[r("自定义优化",-1)])]),_:1})]),_:1},8,["modelValue"])])]),l("div",cv,[l("div",vv,[l("span",null,"可用模板 ("+v(yl().length)+")",1),t(o,{size:"small",onClick:Ca},{default:n(()=>[...e[266]||(e[266]=[r("刷新",-1)])]),_:1})]),l("div",pv,[(u(!0),m(ie,null,re(yl(),s=>{var W,Y,je;return u(),m("div",{key:s.id,class:_e(["prompt-item-optimize",{active:((W=oe.value)==null?void 0:W.id)===s.id}]),onClick:Ft=>$a(s)},[l("div",fv,[l("h5",gv,v(s.title),1),l("p",yv,v(s.description),1),l("div",hv,[l("div",_v,[(u(!0),m(ie,null,re((Y=s.tags)==null?void 0:Y.slice(0,2),Ft=>(u(),G(f,{key:Ft,size:"small"},{default:n(()=>[r(v(Ft),1)]),_:2},1024))),128))])])]),l("div",wv,[((je=oe.value)==null?void 0:je.id)===s.id?(u(),G(i,{key:0,class:"selected-icon"},{default:n(()=>[t(N(It))]),_:1})):I("",!0)])],10,mv)}),128))]),yl().length===0?(u(),m("div",bv,[e[268]||(e[268]=l("p",null,"暂无优化提示词模板",-1)),t(o,{size:"small",onClick:Ia},{default:n(()=>[...e[267]||(e[267]=[r("创建模板",-1)])]),_:1})])):I("",!0)]),oe.value&&Object.keys(Se.value).length>0?(u(),m("div",Cv,[l("div",$v,[e[270]||(e[270]=l("span",null,"📋 变量配置",-1)),t(o,{size:"small",onClick:ka},{default:n(()=>[...e[269]||(e[269]=[r("智能填充",-1)])]),_:1})]),l("div",kv,[(u(!0),m(ie,null,re(Se.value,(s,W)=>(u(),m("div",{key:W,class:"variable-item"},[l("label",xv,v(W),1),t(A,{modelValue:Se.value[W],"onUpdate:modelValue":Y=>Se.value[W]=Y,type:W.includes("文本")||W.includes("内容")?"textarea":"text",rows:2,placeholder:"请输入"+W,onInput:hl,size:"small"},null,8,["modelValue","onUpdate:modelValue","type","placeholder"])]))),128))])])):I("",!0),oe.value||Ge.value==="custom"?(u(),m("div",Vv,[l("div",Sv,[e[273]||(e[273]=l("span",null,"👀 最终提示词",-1)),l("div",Iv,[t(o,{size:"small",onClick:Ta},{default:n(()=>[...e[271]||(e[271]=[r("复制",-1)])]),_:1}),t(o,{size:"small",onClick:za},{default:n(()=>[...e[272]||(e[272]=[r("编辑",-1)])]),_:1})])]),l("div",Tv,[t(A,{modelValue:ke.value,"onUpdate:modelValue":e[84]||(e[84]=s=>ke.value=s),type:"textarea",rows:6,readonly:Ge.value!=="custom",placeholder:"请选择优化类型或提示词",class:"preview-textarea"},null,8,["modelValue","readonly"])])])):I("",!0)])]),_:1})]),_:1}),l("div",zv,[l("div",Av,[t(i,null,{default:n(()=>[t(N(Vo))]),_:1}),l("span",null,v(Pa()),1)]),l("div",Pv,[t(o,{onClick:e[85]||(e[85]=s=>w.value=!1)},{default:n(()=>[...e[274]||(e[274]=[r("取消",-1)])]),_:1}),t(o,{onClick:Aa,disabled:!Dl()},{default:n(()=>[...e[275]||(e[275]=[r("预览效果",-1)])]),_:1},8,["disabled"]),t(o,{type:"primary",onClick:fn,loading:Ee.value,disabled:!Dl()},{default:n(()=>[t(i,null,{default:n(()=>[t(N(ql))]),_:1}),r(" "+v(Ee.value?"优化中...":"开始优化"),1)]),_:1},8,["loading","disabled"])])])])]),_:1},8,["modelValue"]),t(lt,{modelValue:pt.value,"onUpdate:modelValue":e[91]||(e[91]=s=>pt.value=s),title:"AI生成单章",width:"800px",onClose:Ws},{footer:n(()=>[t(o,{onClick:e[90]||(e[90]=s=>pt.value=!1)},{default:n(()=>[...e[278]||(e[278]=[r("取消",-1)])]),_:1}),t(o,{onClick:Ls},{default:n(()=>[...e[279]||(e[279]=[r("选择提示词",-1)])]),_:1}),t(o,{type:"primary",onClick:Ns,loading:Pe.value},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Yt))]),_:1}),r(" "+v(wt.value?"使用自定义提示词生成":"生成章节"),1)]),_:1},8,["loading"])]),default:n(()=>[l("div",Dv,[t(gt,{model:fe.value,"label-width":"120px"},{default:n(()=>[t(R,{label:"章节标题"},{default:n(()=>[t(A,{modelValue:fe.value.title,"onUpdate:modelValue":e[87]||(e[87]=s=>fe.value.title=s),placeholder:"请输入章节标题"},null,8,["modelValue"])]),_:1}),t(R,{label:"情节要求"},{default:n(()=>[t(A,{modelValue:fe.value.plotRequirement,"onUpdate:modelValue":e[88]||(e[88]=s=>fe.value.plotRequirement=s),type:"textarea",rows:3,placeholder:"描述希望的情节发展..."},null,8,["modelValue"])]),_:1}),t(R,{label:"提示词模板"},{default:n(()=>[t(ae,{modelValue:fe.value.template,"onUpdate:modelValue":e[89]||(e[89]=s=>fe.value.template=s),placeholder:"选择模板"},{default:n(()=>[t(V,{label:"通用章节",value:"general"}),t(V,{label:"战斗场景",value:"battle"}),t(V,{label:"情感戏",value:"emotion"}),t(V,{label:"转折剧情",value:"turning"})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"]),wt.value?(u(),m("div",Mv,[t(kn,{title:`已选择自定义提示词：${wt.value.title}`,type:"success","show-icon":"",closable:!1},{default:n(()=>[l("div",Ev,v(wt.value.description||'自定义提示词已准备就绪，点击"生成章节"按钮开始使用此提示词生成章节'),1)]),_:1},8,["title"])])):I("",!0),X.value&&me.value==="single-chapter"?(u(),m("div",Uv,[t(T,{shadow:"never",class:"streaming-card"},{header:n(()=>[l("div",Fv,[e[277]||(e[277]=l("span",null,"🔄 AI正在生成章节大纲...",-1)),t(f,{type:"success",size:"small"},{default:n(()=>[...e[276]||(e[276]=[r("实时生成中...",-1)])]),_:1})])]),default:n(()=>[l("div",Rv,[l("pre",Wv,v(O.value),1)])]),_:1})])):I("",!0)])]),_:1},8,["modelValue"]),t(lt,{modelValue:et.value,"onUpdate:modelValue":e[97]||(e[97]=s=>et.value=s),title:"AI批量生成章节",width:"900px",onClose:Os},{footer:n(()=>[t(o,{onClick:e[96]||(e[96]=s=>et.value=!1)},{default:n(()=>[...e[284]||(e[284]=[r("取消",-1)])]),_:1}),t(o,{onClick:Js},{default:n(()=>[...e[285]||(e[285]=[r("选择提示词",-1)])]),_:1}),t(o,{type:"primary",onClick:js,loading:Pe.value},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Yt))]),_:1}),r(" "+v(F.value?"使用自定义提示词生成":"批量生成"),1)]),_:1},8,["loading"])]),default:n(()=>[l("div",Ov,[t(gt,{model:Te.value,"label-width":"120px"},{default:n(()=>[t(R,{label:"生成数量"},{default:n(()=>[t(sl,{modelValue:Te.value.count,"onUpdate:modelValue":e[92]||(e[92]=s=>Te.value.count=s),min:1,max:10},null,8,["modelValue"])]),_:1}),t(R,{label:"情节要求"},{default:n(()=>[t(A,{modelValue:Te.value.plotRequirement,"onUpdate:modelValue":e[93]||(e[93]=s=>Te.value.plotRequirement=s),type:"textarea",rows:3,placeholder:"描述希望的情节发展..."},null,8,["modelValue"])]),_:1}),t(R,{label:"提示词模板"},{default:n(()=>[t(ae,{modelValue:Te.value.template,"onUpdate:modelValue":e[94]||(e[94]=s=>Te.value.template=s),placeholder:"选择模板"},{default:n(()=>[t(V,{label:"通用章节",value:"general"}),t(V,{label:"战斗场景",value:"battle"}),t(V,{label:"情感戏",value:"emotion"}),t(V,{label:"转折剧情",value:"turning"})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"]),F.value?(u(),m("div",Bv,[t(kn,{title:`已选择自定义提示词：${F.value.title}`,type:"success","show-icon":"",closable:!1},{default:n(()=>[l("div",Nv,v(F.value.description||'自定义提示词已准备就绪，点击"批量生成"按钮开始使用此提示词生成章节'),1)]),_:1},8,["title"]),t(Zs,{modelValue:ut.value,"onUpdate:modelValue":e[95]||(e[95]=s=>ut.value=s),class:"prompt-content-collapse"},{default:n(()=>[t(Ys,{title:"查看提示词内容",name:"promptContent"},{default:n(()=>[l("div",jv,[e[281]||(e[281]=l("div",{class:"prompt-content-header"},[l("span",{class:"content-label"},"原始提示词内容：")],-1)),l("div",qv,v(F.value.content),1),We.value?(u(),m("div",Gv,[e[280]||(e[280]=l("div",{class:"prompt-content-header"},[l("span",{class:"content-label"},"填充变量后的最终提示词：")],-1)),l("div",Lv,v(We.value),1)])):I("",!0)])]),_:1})]),_:1},8,["modelValue"])])):I("",!0),X.value&&me.value==="batch-chapters"?(u(),m("div",Hv,[t(T,{shadow:"never",class:"streaming-card"},{header:n(()=>[l("div",Jv,[e[283]||(e[283]=l("span",null,"🔄 AI正在批量生成章节大纲...",-1)),t(f,{type:"success",size:"small"},{default:n(()=>[...e[282]||(e[282]=[r("实时生成中...",-1)])]),_:1})])]),default:n(()=>[l("div",Kv,[l("pre",Xv,v(O.value),1)])]),_:1})])):I("",!0)])]),_:1},8,["modelValue"]),t(lt,{modelValue:kt.value,"onUpdate:modelValue":e[103]||(e[103]=s=>kt.value=s),title:"AI内容优化",width:"1000px",onClose:Bs},{footer:n(()=>[t(o,{onClick:e[102]||(e[102]=s=>kt.value=!1)},{default:n(()=>[...e[289]||(e[289]=[r("取消",-1)])]),_:1}),t(o,{onClick:Ks},{default:n(()=>[...e[290]||(e[290]=[r("选择提示词",-1)])]),_:1}),t(o,{type:"primary",onClick:qs,loading:Ee.value},{default:n(()=>[t(i,null,{default:n(()=>[t(N(ql))]),_:1}),e[291]||(e[291]=r(" 开始优化 ",-1))]),_:1},8,["loading"]),ce.value.optimizedContent?(u(),G(o,{key:0,type:"success",onClick:Gs},{default:n(()=>[t(i,null,{default:n(()=>[t(N(It))]),_:1}),e[292]||(e[292]=r(" 应用结果 ",-1))]),_:1})):I("",!0)]),default:n(()=>[l("div",Yv,[t(Dt,{gutter:20},{default:n(()=>[t(Ke,{span:12},{default:n(()=>[t(T,{shadow:"never",class:"optimize-input-card"},{header:n(()=>[...e[286]||(e[286]=[l("span",null,"📝 待优化内容",-1)])]),default:n(()=>[t(gt,{model:ce.value,"label-width":"100px"},{default:n(()=>[t(R,{label:"优化类型"},{default:n(()=>[t(ae,{modelValue:ce.value.optimizeType,"onUpdate:modelValue":e[98]||(e[98]=s=>ce.value.optimizeType=s),placeholder:"选择优化类型"},{default:n(()=>[t(V,{label:"语法润色",value:"grammar"}),t(V,{label:"文风优化",value:"style"}),t(V,{label:"情感增强",value:"emotion"}),t(V,{label:"逻辑梳理",value:"logic"}),t(V,{label:"自定义优化",value:"custom"})]),_:1},8,["modelValue"])]),_:1}),ce.value.optimizeType==="custom"?(u(),G(R,{key:0,label:"优化要求"},{default:n(()=>[t(A,{modelValue:ce.value.customRequirement,"onUpdate:modelValue":e[99]||(e[99]=s=>ce.value.customRequirement=s),type:"textarea",rows:2,placeholder:"请描述具体的优化要求..."},null,8,["modelValue"])]),_:1})):I("",!0),t(R,{label:"原始内容"},{default:n(()=>[t(A,{modelValue:ce.value.originalContent,"onUpdate:modelValue":e[100]||(e[100]=s=>ce.value.originalContent=s),type:"textarea",rows:8,placeholder:"请输入需要优化的内容..."},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1})]),_:1}),t(Ke,{span:12},{default:n(()=>[t(T,{shadow:"never",class:"optimize-result-card"},{header:n(()=>[...e[287]||(e[287]=[l("span",null,"✨ 优化结果",-1)])]),default:n(()=>[X.value&&me.value==="optimize"?(u(),m("div",Zv,[l("div",Qv,[l("div",{innerHTML:O.value,class:"streaming-text"},null,8,ep)])])):ce.value.optimizedContent?(u(),m("div",tp,[t(A,{modelValue:ce.value.optimizedContent,"onUpdate:modelValue":e[101]||(e[101]=s=>ce.value.optimizedContent=s),type:"textarea",rows:8,readonly:""},null,8,["modelValue"])])):(u(),m("div",lp,[...e[288]||(e[288]=[l("p",null,'点击"开始优化"按钮查看优化结果',-1)])]))]),_:1})]),_:1})]),_:1})])]),_:1},8,["modelValue"]),t(lt,{modelValue:le.value,"onUpdate:modelValue":e[106]||(e[106]=s=>le.value=s),title:"AI文本润色",width:"1200px",onClose:La},{footer:n(()=>[l("div",$p,[t(o,{onClick:e[105]||(e[105]=s=>le.value=!1)},{default:n(()=>[...e[305]||(e[305]=[r("取消",-1)])]),_:1}),t(o,{type:"primary",onClick:Ha,loading:dt.value,disabled:!yn.value},{default:n(()=>[t(i,null,{default:n(()=>[t(N(xl))]),_:1}),r(" "+v(dt.value?"润色中...":"开始润色"),1)]),_:1},8,["loading","disabled"]),te.value.optimizedContent&&te.value.mode==="selection"?(u(),G(o,{key:0,type:"success",onClick:Xa},{default:n(()=>[t(i,null,{default:n(()=>[t(N(It))]),_:1}),e[306]||(e[306]=r(" 替换选择内容 ",-1))]),_:1})):I("",!0),te.value.optimizedContent&&te.value.mode==="full"?(u(),G(o,{key:1,type:"success",onClick:Ya},{default:n(()=>[t(i,null,{default:n(()=>[t(N(It))]),_:1}),e[307]||(e[307]=r(" 替换全文内容 ",-1))]),_:1})):I("",!0)])]),default:n(()=>[l("div",np,[t(Dt,{gutter:20},{default:n(()=>[t(Ke,{span:8},{default:n(()=>[t(T,{shadow:"never",class:"optimize-config-card"},{header:n(()=>[l("div",ap,[e[295]||(e[295]=l("span",null,"⚙️ 润色配置",-1)),te.value.mode==="selection"?(u(),G(f,{key:0,type:"info",size:"small"},{default:n(()=>[...e[293]||(e[293]=[r("选择内容",-1)])]),_:1})):(u(),G(f,{key:1,type:"warning",size:"small"},{default:n(()=>[...e[294]||(e[294]=[r("整篇文章",-1)])]),_:1}))])]),default:n(()=>[l("div",sp,[e[298]||(e[298]=l("h4",null,"选择润色类型",-1)),l("div",op,[(u(!0),m(ie,null,re(jt.value,s=>{var W;return u(),m("div",{key:s.id,class:_e(["prompt-item",{active:((W=te.value.selectedPrompt)==null?void 0:W.id)===s.id}]),onClick:Y=>Ra(s)},[l("div",rp,v(s.title),1),l("div",up,v(s.description||s.content.substring(0,60)+"..."),1)],10,ip)}),128))]),jt.value.length===0?(u(),m("div",dp,[e[297]||(e[297]=l("p",null,"暂无润色提示词",-1)),t(o,{size:"small",onClick:sn},{default:n(()=>[...e[296]||(e[296]=[r("去提示词库添加",-1)])]),_:1})])):I("",!0)]),l("div",cp,[e[299]||(e[299]=l("h4",null,"自定义润色要求",-1)),t(A,{modelValue:te.value.customPrompt,"onUpdate:modelValue":e[104]||(e[104]=s=>te.value.customPrompt=s),type:"textarea",rows:4,placeholder:"输入具体的润色要求，例如：提升文字的画面感、增强对话的真实感、优化句式结构等..."},null,8,["modelValue"])]),l("div",vp,[e[300]||(e[300]=l("h4",null,"原始内容预览",-1)),t(A,{value:te.value.originalContent,type:"textarea",rows:8,readonly:"",placeholder:"暂无内容",class:"original-content-textarea"},null,8,["value"]),l("div",pp," 字数："+v(te.value.originalContent.length),1)])]),_:1})]),_:1}),t(Ke,{span:16},{default:n(()=>[t(T,{shadow:"never",class:"optimize-result-card"},{header:n(()=>[l("div",mp,[e[302]||(e[302]=l("span",null,"✨ 润色结果",-1)),te.value.optimizedContent&&!dt.value?(u(),G(o,{key:0,type:"success",size:"small",onClick:Ka},{default:n(()=>[t(i,null,{default:n(()=>[t(N(jl))]),_:1}),e[301]||(e[301]=r(" 复制结果 ",-1))]),_:1})):I("",!0)])]),default:n(()=>[dt.value?(u(),m("div",fp,[l("div",gp,[e[304]||(e[304]=l("span",{class:"streaming-status"},"🤖 AI正在润色中...",-1)),t(o,{size:"small",type:"text",onClick:Ja},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Ll))]),_:1}),e[303]||(e[303]=r(" 停止 ",-1))]),_:1})]),l("div",yp,[l("div",hp,v(xt.value),1)])])):te.value.optimizedContent?(u(),m("div",_p,[l("div",wp,v(te.value.optimizedContent),1),l("div",bp,[l("span",null,"润色后字数："+v(te.value.optimizedContent.length),1),l("span",null,"字数变化："+v(te.value.optimizedContent.length-te.value.originalContent.length>0?"+":"")+v(te.value.optimizedContent.length-te.value.originalContent.length),1)])])):(u(),m("div",Cp,[t(xn,{description:"点击润色按钮开始AI润色"})]))]),_:1})]),_:1})]),_:1})])]),_:1},8,["modelValue"]),t(lt,{modelValue:at.value,"onUpdate:modelValue":e[110]||(e[110]=s=>at.value=s),title:"AI智能续写",width:"1000px",top:"5vh",onClose:Ba},{footer:n(()=>[l("div",Rp,[t(o,{onClick:e[109]||(e[109]=s=>at.value=!1)},{default:n(()=>[...e[317]||(e[317]=[r("取消",-1)])]),_:1}),t(o,{type:"primary",onClick:Na,loading:bt.value,disabled:!hn.value},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Ot))]),_:1}),r(" "+v(bt.value?"续写中...":"开始续写"),1)]),_:1},8,["loading","disabled"]),Ye.value&&!bt.value?(u(),G(o,{key:0,type:"success",onClick:Ga},{default:n(()=>[t(i,null,{default:n(()=>[t(N(It))]),_:1}),e[318]||(e[318]=r(" 追加到文章 ",-1))]),_:1})):I("",!0)])]),default:n(()=>[l("div",kp,[t(Dt,{gutter:20,style:{height:"100%"}},{default:n(()=>[t(Ke,{span:10,style:{height:"100%"}},{default:n(()=>[t(T,{shadow:"never",class:"continue-config-card"},{header:n(()=>[...e[308]||(e[308]=[l("div",{class:"card-header"},[l("span",null,"⚙️ 续写配置")],-1)])]),default:n(()=>[l("div",xp,[e[309]||(e[309]=l("h4",null,"续写方向",-1)),t(A,{modelValue:mt.value.direction,"onUpdate:modelValue":e[107]||(e[107]=s=>mt.value.direction=s),type:"textarea",rows:6,placeholder:`请描述续写方向，例如：
- 推进主角与反派的对决
- 展现角色内心的纠结
- 描写紧张的追逐场面
- 揭示重要的秘密

留空将根据大纲和前文自动续写`},null,8,["modelValue"])]),l("div",Vp,[e[310]||(e[310]=l("h4",null,"续写字数",-1)),t(Qs,{modelValue:mt.value.wordCount,"onUpdate:modelValue":e[108]||(e[108]=s=>mt.value.wordCount=s),min:200,max:5e3,step:100,"show-stops":"","show-input":""},null,8,["modelValue"]),e[311]||(e[311]=l("div",{class:"word-count-tips"},[l("span",null,"建议：200-1000字为佳，最多支持5000字")],-1))]),l("div",Sp,[e[312]||(e[312]=l("h4",null,"当前内容",-1)),t(A,{"model-value":Oa(),type:"textarea",rows:6,readonly:"",placeholder:"暂无内容",style:{"max-height":"150px"}},null,8,["model-value"]),l("div",Ip," 当前字数："+v(cl.value),1)])]),_:1})]),_:1}),t(Ke,{span:14,style:{height:"100%"}},{default:n(()=>[t(T,{shadow:"never",class:"continue-result-card"},{header:n(()=>[l("div",Tp,[e[314]||(e[314]=l("span",null,"✍️ 续写结果",-1)),Ye.value&&!bt.value?(u(),G(o,{key:0,type:"success",size:"small",onClick:qa},{default:n(()=>[t(i,null,{default:n(()=>[t(N(jl))]),_:1}),e[313]||(e[313]=r(" 复制结果 ",-1))]),_:1})):I("",!0)])]),default:n(()=>[bt.value?(u(),m("div",zp,[l("div",Ap,[e[316]||(e[316]=l("span",{class:"streaming-status"},"🤖 AI正在续写中...",-1)),t(o,{size:"small",type:"text",onClick:ja},{default:n(()=>[t(i,null,{default:n(()=>[t(N(Ll))]),_:1}),e[315]||(e[315]=r(" 停止 ",-1))]),_:1})]),l("div",Pp,[l("div",Dp,v(Ye.value),1)])])):Ye.value?(u(),m("div",Mp,[l("div",Ep,v(Ye.value),1),l("div",Up,[l("span",null,"续写字数："+v(Ye.value.length),1),l("span",null,"总字数："+v(cl.value+Ye.value.length),1)])])):(u(),m("div",Fp,[t(xn,{description:"点击续写按钮开始AI续写"})]))]),_:1})]),_:1})]),_:1})])]),_:1},8,["modelValue"])])}}},Op=Vl(Wp,[["__scopeId","data-v-70b4451d"]]),d1=Object.freeze(Object.defineProperty({__proto__:null,default:Op},Symbol.toStringTag,{value:"Module"})),Bp={class:"focus-toolbar"},Np={class:"toolbar-left"},jp={class:"toolbar-center"},qp={class:"toolbar-timer"},Gp={class:"toolbar-words"},Lp={class:"toolbar-goal-text"},Hp={class:"toolbar-right"},Jp={class:"right-panel"},Kp={class:"panel-section"},Xp={class:"pomodoro-ring"},Yp={viewBox:"0 0 120 120",class:"ring-svg"},Zp=["stroke"],Qp=["stroke","stroke-dasharray","stroke-dashoffset"],em={class:"ring-text"},tm={class:"ring-time"},lm={class:"ring-label"},nm={class:"pomodoro-controls"},am={class:"pomodoro-count"},sm={class:"panel-section"},om={class:"sound-grid"},im=["onClick","title"],rm={class:"volume-control"},um={class:"panel-section"},dm={class:"setting-row"},cm={class:"setting-value"},vm={class:"setting-row"},pm={class:"setting-value"},mm={class:"setting-row"},fm={class:"setting-value"},gm={class:"panel-section"},ym={class:"theme-grid"},hm=["onClick"],_m={class:"theme-name"},wm={class:"status-left"},bm={class:"status-center"},Cm={class:"status-right"},$m={__name:"FocusMode",setup(_){const h=en(),k=Oo(),P=qo(k.config),ne=g(!1),Q=g(!1),x=g(!0),z=g(""),E=g(null),Z=g([{id:"p1",title:"我的小说"},{id:"p2",title:"短篇集"}]),Ae=g("p1"),ye=g([{id:"c1",title:"第一章 开始"},{id:"c2",title:"第二章 发展"}]),Ve=g("c1"),Ce=g(!1),ue=g(0),ve=g("idle"),Pe=g(0),xe=g(0);let Ee=null;const nt=g(P.typography.fontSize),Ge=g(P.typography.lineHeight),O=g(P.typography.paragraphSpacing),X=g(""),me=g(50);let $e=null,he=null,de=null;const Xe=g(P.theme.preset),ee=P.themePresets,C=P.availableSounds,j=be(()=>z.value.replace(/\s/g,"").length),w=be(()=>{const F=z.value.match(/[。！？；…]+/g);return F?F.length:0}),oe=be(()=>z.value.trim()?z.value.split(/\n+/).filter(F=>F.trim()).length:0),Se=be(()=>{const F=P.wordGoal.dailyGoal;return F>0?Math.min(100,Math.round(j.value/F*100)):0}),ke=be(()=>{const F=Math.floor(xe.value/60),U=xe.value%60;return`${String(F).padStart(2,"0")}:${String(U).padStart(2,"0")}`}),Re=be(()=>{const F=Math.floor(xe.value/3600),U=Math.floor(xe.value%3600/60),We=xe.value%60;return F>0?`${F}时${U}分${We}秒`:`${U}分${We}秒`}),Qe=be(()=>{const F=xe.value/60;return F>0?Math.round(j.value/F):0}),K=be(()=>{const F=Math.floor(ue.value/60),U=ue.value%60;return`${String(F).padStart(2,"0")}:${String(U).padStart(2,"0")}`}),$=be(()=>({idle:"准备就绪",working:"专注写作",short_break:"短休息",long_break:"长休息"})[ve.value]||"准备就绪"),L=be(()=>2*Math.PI*52),J=be(()=>{const F=ve.value==="working"?P.timer.workDuration*60:ve.value==="short_break"?P.timer.shortBreakDuration*60:ve.value==="long_break"?P.timer.longBreakDuration*60:P.timer.workDuration*60,U=F>0?ue.value/F:0;return L.value*(1-U)}),B=be(()=>P.theme.textColor==="#e0e0e0"?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"),Ie=be(()=>({backgroundColor:P.theme.backgroundColor,color:P.theme.textColor,caretColor:P.theme.cursorColor})),Ue=be(()=>({fontFamily:P.typography.fontFamily,fontSize:nt.value+"px",lineHeight:Ge.value,letterSpacing:P.typography.letterSpacing+"px"})),pe=be(()=>({backgroundColor:"transparent",color:P.theme.textColor,caretColor:P.theme.cursorColor,fontSize:nt.value+"px",lineHeight:Ge.value,letterSpacing:P.typography.letterSpacing+"px",textIndent:P.typography.textIndent+"em",maxHeight:"none",overflow:"hidden"})),yt=be(()=>({backgroundColor:P.theme.textColor==="#e0e0e0"?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)",color:P.theme.textColor,opacity:.6}));function Le(F){F.clientY<40&&(ne.value=!0)}function rl(){Q.value=!Q.value}function At(){var F;(F=E.value)==null||F.focus()}function ul(){k.updateWordCount(j.value)}function Nt(F){F.ctrlKey&&F.key==="s"&&(F.preventDefault(),y.success("内容已保存")),F.key==="Escape"&&q(),F.key==="F11"&&(F.preventDefault(),ht())}function ht(){var F,U,We;document.fullscreenElement?(We=document.exitFullscreen)==null||We.call(document):(U=(F=document.documentElement).requestFullscreen)==null||U.call(F)}function q(){k.exitFocusMode(),$t(),kt(),h.back()}function _t(){Ce.value?Qt():He()}function He(){ve.value==="idle"&&(ve.value="working",ue.value=P.timer.workDuration*60),Ce.value=!0,k.startPomodoro(),k.onPomodoroChange((F,U)=>{ve.value=F,ue.value=U,F==="working"&&(Pe.value=k.totalPomodoros)})}function Qt(){Ce.value=!1,k.pausePomodoro()}function vt(){Ce.value=!1,ve.value="idle",ue.value=0,k.resetPomodoro()}function rt(){Ee=setInterval(()=>{xe.value++},1e3)}function $t(){Ee&&(clearInterval(Ee),Ee=null)}function pt(F){if(X.value===F){kt(),X.value="";return}kt(),X.value=F,et(F)}function et(F){try{$e=new(se.AudioContext||se.webkitAudioContext);const U=2*$e.sampleRate,We=$e.createBuffer(1,U,$e.sampleRate),ut=We.getChannelData(0);if(F.replace(/-.*/g,"")==="white-noise"||F==="white-noise")for(let Oe=0;Oe<U;Oe++)ut[Oe]=Math.random()*2-1;else if(F==="pink-noise"){let Oe=0,Fe=0,ce=0,le=0,te=0,jt=0,xt=0;for(let dt=0;dt<U;dt++){const at=Math.random()*2-1;Oe=.99886*Oe+at*.0555179,Fe=.99332*Fe+at*.0750759,ce=.969*ce+at*.153852,le=.8665*le+at*.3104856,te=.55*te+at*.5329522,jt=-.7616*jt-at*.016898,ut[dt]=(Oe+Fe+ce+le+te+jt+xt+at*.5362)*.11,xt=at*.115926}}else{let Oe=0;for(let Fe=0;Fe<U;Fe++){const ce=Math.random()*2-1;ut[Fe]=(Oe+.02*ce)/1.02,Oe=ut[Fe],ut[Fe]*=3.5}}he=$e.createBufferSource(),he.buffer=We,he.loop=!0,de=$e.createGain(),de.gain.value=me.value/100*.3,he.connect(de),de.connect($e.destination),he.start()}catch(U){console.warn("音效播放失败:",U)}}function kt(){var F;if(he){try{he.stop()}catch(U){}he=null}$e&&((F=$e.close)==null||F.call($e),$e=null)}function fe(F){de&&(de.gain.value=F/100*.3)}function Te(F){k.applyThemePreset(F),Xe.value=F}return Ql(()=>{k.enterFocusMode({chapterId:Ve.value,projectId:Ae.value}),rt(),zt(()=>{var F;(F=E.value)==null||F.focus()}),setTimeout(()=>{x.value=!1},600)}),Go(()=>{$t(),kt(),k.exitFocusMode()}),(F,U)=>{const We=Yl,ut=Xl,wt=Ao,Oe=Kl,Fe=Jl,ce=Dn;return u(),G(il,{name:"focus-fade"},{default:n(()=>[l("div",{class:"focus-mode",style:Zt(Ie.value),onMousemove:Le,onMouseleave:U[8]||(U[8]=le=>ne.value=!1)},[t(il,{name:"slide-down"},{default:n(()=>[Ct(l("div",Bp,[l("div",Np,[t(ut,{modelValue:Ae.value,"onUpdate:modelValue":U[0]||(U[0]=le=>Ae.value=le),placeholder:"选择项目",size:"small",style:{width:"140px"}},{default:n(()=>[(u(!0),m(ie,null,re(Z.value,le=>(u(),G(We,{key:le.id,label:le.title,value:le.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),t(ut,{modelValue:Ve.value,"onUpdate:modelValue":U[1]||(U[1]=le=>Ve.value=le),placeholder:"选择章节",size:"small",style:{width:"140px"}},{default:n(()=>[(u(!0),m(ie,null,re(ye.value,le=>(u(),G(We,{key:le.id,label:le.title,value:le.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),l("div",jp,[l("span",qp,v(ke.value),1),U[9]||(U[9]=l("span",{class:"toolbar-divider"},"|",-1)),l("span",Gp,v(j.value)+" 字",1),U[10]||(U[10]=l("span",{class:"toolbar-divider"},"|",-1)),t(wt,{percentage:Se.value,"stroke-width":6,"show-text":!1,style:{width:"120px"},color:P.theme.cursorColor},null,8,["percentage","color"]),l("span",Lp,v(Se.value)+"%",1)]),l("div",Hp,[t(Fe,{size:"small",text:"",onClick:rl},{default:n(()=>[t(Oe,null,{default:n(()=>[t(N(Po))]),_:1})]),_:1}),t(Fe,{size:"small",type:"danger",text:"",onClick:q},{default:n(()=>[t(Oe,null,{default:n(()=>[t(N(Ll))]),_:1}),U[11]||(U[11]=r(" 退出 ",-1))]),_:1})])],512),[[Bt,ne.value]])]),_:1}),l("div",{class:"editor-area",style:Zt(Ue.value),onClick:At},[Ct(l("textarea",{ref_key:"editorRef",ref:E,"onUpdate:modelValue":U[2]||(U[2]=le=>z.value=le),class:"focus-editor",style:Zt(pe.value),placeholder:"开始写作...",onInput:ul,onKeydown:Nt,spellcheck:"false"},null,36),[[Hl,z.value]])],4),t(il,{name:"slide-left"},{default:n(()=>[Ct(l("div",Jp,[l("div",Kp,[U[13]||(U[13]=l("h4",{class:"panel-title"},"番茄钟",-1)),l("div",Xp,[(u(),m("svg",Yp,[l("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:B.value,"stroke-width":"6"},null,8,Zp),l("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:P.theme.cursorColor,"stroke-width":"6","stroke-linecap":"round","stroke-dasharray":L.value,"stroke-dashoffset":J.value,transform:"rotate(-90 60 60)",class:"ring-progress"},null,8,Qp)])),l("div",em,[l("span",tm,v(K.value),1),l("span",lm,v($.value),1)])]),l("div",nm,[t(Fe,{size:"small",round:"",onClick:_t},{default:n(()=>[r(v(Ce.value?"暂停":"开始"),1)]),_:1}),t(Fe,{size:"small",round:"",onClick:vt},{default:n(()=>[...U[12]||(U[12]=[r("重置",-1)])]),_:1})]),l("div",am,"已完成 "+v(Pe.value)+" 个番茄钟",1)]),l("div",sm,[U[14]||(U[14]=l("h4",{class:"panel-title"},"环境音效",-1)),l("div",om,[(u(!0),m(ie,null,re(N(C),le=>(u(),m("button",{key:le.id,class:_e(["sound-btn",{active:X.value===le.id}]),onClick:te=>pt(le.id),title:le.description},[t(Oe,null,{default:n(()=>[(u(),G(Lo(le.icon)))]),_:2},1024),l("span",null,v(le.name),1)],10,im))),128))]),l("div",rm,[t(Oe,null,{default:n(()=>[t(N(Do))]),_:1}),t(ce,{modelValue:me.value,"onUpdate:modelValue":U[3]||(U[3]=le=>me.value=le),min:0,max:100,size:"small",onInput:fe},null,8,["modelValue"])])]),l("div",um,[U[18]||(U[18]=l("h4",{class:"panel-title"},"排版设置",-1)),l("div",dm,[U[15]||(U[15]=l("label",null,"字号",-1)),t(ce,{modelValue:nt.value,"onUpdate:modelValue":U[4]||(U[4]=le=>nt.value=le),min:14,max:32,step:1,size:"small",style:{flex:"1"}},null,8,["modelValue"]),l("span",cm,v(nt.value)+"px",1)]),l("div",vm,[U[16]||(U[16]=l("label",null,"行高",-1)),t(ce,{modelValue:Ge.value,"onUpdate:modelValue":U[5]||(U[5]=le=>Ge.value=le),min:1.2,max:3,step:.1,size:"small",style:{flex:"1"}},null,8,["modelValue"]),l("span",pm,v(Ge.value),1)]),l("div",mm,[U[17]||(U[17]=l("label",null,"段间距",-1)),t(ce,{modelValue:O.value,"onUpdate:modelValue":U[6]||(U[6]=le=>O.value=le),min:4,max:40,step:2,size:"small",style:{flex:"1"}},null,8,["modelValue"]),l("span",fm,v(O.value)+"px",1)])]),l("div",gm,[U[19]||(U[19]=l("h4",{class:"panel-title"},"颜色主题",-1)),l("div",ym,[(u(!0),m(ie,null,re(N(ee),le=>(u(),m("div",{key:le.id,class:_e(["theme-card",{active:Xe.value===le.id}]),onClick:te=>Te(le.id)},[l("div",{class:"theme-preview",style:Zt({background:le.theme.backgroundColor,color:le.theme.textColor})}," Aa ",4),l("span",_m,v(le.name),1)],10,hm))),128))])])],512),[[Bt,Q.value]])]),_:1}),l("div",{class:"status-bar",style:Zt(yt.value)},[l("div",wm,[l("span",null,v(j.value)+" 字",1),U[20]||(U[20]=l("span",{class:"status-divider"},"|",-1)),l("span",null,v(w.value)+" 句",1),U[21]||(U[21]=l("span",{class:"status-divider"},"|",-1)),l("span",null,v(oe.value)+" 段",1)]),l("div",bm,[l("span",null,"已用 "+v(Re.value),1)]),l("div",Cm,[l("span",null,v(Qe.value)+" 字/分钟",1)])],4),t(il,{name:"focus-fade"},{default:n(()=>[x.value?(u(),m("div",{key:0,class:"enter-overlay",onAnimationend:U[7]||(U[7]=le=>x.value=!1)},null,32)):I("",!0)]),_:1})],36)]),_:1})}}},km=Vl($m,[["__scopeId","data-v-ef4332da"]]),c1=Object.freeze(Object.defineProperty({__proto__:null,default:km},Symbol.toStringTag,{value:"Module"}));function Tt(_){return H(this,null,function*(){try{return yield import(_)}catch(h){return null}})}function xm(){if(typeof navigator=="undefined")return!1;const _=navigator.userAgent.toLowerCase();return!!(_.includes("termux")||typeof se!="undefined"&&(se.Termux||se.termux)||_.includes("wv")&&_.includes("android"))}function Vm(){if(typeof navigator=="undefined")return null;const h=navigator.userAgent.match(/Termux\/(\d+\.\d+\.\d+)/);return h?h[1]:null}function Sm(){return H(this,null,function*(){if(typeof navigator=="undefined")return!1;try{const{Filesystem:_,Directory:h}=yield Tt("@capacitor/filesystem");return yield _.readdir({path:"",directory:h.External}),!0}catch(_){return!1}})}const we=xm(),Im=Vm(),$l={isTermux:we,termuxVersion:Im,checkStoragePermission(){return H(this,null,function*(){return Sm()})},requestStoragePermission(){return H(this,null,function*(){if(!we)return!1;if(console.log("请在 Termux 中运行: termux-setup-storage"),typeof se!="undefined"&&se.TermuxAPI)try{return yield se.TermuxAPI.requestStoragePermission(),!0}catch(_){console.warn("请求存储权限失败:",_)}return!1})},files:{getExternalStorageDir(){return H(this,null,function*(){if(!we)return null;try{const{Filesystem:_,Directory:h}=yield Tt("@capacitor/filesystem");return(yield _.getUri({directory:h.External,path:""})).uri}catch(_){return"/storage/emulated/0"}})},getHomeDir(){return we?"/data/data/com.termux/files/home":null},getFilesDir(){return we?"/data/data/com.termux/files":null},readFile(_){return H(this,null,function*(){if(!we)throw new Error("此功能仅在 Termux 环境中可用");try{const{Filesystem:h,Directory:k,Encoding:P}=yield Tt("@capacitor/filesystem");return(yield h.readFile({path:_,directory:k.External,encoding:P.UTF8})).data}catch(h){throw console.error("读取文件失败:",h),h}})},writeFile(_,h){return H(this,null,function*(){if(!we)throw new Error("此功能仅在 Termux 环境中可用");try{const{Filesystem:k,Directory:P,Encoding:ne}=yield Tt("@capacitor/filesystem");return yield k.writeFile({path:_,data:h,directory:P.External,encoding:ne.UTF8}),!0}catch(k){throw console.error("写入文件失败:",k),k}})},appendFile(_,h){return H(this,null,function*(){if(!we)throw new Error("此功能仅在 Termux 环境中可用");try{const{Filesystem:k,Directory:P,Encoding:ne}=yield Tt("@capacitor/filesystem");return yield k.appendFile({path:_,data:h,directory:P.External,encoding:ne.UTF8}),!0}catch(k){throw console.error("追加文件失败:",k),k}})},deleteFile(_){return H(this,null,function*(){if(!we)throw new Error("此功能仅在 Termux 环境中可用");try{const{Filesystem:h,Directory:k}=yield Tt("@capacitor/filesystem");return yield h.deleteFile({path:_,directory:k.External}),!0}catch(h){throw console.error("删除文件失败:",h),h}})},fileExists(_){return H(this,null,function*(){if(!we)return!1;try{const{Filesystem:h,Directory:k}=yield Tt("@capacitor/filesystem");return yield h.stat({path:_,directory:k.External}),!0}catch(h){return!1}})},mkdir(_){return H(this,null,function*(){if(!we)throw new Error("此功能仅在 Termux 环境中可用");try{const{Filesystem:h,Directory:k}=yield Tt("@capacitor/filesystem");return yield h.mkdir({path:_,directory:k.External,recursive:!0}),!0}catch(h){throw console.error("创建目录失败:",h),h}})},listDir(_){return H(this,null,function*(){if(!we)throw new Error("此功能仅在 Termux 环境中可用");try{const{Filesystem:h,Directory:k}=yield Tt("@capacitor/filesystem");return(yield h.readdir({path:_,directory:k.External})).files}catch(h){throw console.error("列出目录失败:",h),h}})},getNovelDir(){return H(this,null,function*(){return`${yield this.getExternalStorageDir()}/YunShu/Novels`})},saveNovel(_,h,k="txt"){return H(this,null,function*(){const P=yield this.getNovelDir();yield this.mkdir(P);const ne=`${_.replace(/[\/\\?%*:|"<>]/g,"_")}.${k}`,Q=`${P}/${ne}`;return yield this.writeFile(Q,h),Q})},exportNovel(_,h="txt"){return H(this,null,function*(){const k=yield this.getNovelDir();yield this.mkdir(k);let P="",ne=h;switch(h){case"txt":P=this._formatAsTxt(_);break;case"md":P=this._formatAsMarkdown(_);break;case"html":P=this._formatAsHtml(_);break;default:P=this._formatAsTxt(_),ne="txt"}const Q=`${_.title.replace(/[\/\\?%*:|"<>]/g,"_")}.${ne}`,x=`${k}/${Q}`;return yield this.writeFile(x,P),x})},_formatAsTxt(_){let h=`${_.title}
`;return h+=`${"=".repeat(_.title.length*2)}

`,_.description&&(h+=`【简介】
${_.description}

`),_.author&&(h+=`作者：${_.author}

`),h+=`${"─".repeat(40)}

`,_.chapters&&_.chapters.length>0&&_.chapters.forEach((k,P)=>{h+=`第${P+1}章 ${k.title}

`,h+=`${k.content}

`,h+=`${"─".repeat(40)}

`}),h},_formatAsMarkdown(_){let h=`# ${_.title}

`;return _.description&&(h+=`> ${_.description}

`),_.author&&(h+=`**作者：** ${_.author}

`),h+=`---

`,_.chapters&&_.chapters.length>0&&_.chapters.forEach((k,P)=>{h+=`## 第${P+1}章 ${k.title}

`,h+=`${k.content}

`,h+=`---

`}),h},_formatAsHtml(_){let h=`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${_.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.8; }
    h1 { text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    h2 { color: #667eea; border-left: 4px solid #667eea; padding-left: 10px; }
    .description { color: #666; font-style: italic; text-align: center; }
    .author { text-align: center; color: #999; }
    .chapter { margin: 30px 0; }
    hr { border: none; border-top: 1px dashed #ddd; margin: 40px 0; }
  </style>
</head>
<body>
  <h1>${_.title}</h1>`;return _.description&&(h+=`
  <p class="description">${_.description}</p>`),_.author&&(h+=`
  <p class="author">作者：${_.author}</p>`),h+=`
  <hr>`,_.chapters&&_.chapters.length>0&&_.chapters.forEach((k,P)=>{h+=`
  <div class="chapter">`,h+=`
    <h2>第${P+1}章 ${k.title}</h2>`,h+=`
    <p>${k.content.replace(/\n/g,`</p>
    <p>`)}</p>`,h+=`
  </div>`,h+=`
  <hr>`}),h+=`
</body>
</html>`,h}},shell:{execute(_){return H(this,null,function*(){if(!we)throw new Error("此功能仅在 Termux 环境中可用");if(typeof se!="undefined"&&se.TermuxAPI)try{const h=yield se.TermuxAPI.executeCommand(_);return{success:!0,output:h.stdout||"",error:h.stderr||""}}catch(h){return{success:!1,output:"",error:h.message}}return{success:!1,output:"",error:"Termux API 不可用"}})},openTerminal(){return H(this,null,function*(){if(we&&typeof se!="undefined"&&se.TermuxAPI)try{yield se.TermuxAPI.openTerminal()}catch(_){console.warn("打开终端失败:",_)}})}},features:{hasTermuxAPI(){return H(this,null,function*(){return we?!!(typeof se!="undefined"&&se.TermuxAPI):!1})},showToast(_){return H(this,null,function*(){if(!we){console.log("[Toast]",_);return}if(typeof se!="undefined"&&se.TermuxAPI)try{yield se.TermuxAPI.showToast(_)}catch(h){console.warn("显示 Toast 失败:",h)}})},vibrate(_=100){return H(this,null,function*(){if(!we){typeof navigator!="undefined"&&navigator.vibrate&&navigator.vibrate(_);return}if(typeof se!="undefined"&&se.TermuxAPI)try{yield se.TermuxAPI.vibrate(_)}catch(h){navigator.vibrate&&navigator.vibrate(_)}})},getBatteryInfo(){return H(this,null,function*(){if(!we)return null;if(typeof se!="undefined"&&se.TermuxAPI)try{return yield se.TermuxAPI.getBatteryInfo()}catch(_){console.warn("获取电池信息失败:",_)}return null})},getNetworkInfo(){return H(this,null,function*(){if(!we)return null;if(typeof se!="undefined"&&se.TermuxAPI)try{return yield se.TermuxAPI.getNetworkInfo()}catch(_){console.warn("获取网络信息失败:",_)}return null})},setClipboard(_){return H(this,null,function*(){if(!we){navigator.clipboard&&(yield navigator.clipboard.writeText(_));return}if(typeof se!="undefined"&&se.TermuxAPI)try{yield se.TermuxAPI.setClipboard(_)}catch(h){navigator.clipboard&&(yield navigator.clipboard.writeText(_))}})},shareText(_){return H(this,null,function*(){if(!we){navigator.share&&(yield navigator.share({text:_}));return}if(typeof se!="undefined"&&se.TermuxAPI)try{yield se.TermuxAPI.shareText(_)}catch(h){navigator.share&&(yield navigator.share({text:_}))}})},shareFile(_){return H(this,null,function*(){if(we&&typeof se!="undefined"&&se.TermuxAPI)try{yield se.TermuxAPI.shareFile(_)}catch(h){console.warn("分享文件失败:",h)}})},openUrl(_){return H(this,null,function*(){if(!we){se.open(_,"_blank");return}if(typeof se!="undefined"&&se.TermuxAPI)try{yield se.TermuxAPI.openUrl(_)}catch(h){se.open(_,"_blank")}})}},quickSave(_,h){return H(this,null,function*(){if(!we){const k=new Blob([h],{type:"text/plain;charset=utf-8"}),P=URL.createObjectURL(k),ne=document.createElement("a");return ne.href=P,ne.download=`${_}.txt`,ne.click(),URL.revokeObjectURL(P),"download"}return this.files.saveNovel(_,h)})},autoBackup(_){return H(this,null,function*(){if(!we)return null;const h=(yield this.files.getNovelDir())+"/.backup";yield this.files.mkdir(h);const k=new Date().toISOString().replace(/[:.]/g,"-"),P=`${_.title}_${k}.json`,ne=`${h}/${P}`,Q=St(Me({},_),{backupTime:new Date().toISOString(),version:"2.5.0"});return yield this.files.writeFile(ne,JSON.stringify(Q,null,2)),ne})},restoreBackup(_){return H(this,null,function*(){if(!we)return null;const h=yield this.files.readFile(_);return JSON.parse(h)})},listBackups(_=null){return H(this,null,function*(){if(!we)return[];const h=(yield this.files.getNovelDir())+"/.backup";try{let P=(yield this.files.listDir(h)).filter(ne=>ne.name.endsWith(".json"));return _&&(P=P.filter(ne=>ne.name.startsWith(_))),P.map(ne=>({name:ne.name,path:`${h}/${ne.name}`,time:ne.mtime}))}catch(k){return[]}})}},Tm={class:"mobile-writer"},zm={class:"writer-header safe-area-top"},Am={class:"writer-title"},Pm=["disabled"],Dm={class:"chapter-info"},Mm={class:"word-count"},Em={key:0,class:"goal-progress"},Um={class:"toolbar"},Fm={key:0,class:"quick-actions"},Rm={class:"chapter-drawer safe-area-all"},Wm={class:"drawer-header"},Om={class:"chapter-list"},Bm=["onClick"],Nm={class:"chapter-number"},jm={class:"chapter-name"},qm={class:"chapter-words"},Gm={class:"ai-assistant-panel safe-area-bottom"},Lm={class:"panel-header"},Hm={class:"ai-options"},Jm={key:0,class:"ai-result"},Km={class:"result-content"},Xm={key:0,class:"auto-save-toast"},Ym={__name:"MobileWriter",setup(_){const h=En(),k=en(),P=Zl(),ne=g(null),Q=g(""),x=g(""),z=g(""),E=g(null),Z=g([]),Ae=g(!1),ye=g(!1),Ve=g(!1),Ce=g(""),ue=g(!1),ve=g(""),Pe=g(0),xe=g(2e3);let Ee=null;const nt=be(()=>Q.value.replace(/\s/g,"").length),Ge=be(()=>{const K={};return ue.value&&(K.paddingBottom="60px"),K});function O(){Q.value&&X(),k.back()}function X(){return H(this,null,function*(){if(!(Ae.value||!Q.value)){Ae.value=!0;try{const K={id:E.value||Date.now().toString(),title:x.value||`第${Z.value.length+1}章`,content:Q.value,wordCount:nt.value,updatedAt:new Date().toISOString()};if(yield P.saveChapter(h.params.novelId,K),!E.value)Z.value.push(K),E.value=K.id;else{const $=Z.value.findIndex(L=>L.id===E.value);$!==-1&&(Z.value[$]=K)}$l.isTermux&&(yield $l.files.saveNovel(z.value,Q.value)),w("已保存")}catch(K){console.error("保存失败:",K),w("保存失败")}finally{Ae.value=!1}}})}function me(){return H(this,null,function*(){var K,$;yield X(),Wt.isNative&&(($=(K=Wt.biometric).vibrate)==null||$.call(K,50))})}function $e(){return H(this,null,function*(){if(Q.value)try{if($l.isTermux){const K=yield $l.files.saveNovel(x.value||"未命名章节",Q.value);w(`已导出到: ${K}`)}else if(Wt.isNative)yield Wt.share.shareContent({title:x.value,text:Q.value});else{const K=new Blob([Q.value],{type:"text/plain;charset=utf-8"}),$=URL.createObjectURL(K),L=document.createElement("a");L.href=$,L.download=`${x.value||"章节"}.txt`,L.click(),URL.revokeObjectURL($)}}catch(K){console.error("导出失败:",K)}})}function he(K){E.value=K.id,x.value=K.title,Q.value=K.content||"",ye.value=!1,zt(()=>{var $;($=ne.value)==null||$.focus()})}function de(){E.value=null,x.value="",Q.value="",ye.value=!1,zt(()=>{var K;(K=ne.value)==null||K.focus()})}function Xe(K){const $=ne.value;if(!$)return;const L=$.selectionStart,J=$.selectionEnd,B=Q.value.substring(L,J);let Ie="";switch(K){case"bold":Ie=`**${B||"粗体文本"}**`;break;case"italic":Ie=`*${B||"斜体文本"}*`;break;case"quote":Ie=`
> ${B||"引用内容"}
`;break;case"dialog":Ie=`"${B||"对话内容"}"`;break}Q.value=Q.value.substring(0,L)+Ie+Q.value.substring(J),zt(()=>{$.focus();const Ue=L+Ie.length;$.setSelectionRange(Ue,Ue)})}function ee(K){return H(this,null,function*(){const $={continue:"正在续写...",expand:"正在扩写...",polish:"正在润色...",dialog:"正在生成对话...",describe:"正在生成场景描写...",character:"正在生成人物刻画..."};Ce.value=$[K]||"AI生成中...",setTimeout(()=>{const L={continue:"阳光透过窗帘洒落在书桌上，她轻轻翻过一页，目光在字里行间流连。",expand:"街道上人来人往，每个人都在为自己的生活奔波。小贩的叫卖声、汽车的鸣笛声、行人的脚步声，交织成一首城市的交响曲。",polish:"月光如水，静静地流淌在这片古老的土地上。",dialog:`"你真的决定要走了吗？"她轻声问道，声音里带着一丝不易察觉的颤抖。

"是的，"他沉默了片刻，"有些事情，我必须去面对。"`,describe:"远处的山峦在夕阳的映照下呈现出金红色的光芒，近处的溪水潺潺流淌，清澈见底，偶尔有几尾小鱼游过，激起一圈圈涟漪。",character:"他身材高大，眉宇间透着一股英气。那双深邃的眼睛仿佛能看透一切，却又带着一丝难以捉摸的神秘。"};Ce.value=L[K]||"AI生成完成"},1500)})}function C(){Ce.value&&(Q.value+=`

`+Ce.value,Ce.value="",Ve.value=!1)}function j(){Ce.value=""}function w(K){ve.value=K,setTimeout(()=>{ve.value=""},2e3)}function oe(){clearTimeout(Ee),Ee=setTimeout(()=>{X()},3e3)}function Se(){ue.value=!0}function ke(){setTimeout(()=>{ue.value=!1},100)}function Re(){ue.value=!0}function Qe(){setTimeout(()=>{ue.value=!1},100)}return Ql(()=>H(this,null,function*(){if(h.params.novelId){const K=yield P.getNovel(h.params.novelId);if(K&&(z.value=K.title,Z.value=K.chapters||[],h.params.chapterId)){const $=Z.value.find(L=>L.id===h.params.chapterId);$&&he($)}}Wt.isNative&&(Wt.keyboard.onShow(K=>{ue.value=!0}),Wt.keyboard.onHide(()=>{ue.value=!1}))})),Mn(()=>{clearTimeout(Ee)}),(K,$)=>{const L=Ho("van-popup");return u(),m("div",Tm,[l("header",zm,[l("button",{class:"back-btn touch-target",onClick:O},[...$[18]||($[18]=[l("span",null,"←",-1)])]),l("h1",Am,v(z.value||"新建章节"),1),l("button",{class:"save-btn touch-target",onClick:X,disabled:Ae.value},v(Ae.value?"保存中...":"保存"),9,Pm)]),l("div",Dm,[Ct(l("input",{"onUpdate:modelValue":$[0]||($[0]=J=>x.value=J),type:"text",class:"chapter-title-input input-mobile",placeholder:"章节标题",onFocus:Re,onBlur:Qe},null,544),[[Hl,x.value]]),l("div",Mm,[l("span",null,v(nt.value)+" 字",1),xe.value?(u(),m("span",Em," | 今日 "+v(Pe.value)+"/"+v(xe.value),1)):I("",!0)])]),l("div",{class:"editor-container",style:Zt(Ge.value)},[Ct(l("textarea",{ref_key:"editorRef",ref:ne,"onUpdate:modelValue":$[1]||($[1]=J=>Q.value=J),class:"editor textarea-mobile",placeholder:"开始写作...",onInput:oe,onFocus:Se,onBlur:ke},null,544),[[Hl,Q.value]])],4),l("footer",{class:_e(["writer-footer safe-area-bottom",{"keyboard-visible":ue.value}])},[l("div",Um,[l("button",{class:"tool-btn touch-target",onClick:$[2]||($[2]=J=>Xe("bold")),title:"加粗"},[...$[19]||($[19]=[l("strong",null,"B",-1)])]),l("button",{class:"tool-btn touch-target",onClick:$[3]||($[3]=J=>Xe("italic")),title:"斜体"},[...$[20]||($[20]=[l("em",null,"I",-1)])]),l("button",{class:"tool-btn touch-target",onClick:$[4]||($[4]=J=>Xe("quote")),title:"引用"},' " '),l("button",{class:"tool-btn touch-target",onClick:$[5]||($[5]=J=>Xe("dialog")),title:"对话"}," 💬 "),l("button",{class:"tool-btn touch-target",onClick:$[6]||($[6]=J=>ye.value=!0),title:"章节"}," 📑 "),l("button",{class:"tool-btn touch-target",onClick:$[7]||($[7]=J=>Ve.value=!0),title:"AI助手"}," 🤖 ")]),ue.value?I("",!0):(u(),m("div",Fm,[l("button",{class:"action-btn",onClick:me}," 快速保存 "),l("button",{class:"action-btn",onClick:$e}," 导出 ")]))],2),t(L,{show:ye.value,"onUpdate:show":$[9]||($[9]=J=>ye.value=J),position:"right",style:{width:"80%",height:"100%"}},{default:n(()=>[l("div",Rm,[l("div",Wm,[$[21]||($[21]=l("h3",null,"章节列表",-1)),l("button",{class:"close-btn touch-target",onClick:$[8]||($[8]=J=>ye.value=!1)},"×")]),l("div",Om,[(u(!0),m(ie,null,re(Z.value,(J,B)=>(u(),m("div",{key:J.id,class:_e(["chapter-item list-item-mobile",{active:E.value===J.id}]),onClick:Ie=>he(J)},[l("span",Nm,"第"+v(B+1)+"章",1),l("span",jm,v(J.title),1),l("span",qm,v(J.wordCount||0)+"字",1)],10,Bm))),128))]),l("button",{class:"add-chapter-btn btn-mobile",onClick:de}," + 新建章节 ")])]),_:1},8,["show"]),t(L,{show:Ve.value,"onUpdate:show":$[17]||($[17]=J=>Ve.value=J),position:"bottom",style:{height:"60%"},round:""},{default:n(()=>[l("div",Gm,[l("div",Lm,[$[22]||($[22]=l("h3",null,"AI 写作助手",-1)),l("button",{class:"close-btn touch-target",onClick:$[10]||($[10]=J=>Ve.value=!1)},"×")]),l("div",Hm,[l("button",{class:"ai-option-btn",onClick:$[11]||($[11]=J=>ee("continue"))},[...$[23]||($[23]=[l("span",{class:"ai-icon"},"✨",-1),l("span",null,"续写",-1)])]),l("button",{class:"ai-option-btn",onClick:$[12]||($[12]=J=>ee("expand"))},[...$[24]||($[24]=[l("span",{class:"ai-icon"},"📝",-1),l("span",null,"扩写",-1)])]),l("button",{class:"ai-option-btn",onClick:$[13]||($[13]=J=>ee("polish"))},[...$[25]||($[25]=[l("span",{class:"ai-icon"},"✏️",-1),l("span",null,"润色",-1)])]),l("button",{class:"ai-option-btn",onClick:$[14]||($[14]=J=>ee("dialog"))},[...$[26]||($[26]=[l("span",{class:"ai-icon"},"💬",-1),l("span",null,"生成对话",-1)])]),l("button",{class:"ai-option-btn",onClick:$[15]||($[15]=J=>ee("describe"))},[...$[27]||($[27]=[l("span",{class:"ai-icon"},"🎨",-1),l("span",null,"场景描写",-1)])]),l("button",{class:"ai-option-btn",onClick:$[16]||($[16]=J=>ee("character"))},[...$[28]||($[28]=[l("span",{class:"ai-icon"},"👤",-1),l("span",null,"人物刻画",-1)])])]),Ce.value?(u(),m("div",Jm,[l("div",Km,v(Ce.value),1),l("div",{class:"result-actions"},[l("button",{class:"action-btn",onClick:C},"应用"),l("button",{class:"action-btn",onClick:j},"重新生成")])])):I("",!0)])]),_:1},8,["show"]),t(il,{name:"fade"},{default:n(()=>[ve.value?(u(),m("div",Xm,v(ve.value),1)):I("",!0)]),_:1})])}}},Zm=Vl(Ym,[["__scopeId","data-v-07714051"]]),v1=Object.freeze(Object.defineProperty({__proto__:null,default:Zm},Symbol.toStringTag,{value:"Module"}));export{c1 as F,u1 as M,d1 as W,v1 as a};
