"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Container, Typography, Box, Paper } from "@mui/material"
import { BeadGrid } from "@/components/bead-grid"
import { ConfigPanel } from "@/components/config-panel"
import { ToolsPanel } from "@/components/tools-panel"
import { DeleteControls } from "@/components/delete-controls"
import { Footer } from "@/components/footer"
import { useMobile } from "@/hooks/use-mobile"

const DEFAULT_BEAD_COLOR = "#e5e7eb"

function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  )
}

type DeletedBead = {
  rowIndex: number
  colIndex: number
  color: string
}

export default function Home() {
  const isMobile = useMobile()
  const [gridSize, setGridSize] = useState({ x: 10, y: 10 })
  const [selectedColor, setSelectedColor] = useState(getRandomColor())
  const [savedColors, setSavedColors] = useState<string[]>([getRandomColor()])
  const [beadColors, setBeadColors] = useState<string[][]>([])
  const [beadSize, setBeadSize] = useState(isMobile ? 20 : 30)
  const [mode, setMode] = useState<"paint" | "delete" | "erase">("paint")
  const [deletedBeads, setDeletedBeads] = useState<DeletedBead[]>([])
  const [hiddenBeads, setHiddenBeads] = useState<Set<string>>(new Set())
  const [centerAligned, setCenterAligned] = useState(false)
  const [isPainting, setIsPainting] = useState(false)

  useEffect(() => {
    const newGrid = Array(gridSize.y)
      .fill(0)
      .map(() => Array(gridSize.x).fill(DEFAULT_BEAD_COLOR))
    setBeadColors(newGrid)
    setDeletedBeads([])
    setHiddenBeads(new Set())
  }, [gridSize])

  useEffect(() => {
    if (isMobile) {
      if (isPainting) {
        document.body.style.overflow = "hidden"
        document.body.style.touchAction = "none"
      } else {
        document.body.style.overflow = ""
        document.body.style.touchAction = ""
      }

      return () => {
        document.body.style.overflow = ""
        document.body.style.touchAction = ""
      }
    }
  }, [isPainting, isMobile])

  const handleColorBead = (rowIndex: number, colIndex: number) => {
    if (mode === "paint") {
      const newBeadColors = [...beadColors]
      newBeadColors[rowIndex][colIndex] = selectedColor
      setBeadColors(newBeadColors)

      if (hiddenBeads.has(`${rowIndex}-${colIndex}`)) {
        const newHiddenBeads = new Set(hiddenBeads)
        newHiddenBeads.delete(`${rowIndex}-${colIndex}`)
        setHiddenBeads(newHiddenBeads)
      }
    } else if (mode === "delete") {
      const beadKey = `${rowIndex}-${colIndex}`
      if (!hiddenBeads.has(beadKey)) {
        setDeletedBeads([...deletedBeads, { rowIndex, colIndex, color: beadColors[rowIndex][colIndex] }])

        const newHiddenBeads = new Set(hiddenBeads)
        newHiddenBeads.add(beadKey)
        setHiddenBeads(newHiddenBeads)
      }
    } else if (mode === "erase") {
      const newBeadColors = [...beadColors]
      newBeadColors[rowIndex][colIndex] = DEFAULT_BEAD_COLOR
      setBeadColors(newBeadColors)
    }
  }

  const handleResetBead = (rowIndex: number, colIndex: number) => {
    const newBeadColors = [...beadColors]
    newBeadColors[rowIndex][colIndex] = DEFAULT_BEAD_COLOR
    setBeadColors(newBeadColors)
  }

  const handleFillGrid = (color: string) => {
    const newBeadColors = beadColors.map((row, rowIndex) =>
      row.map((cellColor, colIndex) => {
        return hiddenBeads.has(`${rowIndex}-${colIndex}`) ? cellColor : color
      }),
    )
    setBeadColors(newBeadColors)
  }

  const handleSaveColor = (color: string) => {
    if (savedColors.includes(color)) {
      setSelectedColor(color)
      return
    }

    if (savedColors.length < 8) {
      setSavedColors([...savedColors, color])
    } else {
      const newColors = [...savedColors]
      newColors[newColors.length - 1] = color
      setSavedColors(newColors)
    }
    setSelectedColor(color)
  }

  const handleUpdateColor = (index: number, color: string) => {
    const newColors = [...savedColors]
    newColors[index] = color
    setSavedColors(newColors)
    setSelectedColor(color)
  }

  const handleClearGrid = () => {
    const newGrid = Array(gridSize.y)
      .fill(0)
      .map(() => Array(gridSize.x).fill(DEFAULT_BEAD_COLOR))
    setBeadColors(newGrid)
    setDeletedBeads([])
    setHiddenBeads(new Set())
  }

  const handleZoomIn = () => {
    setBeadSize((prev) => Math.min(prev + 5, 60))
  }

  const handleZoomOut = () => {
    setBeadSize((prev) => Math.max(prev - 5, 10))
  }

  const handleUndoDelete = () => {
    if (deletedBeads.length > 0) {
      const lastDeleted = deletedBeads[deletedBeads.length - 1]
      const newDeletedBeads = [...deletedBeads]
      newDeletedBeads.pop()
      setDeletedBeads(newDeletedBeads)

      const newHiddenBeads = new Set(hiddenBeads)
      newHiddenBeads.delete(`${lastDeleted.rowIndex}-${lastDeleted.colIndex}`)
      setHiddenBeads(newHiddenBeads)
    }
  }

  const handleRestoreAll = () => {
    setDeletedBeads([])
    setHiddenBeads(new Set())
  }

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: "paint" | "delete" | "erase" | null) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  const handleEraser = () => {
    setMode("erase")
  }

  const handlePaintingStateChange = (isPainting: boolean) => {
    setIsPainting(isPainting)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Container maxWidth="lg" className="pt-4 pb-8 flex-grow">
        <Typography variant="h5" component="h1" fontWeight="bold" className="text-center">
          Crie sua Miçanga!
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <ConfigPanel
            gridSize={gridSize}
            setGridSize={setGridSize}
            centerAligned={centerAligned}
            setCenterAligned={setCenterAligned}
            selectedColor={selectedColor}
            savedColors={savedColors}
            onColorChange={setSelectedColor}
            onSaveColor={handleSaveColor}
            onUpdateColor={handleUpdateColor}
            onEraser={handleEraser}
            mode={mode}
          />

          <Paper className="p-4 col-span-1 md:col-span-2" sx={{ background: "#f8f8f8" }}>
            <div className="flex flex-col justify-between items-center mb-4">
              <ToolsPanel
                mode={mode}
                onModeChange={handleModeChange}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onClearGrid={handleClearGrid}
              />
            </div>

            {mode === "delete" && (
              <DeleteControls
                onUndoDelete={handleUndoDelete}
                onRestoreAll={handleRestoreAll}
                hasDeletedBeads={deletedBeads.length > 0}
              />
            )}

            <Box className="flex justify-center overflow-auto">
              <BeadGrid
                beadColors={beadColors}
                onColorBead={handleColorBead}
                beadSize={beadSize}
                hiddenBeads={hiddenBeads}
                mode={mode}
                centerAligned={centerAligned}
                onPaintingStateChange={handlePaintingStateChange}
                onResetBead={handleResetBead}
                onFillGrid={handleFillGrid}
                selectedColor={selectedColor}
              />
            </Box>
          </Paper>
        </div>
      </Container>
      <Footer />
    </div>
  )
}
