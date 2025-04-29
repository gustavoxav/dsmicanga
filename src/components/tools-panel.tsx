"use client";

import type React from "react";
import {
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { ZoomIn, ZoomOut, Delete, Backspace, Brush } from "@mui/icons-material";

interface ToolsPanelProps {
  mode: "paint" | "delete" | "erase";
  onModeChange: (
    event: React.MouseEvent<HTMLElement>,
    newMode: "paint" | "delete" | "erase" | null
  ) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClearGrid: () => void;
}

export function ToolsPanel({
  mode,
  onModeChange,
  onZoomIn,
  onZoomOut,
  onClearGrid,
}: Readonly<ToolsPanelProps>) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={onModeChange}
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
        <ToggleButton value="erase" aria-label="Modo apagar">
          <Tooltip title="Modo Apagar cor">
            <div className="flex flex-row items-center gap-1">
              <Backspace sx={{ color: "#7b7b7b" }} />
              <Typography
                variant="caption"
                sx={{ color: "#7b7b7b", fontSize: "0.75rem" }}>
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
            onClick={onZoomOut}
            size="small"
            sx={{ background: "#f3f3f3" }}>
            <ZoomOut sx={{ color: "#137b8b" }} />
          </Button>
        </Tooltip>
        <Tooltip title="Aumentar Zoom">
          <Button
            onClick={onZoomIn}
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
          onClick={onClearGrid}>
          Limpar Grade
        </Button>
      </Tooltip>
    </div>
  );
}
