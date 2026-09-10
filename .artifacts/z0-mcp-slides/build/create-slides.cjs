const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'EMxAI';
pptx.subject = 'Z0 calculator and MCP training';
pptx.title = 'Z0 계산기와 MCP 연결';
pptx.company = 'EMxAI';
pptx.lang = 'ko-KR';
pptx.theme = {
  headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic', lang: 'ko-KR'
};
const C = { navy:'172033', blue:'1976F3', violet:'6251D8', pale:'EAF3FF', pale2:'F4F8FD', gray:'66758B', line:'D9E4F2', teal:'0F9FA8', green:'18A76F', copper:'C87536', white:'FFFFFF' };
const img = path.resolve(__dirname, '../../../deliverables/z0-mcp-slides/assets/microstrip-cross-section.png');
const out = path.resolve(__dirname, '../../../deliverables/z0-mcp-slides/Z0-calculator-MCP-training.pptx');

function txt(slide, text, x,y,w,h, opt={}) {
  slide.addText(text,{x,y,w,h,fontFace:'Malgun Gothic',fontSize:opt.fontSize||15,color:opt.color||C.navy,bold:!!opt.bold,align:opt.align||'left',valign:opt.valign||'mid',margin:opt.margin===undefined?0:opt.margin,breakLine: false,fit:'shrink',...opt});
}
function title(slide, t, sub){
  slide.background = { color: 'FFFFFF' };
  slide.addShape(pptx.ShapeType.rect,{x:0.17,y:0.62,w:0.10,h:0.77,fill:{color:'4F46E5'},line:{color:'4F46E5'}});
  slide.addShape(pptx.ShapeType.line,{x:0.30,y:0.94,w:12.57,h:0,line:{color:'60A5FA',width:1}});
  txt(slide,t,0.58,0.24,12.1,0.48,{fontSize:28,bold:true});
  if(sub) txt(slide,sub,0.60,1.05,12.0,0.26,{fontSize:10.5,color:C.gray});
}
function rounded(slide,x,y,w,h,fill,line=C.line,r=0.12){
  slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:r,fill:{color:fill},line:{color:line,width:1}});
}
function pill(slide,text,x,y,w,fill,color=C.white){
  rounded(slide,x,y,w,0.28,fill,fill);
  txt(slide,text,x,y,w,0.28,{fontSize:10,bold:true,color,align:'center'});
}
function arrow(slide,x,y,w,color){
  slide.addShape(pptx.ShapeType.chevron,{x,y,w,h:0.42,fill:{color},line:{color}});
}

// Slide 41 — calculator anatomy
{
 const s=pptx.addSlide();
 title(s,'Z0 계산기의 입력과 출력','PCB 단면 조건을 입력하면 계산 엔진이 특성임피던스를 반환합니다.');

 txt(s,'입력 조건',0.72,1.48,2.10,0.30,{fontSize:16,bold:true,color:C.blue});
 rounded(s,0.72,1.85,2.55,3.92,C.pale2);
 const inputs=[['W','패턴 폭','0.30 mm'],['H','유전체 두께','0.18 mm'],['T','동박 두께','0.035 mm'],['Dk','비유전율','4.2']];
 inputs.forEach((v,i)=>{
   const y=2.13+i*0.82;
   pill(s,v[0],0.94,y,0.44,i===3?C.violet:C.blue);
   txt(s,v[1],1.48,y-0.02,1.35,0.22,{fontSize:11.5,bold:true});
   txt(s,v[2],1.48,y+0.25,1.35,0.22,{fontSize:11,color:C.gray});
 });
 txt(s,'구조',0.94,5.37,0.66,0.20,{fontSize:10.5,bold:true,color:C.gray});
 pill(s,'Microstrip',1.56,5.32,1.27,'DDEAFE',C.blue);

 txt(s,'PCB 단면',3.70,1.48,4.70,0.30,{fontSize:16,bold:true,color:C.violet,align:'center'});
 rounded(s,3.47,1.85,5.12,3.92,'FFFFFF');
 s.addImage({path:img,x:3.65,y:2.15,w:4.75,h:2.72,transparency:0});
 // editable callouts
 pill(s,'W',5.55,2.01,0.46,C.blue);
 s.addShape(pptx.ShapeType.line,{x:5.78,y:2.29,w:0.0,h:0.44,line:{color:C.blue,width:1.5,beginArrowType:'none',endArrowType:'triangle'}});
 pill(s,'T',6.42,2.29,0.46,C.copper);
 s.addShape(pptx.ShapeType.line,{x:6.09,y:2.57,w:0.33,h:0.20,line:{color:C.copper,width:1.5,endArrowType:'triangle'}});
 pill(s,'H',3.83,3.33,0.46,C.teal);
 s.addShape(pptx.ShapeType.line,{x:4.29,y:3.47,w:0.55,h:0,line:{color:C.teal,width:1.5,endArrowType:'triangle'}});
 pill(s,'Dk',7.67,3.47,0.55,C.violet);
 s.addShape(pptx.ShapeType.line,{x:7.02,y:3.61,w:0.65,h:0,line:{color:C.violet,width:1.5,beginArrowType:'triangle'}});
 txt(s,'신호선',5.16,5.07,0.78,0.20,{fontSize:10,color:C.copper,bold:true,align:'center'});
 txt(s,'유전체',6.00,5.07,0.78,0.20,{fontSize:10,color:C.blue,bold:true,align:'center'});
 txt(s,'GND',6.84,5.07,0.78,0.20,{fontSize:10,color:C.copper,bold:true,align:'center'});

 txt(s,'계산 결과',9.02,1.48,3.10,0.30,{fontSize:16,bold:true,color:C.green});
 rounded(s,8.88,1.85,3.72,3.92,'F4FBF8','BEEAD8');
 txt(s,'특성임피던스',9.23,2.17,3.02,0.24,{fontSize:12,color:C.gray,align:'center'});
 txt(s,'49.82 Ω',9.20,2.48,3.08,0.72,{fontSize:32,bold:true,color:C.green,align:'center'});
 pill(s,'목표 50 Ω',9.87,3.25,1.72,C.green);
 s.addShape(pptx.ShapeType.line,{x:9.25,y:3.77,w:3.00,h:0,line:{color:'CBE8DC',width:1}});
 txt(s,'유효 유전율',9.23,4.01,1.48,0.22,{fontSize:11,color:C.gray});
 txt(s,'3.18',11.13,4.01,1.08,0.22,{fontSize:12,bold:true,align:'right'});
 txt(s,'목표 대비 오차',9.23,4.48,1.68,0.22,{fontSize:11,color:C.gray});
 txt(s,'−0.36%',11.13,4.48,1.08,0.22,{fontSize:12,bold:true,color:C.green,align:'right'});
 txt(s,'판정',9.23,4.95,0.76,0.22,{fontSize:11,color:C.gray});
 pill(s,'설계 범위 이내',10.47,4.90,1.75,'DDF6EA',C.green);

 rounded(s,0.72,6.12,11.88,0.70,C.pale,C.pale);
 txt(s,'핵심',1.15,6.31,0.58,0.28,{fontSize:14,bold:true,color:C.blue});
 txt(s,'형상(W·H·T)과 재료(Dk)를 입력하면 동일한 계산식을 반복 호출해 Z0를 얻습니다.',2.06,6.27,9.85,0.34,{fontSize:14,color:'34445C'});
 txt(s,'41',12.38,7.10,0.45,0.22,{fontSize:11,color:'7A8492',align:'right'});
}

// Slide 42 — MCP connection exercise
{
 const s=pptx.addSlide();
 title(s,'Z0 계산기를 MCP 도구로 연결','자연어 요청을 표준 도구 호출로 바꾸고, 계산 결과를 다시 설명하는 실습입니다.');

 const heads=[['① AI / Agent',0.72,C.blue],['② MCP 도구 호출',4.67,C.violet],['③ Z0 계산 엔진',8.63,C.green]];
 heads.forEach(h=>txt(s,h[0],h[1],1.48,3.05,0.28,{fontSize:16,bold:true,color:h[2],align:'center'}));
 rounded(s,0.72,1.86,3.10,3.78,'F3F8FF','9AC7FF');
 rounded(s,4.67,1.86,3.10,3.78,'F5F2FF','B9AEF3');
 rounded(s,8.63,1.86,3.70,3.78,'F4FBF8','A9E0C8');
 arrow(s,3.98,3.31,0.52,C.blue); arrow(s,7.94,3.31,0.52,C.violet);

 pill(s,'자연어 요청',1.53,2.18,1.48,C.blue);
 txt(s,'“50 Ω가 되도록\n선폭을 계산해줘”',1.08,2.72,2.40,0.92,{fontSize:19,bold:true,align:'center',valign:'mid'});
 txt(s,'목표를 말하면 됩니다.\n공식이나 함수명은 외울 필요가 없습니다.',1.04,4.38,2.46,0.62,{fontSize:11.5,color:C.gray,align:'center'});

 pill(s,'solve_width',5.44,2.18,1.56,C.violet);
 txt(s,'표준 입력(JSON)',5.04,2.70,2.36,0.22,{fontSize:11,bold:true,color:C.violet});
 rounded(s,5.03,3.01,2.38,1.72,'FFFFFF','DAD4F7');
 txt(s,'{\n  "structure": "microstrip",\n  "h_mm": 0.18,\n  "t_mm": 0.035,\n  "er": 4.2,\n  "target_z0": 50\n}',5.22,3.13,2.03,1.44,{fontFace:'Consolas',fontSize:9.5,color:'3B3566',valign:'top',breakLine:true});
 txt(s,'MCP가 요청 형식을 통일합니다.',5.07,5.03,2.32,0.24,{fontSize:10.8,color:C.gray,align:'center'});

 pill(s,'결정론적 계산',9.70,2.18,1.58,C.green);
 txt(s,'필요한 선폭 W',9.07,2.75,2.82,0.22,{fontSize:11.5,color:C.gray,align:'center'});
 txt(s,'0.298 mm',9.03,3.07,2.90,0.58,{fontSize:28,bold:true,color:C.green,align:'center'});
 s.addShape(pptx.ShapeType.line,{x:9.14,y:3.80,w:2.68,h:0,line:{color:'CBE8DC',width:1}});
 txt(s,'검증 Z0',9.12,4.08,1.20,0.22,{fontSize:11,color:C.gray});
 txt(s,'50.00 Ω',10.66,4.08,1.08,0.22,{fontSize:12,bold:true,align:'right'});
 txt(s,'오차',9.12,4.49,0.72,0.22,{fontSize:11,color:C.gray});
 txt(s,'0.003 Ω',10.66,4.49,1.08,0.22,{fontSize:12,bold:true,color:C.green,align:'right'});
 pill(s,'결과 + 설명',9.77,5.03,1.42,'DDF6EA',C.green);

 txt(s,'실습에서 사용할 3개 도구',0.87,5.91,3.00,0.27,{fontSize:13,bold:true,color:C.navy});
 const tools=[['calc_z0','현재 구조의 Z0 계산'],['solve_width','목표 Z0의 선폭 역산'],['sweep_z0','조건 변화 비교']];
 tools.forEach((v,i)=>{ const x=4.06+i*2.61; rounded(s,x,5.82,2.38,0.56,'FFFFFF',C.line); txt(s,v[0],x+0.14,5.90,0.88,0.18,{fontSize:10.5,bold:true,color:i===0?C.blue:i===1?C.violet:C.green}); txt(s,v[1],x+0.14,6.16,2.08,0.18,{fontSize:9.5,color:C.gray}); });

 rounded(s,0.72,6.57,11.88,0.48,C.pale,C.pale);
 txt(s,'핵심',1.15,6.68,0.58,0.24,{fontSize:13,bold:true,color:C.blue});
 txt(s,'AI는 값을 추측하지 않고 MCP를 통해 검증된 Z0 계산 엔진을 호출합니다.',2.06,6.65,9.85,0.28,{fontSize:13.5,color:'34445C'});
 txt(s,'42',12.38,7.10,0.45,0.22,{fontSize:11,color:'7A8492',align:'right'});
}

async function writeDeck() {
  await pptx.writeFile({ fileName: out });
  // PptxGenJS may emit a stale content-type entry for a non-existent second
  // slide master. Remove only that orphan declaration for strict OOXML readers.
  const zip = await JSZip.loadAsync(fs.readFileSync(out));
  const ctName = '[Content_Types].xml';
  let ct = await zip.file(ctName).async('string');
  ct = ct.replace(/<Override PartName="\/ppt\/slideMasters\/slideMaster2\.xml" ContentType="application\/vnd\.openxmlformats-officedocument\.presentationml\.slideMaster\+xml"\/>/g, '');
  zip.file(ctName, ct);
  fs.writeFileSync(out, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log(out);
}
writeDeck().catch(err => { console.error(err); process.exit(1); });
