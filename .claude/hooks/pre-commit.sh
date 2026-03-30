#!/usr/bin/env bash
set -euo pipefail

echo "[HOOK] pre-commit: 基础阻断检查"

# ------------------------- 阻断 1：禁止提交明显敏感信息 ------------------------- #
if git diff --cached | grep -E '(API_KEY|SECRET_KEY|PRIVATE_KEY|password\s*=|token\s*=)' >/dev/null 2>&1; then
  echo "[BLOCK] 检测到疑似敏感信息，请清理后再提交"
  exit 1
fi

# ------------------------- 阻断 2：检测新增业务文件是否缺 L3 协议 ------------------------- #
new_files="$(git diff --cached --name-only --diff-filter=A | grep -E '\.(ts|tsx|js|jsx|py|go|java|rb)$' || true)"

missing_header=0
for f in $new_files; do
  if [ -f "$f" ]; then
    if ! head -n 20 "$f" | grep -F '[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md' >/dev/null 2>&1; then
      echo "[BLOCK] 新增文件缺少 L3 协议头部: $f"
      missing_header=1
    fi
  fi
done

if [ "$missing_header" -ne 0 ]; then
  exit 1
fi

echo "[PASS] pre-commit 检查通过"
