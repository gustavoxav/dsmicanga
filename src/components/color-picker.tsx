"use client"

import { useState } from "react"
import { Box, Typography, Button, Tooltip } from "@mui/material"
import { HexColorPicker } from "react-colorful"

interface ColorPickerProps {
  selectedColor: string
  savedColors: string[]
  onColorChange: (color: string) => void
  onSaveColor: (color: string) => void
  onUpdateColor: (index: number, color: string) => void
}

export function ColorPicker({
  selectedColor,
  savedColors,
  onColorChange,
  onSaveColor,
  onUpdateColor,
}: ColorPickerProps) {
  const [tempColor, setTempColor] = useState(selectedColor)
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null)

  const handleColorChange = (color: string) => {
    setTempColor(color)
  }

  const handleSaveColor = () => {
    if (editingColorIndex !== null) {
      onUpdateColor(editingColorIndex, tempColor)
      setEditingColorIndex(null)
    } else {
      onSaveColor(tempColor)
    }
  }

  const handleSelectSavedColor = (color: string) => {
    onColorChange(color)
  }

  const handleEditColor = (index: number) => {
    setTempColor(savedColors[index])
    setEditingColorIndex(index)
  }

  const displayColors = [...savedColors]
  while (displayColors.length < 8) {
    displayColors.push("")
  }

  return (
    <div className="mt-4">
      <Typography variant="subtitle1" className="mb-2">
        Paleta de Cores
      </Typography>

      <Box className="flex items-center gap-2 mb-3 p-2" sx={{ border: "1px solid #ccc", borderRadius: "4px" }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            backgroundColor: selectedColor,
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <Typography variant="body2">Cor selecionada: {selectedColor}</Typography>
      </Box>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {displayColors.map((color, index) => (
          <div key={index} className="relative">
            <Box
              sx={{
                height: 50,
                backgroundColor: color || "#f0f0f0",
                border: color === selectedColor ? "3px solid black" : "1px solid #ccc",
                boxShadow: color === selectedColor ? "0 0 5px rgba(0,0,0,0.5)" : "none",
                cursor: color ? "pointer" : "default",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
              onClick={() => color && handleSelectSavedColor(color)}
            >
              {!color && (
                <Typography variant="caption" color="text.secondary">
                  Vazio
                </Typography>
              )}
            </Box>
            {color && (
              <Tooltip title="Editar esta cor">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  className="absolute -top-2 -right-2 min-w-0 w-6 h-6 p-0"
                  onClick={() => handleEditColor(index)}
                  sx={{ minWidth: "24px" }}
                >
                  ✎
                </Button>
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      <Typography variant="subtitle1" className="mb-2">
        {editingColorIndex !== null ? `Editando Cor ${editingColorIndex + 1}` : "Selecionar Nova Cor"}
      </Typography>
      <Box className="flex justify-center mb-2">
        <HexColorPicker color={tempColor} onChange={handleColorChange} />
      </Box>

      <Box className="flex items-center gap-2 mb-2">
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: tempColor,
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <Typography>{tempColor}</Typography>
      </Box>

      <Button variant="contained" fullWidth onClick={handleSaveColor}>
        {editingColorIndex !== null
          ? `Salvar Alterações`
          : savedColors.length < 8
            ? "Adicionar à Paleta"
            : "Substituir Última Cor"}
      </Button>

      {editingColorIndex !== null && (
        <Button variant="outlined" fullWidth onClick={() => setEditingColorIndex(null)} className="mt-2">
          Cancelar Edição
        </Button>
      )}
    </div>
  )
}
