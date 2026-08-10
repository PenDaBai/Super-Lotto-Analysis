import { BookmarkCheck, BookmarkPlus, Trash2 } from "lucide-react";
import type { SavedNumberSet } from "./savedNumbers";

interface SavedNumbersBarProps {
  saved: SavedNumberSet | null;
  isCurrent: boolean;
  canSave: boolean;
  onSave: () => void;
  onClear: () => void;
}

export function SavedNumbersBar({ saved, isCurrent, canSave, onSave, onClear }: SavedNumbersBarProps) {
  const Icon = saved && isCurrent ? BookmarkCheck : BookmarkPlus;
  const title = !saved ? "保存这组号码" : isCurrent ? "这组号码已保存" : "号码已修改，尚未保存";
  const description = saved && isCurrent
    ? "下次打开查询页会自动恢复。"
    : "保存到当前浏览器，下次打开会自动恢复。";

  return (
    <div className="saved-number-bar">
      <div className="saved-number-bar__copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <div className="saved-number-bar__actions">
        <button className="saved-number-bar__save" disabled={!canSave || isCurrent} onClick={onSave} type="button">
          <Icon size={15} />
          {isCurrent ? "已保存" : "保存号码"}
        </button>
        {saved && (
          <button className="saved-number-bar__clear" onClick={onClear} type="button">
            <Trash2 size={14} />
            清除
          </button>
        )}
      </div>
    </div>
  );
}
