from pathlib import Path
r=Path(__file__).resolve().parents[1]
ts=(r/'src/index.ts').read_text(); h=(r/'public/index.html').read_text()
c={'server version':"serverVersion: '0.3.2.3'" in ts,
'restore opponent helper':'restoreConnectedOpponentAfterReset' in ts,
'expiry restore':'restoreConnectedOpponentAfterReset(state, player)' in ts,
'leave restore':'restoreConnectedOpponentAfterReset(state, attachment.player)' in ts,
'leave button':'id="leave-match"' in h,
'browser version':'web-0.3.2.3' in h}
for k,v in c.items(): print(('PASS' if v else 'FAIL')+' - '+k)
raise SystemExit(0 if all(c.values()) else 1)
