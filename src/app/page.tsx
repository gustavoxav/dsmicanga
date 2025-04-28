"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  Delete,
  Undo,
  Backspace,
  RestartAlt,
  Brush,
} from "@mui/icons-material";
import { ColorPicker } from "@/components/color-picker";
import { BeadGrid } from "@/components/bead-grid";
import { useMobile } from "@/hooks/use-mobile";

function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

type DeletedBead = {
  rowIndex: number;
  colIndex: number;
  color: string;
};

export default function Home() {
  const isMobile = useMobile();
  const [gridSize, setGridSize] = useState({ x: 10, y: 10 });
  const [selectedColor, setSelectedColor] = useState(getRandomColor());
  const [savedColors, setSavedColors] = useState<string[]>([getRandomColor()]);
  const [beadColors, setBeadColors] = useState<string[][]>([]);
  const [beadSize, setBeadSize] = useState(isMobile ? 20 : 30);
  const [mode, setMode] = useState<"paint" | "delete" | "erase">("paint");
  const [deletedBeads, setDeletedBeads] = useState<DeletedBead[]>([]);
  const [hiddenBeads, setHiddenBeads] = useState<Set<string>>(new Set());
  const [centerAligned, setCenterAligned] = useState(false);

  useEffect(() => {
    const newGrid = Array(gridSize.y)
      .fill(0)
      .map(() => Array(gridSize.x).fill("#e5e7eb"));
    setBeadColors(newGrid);
    setDeletedBeads([]);
    setHiddenBeads(new Set());
  }, [gridSize]);

  const handleColorBead = (rowIndex: number, colIndex: number) => {
    if (mode === "paint") {
      const newBeadColors = [...beadColors];
      newBeadColors[rowIndex][colIndex] = selectedColor;
      setBeadColors(newBeadColors);

      if (hiddenBeads.has(`${rowIndex}-${colIndex}`)) {
        const newHiddenBeads = new Set(hiddenBeads);
        newHiddenBeads.delete(`${rowIndex}-${colIndex}`);
        setHiddenBeads(newHiddenBeads);
      }
    } else if (mode === "delete") {
      const beadKey = `${rowIndex}-${colIndex}`;
      if (!hiddenBeads.has(beadKey)) {
        setDeletedBeads([
          ...deletedBeads,
          { rowIndex, colIndex, color: beadColors[rowIndex][colIndex] },
        ]);

        const newHiddenBeads = new Set(hiddenBeads);
        newHiddenBeads.add(beadKey);
        setHiddenBeads(newHiddenBeads);
      }
    } else if (mode === "erase") {
      const newBeadColors = [...beadColors];
      newBeadColors[rowIndex][colIndex] =
        newBeadColors[rowIndex][colIndex] === selectedColor
          ? "#e5e7eb"
          : selectedColor;
      setBeadColors(newBeadColors);
    }
  };

  const handleSaveColor = (color: string) => {
    if (savedColors.includes(color)) {
      setSelectedColor(color);
      return;
    }

    if (savedColors.length < 8) {
      setSavedColors([...savedColors, color]);
    } else {
      const newColors = [...savedColors];
      newColors[newColors.length - 1] = color;
      setSavedColors(newColors);
    }
    setSelectedColor(color);
  };

  const handleUpdateColor = (index: number, color: string) => {
    const newColors = [...savedColors];
    newColors[index] = color;
    setSavedColors(newColors);
    setSelectedColor(color);
  };

  const handleClearGrid = () => {
    const newGrid = Array(gridSize.y)
      .fill(0)
      .map(() => Array(gridSize.x).fill("#e5e7eb"));
    setBeadColors(newGrid);
    setDeletedBeads([]);
    setHiddenBeads(new Set());
  };

  const handleZoomIn = () => {
    setBeadSize((prev) => Math.min(prev + 5, 60));
  };

  const handleZoomOut = () => {
    setBeadSize((prev) => Math.max(prev - 5, 10));
  };

  const handleUndoDelete = () => {
    if (deletedBeads.length > 0) {
      const lastDeleted = deletedBeads[deletedBeads.length - 1];
      const newDeletedBeads = [...deletedBeads];
      newDeletedBeads.pop();
      setDeletedBeads(newDeletedBeads);

      const newHiddenBeads = new Set(hiddenBeads);
      newHiddenBeads.delete(`${lastDeleted.rowIndex}-${lastDeleted.colIndex}`);
      setHiddenBeads(newHiddenBeads);
    }
  };

  const handleRestoreAll = () => {
    setDeletedBeads([]);
    setHiddenBeads(new Set());
  };

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: "paint" | "delete" | "erase" | null
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleCenterAlignChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCenterAligned(event.target.checked);
  };

  return (
    <Container maxWidth="lg" className="pt-4 pb-8">
      <Typography
        variant="h5"
        component="h1"
        fontWeight="bold"
        className="text-center">
        Crie sua Arte em Miçanga aqui!
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <Paper
          className="p-4 col-span-1 md:col-span-1"
          sx={{ background: "#f8f8f8" }}>
          <Typography variant="h6" fontWeight="bold" className="mb-4 bold">
            Configurações
          </Typography>

          <Typography gutterBottom variant="subtitle2" sx={{ marginBottom: 0 }}>
            Largura (X): {gridSize.x}
          </Typography>
          <Slider
            value={gridSize.x}
            onChange={(_, value) => setGridSize({ ...gridSize, x: value })}
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
            onChange={(_, value) => setGridSize({ ...gridSize, y: value })}
            min={5}
            max={30}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{ color: "#137b8b" }}
          />

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={centerAligned}
                  onChange={handleCenterAlignChange}
                  color="primary"
                />
              }
              label="Alinhar miçangas ao centro"
            />
            <Typography
              variant="caption"
              color="text.secondary"
              className="block mt-1">
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
        </Paper>

        <Paper
          className="p-4 col-span-1 md:col-span-2"
          sx={{ background: "#f8f8f8" }}>
          <div className="flex flex-col justify-between items-center mb-4">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleModeChange}
                aria-label="Modo de edição"
                size="small">
                <ToggleButton value="paint" aria-label="Modo pintar">
                  <Tooltip title="Modo Pintar">
                    <div className="flex flex-row items-center gap-1">
                      <Brush sx={{ color: "#137b8b" }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#137b8b",
                          fontSize: "0.75rem",
                          marginRight: "2px",
                        }}>
                        Pintar
                      </Typography>
                    </div>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="erase" aria-label="Modo excluir">
                  <Tooltip title="Modo Apagar cor">
                    <div className="flex flex-row items-center gap-1">
                      <Backspace sx={{ color: "#a9a9a9" }} />
                      <Typography
                        variant="caption"
                        sx={{ color: "#a9a9a9", fontSize: "0.75rem" }}>
                        Apagar
                      </Typography>
                    </div>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="delete" aria-label="Modo excluir">
                  <Tooltip title="Modo Excluir Miçanga">
                    <div className="flex flex-row items-center gap-1">
                      <Delete sx={{ color: "#bd1414", marginRight: "2px" }} />
                      <Typography
                        variant="caption"
                        sx={{ color: "#bd1414", fontSize: "0.75rem" }}>
                        Excluir Miçanga
                      </Typography>
                    </div>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <div className="flex items-center gap-2">
                <Tooltip title="Diminuir Zoom">
                  <Button
                    onClick={handleZoomOut}
                    size="small"
                    sx={{ background: "#f3f3f3" }}>
                    <ZoomOut sx={{ color: "#137b8b" }} />
                  </Button>
                </Tooltip>
                <Tooltip title="Aumentar Zoom">
                  <Button
                    onClick={handleZoomIn}
                    sx={{ background: "#f3f3f3" }}
                    size="small">
                    <ZoomIn sx={{ color: "#137b8b" }} />
                  </Button>
                </Tooltip>
              </div>
              <Tooltip title="Limpar Grade">
                <Button
                  variant="outlined"
                  sx={{ background: "#bd1414", color: "#fff", width: "150px" }}
                  fullWidth
                  className="mt-4"
                  onClick={handleClearGrid}>
                  Limpar Grade
                </Button>
              </Tooltip>
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
                    disabled={deletedBeads.length === 0}>
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
                    disabled={deletedBeads.length === 0}>
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
  );
}
