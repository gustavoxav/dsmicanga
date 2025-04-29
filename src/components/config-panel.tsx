"use client"

import type React from "react"
import { Typography, Slider, FormControlLabel, Switch, Button, Paper } from "@mui/material"
import { FormatColorReset } from "@mui/icons-material"
import { ColorPicker } from "./color-picker"

interface ConfigPanelProps {
  gridSize: { x: number; y: number }
  setGridSize: (size: { x: number; y: number }) => void
  centerAligned: boolean
  setCenterAligned: (aligned: boolean) => void
  selectedColor: string
  savedColors: string[]
  onColorChange: (color: string) => void
  onSaveColor: (color: string) => void
  onUpdateColor: (index: number, color: string) => void
  onEraser: () => void
  mode: string
}

export function ConfigPanel({
  gridSize,
  setGridSize,
  centerAligned,
  setCenterAligned,
  selectedColor,
  savedColors,
  onColorChange,
  onSaveColor,
  onUpdateColor,
  onEraser,
  mode,
}: Readonly<ConfigPanelProps>) {
  const handleCenterAlignChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCenterAligned(event.target.checked)
  }

  return (
    <Paper className="p-4 col-span-1 md:col-span-1" sx={{ background: "#f8f8f8" }}>
      <Typography variant="h6" fontWeight="bold" className="mb-4 bold">
        Configurações
      </Typography>

      <Typography gutterBottom variant="subtitle2" sx={{ marginBottom: 0 }}>
        Largura (X): {gridSize.x}
      </Typography>
      <Slider
        value={gridSize.x}
        onChange={(_, value) => setGridSize({ ...gridSize, x: value as number })}
        min={5}
        max={30}
        step={1}
        marks
        valueLabelDisplay="auto"
        sx={{ color: "#137b8b" }}
      />

      <Typography gutterBottom variant="subtitle2" sx={{ marginBottom: 0 }}>
        Altura (Y): {gridSize.y}
      </Typography>
      <Slider
        value={gridSize.y}
        onChange={(_, value) => setGridSize({ ...gridSize, y: value as number })}
        min={5}
        max={30}
        step={1}
        marks
        valueLabelDisplay="auto"
        sx={{ color: "#137b8b" }}
      />

      <div>
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
        onColorChange={onColorChange}
        onSaveColor={onSaveColor}
        onUpdateColor={onUpdateColor}
      />

      <Button
        variant="outlined"
        fullWidth
        startIcon={<FormatColorReset />}
        onClick={onEraser}
        sx={{
          mt: 2,
          borderColor: mode === "erase" ? "#137b8b" : "rgba(0,0,0,0.23)",
          color: mode === "erase" ? "#137b8b" : "rgba(0,0,0,0.87)",
          backgroundColor: mode === "erase" ? "rgba(19,123,139,0.08)" : "transparent",
          "&:hover": {
            backgroundColor: mode === "erase" ? "rgba(19,123,139,0.12)" : "rgba(0,0,0,0.04)",
          },
        }}
      >
        Borracha (Apagar Cor)
      </Button>
    </Paper>
  )
}
