import React, { useCallback, useEffect, useRef, useState } from "react";

interface VirtualizerProps {
  numRows: number;
  numColumns: number;
  rowHeight: number;
  columnWidth: number;
  containerHeight: number;
  containerWidth: number;
  children: (info: {
    rowIndex: number;
    columnIndex: number;
    style: React.CSSProperties;
  }) => JSX.Element | null;
}

export const Virtualizer = ({
  numRows = 0,
  numColumns = 0,
  rowHeight = 0,
  columnWidth = 0,
  containerHeight = 0,
  containerWidth = 0,
  children = () => null,
}: VirtualizerProps) => {
  const [firstVisibleRow, setFirstVisibleRow] = useState<number>(0);
  const [lastVisibleRow, setLastVisibleRow] = useState<number>(
    Math.min(Math.ceil(containerHeight / rowHeight) - 1, numRows - 1)
  );
  const [firstVisibleColumn, setFirstVisibleColumn] = useState<number>(0);
  const [lastVisibleColumn, setLastVisibleColumn] = useState<number>(
    Math.min(Math.ceil(containerWidth / columnWidth) - 1, numColumns - 1)
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleVisibleRows = useCallback(
    (currentTarget: HTMLDivElement) => {
      const { scrollTop, scrollLeft } = currentTarget;
      setFirstVisibleRow(Math.floor(scrollTop / rowHeight));
      setLastVisibleRow(
        Math.min(
          Math.ceil((scrollTop + containerHeight) / rowHeight) - 1,
          numRows - 1
        )
      );
      setFirstVisibleColumn(Math.floor(scrollLeft / columnWidth));
      setLastVisibleColumn(
        Math.min(
          Math.ceil((scrollLeft + containerWidth) / columnWidth) - 1,
          numColumns - 1
        )
      );
    },
    [
      columnWidth,
      containerHeight,
      containerWidth,
      numColumns,
      numRows,
      rowHeight,
    ]
  );

  const onScroll = useCallback<React.UIEventHandler<HTMLDivElement>>(
    ({ currentTarget }) => {
      handleVisibleRows(currentTarget);
    },
    [handleVisibleRows]
  );

  useEffect(() => {
    if (scrollRef.current !== null) {
      handleVisibleRows(scrollRef.current);
    }
  }, [handleVisibleRows]);

  return (
    <div
      style={{
        height: containerHeight,
        width: containerWidth,
        overflow: "auto",
        backgroundColor: "aliceblue",
      }}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div
        style={{
          position: "relative",
          height: numRows * rowHeight,
          width: numColumns * columnWidth,
          overflow: "hidden",
        }}
      >
        {new Array(lastVisibleRow + 1 - firstVisibleRow)
          .fill(null)
          .map((_, y) =>
            new Array(lastVisibleColumn + 1 - firstVisibleColumn)
              .fill(null)
              .map((__, x) => {
                const rowIndex = firstVisibleRow + y;
                const columnIndex = firstVisibleColumn + x;
                const style: React.CSSProperties = {
                  position: "fixed",
                  top: rowIndex * rowHeight,
                  left: columnIndex * columnWidth,
                  height: rowHeight,
                  width: columnWidth,
                };
                return children({ rowIndex, columnIndex, style });
              })
          )}
      </div>
    </div>
  );
};
