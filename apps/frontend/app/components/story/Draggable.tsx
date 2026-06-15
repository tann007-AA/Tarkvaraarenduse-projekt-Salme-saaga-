// app/components/drag-and-drop/Draggable.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string) => void;
}

export function Draggable({
  id,
  children,
  className = '',
  disabled = false,
  onDragStart,
  onDragEnd,
}: DraggableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const originalStyleRef = useRef<Record<string, string>>({});

  // Desktop drag
  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('draggableId', id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    onDragStart?.(id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.(id);
  };

  // Touch/mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    const touch = e.touches[0];
    const el = itemRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    originalStyleRef.current = {
      position: el.style.position,
      left: el.style.left,
      top: el.style.top,
      zIndex: el.style.zIndex,
      width: el.style.width,
    };

    el.style.position = 'fixed';
    el.style.zIndex = '9999';
    el.style.width = rect.width + 'px';
    el.style.left = (touch.clientX - offsetX) + 'px';
    el.style.top = (touch.clientY - offsetY) + 'px';

    setIsDragging(true);
    onDragStart?.(id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const el = itemRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    el.style.left = (touch.clientX - rect.width / 2) + 'px';
    el.style.top = (touch.clientY - rect.height / 2) + 'px';
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const el = itemRef.current;
    if (!el) return;

    const touch = e.changedTouches[0];

    // Restore original styles
    Object.entries(originalStyleRef.current).forEach(([key, value]) => {
      (el.style as any)[key] = value;
    });

    setIsDragging(false);
    onDragEnd?.(id);

    // Find drop zone under touch
    el.style.visibility = 'hidden';
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    el.style.visibility = '';

    const dropZone = elemBelow?.closest('[data-drop-zone="true"]');
    if (dropZone) {
      const zoneId = dropZone.getAttribute('data-zone-id');
      const event = new CustomEvent('touchdrop', {
        detail: { draggableId: id, zoneId },
        bubbles: true,
      });
      dropZone.dispatchEvent(event);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`${className} ${isDragging ? 'dragging' : ''}`}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none', userSelect: 'none', cursor: disabled ? 'not-allowed' : 'grab' }}
    >
      {children}
    </div>
  );
}

interface DropZoneProps {
  zoneId: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onDrop?: (draggableId: string, zoneId: string) => void;
  onDragOver?: (zoneId: string) => void;
  onDragLeave?: (zoneId: string) => void;
}

export function DropZone({
  zoneId,
  children,
  className = '',
  activeClassName = 'drop-active',
  onDrop,
  onDragOver,
  onDragLeave,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) {
      setIsDragOver(true);
      onDragOver?.(zoneId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Kontrolli, kas lahkume tõesti zone'i (mitte child element)
    const rect = zoneRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsDragOver(false);
        onDragLeave?.(zoneId);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggableId = e.dataTransfer.getData('draggableId');
    if (draggableId) {
      onDrop?.(draggableId, zoneId);
    }
  };

  // Touch drop listener
  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;

    const handleTouchDrop = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.zoneId === zoneId) {
        onDrop?.(customEvent.detail.draggableId, zoneId);
      }
    };

    zone.addEventListener('touchdrop', handleTouchDrop);
    return () => zone.removeEventListener('touchdrop', handleTouchDrop);
  }, [zoneId, onDrop]);

  return (
    <div
      ref={zoneRef}
      data-drop-zone="true"
      data-zone-id={zoneId}
      className={`${className} ${isDragOver ? activeClassName : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}

// Hook for simple drag state
export function useDragDrop() {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  return { draggedId, handleDragStart, handleDragEnd };
}