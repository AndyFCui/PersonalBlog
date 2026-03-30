#!/usr/bin/env bash
set -euo pipefail

echo "[HOOK] post-edit: 检查架构文档同步"

changed_files="$(git diff --name-only --cached 2>/dev/null || true)"
if [ -z "${changed_files}" ]; then
  changed_files="$(git diff --name-only 2>/dev/null || true)"
fi

echo "[INFO] 变更文件："
echo "${changed_files:-<none>}"

# ------------------------- 规则 1：若目录结构变化，提醒更新 CLAUDE.md ------------------------- #
if echo "$changed_files" | grep -E '(^|/)(src|app|packages|modules|services|components)/' >/dev/null 2>&1; then
  echo "[WARN] 检测到核心目录变更，请确认是否需要同步 CLAUDE.md"
fi

# ------------------------- 规则 2：新增业务文件时，提醒补 L3 头部 ------------------------- #
new_files="$(git diff --cached --name-status 2>/dev/null | awk '$1 == "A" {print $2}' || true)"
if [ -n "${new_files}" ]; then
  echo "[INFO] 新增文件："
  echo "${new_files}"
  echo "[WARN] 请检查新增业务文件是否已补充 L3 文件头部契约"
fi

echo "[DONE] post-edit 完成"
