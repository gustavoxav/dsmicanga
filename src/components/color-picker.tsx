"use client";

import { useState } from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  readonly selectedColor: string;
  readonly savedColors: string[];
  readonly onColorChange: (color: string) => void;
  readonly onSaveColor: (color: string) => void;
  readonly onUpdateColor: (index: number, color: string) => void;
}

export function ColorPicker({
  selectedColor,
  savedColors,
  onColorChange,
  onSaveColor,
  onUpdateColor,
}: ColorPickerProps) {
  const [tempColor, setTempColor] = useState(selectedColor);
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(
    null
  );

  const handleColorChange = (color: string) => {
    setTempColor(color);
  };

  const handleSaveColor = () => {
    if (editingColorIndex !== null) {
      onUpdateColor(editingColorIndex, tempColor);
      setEditingColorIndex(null);
    } else {
      onSaveColor(tempColor);
    }
  };

  const handleSelectSavedColor = (color: string) => {
    onColorChange(color);
  };

  const handleEditColor = (index: number) => {
    setTempColor(savedColors[index]);
    setEditingColorIndex(index);
  };

  const handleButtonText = () => {
    if (editingColorIndex !== null) {
      return `Salvar Alterações`;
    } else if (savedColors.length < 8) {
      return "Adicionar à Paleta";
    } else {
      return "Substituir Última Cor";
    }
  };

  return (
    <div className="mt-2">
      <Typography variant="h6" fontWeight="bold" className="mb-4 bold">
        Paleta de Cores
      </Typography>

      <div className="grid grid-cols-4 gap-1">
        {savedColors.map((color, index) => (
          <div key={index} className="relative">
            <Box
              sx={{
                height: 40,
                backgroundColor: color || "#f0f0f0",
                border:
                  color === selectedColor
                    ? "3px solid #3e3e3e"
                    : "1px solid #ccc",
                boxShadow:
                  color === selectedColor ? "0 0 5px rgba(0,0,0,0.5)" : "none",
                cursor: color ? "pointer" : "default",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
              onClick={() => color && handleSelectSavedColor(color)}>
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
                  
                  className="absolute -top-2 -right-2 min-w-0 w-6 h-6 p-0"
                  onClick={() => handleEditColor(index)}
                  sx={{ minWidth: "22px", backgroundColor: "#137b8b" }}>
                  ✎
                </Button>
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      <Typography variant="subtitle1" className="mb-2">
        {editingColorIndex !== null
          ? `Editando Cor ${editingColorIndex + 1}`
          : "Selecionar Nova Cor"}
      </Typography>
      <Box className="flex justify-center mb-2">
        <HexColorPicker color={tempColor} onChange={handleColorChange} />
      </Box>

      <Box className="flex items-center gap-2 mb-2">
        <Box
          sx={{
            width: 24,
            height: 24,
            backgroundColor: tempColor,
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <Typography variant="subtitle2">{tempColor}</Typography>
      </Box>

      <div className="flex flex-row gap-2">
        {editingColorIndex !== null && (
          <Button
            fullWidth
            onClick={() => setEditingColorIndex(null)}
            sx={{
              backgroundColor: "#f3f3f3",
              color: "#bd1414",
              marginBottom: "8px",
              fontSize: "12px"
            }}>
            Cancelar Edição
          </Button>
        )}

        <Button
          variant="contained"
          sx={{ marginBottom: "8px", backgroundColor: "#137b8b", fontSize: "12px" }}
          fullWidth
          onClick={handleSaveColor}>
          {handleButtonText()}
        </Button>
      </div>
    </div>
  );
}
