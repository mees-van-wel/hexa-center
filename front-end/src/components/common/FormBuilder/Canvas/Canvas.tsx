import { Paper } from "@mantine/core";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { type DragEvent, useMemo, useRef } from "react";

import { FormElements } from "../elements";
import { useFormBuilderContext } from "../FormBuilderContext";
import { Element } from "../types";
import styles from "./Canvas.module.scss";

export const Canvas = () => {
  const { form, setCurrentElementId } = useFormBuilderContext();

  const elements = useMemo<Element[]>(
    () =>
      form.sections.reduce((acc, current) => [...acc, ...current.elements], []),
    [form.sections],
  );

  const dropHandler =
    (newPosition?: number) => (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      let id = e.dataTransfer.getData("id");
      const type = e.dataTransfer.getData("type");
      const clone = [...elements];

      if (id) {
        const element = elements.find((element) => element.id === id);
        if (!element) return elements;

        clone.splice(element.position, 1);
        clone.splice(
          newPosition !== undefined
            ? newPosition > element.position
              ? newPosition - 1
              : newPosition
            : elements.length,
          0,
          element,
        );

        // TODO Optimistic update
        // setItems(
        //   clone.map((element, index) => ({
        //     ...element,
        //     position: index,
        //   })),
        // );
      }

      if (type) {
        id = nanoid();

        clone.splice(newPosition ?? elements.length, 0, {
          id,
          type,
          position: newPosition ?? elements.length,
        });

        // TODO Optimistic update
        // setItems(
        //   clone.map((element, index) => ({
        //     ...element,
        //     position: index,
        //   })),
        // );
      }

      setCurrentElementId(id);
    };

  const itemClickHandler = (id: string) => {
    setCurrentElementId(id);
  };

  return (
    <Paper className={styles.canvas}>
      {elements
        .sort((a, b) => a.position - b.position)
        .map(({ id, type }, index) => (
          <>
            <Spacer
              onDrop={(position, e) => dropHandler(position)(e)}
              position={index}
              previousItemId={elements[index - 1]?.id}
              nextItemId={id}
            />
            <CanvasItem
              key={id}
              id={id}
              type={type}
              active={current === id}
              onClick={() => {
                itemClickHandler(id);
              }}
            />
          </>
        ))}
      <CanvasBottom onDrop={dropHandler()} />
    </Paper>
  );
};

type CanvasItemProps = {
  id: string;
  type: string;
  active: boolean;
  onClick: () => void;
};

const CanvasItem = ({ id, type, active, onClick }: CanvasItemProps) => {
  const dragStartHandler = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("id", id);
  };

  const dragHandler = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.add(styles.canvasItemClosed);
  };

  const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove(styles.canvasItemClosed);
  };

  const Component = FormElements[type as keyof typeof FormElements].component;

  return (
    <div
      className={clsx(styles.canvasItem, { [styles.canvasItemActive]: active })}
      draggable
      onDragStart={dragStartHandler}
      onDrag={dragHandler}
      onDragEnd={dragEndHandler}
      onClick={onClick}
    >
      {Component ? <Component label="Yeaa" description="lollxzz" /> : type}
    </div>
  );
};

type SpacerProps = {
  position: number;
  previousItemId: string | undefined;
  nextItemId: string | undefined;
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

    const id = e.dataTransfer.getData("id");
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
