#!/usr/bin/env bash
set -euo pipefail

echo "[HOOK] pre-task: 检查文档入口"

if [ -f "CLAUDE.md" ]; then
  echo "[OK] 根 CLAUDE.md 存在"
else
  echo "[WARN] 根 CLAUDE.md 不存在，建议补齐"
fi

if [ -d ".claude" ]; then
  echo "[OK] .claude 目录存在"
else
  echo "[WARN] .claude 目录不存在"
fi

echo "[DONE] pre-task 完成"
