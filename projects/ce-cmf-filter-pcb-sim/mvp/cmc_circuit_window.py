"""Interactive representative selection and real LTspice circuit/CE execution."""
import queue
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from pathlib import Path
from src.cmc_demo_examples import EXAMPLES,example,validate_fragment
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from src.cmc_selected_workflow import LABEL,run_selected

class CircuitWindow:
    def __init__(self,root,layout_callback=None):
        self.window=tk.Toplevel(root);self.window.title('EMxAI | CMC · Circuit & CE Noise')
        self.window.geometry('1180x820');self.pool=ThreadPoolExecutor(max_workers=1)
        self.events=queue.Queue();self.future=None;self.closed=False
        self.window.protocol('WM_DELETE_WINDOW',self.close)
        menu=tk.Menu(self.window);view=tk.Menu(menu,tearoff=False)
        if layout_callback:view.add_command(label='PCB Layout · 원본 KiCad',command=layout_callback)
        view.add_command(label='현재 SPICE 연결 회로도',command=self.schematic)
        menu.add_cascade(label='PCB / 회로 보기',menu=view);self.window.config(menu=menu)
        ttk.Label(self.window,text='CMC 회로 & CE Noise 분석',font=('Malgun Gothic',18,'bold')).pack(anchor='w',padx=20,pady=(16,8))
        bar=ttk.Frame(self.window);bar.pack(fill='x',padx=20)
        self.selection=tk.StringVar(value=LABEL)
        self.combo=ttk.Combobox(bar,textvariable=self.selection,values=[LABEL],state='readonly',width=58)
        self.combo.pack(side='left',padx=(0,12))
        self.button=ttk.Button(bar,text='선택 CMC로 회로 · CE 계산',command=self.start);self.button.pack(side='left')
        ttk.Label(self.window,text='검증된 대표 모델 1종 · 자유 입력 surrogate와 별도 · 150 kHz–29.63 MHz',foreground='#64748b').pack(anchor='w',padx=20,pady=8)
        self.status=tk.StringVar(value='대기 · 모델을 선택하고 계산을 실행하세요.')
        ttk.Label(self.window,textvariable=self.status).pack(anchor='w',padx=20)
        self.progress=ttk.Progressbar(self.window,maximum=100);self.progress.pack(fill='x',padx=20,pady=8)
        tabs=ttk.Notebook(self.window);tabs.pack(fill='both',expand=True,padx=20)
        overview=ttk.Frame(tabs);tabs.add(overview,text='회로 구성 · 현재 모델')
        ttk.Label(overview,text='현재 연결 회로',font=('Malgun Gothic',15,'bold')).pack(anchor='w',padx=12,pady=12)
        self.diagram=tk.Canvas(overview,height=240,background='white',highlightthickness=0)
        self.diagram.pack(fill='x',padx=12)
        self.model_info=tk.StringVar(value='')
        ttk.Label(overview,textvariable=self.model_info,wraplength=1000).pack(anchor='w',padx=12,pady=10)
        actions=ttk.Frame(overview);actions.pack(anchor='w',padx=12)
        ttk.Button(actions,text='PCB / 필터 SPICE 교체…',command=self.open_spice).pack(side='left',padx=4)
        ttk.Button(actions,text='현재 넷 편집',command=lambda:tabs.select(editor)).pack(side='left',padx=4)
        ttk.Button(actions,text='RLC 상세 연결도',command=self.schematic).pack(side='left',padx=4)
        if layout_callback:ttk.Button(actions,text='PCB Layout',command=layout_callback).pack(side='left',padx=4)
        editor=ttk.Frame(tabs);tabs.add(editor,text='PCB · 필터 SPICE 편집')
        toolbar=ttk.Frame(editor);toolbar.pack(fill='x',pady=8)
        self.example_name=tk.StringVar(value=EXAMPLES[-1])
        presets=ttk.Combobox(toolbar,textvariable=self.example_name,values=EXAMPLES,state='readonly',width=35)
        presets.pack(side='left');presets.bind('<<ComboboxSelected>>',lambda e:self.load_example())
        ttk.Button(toolbar,text='파일 열기',command=self.open_spice).pack(side='left',padx=4)
        ttk.Button(toolbar,text='다른 이름 저장',command=self.save_spice).pack(side='left')
        ttk.Button(toolbar,text='연결 회로도',command=self.schematic).pack(side='left',padx=4)
        ttk.Label(editor,text='예제 R/L/C의 값·연결을 편집한 후 위 계산 버튼을 누르세요. CMC·LISN·소스는 앱에서 연결합니다.\n'
                  '노드 p1/p2=LISN, p3/p4=EUT, p11–p12=L권선, p13–p14=N권선, 0=PE. 임의 전체 netlist는 지원하지 않습니다.').pack(anchor='w')
        self.editor=tk.Text(editor,font=('Consolas',10),wrap='none',undo=True)
        self.editor.pack(fill='both',expand=True);self.editor.insert('1.0',example(EXAMPLES[-1]))
        self.loaded_name='내장 예제 · pcb_filter_3.cir (B2 + X/Y)'
        self.editor.bind('<<Modified>>',self.edited)
        self.editor.edit_modified(False);self.refresh_overview()
        self.axes=[];self.canvases=[]
        for title in ['회로 응답 · CM/DM','CE Noise · L/N']:
            frame=ttk.Frame(tabs);tabs.add(frame,text=title)
            fig=Figure(figsize=(10,4.4),layout='constrained');axes=fig.subplots(1,2)
            for ax in axes:ax.text(.5,.5,'계산 결과 대기',ha='center',va='center',transform=ax.transAxes,color='#64748b')
            canvas=FigureCanvasTkAgg(fig,master=frame);canvas.get_tk_widget().pack(fill='both',expand=True)
            self.axes.append(axes);self.canvases.append(canvas)
        self.note=tk.StringVar(value='PCB B2 + X/Y capacitor + LISN · CMC만 bypass한 기준과 비교\n가상 소스의 고조파 RMS이며 QP/AVG 측정·CE 합격 판정이 아닙니다.')
        ttk.Label(self.window,textvariable=self.note,wraplength=1100).pack(anchor='w',padx=20,pady=12)
    def start(self):
        if self.future and not self.future.done():return
        try:fragment=validate_fragment(self.editor.get('1.0','end-1c'))
        except ValueError as exc:messagebox.showerror('SPICE 입력',str(exc),parent=self.window);return
        self.button.config(state='disabled');self.combo.config(state='disabled');self.progress['value']=0
        self.status.set('실행 요청 · 기존 결과가 있다면 아래 그래프는 이전 실행 결과입니다.')
        self.future=self.pool.submit(run_selected,self.selection.get(),lambda p,m:self.events.put((p,m)),fragment)
        self.window.after(150,self.poll)
    def poll(self):
        if self.closed:return
        while not self.events.empty():
            p,m=self.events.get_nowait();self.progress['value']=p;self.status.set(m)
        if not self.future.done():self.window.after(150,self.poll);return
        try:
            self.result=self.future.result();self.render(self.result)
            self.progress['value']=100;self.status.set('완료 · 선택 CMC 회로 및 CE Noise 결과 갱신')
        except Exception as exc:
            self.status.set(f'실패 · {exc}');self.progress['value']=0
        self.button.config(state='normal');self.combo.config(state='readonly')
    def render(self,result):
        ac,ce=result['ac'],result['ce']
        for ax,mode in zip(self.axes[0],['cm','dm']):
            ax.clear()
            for line,label in [('l','L'),('n','N')]:
                ax.semilogx(ac['frequency_hz']/1e6,ac[f'insertion_{mode}_{line}_db'],label=f'LISN {label}')
            ax.axhline(0,color='#94a3b8',lw=.8)
            ax.set(title=f'{mode.upper()} · CMC 적용 감쇠',xlabel='주파수 (MHz)',ylabel='감쇠 (dB)')
        for ax,line in zip(self.axes[1],['l','n']):
            ax.clear()
            for topology,label,color in [('bypass','CMC bypass','#94a3b8'),('selected','CMC 적용','#087f8c')]:
                ax.semilogx(ce['frequency_hz']/1e6,ce[f'{topology}_{line}_rms_dbuv'],'.-',markersize=2,lw=1,label=label,color=color)
            ax.set(title=f'LISN {line.upper()} · 가상 CE Noise',xlabel='고조파 주파수 (MHz)',ylabel='고조파 RMS (dBµV)')
            ax.set_ylim(-20,max(100,float(np.max(ce[f'bypass_{line}_rms_dbuv']))+10))
        for axes in self.axes:
            for ax in axes:ax.grid(True,alpha=.35);ax.legend()
        for canvas in self.canvases:canvas.draw_idle()
        source=result['manifest']['ce']['source']
        self.note.set(f"가상 입력 {source['voltage_v']:g} V / {source['frequency_hz']/1e3:g} kHz · QP/AVG 검파 미적용\n"
                      '그래프 표시 하한 −20 dBµV · 더 작은 값은 저장 원자료에서 확인 가능\n'
                      '대표 CMC 단독 피팅 검증 통과 · 결합 회로는 모델 기반 계산이며 실측 검증 아님\n'
                      f"결과 저장: {result['manifest']['folder']}")
    def close(self):
        if self.future and not self.future.done():
            self.status.set('계산 중에는 창을 유지합니다. 완료 후 닫아주세요.');return
        self.closed=True;self.pool.shutdown(wait=False);self.window.destroy()

    def load_example(self):
        self.editor.delete('1.0','end');self.editor.insert('1.0',example(self.example_name.get()))
        self.loaded_name=self.example_name.get();self.refresh_overview()
        self.status.set('예제 변경 · 계산 버튼을 눌러 결과를 갱신하세요.')
    def open_spice(self):
        path=filedialog.askopenfilename(parent=self.window,filetypes=[('SPICE','*.cir *.sp *.lib'),('All','*.*')])
        if path:
            try:
                text=Path(path).read_text(encoding='utf-8-sig');validate_fragment(text)
                self.editor.delete('1.0','end');self.editor.insert('1.0',text);self.example_name.set('사용자 파일')
                self.loaded_name=str(Path(path).resolve());self.refresh_overview()
            except (OSError,ValueError) as exc:messagebox.showerror('SPICE',str(exc),parent=self.window)
    def save_spice(self):
        path=filedialog.asksaveasfilename(parent=self.window,defaultextension='.cir',filetypes=[('SPICE','*.cir')])
        if path:Path(path).write_text(self.editor.get('1.0','end-1c'),encoding='utf-8')
    def edited(self,event=None):
        if self.editor.edit_modified():
            self.editor.edit_modified(False)
            self.refresh_overview()
    def refresh_overview(self):
        import re
        counts={kind:len(re.findall(r'^'+kind+r'\w+\s',self.editor.get('1.0','end-1c'),re.M|re.I)) for kind in ['R','L','C']}
        c=self.diagram;c.delete('all')
        blocks=[('가상 노이즈원','100 kHz / 400 V'),('PCB + X/Y 필터','현재 편집 넷 · 클릭하여 교체'),('CMC','CMC-01 · 검증된 4포트'),('LISN / 수신기','L/N · 50 µH / 50 Ω')]
        for i,(title,detail) in enumerate(blocks):
            x=12+i*265
            c.create_rectangle(x,55,x+240,160,fill='#eef4fa',outline='#a6b8ca',width=1,tags=f'block{i}')
            c.create_text(x+120,85,text=title,font=('Malgun Gothic',12,'bold'),fill='#17304c',tags=f'block{i}')
            c.create_text(x+120,122,text=detail,font=('Malgun Gothic',9),fill='#52657b',tags=f'block{i}')
            if i<3:c.create_line(x+240,105,x+262,105,arrow='last',fill='#087f8c',width=2)
        c.tag_bind('block1','<Button-1>',lambda event:self.open_spice())
        c.create_text(12,195,anchor='w',text='연결 기능도 · 실제 CMC 연결: p11–p12 / p13–p14 · PE=0 · 상세 RLC는 연결도 버튼에서 확인',fill='#64748b')
        self.model_info.set(f"PCB/필터에 현재 들어간 넷: {getattr(self,'loaded_name','내장 B2 예제')}\n"
                            f"편집 버퍼의 소자: R {counts['R']}개 / L {counts['L']}개 / C {counts['C']}개\n"
                            'CMC: cmc_representative.lib · LISN/소스: 기존 고정 예제\n'
                            '교체한 넷은 다음 실행에 사용됩니다. 기존 결과는 재실행 전까지 이전 회로의 결과입니다.')
    def schematic(self):
        from mvp.cmc_schematic import draw,components,value
        try:text=validate_fragment(self.editor.get('1.0','end-1c'))
        except ValueError as exc:messagebox.showerror('???',str(exc),parent=self.window);return
        win=tk.Toplevel(self.window);win.title('CE EMI ? ?? ???');win.geometry('1320x850')
        tabs=ttk.Notebook(win);tabs.pack(fill='both',expand=True)
        view=ttk.Frame(tabs);details=ttk.Frame(tabs)
        tabs.add(view,text='?? ???');tabs.add(details,text='PCB ?? RLC ? ?? ???')
        fig=draw(text);canvas=FigureCanvasTkAgg(fig,master=view)
        canvas.get_tk_widget().pack(fill='both',expand=True);canvas.draw();win.canvas=canvas
        rows=components(text)
        reference={p[0].upper():p[1:3] for p in components(example(EXAMPLES[-1]))}
        changed=any(p[0].upper() not in reference or p[1:3]!=reference[p[0].upper()] for p in rows)
        if changed:
            ttk.Label(view,text='??: ?? ??? ??? ????. ? ??? ?? ?? ?? ?????, ?? ??? ?? ???? ?????.',foreground='#a43a25').pack(pady=5)
        table=ttk.Treeview(details,columns=('part','a','b','value'),show='headings')
        for key,title in [('part','??'),('a','?? 1'),('b','?? 2'),('value','?? SPICE ?')]:
            table.heading(key,text=title);table.column(key,width=190,anchor='center')
        for p in rows:table.insert('', 'end',values=p[:4])
        table.pack(fill='both',expand=True)
        ttk.Label(win,text='?? ?? ?? ?? ? ? ??? ?? / PCB ?? ??? ???? ???? ?? ?? / ???? ?? ? ?? ??').pack(pady=8)
