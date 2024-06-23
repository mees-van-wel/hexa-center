"use client";

import { Input } from "@mantine/core";
import {
  Link,
  RichTextEditor as RichTextEditorComponent,
} from "@mantine/tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
};

export const RichTextEditor = ({
  label,
  description,
  error,
  required,
  disabled,
  value,
  onChange,
  autoFocus,
  placeholder,
}: RichTextEditorProps) => {
  const editor = useEditor({
    autofocus: autoFocus ? "end" : undefined,
    content: value || "<p></p>",
    // onFocus: () => {
    //   const element = document.querySelector(`.${styles.root}`) as Element;
    //   element.className = cn(
    //     ...Array.from(element.classList),
    //     "border-primary-6 dark:border-primary-8",
    //   );
    // },
    // onBlur: () => {
    //   const element = document.querySelector(`.${styles.root}`) as Element;
    //   element.classList.remove("border-primary-6", "dark:border-primary-8");
    //   element.classList.add("border-transparent");
    // },
    onUpdate: ({ editor }) => {
      const rawValue = editor.getHTML();
      const newValue = /^<\w+[^>]*>(?:\s*|\n*)<\/\w+>$/.test(rawValue)
        ? ""
        : rawValue;
      if (newValue !== value && onChange) onChange(newValue);
    },
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder,
      }),
    ],
  });

  // useVisibleTask$(({ track }) => {
  //   track(() => value);

  //   if (disabled) return;

  //   const newValue = value || "<p></p>";
  //   if (editor.value?.getHTML() !== newValue)
  //     editor.value?.commands.setContent(newValue);
  // });

  // useOnDocument(
  //   "mousedown",
  //   $((e) => {
  //     if (
  //       !disabled &&
  //       popupRef.value &&
  //       e.target &&
  //       !popupRef.value.contains(e.target as Node)
  //     )
  //       anchorPopupOpen.value = false;
  //   }),
  // );

  return (
    <Input.Wrapper
      label={label}
      description={description}
      withAsterisk={required}
      error={error}
    >
      {disabled ? (
        <div dangerouslySetInnerHTML={{ __html: value || "" }} />
      ) : (
        <RichTextEditorComponent editor={editor}>
          <RichTextEditorComponent.Toolbar>
            <RichTextEditorComponent.ControlsGroup>
              <RichTextEditorComponent.Bold />
              <RichTextEditorComponent.Italic />
              <RichTextEditorComponent.Underline />
              <RichTextEditorComponent.Strikethrough />
              <RichTextEditorComponent.ClearFormatting />
            </RichTextEditorComponent.ControlsGroup>
            <RichTextEditorComponent.ControlsGroup>
              <RichTextEditorComponent.H1 />
              <RichTextEditorComponent.H2 />
              <RichTextEditorComponent.H3 />
              <RichTextEditorComponent.H4 />
            </RichTextEditorComponent.ControlsGroup>
            <RichTextEditorComponent.ControlsGroup>
              <RichTextEditorComponent.Blockquote />
              <RichTextEditorComponent.Hr />
              <RichTextEditorComponent.BulletList />
              <RichTextEditorComponent.OrderedList />
            </RichTextEditorComponent.ControlsGroup>
            <RichTextEditorComponent.ControlsGroup>
              <RichTextEditorComponent.Link />
              <RichTextEditorComponent.Unlink />
            </RichTextEditorComponent.ControlsGroup>
            <RichTextEditorComponent.ControlsGroup>
              <RichTextEditorComponent.AlignLeft />
              <RichTextEditorComponent.AlignCenter />
              <RichTextEditorComponent.AlignJustify />
              <RichTextEditorComponent.AlignRight />
            </RichTextEditorComponent.ControlsGroup>
            <RichTextEditorComponent.ControlsGroup>
              <RichTextEditorComponent.Undo />
              <RichTextEditorComponent.Redo />
            </RichTextEditorComponent.ControlsGroup>
          </RichTextEditorComponent.Toolbar>
          <RichTextEditorComponent.Content />
        </RichTextEditorComponent>
      )}
    </Input.Wrapper>
  );
};
