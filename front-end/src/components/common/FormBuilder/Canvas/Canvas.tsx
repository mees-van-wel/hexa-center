import { Paper } from "@mantine/core";
import clsx from "clsx";
import { type DragEvent, Fragment, useMemo, useRef, useState } from "react";

import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";

import { formElements } from "../elements";
import { useFormBuilderContext } from "../FormBuilderContext";
import { FormElementType } from "../types";
import styles from "./Canvas.module.scss";

type CanvasItem = {
  id: number;
  type: FormElementType;
  position: number;
};

export const Canvas = () => {
  const createElement = useMutation("form", "createElement");
  const memory = useMemory();
  // const updateFormElement = useMutation("form", "updateElement");
  const { form, elements, currentElementId, setCurrentElementId } =
    useFormBuilderContext();

  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>(
    elements.map(({ id, config, sectionId, position }) => ({
      id,
      type: config.type,
      sectionId,
      position,
    })),
  );

  const dropHandler =
    (newPosition?: number) => async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const rawId = e.dataTransfer.getData("id");
      let id: number | null = rawId ? parseInt(rawId) : null;

      const type =
        (e.dataTransfer.getData("type") as FormElementType | "") || null;

      const clone = [...canvasItems];

      if (id) {
        const element = canvasItems.find((element) => element.id === id);
        if (!element) return canvasItems;

        clone.splice(element.position, 1);
        clone.splice(
          newPosition !== undefined
            ? newPosition > element.position
              ? newPosition - 1
              : newPosition
            : canvasItems.length,
          0,
          element,
        );

        // TODO update db
        setCanvasItems(
          clone.map((element, index) => ({
            ...element,
            position: index,
          })),
        );

        setCurrentElementId(id);
      }

      if (type) {
        setCurrentElementId("loading");

        id = Date.now();

        newPosition = newPosition ?? canvasItems.length;

        clone.splice(newPosition, 0, {
          id,
          type,
          position: newPosition,
        });

        // TODO update position in db and cache
        setCanvasItems(
          clone.map((element, index) => ({
            ...element,
            position: index,
          })),
        );

        const response = await createElement.mutate({
          formId: form.id,
          sectionId: form.sections[0]?.id,
          position: newPosition,
          type,
        });

        memory.write(response.element, [
          {
            scope: "form",
            procedure: "get",
            params: form.id,
            as: () => response.form,
          },
        ]);

        clone[newPosition] = {
          ...clone[newPosition],
          id: response.element.id,
        };

        setCanvasItems(clone);

        setCurrentElementId(response.element.id);
      }
    };

  const itemClickHandler = (id: number) => {
    setCurrentElementId(id);
  };

  return (
    <Paper className={styles.canvas}>
      {canvasItems
        .sort((a, b) => a.position - b.position)
        .map(({ id, type }, index) => (
          <Fragment key={id}>
            <Spacer
              onDrop={(position, e) => dropHandler(position)(e)}
              position={index}
              previousItemId={canvasItems[index - 1]?.id}
              nextItemId={id}
            />
            <CanvasItem
              id={id}
              type={type}
              active={currentElementId === id}
              onClick={() => {
                itemClickHandler(id);
              }}
            />
          </Fragment>
        ))}
      <CanvasBottom onDrop={dropHandler()} />
    </Paper>
  );
};

type CanvasItemProps = {
  id: number;
  type: FormElementType;
  active: boolean;
  onClick: () => void;
};

const CanvasItem = ({ id, type, active, onClick }: CanvasItemProps) => {
  const { elements, currentElementId } = useFormBuilderContext();

  const element = useMemo(
    () => elements.find(({ id }) => id === currentElementId) || null,
    [elements, currentElementId],
  );

  const dragStartHandler = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("id", id.toString());
  };

  const dragHandler = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.add(styles.itemClosed);
  };

  const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove(styles.itemClosed);
  };

  const Component = formElements[type as keyof typeof formElements].component;

  return (
    <div
      className={styles.item}
      draggable
      onDragStart={dragStartHandler}
      onDrag={dragHandler}
      onDragEnd={dragEndHandler}
      onClick={onClick}
    >
      {Component ? <Component formMode="manage" element={element} /> : type}
      <div
        className={clsx(styles.itemOverlay, {
          [styles.itemOverlayActive]: active,
        })}
      />
    </div>
  );
};

type SpacerProps = {
  position: number;
  previousItemId: number | undefined;
  nextItemId: number | undefined;
  onDrop: (position: number, e: DragEvent<HTMLDivElement>) => void;
};

const Spacer = ({
  position,
  previousItemId,
  nextItemId,
  onDrop,
}: SpacerProps) => {
  const innerRef = useRef<HTMLDivElement>(null);

  const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect =
      e.dataTransfer.effectAllowed === "copy" ? "copy" : "move";
  };

  const dragEnterHandler = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove(styles.spacerClosed);
  };

  const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;

    e.currentTarget.classList.add(styles.spacerClosed);
  };

  const dropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!innerRef.current) return;

    innerRef.current.style.transition = "none";
    innerRef.current.offsetHeight;

    e.currentTarget.classList.add(styles.spacerClosed);

    setTimeout(() => {
      if (!innerRef.current) return;

      innerRef.current.style.transition = "";
    }, 100);

    const rawId = e.dataTransfer.getData("id") || null;
    const id = rawId ? parseInt(rawId) : null;

    if (id === previousItemId || id === nextItemId) return;

    onDrop(position, e);
  };

  return (
    <div
      className={clsx([styles.spacer, styles.spacerClosed])}
      onDragOver={dragOverHandler}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}
    >
      <div ref={innerRef} className={styles.spacerInner} />
    </div>
  );
};

type CanvasBottomProps = {
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
};

const CanvasBottom = ({ onDrop }: CanvasBottomProps) => {
  const spacerRef = useRef<HTMLDivElement>(null);

  const dragEnterHandler = () => {
    spacerRef.current?.classList.remove(styles.spacerClosed);
  };

  const dragLeaveHandler = () => {
    spacerRef.current?.classList.add(styles.spacerClosed);
  };

  const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect =
      e.dataTransfer.effectAllowed === "copy" ? "copy" : "move";
  };

  const dropHandler = (e: DragEvent<HTMLDivElement>) => {
    spacerRef.current?.classList.add(styles.spacerClosed);
    onDrop(e);
  };

  return (
    <div
      className={styles.canvasBottom}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
    >
      <div
        ref={spacerRef}
        className={clsx([styles.spacer, styles.spacerClosed])}
      >
        <div className={styles.spacerInner}></div>
      </div>
    </div>
  );
};
