from pathlib import Path
r=Path(__file__).resolve().parents[1]
ts=(r/'src/index.ts').read_text(); h=(r/'public/index.html').read_text()
c={'verbose helper':'addVerboseLog' in ts,'resume request':'Resume WebSocket request received' in ts,'token match':'resume token matched reserved session' in ts,'hello received':'client hello received' in ts,'resume accepted':'session resume accepted' in ts,'verbose li':"item.classList.add('verbose')" in h,'verbose css':'#battle-log li.verbose' in h}
for k,v in c.items(): print(('PASS' if v else 'FAIL')+' - '+k)
raise SystemExit(0 if all(c.values()) else 1)
