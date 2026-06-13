"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
}

const toolbarButtons: { label: string; command: string; style?: string }[] = [
  { label: "B", command: "bold", style: "font-bold" },
  { label: "I", command: "italic", style: "italic" },
  { label: "U", command: "underline", style: "underline" },
  { label: "• List", command: "insertUnorderedList" },
  { label: "1. List", command: "insertOrderedList" },
];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

export function RichTextEditor({
  value,
  onChange,
  id,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  function syncContent() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function focusEditor() {
    editorRef.current?.focus();
  }

  function insertHtmlAtCursor(html: string) {
    focusEditor();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
        syncContent();
      }
      return;
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();
    const fragment = range.createContextualFragment(html);
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);

    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    syncContent();
  }

  function exec(command: string) {
    focusEditor();
    document.execCommand(command, false);
    syncContent();
  }

  function insertCodeBlock() {
    focusEditor();
    const selection = window.getSelection();
    const selectedText =
      selection && selection.rangeCount > 0 ? selection.toString() : "";
    const code = selectedText || "// your code here";
    const html = `<pre class="rte-code-block"><code>${escapeHtml(code)}</code></pre><p><br></p>`;
    insertHtmlAtCursor(html);
  }

  function insertImage(src: string, alt = "") {
    if (!src.trim()) return;
    const html = `<p><img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" class="rte-image" /></p><p><br></p>`;
    insertHtmlAtCursor(html);
    setImageUrl("");
    setShowImagePanel(false);
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      insertImage(URL.createObjectURL(file), file.name);
    }
    e.target.value = "";
  }

  return (
    <div className={cn("rounded-md border border-foreground/20 bg-background", className)}>
      <div className="flex flex-wrap gap-1 border-b border-foreground/20 p-2">
        {toolbarButtons.map((button) => (
          <Button
            key={button.command}
            type="button"
            variant="ghost"
            className={cn("h-8 px-2 text-xs", button.style)}
            onClick={() => exec(button.command)}
          >
            {button.label}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 font-mono text-xs"
          onClick={insertCodeBlock}
        >
          {"</>"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={cn("h-8 px-2 text-xs", showImagePanel && "bg-foreground/10")}
          onClick={() => setShowImagePanel((open) => !open)}
        >
          Image
        </Button>
      </div>

      {showImagePanel && (
        <div className="space-y-2 border-b border-foreground/20 p-3">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  insertImage(imageUrl);
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              onClick={() => insertImage(imageUrl)}
            >
              Insert
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />
            <Button
              type="button"
              variant="secondary"
              className="text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload image
            </Button>
            <span className="text-xs text-foreground/60">or paste a URL above</span>
          </div>
        </div>
      )}

      <div
        id={id}
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        onInput={syncContent}
        className="rich-text-editor min-h-32 px-3 py-2 text-sm focus-visible:outline-none [&_img.rte-image]:my-2 [&_img.rte-image]:max-h-64 [&_img.rte-image]:max-w-full [&_img.rte-image]:rounded-md [&_ol]:list-decimal [&_ol]:pl-5 [&_pre.rte-code-block]:my-2 [&_pre.rte-code-block]:overflow-x-auto [&_pre.rte-code-block]:rounded-md [&_pre.rte-code-block]:border [&_pre.rte-code-block]:border-foreground/20 [&_pre.rte-code-block]:bg-foreground/5 [&_pre.rte-code-block]:p-3 [&_pre.rte-code-block_code]:font-mono [&_pre.rte-code-block_code]:text-xs [&_ul]:list-disc [&_ul]:pl-5"
        suppressContentEditableWarning
      />
    </div>
  );
}
