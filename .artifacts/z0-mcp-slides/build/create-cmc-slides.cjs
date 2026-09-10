const PptxGenJS = require('pptxgenjs');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'EMxAI';
pptx.title = 'CMC Coil 설계 GUI와 MCP 연결';
pptx.subject = 'CMC Coil design MCP training';
pptx.lang = 'ko-KR';
pptx.theme = { headFontFace:'Malgun Gothic', bodyFontFace:'Malgun Gothic', lang:'ko-KR' };

const C={navy:'172033',blue:'1976F3',violet:'6251D8',green:'0D9F6E',pale:'EAF3FF',paleV:'F4F1FF',paleG:'EEF9F5',gray:'68788E',line:'D7E3F0',white:'FFFFFF',orange:'D47B2D'};
const base=path.resolve(__dirname,'../../../deliverables/z0-mcp-slides/assets');
const gui=path.join(base,'cmc-gui-actual.png');
const coil=path.join(base,'cmc-coil-geometry-actual.png');
const out=path.resolve(__dirname,'../../../deliverables/z0-mcp-slides/CMC-Coil-MCP-training-v2.pptx');

function text(s,t,x,y,w,h,o={}){s.addText(t,{x,y,w,h,fontFace:o.fontFace||'Malgun Gothic',fontSize:o.fontSize||14,color:o.color||C.navy,bold:!!o.bold,align:o.align||'left',valign:o.valign||'mid',margin:o.margin===undefined?0:o.margin,fit:'shrink',...o});}
function box(s,x,y,w,h,fill='FFFFFF',line=C.line,r=0.12){s.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:r,fill:{color:fill},line:{color:line,width:1}});}
function pill(s,t,x,y,w,fill,color=C.white){box(s,x,y,w,.28,fill,fill);text(s,t,x,y,w,.28,{fontSize:10.5,bold:true,color,align:'center'});}
function header(s,t,sub){s.background={color:C.white};s.addShape(pptx.ShapeType.rect,{x:.17,y:.62,w:.10,h:.77,fill:{color:'4F46E5'},line:{color:'4F46E5'}});s.addShape(pptx.ShapeType.line,{x:.30,y:.94,w:12.57,h:0,line:{color:'60A5FA',width:1}});text(s,t,.58,.24,12.1,.48,{fontSize:28,bold:true});text(s,sub,.60,1.05,12,.26,{fontSize:10.5,color:C.gray});}
function footer(s,t,n){box(s,.72,6.54,11.88,.48,C.pale,C.pale);text(s,'핵심',1.14,6.65,.60,.24,{fontSize:13,bold:true,color:C.blue});text(s,t,2.05,6.62,9.9,.28,{fontSize:13.5,color:'34445C'});text(s,String(n),12.38,7.10,.45,.22,{fontSize:11,color:'7A8492',align:'right'});}
function noticeFooter(s,t,n){box(s,.72,6.48,11.88,.56,'FFF7E8','F3D5A1');text(s,'안내',1.08,6.63,.62,.22,{fontSize:12,bold:true,color:'B96A16'});text(s,t,1.84,6.57,10.42,.34,{fontSize:10.7,color:'5F4A2E'});text(s,String(n),12.38,7.10,.45,.22,{fontSize:11,color:'7A8492',align:'right'});}

// 41. Actual GUI anatomy
{
 const s=pptx.addSlide();
 header(s,'CMC Coil 설계 GUI의 입력과 출력','실제 제작된 CMC DESIGN LAB 화면을 기준으로 설계 변수와 결과를 구분합니다.');
 text(s,'실제 GUI',.72,1.46,1.3,.28,{fontSize:16,bold:true,color:C.blue});
 box(s,.72,1.80,8.24,4.43,'F7FAFD','BFD3E8');
 s.addImage({path:gui,x:.82,y:1.91,w:8.04,h:4.18});
 // mask the captured desktop outside the app window
 s.addShape(pptx.ShapeType.rect,{x:.82,y:1.91,w:.78,h:4.18,fill:{color:'FFFFFF',transparency:100},line:{color:'FFFFFF',transparency:100}});
 text(s,'설계 입력',9.30,1.46,1.42,.28,{fontSize:16,bold:true,color:C.violet});
 const ins=[['권선 수','8 turns × 2'],['코어 형상','F3 기준형 20/32/8 mm'],['선경','0.8 mm'],['권선 피치','3°']];
 ins.forEach((v,i)=>{const y=1.86+i*.55; text(s,v[0],9.30,y,1.02,.22,{fontSize:10.5,color:C.gray});text(s,v[1],10.33,y,2.27,.22,{fontSize:11.5,bold:true});});
 s.addShape(pptx.ShapeType.line,{x:9.30,y:4.15,w:3.30,h:0,line:{color:C.line,width:1}});
 text(s,'계산 출력',9.30,4.34,1.42,.28,{fontSize:16,bold:true,color:C.green});
 const outs=[['형상','3D 이중 권선 미리보기'],['특성','|ZCM| · |ZDM| 주파수 곡선'],['편차','검증 오차 참고 범위 (P90 21.43%)'],['FSV','ADM .0126 / FDM .0134 / GDM .0210'],['등급','Excellent 8/8'],['모델','SPICE Subcircuit 생성']];
 outs.forEach((v,i)=>{const y=4.68+i*.27;text(s,v[0],9.30,y,.70,.18,{fontSize:9.5,color:C.gray});text(s,v[1],10.02,y,2.58,.18,{fontSize:i===3?8.8:9.6,bold:true,color:i===5?C.blue:C.navy});});
 noticeFooter(s,'공개된 내용은 교육 참가자를 위한 내용으로 실무사용시는 재료 입력, 주파수 확장, 편차고려 등 추가 사항들이 있어, 문의 후 사용이 필요합니다.',41);
}

// 42. MCP connection based on the same GUI engine
{
 const s=pptx.addSlide();
 header(s,'CMC Coil 설계기를 MCP 도구로 연결','GUI와 MCP가 동일한 예측 엔진을 사용하도록 도구의 입력과 출력을 정의합니다.');
 text(s,'AI / Agent',.72,1.48,2.35,.28,{fontSize:16,bold:true,color:C.blue,align:'center'});
 text(s,'MCP 도구',4.88,1.48,3.10,.28,{fontSize:16,bold:true,color:C.violet,align:'center'});
 text(s,'CMC 설계 엔진',9.55,1.48,2.75,.28,{fontSize:16,bold:true,color:C.green,align:'center'});

 box(s,.72,1.85,2.80,3.95,'F3F8FF','9AC7FF');
 pill(s,'자연어 요청',1.36,2.14,1.52,C.blue);
 text(s,'“8턴, F3 코어,\n선경 0.8 mm 조건으로\nCMC 특성을 예측하고\nSPICE를 만들어줘”',.94,2.66,2.36,1.38,{fontSize:14.5,bold:true,align:'center'});
 text(s,'사용자는 GUI와 같은\n설계 조건을 말합니다.',1.04,4.75,2.18,.52,{fontSize:11.5,color:C.gray,align:'center'});

 s.addShape(pptx.ShapeType.chevron,{x:3.72,y:3.35,w:.66,h:.48,fill:{color:C.blue},line:{color:C.blue}});
 box(s,4.55,1.85,3.72,3.95,C.paleV,'B9AEF3');
 pill(s,'predict_cmc',5.05,2.14,1.36,C.violet);
 pill(s,'generate_spice',6.48,2.14,1.40,C.violet);
 text(s,'표준 입력',4.94,2.65,1.0,.22,{fontSize:11,bold:true,color:C.violet});
 box(s,4.92,2.93,2.98,1.62,'FFFFFF','D9D1F7');
 text(s,'{\n  "turns": 8,\n  "core_family": "F3",\n  "wire_mm": 0.8,\n  "pitch_deg": 3.0\n}',5.10,3.05,2.62,1.36,{fontFace:'Consolas',fontSize:10,color:'3B3566',valign:'top'});
 text(s,'GUI 입력 항목과 같은 스키마',5.07,4.87,2.56,.24,{fontSize:10.8,color:C.gray,align:'center'});

 s.addShape(pptx.ShapeType.chevron,{x:8.47,y:3.35,w:.66,h:.48,fill:{color:C.violet},line:{color:C.violet}});
 box(s,9.30,1.85,3.30,3.95,C.paleG,'A9E0C8');
 s.addImage({path:coil,x:9.55,y:2.08,w:2.80,h:2.66});
 pill(s,'|ZCM| · |ZDM| 곡선',9.67,4.67,1.56,C.green);
 pill(s,'SPICE .SUBCKT',11.31,4.67,1.08,C.green);
 text(s,'같은 모델이 GUI와 MCP 결과를 생성',9.52,5.18,2.86,.26,{fontSize:10.8,color:C.gray,align:'center'});

 text(s,'호출 흐름',.92,6.06,1.05,.24,{fontSize:12,bold:true,color:C.navy});
 text(s,'설계 조건 전달',2.18,6.06,1.45,.24,{fontSize:11.5,color:C.blue,align:'center'});
 text(s,'→',3.70,6.06,.35,.24,{fontSize:15,bold:true,color:C.gray,align:'center'});
 text(s,'특성 예측',4.14,6.06,1.25,.24,{fontSize:11.5,color:C.violet,align:'center'});
 text(s,'→',5.46,6.06,.35,.24,{fontSize:15,bold:true,color:C.gray,align:'center'});
 text(s,'SPICE 생성',5.89,6.06,1.25,.24,{fontSize:11.5,color:C.violet,align:'center'});
 text(s,'→',7.21,6.06,.35,.24,{fontSize:15,bold:true,color:C.gray,align:'center'});
 text(s,'AI가 결과 설명',7.65,6.06,1.62,.24,{fontSize:11.5,color:C.green,align:'center'});
 footer(s,'MCP는 새 계산기를 만드는 기능이 아니라, 기존 CMC GUI 엔진을 AI가 호출하는 표준 연결 방식입니다.',42);
}

async function run(){
 await pptx.writeFile({fileName:out});
 const zip=await JSZip.loadAsync(fs.readFileSync(out));
 const name='[Content_Types].xml';
 let ct=await zip.file(name).async('string');
 ct=ct.replace(/<Override PartName="\/ppt\/slideMasters\/slideMaster2\.xml" ContentType="application\/vnd\.openxmlformats-officedocument\.presentationml\.slideMaster\+xml"\/>/g,'');
 zip.file(name,ct);
 fs.writeFileSync(out,await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
 console.log(out);
}
run().catch(e=>{console.error(e);process.exit(1)});
