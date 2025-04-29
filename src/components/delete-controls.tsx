"use client";
import { Button, Tooltip } from "@mui/material";
import { Undo, RestartAlt } from "@mui/icons-material";

interface DeleteControlsProps {
  onUndoDelete: () => void;
  onRestoreAll: () => void;
  hasDeletedBeads: boolean;
}

export function DeleteControls({
  onUndoDelete,
  onRestoreAll,
  hasDeletedBeads,
}: Readonly<DeleteControlsProps>) {
  return (
    <div className="flex gap-2 mb-4">
      <Tooltip title="Desfazer última exclusão">
        <span>
          <Button
            variant="outlined"
            size="small"
            onClick={onUndoDelete}
            disabled={!hasDeletedBeads}>
            <Undo className="mr-1" /> Desfazer
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Restaurar todas as miçangas">
        <span>
          <Button
            variant="outlined"
            size="small"
            onClick={onRestoreAll}
            disabled={!hasDeletedBeads}>
            <RestartAlt className="mr-1" /> Restaurar Todas
          </Button>
        </span>
      </Tooltip>
    </div>
  );
}
