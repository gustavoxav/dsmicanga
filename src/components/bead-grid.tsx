"use client"

import { useState, useEffect, useRef } from "react"
import { Box, Snackbar, Alert } from "@mui/material"

const LONG_PRESS_DURATION = 600

interface BeadGridProps {
  beadColors: string[][]
  onColorBead: (rowIndex: number, colIndex: number) => void
  beadSize: number
  hiddenBeads: Set<string>
  mode: "paint" | "delete" | "erase"
  centerAligned: boolean
  onPaintingStateChange?: (isPainting: boolean) => void
  onResetBead?: (rowIndex: number, colIndex: number) => void
  onFillGrid?: (color: string) => void
  selectedColor: string
}

export function BeadGrid({
  beadColors,
  onColorBead,
  beadSize,
  hiddenBeads,
  mode,
  centerAligned,
  onPaintingStateChange,
  onResetBead,
  onFillGrid,
  selectedColor,
}: Readonly<BeadGridProps>) {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [lastClickPosition, setLastClickPosition] = useState<{ row: number; col: number } | null>(null)
  const [showFillAlert, setShowFillAlert] = useState(false)

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const longPressTriggeredRef = useRef(false)

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsMouseDown(true)
    onPaintingStateChange?.(true)
    onColorBead(rowIndex, colIndex)

    if (mode === "paint") {
      longPressTriggeredRef.current = false

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }

      longPressTimerRef.current = setTimeout(() => {
        if (onFillGrid) {
          onFillGrid(selectedColor)
          setShowFillAlert(true)
          longPressTriggeredRef.current = true
        }
      }, LONG_PRESS_DURATION)
    }
  }

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isMouseDown) {
      onColorBead(rowIndex, colIndex)
    }
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
    onPaintingStateChange?.(false)

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const handleClick = (rowIndex: number, colIndex: number) => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false
      return
    }

    const currentTime = new Date().getTime()
    const doubleClickThreshold = 300

    if (
      lastClickPosition &&
      lastClickPosition.row === rowIndex &&
      lastClickPosition.col === colIndex &&
      currentTime - lastClickTime < doubleClickThreshold
    ) {
      if (onResetBead) {
        onResetBead(rowIndex, colIndex)
      }

      setLastClickTime(0)
      setLastClickPosition(null)
    } else {
      setLastClickTime(currentTime)
      setLastClickPosition({ row: rowIndex, col: colIndex })
    }
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false)
        onPaintingStateChange?.(false)

        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current)
          longPressTimerRef.current = null
        }
      }
    }

    window.addEventListener("mouseup", handleGlobalMouseUp)
    window.addEventListener("touchend", handleGlobalMouseUp)

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
      window.removeEventListener("touchend", handleGlobalMouseUp)

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [isMouseDown, onPaintingStateChange])

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isMouseDown) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isMouseDown])

  const maxBeadsInRow = beadColors[0]?.length || 0

  return (
    <>
      <div className="overflow-auto max-w-full max-h-[70vh]">
        <div className="inline-block">
          {beadColors.map((row, rowIndex) => {
            const visibleBeads = row
              .map((color, colIndex) => ({
                color,
                colIndex,
                isHidden: hiddenBeads.has(`${rowIndex}-${colIndex}`),
              }))
              .filter((bead) => !bead.isHidden)

            const totalWidth = maxBeadsInRow * (beadSize + 2)
            const visibleWidth = visibleBeads.length * (beadSize + 2)
            const offset = centerAligned ? Math.floor((totalWidth - visibleWidth) / 2) : 0

            return (
              <div
                key={rowIndex}
                className="flex"
                style={{
                  position: "relative",
                  height: beadSize + 2,
                  width: totalWidth,
                }}
              >
                {row.map((color, colIndex) => {
                  const beadKey = `${rowIndex}-${colIndex}`
                  const isHidden = hiddenBeads.has(beadKey)

                  const visibleBeadsBeforeThis = centerAligned
                    ? row.slice(0, colIndex).filter((_, idx) => !hiddenBeads.has(`${rowIndex}-${idx}`)).length
                    : colIndex

                  const positionX = centerAligned
                    ? offset + visibleBeadsBeforeThis * (beadSize + 2)
                    : colIndex * (beadSize + 2)

                  if (isHidden) {
                    return null
                  }

                  return (
                    <Box
                      key={`${rowIndex}-${colIndex}`}
                      sx={{
                        position: "absolute",
                        left: `${positionX}px`,
                        width: beadSize,
                        height: beadSize,
                        backgroundColor: color,
                        border: "1px solid rgba(0,0,0,0.2)",
                        borderRadius: "20%",
                        cursor: "pointer",
                        margin: "1px",
                        boxShadow: "inset 2px 2px 3px rgba(255,255,255,0.6), inset -2px -2px 3px rgba(0,0,0,0.2)",
                        transition: "all 0.1s ease",
                        "&:hover": {
                          opacity: 0.8,
                          transform: mode === "delete" ? "scale(0.95)" : "scale(1.05)",
                          boxShadow:
                            mode === "delete"
                              ? "inset 0 0 0 2px rgba(255,0,0,0.5)"
                              : "inset 2px 2px 3px rgba(255,255,255,0.6), inset -2px -2px 3px rgba(0,0,0,0.2)",
                        },
                      }}
                      onClick={() => handleClick(rowIndex, colIndex)}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleMouseUp}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleMouseDown(rowIndex, colIndex)
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault()
                        const touch = e.touches[0]
                        const element = document.elementFromPoint(touch.clientX, touch.clientY)
                        const beadId = element?.getAttribute("data-bead-id")
                        if (beadId) {
                          const [r, c] = beadId.split("-").map(Number)
                          handleMouseEnter(r, c)
                        }
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault()
                        handleMouseUp()
                      }}
                      data-bead-id={`${rowIndex}-${colIndex}`}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <Snackbar
        open={showFillAlert}
        autoHideDuration={2000}
        onClose={() => setShowFillAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setShowFillAlert(false)} severity="info" sx={{ width: "100%" }}>
          Grade preenchida com a cor selecionada!
        </Alert>
      </Snackbar>
    </>
  )
}
