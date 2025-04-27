"use client"

import { useState, useEffect } from "react"
import { Box } from "@mui/material"

interface BeadGridProps {
  beadColors: string[][]
  onColorBead: (rowIndex: number, colIndex: number) => void
  beadSize: number
  hiddenBeads: Set<string>
  mode: "paint" | "delete"
  centerAligned: boolean
}

export function BeadGrid({ beadColors, onColorBead, beadSize, hiddenBeads, mode, centerAligned }: BeadGridProps) {
  const [isMouseDown, setIsMouseDown] = useState(false)

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsMouseDown(true)
    onColorBead(rowIndex, colIndex)
  }

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isMouseDown) {
      onColorBead(rowIndex, colIndex)
    }
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false)
    }

    window.addEventListener("mouseup", handleGlobalMouseUp)
    window.addEventListener("touchend", handleGlobalMouseUp)

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
      window.removeEventListener("touchend", handleGlobalMouseUp)
    }
  }, [])

  const maxBeadsInRow = beadColors[0]?.length || 0

  return (
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
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                    onTouchStart={() => handleMouseDown(rowIndex, colIndex)}
                    onTouchMove={(e) => {
                      // Prevenir o comportamento padrão de rolagem em dispositivos touch
                      e.preventDefault()
                      const touch = e.touches[0]
                      const element = document.elementFromPoint(touch.clientX, touch.clientY)
                      const beadId = element?.getAttribute("data-bead-id")
                      if (beadId) {
                        const [r, c] = beadId.split("-").map(Number)
                        handleMouseEnter(r, c)
                      }
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
  )
}
