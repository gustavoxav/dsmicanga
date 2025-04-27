"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Slider,
  Box,
  Paper,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material"
import { ZoomIn, ZoomOut, Delete, Undo, RestartAlt, Brush } from "@mui/icons-material"
import { ColorPicker } from "@/components/color-picker"
import { BeadGrid } from "@/components/bead-grid"
import { useMobile } from "@/hooks/use-mobile"

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
  const [savedColors, setSavedColors] = useState<string[]>([
    getRandomColor(),
  ])
  const [beadColors, setBeadColors] = useState<string[][]>([])
  const [beadSize, setBeadSize] = useState(isMobile ? 20 : 30)
  const [mode, setMode] = useState<"paint" | "delete">("paint")
  const [deletedBeads, setDeletedBeads] = useState<DeletedBead[]>([])
  const [hiddenBeads, setHiddenBeads] = useState<Set<string>>(new Set())
  const [centerAligned, setCenterAligned] = useState(false)

  useEffect(() => {
    const newGrid = Array(gridSize.y)
      .fill(0)
      .map(() => Array(gridSize.x).fill("#e5e7eb"))
    setBeadColors(newGrid)
    setDeletedBeads([])
    setHiddenBeads(new Set())
  }, [gridSize])

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
    }
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
      .map(() => Array(gridSize.x).fill("#e5e7eb"))
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

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: "paint" | "delete" | null) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  const handleCenterAlignChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCenterAligned(event.target.checked)
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h3" component="h1" className="text-center mb-6">
        Criador de Arte em Miçanga
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Paper className="p-4 col-span-1 md:col-span-1">
          <Typography variant="h6" className="mb-4">
            Configurações
          </Typography>

          <div className="mb-6">
            <Typography gutterBottom>Largura (X): {gridSize.x}</Typography>
            <Slider
              value={gridSize.x}
              onChange={(_, value) => setGridSize({ ...gridSize, x: value as number })}
              min={5}
              max={30}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </div>

          <div className="mb-6">
            <Typography gutterBottom>Altura (Y): {gridSize.y}</Typography>
            <Slider
              value={gridSize.y}
              onChange={(_, value) => setGridSize({ ...gridSize, y: value as number })}
              min={5}
              max={30}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </div>

          <div className="mb-6">
            <FormControlLabel
              control={<Switch checked={centerAligned} onChange={handleCenterAlignChange} color="primary" />}
              label="Alinhar miçangas ao centro"
            />
            <Typography variant="caption" color="text.secondary" className="block mt-1">
              Útil para designs com linhas de tamanhos diferentes
            </Typography>
          </div>

          <ColorPicker
            selectedColor={selectedColor}
            savedColors={savedColors}
            onColorChange={setSelectedColor}
            onSaveColor={handleSaveColor}
            onUpdateColor={handleUpdateColor}
          />

          <Button variant="outlined" color="error" fullWidth className="mt-4" onClick={handleClearGrid}>
            Limpar Grade
          </Button>
        </Paper>

        <Paper className="p-4 col-span-1 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Visualização</Typography>

            <div className="flex items-center gap-2">
              <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleModeChange}
                aria-label="Modo de edição"
                size="small"
              >
                <ToggleButton value="paint" aria-label="Modo pintar">
                  <Tooltip title="Modo Pintar">
                    <Brush />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="delete" aria-label="Modo excluir">
                  <Tooltip title="Modo Excluir">
                    <Delete />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <div className="flex items-center ml-4">
                <Tooltip title="Diminuir Zoom">
                  <Button onClick={handleZoomOut} variant="outlined" size="small">
                    <ZoomOut />
                  </Button>
                </Tooltip>
                <Typography variant="body2" className="mx-2">
                  {beadSize}px
                </Typography>
                <Tooltip title="Aumentar Zoom">
                  <Button onClick={handleZoomIn} variant="outlined" size="small">
                    <ZoomIn />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>

          {mode === "delete" && (
            <div className="flex gap-2 mb-4">
              <Tooltip title="Desfazer última exclusão">
                <span>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleUndoDelete}
                    disabled={deletedBeads.length === 0}
                  >
                    <Undo className="mr-1" /> Desfazer
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Restaurar todas as miçangas">
                <span>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleRestoreAll}
                    disabled={deletedBeads.length === 0}
                  >
                    <RestartAlt className="mr-1" /> Restaurar Todas
                  </Button>
                </span>
              </Tooltip>
            </div>
          )}

          <Box className="flex justify-center overflow-auto">
            <BeadGrid
              beadColors={beadColors}
              onColorBead={handleColorBead}
              beadSize={beadSize}
              hiddenBeads={hiddenBeads}
              mode={mode}
              centerAligned={centerAligned}
            />
          </Box>
        </Paper>
      </div>
    </Container>
  )
}
