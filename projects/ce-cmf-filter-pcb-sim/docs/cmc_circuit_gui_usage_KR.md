# CMC 선택 → 회로 → CE Noise GUI

## PCB·필터 예제와 편집

`PCB · 필터 SPICE 편집` 탭에서 다음 예제를 선택한다. 같은 파일은 `mvp/examples/pcb_filter_1.cir`~`pcb_filter_3.cir`로 제공한다.

- PCB + CMC
- PCB + CMC + X capacitor
- PCB + CMC + X/Y (π filter)

R/L/C 값 및 연결 노드를 편집하거나 파일을 열고 저장할 수 있다. 계산 버튼은 클릭 시 편집 내용을 복사하여 AC와 CE 모두에 동일하게 적용한다. 편집은 다음 실행부터 반영되며 원본 PCB layout을 변경하지 않는다. 이번 편집기는 `R/L/C 이름 노드1 노드2 양수값` 형식의 PCB/필터 회로 조각을 지원한다. CMC·LISN·소스와 분석 명령은 앱이 붙인다. 임의의 전체 SPICE netlist, include, 행동 소자 문법은 이 편집기 범위에 포함하지 않는다.

상단 `PCB / 회로 보기` 메뉴에서 원본 KiCad 레이아웃 및 현재 편집 중인 SPICE 연결 회로도를 연다. 연결 회로도는 R/L/C 이름·값·노드와 CMC/LISN 블록을 표시하며 정식 CAD 회로도 편집기는 아니다.

실행: `C:\Users\hbpar\miniconda3\python.exe scripts/launch_circuit_gui.py`

기존 GUI의 `CE EMI / PCB 회로` 메뉴 → `CMC 선택 → 회로 실행 → CE Noise`에서도 연다.

1. 검증된 CMC-01 대표 모델을 선택한다. 현재 등록 모델은 1종이다. 자유 입력 surrogate의 임의 형상을 해당 모델로 가장하지 않는다.
2. `선택 CMC로 회로 · CE 계산`을 누르면 모델 확인 → PCB/LISN CM/DM 4건 → 가상 CE 2건 → 그래프 갱신 순으로 실행한다.
3. 회로 응답 탭에서 CM/DM별 L/N 감쇠를 보고, CE Noise 탭에서 CMC 적용/바이패스 결과를 비교한다. 실행 중 진행률과 단계, 실패 시 오류가 표시된다. 실행 중 중복 클릭 및 창 닫기는 차단한다.

이번 완료 검증: 실제 LTspice 6건을 GUI 버튼 경로로 실행하고 100% 완료 및 결과 갱신을 확인했다. 결과는 `mvp/generated/cmc_spice_demo/runs/20260909_194531_f376dd`에 저장됐다. 재실행은 새 폴더에 저장한다.

대표 모델은 수동성 검사 통과 및 실제 LTspice 4포트 재현 확인을 거쳤다. 원본 HFSS 대비 검사 지점의 modal 크기 최대 차이는 CM 1.8135%, DM 0.0576%, 위상 최대 차이는 CM 0.5551°, DM 0.0996°이다. 이전 0.0064% 결과의 고차 모델은 수동성 미통과로 교체했다. 이번 수치는 surrogate 예측 오차가 아니다.

CE 결과는 200 kHz~29.6 MHz의 가상 고조파 RMS이며, 모델 데이터는 150 kHz~29.627875 MHz이다. QP/AVG 규격 검파, 실측 검증, DC/시간영역 검증은 포함하지 않는다. PCB 원본 S14P까지 포함한 독립 교차검증 완료 주장도 하지 않는다. 검증된 라이브러리 hash가 달라지면 재검증 전 실행을 차단한다.

후속 8~12건 해석·재학습·평가가 필요합니다. 이번 구현에서는 제외했습니다.
