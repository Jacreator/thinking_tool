'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CreateProjectDialogProps {
  open: boolean;
  formName: string;
  isLoading: boolean;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function CreateProjectDialog({
  open,
  formName,
  isLoading,
  onNameChange,
  onSubmit,
  onClose,
}: CreateProjectDialogProps) {
  const slug = toSlug(formName);
  const canSubmit = formName.trim().length > 0 && slug.length > 0 && !isLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-primary">New Project</DialogTitle>
          <DialogDescription>
            Give your architecture workspace a name.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            autoFocus
            placeholder="Project name"
            className="text-white"
            value={formName}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSubmit) onSubmit();
            }}
          />
          {formName.trim() && (
            <p className="font-mono text-xs text-copy-muted">
              slug: <span className="text-copy-secondary">{slug || '…'}</span>
            </p>
          )}
        </div>
        <DialogFooter showCloseButton>
          <Button disabled={!canSubmit} onClick={onSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
