var lo=Object.defineProperty,no=Object.defineProperties;var ao=Object.getOwnPropertyDescriptors;var zn=Object.getOwnPropertySymbols;var so=Object.prototype.hasOwnProperty,oo=Object.prototype.propertyIsEnumerable;var In=(et,fe,N)=>fe in et?lo(et,fe,{enumerable:!0,configurable:!0,writable:!0,value:N}):et[fe]=N,je=(et,fe)=>{for(var N in fe||(fe={}))so.call(fe,N)&&In(et,N,fe[N]);if(zn)for(var N of zn(fe))oo.call(fe,N)&&In(et,N,fe[N]);return et},Mt=(et,fe)=>no(et,ao(fe));var oe=(et,fe,N)=>new Promise((Z,ne)=>{var de=U=>{try{I(N.next(U))}catch(H){ne(H)}},k=U=>{try{I(N.throw(U))}catch(H){ne(H)}},I=U=>U.done?Z(U.value):Promise.resolve(U.value).then(de,k);I((N=N.apply(et,fe)).next())});import{b as m,x as Gl,a as Vl,v as Hl,Y as Ot,X as il,i as Vt,l as io,N as An,Z as ul,H as uo,E as xl,n as Xl,o as Kl,p as Jl,s as Yl,a2 as ro,S as co,z as Pn,B as Yt,M as vo,ak as Cl,F as Bl,G as ql,aj as Nl,W as Jt,aJ as $l,a4 as Mn,ab as po,a5 as kl,f as It,a1 as mo,al as fo,am as go,an as _o,L as yo,av as ho,b8 as wo,aq as Dn,t as Co,a0 as $o,T as ko,ap as bo,m as Vo,ae as xo,aa as So,y as zo,u as Zl,aQ as Un,bz as Io,P as To,A as Ao,c as Po,bj as Mo,O as Do,a8 as Uo,D as Eo,af as Ro}from"./element-plus-d9f98170.js";import{a as Sl,u as Ql,w as Tn}from"./components-30badcc3.js";import{a6 as Wo,a7 as Fo,a8 as Oo,c as jo,b as Bo,a as qo,a9 as No}from"./config-4b900e2c.js";import{m as Lo}from"./marked-eaffe04c.js";import{r as p,c as he,b as y,e as n,n as we,f as t,w as l,F as te,x as le,i as z,t as v,a as r,h as u,g as P,k as j,at as En,u as en,B as Go,j as Ut,m as bl,p as Rn,y as mt,z as xt,X as Ll,ae as Ho,V as Zt,s as Xo,Y as Ko,T as ol,v as sl,ao as Wn,l as Jo,au as Yo}from"./vue-vendor-b812387e.js";import{T as Zo,E as Qo}from"./editor-8036c02c.js";import{b as Xe,f as Dt}from"./services-e3bf54ba.js";const ei={class:"master-creation"},ti={class:"step-nav"},li={key:0,class:"step-content"},ni={class:"category-tabs"},ai={class:"genre-grid"},si=["onClick"],oi={class:"genre-icon"},ii={class:"genre-name"},ui={class:"genre-desc"},ri={class:"genre-tags"},di={class:"step-actions"},ci={key:1,class:"step-content"},vi={class:"category-tabs"},pi={class:"style-grid"},mi=["onClick"],fi={class:"style-header"},gi={class:"style-avatar"},_i={class:"style-info"},yi={class:"style-name"},hi={class:"style-award"},wi={class:"style-desc"},Ci={class:"style-techniques"},$i={class:"step-actions"},ki={key:2,class:"step-content"},bi={class:"technique-categories"},Vi={class:"group-title"},xi={class:"technique-list"},Si=["onClick"],zi={class:"technique-header"},Ii={class:"technique-icon"},Ti={class:"technique-name"},Ai={class:"technique-desc"},Pi={class:"step-actions"},Mi={key:3,class:"step-content"},Di={class:"config-summary"},Ui={key:0,class:"summary-item"},Ei={class:"summary-value"},Ri={key:1,class:"summary-item"},Wi={class:"summary-value"},Fi={key:2,class:"summary-item"},Oi={class:"summary-value"},ji={key:0,class:"creation-progress"},Bi={class:"progress-steps"},qi={class:"progress-icon"},Ni={class:"progress-label"},Li={class:"progress-message"},Gi={key:1,class:"creation-result"},Hi={class:"result-header"},Xi={class:"result-actions"},Ki={key:0,class:"review-section"},Ji=["innerHTML"],Yi={class:"result-content"},Zi=["innerHTML"],Qi={class:"step-actions"},eu={__name:"MasterCreation",setup(et){const fe=Ql(),N=p(1),Z=p("网络小说"),ne=p(null),de=p(Wo()),k=p("all"),I=p(null),U=p(Fo()),H=p([]),Ee=p(Oo()),ve=p({theme:"",outline:"",wordCount:2e3,refinementMode:"full"}),xe=p(!1),$e=p(""),pe=p(null),ue=p([{label:"📝 生成初稿",status:"waiting"},{label:"🔧 应用技法",status:"waiting"},{label:"✨ 深度润色",status:"waiting"},{label:"🏆 终审评审",status:"waiting"}]),ke=he(()=>de.value.filter(R=>R.category===Z.value)),Ce=he(()=>k.value==="all"?U.value:U.value.filter(R=>R.category===k.value)),be=()=>{ne.value=null},Me=()=>{},Ie=R=>{const h=H.value.indexOf(R);h>-1?H.value.splice(h,1):H.value.push(R)},E=()=>{N.value<4&&N.value++},L=()=>{N.value>1&&N.value--},se=R=>{const h=jo(R);return h?`${h.icon} ${h.name}`:""},ge=R=>{const h=Bo(R);return h?`${h.avatar} ${h.name}`:""},_e=R=>{const h=qo(R);return h?`${h.icon} ${h.name}`:""},re=R=>R?Lo(R):"",Ke=()=>oe(this,null,function*(){if(!ve.value.theme){m.warning("请输入作品主题");return}if(!fe.isApiConfigured){m.warning("请先配置API密钥");return}xe.value=!0,pe.value=null,ue.value=[{label:"📝 生成初稿",status:"waiting"},{label:"🔧 应用技法",status:"waiting"},{label:"✨ 深度润色",status:"waiting"},{label:"🏆 终审评审",status:"waiting"}];try{const R={genreId:ne.value,styleId:I.value,techniqueIds:H.value,theme:ve.value.theme,outline:ve.value.outline,characters:fe.characters,worldSettings:fe.worldSettings,wordCount:ve.value.wordCount,refinementMode:ve.value.refinementMode},h=yield fe.masterCreation(R,Q=>{$e.value=Q.message,Q.step===1?ue.value[0].status=Q.status==="completed"?"completed":"generating":Q.step===2?(ue.value[0].status="completed",ue.value[1].status=Q.status==="completed"?"completed":"generating"):Q.step===3?(ue.value[1].status="completed",ue.value[2].status=Q.status==="completed"?"completed":"generating"):Q.step===4&&(ue.value[2].status="completed",ue.value[3].status=Q.status==="completed"?"completed":"generating")});h&&(pe.value=h,ue.value.forEach(Q=>Q.status="completed"),m.success("大师创作完成！"))}catch(R){m.error("创作失败: "+R.message)}finally{xe.value=!1}}),J=()=>{var R;(R=pe.value)!=null&&R.content&&(navigator.clipboard.writeText(pe.value.content),m.success("内容已复制到剪贴板"))},C=()=>{pe.value=null,ue.value.forEach(R=>R.status="waiting"),$e.value=""};return(R,h)=>{const Q=uo,Se=Gl,ye=xl,Be=Vl,Ze=Xl,Re=Kl,qe=Jl,Y=Yl,ce=Hl;return r(),y("div",ei,[n("div",ti,[n("div",{class:we(["step-item",{active:N.value>=1,completed:N.value>1}])},h[8]||(h[8]=[n("div",{class:"step-number"},"1",-1),n("div",{class:"step-label"},"选择类型",-1)]),2),n("div",{class:we(["step-line",{active:N.value>1}])},null,2),n("div",{class:we(["step-item",{active:N.value>=2,completed:N.value>2}])},h[9]||(h[9]=[n("div",{class:"step-number"},"2",-1),n("div",{class:"step-label"},"选择风格",-1)]),2),n("div",{class:we(["step-line",{active:N.value>2}])},null,2),n("div",{class:we(["step-item",{active:N.value>=3,completed:N.value>3}])},h[10]||(h[10]=[n("div",{class:"step-number"},"3",-1),n("div",{class:"step-label"},"文学技法",-1)]),2),n("div",{class:we(["step-line",{active:N.value>3}])},null,2),n("div",{class:we(["step-item",{active:N.value>=4}])},h[11]||(h[11]=[n("div",{class:"step-number"},"4",-1),n("div",{class:"step-label"},"开始创作",-1)]),2)]),N.value===1?(r(),y("div",li,[h[17]||(h[17]=n("h2",{class:"section-title"},"📚 选择创作类型",-1)),h[18]||(h[18]=n("p",{class:"section-desc"},"选择你要创作的作品类型，系统会为你匹配最佳的创作模板",-1)),n("div",ni,[t(Se,{modelValue:Z.value,"onUpdate:modelValue":h[0]||(h[0]=q=>Z.value=q),onChange:be},{default:l(()=>[t(Q,{label:"网络小说"},{default:l(()=>h[12]||(h[12]=[u("网络小说")])),_:1,__:[12]}),t(Q,{label:"严肃文学"},{default:l(()=>h[13]||(h[13]=[u("严肃文学")])),_:1,__:[13]}),t(Q,{label:"诗歌"},{default:l(()=>h[14]||(h[14]=[u("诗歌")])),_:1,__:[14]}),t(Q,{label:"剧本"},{default:l(()=>h[15]||(h[15]=[u("剧本")])),_:1,__:[15]})]),_:1},8,["modelValue"])]),n("div",ai,[(r(!0),y(te,null,le(ke.value,q=>(r(),y("div",{key:q.id,class:we(["genre-card",{selected:ne.value===q.id}]),onClick:We=>ne.value=q.id},[n("div",oi,v(q.icon),1),n("div",ii,v(q.name),1),n("div",ui,v(q.description),1),n("div",ri,[(r(!0),y(te,null,le(q.bestFor,We=>(r(),y("span",{key:We,class:"genre-tag"},v(We),1))),128))])],10,si))),128))]),n("div",di,[t(Be,{type:"primary",size:"large",disabled:!ne.value,onClick:E},{default:l(()=>[h[16]||(h[16]=u(" 下一步：选择风格 ")),t(ye,null,{default:l(()=>[t(P(Ot))]),_:1})]),_:1,__:[16]},8,["disabled"])])])):z("",!0),N.value===2?(r(),y("div",ci,[h[26]||(h[26]=n("h2",{class:"section-title"},"🎨 选择大师风格",-1)),h[27]||(h[27]=n("p",{class:"section-desc"},"选择一位文学大师的风格作为创作参考，AI将模仿其独特的写作手法",-1)),n("div",vi,[t(Se,{modelValue:k.value,"onUpdate:modelValue":h[1]||(h[1]=q=>k.value=q),onChange:Me},{default:l(()=>[t(Q,{label:"all"},{default:l(()=>h[19]||(h[19]=[u("全部")])),_:1,__:[19]}),t(Q,{label:"严肃文学"},{default:l(()=>h[20]||(h[20]=[u("严肃文学")])),_:1,__:[20]}),t(Q,{label:"世界文学"},{default:l(()=>h[21]||(h[21]=[u("世界文学")])),_:1,__:[21]}),t(Q,{label:"网络小说"},{default:l(()=>h[22]||(h[22]=[u("网络小说")])),_:1,__:[22]})]),_:1},8,["modelValue"])]),n("div",pi,[(r(!0),y(te,null,le(Ce.value,q=>(r(),y("div",{key:q.id,class:we(["style-card",{selected:I.value===q.id}]),onClick:We=>I.value=q.id},[n("div",fi,[n("span",gi,v(q.avatar),1),n("div",_i,[n("div",yi,v(q.name),1),n("div",hi,v(q.award),1)])]),n("div",wi,v(q.description),1),n("div",Ci,[(r(!0),y(te,null,le(q.techniques,We=>(r(),y("span",{key:We,class:"tech-tag"},v(We),1))),128))])],10,mi))),128))]),n("div",$i,[t(Be,{size:"large",onClick:L},{default:l(()=>[t(ye,null,{default:l(()=>[t(P(il))]),_:1}),h[23]||(h[23]=u(" 上一步 "))]),_:1,__:[23]}),t(Be,{type:"primary",size:"large",disabled:!I.value,onClick:E},{default:l(()=>[h[24]||(h[24]=u(" 下一步：文学技法 ")),t(ye,null,{default:l(()=>[t(P(Ot))]),_:1})]),_:1,__:[24]},8,["disabled"]),t(Be,{size:"large",onClick:h[2]||(h[2]=q=>{I.value=null,E()})},{default:l(()=>[h[25]||(h[25]=u(" 跳过 ")),t(ye,null,{default:l(()=>[t(P(Ot))]),_:1})]),_:1,__:[25]})])])):z("",!0),N.value===3?(r(),y("div",ki,[h[31]||(h[31]=n("h2",{class:"section-title"},"🔧 选择文学技法",-1)),h[32]||(h[32]=n("p",{class:"section-desc"},"选择要应用的文学技法，可多选。技法将在创作后自动应用到作品中",-1)),n("div",bi,[(r(!0),y(te,null,le(Ee.value,(q,We)=>(r(),y("div",{key:We,class:"technique-group"},[n("h3",Vi,v(We),1),n("div",xi,[(r(!0),y(te,null,le(q,Ne=>(r(),y("div",{key:Ne.id,class:we(["technique-card",{selected:H.value.includes(Ne.id)}]),onClick:ie=>Ie(Ne.id)},[n("div",zi,[n("span",Ii,v(Ne.icon),1),n("span",Ti,v(Ne.name),1)]),n("div",Ai,v(Ne.description),1)],10,Si))),128))])]))),128))]),n("div",Pi,[t(Be,{size:"large",onClick:L},{default:l(()=>[t(ye,null,{default:l(()=>[t(P(il))]),_:1}),h[28]||(h[28]=u(" 上一步 "))]),_:1,__:[28]}),t(Be,{type:"primary",size:"large",onClick:E},{default:l(()=>[h[29]||(h[29]=u(" 下一步：开始创作 ")),t(ye,null,{default:l(()=>[t(P(Ot))]),_:1})]),_:1,__:[29]}),t(Be,{size:"large",onClick:h[3]||(h[3]=q=>{H.value=[],E()})},{default:l(()=>[h[30]||(h[30]=u(" 跳过 ")),t(ye,null,{default:l(()=>[t(P(Ot))]),_:1})]),_:1,__:[30]})])])):z("",!0),N.value===4?(r(),y("div",Mi,[h[45]||(h[45]=n("h2",{class:"section-title"},"🚀 开始大师创作",-1)),n("div",Di,[ne.value?(r(),y("div",Ui,[h[33]||(h[33]=n("span",{class:"summary-label"},"创作类型",-1)),n("span",Ei,v(se(ne.value)),1)])):z("",!0),I.value?(r(),y("div",Ri,[h[34]||(h[34]=n("span",{class:"summary-label"},"大师风格",-1)),n("span",Wi,v(ge(I.value)),1)])):z("",!0),H.value.length>0?(r(),y("div",Fi,[h[35]||(h[35]=n("span",{class:"summary-label"},"文学技法",-1)),n("span",Oi,v(H.value.map(q=>_e(q)).join("、")),1)])):z("",!0)]),t(ce,{model:ve.value,"label-width":"100px",class:"creation-form"},{default:l(()=>[t(Re,{label:"作品主题"},{default:l(()=>[t(Ze,{modelValue:ve.value.theme,"onUpdate:modelValue":h[4]||(h[4]=q=>ve.value.theme=q),placeholder:"请输入作品主题，如：一个乡村教师的坚守与孤独",type:"textarea",rows:3},null,8,["modelValue"])]),_:1}),t(Re,{label:"作品大纲"},{default:l(()=>[t(Ze,{modelValue:ve.value.outline,"onUpdate:modelValue":h[5]||(h[5]=q=>ve.value.outline=q),placeholder:"可选：输入大纲或故事梗概",type:"textarea",rows:4},null,8,["modelValue"])]),_:1}),t(Re,{label:"目标字数"},{default:l(()=>[t(Y,{modelValue:ve.value.wordCount,"onUpdate:modelValue":h[6]||(h[6]=q=>ve.value.wordCount=q),style:{width:"200px"}},{default:l(()=>[t(qe,{label:"500字（短篇片段）",value:500}),t(qe,{label:"1000字（短篇）",value:1e3}),t(qe,{label:"2000字（中篇片段）",value:2e3}),t(qe,{label:"3000字（中篇）",value:3e3}),t(qe,{label:"5000字（长篇章节）",value:5e3}),t(qe,{label:"8000字（长篇章节）",value:8e3})]),_:1},8,["modelValue"])]),_:1}),t(Re,{label:"精修模式"},{default:l(()=>[t(Se,{modelValue:ve.value.refinementMode,"onUpdate:modelValue":h[7]||(h[7]=q=>ve.value.refinementMode=q)},{default:l(()=>[t(Q,{label:"full"},{default:l(()=>h[36]||(h[36]=[u("完整精修（推荐）")])),_:1,__:[36]}),t(Q,{label:"draft"},{default:l(()=>h[37]||(h[37]=[u("仅生成初稿")])),_:1,__:[37]}),t(Q,{label:"polish"},{default:l(()=>h[38]||(h[38]=[u("初稿+润色")])),_:1,__:[38]})]),_:1},8,["modelValue"]),h[39]||(h[39]=n("div",{class:"form-tip"}," 完整精修：初稿 → 技法应用 → 深度润色 → 终审评审 ",-1))]),_:1,__:[39]})]),_:1},8,["model"]),xe.value?(r(),y("div",ji,[n("div",Bi,[(r(!0),y(te,null,le(ue.value,q=>(r(),y("div",{key:q.label,class:we(["progress-step",q.status])},[n("div",qi,[q.status==="completed"?(r(),j(ye,{key:0},{default:l(()=>[t(P(Vt))]),_:1})):q.status==="generating"?(r(),j(ye,{key:1,class:"spinning"},{default:l(()=>[t(P(io))]),_:1})):(r(),j(ye,{key:2},{default:l(()=>[t(P(An))]),_:1}))]),n("span",Ni,v(q.label),1)],2))),128))]),n("div",Li,v($e.value),1)])):z("",!0),pe.value?(r(),y("div",Gi,[n("div",Hi,[h[42]||(h[42]=n("h3",null,"✅ 创作完成",-1)),n("div",Xi,[t(Be,{type:"primary",onClick:J},{default:l(()=>h[40]||(h[40]=[u("复制内容")])),_:1,__:[40]}),t(Be,{onClick:C},{default:l(()=>h[41]||(h[41]=[u("重新创作")])),_:1,__:[41]})])]),pe.value.review?(r(),y("div",Ki,[h[43]||(h[43]=n("h4",null,"🏆 终审评审报告",-1)),n("div",{class:"review-content",innerHTML:re(pe.value.review)},null,8,Ji)])):z("",!0),n("div",Yi,[n("div",{class:"content-text",innerHTML:re(pe.value.content)},null,8,Zi)])])):z("",!0),n("div",Qi,[t(Be,{size:"large",onClick:L},{default:l(()=>[t(ye,null,{default:l(()=>[t(P(il))]),_:1}),h[44]||(h[44]=u(" 上一步 "))]),_:1,__:[44]}),t(Be,{type:"primary",size:"large",loading:xe.value,disabled:!ve.value.theme,onClick:Ke},{default:l(()=>[xe.value?z("",!0):(r(),j(ye,{key:0},{default:l(()=>[t(P(ul))]),_:1})),u(" "+v(xe.value?"创作中...":"开始大师创作"),1)]),_:1},8,["loading","disabled"])])])):z("",!0)])}}},tu=Sl(eu,[["__scopeId","data-v-e5130e27"]]),h1=Object.freeze(Object.defineProperty({__proto__:null,default:tu},Symbol.toStringTag,{value:"Module"}));const lu={class:"writer-container"},nu={class:"title-bar"},au={class:"title-left"},su={class:"novel-title"},ou={class:"tabs-bar"},iu={class:"main-content"},uu={class:"left-panel"},ru={class:"panel-content"},du={class:"card-header"},cu={class:"chapters-list"},vu=["onClick"],pu={class:"chapter-info"},mu={class:"chapter-meta"},fu={class:"chapter-desc chapter-desc-truncated"},gu={class:"chapter-actions"},_u={key:0,class:"empty-chapters"},yu={class:"panel-content"},hu={class:"card-header"},wu={class:"character-actions"},Cu={class:"characters-list"},$u=["onClick"],ku={class:"character-avatar"},bu=["src"],Vu={key:1,class:"default-avatar"},xu={class:"character-info"},Su={class:"character-meta"},zu={key:1,class:"age-text"},Iu={class:"character-desc character-desc-truncated"},Tu={key:1,class:"character-tags"},Au={class:"character-actions"},Pu={key:0,class:"empty-state"},Mu={class:"panel-content"},Du={class:"card-header"},Uu={class:"world-actions"},Eu={class:"worldview-list"},Ru=["onClick"],Wu={class:"worldview-header"},Fu={class:"worldview-description worldview-description-truncated"},Ou={key:1,class:"worldview-description"},ju={class:"worldview-meta"},Bu={class:"create-time"},qu={key:0,class:"ai-generated"},Nu={class:"worldview-actions"},Lu={key:0,class:"empty-state"},Gu={class:"panel-content"},Hu={class:"card-header"},Xu={class:"corpus-list"},Ku={class:"corpus-content"},Ju={class:"corpus-header"},Yu={class:"corpus-preview corpus-preview-truncated"},Zu={class:"corpus-actions"},Qu={key:0,class:"empty-state"},er={class:"panel-content"},tr={class:"card-header"},lr={class:"events-timeline"},nr={class:"event-content"},ar={class:"event-header"},sr={class:"event-actions"},or={class:"event-desc event-desc-truncated"},ir={class:"event-meta"},ur={class:"event-time"},rr={key:0,class:"empty-state"},dr={class:"editor-panel"},cr={class:"editor-header"},vr={class:"editor-header-left"},pr={class:"chapter-title"},mr={class:"chapter-meta"},fr={class:"word-count"},gr={key:1,class:"saving-indicator"},_r={class:"editor-header-right"},yr={class:"editor-container"},hr={class:"editor-wrapper"},wr={class:"empty-editor"},Cr={class:"form-item-with-ai"},$r={class:"form-item-with-ai"},kr={class:"ai-button-group",style:{"margin-top":"8px"}},br={key:0,style:{"margin-top":"8px"}},Vr={class:"form-item-with-ai"},xr={key:0,class:"streaming-status-card"},Sr=["innerHTML"],zr={class:"chapter-generate-content"},Ir={class:"generate-config-section"},Tr={class:"config-header"},Ar={class:"config-left"},Pr={class:"materials-section"},Mr={class:"section-header"},Dr={class:"tab-header"},Ur={class:"tab-count"},Er={class:"materials-grid"},Rr=["onClick"],Wr={class:"material-header"},Fr={class:"material-name"},Or={class:"material-desc"},jr={class:"material-tags"},Br={key:0,class:"empty-materials"},qr={class:"tab-header"},Nr={class:"tab-count"},Lr={class:"materials-grid"},Gr=["onClick"],Hr={class:"material-header"},Xr={class:"material-name"},Kr={class:"material-desc"},Jr={key:0,class:"empty-materials"},Yr={class:"tab-header"},Zr={class:"tab-count"},Qr={class:"materials-grid"},ed=["onClick"],td={class:"material-header"},ld={class:"material-name"},nd={class:"material-desc"},ad={key:0,class:"empty-materials"},sd={class:"tab-header"},od={class:"tab-count"},id={class:"materials-grid"},ud=["onClick"],rd={class:"material-header"},dd={class:"material-name"},cd={class:"material-desc"},vd={class:"material-meta"},pd={class:"event-time"},md={key:0,class:"empty-materials"},fd={class:"tab-header"},gd={class:"tab-count"},_d={class:"context-tab-actions"},yd={class:"materials-list"},hd=["onClick"],wd={class:"chapter-material-header"},Cd={class:"chapter-material-name"},$d={class:"chapter-material-tags"},kd={class:"chapter-material-desc"},bd={key:0,class:"chapter-material-content"},Vd={class:"content-preview"},xd={key:0,class:"empty-materials"},Sd={class:"prompt-section"},zd={class:"section-header"},Id={class:"category-selection-modern"},Td={class:"category-grid"},Ad=["onClick"],Pd={class:"category-icon"},Md={class:"category-name"},Dd={class:"prompt-selection-modern"},Ud={class:"prompt-header"},Ed={class:"prompt-list-modern"},Rd=["onClick"],Wd={class:"prompt-content"},Fd={class:"prompt-title"},Od={class:"prompt-desc"},jd={class:"prompt-meta"},Bd={class:"prompt-tags"},qd={class:"prompt-actions"},Nd={key:0,class:"empty-prompts"},Ld={key:0,class:"variables-section"},Gd={class:"variables-header"},Hd={class:"variables-form"},Xd={class:"variable-label"},Kd={key:0,class:"context-variable-container"},Jd={class:"context-chapter-option"},Yd={class:"chapter-title"},Zd={class:"chapter-meta"},Qd={class:"word-count"},ec={class:"context-actions"},tc={key:1,class:"preview-section"},lc={class:"preview-header"},nc={class:"preview-actions"},ac={class:"preview-content"},sc={class:"dialog-footer"},oc={class:"action-buttons"},ic={class:"batch-generate-content"},uc={class:"character-type-options"},rc={style:{display:"flex",gap:"10px","align-items":"center"}},dc={key:0,class:"selected-prompt-info"},cc={class:"streaming-content-container"},vc=["innerHTML"],pc={class:"results-header"},mc={class:"result-actions"},fc={class:"generated-characters-grid"},gc=["onClick"],_c={class:"character-header"},yc={class:"character-avatar-preview"},hc={class:"default-avatar"},wc={class:"character-basic-info"},Cc={class:"character-meta"},$c={class:"age-text"},kc={class:"selection-indicator"},bc={class:"character-details"},Vc={class:"detail-item"},xc={class:"detail-item"},Sc={class:"detail-item"},zc={key:0,class:"character-tags-preview"},Ic={class:"dialog-footer"},Tc={class:"world-generate-content"},Ac={class:"world-type-options"},Pc={style:{display:"flex",gap:"10px","align-items":"center"}},Mc={key:0,class:"selected-prompt-info"},Dc={class:"streaming-content-container"},Uc=["innerHTML"],Ec={class:"results-header"},Rc={class:"result-actions"},Wc={class:"generated-settings-list"},Fc=["onClick"],Oc={class:"setting-header"},jc={class:"setting-basic-info"},Bc={class:"selection-indicator"},qc={class:"setting-content"},Nc={class:"dialog-footer"},Lc={class:"prompt-dialog-content"},Gc={class:"prompt-list"},Hc={class:"prompt-cards"},Xc=["onClick"],Kc={class:"prompt-card-header"},Jc={class:"prompt-card-description"},Yc={class:"prompt-card-tags"},Zc={key:0,class:"empty-prompts"},Qc={key:0,class:"prompt-variables"},ev={key:1,class:"final-prompt"},tv={key:0,class:"streaming-content-area"},lv={class:"streaming-header"},nv={class:"streaming-content"},av={class:"streaming-text-plain"},sv={class:"optimize-dialog-content"},ov={class:"current-text-section"},iv={class:"section-header"},uv={class:"text-info"},rv={class:"current-text-content"},dv={class:"text-actions"},cv={class:"optimize-prompt-section"},vv={class:"section-header"},pv={class:"optimize-type-selection"},mv={class:"type-options"},fv={class:"optimize-prompt-selection"},gv={class:"prompt-header"},_v={class:"prompt-list-optimize"},yv=["onClick"],hv={class:"prompt-content"},wv={class:"prompt-title"},Cv={class:"prompt-desc"},$v={class:"prompt-meta"},kv={class:"prompt-tags"},bv={class:"prompt-actions"},Vv={key:0,class:"empty-prompts"},xv={key:0,class:"optimize-variables"},Sv={class:"variables-header"},zv={class:"variables-form"},Iv={class:"variable-label"},Tv={key:1,class:"optimize-preview"},Av={class:"preview-header"},Pv={class:"preview-actions"},Mv={class:"preview-content"},Dv={class:"optimize-actions"},Uv={class:"action-info"},Ev={class:"action-buttons"},Rv={class:"ai-single-chapter-content"},Wv={key:0,class:"custom-prompt-status"},Fv={class:"prompt-preview"},Ov={key:1,class:"streaming-content-area"},jv={class:"streaming-header"},Bv={class:"streaming-content"},qv={class:"streaming-text-plain"},Nv={class:"ai-batch-chapter-content"},Lv={key:0,class:"custom-prompt-status"},Gv={class:"prompt-preview"},Hv={class:"prompt-content-preview"},Xv={class:"prompt-content-text"},Kv={key:0,class:"final-prompt-section"},Jv={class:"prompt-content-text final-prompt"},Yv={key:1,class:"streaming-content-area"},Zv={class:"streaming-header"},Qv={class:"streaming-content"},ep={class:"streaming-text-plain"},tp={class:"ai-optimize-content"},lp={key:0,class:"streaming-content-area"},np={class:"streaming-content"},ap=["innerHTML"],sp={key:1,class:"optimized-content"},op={key:2,class:"empty-result"},ip={class:"new-optimize-container"},up={class:"card-header"},rp={class:"prompt-selection"},dp={class:"prompt-list"},cp=["onClick"],vp={class:"prompt-title"},pp={class:"prompt-desc"},mp={key:0,class:"empty-prompts"},fp={class:"custom-prompt"},gp={class:"original-content-preview"},_p={class:"content-stats"},yp={class:"card-header"},hp={key:0,class:"streaming-area"},wp={class:"streaming-header"},Cp={class:"streaming-content-box"},$p={class:"streaming-text"},kp={key:1,class:"result-area"},bp={class:"result-content"},Vp={class:"result-stats"},xp={key:2,class:"empty-result"},Sp={class:"dialog-footer"},zp={class:"new-continue-container"},Ip={class:"continue-direction"},Tp={class:"continue-word-count"},Ap={class:"current-content-preview"},Pp={class:"content-stats"},Mp={class:"card-header"},Dp={key:0,class:"streaming-area"},Up={class:"streaming-header"},Ep={class:"streaming-content-box"},Rp={class:"streaming-text"},Wp={key:1,class:"result-area"},Fp={class:"result-content"},Op={class:"result-stats"},jp={key:2,class:"empty-result"},Bp={class:"dialog-footer"},qp={__name:"Writer",setup(et){const fe=En(),N=en(),Z=Ql(),ne=()=>{const a=Xe.getConfig();return!a.apiKey||!a.baseURL?(It.confirm("检测到您还未配置AI API，需要先配置API密钥才能使用AI功能。是否前往配置？","需要配置API",{confirmButtonText:"去配置",cancelButtonText:"稍后配置",type:"warning"}).then(()=>{N.push("/config")}).catch(()=>{}),!1):!0},de=()=>ne(),k=p(null),I=p([]),U=p(null),H=p(""),Ee=p(!1),ve=p(!1),xe=p(!1),$e=p(null),pe=Go(),ue=p("editor");p(["chapter-gen"]);const ke=p(!1),Ce=p(!1),be=p(!1),Me=p(!1),Ie=p("grammar"),E=p(""),L=p(!1),se=p(""),ge=p(null),_e=p(!1),re=p(""),Ke=p([]),J=p(null),C=p({}),R=p(""),h=p(!1),Q=p(null),Se=p({}),ye=p(""),Be=p("characters"),Ze=p(!1);p(!0);const Re=p(null),qe=p("content"),Y=p({characters:[],worldSettings:[],corpus:[],events:[],chapters:[]}),ce=p([]),q=p({wordCount:2e3,style:"third-person",focus:""}),We=p([{key:"content",name:"基础正文",icon:"📝"},{key:"content-dialogue",name:"对话生成",icon:"💬"},{key:"content-scene",name:"场景描写",icon:"🏞️"},{key:"content-action",name:"动作情节",icon:"⚡"},{key:"content-psychology",name:"心理描写",icon:"🧠"}]),Ne=p(!1),ie=p({count:5,includeMainCharacters:!0,includeSupportingCharacters:!0,includeMinorCharacters:!0,customPrompt:"",autoAssignRoles:!0}),ft=p(!1),Ae=p([]),jt=p([]),St=p(null),Bt=p({}),gt=p(""),ct=p(!1),W=p({count:3,includeGeography:!0,includeCulture:!0,includeHistory:!0,includeMagic:!1,includeTechnology:!1,includePolitics:!1,includeReligion:!1,includeEconomy:!1,includeRaces:!1,includeLanguage:!1,customPrompt:""}),_t=p(!1),De=p([]),Et=p(!1),vt=p(null),tt=p({}),yt=p(""),pt=p(!1),Fe=p(!1),Ct=p(!1),b=p({title:"",plotRequirement:"",template:"general"}),f=p({count:3,plotRequirement:"",template:"general"}),$=p(null),x=p({}),Ve=p(""),lt=p(["promptContent"]),it=p(null),Pe=p({}),ze=p(""),ae=p({optimizeType:"grammar",customRequirement:"",originalContent:"",optimizedContent:""}),X=p(!1),K=p({originalContent:"",optimizedContent:"",customPrompt:"",selectedPrompt:null,mode:"full",isOptimizing:!1}),Tt=he(()=>Ke.value.filter(a=>a.category==="polish")),ht=p(""),nt=p(!1),B=p(!1),at=p({direction:"",wordCount:500,isStreaming:!1}),Oe=p(""),$t=p(!1),Je=p([]),At=he(()=>Z.worldSettings),st=p([]),Qe=p([]),qt=p(!1),Nt=p(!1),Lt=p(!1),Gt=p(!1),Le=p({title:"",description:"",status:"draft"});p({count:3,plotRequirement:"",template:"general"});const Fn=p({wordCount:2e3,style:"third-person",focus:""}),D=p({id:null,name:"",role:"supporting",gender:"male",age:25,appearance:"",personality:"",background:"",tags:[],avatar:""}),rl=p(""),Ue=p({id:null,title:"",description:"",category:"setting",details:""}),ut=p({id:null,title:"",type:"description",content:"",tags:[]}),Ge=p({id:null,title:"",description:"",chapter:"",time:"",importance:"normal"}),On={},jn={placeholder:"开始您的创作...",MENU_CONF:{uploadImage:{server:"/api/upload-image",fieldName:"file",maxFileSize:5*1024*1024,allowedFileTypes:["image/*"]}}},dl=he(()=>H.value.replace(/<[^>]*>/g,"").length),Bn=()=>{kt(),N.push("/novels")},cl=a=>{kt(),qn(a)},qn=a=>{(!a.status||a.status==="outline")&&(a.status="draft"),U.value=a,H.value=a.content||""},kt=()=>{U.value&&(U.value.content=H.value,U.value.wordCount=dl.value,U.value.updatedAt=new Date,Te())},zl=()=>{$e.value=null,Le.value={title:"",description:"",status:"draft"},xe.value=!0},Nn=a=>{$e.value=a,Le.value={title:a.title,description:a.description||"",status:a.status||"draft"},xe.value=!0},Ln=()=>{if(!Le.value.title.trim()){m.warning("请输入章节标题");return}if($e.value)$e.value.title=Le.value.title,$e.value.description=Le.value.description,$e.value.status=Le.value.status,m.success("章节信息已更新");else{const a={id:Date.now(),title:Le.value.title,description:Le.value.description,content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:Le.value.status};I.value.push(a),m.success("章节创建成功"),setTimeout(()=>{cl(a)},100)}xe.value=!1},Gn=a=>{It.confirm(`确定要删除章节《${a.title}》吗？`,"确认删除",{type:"warning"}).then(()=>{var i;const e=I.value.findIndex(o=>o.id===a.id);e>-1&&(I.value.splice(e,1),((i=U.value)==null?void 0:i.id)===a.id&&(U.value=null,H.value="",I.value.length>0&&setTimeout(()=>{cl(I.value[0])},100)),Te(),m.success("章节已删除"))}).catch(()=>{})},Hn=a=>{pe.value=a},Xn=a=>{switch(a){case"manual":zl();break;case"ai-single":Fs();break;case"ai-batch":Os();break}},Kn=(a,e)=>{switch(a){case"edit":Nn(e);break;case"generate":on(e);break;case"delete":Gn(e);break}},Il=a=>({draft:"warning",completed:"success",published:"primary"})[a]||"warning",vl=a=>({draft:"草稿",completed:"完成",published:"发表"})[a]||"草稿",tn=()=>({grammar:"语法润色",style:"文风优化",emotion:"情感增强",logic:"逻辑梳理"})[Ie.value]||"优化",Jn=a=>({grammar:`
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
4. 确保时间线和因果关系清晰`})[a]||"进行全面优化",Yn=()=>{L.value=!1,Ce.value=!1,ke.value=!1,be.value=!1,E.value="",se.value="",ge.value=null,m.info("已停止AI生成")};Ut(E,()=>{L.value&&Zt(()=>{const a=document.querySelector(".streaming-content");a&&(a.scrollTop=a.scrollHeight)})});const Zn=()=>{const a=localStorage.getItem("prompts");if(a)try{Ke.value=JSON.parse(a)}catch(e){console.error("加载提示词失败:",e),Ke.value=ln(),nn()}else Ke.value=ln(),nn()},ln=()=>[{id:1,title:"小说大纲生成器",category:"outline",description:"根据关键词和类型生成详细的小说大纲",content:`请为我创作一个{类型}小说的大纲，主题是{主题}，主角是{主角设定}。要求包含：
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
描述：[详细的地理环境描述]`,tags:["地理","环境","自然"],isDefault:!0}],nn=()=>{try{localStorage.setItem("prompts",JSON.stringify(Ke.value))}catch(a){console.error("保存提示词失败:",a)}},Qt=a=>Ke.value.filter(e=>e.category===a),Qn=a=>{console.log("openPromptDialog 被调用，category:",a,"showAIBatchChapterDialog:",Fe.value),re.value=a,_e.value=!0,J.value=null,C.value={},R.value="",a==="character"&&D.value&&setTimeout(()=>{an()},100),a==="worldview"&&ct.value&&setTimeout(()=>{kn()},100),a==="outline"&&Fe.value&&console.log("openPromptDialog: 批量章节生成模式，准备预填充基础变量")},ea=a=>{J.value=a,C.value={};const e=a.content.match(/\{([^}]+)\}/g);e&&e.forEach(i=>{const o=i.slice(1,-1);C.value[o]=""}),re.value==="character"&&D.value&&an(),re.value==="worldview"&&ct.value&&kn(),re.value==="outline"&&Fe.value&&(console.log("selectPrompt中检测到批量章节生成，调用autoFillBatchChapterVariables"),setTimeout(()=>{nl()},50)),re.value==="outline"&&pt.value&&(console.log("selectPrompt中检测到单章生成，调用autoFillSingleChapterVariables"),setTimeout(()=>{Ol()},50)),rt()},an=()=>{var i,o,d;if(re.value!=="character")return;C.value.小说标题=((i=k.value)==null?void 0:i.title)||"未命名小说",C.value.姓名=D.value.name||"",C.value.性别=D.value.gender==="male"?"男":D.value.gender==="female"?"女":"其他",C.value.年龄=((o=D.value.age)==null?void 0:o.toString())||"25";const a={protagonist:"主角",supporting:"配角",antagonist:"反派",minor:"次要角色"};C.value.角色定位=a[D.value.role]||"配角",C.value.角色类型=a[D.value.role]||"配角";const e=((d=k.value)==null?void 0:d.genre)||"现代";C.value.小说类型=e,D.value.role==="antagonist"&&(C.value.关系设定="与主角对立的敌人"),D.value.role==="supporting"&&(C.value.角色作用="协助主角发展剧情"),e.includes("古风")||e.includes("古代")?C.value.社会地位="普通百姓":e.includes("现代")||e.includes("都市")?C.value.职业设定="上班族":e.includes("玄幻")||e.includes("修仙")?C.value.修为等级="练气期":e.includes("科幻")&&(C.value.科技设定="星际文明时代"),rt()},rt=()=>{if(!J.value){R.value="";return}let a=J.value.content;Object.keys(C.value).forEach(e=>{const i=C.value[e]||`{${e}}`;a=a.replace(new RegExp(`\\{${e}\\}`,"g"),i)}),R.value=a,re.value==="outline"&&Fe.value&&console.log("generateFinalPrompt - 批量章节生成:",{提示词标题:J.value.title,已有章节变量值:C.value.已有章节?C.value.已有章节.substring(0,300)+"...":"未设置",最终提示词包含已有章节:a.includes("已有章节"),最终提示词包含章节标题关键词:a.includes("第")&&a.includes("章"),所有变量:Object.keys(C.value)})};Ut(C,()=>{rt()},{deep:!0}),Ut(q,()=>{J.value&&Ze.value&&(C.value.目标字数=q.value.wordCount.toString(),C.value.写作视角=Xt(q.value.style),C.value.重点内容=q.value.focus||"按大纲发展",Re.value&&ce.value.length===0&&Tl(),rt())},{deep:!0}),Ut(Y,()=>{if(J.value&&Ze.value){if(Y.value.characters.length>0){const a=Y.value.characters.map(e=>`${e.name}（${e.role}）：${e.personality||"暂无描述"}`).join(`
`);C.value.主要人物=a}else C.value.主要人物&&(C.value.主要人物="");if(Y.value.worldSettings.length>0){const a=Y.value.worldSettings.map(e=>`${e.title}：${e.description||"暂无描述"}`).join(`
`);C.value.世界观设定=a}else C.value.世界观设定&&(C.value.世界观设定="");if(Y.value.corpus.length>0){const a=Y.value.corpus.map(e=>`【${e.title}】${e.content}`).join(`

`);C.value.参考语料=a}else C.value.参考语料&&(C.value.参考语料="");if(Y.value.chapters.length>0){const a=Y.value.chapters.map(e=>{let o=`第${ml(e)}章《${e.title}》
`;if(e.description&&(o+=`章节大纲：${e.description}
`),e.content&&e.content.trim()){const d=fl(e.content,500);o+=`章节内容：${d}${e.content.length>500?"...":""}`}return o}).join(`

`);C.value.前文概要=a}else C.value.前文概要&&(C.value.前文概要="");rt()}},{deep:!0});const ta=()=>({outline:"章节大纲",content:"基础正文","content-dialogue":"对话生成","content-scene":"场景描写","content-action":"动作情节","content-psychology":"心理描写",polish:"文本优化",continue:"智能续写",character:"人物生成",worldview:"世界观生成"})[re.value]||"提示词",la=()=>{J.value=null,C.value={},R.value=""},na=()=>oe(this,null,function*(){try{yield navigator.clipboard.writeText(R.value),m.success("提示词已复制到剪贴板")}catch(a){m.error("复制失败")}}),sn=()=>{N.push("/prompts")},aa=()=>{if(!J.value||!R.value){m.warning("请选择提示词并填充变量");return}if(re.value==="character"&&Ne.value){St.value=J.value,Bt.value=je({},C.value),gt.value=R.value,_e.value=!1,m.success("已选择批量生成角色提示词");return}if(re.value==="worldview"&&ct.value){vt.value=J.value,tt.value=je({},C.value),yt.value=R.value,_e.value=!1,m.success("已选择世界观生成提示词");return}if(re.value==="outline"&&pt.value){Ol(),setTimeout(()=>{rt(),it.value=J.value,Pe.value=je({},C.value),ze.value=R.value,console.log("保存单章提示词信息:",{提示词标题:J.value.title,章节标题:b.value.title,情节要求:b.value.plotRequirement,最终提示词长度:R.value.length}),_e.value=!1,m.success('已选择单章生成提示词，请点击"生成章节"按钮开始生成')},100);return}if(re.value==="outline"&&Fe.value){console.log("确认批量章节提示词，重新填充变量确保包含前5章信息"),nl(),setTimeout(()=>{rt(),$.value=J.value,x.value=je({},C.value),Ve.value=R.value,console.log("保存批量章节提示词信息:",{提示词标题:J.value.title,变量数量:Object.keys(C.value).length,已有章节变量:C.value.已有章节?C.value.已有章节.substring(0,200)+"...":"未找到",最终提示词长度:R.value.length,最终提示词包含前5章信息:R.value.includes("第")&&R.value.includes("章")}),_e.value=!1,m.success('已选择批量生成章节提示词，请点击"批量生成"按钮开始生成')},100);return}switch(re.value){case"outline":ka(R.value);break;case"content":mn(R.value);break;case"polish":fn(R.value);break;case"continue":Ea(R.value);break;case"character":Ra(R.value);break;case"worldview":m.success("世界观提示词已准备就绪");break;default:m.warning("未知的提示词类型");return}_e.value=!1,m.success("正在使用自定义提示词生成内容...")},on=a=>{Re.value=a,Ze.value=!0,Y.value={characters:[],worldSettings:[],corpus:[],events:[],chapters:[]},Tl(),q.value={wordCount:2e3,style:"third-person",focus:""},J.value=null,C.value={},R.value=""},un=()=>{var a;if(J.value){if(Fe.value){nl();return}if(Re.value){if(C.value.小说标题=((a=k.value)==null?void 0:a.title)||"未命名小说",C.value.章节标题=Re.value.title||"",C.value.章节大纲=Re.value.description||"暂无大纲",C.value.目标字数=q.value.wordCount.toString(),C.value.写作视角=Xt(q.value.style),C.value.重点内容=q.value.focus||"按大纲发展",Y.value.characters.length>0){const e=Y.value.characters.map(i=>`${i.name}（${i.role}）：${i.personality||"暂无描述"}`).join(`
`);C.value.主要人物=e}if(Y.value.worldSettings.length>0){const e=Y.value.worldSettings.map(i=>`${i.title}：${i.description||"暂无描述"}`).join(`
`);C.value.世界观设定=e}if(Y.value.corpus.length>0){const e=Y.value.corpus.map(i=>`【${i.title}】${i.content}`).join(`

`);C.value.参考语料=e}if(ce.value.length>0){const i=ce.value.map(o=>I.value.find(d=>d.id===o)).filter(Boolean).map(o=>{let g=`第${ml(o)}章《${o.title}》
`;if(o.description&&(g+=`章节大纲：${o.description}
`),o.content&&o.content.trim()){const c=fl(o.content,500);g+=`章节内容：${c}${o.content.length>500?"...":""}`}return g}).join(`

`);C.value.前文概要=i}else Re.value&&ce.value.length===0&&Tl();rt()}}},pl=(a,e)=>{const i=Y.value[a],o=i.findIndex(d=>d.id===e.id);o>-1?i.splice(o,1):i.push(e)},sa=a=>{J.value=a,C.value={};const e=a.content.match(/\{([^}]+)\}/g);e&&e.forEach(i=>{const o=i.slice(1,-1);C.value[o]=""}),Zt(()=>{un()})},oa=a=>({setting:"primary",magic:"danger",politics:"warning",geography:"success",history:"info"})[a]||"info",ia=a=>({setting:"世界设定",magic:"魔法体系",politics:"政治势力",geography:"地理环境",history:"历史背景"})[a]||a,ua=a=>({description:"success",dialogue:"primary",emotion:"warning",action:"danger",psychology:"info"})[a]||"info",ra=a=>({description:"场景描述",dialogue:"对话模板",emotion:"情感表达",action:"动作描写",psychology:"心理描写"})[a]||a,da=a=>({high:"danger",normal:"primary",low:"info"})[a]||"primary",ca=he(()=>{if(!I.value||!Re.value)return[];const a=I.value.findIndex(e=>e.id===Re.value.id);return a<=0?[]:I.value.slice(0,a).filter(e=>e.content&&e.content.trim())}),Rt=he(()=>I.value?I.value.filter(a=>a.description||a.content&&a.content.trim()).map(a=>({id:a.id,title:a.title,description:a.description,content:a.content,status:a.status,wordCount:a.wordCount||0,chapterIndex:ml(a)})):[]),ml=a=>I.value.findIndex(e=>e.id===a.id)+1,fl=(a,e=80)=>{if(!a)return"";let i=a.replace(/<[^>]*>/g,"");return i=i.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'"),i=i.replace(/\s+/g," ").trim(),i.length>e?i.substring(0,e):i},el=()=>{if(ce.value.length>0){const e=ce.value.map(i=>I.value.find(o=>o.id===i)).filter(Boolean).map(i=>{let d=`第${ml(i)}章《${i.title}》
`;if(i.description&&(d+=`章节大纲：${i.description}
`),i.content&&i.content.trim()){const g=fl(i.content,500);d+=`章节内容：${g}${i.content.length>500?"...":""}`}return d}).join(`

`);C.value.前文概要=e}else C.value.前文概要="";rt()},Tl=()=>{if(!Re.value||!I.value.length){ce.value=[];return}const a=I.value.findIndex(i=>i.id===Re.value.id);if(a<=0){ce.value=[];return}const e=I.value.slice(0,a).filter(i=>i.description||i.content&&i.content.trim()).slice(-2);ce.value=e.map(i=>i.id),el()},va=()=>{ce.value=[],el(),m.success("已清空前文概要选择")},pa=a=>{const e=ce.value.indexOf(a);e>-1?ce.value.splice(e,1):ce.value.push(a),el()},ma=()=>{ce.value=Rt.value.map(a=>a.id),el(),m.success(`已选择所有${Rt.value.length}个章节`)},fa=()=>{Ne.value=!0,ie.value={count:5,includeMainCharacters:!0,includeSupportingCharacters:!0,includeMinorCharacters:!0,customPrompt:"",autoAssignRoles:!0},jt.value=[],Ae.value=[]},rn=()=>oe(this,null,function*(){var a,e,i,o;if(de()){ft.value=!0,jt.value=[],Ae.value=[],E.value="",L.value=!0,se.value="batchCharacters";try{let d="";const g=[];ie.value.includeMainCharacters&&g.push("主角"),ie.value.includeSupportingCharacters&&g.push("配角"),ie.value.includeMinorCharacters&&g.push("次要角色"),St.value&&gt.value?d=`=== 小说基本信息 ===
小说标题：${((a=k.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${(()=>{var w;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(w=k.value)==null?void 0:w.genre]||"通用小说"})()}
小说简介：${((e=k.value)==null?void 0:e.description)||"暂无简介"}

=== 角色生成要求 ===
${gt.value}

=== 生成配置 ===
生成数量：${ie.value.count}个角色
角色类型：${g.join("、")}

${ie.value.customPrompt?`额外要求：${ie.value.customPrompt}`:""}

请根据小说信息和以上提示词生成${ie.value.count}个角色，角色类型应该包括：${g.join("、")}。确保角色设定符合小说的世界观和风格。`:d=`=== 小说基本信息 ===
小说标题：${((i=k.value)==null?void 0:i.title)||"未命名小说"}
小说类型：${(()=>{var w;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(w=k.value)==null?void 0:w.genre]||"通用小说"})()}
小说简介：${((o=k.value)==null?void 0:o.description)||"暂无简介"}

=== 角色生成任务 ===
你是一个专业的小说角色生成器。请严格按照指定格式为上述小说生成${ie.value.count}个人物角色。

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

请完全按照以上示例格式生成${ie.value.count}个角色，每个角色都必须包含：姓名、角色、性别、年龄、外貌、性格、背景、标签这8个字段。

=== 生成要求 ===
角色类型要求：${g.join("、")}
${ie.value.customPrompt?`特殊要求：${ie.value.customPrompt}`:""}

请确保所有角色设定都符合小说的世界观、类型和风格特点。

开始生成：`;const c=`

=== 重要格式要求 ===
无论上述提示词如何，你必须严格按照以下格式输出，不得有任何偏差：

请生成${ie.value.count}个角色，角色类型包括：${g.join("、")}

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

继续按此格式直到生成完所有${ie.value.count}个角色。每个角色必须包含这8个字段。角色类型应该在${g.join("、")}中选择。`,S=d+c;console.log("=== 批量角色生成最终提示词 ==="),console.log(S),console.log("=== 提示词结束 ===");const M=yield Xe.generateTextStream(S,{maxTokens:null,temperature:.8,type:"character"},(_,w)=>{E.value=w,dn(w),Zt(()=>{const T=document.querySelector(".streaming-content");T&&(T.scrollTop=T.scrollHeight)})});dn(M),m.success(`成功生成 ${Ae.value.length} 个角色`)}catch(d){console.error("批量生成角色失败:",d),m.error(`批量生成失败: ${d.message}`)}finally{ft.value=!1,L.value=!1,E.value=""}}}),dn=a=>{if(!a||!a.trim()){Ae.value=[];return}console.log("=== 开始解析角色信息 ==="),console.log("角色原始内容:",a),console.log("内容长度:",a.length),console.log("内容前300字符:",a.substring(0,300));const e=d=>{const g={id:Date.now()+Math.random()*1e3,name:"",role:"supporting",gender:"male",age:25,appearance:"",personality:"",background:"",tags:[],avatar:"",createdAt:new Date,generated:!0},c=[/(?:姓名|名字|角色名|name)\s*[：:]\s*([^\n\r]+)/i,/^([^\n\r：:]{1,10})\s*[：:]?\s*(?:是|为|作为)/,/^([^\n\r：:]{2,8})(?:\s|$)/];for(const me of c){const A=d.match(me);if(A&&A[1]&&A[1].trim()){g.name=A[1].trim(),console.log("提取到姓名:",g.name);break}}const S=[/(?:角色|职责|定位|类型)\s*[：:]\s*([^\n\r]+)/i,/(主角|配角|反派|次要角色|男主|女主|反面角色|支持角色)/i];for(const me of S){const A=d.match(me);if(A&&A[1]){const F=A[1].trim();F.includes("主角")||F.includes("男主")||F.includes("女主")?g.role="protagonist":F.includes("反派")||F.includes("反面")?g.role="antagonist":F.includes("配角")||F.includes("支持")?g.role="supporting":g.role="minor",console.log("提取到角色类型:",g.role);break}}const M=[/(?:性别|gender)\s*[：:]\s*([^\n\r]+)/i,/(男性|女性|男|女|male|female)/i];for(const me of M){const A=d.match(me);if(A&&A[1]){const F=A[1].trim().toLowerCase();F.includes("女")||F.includes("female")?g.gender="female":F.includes("男")||F.includes("male")?g.gender="male":g.gender="other",console.log("提取到性别:",g.gender);break}}const _=[/(?:年龄|age)\s*[：:]\s*(\d+)/i,/(\d+)\s*(?:岁|years)/i,/年龄[约大概]*\s*(\d+)/i];for(const me of _){const A=d.match(me);if(A&&A[1]){const F=parseInt(A[1]);if(!isNaN(F)&&F>0&&F<200){g.age=F,console.log("提取到年龄:",g.age);break}}}const w=[/(?:外貌|外观|长相|appearance)\s*[：:]\s*([^\n\r姓名角色性别年龄性格背景标签]+)/i,/外貌特征[：:]([^\n\r姓名角色性别年龄性格背景标签]+)/i,/长得([^\n\r姓名角色性别年龄性格背景标签]+)/i];for(const me of w){const A=d.match(me);if(A&&A[1]&&A[1].trim()){g.appearance=A[1].trim(),console.log("提取到外貌:",g.appearance.substring(0,50));break}}const T=[/(?:性格|个性|personality)\s*[：:]\s*([^\n\r姓名角色性别年龄外貌背景标签]+)/i,/性格特点[：:]([^\n\r姓名角色性别年龄外貌背景标签]+)/i,/为人([^\n\r姓名角色性别年龄外貌背景标签]+)/i];for(const me of T){const A=d.match(me);if(A&&A[1]&&A[1].trim()){g.personality=A[1].trim(),console.log("提取到性格:",g.personality.substring(0,50));break}}const V=[/(?:背景|经历|身世|background)\s*[：:]\s*([^\n\r姓名角色性别年龄外貌性格标签]+)/i,/出身([^\n\r姓名角色性别年龄外貌性格标签]+)/i,/来自([^\n\r姓名角色性别年龄外貌性格标签]+)/i];for(const me of V){const A=d.match(me);if(A&&A[1]&&A[1].trim()){g.background=A[1].trim(),console.log("提取到背景:",g.background.substring(0,50));break}}const ee=[/(?:标签|tags?)\s*[：:]\s*([^\n\r]+)/i,/特征[：:]([^\n\r]+)/i];for(const me of ee){const A=d.match(me);if(A&&A[1]&&A[1].trim()){g.tags=A[1].trim().split(/[,，\s]+/).map(F=>F.trim()).filter(F=>F),console.log("提取到标签:",g.tags);break}}return g};let i=[];a.match(/角色\d+[：:]/)?(i=a.split(/角色\d+[：:]/i).filter(d=>d.trim()),console.log("使用角色编号分割，得到",i.length,"个块")):a.match(/#{1,3}\s+/)?(i=a.split(/#{1,3}\s+/).filter(d=>d.trim()),console.log("使用标题分割，得到",i.length,"个块")):a.match(/^\d+\./m)?(i=a.split(/^\d+\./m).filter(d=>d.trim()),console.log("使用数字列表分割，得到",i.length,"个块")):(a.match(/姓名[：:]/g)||[]).length>1?(i=a.split(/(?=姓名[：:])/).filter(d=>d.trim()),console.log("使用姓名字段分割，得到",i.length,"个块")):(i=a.split(/\n\s*\n/).filter(d=>d.trim()),i.length===1&&(i=[a]),console.log("使用空行分割，得到",i.length,"个块")),i.forEach((d,g)=>{console.log(`块${g}内容:`,d.substring(0,100)+(d.length>100?"...":""))});const o=[];i.forEach((d,g)=>{var S,M,_,w;if(!d.trim())return;console.log(`=== 处理角色块 ${g} ===`),console.log("块内容:",d);const c=e(d);if(!c.name){const T=(S=d.split(`
`)[0])==null?void 0:S.trim();T&&T.length<20&&!T.includes("：")&&!T.includes(":")&&(c.name=T.replace(/^[^\u4e00-\u9fa5a-zA-Z]*/,"").trim()),c.name||(c.name=`角色${g+1}`)}!c.appearance&&(c.personality||c.background)&&(c.appearance="外貌特征待补充"),!c.personality&&(c.appearance||c.background)&&(c.personality="性格特点待补充"),!c.background&&(c.appearance||c.personality)&&(c.background="背景故事待补充"),c.tags.length===0&&(c.tags=[c.role==="protagonist"?"主角":"配角"]),console.log(`最终角色结果 ${g}:`,{name:c.name,role:c.role,gender:c.gender,age:c.age,appearance:((M=c.appearance)==null?void 0:M.substring(0,50))+"...",personality:((_=c.personality)==null?void 0:_.substring(0,50))+"...",background:((w=c.background)==null?void 0:w.substring(0,50))+"...",tags:c.tags}),c.name&&c.name!=="角色"&&o.push(c)}),console.log("角色最终解析结果数量:",o.length),Ae.value=o},ga=()=>{const a=Ae.value.filter(e=>e.selected!==!1);if(a.length===0){m.warning("请选择要添加的角色");return}Je.value.push(...a),Te(),Ne.value=!1,m.success(`成功添加 ${a.length} 个角色`)},_a=a=>{a.selected=a.selected===!1},Al=a=>({protagonist:"danger",supporting:"primary",antagonist:"warning",minor:"info"})[a]||"info",Pl=a=>({protagonist:"主角",supporting:"配角",antagonist:"反派",minor:"次要角色"})[a]||"配角",cn=a=>({male:"男",female:"女",other:"其他"})[a]||"男",Ml=a=>{if(!a)return"";let e=a.replace(/\n/g,"<br/>");return e=e.replace(/(角色\d+：)/g,'<strong style="color: #409eff; font-size: 16px;">$1</strong>'),e=e.replace(/(设定\d+：)/g,'<strong style="color: #409eff; font-size: 16px;">$1</strong>'),e=e.replace(/(姓名|角色|性别|年龄|外貌|性格|背景|标签)：/g,'<strong style="color: #67c23a;">$1：</strong>'),e=e.replace(/(标题|类型|描述)：/g,'<strong style="color: #67c23a;">$1：</strong>'),e},ya=a=>({地理环境:"success",文化社会:"primary",历史背景:"warning",魔法体系:"danger",科技水平:"info",其他:""})[a]||"",ha=()=>{ct.value=!0,W.value={count:3,includeGeography:!0,includeCulture:!0,includeHistory:!0,includeMagic:!1,includeTechnology:!1,customPrompt:""},De.value=[]},zt=a=>({fantasy:"玄幻修仙",urban:"都市现代",scifi:"科幻未来",historical:"历史古代",mystery:"悬疑推理",wuxia:"武侠江湖","western-fantasy":"西方奇幻",apocalypse:"末世灾难",romance:"言情小说",military:"军事战争",game:"游戏竞技",business:"商战职场"})[a]||"通用小说",vn=()=>oe(this,null,function*(){var a,e,i,o,d,g;if(de()){_t.value=!0,De.value=[],E.value="",L.value=!0,se.value="worldSettings";try{let c="";if(vt.value&&yt.value)c=`=== 小说基本信息 ===
小说标题：${((a=k.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${zt((e=k.value)==null?void 0:e.genre)}
小说简介：${((i=k.value)==null?void 0:i.description)||"暂无简介"}

=== 世界观生成要求 ===
${yt.value}

请根据小说信息和以上要求生成${W.value.count}个世界观设定，确保设定符合小说的整体风格和世界观。`,console.log("使用自定义世界观提示词:",c);else{const M=[];W.value.includeGeography&&M.push("地理环境"),W.value.includeCulture&&M.push("文化社会"),W.value.includeHistory&&M.push("历史背景"),W.value.includeMagic&&M.push("魔法体系"),W.value.includeTechnology&&M.push("科技水平"),W.value.includePolitics&&M.push("政治势力"),W.value.includeReligion&&M.push("宗教信仰"),W.value.includeEconomy&&M.push("经济贸易"),W.value.includeRaces&&M.push("种族设定"),W.value.includeLanguage&&M.push("语言文字"),c=`=== 小说基本信息 ===
小说标题：${((o=k.value)==null?void 0:o.title)||"未命名小说"}
小说类型：${zt((d=k.value)==null?void 0:d.genre)}
小说简介：${((g=k.value)==null?void 0:g.description)||"暂无简介"}

=== 世界观生成任务 ===
请为上述小说生成${W.value.count}个世界观设定。

=== 生成要求 ===
设定类型要求：${M.join("、")}
${W.value.customPrompt?`特殊要求：${W.value.customPrompt}`:""}

请为每个设定生成详细信息，格式如下：

设定1：
标题：[设定标题]
类型：[设定类型]
描述：[详细描述，包含具体的设定内容、规则、特点等]

设定2：
...

请确保所有设定都符合小说的类型、风格和世界观，设定之间具有关联性和一致性。`,console.log("使用默认世界观提示词")}const S=yield Xe.generateTextStream(c,{maxTokens:null,temperature:.8,type:"worldview"},(M,_)=>{E.value=_,pn(_),Zt(()=>{const w=document.querySelector(".streaming-content");w&&(w.scrollTop=w.scrollHeight)})});pn(S),m.success(`成功生成 ${De.value.length} 个世界观设定`)}catch(c){console.error("AI生成世界观设定失败:",c),m.error(`世界观生成失败: ${c.message}`)}finally{_t.value=!1,L.value=!1,E.value=""}}}),pn=a=>{if(!a||!a.trim()){De.value=[];return}console.log("原始内容:",a);let e=[];if(a.includes("设定1：")||a.includes("设定2："))e=a.split(/设定\d+[：:]/i).filter(o=>o.trim());else if(a.includes("## ")||a.includes("# "))e=a.split(/#{1,3}\s+/).filter(o=>o.trim());else if(a.includes("1.")||a.includes("2."))e=a.split(/\d+\./).filter(o=>o.trim());else if(a.includes("**")&&a.includes("标题："))e=a.split(/\*\*[^*]+\*\*/).filter(o=>o.trim());else if(a.split("标题：").length>2)e=a.split("标题：").filter(o=>o.trim()),e=e.map((o,d)=>d===0&&!o.includes("标题：")?null:o.includes("标题：")?o:"标题："+o).filter(o=>o!==null);else{const o=a.split(/\n\s*\n/).filter(d=>d.trim());o.length>1?e=o:e=[a]}console.log("分割后的块数:",e.length);const i=[];if(e.forEach((o,d)=>{if(!o.trim())return;console.log(`处理块 ${d}:`,o.substring(0,100));const g=o.split(`
`).map(_=>_.trim()).filter(_=>_),c={id:Date.now()+d*1e3,title:"",type:"其他",description:"",createdAt:new Date,generated:!0};let S=!1,M=[];if(g.forEach((_,w)=>{if(_.startsWith("标题：")||_.startsWith("标题:"))c.title=_.replace(/标题[：:]/,"").trim(),S=!1;else if(_.startsWith("类型：")||_.startsWith("类型:"))c.type=_.replace(/类型[：:]/,"").trim(),S=!1;else if(_.startsWith("描述：")||_.startsWith("描述:")){const T=_.replace(/描述[：:]/,"").trim();T?M=[T]:M=[],S=!0}else S&&_&&!_.match(/^(标题|类型|描述)[：:]/)?M.push(_):!c.title&&w===0?c.title=_.replace(/^[^\u4e00-\u9fa5a-zA-Z]*/,"").trim():!S&&_&&!_.match(/^(标题|类型|描述)[：:]/)&&(M.push(_),S=!0)}),M.length>0&&(c.description=M.join(`
`).trim()),!c.title)if(c.description&&c.description.length>0){const _=c.description.split(`
`)[0];if(_.length<=50)c.title=_,c.description=c.description.split(`
`).slice(1).join(`
`).trim();else{const w=_.split(/[。！？.!?]/)[0];w.length<=30?c.title=w:c.title=`世界观设定${d+1}`}}else c.title=`世界观设定${d+1}`;if(!c.title&&!c.description){const _=o.trim();if(_.length>0){const w=_.split(`
`)[0].trim();w.length<=50&&w.length>0?(c.title=w,c.description=_.split(`
`).slice(1).join(`
`).trim()||"详细设定内容"):(c.title=`世界观设定${d+1}`,c.description=_)}}(!c.description||c.description.trim()==="")&&(c.description="暂无描述"),console.log(`解析结果 ${d}:`,{title:c.title,type:c.type,description:c.description.substring(0,100)+(c.description.length>100?"...":"")}),c.title&&c.title.trim()!==""&&i.push(c)}),i.length===0&&a.trim().length>0){const o=a.trim().split(`
`).filter(d=>d.trim());if(o.length>0){const d={id:Date.now(),title:o[0].length<=50?o[0]:"世界观设定",type:"其他",description:o.length>1?o.slice(1).join(`
`):o[0],createdAt:new Date,generated:!0};i.push(d),console.log("创建默认设定:",d)}}console.log("最终解析结果数量:",i.length),De.value=i},wa=()=>{const a=De.value.filter(e=>e.selected!==!1);if(a.length===0){m.warning("请选择要添加的世界观设定");return}a.forEach(e=>{Z.addWorldSetting(e)}),Te(),ct.value=!1,m.success(`成功添加 ${a.length} 个世界观设定`)},Ca=a=>{a.selected=a.selected===!1},$a=()=>oe(this,null,function*(){var a,e,i;if(de()){if(!((a=Ue.value.title)!=null&&a.trim())){m.warning("请先输入设定标题");return}Et.value=!0,E.value="",L.value=!0,se.value="worldSetting",Ue.value.description="";try{const o={setting:"世界设定",magic:"魔法体系",politics:"政治势力",geography:"地理环境",history:"历史背景"}[Ue.value.category]||"世界设定",d=`=== 小说基本信息 ===
小说标题：${((e=k.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=k.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((i=k.value)==null?void 0:i.description)||"暂无简介"}

=== 世界观设定生成任务 ===
请为上述小说生成世界观设定的详细描述。

=== 设定信息 ===
- 设定标题：${Ue.value.title}
- 设定类别：${o}

=== 生成要求 ===
请生成详细的设定描述，包括：
1. 具体的设定内容和规则
2. 在小说世界中的作用和意义
3. 与其他设定的关联性
4. 对故事情节的影响

要求描述详细、生动，符合小说的类型、风格和整体世界观。`,g=yield Xe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"worldview"},(c,S)=>{E.value=S,Ue.value.description=S});Ue.value.description=g,m.success("AI世界观设定生成完成")}catch(o){console.error("AI生成世界观设定失败:",o),m.error(`设定生成失败: ${o.message}`)}finally{Et.value=!1,L.value=!1,E.value=""}}}),ka=a=>oe(this,null,function*(){var e,i;if(de()){ke.value=!0,L.value=!0,se.value="chapter",E.value="";try{console.log("使用自定义提示词生成章节:",a);const o=`=== 小说基本信息 ===
小说标题：${((e=k.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=k.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((i=k.value)==null?void 0:i.description)||"暂无简介"}

=== 章节生成要求 ===
${a}

请确保生成的章节符合小说的整体风格、类型和世界观设定。`,d=yield Xe.generateTextStream(o,{maxTokens:null,temperature:.8,type:"outline"},(c,S)=>{E.value=S});if(!d.trim())throw new Error("AI返回内容为空");const g=Ul(d);g.forEach((c,S)=>{const M={id:Date.now()+S,title:c.title||`AI生成章节 ${I.value.length+S+1}`,description:c.description||c.outline||"暂无描述",content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};I.value.push(M)}),m.success(`成功生成${g.length}个章节大纲`),Te()}catch(o){console.error("AI生成章节失败:",o),m.error(`章节生成失败: ${o.message}`)}finally{ke.value=!1,L.value=!1,E.value=""}}}),mn=a=>oe(this,null,function*(){var e,i;if(de()){if(!U.value){m.warning("请先选择一个章节");return}Ce.value=!0,L.value=!0,se.value="content",E.value="",ge.value=U.value;try{console.log("使用自定义提示词生成正文:",a);const o=hl(),d=q.value;let g=`=== 小说基本信息 ===
小说标题：${((e=k.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var w;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(w=k.value)==null?void 0:w.genre]||"通用小说"})()}
小说简介：${((i=k.value)==null?void 0:i.description)||"暂无简介"}

=== 当前章节信息 ===
章节标题：${U.value.title}
章节大纲：${U.value.description||"暂无大纲"}

=== 生成配置（用户最新设置） ===
目标字数：约${d.wordCount}字
写作视角：${Xt(d.style)}
重点内容：${d.focus||"按大纲发展"}

`;if(Y.value.characters.length>0){const _=Y.value.characters;g+=`=== 主要人物设定 ===
${_.map(w=>`- ${w.name}（${w.role}）：${w.personality||"暂无描述"}`).join(`
`)}

`}if(Y.value.worldSettings.length>0){const _=Y.value.worldSettings;g+=`=== 世界观设定 ===
${_.map(w=>`- ${w.title}：${w.description||"暂无描述"}`).join(`
`)}

`}if(Y.value.corpus.length>0&&(g+=`=== 参考语料 ===
${Y.value.corpus.map(_=>`【${_.title}】${_.content}`).join(`

`)}

`),Y.value.events.length>0){const _=Y.value.events;g+=`=== 相关事件线 ===
${_.map(w=>`- 第${w.chapter}章：${w.title} - ${w.description||"暂无描述"}`).join(`
`)}

【事件线要求】本章内容需要考虑以上事件的影响和发展，确保情节的连贯性和合理性。

`}let c=[];if(ce.value&&ce.value.length>0&&(c=ce.value.map(_=>I.value.find(w=>w.id===_)).filter(Boolean)),c.length>0){const _=c.map(w=>`第${I.value.findIndex(V=>V.id===w.id)+1}章：${w.title}`).join("、");console.log(`正在使用以下章节作为上下文参考：${_}`),m.info({message:`使用上下文：${_}`,duration:3e3}),g+=`=== 前文概要（必须保持连贯） ===
${c.map(w=>`第${I.value.findIndex(V=>V.id===w.id)+1}章《${w.title}》：${w.description||"暂无概要"}`).join(`
`)}

=== 前文详细内容（保持文风和情节连贯） ===`,c.forEach(w=>{const T=I.value.findIndex(V=>V.id===w.id)+1;if(w.description&&(g+=`
【第${T}章大纲】
${w.description}
`),w.content&&w.content.trim()){const V=w.content.replace(/<[^>]*>/g,"").trim();if(V.length<=1e3)g+=`
【第${T}章内容】
${V}
`;else{const ee=V.substring(0,500),me=V.slice(-500);g+=`
【第${T}章开头部分】
${ee}

【第${T}章结尾部分】
${me}
`}}}),g+=`
【重要】必须确保本章内容与选定的前文章节在以下方面保持连贯：
- 人物性格和行为逻辑一致
- 时间线和事件发展合理
- 情节推进自然流畅
- 世界观设定保持统一
- 文风和叙述风格保持一致
- 与前文情节自然衔接，特别是与最后章节的结尾部分

`}g+=`=== 核心生成要求 ===
${a}

=== 写作要求（必须严格遵守） ===
1. 保持${Xt(d.style)}的叙述方式
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

请确保生成的正文符合小说的整体风格、类型和世界观设定，与章节大纲保持一致。`,console.log("=== 发送给AI的完整提示词 ==="),console.log("选中的上下文章节:",c.map(_=>`第${I.value.findIndex(w=>w.id===_.id)+1}章：${_.title}`)),console.log(g),console.log("=== 提示词结束 ===");const S=yield Xe.generateTextStream(g,{maxTokens:null,temperature:.8,type:"generation"},(_,w)=>{var V,ee;console.log("提示词生成流式回调:",_.length,"字符，总长度:",w.length),E.value=w;const T=Kt(w,U.value.title);((V=ge.value)==null?void 0:V.id)===((ee=U.value)==null?void 0:ee.id)&&(H.value=T,Ee.value=!0)});if(!S.trim())throw new Error("AI返回内容为空");const M=Kt(S,U.value.title);H.value=M,Ee.value=!0,U.value.status="draft",m.success("正文生成成功"),setTimeout(()=>{kt(),Te()},1e3)}catch(o){console.error("AI生成正文失败:",o),m.error(`正文生成失败: ${o.message}`)}finally{Ce.value=!1,L.value=!1,E.value="",ge.value=null}}}),fn=(a=null)=>oe(this,null,function*(){var e,i;if(de()){if(!U.value||!H.value){m.warning("请先选择章节并添加内容");return}be.value=!0,L.value=!0,se.value="optimize",E.value="",ge.value=U.value;try{let o=a;a||(Q.value?o=ye.value:o=gn());const d=`=== 小说基本信息 ===
小说标题：${((e=k.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=k.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((i=k.value)==null?void 0:i.description)||"暂无简介"}

=== 当前章节信息 ===
章节标题：${U.value.title}
章节大纲：${U.value.description||"暂无大纲"}

=== 优化要求 ===
${o}

=== 原文内容 ===
${yl()}

请确保优化后的内容符合小说的整体风格、类型和世界观设定。`,g=yield Xe.generateTextStream(d,{maxTokens:null,temperature:.7,type:"optimize"},(c,S)=>{console.log("优化流式回调:",c.length,"字符，总长度:",S.length),E.value=S});H.value=g,Ee.value=!0,m.success("文本优化完成"),h.value=!1,setTimeout(()=>{kt(),Te()},1e3)}catch(o){console.error("文本优化失败:",o),m.error(`优化失败: ${o.message}`)}finally{be.value=!1,L.value=!1}}}),ba=()=>{Q.value=null,Se.value={},ye.value=""},gl=()=>JSON.parse(localStorage.getItem("prompts")||"[]").filter(e=>e.category==="polish"||e.category==="optimize"),Va=()=>{const a=gl();console.log("刷新优化提示词:",a.length)},xa=a=>{Q.value=a;const e={},i=a.content.match(/\{\{([^}]+)\}\}/g);i&&i.forEach(o=>{const d=o.replace(/\{\{|\}\}/g,"");e[d]=""}),Se.value=e,_l()},Sa=()=>{Q.value&&(Object.keys(Se.value).forEach(a=>{var e,i;a.includes("文本")||a.includes("内容")?Se.value[a]=yl().substring(0,200)+"...":a.includes("类型")||a.includes("风格")?Se.value[a]=((e=k.value)==null?void 0:e.genre)||"通用":(a.includes("章节")||a.includes("标题"))&&(Se.value[a]=((i=U.value)==null?void 0:i.title)||"")}),_l())},_l=()=>{if(!Q.value){ye.value=gn();return}let a=Q.value.content;Object.keys(Se.value).forEach(e=>{const i=Se.value[e]||`[${e}]`;a=a.replace(new RegExp(`\\{\\{${e}\\}\\}`,"g"),i)}),ye.value=a},yl=()=>H.value?H.value.replace(/<[^>]*>/g,"").trim():"",tl=()=>yl().length,za=()=>{m.info("已选择全部文本")},Ia=()=>{m.info("已清空选择")},Ta=()=>{Q.value=null,Se.value={},_l()},gn=()=>{const a=Jn(Ie.value);return`请对以下小说内容进行${tn()}。

优化要求：
${a}

请返回优化后的内容，保持原文的故事情节和人物性格不变。`},Aa=()=>{N.push("/prompts-library")},Pa=()=>{ye.value&&(navigator.clipboard.writeText(ye.value),m.success("提示词已复制到剪贴板"))},Ma=()=>{m.info("您可以直接在预览框中编辑提示词")},Da=()=>{var a;Dl()&&It.alert(`优化类型：${tn()}
文本长度：${tl()} 字
预估费用：¥${(tl()*.001).toFixed(3)}
使用提示词：${((a=Q.value)==null?void 0:a.title)||"默认提示词"}`,"优化预览",{confirmButtonText:"确定"})},Dl=()=>tl()>0&&(Q.value||Ie.value),Ua=()=>{const a=tl(),e=(a*.001).toFixed(3);return`文本${a}字，预估费用¥${e}`},Ea=a=>oe(this,null,function*(){var i,o;if(!de())return;if(!U.value){m.warning("请先选择一个章节");return}if(!H.value||H.value.trim().length<50){m.warning("请先写一些内容，AI将基于现有内容进行续写");return}Ce.value=!0,L.value=!0,se.value="continue",E.value="",ge.value=U.value;const e=H.value;try{console.log("使用自定义提示词续写:",a);const d=hl(),g=Fn.value;let c=`=== 小说基本信息 ===
小说标题：${((i=k.value)==null?void 0:i.title)||"未命名小说"}
小说类型：${(()=>{var w;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(w=k.value)==null?void 0:w.genre]||"通用小说"})()}
小说简介：${((o=k.value)==null?void 0:o.description)||"暂无简介"}

=== 当前章节信息 ===
章节标题：${U.value.title}
章节大纲：${U.value.description||"暂无大纲"}

=== 生成配置 ===
生成类型：${os(qe.value)}
写作视角：${Xt(g.style)}
重点内容：${g.focus||"按大纲发展"}

`;d.characters.length>0&&g.useCharacters&&(c+=`=== 主要人物设定 ===
${d.characters.map(_=>`- ${_.name}（${_.role}）：${_.personality||"暂无描述"}`).join(`
`)}

`),d.worldSettings.length>0&&g.useWorldview&&(c+=`=== 世界观设定 ===
${d.worldSettings.map(_=>`- ${_.title}：${_.description||"暂无描述"}`).join(`
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
2. 保持${Xt(g.style)}的叙述方式
3. 保持情节的连贯性和逻辑性
4. 符合章节大纲的发展方向
5. 根据生成类型重点突出：${is(qe.value)}
6. 突出重点：${g.focus||"按大纲推进剧情"}

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

请确保续写内容符合小说的整体风格、类型和世界观设定，与前文保持完美连贯性。`;const S=yield Xe.generateTextStream(c,{maxTokens:null,temperature:.8,type:"continue"},(_,w)=>{var V,ee;const T=Kt(w,"");E.value=T,((V=ge.value)==null?void 0:V.id)===((ee=U.value)==null?void 0:ee.id)&&(H.value=e+`
`+T,Ee.value=!0)});if(!S.trim())throw new Error("AI返回内容为空");const M=Kt(S,"");H.value=e+`
`+M,Ee.value=!0,m.success("续写完成"),setTimeout(()=>{kt(),Te()},1e3)}catch(d){console.error("AI续写失败:",d),m.error(`续写失败: ${d.message}`),H.value=e}finally{Ce.value=!1,L.value=!1,E.value="",ge.value=null}}),Ra=a=>oe(this,null,function*(){var e,i;if(de()){if(!D.value.name.trim()){m.warning("请先输入角色姓名");return}L.value=!0,se.value="character",E.value="",D.value.appearance="",D.value.personality="",D.value.background="",D.value.tags=[];try{console.log("使用自定义提示词生成人物:",a);const g=`=== 小说基本信息 ===
小说标题：${((e=k.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${(()=>{var _;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(_=k.value)==null?void 0:_.genre]||"通用小说"})()}
小说简介：${((i=k.value)==null?void 0:i.description)||"暂无简介"}

=== 角色基本设定 ===
- 姓名：${D.value.name}
- 角色定位：${D.value.role==="protagonist"?"主角":D.value.role==="antagonist"?"反派":"配角"}
- 性别：${D.value.gender==="male"?"男":D.value.gender==="female"?"女":"其他"}
- 年龄：${D.value.age}岁

=== 角色生成要求 ===
${a}

请确保角色设定符合小说的世界观、类型和风格特点。`+`

=== 重要格式要求 ===
无论上述提示词如何，你必须严格按照以下格式输出，不得有任何偏差：

外貌：[详细外貌描述]
性格：[性格特点描述]
背景：[背景故事]
标签：[标签1,标签2,标签3]

必须包含这4个字段，每个字段占一行。`;console.log("=== 自定义提示词角色生成最终提示词 ==="),console.log(g),console.log("=== 提示词结束 ===");const S=(yield Xe.generateTextStream(g,{maxTokens:null,temperature:.8,type:"character"},(M,_)=>{E.value=_;const w=_.split(`
`);for(const T of w){const V=T.trim();if(V.startsWith("外貌："))D.value.appearance=V.replace("外貌：","").trim();else if(V.startsWith("性格："))D.value.personality=V.replace("性格：","").trim();else if(V.startsWith("背景："))D.value.background=V.replace("背景：","").trim();else if(V.startsWith("标签：")){const ee=V.replace("标签：","").trim();ee&&(D.value.tags=ee.split(",").map(me=>me.trim()).filter(me=>me))}}})).split(`
`);for(const M of S){const _=M.trim();if(_.startsWith("外貌："))D.value.appearance=_.replace("外貌：","").trim();else if(_.startsWith("性格："))D.value.personality=_.replace("性格：","").trim();else if(_.startsWith("背景："))D.value.background=_.replace("背景：","").trim();else if(_.startsWith("标签：")){const w=_.replace("标签：","").trim();D.value.tags=w.split(",").map(T=>T.trim()).filter(T=>T)}}m.success("AI角色生成完成")}catch(o){console.error("AI生成角色失败:",o),m.error(`角色生成失败: ${o.message}`)}finally{L.value=!1,E.value=""}}}),Wa=()=>oe(this,null,function*(){var a,e;if(de()){Me.value=!0;try{const i=Le.value.title||"新章节",o=hl(),d=`=== 小说基本信息 ===
小说标题：${((a=k.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=k.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((e=k.value)==null?void 0:e.description)||"暂无简介"}

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
${I.value.map((c,S)=>`第${S+1}章：${c.title} - ${c.description||"暂无描述"}`).join(`
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

请生成详细的章节大纲：`;if(console.log("开始AI生成章节大纲:",d),!(yield Xe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"outline"},(c,S)=>{Le.value.description=S})).trim())throw new Error("AI返回内容为空");m.success("章节大纲生成成功")}catch(i){console.error("AI生成大纲失败:",i),m.error(`大纲生成失败: ${i.message}`)}finally{Me.value=!1}}}),Fa=()=>{var a;if(!((a=U.value)!=null&&a.description)){m.warning("请先为章节添加大纲描述");return}on(U.value)},Oa=()=>{if(!de())return;let a="";if(pe.value)try{a=pe.value.getSelectionText()||""}catch(e){console.warn("获取选择文本失败:",e),a=""}if(a.trim())K.value.originalContent=a.trim(),K.value.mode="selection",m.info("检测到选择内容，将优化选择的文本");else{const e=H.value.replace(/<[^>]*>/g,"").trim();if(!e){m.warning("当前章节没有内容可以优化");return}K.value.originalContent=e,K.value.mode="full",m.info("未检测到选择内容，将优化整篇文章")}X.value=!0},_n=he(()=>K.value.originalContent.trim()&&(K.value.selectedPrompt||K.value.customPrompt.trim())),ja=a=>{K.value.selectedPrompt=a,console.log("选择润色提示词:",a.title)},yn=he(()=>H.value.trim().length>=50),Ba=()=>{if(de()){if(!U.value){m.warning("请先选择一个章节");return}if(!H.value||H.value.trim().length<50){m.warning("请先写一些内容，AI将基于现有内容进行续写");return}at.value.direction="",at.value.wordCount=500,Oe.value="",$t.value=!1,B.value=!0}},qa=()=>H.value?H.value.replace(/<[^>]*>/g,"").trim():"",Na=()=>{at.value.direction="",at.value.wordCount=500,Oe.value="",$t.value=!1},La=()=>oe(this,null,function*(){var a,e;if(!yn.value){m.warning("内容太少，无法进行续写");return}$t.value=!0,Oe.value="";try{const i=hl(),o=H.value.replace(/<[^>]*>/g,"").trim();let d=`=== 小说基本信息 ===
小说标题：${((a=k.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${(()=>{var S;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(S=k.value)==null?void 0:S.genre]||"通用小说"})()}
小说简介：${((e=k.value)==null?void 0:e.description)||"暂无简介"}

=== 当前章节信息 ===
章节标题：${U.value.title}
章节大纲：${U.value.description||"暂无大纲"}

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
4. 续写长度约${at.value.wordCount}字`;at.value.direction.trim()&&(d+=`
5. 续写方向：${at.value.direction.trim()}`),d+=`

=== 核心约束（必须严格遵守） ===
1. 【连贯性】必须与已有内容在语言风格、情节发展、人物行为上完全连贯
2. 【一致性】人物性格、世界观设定、时间线必须与前文保持一致
3. 【逻辑性】情节发展必须符合逻辑，不能出现突兀的转折
4. 【主题控制】不得偏离章节大纲的主要情节线

请直接输出续写内容，无需额外说明：`,console.log("开始新的AI续写:",d.substring(0,200)+"...");const g=yield Xe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"continue"},(c,S)=>{Oe.value=S});if(!g.trim())throw new Error("AI返回内容为空");Oe.value=g.trim(),m.success("续写完成")}catch(i){console.error("AI续写失败:",i),m.error(`续写失败: ${i.message}`)}finally{$t.value=!1}}),Ga=()=>{$t.value=!1,m.info("已停止续写")},Ha=()=>oe(this,null,function*(){if(!Oe.value){m.warning("没有可复制的内容");return}try{yield navigator.clipboard.writeText(Oe.value),m.success("续写内容已复制到剪贴板")}catch(a){console.error("复制失败:",a),m.error("复制失败，请手动复制")}}),Xa=()=>{if(!Oe.value){m.warning("没有可追加的内容");return}const a=Kt(Oe.value,"");H.value=H.value+`
`+a,Ee.value=!0,m.success("续写内容已追加到文章"),B.value=!1,setTimeout(()=>{kt()},1e3)},Ka=()=>{K.value.optimizedContent="",K.value.customPrompt="",K.value.selectedPrompt=null,ht.value="",nt.value=!1},Ja=()=>oe(this,null,function*(){if(!_n.value){m.warning("请选择润色类型或输入自定义要求");return}nt.value=!0,ht.value="",K.value.optimizedContent="";try{let a="";K.value.selectedPrompt?a=K.value.selectedPrompt.content:K.value.customPrompt.trim()&&(a=K.value.customPrompt.trim());const e=`${a}

原始内容：
${K.value.originalContent}

请直接输出优化后的内容，无需额外说明：`;console.log("开始新的AI优化:",e.substring(0,200)+"...");const i=yield Xe.generateTextStream(e,{maxTokens:null,temperature:.7,type:"optimize"},(o,d)=>{ht.value=d});if(!i.trim())throw new Error("AI返回内容为空");K.value.optimizedContent=i.trim(),m.success("内容润色完成")}catch(a){console.error("AI润色失败:",a),m.error(`润色失败: ${a.message}`)}finally{nt.value=!1,ht.value=""}}),Ya=()=>{nt.value=!1,ht.value="",m.info("已停止润色")},Za=()=>oe(this,null,function*(){if(!K.value.optimizedContent){m.warning("没有可复制的内容");return}try{yield navigator.clipboard.writeText(K.value.optimizedContent),m.success("内容已复制到剪贴板")}catch(a){console.error("复制失败:",a),m.error("复制失败，请手动复制")}}),Qa=()=>{if(!K.value.optimizedContent){m.warning("没有可替换的内容");return}try{pe.value&&K.value.mode==="selection"?pe.value.getSelectionText()?(pe.value.insertText(K.value.optimizedContent),m.success("选择内容已替换为润色结果"),Ee.value=!0,X.value=!1,setTimeout(()=>{kt()},1e3)):m.warning("未找到选择的内容，请重新选择要替换的文本"):m.warning("当前不是选择模式或编辑器未就绪")}catch(a){console.error("替换失败:",a),m.error("替换失败")}},es=()=>{if(!K.value.optimizedContent){m.warning("没有可替换的内容");return}It.confirm("确定要用润色后的内容替换整篇文章吗？此操作不可撤销。","确认替换",{confirmButtonText:"确定替换",cancelButtonText:"取消",type:"warning"}).then(()=>{var e;const a=Kt(K.value.optimizedContent,((e=U.value)==null?void 0:e.title)||"");H.value=a,Ee.value=!0,m.success("全文内容已替换为润色结果"),X.value=!1,setTimeout(()=>{kt()},1e3)}).catch(()=>{})},Ul=a=>{console.log("原始AI响应:",a);const e=[()=>ts(a),()=>ls(a),()=>ns(a),()=>as(a),()=>ss(a)];for(const i of e){const o=i();if(o&&o.length>0)return console.log("解析成功，使用策略:",i.name,"，章节数:",o.length),o.forEach((d,g)=>{var c;return console.log(`第${g+1}章: ${d.title} - ${(c=d.description)==null?void 0:c.substring(0,50)}...`)}),o}return console.warn("所有解析策略都失败，创建默认章节"),[{title:"AI生成章节",description:a.substring(0,300)+(a.length>300?"...":"")}]},ts=a=>{console.log("策略1: 按章节号分割");const e=[],i=/章节(\d+)[：:\s]*[\r\n]/gi,o=[];let d;for(;(d=i.exec(a))!==null;)o.push({index:d.index,number:parseInt(d[1]),fullMatch:d[0]});if(console.log("找到章节标记:",o.length,"个"),o.length===0){const g=a.split(/章节\d+[：:]/i).filter(c=>c.trim());if(console.log("宽松匹配找到块数:",g.length),g.length<=1)return null;g.forEach((c,S)=>{if(S===0&&!c.includes("标题"))return;const M=c.split(`
`).filter(T=>T.trim());let _=`第${S}章`,w="";for(const T of M){const V=T.trim();V.match(/^标题[：:]/)?_=V.replace(/^标题[：:]/,"").trim():V.match(/^大纲[：:]/)?w=V.replace(/^大纲[：:]/,"").trim():w&&!V.match(/^(标题|大纲)/)?w+=`
`+V:!w&&!V.match(/^(标题|大纲)/)&&V.length>0&&(w=V)}_&&w&&e.push({title:_,description:w})})}else for(let g=0;g<o.length;g++){const c=o[g],S=o[g+1],M=c.index+c.fullMatch.length,_=S?S.index:a.length,w=a.substring(M,_).trim();console.log(`处理章节${c.number}:`,w.substring(0,100));const T=w.split(`
`).filter(me=>me.trim());let V=`第${c.number}章`,ee="";for(const me of T){const A=me.trim();A.match(/^标题[：:]/)?V=A.replace(/^标题[：:]/,"").trim():A.match(/^大纲[：:]/)?ee=A.replace(/^大纲[：:]/,"").trim():ee&&!A.match(/^(标题|大纲)/)?ee+=`
`+A:!ee&&!A.match(/^(标题|大纲)/)&&A.length>0&&(ee=A)}V&&ee&&(e.push({title:V,description:ee}),console.log(`成功解析章节${c.number}: ${V}`))}return console.log("策略1解析结果:",e.length,"个章节"),e.length>0?e:null},ls=a=>{const e=[],i=a.split(`
`);let o=null;for(const d of i){const g=d.trim();g.match(/^标题[：:]/)?(o&&o.title&&o.description&&e.push(o),o={title:g.replace(/^标题[：:]/,"").trim(),description:""}):g.match(/^大纲[：:]/)?o&&(o.description=g.replace(/^大纲[：:]/,"").trim()):o&&o.description&&g&&!g.match(/^(标题|大纲|章节)/)&&(o.description+=`
`+g)}return o&&o.title&&o.description&&e.push(o),e.length>0?e:null},ns=a=>{const e=[],i=/第\d+章[：:\s]*([^\n]+)/g;let o;const d=[];for(;(o=i.exec(a))!==null;)d.push({index:o.index,title:o[1].trim(),fullMatch:o[0]});if(d.length===0)return null;for(let g=0;g<d.length;g++){const c=d[g],S=d[g+1],M=c.index+c.fullMatch.length,_=S?S.index:a.length,w=a.substring(M,_).trim();w&&e.push({title:c.title,description:w})}return e.length>0?e:null},as=a=>{const e=a.split(/\n\s*\n/).filter(o=>o.trim());if(e.length<2)return null;const i=[];for(const o of e){const d=o.split(`
`).filter(S=>S.trim());if(d.length<2)continue;const g=d[0].trim(),c=d.slice(1).join(`
`).trim();g&&c&&g.length<100&&i.push({title:g,description:c})}return i.length>0?i:null},ss=a=>{const e=[],i=a.split(`
`).filter(g=>g.trim());let o="",d="";for(let g=0;g<i.length;g++){const c=i[g].trim();(c.length<50&&(c.includes("章")||c.includes("第")||c.match(/^\d+[\.\、]/))&&!c.includes("：")&&!c.includes(":")||(g===0||i[g-1].trim()==="")&&c.length<30&&c.length>3)&&d.length>20?(o&&d&&e.push({title:o,description:d.trim()}),o=c,d=""):o?d+=(d?`
`:"")+c:o=c}return o&&d&&e.push({title:o,description:d.trim()}),e.length>0?e:null},Ht=a=>({general:"通用章节模板，平衡叙述和对话",battle:"战斗场景模板，突出动作和紧张感",emotion:"情感戏模板，重点描写心理和情感",turning:"转折剧情模板，制造悬念和反转"})[a]||"通用模板",Wt=()=>{if(console.log("getRecentChaptersDetail 被调用，当前章节数量:",I.value.length),I.value.length===0)return console.log("返回：暂无已有章节"),"暂无已有章节";const a=Math.min(5,I.value.length),e=I.value.slice(-a);console.log("最近章节数量:",a,"章节详情:",e.map(o=>({title:o.title,description:o.description,wordCount:o.wordCount})));const i=e.map((o,d)=>{let c=`第${I.value.length-a+d+1}章《${o.title}》`;return o.description&&o.description.trim()?c+=`
章节大纲：${o.description}`:c+=`
章节大纲：暂无大纲描述`,o.wordCount&&o.wordCount>0&&(c+=`
字数：${o.wordCount}字`),c}).join(`

`);return console.log("最终返回的章节详情:",i),i},Xt=a=>({"first-person":"第一人称","third-person":"第三人称",omniscient:"全知视角"})[a]||"第三人称",os=a=>({content:"基础正文（标准章节内容生成）","content-dialogue":"对话生成（以对话为主的内容）","content-scene":"场景描写（环境氛围描写）","content-action":"动作情节（动作和冲突为主）","content-psychology":"心理描写（内心活动和情感）"})[a]||"基础正文",is=a=>({content:"平衡叙述、对话、心理描写、环境描写，创造完整的章节内容","content-dialogue":"重点突出人物对话，通过对话推进情节，展现人物性格和关系","content-scene":"详细描写环境、氛围、场景细节，营造身临其境的感觉","content-action":"重点描写动作场面、冲突情节，节奏紧凑，充满张力","content-psychology":"深入刻画人物内心活动、情感变化、心理冲突"})[a]||"平衡各种描写手法，创造丰富的内容",Kt=(a,e)=>{let i=a.trim();return i.includes(e)||(i=`<h3>${e}</h3>

${i}`),i.split(`
`).filter(g=>g.trim()).map(g=>{const c=g.trim();return c.startsWith("#")||c===e?`<h3>${c.replace(/^#+\s*/,"")}</h3>`:c.startsWith('"')||c.startsWith('"')||c.startsWith("「")?`<p class="dialogue">${c}</p>`:`<p>${c}</p>`}).join("")},hl=()=>{var i;const a=I.value.findIndex(o=>{var d;return o.id===((d=U.value)==null?void 0:d.id)}),e=I.value.slice(0,a);return{characters:Je.value,worldSettings:At.value,corpus:st.value,events:Qe.value,previousChapters:e,currentNovelInfo:k.value,totalChapters:I.value.length,currentChapterIndex:a+1,storyProgress:a/Math.max(I.value.length-1,1),recentEvents:Qe.value.filter(o=>o.chapter&&parseInt(o.chapter)<=a+1).slice(-3),activeCharacters:Je.value.filter(o=>o.role==="protagonist"||o.role==="antagonist"),storyTheme:((i=k.value)==null?void 0:i.genre)||"通用"}},El=()=>{D.value={id:null,name:"",role:"supporting",gender:"male",age:25,appearance:"",personality:"",background:"",tags:[],avatar:""},qt.value=!0},hn=a=>{D.value=je({},a),qt.value=!0},us=()=>{if(!D.value.name.trim()){m.warning("请输入角色姓名");return}if(D.value.id){const a=Je.value.findIndex(e=>e.id===D.value.id);a>-1&&(Je.value[a]=je({},D.value)),m.success("角色信息已更新")}else{const a=Mt(je({},D.value),{id:Date.now(),createdAt:new Date});Je.value.push(a),m.success("角色创建成功")}qt.value=!1,Te()},rs=()=>oe(this,null,function*(){var a,e;if(de()){if(!D.value.name.trim()){m.warning("请先输入角色姓名");return}L.value=!0,se.value="character",E.value="",D.value.appearance="",D.value.personality="",D.value.background="",D.value.tags=[];try{const d=`=== 小说基本信息 ===
小说标题：${((a=k.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${(()=>{var M;return{fantasy:"玄幻小说",urban:"都市言情",historical:"历史架空",martial:"武侠修仙",science:"科幻未来",romance:"现代言情",mystery:"悬疑推理",adventure:"冒险奇幻",horror:"恐怖惊悚",general:"通用小说"}[(M=k.value)==null?void 0:M.genre]||"通用小说"})()}
小说简介：${((e=k.value)==null?void 0:e.description)||"暂无简介"}

=== 角色生成任务 ===
你是一个专业的角色生成器。请为上述小说中的角色《${D.value.name}》生成详细信息。

【重要】必须严格按照以下格式输出，不要添加任何额外的解释或文字：

外貌：身高一米七五，黑发黑眼，面容清秀
性格：温和友善，聪明机智，有时略显内向
背景：出身书香门第，自幼受到良好教育，立志成为学者
标签：知识分子,温和,聪慧

请完全按照以上示例格式生成角色信息，必须包含：外貌、性格、背景、标签这4个字段。

=== 角色基本设定 ===
- 姓名：${D.value.name}
- 角色定位：${D.value.role==="protagonist"?"主角":D.value.role==="antagonist"?"反派":"配角"}
- 性别：${D.value.gender==="male"?"男":D.value.gender==="female"?"女":"其他"}
- 年龄：${D.value.age}岁

请确保角色设定符合小说的世界观、类型和风格特点。

开始生成：`+`

=== 重要格式要求 ===
无论上述提示词如何，你必须严格按照以下格式输出，不得有任何偏差：

外貌：[详细外貌描述]
性格：[性格特点描述]
背景：[背景故事]
标签：[标签1,标签2,标签3]

必须包含这4个字段，每个字段占一行。`;console.log("=== 单个角色生成最终提示词 ==="),console.log(d),console.log("=== 提示词结束 ===");const c=(yield Xe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"character"},(S,M)=>{E.value=M;const _=M.split(`
`);for(const w of _){const T=w.trim();if(T.startsWith("外貌："))D.value.appearance=T.replace("外貌：","").trim();else if(T.startsWith("性格："))D.value.personality=T.replace("性格：","").trim();else if(T.startsWith("背景："))D.value.background=T.replace("背景：","").trim();else if(T.startsWith("标签：")){const V=T.replace("标签：","").trim();V&&(D.value.tags=V.split(",").map(ee=>ee.trim()).filter(ee=>ee))}}})).split(`
`);for(const S of c){const M=S.trim();if(M.startsWith("外貌："))D.value.appearance=M.replace("外貌：","").trim();else if(M.startsWith("性格："))D.value.personality=M.replace("性格：","").trim();else if(M.startsWith("背景："))D.value.background=M.replace("背景：","").trim();else if(M.startsWith("标签：")){const _=M.replace("标签：","").trim();D.value.tags=_.split(",").map(w=>w.trim()).filter(w=>w)}}m.success("AI角色生成完成")}catch(i){console.error("AI生成角色失败:",i),m.error(`角色生成失败: ${i.message}`)}finally{L.value=!1,E.value=""}}}),wn=()=>{const a=rl.value.trim();a&&!D.value.tags.includes(a)&&(D.value.tags.push(a),rl.value="")},ds=a=>{D.value.tags.splice(a,1)},cs=(a,e)=>{switch(a){case"edit":hn(e);break;case"delete":vs(e);break}},vs=a=>{It.confirm(`确定要删除角色《${a.name}》吗？`,"确认删除",{type:"warning",confirmButtonText:"删除",cancelButtonText:"取消",confirmButtonClass:"el-button--danger"}).then(()=>{const e=Je.value.findIndex(i=>i.id===a.id);e>-1&&(Je.value.splice(e,1),m.success("角色已删除"),Te())}).catch(()=>{})},Rl=()=>{Ue.value={title:"",description:"",category:"setting",details:""},Nt.value=!0},Cn=a=>{Ue.value=je({},a),Nt.value=!0},ps=a=>{It.confirm(`确定要删除设定《${a.title}》吗？`,"确认删除",{type:"warning"}).then(()=>{Z.removeWorldSetting(a.id),m.success("设定已删除"),Te()}).catch(()=>{})},ms=(a,e)=>{switch(a){case"edit":Cn(e);break;case"duplicate":fs(e);break;case"delete":ps(e);break}},fs=a=>{const e=Mt(je({},a),{id:new Date().getTime(),title:a.title+" (副本)",createdAt:new Date,generated:!1});Z.addWorldSetting(e),m.success("设定已复制"),Te()},gs=a=>a?new Date(a).toLocaleDateString("zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}):"",Wl=()=>{ut.value={id:null,title:"",type:"description",content:"",tags:[]},Lt.value=!0},_s=a=>{ut.value=je({},a),Lt.value=!0},ys=a=>oe(this,null,function*(){try{yield It.confirm(`确定要删除语料"${a.title}"吗？`,"删除确认",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"});const e=st.value.findIndex(i=>i.id===a.id);e>-1&&(st.value.splice(e,1),m.success("语料删除成功"))}catch(e){}}),Fl=()=>{var a;Ge.value={id:null,title:"",description:"",chapter:((a=U.value)==null?void 0:a.title)||"",time:new Date().toISOString().slice(0,16),importance:"normal"},Gt.value=!0},hs=a=>{Ge.value=je({},a),Gt.value=!0},ws=()=>{if(!Ge.value.title.trim()){m.warning("请输入事件标题");return}if(Ge.value.id){const a=Qe.value.findIndex(e=>e.id===Ge.value.id);a>-1&&(Qe.value[a]=je({},Ge.value)),m.success("事件信息已更新")}else{const a=Mt(je({},Ge.value),{id:Date.now(),createdAt:new Date});Qe.value.push(a),m.success("事件创建成功")}Gt.value=!1,Te()},Cs=a=>{It.confirm(`确定要删除事件《${a.title}》吗？`,"确认删除",{type:"warning"}).then(()=>{const e=Qe.value.findIndex(i=>i.id===a.id);e>-1&&(Qe.value.splice(e,1),m.success("事件已删除"),Te())}).catch(()=>{})},$s=(a,e)=>{switch(a){case"edit":hs(e);break;case"delete":Cs(e);break}},ks=()=>{if(!U.value)return;const a=I.value.findIndex(e=>e.id===U.value.id);a>-1&&(I.value[a].status=U.value.status,I.value[a].updatedAt=new Date),kt(),Te(),m.success(`章节状态已更新为：${vl(U.value.status)}`)},bs=()=>{if(!Ue.value.title.trim()){m.warning("请输入设定标题");return}if(Ue.value.id)Z.updateWorldSetting(Ue.value.id,Ue.value),m.success("设定信息已更新");else{const a=Mt(je({id:new Date().getTime()},Ue.value),{createdAt:new Date});Z.addWorldSetting(a),m.success("设定创建成功")}Nt.value=!1,Te()},Vs=()=>{if(!ut.value.title.trim()){m.warning("请输入语料标题");return}if(ut.value.id){const a=st.value.findIndex(e=>e.id===ut.value.id);a>-1&&(st.value[a]=je({},ut.value)),m.success("语料信息已更新")}else{const a=Mt(je({},ut.value),{id:Date.now(),createdAt:new Date});st.value.push(a),m.success("语料创建成功")}Lt.value=!1,Te()};let ll=null;const xs=()=>{ll&&clearTimeout(ll),ll=setTimeout(()=>{Ss()},2e3)},Ss=()=>{U.value&&(ve.value=!0,setTimeout(()=>{kt(),ve.value=!1},300))},Te=()=>{if(!k.value)return;const a=I.value.reduce((d,g)=>d+(g.wordCount||0),0),e=Mt(je({},k.value),{chapterList:I.value,characters:Je.value,worldSettings:Z.worldSettings,corpusData:st.value,events:Qe.value,updatedAt:new Date,wordCount:a,chapters:I.value.length,totalWords:a}),i=JSON.parse(localStorage.getItem("novels")||"[]"),o=i.findIndex(d=>d.id===k.value.id);o>-1?i[o]=e:i.push(e),localStorage.setItem("novels",JSON.stringify(i))},$n=()=>{const a=parseInt(fe.query.novelId);if(a){const i=JSON.parse(localStorage.getItem("novels")||"[]").find(o=>o.id===a);i?(k.value=i,i.chapterList&&(I.value=i.chapterList.map(o=>{let d=o.status||"draft";return d==="outline"&&(d="draft"),Mt(je({},o),{createdAt:new Date(o.createdAt),updatedAt:new Date(o.updatedAt),status:d})}),I.value.length>0&&cl(I.value[0]),Te()),Je.value=i.characters||[],Z.worldSettings.splice(0,Z.worldSettings.length),i.worldSettings&&i.worldSettings.length>0&&i.worldSettings.forEach(o=>{Z.worldSettings.push(o)}),st.value=i.corpusData||[],Qe.value=i.events||[]):(m.error("小说不存在"),N.push("/novels"))}else m.error("缺少小说ID参数"),N.push("/novels")};bl(()=>{$n(),Zn()}),Rn(()=>{ll&&clearTimeout(ll),kt(),pe.value&&pe.value.destroy()}),Ut(()=>fe.query.novelId,()=>{fe.query.novelId&&(U.value=null,H.value="",$n())});const zs=()=>{re.value="character",_e.value=!0,J.value=null,C.value={},R.value=""},Is=()=>{St.value=null,Bt.value={},gt.value=""},Ts=()=>{re.value="worldview",_e.value=!0,J.value=null,C.value={},R.value=""},As=()=>{vt.value=null,tt.value={},yt.value=""},kn=()=>{var e,i,o;if(!vt.value)return;tt.value.小说标题=((e=k.value)==null?void 0:e.title)||"未命名小说",tt.value.小说类型=zt((i=k.value)==null?void 0:i.genre),tt.value.小说简介=((o=k.value)==null?void 0:o.description)||"暂无简介",tt.value.生成数量=W.value.count.toString();const a=[];W.value.includeGeography&&a.push("地理环境"),W.value.includeCulture&&a.push("文化社会"),W.value.includeHistory&&a.push("历史背景"),W.value.includeMagic&&a.push("魔法体系"),W.value.includeTechnology&&a.push("科技水平"),W.value.includePolitics&&a.push("政治势力"),W.value.includeReligion&&a.push("宗教信仰"),W.value.includeEconomy&&a.push("经济贸易"),W.value.includeRaces&&a.push("种族设定"),W.value.includeLanguage&&a.push("语言文字"),tt.value.设定类型=a.join("、"),tt.value.特殊要求=W.value.customPrompt||"符合小说世界观设定",Ps()},Ps=()=>{if(!vt.value){yt.value="";return}let a=vt.value.content;Object.keys(tt.value).forEach(e=>{const i=tt.value[e]||`{${e}}`;a=a.replace(new RegExp(`\\{${e}\\}`,"g"),i)}),yt.value=a},Ms=()=>{Y.value={characters:[],worldSettings:[],corpus:[],events:[],chapters:[]},ce.value=[],C.value.前文概要&&(C.value.前文概要="",rt()),m.success("已清空所有选择")},wl=a=>{switch(a){case"characters":Y.value.characters=[...Je.value];break;case"worldSettings":Y.value.worldSettings=[...At.value];break;case"corpus":Y.value.corpus=[...st.value];break;case"events":Y.value.events=[...Qe.value];break;case"chapters":Y.value.chapters=[...ca.value];break}const e=a==="characters"?"人物":a==="worldSettings"?"世界观":a==="corpus"?"语料":a==="events"?"事件线":a==="chapters"?"章节":"素材";m.success(`已选择所有${e}`)},Ds=()=>{J.value=null,C.value={},R.value="",m.info("已切换到默认提示词")},Us=()=>{m.success("提示词列表已刷新")},Es=()=>{N.push("/prompts-library")},Rs=()=>{R.value&&(navigator.clipboard.writeText(R.value),m.success("提示词已复制到剪贴板"))},Ws=()=>{m.info("您可以直接在预览框中编辑提示词")},bn=()=>oe(this,null,function*(){if(!J.value){m.warning("请先选择提示词模板");return}if(!U.value){m.warning("请先选择要生成内容的章节");return}if(de()){Ce.value=!0,Ze.value=!1;try{yield mn(R.value)}catch(a){console.error("生成失败:",a),m.error("生成失败: "+a.message)}finally{Ce.value=!1}}}),Fs=()=>{b.value={title:"",plotRequirement:"",template:"general"},pt.value=!0},Os=()=>{f.value={count:3,plotRequirement:"",template:"general"},Fe.value=!0},js=()=>{b.value={title:"",plotRequirement:"",template:"general"},it.value=null,Pe.value={},ze.value="",E.value="",L.value=!1},Bs=()=>{f.value={count:3,plotRequirement:"",template:"general"},$.value=null,x.value={},Ve.value="",lt.value=["promptContent"],E.value="",L.value=!1},qs=()=>{ae.value={optimizeType:"grammar",customRequirement:"",originalContent:"",optimizedContent:""},E.value="",L.value=!1},Ns=()=>oe(this,null,function*(){var a,e,i;if(de()){if(!b.value.title.trim()){m.warning("请输入章节标题");return}ke.value=!0,L.value=!0,se.value="single-chapter",E.value="";try{if(it.value&&ze.value){console.log("使用自定义提示词生成单章"),yield Ks(ze.value);return}const o=`=== 小说基本信息 ===
小说标题：${((a=k.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${zt((e=k.value)==null?void 0:e.genre)}
小说简介：${((i=k.value)==null?void 0:i.description)||"暂无简介"}

=== 单章生成任务 ===
【重要提醒】：请只生成一个章节的大纲，不要生成多个章节！

目标章节信息：
- 章节标题：${b.value.title}
- 情节要求：${b.value.plotRequirement||"请根据章节标题合理发展"}
- 模板类型：${Ht(b.value.template)}
- 章节序号：第${I.value.length+1}章

已有章节概况：
${I.value.map((c,S)=>`第${S+1}章：${c.title} - ${c.description||"暂无描述"}`).join(`
`)}

【核心要求】：
1. 只生成一个章节（第${I.value.length+1}章）的详细大纲
2. 使用用户指定的章节标题：${b.value.title}
3. 严格遵循用户的情节要求：${b.value.plotRequirement||"按章节标题合理发展"}
4. 与前文保持逻辑连贯性，推进主线剧情发展
5. 包含具体的情节要点、人物发展、重要事件等
6. 不要生成多个章节，只生成一个章节的内容

请严格按照以下格式返回（只返回一个章节）：
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]`;console.log("开始AI生成单章大纲:",o);const d=yield Xe.generateTextStream(o,{maxTokens:null,temperature:.8,type:"outline"},(c,S)=>{E.value=S});if(!d.trim())throw new Error("AI返回内容为空");const g={id:Date.now(),title:b.value.title,description:d.replace(/^大纲：/,"").trim(),content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};I.value.push(g),pt.value=!1,m.success("单章大纲生成成功"),Te()}catch(o){console.error("AI生成单章失败:",o),m.error(`单章生成失败: ${o.message}`)}finally{ke.value=!1,L.value=!1,E.value=""}}}),Ls=()=>oe(this,null,function*(){var a,e,i;if(de()){if(console.log("开始批量生成章节"),console.log("当前章节列表:",I.value.map(o=>({title:o.title,description:o.description}))),$.value&&Ve.value){console.log("使用自定义提示词生成"),yield Zs(Ve.value);return}console.log("使用默认模板生成"),ke.value=!0,L.value=!0,se.value="batch-chapters",E.value="";try{const o=f.value.count,d=f.value.plotRequirement,g=f.value.template;console.log("批量生成章节配置检查:",{count:o,plotRequirement:d,template:g,formData:f.value});const c=[];for(let w=1;w<=o;w++)c.push(`章节${w}：
标题：[章节标题]
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]`);const S=`=== 小说基本信息 ===
小说标题：${((a=k.value)==null?void 0:a.title)||"未命名小说"}
小说类型：${zt((e=k.value)==null?void 0:e.genre)}
小说简介：${((i=k.value)==null?void 0:i.description)||"暂无简介"}

=== 章节生成任务 ===
请为上述小说生成${o}个章节大纲。

【用户具体要求】：
- 生成章节数量：${o}个章节（不多不少）
- 用户情节要求：${d||"请根据小说主题合理发展"}
- 模板类型：${Ht(g)}
- 每个章节包含：标题、详细大纲描述
- 章节之间要有逻辑连贯性
- 严格遵循用户的情节要求，围绕用户指定的情节发展

已有章节：${I.value.length}个

=== 前文章节信息（重要参考） ===
${Wt()}

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

请现在开始生成${o}个章节大纲：`;console.log("批量生成章节最终提示词:",S),console.log("请求生成章节数量:",o),console.log("前5章详细信息:",Wt());const M=yield Xe.generateTextStream(S,{maxTokens:null,temperature:.8,type:"outline"},(w,T)=>{E.value=T});if(!M.trim())throw new Error("AI返回内容为空");console.log("AI响应长度:",M.length),console.log("AI响应内容:",M);const _=Ul(M);console.log("解析结果:",_),console.log("期望生成数量:",o,"实际解析数量:",_.length),_.length!==o&&(console.warn(`警告：期望生成${o}个章节，但实际解析出${_.length}个章节`),m.warning(`期望生成${o}个章节，但实际解析出${_.length}个章节`)),_.forEach((w,T)=>{const V={id:Date.now()+T,title:w.title||`AI生成章节 ${I.value.length+T+1}`,description:w.description||w.outline||"暂无描述",content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};I.value.push(V),console.log(`添加章节 ${T+1}:`,V.title)}),Fe.value=!1,m.success(`成功生成${_.length}个章节大纲`),Te()}catch(o){console.error("AI批量生成章节失败:",o),m.error(`批量生成失败: ${o.message}`)}finally{ke.value=!1,L.value=!1,E.value=""}}}),Gs=()=>oe(this,null,function*(){if(de()){if(!ae.value.originalContent.trim()){m.warning("请输入需要优化的内容");return}be.value=!0,L.value=!0,se.value="optimize",E.value="",ae.value.optimizedContent="";try{let a="";switch(ae.value.optimizeType){case"grammar":a="请对以下文本进行语法润色，修正语法错误，提升表达流畅度";break;case"style":a="请对以下文本进行文风优化，提升文学性和可读性";break;case"emotion":a="请对以下文本进行情感增强，加强情感表达和感染力";break;case"logic":a="请对以下文本进行逻辑梳理，优化结构和逻辑关系";break;case"custom":a=ae.value.customRequirement||"请对以下文本进行优化";break}const e=`${a}：

原始内容：
${ae.value.originalContent}

要求：
1. 保持原意不变
2. 优化表达方式
3. 提升整体质量
4. 直接输出优化后的内容，无需说明

优化后内容：`;console.log("开始AI优化内容:",e);const i=yield Xe.generateTextStream(e,{maxTokens:null,temperature:.7,type:"optimize"},(o,d)=>{E.value=d,ae.value.optimizedContent=d});if(!i.trim())throw new Error("AI返回内容为空");ae.value.optimizedContent=i,m.success("内容优化完成")}catch(a){console.error("AI优化失败:",a),m.error(`优化失败: ${a.message}`)}finally{be.value=!1,L.value=!1,E.value=""}}}),Hs=()=>{U.value&&ae.value.optimizedContent?(U.value.content=ae.value.optimizedContent,H.value=ae.value.optimizedContent,Ee.value=!0,Ct.value=!1,m.success("优化内容已应用到当前章节")):m.warning("无法应用优化内容")},Xs=()=>{re.value="outline",_e.value=!0},Ks=a=>oe(this,null,function*(){var e,i,o;if(de()){ke.value=!0,L.value=!0,se.value="single-chapter",E.value="";try{const d=`=== 用户输入信息 ===
章节标题：${b.value.title}
情节要求：${b.value.plotRequirement||"请根据章节标题合理发展"}
模板类型：${Ht(b.value.template)}

=== 小说基本信息 ===
小说标题：${((e=k.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${zt((i=k.value)==null?void 0:i.genre)}
小说简介：${((o=k.value)==null?void 0:o.description)||"暂无简介"}

=== 已有章节概况 ===
${I.value.map((S,M)=>`第${M+1}章：${S.title} - ${S.description||"暂无描述"}`).join(`
`)}

=== 基于以上信息，请按照以下要求生成章节 ===
${a}

=== 重要约束 ===
【关键】：请只生成一个章节的大纲，不要生成多个章节！

1. 只生成一个章节（第${I.value.length+1}章）的详细大纲
2. 必须使用用户指定的章节标题：${b.value.title}
3. 必须遵循用户的情节要求：${b.value.plotRequirement||"按章节标题合理发展"}
4. 与已有章节保持逻辑连贯性，推进主线剧情发展
5. 包含具体的情节要点、人物发展、重要事件等
6. 不要生成多个章节，无论提示词中是否提到"10章"等内容，都只生成一个章节

请严格按照以下格式返回（只返回一个章节）：
大纲：[详细的章节内容描述，包含主要情节、人物发展、重要事件等]`;console.log("使用自定义提示词生成单章:",d.substring(0,300)+"...");const g=yield Xe.generateTextStream(d,{maxTokens:null,temperature:.8,type:"outline"},(S,M)=>{E.value=M});if(!g.trim())throw new Error("AI返回内容为空");const c={id:Date.now(),title:b.value.title,description:g.replace(/^大纲：/,"").trim(),content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};I.value.push(c),pt.value=!1,m.success("使用自定义提示词生成单章成功"),Te()}catch(d){console.error("使用自定义提示词生成单章失败:",d),m.error(`单章生成失败: ${d.message}`)}finally{ke.value=!1,L.value=!1,E.value=""}}}),Js=()=>{console.log("打开批量章节提示词选择对话框"),console.log("当前章节数量:",I.value.length),console.log("当前章节列表:",I.value.map(a=>({title:a.title,description:a.description}))),re.value="outline",_e.value=!0,Zt(()=>{J.value&&(console.log("nextTick中调用autoFillBatchChapterVariables"),nl())})},nl=()=>{var e,i,o;if(!J.value){console.log("autoFillBatchChapterVariables: 没有选中的提示词");return}console.log("开始自动填充批量章节变量"),C.value.小说标题=((e=k.value)==null?void 0:e.title)||"未命名小说",C.value.小说类型=zt((i=k.value)==null?void 0:i.genre),C.value.小说简介=((o=k.value)==null?void 0:o.description)||"暂无简介",C.value.生成章节数量=f.value.count.toString(),C.value.情节要求=f.value.plotRequirement||"请根据小说主题合理发展",C.value.模板类型=Ht(f.value.template);const a=Wt();C.value.已有章节=a,console.log("批量章节变量填充完成:",{小说标题:C.value.小说标题,已有章节:a.substring(0,200)+"...",变量数量:Object.keys(C.value).length}),rt()},Ol=()=>{var e,i,o;if(!J.value){console.log("autoFillSingleChapterVariables: 没有选中的提示词");return}console.log("开始自动填充单章变量"),C.value.小说标题=((e=k.value)==null?void 0:e.title)||"未命名小说",C.value.小说类型=zt((i=k.value)==null?void 0:i.genre),C.value.小说简介=((o=k.value)==null?void 0:o.description)||"暂无简介",C.value.章节标题=b.value.title||"",C.value.情节要求=b.value.plotRequirement||"请根据章节标题合理发展",C.value.模板类型=Ht(b.value.template);const a=Wt();C.value.已有章节=a,console.log("单章变量填充完成:",{小说标题:C.value.小说标题,章节标题:C.value.章节标题,情节要求:C.value.情节要求,变量数量:Object.keys(C.value).length}),rt()};Ut(()=>f.value,()=>{Fe.value&&J.value&&re.value==="outline"&&(console.log("批量章节表单变化，重新填充提示词变量"),nl())},{deep:!0}),Ut(()=>b.value,()=>{pt.value&&J.value&&re.value==="outline"&&(console.log("单章表单变化，重新填充提示词变量"),Ol())},{deep:!0});const Ys=()=>{re.value="optimize",_e.value=!0},Zs=a=>oe(this,null,function*(){var e,i,o;if(de()){ke.value=!0,L.value=!0,se.value="batch-chapters",E.value="";try{const d=f.value.count,g=f.value.plotRequirement,c=f.value.template;console.log("使用自定义提示词批量生成章节配置检查:",{count:d,plotRequirement:g,template:c,customPrompt:a.substring(0,200)+"..."}),console.log("使用自定义提示词:",{原始提示词长度:a.length,是否包含已有章节:a.includes("已有章节"),前5章详细信息:Wt().substring(0,300)+"..."});const S=Wt(),M=`=== 用户输入信息 ===
生成数量：${d}个章节
用户情节要求：${g||"请根据小说主题合理发展"}
模板类型：${Ht(c)}

=== 小说基本信息 ===
小说标题：${((e=k.value)==null?void 0:e.title)||"未命名小说"}
小说类型：${zt((i=k.value)==null?void 0:i.genre)}
小说简介：${((o=k.value)==null?void 0:o.description)||"暂无简介"}

=== 前文章节信息（重要参考） ===
${S}

=== 基于以上信息，请按照以下要求生成新章节 ===
${a}`;console.log("添加前5章信息后的提示词长度:",M.length),console.log("确认包含章节信息:",M.includes("第")&&M.includes("章"));const _=`${M}

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
9. 严格遵循用户的情节要求：${g||"请根据小说主题合理发展"}

请现在开始生成${d}个章节大纲：`;console.log("使用自定义提示词批量生成 - 最终提示词:"),console.log("==================== 完整提示词开始 ===================="),console.log(_),console.log("==================== 完整提示词结束 ===================="),console.log("请求生成章节数量:",d),console.log("前5章详细信息:",Wt());const w=yield Xe.generateTextStream(_,{maxTokens:null,temperature:.8,type:"outline"},(V,ee)=>{E.value=ee});if(!w.trim())throw new Error("AI返回内容为空");console.log("AI响应长度:",w.length),console.log("AI响应内容:",w);const T=Ul(w);console.log("解析结果:",T),console.log("期望生成数量:",d,"实际解析数量:",T.length),T.length!==d&&(console.warn(`警告：期望生成${d}个章节，但实际解析出${T.length}个章节`),m.warning(`期望生成${d}个章节，但实际解析出${T.length}个章节`)),T.forEach((V,ee)=>{const me={id:Date.now()+ee,title:V.title||`AI生成章节 ${I.value.length+ee+1}`,description:V.description||V.outline||"暂无描述",content:"",wordCount:0,createdAt:new Date,updatedAt:new Date,status:"draft"};I.value.push(me),console.log(`添加章节 ${ee+1}:`,me.title)}),Fe.value=!1,m.success(`成功使用自定义提示词生成${T.length}个章节大纲`),Te()}catch(d){console.error("AI批量生成章节失败:",d),m.error(`批量生成失败: ${d.message}`)}finally{ke.value=!1,L.value=!1,E.value=""}}});return(a,e)=>{var Sn;const i=xl,o=Vl,d=mo,g=ro,c=fo,S=go,M=_o,_=yo,w=ho,T=co,V=Jl,ee=Yl,me=wo,A=Xl,F=Kl,bt=Hl,ot=Pn,wt=Dn,jl=Gl,al=Co,Ye=$o,Pt=ko,dt=bo,Vn=Vo,Qs=xo,eo=So,xn=zo,to=Zl;return r(),y("div",lu,[n("div",nu,[n("div",au,[t(o,{onClick:Bn,size:"small"},{default:l(()=>[t(i,null,{default:l(()=>[t(P(il))]),_:1}),e[111]||(e[111]=u(" 返回列表 "))]),_:1,__:[111]}),n("span",su,v(((Sn=k.value)==null?void 0:Sn.title)||"小说编辑"),1)])]),n("div",ou,[t(g,{modelValue:ue.value,"onUpdate:modelValue":e[0]||(e[0]=s=>ue.value=s),class:"main-tabs"},{default:l(()=>[t(d,{label:"📝 编辑",name:"editor"}),t(d,{label:"👥 人物",name:"characters"}),t(d,{label:"🌍 世界观",name:"worldview"}),t(d,{label:"📚 语料库",name:"corpus"}),t(d,{label:"📊 事件线",name:"events"})]),_:1},8,["modelValue"])]),n("div",iu,[n("div",uu,[mt(n("div",ru,[t(T,{shadow:"never",class:"chapters-card"},{header:l(()=>[n("div",du,[e[116]||(e[116]=n("span",null,"📝 章节列表",-1)),t(M,{onCommand:Xn},{dropdown:l(()=>[t(S,null,{default:l(()=>[t(c,{command:"manual"},{default:l(()=>e[113]||(e[113]=[u("手动创建")])),_:1,__:[113]}),t(c,{command:"ai-single"},{default:l(()=>e[114]||(e[114]=[u("AI生成单章")])),_:1,__:[114]}),t(c,{command:"ai-batch"},{default:l(()=>e[115]||(e[115]=[u("AI批量生成")])),_:1,__:[115]})]),_:1})]),default:l(()=>[t(o,{size:"small",type:"primary"},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Yt))]),_:1}),e[112]||(e[112]=u(" 新增章节 ")),t(i,null,{default:l(()=>[t(P(vo))]),_:1})]),_:1,__:[112]})]),_:1})])]),default:l(()=>[n("div",cu,[(r(!0),y(te,null,le(I.value,(s,O)=>{var G;return r(),y("div",{key:s.id,class:we(["chapter-item",{active:((G=U.value)==null?void 0:G.id)===s.id}]),onClick:He=>cl(s)},[n("div",pu,[n("h4",null,"第"+v(O+1)+"章",1),n("p",null,v(s.title),1),n("div",mu,[n("span",null,v(s.wordCount||0)+"字",1),s.status?(r(),j(_,{key:0,type:Il(s.status),size:"small"},{default:l(()=>[u(v(vl(s.status)),1)]),_:2},1032,["type"])):z("",!0)]),s.description?(r(),j(w,{key:0,content:s.description,placement:"top-start",disabled:s.description.length<=50,effect:"light","show-after":300},{default:l(()=>[n("p",fu,v(s.description.length>50?s.description.substring(0,50)+"...":s.description),1)]),_:2},1032,["content","disabled"])):z("",!0)]),n("div",gu,[t(M,{onCommand:He=>Kn(He,s)},{dropdown:l(()=>[t(S,null,{default:l(()=>[t(c,{command:"edit"},{default:l(()=>e[117]||(e[117]=[u("编辑信息")])),_:1,__:[117]}),t(c,{command:"generate"},{default:l(()=>e[118]||(e[118]=[u("AI生成正文")])),_:1,__:[118]}),t(c,{divided:"",command:"delete"},{default:l(()=>e[119]||(e[119]=[u("删除")])),_:1,__:[119]})]),_:1})]),default:l(()=>[t(o,{size:"small",type:"text"},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Cl))]),_:1})]),_:1})]),_:2},1032,["onCommand"])])],10,vu)}),128)),I.value.length===0?(r(),y("div",_u,[e[121]||(e[121]=n("p",null,"暂无章节",-1)),t(o,{size:"small",type:"primary",onClick:zl},{default:l(()=>e[120]||(e[120]=[u(" 创建第一章 ")])),_:1,__:[120]})])):z("",!0)])]),_:1})],512),[[xt,ue.value==="editor"]]),mt(n("div",yu,[t(T,{shadow:"never"},{header:l(()=>[n("div",hu,[e[124]||(e[124]=n("span",null,"👥 人物角色",-1)),n("div",wu,[t(o,{size:"small",type:"primary",onClick:El},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Yt))]),_:1}),e[122]||(e[122]=u(" 新增 "))]),_:1,__:[122]}),t(o,{size:"small",type:"success",onClick:fa},{default:l(()=>e[123]||(e[123]=[u(" 🤖 AI批量生成 ")])),_:1,__:[123]})])])]),default:l(()=>[n("div",Cu,[(r(!0),y(te,null,le(Je.value,s=>{var O;return r(),y("div",{key:s.id,class:"character-item"},[n("div",{class:"character-content",onClick:G=>hn(s)},[n("div",ku,[s.avatar?(r(),y("img",{key:0,src:s.avatar},null,8,bu)):(r(),y("div",Vu,v(((O=s.name)==null?void 0:O.charAt(0))||"？"),1))]),n("div",xu,[n("h4",null,v(s.name),1),n("div",Su,[t(_,{type:Al(s.role),size:"small"},{default:l(()=>[u(v(Pl(s.role)),1)]),_:2},1032,["type"]),s.gender?(r(),j(_,{key:0,type:"info",size:"small"},{default:l(()=>[u(v(cn(s.gender)),1)]),_:2},1024)):z("",!0),s.age?(r(),y("span",zu,v(s.age)+"岁",1)):z("",!0)]),s.personality?(r(),j(w,{key:0,content:s.personality,placement:"right",disabled:s.personality.length<=60,effect:"light","show-after":300},{default:l(()=>[n("p",Iu,v(s.personality.length>60?s.personality.substring(0,60)+"...":s.personality),1)]),_:2},1032,["content","disabled"])):z("",!0),s.tags&&s.tags.length?(r(),y("div",Tu,[(r(!0),y(te,null,le(s.tags,G=>(r(),j(_,{key:G,size:"small"},{default:l(()=>[u(v(G),1)]),_:2},1024))),128))])):z("",!0)])],8,$u),n("div",Au,[t(M,{onCommand:G=>cs(G,s),trigger:"click"},{dropdown:l(()=>[t(S,null,{default:l(()=>[t(c,{command:"edit"},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Bl))]),_:1}),e[125]||(e[125]=u(" 编辑 "))]),_:1,__:[125]}),t(c,{command:"delete",divided:""},{default:l(()=>[t(i,null,{default:l(()=>[t(P(ql))]),_:1}),e[126]||(e[126]=u(" 删除 "))]),_:1,__:[126]})]),_:1})]),default:l(()=>[t(o,{size:"small",type:"text",onClick:e[1]||(e[1]=Ll(()=>{},["stop"]))},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Cl))]),_:1})]),_:1})]),_:2},1032,["onCommand"])])])}),128)),Je.value.length===0?(r(),y("div",Pu,[e[128]||(e[128]=n("p",null,"暂无人物设定",-1)),t(o,{size:"small",onClick:El},{default:l(()=>e[127]||(e[127]=[u("创建第一个角色")])),_:1,__:[127]})])):z("",!0)])]),_:1})],512),[[xt,ue.value==="characters"]]),mt(n("div",Mu,[t(T,{shadow:"never"},{header:l(()=>[n("div",Du,[e[131]||(e[131]=n("span",null,"🌍 世界观设定",-1)),n("div",Uu,[t(o,{size:"small",type:"primary",onClick:Rl},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Yt))]),_:1}),e[129]||(e[129]=u(" 新增 "))]),_:1,__:[129]}),t(o,{size:"small",type:"success",onClick:ha},{default:l(()=>e[130]||(e[130]=[u(" 🤖 AI生成 ")])),_:1,__:[130]})])])]),default:l(()=>[n("div",Eu,[(r(!0),y(te,null,le(At.value,s=>(r(),y("div",{key:s.id,class:"worldview-item"},[n("div",{class:"worldview-content",onClick:O=>Cn(s)},[n("div",Wu,[n("h4",null,v(s.title),1),t(_,{type:oa(s.category)},{default:l(()=>[u(v(ia(s.category)),1)]),_:2},1032,["type"])]),s.description?(r(),j(w,{key:0,content:s.description,placement:"right",disabled:s.description.length<=80,effect:"light","show-after":300},{default:l(()=>[n("p",Fu,v(s.description.length>80?s.description.substring(0,80)+"...":s.description),1)]),_:2},1032,["content","disabled"])):(r(),y("p",Ou,"暂无描述")),n("div",ju,[n("span",Bu,v(gs(s.createdAt)),1),s.generated?(r(),y("span",qu,"AI生成")):z("",!0)])],8,Ru),n("div",Nu,[t(M,{onCommand:O=>ms(O,s),trigger:"click"},{dropdown:l(()=>[t(S,null,{default:l(()=>[t(c,{command:"edit"},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Bl))]),_:1}),e[132]||(e[132]=u(" 编辑 "))]),_:1,__:[132]}),t(c,{command:"duplicate"},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Nl))]),_:1}),e[133]||(e[133]=u(" 复制 "))]),_:1,__:[133]}),t(c,{command:"delete",divided:""},{default:l(()=>[t(i,null,{default:l(()=>[t(P(ql))]),_:1}),e[134]||(e[134]=u(" 删除 "))]),_:1,__:[134]})]),_:1})]),default:l(()=>[t(o,{size:"small",type:"text",onClick:e[2]||(e[2]=Ll(()=>{},["stop"]))},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Cl))]),_:1})]),_:1})]),_:2},1032,["onCommand"])])]))),128)),At.value.length===0?(r(),y("div",Lu,[e[136]||(e[136]=n("p",null,"暂无世界观设定",-1)),t(o,{size:"small",onClick:Rl},{default:l(()=>e[135]||(e[135]=[u("创建第一个设定")])),_:1,__:[135]})])):z("",!0)])]),_:1})],512),[[xt,ue.value==="worldview"]]),mt(n("div",Gu,[t(T,{shadow:"never"},{header:l(()=>[n("div",Hu,[e[138]||(e[138]=n("span",null,"📚 语料库",-1)),t(o,{size:"small",type:"primary",onClick:Wl},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Yt))]),_:1}),e[137]||(e[137]=u(" 新增 "))]),_:1,__:[137]})])]),default:l(()=>[n("div",Xu,[(r(!0),y(te,null,le(st.value,s=>(r(),y("div",{key:s.id,class:"corpus-item"},[n("div",Ku,[n("div",Ju,[n("h4",null,v(s.title),1),t(_,{type:ua(s.type)},{default:l(()=>[u(v(ra(s.type)),1)]),_:2},1032,["type"])]),t(w,{content:s.content,placement:"right",disabled:s.content.length<=100,effect:"light","show-after":300},{default:l(()=>[n("p",Yu,v(s.content.length>100?s.content.substring(0,100)+"...":s.content),1)]),_:2},1032,["content","disabled"])]),n("div",Zu,[t(o,{size:"small",onClick:O=>_s(s)},{default:l(()=>e[139]||(e[139]=[u("编辑")])),_:2,__:[139]},1032,["onClick"]),t(o,{size:"small",type:"danger",onClick:O=>ys(s)},{default:l(()=>e[140]||(e[140]=[u("删除")])),_:2,__:[140]},1032,["onClick"])])]))),128)),st.value.length===0?(r(),y("div",Qu,[e[142]||(e[142]=n("p",null,"暂无语料数据",-1)),t(o,{size:"small",onClick:Wl},{default:l(()=>e[141]||(e[141]=[u("添加第一个语料")])),_:1,__:[141]})])):z("",!0)])]),_:1})],512),[[xt,ue.value==="corpus"]]),mt(n("div",er,[t(T,{shadow:"never"},{header:l(()=>[n("div",tr,[e[144]||(e[144]=n("span",null,"📊 事件时间线",-1)),t(o,{size:"small",type:"primary",onClick:Fl},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Yt))]),_:1}),e[143]||(e[143]=u(" 新增 "))]),_:1,__:[143]})])]),default:l(()=>[n("div",lr,[(r(!0),y(te,null,le(Qe.value,s=>(r(),y("div",{key:s.id,class:"event-item"},[e[147]||(e[147]=n("div",{class:"event-marker"},null,-1)),n("div",nr,[n("div",ar,[n("h4",null,v(s.title),1),n("div",sr,[t(M,{onCommand:O=>$s(O,s),trigger:"click"},{dropdown:l(()=>[t(S,null,{default:l(()=>[t(c,{command:"edit"},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Bl))]),_:1}),e[145]||(e[145]=u(" 编辑 "))]),_:1,__:[145]}),t(c,{command:"delete",divided:""},{default:l(()=>[t(i,null,{default:l(()=>[t(P(ql))]),_:1}),e[146]||(e[146]=u(" 删除 "))]),_:1,__:[146]})]),_:1})]),default:l(()=>[t(o,{size:"small",type:"text",onClick:e[3]||(e[3]=Ll(()=>{},["stop"]))},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Cl))]),_:1})]),_:1})]),_:2},1032,["onCommand"])])]),t(w,{content:s.description,placement:"right",disabled:s.description.length<=80,effect:"light","show-after":300},{default:l(()=>[n("p",or,v(s.description.length>80?s.description.substring(0,80)+"...":s.description),1)]),_:2},1032,["content","disabled"]),n("div",ir,[t(_,{size:"small"},{default:l(()=>[u(v(s.chapter),1)]),_:2},1024),n("span",ur,v(s.time),1)])])]))),128)),Qe.value.length===0?(r(),y("div",rr,[e[149]||(e[149]=n("p",null,"暂无事件记录",-1)),t(o,{size:"small",onClick:Fl},{default:l(()=>e[148]||(e[148]=[u("添加第一个事件")])),_:1,__:[148]})])):z("",!0)])]),_:1})],512),[[xt,ue.value==="events"]])]),n("div",dr,[U.value?(r(),j(T,{key:0,shadow:"never"},{header:l(()=>[n("div",cr,[n("div",vr,[n("h3",pr,"✍️ "+v(U.value.title),1),n("div",mr,[n("span",fr,v(dl.value)+"字",1),U.value.status?(r(),j(ee,{key:0,modelValue:U.value.status,"onUpdate:modelValue":e[4]||(e[4]=s=>U.value.status=s),size:"small",style:{width:"80px"},onChange:ks,"popper-class":"chapter-status-dropdown"},{default:l(()=>[t(V,{label:"草稿",value:"draft"}),t(V,{label:"完成",value:"completed"}),t(V,{label:"发表",value:"published"})]),_:1},8,["modelValue"])):z("",!0),ve.value?(r(),y("span",gr,"● 保存中...")):z("",!0)])]),n("div",_r,[t(me,null,{default:l(()=>[t(o,{size:"small",onClick:Fa,disabled:!U.value.description},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Jt))]),_:1}),e[150]||(e[150]=u(" 根据大纲生成 "))]),_:1,__:[150]},8,["disabled"]),t(o,{size:"small",onClick:Ba},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Ot))]),_:1}),e[151]||(e[151]=u(" 续写 "))]),_:1,__:[151]}),t(o,{size:"small",onClick:Oa},{default:l(()=>[t(i,null,{default:l(()=>[t(P($l))]),_:1}),e[152]||(e[152]=u(" 优化 "))]),_:1,__:[152]})]),_:1})])])]),default:l(()=>[n("div",yr,[n("div",hr,[t(P(Zo),{editor:pe.value,defaultConfig:On,mode:"default",style:{"border-bottom":"1px solid #e4e7ed"}},null,8,["editor"]),t(P(Qo),{modelValue:H.value,"onUpdate:modelValue":e[5]||(e[5]=s=>H.value=s),defaultConfig:jn,mode:"default",onOnCreated:Hn,onOnChange:xs,style:{"overflow-y":"hidden"}},null,8,["modelValue"])])])]),_:1})):(r(),j(T,{key:1,shadow:"never"},{default:l(()=>[n("div",wr,[t(i,{class:"empty-icon"},{default:l(()=>[t(P(Mn))]),_:1}),e[154]||(e[154]=n("p",null,"请选择或创建一个章节开始编辑",-1)),t(o,{type:"primary",onClick:zl},{default:l(()=>e[153]||(e[153]=[u("创建第一章")])),_:1,__:[153]})])]),_:1}))])]),t(ot,{modelValue:xe.value,"onUpdate:modelValue":e[10]||(e[10]=s=>xe.value=s),title:$e.value?"编辑章节":"新增章节",width:"600px"},{footer:l(()=>[t(o,{onClick:e[9]||(e[9]=s=>xe.value=!1)},{default:l(()=>e[156]||(e[156]=[u("取消")])),_:1,__:[156]}),t(o,{type:"primary",onClick:Ln},{default:l(()=>e[157]||(e[157]=[u("确定")])),_:1,__:[157]})]),default:l(()=>[t(bt,{model:Le.value,"label-width":"80px"},{default:l(()=>[t(F,{label:"章节标题"},{default:l(()=>[t(A,{modelValue:Le.value.title,"onUpdate:modelValue":e[6]||(e[6]=s=>Le.value.title=s),placeholder:"请输入章节标题"},null,8,["modelValue"])]),_:1}),t(F,{label:"章节简介"},{default:l(()=>[n("div",Cr,[t(A,{modelValue:Le.value.description,"onUpdate:modelValue":e[7]||(e[7]=s=>Le.value.description=s),type:"textarea",rows:4,placeholder:"简要描述本章节内容..."},null,8,["modelValue"]),t(o,{size:"small",type:"primary",onClick:Wa,loading:Me.value,style:{"margin-top":"8px"}},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Jt))]),_:1}),e[155]||(e[155]=u(" AI生成大纲 "))]),_:1,__:[155]},8,["loading"])])]),_:1}),t(F,{label:"章节状态"},{default:l(()=>[t(ee,{modelValue:Le.value.status,"onUpdate:modelValue":e[8]||(e[8]=s=>Le.value.status=s)},{default:l(()=>[t(V,{label:"草稿",value:"draft"}),t(V,{label:"完成",value:"completed"}),t(V,{label:"发表",value:"published"})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue","title"]),t(ot,{modelValue:qt.value,"onUpdate:modelValue":e[21]||(e[21]=s=>qt.value=s),title:"编辑角色",width:"700px"},{footer:l(()=>[t(o,{onClick:e[20]||(e[20]=s=>qt.value=!1)},{default:l(()=>e[164]||(e[164]=[u("取消")])),_:1,__:[164]}),t(o,{type:"primary",onClick:us},{default:l(()=>e[165]||(e[165]=[u("保存")])),_:1,__:[165]})]),default:l(()=>[t(bt,{model:D.value,"label-width":"80px"},{default:l(()=>[t(Pt,{gutter:20},{default:l(()=>[t(Ye,{span:12},{default:l(()=>[t(F,{label:"姓名"},{default:l(()=>[t(A,{modelValue:D.value.name,"onUpdate:modelValue":e[11]||(e[11]=s=>D.value.name=s)},null,8,["modelValue"])]),_:1}),t(F,{label:"角色"},{default:l(()=>[t(ee,{modelValue:D.value.role,"onUpdate:modelValue":e[12]||(e[12]=s=>D.value.role=s)},{default:l(()=>[t(V,{label:"主角",value:"protagonist"}),t(V,{label:"配角",value:"supporting"}),t(V,{label:"反派",value:"antagonist"}),t(V,{label:"路人",value:"minor"})]),_:1},8,["modelValue"])]),_:1}),t(F,{label:"性别"},{default:l(()=>[t(jl,{modelValue:D.value.gender,"onUpdate:modelValue":e[13]||(e[13]=s=>D.value.gender=s)},{default:l(()=>[t(wt,{label:"male"},{default:l(()=>e[158]||(e[158]=[u("男")])),_:1,__:[158]}),t(wt,{label:"female"},{default:l(()=>e[159]||(e[159]=[u("女")])),_:1,__:[159]}),t(wt,{label:"other"},{default:l(()=>e[160]||(e[160]=[u("其他")])),_:1,__:[160]})]),_:1},8,["modelValue"])]),_:1}),t(F,{label:"年龄"},{default:l(()=>[t(al,{modelValue:D.value.age,"onUpdate:modelValue":e[14]||(e[14]=s=>D.value.age=s),min:0,max:1e3},null,8,["modelValue"])]),_:1})]),_:1}),t(Ye,{span:12},{default:l(()=>[t(F,{label:"外貌"},{default:l(()=>[t(A,{modelValue:D.value.appearance,"onUpdate:modelValue":e[15]||(e[15]=s=>D.value.appearance=s),type:"textarea",rows:3},null,8,["modelValue"])]),_:1}),t(F,{label:"性格"},{default:l(()=>[t(A,{modelValue:D.value.personality,"onUpdate:modelValue":e[16]||(e[16]=s=>D.value.personality=s),type:"textarea",rows:3},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),t(F,{label:"背景故事"},{default:l(()=>[n("div",$r,[t(A,{modelValue:D.value.background,"onUpdate:modelValue":e[17]||(e[17]=s=>D.value.background=s),type:"textarea",rows:4},null,8,["modelValue"]),n("div",kr,[t(o,{size:"small",type:"primary",onClick:rs,style:{flex:"1"}},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Jt))]),_:1}),e[161]||(e[161]=u(" AI生成角色信息 "))]),_:1,__:[161]}),t(o,{size:"small",onClick:e[18]||(e[18]=s=>Qn("character")),style:{"margin-left":"8px"}},{default:l(()=>e[162]||(e[162]=[u(" 📝 提示词 ")])),_:1,__:[162]})])])]),_:1}),t(F,{label:"标签"},{default:l(()=>[t(A,{modelValue:rl.value,"onUpdate:modelValue":e[19]||(e[19]=s=>rl.value=s),placeholder:"输入标签后按回车",onKeyup:Ho(wn,["enter"])},{append:l(()=>[t(o,{onClick:wn},{default:l(()=>e[163]||(e[163]=[u("添加")])),_:1,__:[163]})]),_:1},8,["modelValue"]),D.value.tags.length>0?(r(),y("div",br,[(r(!0),y(te,null,le(D.value.tags,(s,O)=>(r(),j(_,{key:O,closable:"",onClose:G=>ds(O),style:{"margin-right":"8px"}},{default:l(()=>[u(v(s),1)]),_:2},1032,["onClose"]))),128))])):z("",!0)]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),t(ot,{modelValue:Nt.value,"onUpdate:modelValue":e[26]||(e[26]=s=>Nt.value=s),title:"编辑世界观设定",width:"600px"},{footer:l(()=>[t(o,{onClick:e[25]||(e[25]=s=>Nt.value=!1)},{default:l(()=>e[168]||(e[168]=[u("取消")])),_:1,__:[168]}),t(o,{type:"primary",onClick:bs},{default:l(()=>e[169]||(e[169]=[u("保存")])),_:1,__:[169]})]),default:l(()=>[t(bt,{model:Ue.value,"label-width":"80px"},{default:l(()=>[t(F,{label:"设定标题"},{default:l(()=>[t(A,{modelValue:Ue.value.title,"onUpdate:modelValue":e[22]||(e[22]=s=>Ue.value.title=s)},null,8,["modelValue"])]),_:1}),t(F,{label:"类别"},{default:l(()=>[t(ee,{modelValue:Ue.value.category,"onUpdate:modelValue":e[23]||(e[23]=s=>Ue.value.category=s)},{default:l(()=>[t(V,{label:"世界设定",value:"setting"}),t(V,{label:"魔法体系",value:"magic"}),t(V,{label:"政治势力",value:"politics"}),t(V,{label:"地理环境",value:"geography"}),t(V,{label:"历史背景",value:"history"})]),_:1},8,["modelValue"])]),_:1}),t(F,{label:"详细描述"},{default:l(()=>[n("div",Vr,[t(A,{modelValue:Ue.value.description,"onUpdate:modelValue":e[24]||(e[24]=s=>Ue.value.description=s),type:"textarea",rows:6},null,8,["modelValue"]),t(o,{size:"small",type:"primary",onClick:$a,loading:Et.value,style:{"margin-top":"8px"}},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Jt))]),_:1}),e[166]||(e[166]=u(" AI生成描述 "))]),_:1,__:[166]},8,["loading"])])]),_:1})]),_:1},8,["model"]),L.value&&se.value==="worldSetting"?(r(),y("div",xr,[e[167]||(e[167]=n("div",{class:"streaming-header"},[n("span",{class:"streaming-title"},"🤖 AI正在生成世界观设定...")],-1)),n("div",{class:"streaming-content-display",innerHTML:Ml(E.value)},null,8,Sr)])):z("",!0)]),_:1},8,["modelValue"]),t(ot,{modelValue:Lt.value,"onUpdate:modelValue":e[31]||(e[31]=s=>Lt.value=s),title:"编辑语料",width:"700px"},{footer:l(()=>[t(o,{onClick:e[30]||(e[30]=s=>Lt.value=!1)},{default:l(()=>e[170]||(e[170]=[u("取消")])),_:1,__:[170]}),t(o,{type:"primary",onClick:Vs},{default:l(()=>e[171]||(e[171]=[u("保存")])),_:1,__:[171]})]),default:l(()=>[t(bt,{model:ut.value,"label-width":"80px"},{default:l(()=>[t(F,{label:"标题"},{default:l(()=>[t(A,{modelValue:ut.value.title,"onUpdate:modelValue":e[27]||(e[27]=s=>ut.value.title=s)},null,8,["modelValue"])]),_:1}),t(F,{label:"类型"},{default:l(()=>[t(ee,{modelValue:ut.value.type,"onUpdate:modelValue":e[28]||(e[28]=s=>ut.value.type=s)},{default:l(()=>[t(V,{label:"场景描述",value:"description"}),t(V,{label:"对话模板",value:"dialogue"}),t(V,{label:"情感表达",value:"emotion"}),t(V,{label:"动作描写",value:"action"}),t(V,{label:"心理描写",value:"psychology"})]),_:1},8,["modelValue"])]),_:1}),t(F,{label:"内容"},{default:l(()=>[t(A,{modelValue:ut.value.content,"onUpdate:modelValue":e[29]||(e[29]=s=>ut.value.content=s),type:"textarea",rows:8},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),t(ot,{modelValue:Gt.value,"onUpdate:modelValue":e[38]||(e[38]=s=>Gt.value=s),title:"编辑事件",width:"600px"},{footer:l(()=>[t(o,{onClick:e[37]||(e[37]=s=>Gt.value=!1)},{default:l(()=>e[176]||(e[176]=[u("取消")])),_:1,__:[176]}),t(o,{type:"primary",onClick:ws},{default:l(()=>e[177]||(e[177]=[u("保存")])),_:1,__:[177]})]),default:l(()=>[t(bt,{model:Ge.value,"label-width":"80px"},{default:l(()=>[t(F,{label:"事件标题"},{default:l(()=>[t(A,{modelValue:Ge.value.title,"onUpdate:modelValue":e[32]||(e[32]=s=>Ge.value.title=s)},null,8,["modelValue"])]),_:1}),t(F,{label:"相关章节"},{default:l(()=>[t(ee,{modelValue:Ge.value.chapter,"onUpdate:modelValue":e[33]||(e[33]=s=>Ge.value.chapter=s),placeholder:"选择章节"},{default:l(()=>[(r(!0),y(te,null,le(I.value,s=>(r(),j(V,{key:s.id,label:s.title,value:s.title},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),t(F,{label:"时间线"},{default:l(()=>[t(A,{modelValue:Ge.value.time,"onUpdate:modelValue":e[34]||(e[34]=s=>Ge.value.time=s),placeholder:"如：第三天傍晚"},null,8,["modelValue"])]),_:1}),t(F,{label:"重要程度"},{default:l(()=>[t(jl,{modelValue:Ge.value.importance,"onUpdate:modelValue":e[35]||(e[35]=s=>Ge.value.importance=s)},{default:l(()=>[t(wt,{label:"low"},{default:l(()=>e[172]||(e[172]=[u("次要")])),_:1,__:[172]}),t(wt,{label:"normal"},{default:l(()=>e[173]||(e[173]=[u("一般")])),_:1,__:[173]}),t(wt,{label:"high"},{default:l(()=>e[174]||(e[174]=[u("重要")])),_:1,__:[174]}),t(wt,{label:"critical"},{default:l(()=>e[175]||(e[175]=[u("关键")])),_:1,__:[175]})]),_:1},8,["modelValue"])]),_:1}),t(F,{label:"事件描述"},{default:l(()=>[t(A,{modelValue:Ge.value.description,"onUpdate:modelValue":e[36]||(e[36]=s=>Ge.value.description=s),type:"textarea",rows:4},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),t(ot,{modelValue:Ze.value,"onUpdate:modelValue":e[50]||(e[50]=s=>Ze.value=s),title:"AI生成章节内容",width:"1200px",onClose:e[51]||(e[51]=s=>Ze.value=!1)},{footer:l(()=>[n("div",sc,[n("div",oc,[t(o,{onClick:e[49]||(e[49]=s=>Ze.value=!1)},{default:l(()=>e[208]||(e[208]=[u("取消")])),_:1,__:[208]}),t(o,{type:"primary",onClick:bn,loading:Ce.value,disabled:!J.value},{default:l(()=>[t(i,null,{default:l(()=>[t(P(ul))]),_:1}),u(" "+v(Ce.value?"生成中...":"开始生成"),1)]),_:1},8,["loading","disabled"])])])]),default:l(()=>[n("div",zr,[n("div",Ir,[t(T,{shadow:"hover",class:"config-card-modern"},{header:l(()=>[n("div",Tr,[n("div",Ar,[e[178]||(e[178]=n("span",{class:"config-title"},"⚙️ 生成配置",-1)),t(_,{type:"info",size:"small"},{default:l(()=>{var s;return[u(v(((s=U.value)==null?void 0:s.title)||"未选择章节"),1)]}),_:1})]),t(o,{type:"primary",onClick:bn,loading:Ce.value,disabled:!J.value,size:"small"},{default:l(()=>[t(i,null,{default:l(()=>[t(P(ul))]),_:1}),u(" "+v(Ce.value?"生成中":"生成"),1)]),_:1},8,["loading","disabled"])])]),default:l(()=>[t(Pt,{gutter:16},{default:l(()=>[t(Ye,{span:8},{default:l(()=>[t(F,{label:"目标字数",class:"config-item"},{default:l(()=>[t(al,{modelValue:q.value.wordCount,"onUpdate:modelValue":e[39]||(e[39]=s=>q.value.wordCount=s),min:500,max:5e3,size:"small","controls-position":"right"},null,8,["modelValue"])]),_:1})]),_:1}),t(Ye,{span:8},{default:l(()=>[t(F,{label:"写作视角",class:"config-item"},{default:l(()=>[t(ee,{modelValue:q.value.style,"onUpdate:modelValue":e[40]||(e[40]=s=>q.value.style=s),size:"small",style:{width:"100%"}},{default:l(()=>[t(V,{label:"第一人称",value:"first-person"}),t(V,{label:"第三人称",value:"third-person"}),t(V,{label:"全知视角",value:"omniscient"})]),_:1},8,["modelValue"])]),_:1})]),_:1}),t(Ye,{span:8},{default:l(()=>[t(F,{label:"重点内容",class:"config-item"},{default:l(()=>[t(A,{modelValue:q.value.focus,"onUpdate:modelValue":e[41]||(e[41]=s=>q.value.focus=s),placeholder:"本章重点内容...",size:"small"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})]),t(Pt,{gutter:20,style:{"margin-top":"16px"}},{default:l(()=>[t(Ye,{span:14},{default:l(()=>[n("div",Pr,[n("div",Mr,[e[180]||(e[180]=n("h4",{class:"section-title"},"📚 创作素材",-1)),t(o,{size:"small",onClick:Ms},{default:l(()=>e[179]||(e[179]=[u("清空选择")])),_:1,__:[179]})]),t(g,{modelValue:Be.value,"onUpdate:modelValue":e[46]||(e[46]=s=>Be.value=s),class:"materials-tabs"},{default:l(()=>[t(d,{label:"👥 人物角色",name:"characters"},{default:l(()=>[n("div",Dr,[n("span",Ur,"已选择 "+v(Y.value.characters.length)+"/"+v(Je.value.length),1),Je.value.length>0?(r(),j(o,{key:0,size:"small",onClick:e[42]||(e[42]=s=>wl("characters"))},{default:l(()=>e[181]||(e[181]=[u("全选")])),_:1,__:[181]})):z("",!0)]),n("div",Er,[(r(!0),y(te,null,le(Je.value,s=>{var O,G;return r(),y("div",{key:s.id,class:we(["material-card",{selected:Y.value.characters.some(He=>He.id===s.id)}]),onClick:He=>pl("characters",s)},[n("div",Wr,[n("span",Fr,v(s.name),1),t(_,{type:Al(s.role),size:"small"},{default:l(()=>[u(v(Pl(s.role)),1)]),_:2},1032,["type"])]),n("p",Or,v(((O=s.personality)==null?void 0:O.substring(0,40))||"暂无描述")+"...",1),n("div",jr,[(r(!0),y(te,null,le((G=s.tags)==null?void 0:G.slice(0,2),He=>(r(),j(_,{key:He,size:"small"},{default:l(()=>[u(v(He),1)]),_:2},1024))),128))])],10,Rr)}),128))]),Je.value.length===0?(r(),y("div",Br,[e[183]||(e[183]=n("p",null,"暂无人物角色",-1)),t(o,{size:"small",onClick:El},{default:l(()=>e[182]||(e[182]=[u("创建角色")])),_:1,__:[182]})])):z("",!0)]),_:1}),t(d,{label:"🌍 世界观",name:"worldSettings"},{default:l(()=>[n("div",qr,[n("span",Nr,"已选择 "+v(Y.value.worldSettings.length)+"/"+v(At.value.length),1),At.value.length>0?(r(),j(o,{key:0,size:"small",onClick:e[43]||(e[43]=s=>wl("worldSettings"))},{default:l(()=>e[184]||(e[184]=[u("全选")])),_:1,__:[184]})):z("",!0)]),n("div",Lr,[(r(!0),y(te,null,le(At.value,s=>{var O;return r(),y("div",{key:s.id,class:we(["material-card",{selected:Y.value.worldSettings.some(G=>G.id===s.id)}]),onClick:G=>pl("worldSettings",s)},[n("div",Hr,[n("span",Xr,v(s.title),1),s.category?(r(),j(_,{key:0,size:"small"},{default:l(()=>[u(v(s.category),1)]),_:2},1024)):z("",!0)]),n("p",Kr,v(((O=s.description)==null?void 0:O.substring(0,50))||"暂无描述")+"...",1)],10,Gr)}),128))]),At.value.length===0?(r(),y("div",Jr,[e[186]||(e[186]=n("p",null,"暂无世界观设定",-1)),t(o,{size:"small",onClick:Rl},{default:l(()=>e[185]||(e[185]=[u("创建设定")])),_:1,__:[185]})])):z("",!0)]),_:1}),t(d,{label:"📝 语料库",name:"corpus"},{default:l(()=>[n("div",Yr,[n("span",Zr,"已选择 "+v(Y.value.corpus.length)+"/"+v(st.value.length),1),st.value.length>0?(r(),j(o,{key:0,size:"small",onClick:e[44]||(e[44]=s=>wl("corpus"))},{default:l(()=>e[187]||(e[187]=[u("全选")])),_:1,__:[187]})):z("",!0)]),n("div",Qr,[(r(!0),y(te,null,le(st.value,s=>{var O;return r(),y("div",{key:s.id,class:we(["material-card",{selected:Y.value.corpus.some(G=>G.id===s.id)}]),onClick:G=>pl("corpus",s)},[n("div",td,[n("span",ld,v(s.title),1)]),n("p",nd,v(((O=s.content)==null?void 0:O.substring(0,40))||"暂无内容")+"...",1)],10,ed)}),128))]),st.value.length===0?(r(),y("div",ad,[e[189]||(e[189]=n("p",null,"暂无语料库",-1)),t(o,{size:"small",onClick:Wl},{default:l(()=>e[188]||(e[188]=[u("创建语料")])),_:1,__:[188]})])):z("",!0)]),_:1}),t(d,{label:"📅 事件线",name:"events"},{default:l(()=>[n("div",sd,[n("span",od,"已选择 "+v(Y.value.events.length)+"/"+v(Qe.value.length),1),Qe.value.length>0?(r(),j(o,{key:0,size:"small",onClick:e[45]||(e[45]=s=>wl("events"))},{default:l(()=>e[190]||(e[190]=[u("全选")])),_:1,__:[190]})):z("",!0)]),n("div",id,[(r(!0),y(te,null,le(Qe.value,s=>{var O;return r(),y("div",{key:s.id,class:we(["material-card",{selected:Y.value.events.some(G=>G.id===s.id)}]),onClick:G=>pl("events",s)},[n("div",rd,[n("span",dd,v(s.title),1),t(_,{type:da(s.importance),size:"small"},{default:l(()=>[u("第"+v(s.chapter)+"章",1)]),_:2},1032,["type"])]),n("p",cd,v(((O=s.description)==null?void 0:O.substring(0,40))||"暂无描述")+"...",1),n("div",vd,[n("span",pd,v(s.time||"时间未定"),1)])],10,ud)}),128))]),Qe.value.length===0?(r(),y("div",md,[e[192]||(e[192]=n("p",null,"暂无事件线",-1)),t(o,{size:"small",onClick:Fl},{default:l(()=>e[191]||(e[191]=[u("创建事件")])),_:1,__:[191]})])):z("",!0)]),_:1}),t(d,{label:"📖 上下文内容",name:"chapters"},{default:l(()=>[n("div",fd,[n("span",gd,"已选择 "+v(ce.value.length)+"/"+v(Rt.value.length),1),n("div",_d,[Rt.value.length>0?(r(),j(o,{key:0,size:"small",onClick:ma},{default:l(()=>e[193]||(e[193]=[u("全选")])),_:1,__:[193]})):z("",!0)])]),n("div",yd,[(r(!0),y(te,null,le(Rt.value,s=>(r(),y("div",{key:s.id,class:we(["chapter-material-card",{selected:ce.value.includes(s.id)}]),onClick:O=>pa(s.id)},[n("div",wd,[n("span",Cd,"第"+v(s.chapterIndex)+"章 "+v(s.title),1),n("div",$d,[t(_,{type:Il(s.status),size:"small"},{default:l(()=>[u(v(vl(s.status)),1)]),_:2},1032,["type"]),t(_,{size:"small",type:"info"},{default:l(()=>[u(v(s.wordCount)+"字",1)]),_:2},1024)])]),n("p",kd,v(s.description||"暂无大纲"),1),s.content?(r(),y("div",bd,[n("span",Vd,v(fl(s.content,80))+"...",1)])):z("",!0)],10,hd))),128))]),Rt.value.length===0?(r(),y("div",xd,[e[195]||(e[195]=n("p",null,"暂无可选择的章节",-1)),t(o,{size:"small",onClick:a.addChapter},{default:l(()=>e[194]||(e[194]=[u("创建章节")])),_:1,__:[194]},8,["onClick"])])):z("",!0)]),_:1})]),_:1},8,["modelValue"])])]),_:1}),t(Ye,{span:10},{default:l(()=>[n("div",Sd,[n("div",zd,[e[197]||(e[197]=n("h4",{class:"section-title"},"📝 提示词模板",-1)),t(o,{size:"small",onClick:Ds},{default:l(()=>e[196]||(e[196]=[u("使用默认")])),_:1,__:[196]})]),n("div",Id,[e[198]||(e[198]=n("div",{class:"category-header"},[n("span",null,"🏷️ 正文类型")],-1)),n("div",Td,[(r(!0),y(te,null,le(We.value,s=>(r(),y("div",{key:s.key,class:we(["category-card",{active:qe.value===s.key}]),onClick:O=>qe.value=s.key},[n("span",Pd,v(s.icon),1),n("span",Md,v(s.name),1)],10,Ad))),128))])]),n("div",Dd,[n("div",Ud,[n("span",null,"可用模板 ("+v(Qt(qe.value).length)+")",1),t(o,{size:"small",onClick:Us},{default:l(()=>e[199]||(e[199]=[u("刷新")])),_:1,__:[199]})]),n("div",Ed,[(r(!0),y(te,null,le(Qt(qe.value),s=>{var O,G,He;return r(),y("div",{key:s.id,class:we(["prompt-item-modern",{active:((O=J.value)==null?void 0:O.id)===s.id}]),onClick:Ft=>sa(s)},[n("div",Wd,[n("h5",Fd,v(s.title),1),n("p",Od,v(s.description),1),n("div",jd,[n("div",Bd,[(r(!0),y(te,null,le((G=s.tags)==null?void 0:G.slice(0,2),Ft=>(r(),j(_,{key:Ft,size:"small"},{default:l(()=>[u(v(Ft),1)]),_:2},1024))),128))])])]),n("div",qd,[((He=J.value)==null?void 0:He.id)===s.id?(r(),j(i,{key:0,class:"selected-icon"},{default:l(()=>[t(P(Vt))]),_:1})):z("",!0)])],10,Rd)}),128))]),Qt(qe.value).length===0?(r(),y("div",Nd,[e[201]||(e[201]=n("p",null,"暂无该类型的提示词模板",-1)),t(o,{size:"small",onClick:Es},{default:l(()=>e[200]||(e[200]=[u("创建模板")])),_:1,__:[200]})])):z("",!0)]),J.value&&Object.keys(C.value).length>0?(r(),y("div",Ld,[n("div",Gd,[e[203]||(e[203]=n("span",null,"📋 变量配置",-1)),t(o,{size:"small",onClick:un},{default:l(()=>e[202]||(e[202]=[u("智能填充")])),_:1,__:[202]})]),n("div",Hd,[(r(!0),y(te,null,le(C.value,(s,O)=>(r(),y("div",{key:O,class:"variable-item"},[n("label",Xd,v(O),1),O==="前文概要"?(r(),y("div",Kd,[t(ee,{modelValue:ce.value,"onUpdate:modelValue":e[47]||(e[47]=G=>ce.value=G),multiple:"",placeholder:"选择章节作为前文参考",onChange:el,size:"small",style:{width:"100%"},"max-collapse-tags":"3"},{default:l(()=>[(r(!0),y(te,null,le(Rt.value,G=>(r(),j(V,{key:G.id,label:`第${G.chapterIndex}章 ${G.title} (${G.wordCount}字)`,value:G.id},{default:l(()=>[n("div",Jd,[n("span",Yd,"第"+v(G.chapterIndex)+"章 "+v(G.title),1),n("div",Zd,[t(_,{type:Il(G.status),size:"small"},{default:l(()=>[u(v(vl(G.status)),1)]),_:2},1032,["type"]),n("span",Qd,v(G.wordCount)+"字",1)])])]),_:2},1032,["label","value"]))),128))]),_:1},8,["modelValue"]),n("div",ec,[ce.value.length>0?(r(),j(o,{key:0,size:"small",onClick:va},{default:l(()=>e[204]||(e[204]=[u("清空")])),_:1,__:[204]})):z("",!0)])])):(r(),j(A,{key:1,modelValue:C.value[O],"onUpdate:modelValue":G=>C.value[O]=G,type:["章节大纲","主要人物","世界观设定","参考语料"].includes(O)?"textarea":"text",rows:2,placeholder:"请输入"+O,onInput:rt,size:"small"},null,8,["modelValue","onUpdate:modelValue","type","placeholder"]))]))),128))])])):z("",!0),J.value?(r(),y("div",tc,[n("div",lc,[e[207]||(e[207]=n("span",null,"👀 最终提示词",-1)),n("div",nc,[t(o,{size:"small",onClick:Rs},{default:l(()=>e[205]||(e[205]=[u("复制")])),_:1,__:[205]}),t(o,{size:"small",onClick:Ws},{default:l(()=>e[206]||(e[206]=[u("编辑")])),_:1,__:[206]})])]),n("div",ac,[t(A,{modelValue:R.value,"onUpdate:modelValue":e[48]||(e[48]=s=>R.value=s),type:"textarea",rows:8,readonly:"",placeholder:"请选择提示词并填充变量",class:"preview-textarea"},null,8,["modelValue"])])])):z("",!0)])]),_:1})]),_:1})])]),_:1},8,["modelValue"]),t(ot,{modelValue:Ne.value,"onUpdate:modelValue":e[61]||(e[61]=s=>Ne.value=s),title:"AI批量生成角色",width:"900px",onClose:e[62]||(e[62]=s=>Ne.value=!1)},{footer:l(()=>[n("div",Ic,[t(o,{onClick:e[60]||(e[60]=s=>Ne.value=!1)},{default:l(()=>e[222]||(e[222]=[u("取消")])),_:1,__:[222]}),!ft.value&&Ae.value.length===0?(r(),j(o,{key:0,type:"primary",onClick:rn,disabled:!ie.value.includeMainCharacters&&!ie.value.includeSupportingCharacters&&!ie.value.includeMinorCharacters},{default:l(()=>e[223]||(e[223]=[u(" 🚀 开始生成 ")])),_:1,__:[223]},8,["disabled"])):z("",!0),!ft.value&&Ae.value.length>0?(r(),j(o,{key:1,onClick:rn},{default:l(()=>e[224]||(e[224]=[u(" 🔄 重新生成 ")])),_:1,__:[224]})):z("",!0),!ft.value&&Ae.value.length>0?(r(),j(o,{key:2,type:"primary",onClick:ga},{default:l(()=>e[225]||(e[225]=[u(" ✅ 添加选中角色 ")])),_:1,__:[225]})):z("",!0)])]),default:l(()=>[n("div",ic,[!ft.value&&Ae.value.length===0?(r(),j(T,{key:0,shadow:"never",class:"config-section"},{header:l(()=>e[209]||(e[209]=[n("span",null,"⚙️ 生成配置",-1)])),default:l(()=>[t(bt,{"label-width":"120px",size:"default"},{default:l(()=>[t(Pt,{gutter:20},{default:l(()=>[t(Ye,{span:12},{default:l(()=>[t(F,{label:"生成数量"},{default:l(()=>[t(al,{modelValue:ie.value.count,"onUpdate:modelValue":e[52]||(e[52]=s=>ie.value.count=s),min:2,max:10},null,8,["modelValue"])]),_:1})]),_:1}),t(Ye,{span:12},{default:l(()=>[t(F,{label:"角色类型"},{default:l(()=>[n("div",uc,[t(dt,{modelValue:ie.value.includeMainCharacters,"onUpdate:modelValue":e[53]||(e[53]=s=>ie.value.includeMainCharacters=s)},{default:l(()=>e[210]||(e[210]=[u("主角")])),_:1,__:[210]},8,["modelValue"]),t(dt,{modelValue:ie.value.includeSupportingCharacters,"onUpdate:modelValue":e[54]||(e[54]=s=>ie.value.includeSupportingCharacters=s)},{default:l(()=>e[211]||(e[211]=[u("配角")])),_:1,__:[211]},8,["modelValue"]),t(dt,{modelValue:ie.value.includeMinorCharacters,"onUpdate:modelValue":e[55]||(e[55]=s=>ie.value.includeMinorCharacters=s)},{default:l(()=>e[212]||(e[212]=[u("次要角色")])),_:1,__:[212]},8,["modelValue"])])]),_:1})]),_:1})]),_:1}),t(F,{label:"使用提示词"},{default:l(()=>[n("div",rc,[t(o,{type:"primary",plain:"",size:"small",onClick:zs},{default:l(()=>e[213]||(e[213]=[u(" 📝 选择提示词 ")])),_:1,__:[213]}),St.value?(r(),y("span",dc," 已选择："+v(St.value.title),1)):z("",!0),St.value?(r(),j(o,{key:1,link:"",size:"small",type:"danger",onClick:Is},{default:l(()=>e[214]||(e[214]=[u(" 清除 ")])),_:1,__:[214]})):z("",!0)])]),_:1}),t(F,{label:"特殊要求"},{default:l(()=>[t(A,{modelValue:ie.value.customPrompt,"onUpdate:modelValue":e[56]||(e[56]=s=>ie.value.customPrompt=s),type:"textarea",rows:3,placeholder:"例如：需要包含反派角色、特定职业角色、具有魔法能力的角色等..."},null,8,["modelValue"])]),_:1}),t(F,{label:"智能分配"},{default:l(()=>[t(dt,{modelValue:ie.value.autoAssignRoles,"onUpdate:modelValue":e[57]||(e[57]=s=>ie.value.autoAssignRoles=s)},{default:l(()=>e[215]||(e[215]=[u("自动平衡角色关系和重要性")])),_:1,__:[215]},8,["modelValue"])]),_:1})]),_:1})]),_:1})):z("",!0),ft.value?(r(),j(T,{key:1,shadow:"never",class:"streaming-section"},{header:l(()=>e[216]||(e[216]=[n("span",null,"🤖 AI正在生成角色...",-1)])),default:l(()=>[n("div",cc,[n("div",{class:"streaming-content",innerHTML:Ml(E.value)},null,8,vc)])]),_:1})):z("",!0),!ft.value&&Ae.value.length>0?(r(),j(T,{key:2,shadow:"never",class:"results-section"},{header:l(()=>[n("div",pc,[n("span",null,"✨ 生成结果 ("+v(Ae.value.length)+"个角色)",1),n("div",mc,[t(o,{size:"small",onClick:e[58]||(e[58]=()=>Ae.value.forEach(s=>s.selected=!0))},{default:l(()=>e[217]||(e[217]=[u("全选")])),_:1,__:[217]}),t(o,{size:"small",onClick:e[59]||(e[59]=()=>Ae.value.forEach(s=>s.selected=!1))},{default:l(()=>e[218]||(e[218]=[u("全不选")])),_:1,__:[218]})])])]),default:l(()=>[n("div",fc,[(r(!0),y(te,null,le(Ae.value,s=>{var O,G;return r(),y("div",{key:s.id,class:we(["generated-character-card",{selected:s.selected!==!1}]),onClick:He=>_a(s)},[n("div",_c,[n("div",yc,[n("div",hc,v(((O=s.name)==null?void 0:O.charAt(0))||"？"),1)]),n("div",wc,[n("h4",null,v(s.name),1),n("div",Cc,[t(_,{type:Al(s.role),size:"small"},{default:l(()=>[u(v(Pl(s.role)),1)]),_:2},1032,["type"]),t(_,{type:"info",size:"small"},{default:l(()=>[u(v(cn(s.gender)),1)]),_:2},1024),n("span",$c,v(s.age)+"岁",1)])]),n("div",kc,[s.selected!==!1?(r(),j(i,{key:0,class:"selected-icon"},{default:l(()=>[t(P(Vt))]),_:1})):z("",!0)])]),n("div",bc,[n("div",Vc,[e[219]||(e[219]=n("label",null,"外貌：",-1)),n("p",null,v(s.appearance||"暂无描述"),1)]),n("div",xc,[e[220]||(e[220]=n("label",null,"性格：",-1)),n("p",null,v(s.personality||"暂无描述"),1)]),n("div",Sc,[e[221]||(e[221]=n("label",null,"背景：",-1)),n("p",null,v(s.background||"暂无描述"),1)]),(G=s.tags)!=null&&G.length?(r(),y("div",zc,[(r(!0),y(te,null,le(s.tags,He=>(r(),j(_,{key:He,size:"small"},{default:l(()=>[u(v(He),1)]),_:2},1024))),128))])):z("",!0)])],10,gc)}),128))])]),_:1})):z("",!0)])]),_:1},8,["modelValue"]),t(ot,{modelValue:ct.value,"onUpdate:modelValue":e[78]||(e[78]=s=>ct.value=s),title:"AI生成世界观设定",width:"800px",onClose:e[79]||(e[79]=s=>ct.value=!1)},{footer:l(()=>[n("div",Nc,[t(o,{onClick:e[77]||(e[77]=s=>ct.value=!1)},{default:l(()=>e[242]||(e[242]=[u("取消")])),_:1,__:[242]}),!_t.value&&De.value.length===0?(r(),j(o,{key:0,type:"primary",onClick:vn,disabled:!W.value.includeGeography&&!W.value.includeCulture&&!W.value.includeHistory&&!W.value.includeMagic&&!W.value.includeTechnology&&!W.value.includePolitics&&!W.value.includeReligion&&!W.value.includeEconomy&&!W.value.includeRaces&&!W.value.includeLanguage},{default:l(()=>e[243]||(e[243]=[u(" 🚀 开始生成 ")])),_:1,__:[243]},8,["disabled"])):z("",!0),!_t.value&&De.value.length>0?(r(),j(o,{key:1,onClick:vn},{default:l(()=>e[244]||(e[244]=[u(" 🔄 重新生成 ")])),_:1,__:[244]})):z("",!0),!_t.value&&De.value.length>0?(r(),j(o,{key:2,type:"primary",onClick:wa},{default:l(()=>e[245]||(e[245]=[u(" ✅ 添加选中设定 ")])),_:1,__:[245]})):z("",!0)])]),default:l(()=>[n("div",Tc,[!_t.value&&De.value.length===0?(r(),j(T,{key:0,shadow:"never",class:"config-section"},{header:l(()=>e[226]||(e[226]=[n("span",null,"⚙️ 生成配置",-1)])),default:l(()=>[t(bt,{"label-width":"120px",size:"default"},{default:l(()=>[t(F,{label:"生成数量"},{default:l(()=>[t(al,{modelValue:W.value.count,"onUpdate:modelValue":e[63]||(e[63]=s=>W.value.count=s),min:1,max:8},null,8,["modelValue"])]),_:1}),t(F,{label:"设定类型"},{default:l(()=>[n("div",Ac,[t(dt,{modelValue:W.value.includeGeography,"onUpdate:modelValue":e[64]||(e[64]=s=>W.value.includeGeography=s)},{default:l(()=>e[227]||(e[227]=[u("地理环境")])),_:1,__:[227]},8,["modelValue"]),t(dt,{modelValue:W.value.includeCulture,"onUpdate:modelValue":e[65]||(e[65]=s=>W.value.includeCulture=s)},{default:l(()=>e[228]||(e[228]=[u("文化社会")])),_:1,__:[228]},8,["modelValue"]),t(dt,{modelValue:W.value.includeHistory,"onUpdate:modelValue":e[66]||(e[66]=s=>W.value.includeHistory=s)},{default:l(()=>e[229]||(e[229]=[u("历史背景")])),_:1,__:[229]},8,["modelValue"]),t(dt,{modelValue:W.value.includeMagic,"onUpdate:modelValue":e[67]||(e[67]=s=>W.value.includeMagic=s)},{default:l(()=>e[230]||(e[230]=[u("魔法体系")])),_:1,__:[230]},8,["modelValue"]),t(dt,{modelValue:W.value.includeTechnology,"onUpdate:modelValue":e[68]||(e[68]=s=>W.value.includeTechnology=s)},{default:l(()=>e[231]||(e[231]=[u("科技水平")])),_:1,__:[231]},8,["modelValue"]),t(dt,{modelValue:W.value.includePolitics,"onUpdate:modelValue":e[69]||(e[69]=s=>W.value.includePolitics=s)},{default:l(()=>e[232]||(e[232]=[u("政治势力")])),_:1,__:[232]},8,["modelValue"]),t(dt,{modelValue:W.value.includeReligion,"onUpdate:modelValue":e[70]||(e[70]=s=>W.value.includeReligion=s)},{default:l(()=>e[233]||(e[233]=[u("宗教信仰")])),_:1,__:[233]},8,["modelValue"]),t(dt,{modelValue:W.value.includeEconomy,"onUpdate:modelValue":e[71]||(e[71]=s=>W.value.includeEconomy=s)},{default:l(()=>e[234]||(e[234]=[u("经济贸易")])),_:1,__:[234]},8,["modelValue"]),t(dt,{modelValue:W.value.includeRaces,"onUpdate:modelValue":e[72]||(e[72]=s=>W.value.includeRaces=s)},{default:l(()=>e[235]||(e[235]=[u("种族设定")])),_:1,__:[235]},8,["modelValue"]),t(dt,{modelValue:W.value.includeLanguage,"onUpdate:modelValue":e[73]||(e[73]=s=>W.value.includeLanguage=s)},{default:l(()=>e[236]||(e[236]=[u("语言文字")])),_:1,__:[236]},8,["modelValue"])])]),_:1}),t(F,{label:"使用提示词"},{default:l(()=>[n("div",Pc,[t(o,{type:"primary",plain:"",size:"small",onClick:Ts},{default:l(()=>e[237]||(e[237]=[u(" 📝 选择提示词 ")])),_:1,__:[237]}),vt.value?(r(),y("span",Mc," 已选择："+v(vt.value.title),1)):z("",!0),vt.value?(r(),j(o,{key:1,link:"",size:"small",type:"danger",onClick:As},{default:l(()=>e[238]||(e[238]=[u(" 清除 ")])),_:1,__:[238]})):z("",!0)])]),_:1}),t(F,{label:"特殊要求"},{default:l(()=>[t(A,{modelValue:W.value.customPrompt,"onUpdate:modelValue":e[74]||(e[74]=s=>W.value.customPrompt=s),type:"textarea",rows:3,placeholder:"例如：需要包含特定的种族设定、独特的政治制度、特殊的自然现象等..."},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):z("",!0),_t.value?(r(),j(T,{key:1,shadow:"never",class:"streaming-section"},{header:l(()=>e[239]||(e[239]=[n("span",null,"🤖 AI正在生成世界观设定...",-1)])),default:l(()=>[n("div",Dc,[n("div",{class:"streaming-content",innerHTML:Ml(E.value)},null,8,Uc)])]),_:1})):z("",!0),!_t.value&&De.value.length>0?(r(),j(T,{key:2,shadow:"never",class:"results-section"},{header:l(()=>[n("div",Ec,[n("span",null,"✨ 生成结果 ("+v(De.value.length)+"个设定)",1),n("div",Rc,[t(o,{size:"small",onClick:e[75]||(e[75]=()=>De.value.forEach(s=>s.selected=!0))},{default:l(()=>e[240]||(e[240]=[u("全选")])),_:1,__:[240]}),t(o,{size:"small",onClick:e[76]||(e[76]=()=>De.value.forEach(s=>s.selected=!1))},{default:l(()=>e[241]||(e[241]=[u("全不选")])),_:1,__:[241]})])])]),default:l(()=>[n("div",Wc,[(r(!0),y(te,null,le(De.value,s=>(r(),y("div",{key:s.id,class:we(["generated-setting-card",{selected:s.selected!==!1}]),onClick:O=>Ca(s)},[n("div",Oc,[n("div",jc,[n("h4",null,v(s.title),1),t(_,{type:ya(s.type),size:"small"},{default:l(()=>[u(v(s.type),1)]),_:2},1032,["type"])]),n("div",Bc,[s.selected!==!1?(r(),j(i,{key:0,class:"selected-icon"},{default:l(()=>[t(P(Vt))]),_:1})):z("",!0)])]),n("div",qc,[n("p",null,v(s.description||"暂无描述"),1)])],10,Fc))),128))])]),_:1})):z("",!0)])]),_:1},8,["modelValue"]),t(ot,{modelValue:_e.value,"onUpdate:modelValue":e[82]||(e[82]=s=>_e.value=s),title:"选择提示词",width:"800px",onClose:la},{footer:l(()=>[t(o,{onClick:e[81]||(e[81]=s=>_e.value=!1)},{default:l(()=>e[253]||(e[253]=[u("取消")])),_:1,__:[253]}),J.value?(r(),j(o,{key:0,onClick:na},{default:l(()=>e[254]||(e[254]=[u("复制提示词")])),_:1,__:[254]})):z("",!0),J.value?(r(),j(o,{key:1,type:"primary",onClick:aa,loading:L.value&&se.value==="batch-chapters"},{default:l(()=>[u(v(L.value&&se.value==="batch-chapters"?"生成中...":"使用此提示词"),1)]),_:1},8,["loading"])):z("",!0)]),default:l(()=>[n("div",Lc,[n("div",Gc,[n("h4",null,v(ta())+" 提示词",1),n("div",Hc,[(r(!0),y(te,null,le(Qt(re.value),s=>{var O;return r(),y("div",{key:s.id,class:we(["prompt-card",{active:((O=J.value)==null?void 0:O.id)===s.id}]),onClick:G=>ea(s)},[n("div",Kc,[n("h5",null,v(s.title),1)]),n("div",Jc,[n("p",null,v(s.description),1)]),n("div",Yc,[(r(!0),y(te,null,le(s.tags,G=>(r(),j(_,{key:G,size:"small"},{default:l(()=>[u(v(G),1)]),_:2},1024))),128))])],10,Xc)}),128))]),Qt(re.value).length===0?(r(),y("div",Zc,[e[247]||(e[247]=n("p",null,"暂无该类型的提示词",-1)),t(o,{type:"primary",onClick:sn},{default:l(()=>e[246]||(e[246]=[u("去提示词库添加")])),_:1,__:[246]})])):z("",!0)]),J.value&&Object.keys(C.value).length>0?(r(),y("div",Qc,[e[248]||(e[248]=n("h4",null,"填充变量",-1)),t(bt,{"label-width":"120px",size:"small"},{default:l(()=>[(r(!0),y(te,null,le(C.value,(s,O)=>(r(),j(F,{key:O,label:O+"："},{default:l(()=>[t(A,{modelValue:C.value[O],"onUpdate:modelValue":G=>C.value[O]=G,placeholder:"请输入"+O,onInput:rt},null,8,["modelValue","onUpdate:modelValue","placeholder"])]),_:2},1032,["label"]))),128))]),_:1})])):z("",!0),J.value?(r(),y("div",ev,[e[249]||(e[249]=n("h4",null,"最终提示词预览",-1)),t(A,{modelValue:R.value,"onUpdate:modelValue":e[80]||(e[80]=s=>R.value=s),type:"textarea",rows:8,readonly:"",placeholder:"请先选择提示词并填充变量"},null,8,["modelValue"])])):z("",!0)]),L.value&&se.value==="batch-chapters"&&Fe.value?(r(),y("div",tv,[t(T,{shadow:"never",class:"streaming-card"},{header:l(()=>[n("div",lv,[e[252]||(e[252]=n("span",null,"🔄 AI正在批量生成章节大纲...",-1)),t(_,{type:"success",size:"small"},{default:l(()=>e[250]||(e[250]=[u("实时生成中...")])),_:1,__:[250]}),t(o,{size:"small",onClick:Yn},{default:l(()=>e[251]||(e[251]=[u("停止生成")])),_:1,__:[251]})])]),default:l(()=>[n("div",nv,[n("pre",av,v(E.value),1)])]),_:1})])):z("",!0)]),_:1},8,["modelValue"]),t(ot,{modelValue:h.value,"onUpdate:modelValue":e[86]||(e[86]=s=>h.value=s),title:"AI文本优化",width:"1000px",onClose:ba},{default:l(()=>[n("div",sv,[t(Pt,{gutter:20},{default:l(()=>[t(Ye,{span:12},{default:l(()=>{var s;return[n("div",ov,[n("div",iv,[e[255]||(e[255]=n("h4",{class:"section-title"},"📝 当前文本",-1)),n("div",uv,[n("span",null,"字数："+v(tl()),1),n("span",null,"章节："+v(((s=U.value)==null?void 0:s.title)||"未选择"),1)])]),n("div",rv,[t(A,{value:yl(),type:"textarea",rows:12,readonly:"",placeholder:"请先选择文本内容",class:"current-text-area"},null,8,["value"])]),n("div",dv,[t(o,{size:"small",onClick:za},{default:l(()=>e[256]||(e[256]=[u("全选文本")])),_:1,__:[256]}),t(o,{size:"small",onClick:Ia},{default:l(()=>e[257]||(e[257]=[u("清空选择")])),_:1,__:[257]})])])]}),_:1}),t(Ye,{span:12},{default:l(()=>[n("div",cv,[n("div",vv,[e[259]||(e[259]=n("h4",{class:"section-title"},"🔧 优化配置",-1)),t(o,{size:"small",onClick:Ta},{default:l(()=>e[258]||(e[258]=[u("使用默认")])),_:1,__:[258]})]),n("div",pv,[e[265]||(e[265]=n("div",{class:"type-header"},"优化类型",-1)),n("div",mv,[t(jl,{modelValue:Ie.value,"onUpdate:modelValue":e[83]||(e[83]=s=>Ie.value=s),direction:"vertical"},{default:l(()=>[t(wt,{label:"grammar"},{default:l(()=>e[260]||(e[260]=[u("语法润色")])),_:1,__:[260]}),t(wt,{label:"style"},{default:l(()=>e[261]||(e[261]=[u("文风优化")])),_:1,__:[261]}),t(wt,{label:"emotion"},{default:l(()=>e[262]||(e[262]=[u("情感增强")])),_:1,__:[262]}),t(wt,{label:"logic"},{default:l(()=>e[263]||(e[263]=[u("逻辑梳理")])),_:1,__:[263]}),t(wt,{label:"custom"},{default:l(()=>e[264]||(e[264]=[u("自定义优化")])),_:1,__:[264]})]),_:1},8,["modelValue"])])]),n("div",fv,[n("div",gv,[n("span",null,"可用模板 ("+v(gl().length)+")",1),t(o,{size:"small",onClick:Va},{default:l(()=>e[266]||(e[266]=[u("刷新")])),_:1,__:[266]})]),n("div",_v,[(r(!0),y(te,null,le(gl(),s=>{var O,G,He;return r(),y("div",{key:s.id,class:we(["prompt-item-optimize",{active:((O=Q.value)==null?void 0:O.id)===s.id}]),onClick:Ft=>xa(s)},[n("div",hv,[n("h5",wv,v(s.title),1),n("p",Cv,v(s.description),1),n("div",$v,[n("div",kv,[(r(!0),y(te,null,le((G=s.tags)==null?void 0:G.slice(0,2),Ft=>(r(),j(_,{key:Ft,size:"small"},{default:l(()=>[u(v(Ft),1)]),_:2},1024))),128))])])]),n("div",bv,[((He=Q.value)==null?void 0:He.id)===s.id?(r(),j(i,{key:0,class:"selected-icon"},{default:l(()=>[t(P(Vt))]),_:1})):z("",!0)])],10,yv)}),128))]),gl().length===0?(r(),y("div",Vv,[e[268]||(e[268]=n("p",null,"暂无优化提示词模板",-1)),t(o,{size:"small",onClick:Aa},{default:l(()=>e[267]||(e[267]=[u("创建模板")])),_:1,__:[267]})])):z("",!0)]),Q.value&&Object.keys(Se.value).length>0?(r(),y("div",xv,[n("div",Sv,[e[270]||(e[270]=n("span",null,"📋 变量配置",-1)),t(o,{size:"small",onClick:Sa},{default:l(()=>e[269]||(e[269]=[u("智能填充")])),_:1,__:[269]})]),n("div",zv,[(r(!0),y(te,null,le(Se.value,(s,O)=>(r(),y("div",{key:O,class:"variable-item"},[n("label",Iv,v(O),1),t(A,{modelValue:Se.value[O],"onUpdate:modelValue":G=>Se.value[O]=G,type:O.includes("文本")||O.includes("内容")?"textarea":"text",rows:2,placeholder:"请输入"+O,onInput:_l,size:"small"},null,8,["modelValue","onUpdate:modelValue","type","placeholder"])]))),128))])])):z("",!0),Q.value||Ie.value==="custom"?(r(),y("div",Tv,[n("div",Av,[e[273]||(e[273]=n("span",null,"👀 最终提示词",-1)),n("div",Pv,[t(o,{size:"small",onClick:Pa},{default:l(()=>e[271]||(e[271]=[u("复制")])),_:1,__:[271]}),t(o,{size:"small",onClick:Ma},{default:l(()=>e[272]||(e[272]=[u("编辑")])),_:1,__:[272]})])]),n("div",Mv,[t(A,{modelValue:ye.value,"onUpdate:modelValue":e[84]||(e[84]=s=>ye.value=s),type:"textarea",rows:6,readonly:Ie.value!=="custom",placeholder:"请选择优化类型或提示词",class:"preview-textarea"},null,8,["modelValue","readonly"])])])):z("",!0)])]),_:1})]),_:1}),n("div",Dv,[n("div",Uv,[t(i,null,{default:l(()=>[t(P(po))]),_:1}),n("span",null,v(Ua()),1)]),n("div",Ev,[t(o,{onClick:e[85]||(e[85]=s=>h.value=!1)},{default:l(()=>e[274]||(e[274]=[u("取消")])),_:1,__:[274]}),t(o,{onClick:Da,disabled:!Dl()},{default:l(()=>e[275]||(e[275]=[u("预览效果")])),_:1,__:[275]},8,["disabled"]),t(o,{type:"primary",onClick:fn,loading:be.value,disabled:!Dl()},{default:l(()=>[t(i,null,{default:l(()=>[t(P($l))]),_:1}),u(" "+v(be.value?"优化中...":"开始优化"),1)]),_:1},8,["loading","disabled"])])])])]),_:1},8,["modelValue"]),t(ot,{modelValue:pt.value,"onUpdate:modelValue":e[91]||(e[91]=s=>pt.value=s),title:"AI生成单章",width:"800px",onClose:js},{footer:l(()=>[t(o,{onClick:e[90]||(e[90]=s=>pt.value=!1)},{default:l(()=>e[278]||(e[278]=[u("取消")])),_:1,__:[278]}),t(o,{onClick:Xs},{default:l(()=>e[279]||(e[279]=[u("选择提示词")])),_:1,__:[279]}),t(o,{type:"primary",onClick:Ns,loading:ke.value},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Jt))]),_:1}),u(" "+v(it.value?"使用自定义提示词生成":"生成章节"),1)]),_:1},8,["loading"])]),default:l(()=>[n("div",Rv,[t(bt,{model:b.value,"label-width":"120px"},{default:l(()=>[t(F,{label:"章节标题"},{default:l(()=>[t(A,{modelValue:b.value.title,"onUpdate:modelValue":e[87]||(e[87]=s=>b.value.title=s),placeholder:"请输入章节标题"},null,8,["modelValue"])]),_:1}),t(F,{label:"情节要求"},{default:l(()=>[t(A,{modelValue:b.value.plotRequirement,"onUpdate:modelValue":e[88]||(e[88]=s=>b.value.plotRequirement=s),type:"textarea",rows:3,placeholder:"描述希望的情节发展..."},null,8,["modelValue"])]),_:1}),t(F,{label:"提示词模板"},{default:l(()=>[t(ee,{modelValue:b.value.template,"onUpdate:modelValue":e[89]||(e[89]=s=>b.value.template=s),placeholder:"选择模板"},{default:l(()=>[t(V,{label:"通用章节",value:"general"}),t(V,{label:"战斗场景",value:"battle"}),t(V,{label:"情感戏",value:"emotion"}),t(V,{label:"转折剧情",value:"turning"})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"]),it.value?(r(),y("div",Wv,[t(Vn,{title:`已选择自定义提示词：${it.value.title}`,type:"success","show-icon":"",closable:!1},{default:l(()=>[n("div",Fv,v(it.value.description||'自定义提示词已准备就绪，点击"生成章节"按钮开始使用此提示词生成章节'),1)]),_:1},8,["title"])])):z("",!0),L.value&&se.value==="single-chapter"?(r(),y("div",Ov,[t(T,{shadow:"never",class:"streaming-card"},{header:l(()=>[n("div",jv,[e[277]||(e[277]=n("span",null,"🔄 AI正在生成章节大纲...",-1)),t(_,{type:"success",size:"small"},{default:l(()=>e[276]||(e[276]=[u("实时生成中...")])),_:1,__:[276]})])]),default:l(()=>[n("div",Bv,[n("pre",qv,v(E.value),1)])]),_:1})])):z("",!0)])]),_:1},8,["modelValue"]),t(ot,{modelValue:Fe.value,"onUpdate:modelValue":e[97]||(e[97]=s=>Fe.value=s),title:"AI批量生成章节",width:"900px",onClose:Bs},{footer:l(()=>[t(o,{onClick:e[96]||(e[96]=s=>Fe.value=!1)},{default:l(()=>e[284]||(e[284]=[u("取消")])),_:1,__:[284]}),t(o,{onClick:Js},{default:l(()=>e[285]||(e[285]=[u("选择提示词")])),_:1,__:[285]}),t(o,{type:"primary",onClick:Ls,loading:ke.value},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Jt))]),_:1}),u(" "+v($.value?"使用自定义提示词生成":"批量生成"),1)]),_:1},8,["loading"])]),default:l(()=>[n("div",Nv,[t(bt,{model:f.value,"label-width":"120px"},{default:l(()=>[t(F,{label:"生成数量"},{default:l(()=>[t(al,{modelValue:f.value.count,"onUpdate:modelValue":e[92]||(e[92]=s=>f.value.count=s),min:1,max:10},null,8,["modelValue"])]),_:1}),t(F,{label:"情节要求"},{default:l(()=>[t(A,{modelValue:f.value.plotRequirement,"onUpdate:modelValue":e[93]||(e[93]=s=>f.value.plotRequirement=s),type:"textarea",rows:3,placeholder:"描述希望的情节发展..."},null,8,["modelValue"])]),_:1}),t(F,{label:"提示词模板"},{default:l(()=>[t(ee,{modelValue:f.value.template,"onUpdate:modelValue":e[94]||(e[94]=s=>f.value.template=s),placeholder:"选择模板"},{default:l(()=>[t(V,{label:"通用章节",value:"general"}),t(V,{label:"战斗场景",value:"battle"}),t(V,{label:"情感戏",value:"emotion"}),t(V,{label:"转折剧情",value:"turning"})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"]),$.value?(r(),y("div",Lv,[t(Vn,{title:`已选择自定义提示词：${$.value.title}`,type:"success","show-icon":"",closable:!1},{default:l(()=>[n("div",Gv,v($.value.description||'自定义提示词已准备就绪，点击"批量生成"按钮开始使用此提示词生成章节'),1)]),_:1},8,["title"]),t(eo,{modelValue:lt.value,"onUpdate:modelValue":e[95]||(e[95]=s=>lt.value=s),class:"prompt-content-collapse"},{default:l(()=>[t(Qs,{title:"查看提示词内容",name:"promptContent"},{default:l(()=>[n("div",Hv,[e[281]||(e[281]=n("div",{class:"prompt-content-header"},[n("span",{class:"content-label"},"原始提示词内容：")],-1)),n("div",Xv,v($.value.content),1),Ve.value?(r(),y("div",Kv,[e[280]||(e[280]=n("div",{class:"prompt-content-header"},[n("span",{class:"content-label"},"填充变量后的最终提示词：")],-1)),n("div",Jv,v(Ve.value),1)])):z("",!0)])]),_:1})]),_:1},8,["modelValue"])])):z("",!0),L.value&&se.value==="batch-chapters"?(r(),y("div",Yv,[t(T,{shadow:"never",class:"streaming-card"},{header:l(()=>[n("div",Zv,[e[283]||(e[283]=n("span",null,"🔄 AI正在批量生成章节大纲...",-1)),t(_,{type:"success",size:"small"},{default:l(()=>e[282]||(e[282]=[u("实时生成中...")])),_:1,__:[282]})])]),default:l(()=>[n("div",Qv,[n("pre",ep,v(E.value),1)])]),_:1})])):z("",!0)])]),_:1},8,["modelValue"]),t(ot,{modelValue:Ct.value,"onUpdate:modelValue":e[103]||(e[103]=s=>Ct.value=s),title:"AI内容优化",width:"1000px",onClose:qs},{footer:l(()=>[t(o,{onClick:e[102]||(e[102]=s=>Ct.value=!1)},{default:l(()=>e[289]||(e[289]=[u("取消")])),_:1,__:[289]}),t(o,{onClick:Ys},{default:l(()=>e[290]||(e[290]=[u("选择提示词")])),_:1,__:[290]}),t(o,{type:"primary",onClick:Gs,loading:be.value},{default:l(()=>[t(i,null,{default:l(()=>[t(P($l))]),_:1}),e[291]||(e[291]=u(" 开始优化 "))]),_:1,__:[291]},8,["loading"]),ae.value.optimizedContent?(r(),j(o,{key:0,type:"success",onClick:Hs},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Vt))]),_:1}),e[292]||(e[292]=u(" 应用结果 "))]),_:1,__:[292]})):z("",!0)]),default:l(()=>[n("div",tp,[t(Pt,{gutter:20},{default:l(()=>[t(Ye,{span:12},{default:l(()=>[t(T,{shadow:"never",class:"optimize-input-card"},{header:l(()=>e[286]||(e[286]=[n("span",null,"📝 待优化内容",-1)])),default:l(()=>[t(bt,{model:ae.value,"label-width":"100px"},{default:l(()=>[t(F,{label:"优化类型"},{default:l(()=>[t(ee,{modelValue:ae.value.optimizeType,"onUpdate:modelValue":e[98]||(e[98]=s=>ae.value.optimizeType=s),placeholder:"选择优化类型"},{default:l(()=>[t(V,{label:"语法润色",value:"grammar"}),t(V,{label:"文风优化",value:"style"}),t(V,{label:"情感增强",value:"emotion"}),t(V,{label:"逻辑梳理",value:"logic"}),t(V,{label:"自定义优化",value:"custom"})]),_:1},8,["modelValue"])]),_:1}),ae.value.optimizeType==="custom"?(r(),j(F,{key:0,label:"优化要求"},{default:l(()=>[t(A,{modelValue:ae.value.customRequirement,"onUpdate:modelValue":e[99]||(e[99]=s=>ae.value.customRequirement=s),type:"textarea",rows:2,placeholder:"请描述具体的优化要求..."},null,8,["modelValue"])]),_:1})):z("",!0),t(F,{label:"原始内容"},{default:l(()=>[t(A,{modelValue:ae.value.originalContent,"onUpdate:modelValue":e[100]||(e[100]=s=>ae.value.originalContent=s),type:"textarea",rows:8,placeholder:"请输入需要优化的内容..."},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1})]),_:1}),t(Ye,{span:12},{default:l(()=>[t(T,{shadow:"never",class:"optimize-result-card"},{header:l(()=>e[287]||(e[287]=[n("span",null,"✨ 优化结果",-1)])),default:l(()=>[L.value&&se.value==="optimize"?(r(),y("div",lp,[n("div",np,[n("div",{innerHTML:E.value,class:"streaming-text"},null,8,ap)])])):ae.value.optimizedContent?(r(),y("div",sp,[t(A,{modelValue:ae.value.optimizedContent,"onUpdate:modelValue":e[101]||(e[101]=s=>ae.value.optimizedContent=s),type:"textarea",rows:8,readonly:""},null,8,["modelValue"])])):(r(),y("div",op,e[288]||(e[288]=[n("p",null,'点击"开始优化"按钮查看优化结果',-1)])))]),_:1})]),_:1})]),_:1})])]),_:1},8,["modelValue"]),t(ot,{modelValue:X.value,"onUpdate:modelValue":e[106]||(e[106]=s=>X.value=s),title:"AI文本润色",width:"1200px",onClose:Ka},{footer:l(()=>[n("div",Sp,[t(o,{onClick:e[105]||(e[105]=s=>X.value=!1)},{default:l(()=>e[305]||(e[305]=[u("取消")])),_:1,__:[305]}),t(o,{type:"primary",onClick:Ja,loading:nt.value,disabled:!_n.value},{default:l(()=>[t(i,null,{default:l(()=>[t(P(ul))]),_:1}),u(" "+v(nt.value?"润色中...":"开始润色"),1)]),_:1},8,["loading","disabled"]),K.value.optimizedContent&&K.value.mode==="selection"?(r(),j(o,{key:0,type:"success",onClick:Qa},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Vt))]),_:1}),e[306]||(e[306]=u(" 替换选择内容 "))]),_:1,__:[306]})):z("",!0),K.value.optimizedContent&&K.value.mode==="full"?(r(),j(o,{key:1,type:"success",onClick:es},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Vt))]),_:1}),e[307]||(e[307]=u(" 替换全文内容 "))]),_:1,__:[307]})):z("",!0)])]),default:l(()=>[n("div",ip,[t(Pt,{gutter:20},{default:l(()=>[t(Ye,{span:8},{default:l(()=>[t(T,{shadow:"never",class:"optimize-config-card"},{header:l(()=>[n("div",up,[e[295]||(e[295]=n("span",null,"⚙️ 润色配置",-1)),K.value.mode==="selection"?(r(),j(_,{key:0,type:"info",size:"small"},{default:l(()=>e[293]||(e[293]=[u("选择内容")])),_:1,__:[293]})):(r(),j(_,{key:1,type:"warning",size:"small"},{default:l(()=>e[294]||(e[294]=[u("整篇文章")])),_:1,__:[294]}))])]),default:l(()=>[n("div",rp,[e[298]||(e[298]=n("h4",null,"选择润色类型",-1)),n("div",dp,[(r(!0),y(te,null,le(Tt.value,s=>{var O;return r(),y("div",{key:s.id,class:we(["prompt-item",{active:((O=K.value.selectedPrompt)==null?void 0:O.id)===s.id}]),onClick:G=>ja(s)},[n("div",vp,v(s.title),1),n("div",pp,v(s.description||s.content.substring(0,60)+"..."),1)],10,cp)}),128))]),Tt.value.length===0?(r(),y("div",mp,[e[297]||(e[297]=n("p",null,"暂无润色提示词",-1)),t(o,{size:"small",onClick:sn},{default:l(()=>e[296]||(e[296]=[u("去提示词库添加")])),_:1,__:[296]})])):z("",!0)]),n("div",fp,[e[299]||(e[299]=n("h4",null,"自定义润色要求",-1)),t(A,{modelValue:K.value.customPrompt,"onUpdate:modelValue":e[104]||(e[104]=s=>K.value.customPrompt=s),type:"textarea",rows:4,placeholder:"输入具体的润色要求，例如：提升文字的画面感、增强对话的真实感、优化句式结构等..."},null,8,["modelValue"])]),n("div",gp,[e[300]||(e[300]=n("h4",null,"原始内容预览",-1)),t(A,{value:K.value.originalContent,type:"textarea",rows:8,readonly:"",placeholder:"暂无内容",class:"original-content-textarea"},null,8,["value"]),n("div",_p," 字数："+v(K.value.originalContent.length),1)])]),_:1})]),_:1}),t(Ye,{span:16},{default:l(()=>[t(T,{shadow:"never",class:"optimize-result-card"},{header:l(()=>[n("div",yp,[e[302]||(e[302]=n("span",null,"✨ 润色结果",-1)),K.value.optimizedContent&&!nt.value?(r(),j(o,{key:0,type:"success",size:"small",onClick:Za},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Nl))]),_:1}),e[301]||(e[301]=u(" 复制结果 "))]),_:1,__:[301]})):z("",!0)])]),default:l(()=>[nt.value?(r(),y("div",hp,[n("div",wp,[e[304]||(e[304]=n("span",{class:"streaming-status"},"🤖 AI正在润色中...",-1)),t(o,{size:"small",type:"text",onClick:Ya},{default:l(()=>[t(i,null,{default:l(()=>[t(P(kl))]),_:1}),e[303]||(e[303]=u(" 停止 "))]),_:1,__:[303]})]),n("div",Cp,[n("div",$p,v(ht.value),1)])])):K.value.optimizedContent?(r(),y("div",kp,[n("div",bp,v(K.value.optimizedContent),1),n("div",Vp,[n("span",null,"润色后字数："+v(K.value.optimizedContent.length),1),n("span",null,"字数变化："+v(K.value.optimizedContent.length-K.value.originalContent.length>0?"+":"")+v(K.value.optimizedContent.length-K.value.originalContent.length),1)])])):(r(),y("div",xp,[t(xn,{description:"点击润色按钮开始AI润色"})]))]),_:1})]),_:1})]),_:1})])]),_:1},8,["modelValue"]),t(ot,{modelValue:B.value,"onUpdate:modelValue":e[110]||(e[110]=s=>B.value=s),title:"AI智能续写",width:"1000px",top:"5vh",onClose:Na},{footer:l(()=>[n("div",Bp,[t(o,{onClick:e[109]||(e[109]=s=>B.value=!1)},{default:l(()=>e[317]||(e[317]=[u("取消")])),_:1,__:[317]}),t(o,{type:"primary",onClick:La,loading:$t.value,disabled:!yn.value},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Ot))]),_:1}),u(" "+v($t.value?"续写中...":"开始续写"),1)]),_:1},8,["loading","disabled"]),Oe.value&&!$t.value?(r(),j(o,{key:0,type:"success",onClick:Xa},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Vt))]),_:1}),e[318]||(e[318]=u(" 追加到文章 "))]),_:1,__:[318]})):z("",!0)])]),default:l(()=>[n("div",zp,[t(Pt,{gutter:20,style:{height:"100%"}},{default:l(()=>[t(Ye,{span:10,style:{height:"100%"}},{default:l(()=>[t(T,{shadow:"never",class:"continue-config-card"},{header:l(()=>e[308]||(e[308]=[n("div",{class:"card-header"},[n("span",null,"⚙️ 续写配置")],-1)])),default:l(()=>[n("div",Ip,[e[309]||(e[309]=n("h4",null,"续写方向",-1)),t(A,{modelValue:at.value.direction,"onUpdate:modelValue":e[107]||(e[107]=s=>at.value.direction=s),type:"textarea",rows:6,placeholder:`请描述续写方向，例如：
- 推进主角与反派的对决
- 展现角色内心的纠结
- 描写紧张的追逐场面
- 揭示重要的秘密

留空将根据大纲和前文自动续写`},null,8,["modelValue"])]),n("div",Tp,[e[310]||(e[310]=n("h4",null,"续写字数",-1)),t(to,{modelValue:at.value.wordCount,"onUpdate:modelValue":e[108]||(e[108]=s=>at.value.wordCount=s),min:200,max:5e3,step:100,"show-stops":"","show-input":""},null,8,["modelValue"]),e[311]||(e[311]=n("div",{class:"word-count-tips"},[n("span",null,"建议：200-1000字为佳，最多支持5000字")],-1))]),n("div",Ap,[e[312]||(e[312]=n("h4",null,"当前内容",-1)),t(A,{"model-value":qa(),type:"textarea",rows:6,readonly:"",placeholder:"暂无内容",style:{"max-height":"150px"}},null,8,["model-value"]),n("div",Pp," 当前字数："+v(dl.value),1)])]),_:1})]),_:1}),t(Ye,{span:14,style:{height:"100%"}},{default:l(()=>[t(T,{shadow:"never",class:"continue-result-card"},{header:l(()=>[n("div",Mp,[e[314]||(e[314]=n("span",null,"✍️ 续写结果",-1)),Oe.value&&!$t.value?(r(),j(o,{key:0,type:"success",size:"small",onClick:Ha},{default:l(()=>[t(i,null,{default:l(()=>[t(P(Nl))]),_:1}),e[313]||(e[313]=u(" 复制结果 "))]),_:1,__:[313]})):z("",!0)])]),default:l(()=>[$t.value?(r(),y("div",Dp,[n("div",Up,[e[316]||(e[316]=n("span",{class:"streaming-status"},"🤖 AI正在续写中...",-1)),t(o,{size:"small",type:"text",onClick:Ga},{default:l(()=>[t(i,null,{default:l(()=>[t(P(kl))]),_:1}),e[315]||(e[315]=u(" 停止 "))]),_:1,__:[315]})]),n("div",Ep,[n("div",Rp,v(Oe.value),1)])])):Oe.value?(r(),y("div",Wp,[n("div",Fp,v(Oe.value),1),n("div",Op,[n("span",null,"续写字数："+v(Oe.value.length),1),n("span",null,"总字数："+v(dl.value+Oe.value.length),1)])])):(r(),y("div",jp,[t(xn,{description:"点击续写按钮开始AI续写"})]))]),_:1})]),_:1})]),_:1})])]),_:1},8,["modelValue"])])}}},Np=Sl(qp,[["__scopeId","data-v-70b4451d"]]),w1=Object.freeze(Object.defineProperty({__proto__:null,default:Np},Symbol.toStringTag,{value:"Module"}));const Lp={class:"focus-toolbar"},Gp={class:"toolbar-left"},Hp={class:"toolbar-center"},Xp={class:"toolbar-timer"},Kp={class:"toolbar-words"},Jp={class:"toolbar-goal-text"},Yp={class:"toolbar-right"},Zp={class:"right-panel"},Qp={class:"panel-section"},em={class:"pomodoro-ring"},tm={viewBox:"0 0 120 120",class:"ring-svg"},lm=["stroke"],nm=["stroke","stroke-dasharray","stroke-dashoffset"],am={class:"ring-text"},sm={class:"ring-time"},om={class:"ring-label"},im={class:"pomodoro-controls"},um={class:"pomodoro-count"},rm={class:"panel-section"},dm={class:"sound-grid"},cm=["onClick","title"],vm={class:"volume-control"},pm={class:"panel-section"},mm={class:"setting-row"},fm={class:"setting-value"},gm={class:"setting-row"},_m={class:"setting-value"},ym={class:"setting-row"},hm={class:"setting-value"},wm={class:"panel-section"},Cm={class:"theme-grid"},$m=["onClick"],km={class:"theme-name"},bm={class:"status-left"},Vm={class:"status-center"},xm={class:"status-right"},Sm={__name:"FocusMode",setup(et){const fe=en(),N=No(),Z=Xo(N.config),ne=p(!1),de=p(!1),k=p(!0),I=p(""),U=p(null),H=p([{id:"p1",title:"我的小说"},{id:"p2",title:"短篇集"}]),Ee=p("p1"),ve=p([{id:"c1",title:"第一章 开始"},{id:"c2",title:"第二章 发展"}]),xe=p("c1"),$e=p(!1),pe=p(0),ue=p("idle"),ke=p(0),Ce=p(0);let be=null;const Me=p(Z.typography.fontSize),Ie=p(Z.typography.lineHeight),E=p(Z.typography.paragraphSpacing),L=p(""),se=p(50);let ge=null,_e=null,re=null;const Ke=p(Z.theme.preset),J=Z.themePresets,C=Z.availableSounds,R=he(()=>I.value.replace(/\s/g,"").length),h=he(()=>{const $=I.value.match(/[。！？；…]+/g);return $?$.length:0}),Q=he(()=>I.value.trim()?I.value.split(/\n+/).filter($=>$.trim()).length:0),Se=he(()=>{const $=Z.wordGoal.dailyGoal;return $>0?Math.min(100,Math.round(R.value/$*100)):0}),ye=he(()=>{const $=Math.floor(Ce.value/60),x=Ce.value%60;return`${String($).padStart(2,"0")}:${String(x).padStart(2,"0")}`}),Be=he(()=>{const $=Math.floor(Ce.value/3600),x=Math.floor(Ce.value%3600/60),Ve=Ce.value%60;return $>0?`${$}时${x}分${Ve}秒`:`${x}分${Ve}秒`}),Ze=he(()=>{const $=Ce.value/60;return $>0?Math.round(R.value/$):0}),Re=he(()=>{const $=Math.floor(pe.value/60),x=pe.value%60;return`${String($).padStart(2,"0")}:${String(x).padStart(2,"0")}`}),qe=he(()=>({idle:"准备就绪",working:"专注写作",short_break:"短休息",long_break:"长休息"})[ue.value]||"准备就绪"),Y=he(()=>2*Math.PI*52),ce=he(()=>{const $=ue.value==="working"?Z.timer.workDuration*60:ue.value==="short_break"?Z.timer.shortBreakDuration*60:ue.value==="long_break"?Z.timer.longBreakDuration*60:Z.timer.workDuration*60,x=$>0?pe.value/$:0;return Y.value*(1-x)}),q=he(()=>Z.theme.textColor==="#e0e0e0"?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"),We=he(()=>({backgroundColor:Z.theme.backgroundColor,color:Z.theme.textColor,caretColor:Z.theme.cursorColor})),Ne=he(()=>({fontFamily:Z.typography.fontFamily,fontSize:Me.value+"px",lineHeight:Ie.value,letterSpacing:Z.typography.letterSpacing+"px"})),ie=he(()=>({backgroundColor:"transparent",color:Z.theme.textColor,caretColor:Z.theme.cursorColor,fontSize:Me.value+"px",lineHeight:Ie.value,letterSpacing:Z.typography.letterSpacing+"px",textIndent:Z.typography.textIndent+"em",maxHeight:"none",overflow:"hidden"})),ft=he(()=>({backgroundColor:Z.theme.textColor==="#e0e0e0"?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)",color:Z.theme.textColor,opacity:.6}));function Ae($){$.clientY<40&&(ne.value=!0)}function jt(){de.value=!de.value}function St(){var $;($=U.value)==null||$.focus()}function Bt(){N.updateWordCount(R.value)}function gt($){$.ctrlKey&&$.key==="s"&&($.preventDefault(),m.success("内容已保存")),$.key==="Escape"&&W(),$.key==="F11"&&($.preventDefault(),ct())}function ct(){var $,x,Ve;document.fullscreenElement?(Ve=document.exitFullscreen)==null||Ve.call(document):(x=($=document.documentElement).requestFullscreen)==null||x.call($)}function W(){N.exitFocusMode(),yt(),Ct(),fe.back()}function _t(){$e.value?Et():De()}function De(){ue.value==="idle"&&(ue.value="working",pe.value=Z.timer.workDuration*60),$e.value=!0,N.startPomodoro(),N.onPomodoroChange(($,x)=>{ue.value=$,pe.value=x,$==="working"&&(ke.value=N.totalPomodoros)})}function Et(){$e.value=!1,N.pausePomodoro()}function vt(){$e.value=!1,ue.value="idle",pe.value=0,N.resetPomodoro()}function tt(){be=setInterval(()=>{Ce.value++},1e3)}function yt(){be&&(clearInterval(be),be=null)}function pt($){if(L.value===$){Ct(),L.value="";return}Ct(),L.value=$,Fe($)}function Fe($){try{ge=new(Tn.AudioContext||Tn.webkitAudioContext);const x=2*ge.sampleRate,Ve=ge.createBuffer(1,x,ge.sampleRate),lt=Ve.getChannelData(0);if($.replace(/-.*/g,"")==="white-noise"||$==="white-noise")for(let Pe=0;Pe<x;Pe++)lt[Pe]=Math.random()*2-1;else if($==="pink-noise"){let Pe=0,ze=0,ae=0,X=0,K=0,Tt=0,ht=0;for(let nt=0;nt<x;nt++){const B=Math.random()*2-1;Pe=.99886*Pe+B*.0555179,ze=.99332*ze+B*.0750759,ae=.969*ae+B*.153852,X=.8665*X+B*.3104856,K=.55*K+B*.5329522,Tt=-.7616*Tt-B*.016898,lt[nt]=(Pe+ze+ae+X+K+Tt+ht+B*.5362)*.11,ht=B*.115926}}else{let Pe=0;for(let ze=0;ze<x;ze++){const ae=Math.random()*2-1;lt[ze]=(Pe+.02*ae)/1.02,Pe=lt[ze],lt[ze]*=3.5}}_e=ge.createBufferSource(),_e.buffer=Ve,_e.loop=!0,re=ge.createGain(),re.gain.value=se.value/100*.3,_e.connect(re),re.connect(ge.destination),_e.start()}catch(x){console.warn("音效播放失败:",x)}}function Ct(){var $;if(_e){try{_e.stop()}catch(x){}_e=null}ge&&(($=ge.close)==null||$.call(ge),ge=null)}function b($){re&&(re.gain.value=$/100*.3)}function f($){N.applyThemePreset($),Ke.value=$}return bl(()=>{N.enterFocusMode({chapterId:xe.value,projectId:Ee.value}),tt(),Zt(()=>{var $;($=U.value)==null||$.focus()}),setTimeout(()=>{k.value=!1},600)}),Ko(()=>{yt(),Ct(),N.exitFocusMode()}),($,x)=>{const Ve=Jl,lt=Yl,it=To,Pe=xl,ze=Vl,ae=Zl;return r(),j(ol,{name:"focus-fade"},{default:l(()=>[n("div",{class:"focus-mode",style:sl(We.value),onMousemove:Ae,onMouseleave:x[8]||(x[8]=X=>ne.value=!1)},[t(ol,{name:"slide-down"},{default:l(()=>[mt(n("div",Lp,[n("div",Gp,[t(lt,{modelValue:Ee.value,"onUpdate:modelValue":x[0]||(x[0]=X=>Ee.value=X),placeholder:"选择项目",size:"small",style:{width:"140px"}},{default:l(()=>[(r(!0),y(te,null,le(H.value,X=>(r(),j(Ve,{key:X.id,label:X.title,value:X.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),t(lt,{modelValue:xe.value,"onUpdate:modelValue":x[1]||(x[1]=X=>xe.value=X),placeholder:"选择章节",size:"small",style:{width:"140px"}},{default:l(()=>[(r(!0),y(te,null,le(ve.value,X=>(r(),j(Ve,{key:X.id,label:X.title,value:X.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),n("div",Hp,[n("span",Xp,v(ye.value),1),x[9]||(x[9]=n("span",{class:"toolbar-divider"},"|",-1)),n("span",Kp,v(R.value)+" 字",1),x[10]||(x[10]=n("span",{class:"toolbar-divider"},"|",-1)),t(it,{percentage:Se.value,"stroke-width":6,"show-text":!1,style:{width:"120px"},color:Z.theme.cursorColor},null,8,["percentage","color"]),n("span",Jp,v(Se.value)+"%",1)]),n("div",Yp,[t(ze,{size:"small",text:"",onClick:jt},{default:l(()=>[t(Pe,null,{default:l(()=>[t(P(Un))]),_:1})]),_:1}),t(ze,{size:"small",type:"danger",text:"",onClick:W},{default:l(()=>[t(Pe,null,{default:l(()=>[t(P(kl))]),_:1}),x[11]||(x[11]=u(" 退出 "))]),_:1,__:[11]})])],512),[[xt,ne.value]])]),_:1}),n("div",{class:"editor-area",style:sl(Ne.value),onClick:St},[mt(n("textarea",{ref_key:"editorRef",ref:U,"onUpdate:modelValue":x[2]||(x[2]=X=>I.value=X),class:"focus-editor",style:sl(ie.value),placeholder:"开始写作...",onInput:Bt,onKeydown:gt,spellcheck:"false"},null,36),[[Wn,I.value]])],4),t(ol,{name:"slide-left"},{default:l(()=>[mt(n("div",Zp,[n("div",Qp,[x[13]||(x[13]=n("h4",{class:"panel-title"},"番茄钟",-1)),n("div",em,[(r(),y("svg",tm,[n("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:q.value,"stroke-width":"6"},null,8,lm),n("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:Z.theme.cursorColor,"stroke-width":"6","stroke-linecap":"round","stroke-dasharray":Y.value,"stroke-dashoffset":ce.value,transform:"rotate(-90 60 60)",class:"ring-progress"},null,8,nm)])),n("div",am,[n("span",sm,v(Re.value),1),n("span",om,v(qe.value),1)])]),n("div",im,[t(ze,{size:"small",round:"",onClick:_t},{default:l(()=>[u(v($e.value?"暂停":"开始"),1)]),_:1}),t(ze,{size:"small",round:"",onClick:vt},{default:l(()=>x[12]||(x[12]=[u("重置")])),_:1,__:[12]})]),n("div",um,"已完成 "+v(ke.value)+" 个番茄钟",1)]),n("div",rm,[x[14]||(x[14]=n("h4",{class:"panel-title"},"环境音效",-1)),n("div",dm,[(r(!0),y(te,null,le(P(C),X=>(r(),y("button",{key:X.id,class:we(["sound-btn",{active:L.value===X.id}]),onClick:K=>pt(X.id),title:X.description},[t(Pe,null,{default:l(()=>[(r(),j(Jo(X.icon)))]),_:2},1024),n("span",null,v(X.name),1)],10,cm))),128))]),n("div",vm,[t(Pe,null,{default:l(()=>[t(P(Io))]),_:1}),t(ae,{modelValue:se.value,"onUpdate:modelValue":x[3]||(x[3]=X=>se.value=X),min:0,max:100,size:"small",onInput:b},null,8,["modelValue"])])]),n("div",pm,[x[18]||(x[18]=n("h4",{class:"panel-title"},"排版设置",-1)),n("div",mm,[x[15]||(x[15]=n("label",null,"字号",-1)),t(ae,{modelValue:Me.value,"onUpdate:modelValue":x[4]||(x[4]=X=>Me.value=X),min:14,max:32,step:1,size:"small",style:{flex:"1"}},null,8,["modelValue"]),n("span",fm,v(Me.value)+"px",1)]),n("div",gm,[x[16]||(x[16]=n("label",null,"行高",-1)),t(ae,{modelValue:Ie.value,"onUpdate:modelValue":x[5]||(x[5]=X=>Ie.value=X),min:1.2,max:3,step:.1,size:"small",style:{flex:"1"}},null,8,["modelValue"]),n("span",_m,v(Ie.value),1)]),n("div",ym,[x[17]||(x[17]=n("label",null,"段间距",-1)),t(ae,{modelValue:E.value,"onUpdate:modelValue":x[6]||(x[6]=X=>E.value=X),min:4,max:40,step:2,size:"small",style:{flex:"1"}},null,8,["modelValue"]),n("span",hm,v(E.value)+"px",1)])]),n("div",wm,[x[19]||(x[19]=n("h4",{class:"panel-title"},"颜色主题",-1)),n("div",Cm,[(r(!0),y(te,null,le(P(J),X=>(r(),y("div",{key:X.id,class:we(["theme-card",{active:Ke.value===X.id}]),onClick:K=>f(X.id)},[n("div",{class:"theme-preview",style:sl({background:X.theme.backgroundColor,color:X.theme.textColor})}," Aa ",4),n("span",km,v(X.name),1)],10,$m))),128))])])],512),[[xt,de.value]])]),_:1}),n("div",{class:"status-bar",style:sl(ft.value)},[n("div",bm,[n("span",null,v(R.value)+" 字",1),x[20]||(x[20]=n("span",{class:"status-divider"},"|",-1)),n("span",null,v(h.value)+" 句",1),x[21]||(x[21]=n("span",{class:"status-divider"},"|",-1)),n("span",null,v(Q.value)+" 段",1)]),n("div",Vm,[n("span",null,"已用 "+v(Be.value),1)]),n("div",xm,[n("span",null,v(Ze.value)+" 字/分钟",1)])],4),t(ol,{name:"focus-fade"},{default:l(()=>[k.value?(r(),y("div",{key:0,class:"enter-overlay",onAnimationend:x[7]||(x[7]=X=>k.value=!1)},null,32)):z("",!0)]),_:1})],36)]),_:1})}}},zm=Sl(Sm,[["__scopeId","data-v-ef4332da"]]),C1=Object.freeze(Object.defineProperty({__proto__:null,default:zm},Symbol.toStringTag,{value:"Module"}));const Im={class:"writer-header"},Tm={class:"header-left"},Am={class:"chapter-title"},Pm={class:"project-name"},Mm={class:"header-right"},Dm={class:"editor-container"},Um={key:0,class:"autosave-toast"},Em={class:"writer-footer"},Rm={class:"footer-left"},Wm={class:"word-count"},Fm={class:"char-count"},Om={class:"footer-center"},jm={class:"footer-right"},Bm={class:"focus-footer"},qm={class:"focus-word-count"},Nm={class:"focus-time"},Lm={class:"chapters-list"},Gm=["onClick"],Hm={class:"chapter-info"},Xm={class:"chapter-order"},Km={class:"chapter-name"},Jm={class:"tools-grid"},Ym={class:"settings-list"},Zm={class:"setting-item"},Qm={class:"setting-value"},e1={class:"setting-item"},t1={class:"setting-value"},l1={class:"setting-item"},n1={class:"setting-item"},a1={class:"setting-item"},s1={class:"template-list"},o1=["onClick"],i1={class:"template-name"},u1={class:"template-preview"},r1={__name:"MobileWriter",setup(et){Yo(b=>({"882f94b0":be.value+"px","1e3fbd70":Me.value}));const fe=en(),N=En(),Z=Ql(),ne=p(""),de=p(null),k=p(null),I=p([]),U=p(!1),H=p("保存"),Ee=p(!1),ve=p(!1),xe=p(!1),$e=p(!1),pe=p(!1),ue=p(!1),ke=p(!1),Ce=p(!1),be=p(18),Me=p(1.8),Ie=p(!0),E=p(!1),L=p(!0),se=p(""),ge=p(""),_e=p("after"),re=p(null);let Ke=null,J="";const C=p(0);let R=null,h=Date.now();const Q=p(0),Se=p(0),ye=he(()=>{const b=ne.value||"",f=(b.match(/[\u4e00-\u9fa5]/g)||[]).length,$=(b.match(/[a-zA-Z]+/g)||[]).length;return f+$}),Be=he(()=>(ne.value||"").length);he(()=>({fontSize:`${be.value}px`,lineHeight:Me.value}));const Ze=()=>{ne.value!==J?It.confirm("有未保存的内容，是否保存后退出？","确认退出",{confirmButtonText:"保存并退出",cancelButtonText:"直接退出",type:"warning",distinguishCancelAndClose:!0}).then(()=>{ce().then(()=>fe.back())}).catch(b=>{b==="cancel"&&fe.back()}):fe.back()},Re=()=>{h=Date.now(),Ke&&clearTimeout(Ke),Ie.value&&(Ke=setTimeout(()=>{Y()},3e4))},qe=b=>{(b.ctrlKey||b.metaKey)&&b.key==="s"&&(b.preventDefault(),ce())},Y=()=>oe(this,null,function*(){if(ne.value!==J)try{yield ce(),Ee.value=!0,setTimeout(()=>{Ee.value=!1},2e3)}catch(b){console.error("自动保存失败:",b)}}),ce=()=>oe(this,null,function*(){if(!k.value){m.warning("请先选择章节");return}U.value=!0,H.value="保存中...";try{yield Dt.updateChapter(k.value.id,{content:ne.value,wordCount:ye.value}),J=ne.value,H.value="已保存",yield Dt.statistics.recordWritingSession(de.value.id,ye.value,C.value),setTimeout(()=>{H.value="保存"},2e3)}catch(b){console.error("保存失败:",b),H.value="保存失败",m.error("保存失败")}finally{U.value=!1}}),q=()=>{ve.value=!ve.value,ve.value?L.value&&"wakeLock"in navigator&&Ne():ie()};let We=null;const Ne=()=>oe(this,null,function*(){try{We=yield navigator.wakeLock.request("screen")}catch(b){console.error("请求屏幕常亮失败:",b)}}),ie=()=>{We&&(We.release(),We=null)},ft=b=>{const f=Math.floor(b/60),$=b%60;return`${f.toString().padStart(2,"0")}:${$.toString().padStart(2,"0")}`},Ae=b=>oe(this,null,function*(){k.value&&ne.value!==J&&(yield ce()),k.value=b,ne.value=b.content||"",J=ne.value,xe.value=!1,se.value=b.title}),jt=()=>oe(this,null,function*(){if(!k.value||!se.value.trim()){m.warning("请输入章节标题");return}try{yield Dt.updateChapter(k.value.id,{title:se.value}),k.value.title=se.value,ue.value=!1,m.success("标题已更新")}catch(b){console.error("更新标题失败:",b),m.error("更新失败")}}),St=()=>{xe.value=!1,ge.value="",ke.value=!0},Bt=()=>oe(this,null,function*(){if(!ge.value.trim()){m.warning("请输入章节标题");return}Ce.value=!0;try{let b=I.value.length+1;if(_e.value==="after"&&k.value){b=k.value.order+1;for(const x of I.value)x.order>=b&&(yield Dt.updateChapter(x.id,{order:x.order+1}))}const f=yield Dt.createChapter({projectId:de.value.id,title:ge.value,content:"",order:b,status:"draft"});yield Fe();const $=I.value.find(x=>x.id===f);$&&(yield Ae($)),ke.value=!1,m.success("章节创建成功")}catch(b){console.error("创建章节失败:",b),m.error("创建失败")}finally{Ce.value=!1}}),gt=p(!1),ct=[{id:"opening",name:"开头模板",content:`故事发生在一个看似平凡的小镇上。没有人注意到，那个深秋的傍晚，一个陌生人悄然走进了镇上唯一的旅馆。

`},{id:"conflict",name:"转折模板",content:`就在一切看似平静的时候，一封突如其来的信件打破了所有的宁静。信上只有短短一行字，却让所有人的命运从此改变。

`},{id:"climax",name:"高潮模板",content:`风声呼啸，雨点如注。他站在悬崖边，身后是穷追不舍的敌人，面前是万丈深渊。没有退路，也没有选择。

`},{id:"ending",name:"结尾模板",content:`多年以后，当他再次回到这个地方时，一切都已物是人非。唯有那棵老槐树依然伫立在村口，见证着岁月的流转。

`},{id:"dialogue",name:"对话模板",content:`"你以为这就是结局了吗？"他冷冷地说道，嘴角微微上扬。

她握紧了拳头，努力让自己保持冷静："不，这只是开始。"

`},{id:"description",name:"环境描写模板",content:`夕阳西下，金色的余晖洒满了整个山谷。远处的溪流在暮色中闪烁着微光，空气中弥漫着泥土和野花的芬芳。几只归巢的飞鸟划过天际，留下一串悠长的鸣叫。

`}],W=()=>{$e.value=!1,gt.value=!0},_t=b=>{!ne.value||ne.value.endsWith(`
`)?ne.value+=b.content:ne.value+=`

`+b.content,gt.value=!1,m.success(`已插入「${b.name}」`)},De=p(!1),Et=()=>oe(this,null,function*(){if($e.value=!1,!ne.value.trim()){m.warning("请先写一些内容，AI 将根据上下文进行续写");return}De.value=!0;try{const f=`请根据以下小说内容，续写约200-300字的后续情节，保持风格和语调一致：

${ne.value.slice(-500)}`,$=yield Z.generateContent(f);$&&(ne.value+=`

`+$,m.success("AI 续写完成"))}catch(b){console.error("AI续写失败:",b),m.error("AI续写失败，请检查API配置")}finally{De.value=!1}}),vt=()=>oe(this,null,function*(){if($e.value=!1,!k.value){m.warning("请先选择章节");return}try{const b=new Blob([ne.value],{type:"text/plain;charset=utf-8"}),f=URL.createObjectURL(b),$=document.createElement("a");$.href=f,$.download=`${k.value.title}.txt`,$.click(),URL.revokeObjectURL(f),m.success("导出成功")}catch(b){console.error("导出失败:",b),m.error("导出失败")}}),tt=b=>{Q.value=b.touches[0].clientX,Se.value=b.touches[0].clientY},yt=b=>{const f=b.changedTouches[0].clientX,$=b.changedTouches[0].clientY,x=f-Q.value,Ve=$-Se.value;Math.abs(x)>Math.abs(Ve)&&x<-100&&Q.value<50&&Ze()},pt=b=>oe(this,null,function*(){try{de.value=yield Dt.getProject(b)}catch(f){console.error("加载项目失败:",f),m.error("加载项目失败")}}),Fe=()=>oe(this,null,function*(){if(de.value)try{I.value=yield Dt.getChapters(de.value.id)}catch(b){console.error("加载章节失败:",b)}}),Ct=b=>oe(this,null,function*(){try{const f=yield Dt.getChapter(b);f&&(k.value=f,ne.value=f.content||"",J=ne.value,se.value=f.title)}catch(f){console.error("加载章节失败:",f)}});return bl(()=>oe(this,null,function*(){const{projectId:b,chapterId:f}=N.query;b&&(yield pt(parseInt(b)),yield Fe(),f?yield Ct(parseInt(f)):I.value.length>0&&(yield Ae(I.value[0]))),R=setInterval(()=>{Date.now()-h<3e4&&C.value++},1e3),document.addEventListener("touchstart",tt),document.addEventListener("touchend",yt)})),Rn(()=>{Ke&&clearTimeout(Ke),R&&clearInterval(R),ie(),document.removeEventListener("touchstart",tt),document.removeEventListener("touchend",yt)}),Ut([be,Me,Ie,E,L],()=>{localStorage.setItem("writer_settings",JSON.stringify({fontSize:be.value,lineHeight:Me.value,autoSaveEnabled:Ie.value,typingSoundEnabled:E.value,keepScreenOn:L.value}))}),bl(()=>{const b=localStorage.getItem("writer_settings");if(b)try{const f=JSON.parse(b);be.value=f.fontSize||18,Me.value=f.lineHeight||1.8,Ie.value=f.autoSaveEnabled!==!1,E.value=f.typingSoundEnabled||!1,L.value=f.keepScreenOn!==!1}catch(f){console.error("加载设置失败:",f)}}),(b,f)=>{var ht,nt;const $=xl,x=Vl,Ve=Ao,lt=Zl,it=Ro,Pe=Xl,ze=Pn,ae=Kl,X=Dn,K=Gl,Tt=Hl;return r(),y("div",{class:we(["mobile-writer",{"focus-mode":ve.value}])},[mt(n("div",Im,[n("div",Tm,[t(x,{type:"text",onClick:Ze},{default:l(()=>[t($,null,{default:l(()=>[t(P(il))]),_:1})]),_:1}),n("div",{class:"title-section",onClick:f[0]||(f[0]=B=>ue.value=!0)},[n("h1",Am,v(((ht=k.value)==null?void 0:ht.title)||"未命名章节"),1),n("p",Pm,v(((nt=de.value)==null?void 0:nt.name)||"未选择项目"),1)])]),n("div",Mm,[t(x,{type:"primary",text:"",loading:U.value,onClick:ce},{default:l(()=>[U.value?z("",!0):(r(),j($,{key:0},{default:l(()=>[t(P(Vt))]),_:1})),n("span",null,v(H.value),1)]),_:1},8,["loading"]),t(x,{type:"text",onClick:f[1]||(f[1]=B=>pe.value=!0)},{default:l(()=>[t($,null,{default:l(()=>[t(P(Un))]),_:1})]),_:1})])],512),[[xt,!ve.value]]),mt(n("div",{class:"focus-exit",onClick:q},[t($,null,{default:l(()=>[t(P(kl))]),_:1})],512),[[xt,ve.value]]),n("div",Dm,[mt(n("textarea",{ref_key:"editorRef",ref:re,"onUpdate:modelValue":f[2]||(f[2]=B=>ne.value=B),class:"writer-editor",placeholder:"开始你的创作...",onInput:Re,onKeydown:qe},null,544),[[Wn,ne.value]]),t(ol,{name:"fade"},{default:l(()=>[Ee.value?(r(),y("div",Um,[t($,null,{default:l(()=>[t(P(Po))]),_:1}),f[23]||(f[23]=n("span",null,"已自动保存",-1))])):z("",!0)]),_:1})]),mt(n("div",Em,[n("div",Rm,[n("span",Wm,[t($,null,{default:l(()=>[t(P(Mn))]),_:1}),u(" "+v(ye.value)+" 字 ",1)]),n("span",Fm,v(Be.value)+" 字符 ",1)]),n("div",Om,[t(x,{type:"primary",text:"",size:"small",onClick:q},{default:l(()=>[t($,null,{default:l(()=>[t(P(Mo))]),_:1}),f[24]||(f[24]=u(" 专注 "))]),_:1,__:[24]})]),n("div",jm,[t(x,{type:"text",size:"small",onClick:f[3]||(f[3]=B=>xe.value=!0)},{default:l(()=>[t($,null,{default:l(()=>[t(P(Do))]),_:1}),f[25]||(f[25]=u(" 章节 "))]),_:1,__:[25]}),t(x,{type:"text",size:"small",onClick:f[4]||(f[4]=B=>$e.value=!0)},{default:l(()=>[t($,null,{default:l(()=>[t(P($l))]),_:1}),f[26]||(f[26]=u(" 工具 "))]),_:1,__:[26]})])],512),[[xt,!ve.value]]),mt(n("div",Bm,[n("span",qm,v(ye.value)+" 字",1),n("span",Nm,v(ft(C.value)),1)],512),[[xt,ve.value]]),t(Ve,{modelValue:xe.value,"onUpdate:modelValue":f[5]||(f[5]=B=>xe.value=B),title:"章节列表",direction:"ltr",size:"80%",class:"chapters-drawer"},{footer:l(()=>[t(x,{type:"primary",onClick:St},{default:l(()=>[t($,null,{default:l(()=>[t(P(Yt))]),_:1}),f[27]||(f[27]=u(" 新建章节 "))]),_:1,__:[27]})]),default:l(()=>[n("div",Lm,[(r(!0),y(te,null,le(I.value,B=>{var at,Oe;return r(),y("div",{key:B.id,class:we(["chapter-item",{active:((at=k.value)==null?void 0:at.id)===B.id}]),onClick:$t=>Ae(B)},[n("div",Hm,[n("span",Xm,"第"+v(B.order)+"章",1),n("span",Km,v(B.title),1)]),((Oe=k.value)==null?void 0:Oe.id)===B.id?(r(),j($,{key:0},{default:l(()=>[t(P(Vt))]),_:1})):z("",!0)],10,Gm)}),128))])]),_:1},8,["modelValue"]),t(Ve,{modelValue:$e.value,"onUpdate:modelValue":f[7]||(f[7]=B=>$e.value=B),title:"写作工具",direction:"btt",size:"60%",class:"tools-drawer"},{default:l(()=>[n("div",Jm,[n("div",{class:"tool-item",onClick:W},[t($,null,{default:l(()=>[t(P(Uo))]),_:1}),f[28]||(f[28]=n("span",null,"插入模板",-1))]),n("div",{class:"tool-item",onClick:Et},[t($,null,{default:l(()=>[t(P(ul))]),_:1}),f[29]||(f[29]=n("span",null,"AI续写",-1))]),n("div",{class:"tool-item",onClick:f[6]||(f[6]=B=>b.showHistory=!0)},[t($,null,{default:l(()=>[t(P(An))]),_:1}),f[30]||(f[30]=n("span",null,"历史版本",-1))]),n("div",{class:"tool-item",onClick:vt},[t($,null,{default:l(()=>[t(P(Eo))]),_:1}),f[31]||(f[31]=n("span",null,"导出",-1))])])]),_:1},8,["modelValue"]),t(Ve,{modelValue:pe.value,"onUpdate:modelValue":f[13]||(f[13]=B=>pe.value=B),title:"编辑器设置",direction:"rtl",size:"80%",class:"settings-drawer"},{default:l(()=>[n("div",Ym,[n("div",Zm,[f[32]||(f[32]=n("span",{class:"setting-label"},"字体大小",-1)),t(lt,{modelValue:be.value,"onUpdate:modelValue":f[8]||(f[8]=B=>be.value=B),min:14,max:24,step:1,"show-stops":""},null,8,["modelValue"]),n("span",Qm,v(be.value)+"px",1)]),n("div",e1,[f[33]||(f[33]=n("span",{class:"setting-label"},"行间距",-1)),t(lt,{modelValue:Me.value,"onUpdate:modelValue":f[9]||(f[9]=B=>Me.value=B),min:1.5,max:2.5,step:.1,"show-stops":""},null,8,["modelValue"]),n("span",t1,v(Me.value),1)]),n("div",l1,[f[34]||(f[34]=n("span",{class:"setting-label"},"自动保存",-1)),t(it,{modelValue:Ie.value,"onUpdate:modelValue":f[10]||(f[10]=B=>Ie.value=B)},null,8,["modelValue"])]),n("div",n1,[f[35]||(f[35]=n("span",{class:"setting-label"},"打字音效",-1)),t(it,{modelValue:E.value,"onUpdate:modelValue":f[11]||(f[11]=B=>E.value=B)},null,8,["modelValue"])]),n("div",a1,[f[36]||(f[36]=n("span",{class:"setting-label"},"屏幕常亮",-1)),t(it,{modelValue:L.value,"onUpdate:modelValue":f[12]||(f[12]=B=>L.value=B)},null,8,["modelValue"])])])]),_:1},8,["modelValue"]),t(ze,{modelValue:ue.value,"onUpdate:modelValue":f[16]||(f[16]=B=>ue.value=B),title:"编辑章节标题",width:"90%",class:"mobile-dialog"},{footer:l(()=>[t(x,{onClick:f[15]||(f[15]=B=>ue.value=!1)},{default:l(()=>f[37]||(f[37]=[u("取消")])),_:1,__:[37]}),t(x,{type:"primary",onClick:jt},{default:l(()=>f[38]||(f[38]=[u("保存")])),_:1,__:[38]})]),default:l(()=>[t(Pe,{modelValue:se.value,"onUpdate:modelValue":f[14]||(f[14]=B=>se.value=B),placeholder:"输入章节标题",maxlength:"50","show-word-limit":""},null,8,["modelValue"])]),_:1},8,["modelValue"]),t(ze,{modelValue:ke.value,"onUpdate:modelValue":f[20]||(f[20]=B=>ke.value=B),title:"新建章节",width:"90%",class:"mobile-dialog"},{footer:l(()=>[t(x,{onClick:f[19]||(f[19]=B=>ke.value=!1)},{default:l(()=>f[41]||(f[41]=[u("取消")])),_:1,__:[41]}),t(x,{type:"primary",onClick:Bt,loading:Ce.value},{default:l(()=>f[42]||(f[42]=[u(" 创建 ")])),_:1,__:[42]},8,["loading"])]),default:l(()=>[t(Tt,{"label-position":"top"},{default:l(()=>[t(ae,{label:"章节标题"},{default:l(()=>[t(Pe,{modelValue:ge.value,"onUpdate:modelValue":f[17]||(f[17]=B=>ge.value=B),placeholder:"输入章节标题",maxlength:"50","show-word-limit":""},null,8,["modelValue"])]),_:1}),t(ae,{label:"插入位置"},{default:l(()=>[t(K,{modelValue:_e.value,"onUpdate:modelValue":f[18]||(f[18]=B=>_e.value=B)},{default:l(()=>[t(X,{label:"after"},{default:l(()=>f[39]||(f[39]=[u("当前章节之后")])),_:1,__:[39]}),t(X,{label:"end"},{default:l(()=>f[40]||(f[40]=[u("章节末尾")])),_:1,__:[40]})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),t(ze,{modelValue:gt.value,"onUpdate:modelValue":f[22]||(f[22]=B=>gt.value=B),title:"选择写作模板",width:"90%",class:"mobile-dialog"},{footer:l(()=>[t(x,{onClick:f[21]||(f[21]=B=>gt.value=!1)},{default:l(()=>f[43]||(f[43]=[u("取消")])),_:1,__:[43]})]),default:l(()=>[n("div",s1,[(r(),y(te,null,le(ct,B=>n("div",{key:B.id,class:"template-item",onClick:at=>_t(B)},[n("div",i1,v(B.name),1),n("div",u1,v(B.content.slice(0,60))+"...",1)],8,o1)),64))])]),_:1},8,["modelValue"]),f[44]||(f[44]=n("div",{class:"safe-area-bottom"},null,-1))],2)}}},d1=Sl(r1,[["__scopeId","data-v-828d9684"]]),$1=Object.freeze(Object.defineProperty({__proto__:null,default:d1},Symbol.toStringTag,{value:"Module"}));export{C1 as F,h1 as M,w1 as W,$1 as a};
