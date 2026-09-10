#!/bin/bash
# runs the given command with both local servers up for its duration
cd /home/user/main/latent-v3c && python3 -m http.server 8093 >/dev/null 2>&1 & P1=$!
cd /home/user/main/latent-v3d && python3 -m http.server 8094 >/dev/null 2>&1 & P2=$!
sleep 1; cd /tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad
"$@"; R=$?
kill $P1 $P2 2>/dev/null; exit $R
