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
  const activeTouchZoneRef = useRef<Element | null>(null);

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData('draggableId', id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';

    setIsDragging(true);
    onDragStart?.(id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.(id);
  };

  const dispatchTouchZoneEvent = (
    zone: Element | null,
    eventName: 'touchdragenter' | 'touchdragleave' | 'touchdrop',
  ) => {
    if (!zone) return;

    const zoneId = zone.getAttribute('data-zone-id');
    zone.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { draggableId: id, zoneId },
        bubbles: true,
      })
    );
  };

  const findDropZoneAt = (clientX: number, clientY: number) => {
    const el = itemRef.current;
    if (!el) return null;

    const previousVisibility = el.style.visibility;
    el.style.visibility = 'hidden';
    const elemBelow = document.elementFromPoint(clientX, clientY);
    el.style.visibility = previousVisibility;

    return elemBelow?.closest('[data-drop-zone="true"]') ?? null;
  };

  const updateActiveTouchZone = (zone: Element | null) => {
    if (activeTouchZoneRef.current === zone) return;

    dispatchTouchZoneEvent(activeTouchZoneRef.current, 'touchdragleave');
    activeTouchZoneRef.current = zone;
    dispatchTouchZoneEvent(activeTouchZoneRef.current, 'touchdragenter');
  };

  const restoreTouchDrag = () => {
    const el = itemRef.current;
    if (!el) return;

    Object.entries(originalStyleRef.current).forEach(([key, value]) => {
      (el.style as unknown as Record<string, string>)[key] = value;
    });

    dispatchTouchZoneEvent(activeTouchZoneRef.current, 'touchdragleave');
    activeTouchZoneRef.current = null;
    setIsDragging(false);
    onDragEnd?.(id);
  };

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
      pointerEvents: el.style.pointerEvents,
      transform: el.style.transform,
    };

    el.style.position = 'fixed';
    el.style.zIndex = '9999';
    el.style.width = rect.width + 'px';
    el.style.left = (touch.clientX - offsetX) + 'px';
    el.style.top = (touch.clientY - offsetY) + 'px';
    el.style.pointerEvents = 'none';
    el.style.transform = 'scale(1.08)';

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

    updateActiveTouchZone(findDropZoneAt(touch.clientX, touch.clientY));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const dropZone = findDropZoneAt(touch.clientX, touch.clientY);

    if (dropZone) {
      dispatchTouchZoneEvent(dropZone, 'touchdrop');
    }

    restoreTouchDrag();
  };

  return (
    <div
      ref={itemRef}
      className={`${className} ${isDragging ? 'dragging dragging-touch' : ''}`.trim()}
      data-draggable-id={id}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={restoreTouchDrag}
      style={{ touchAction: 'none', userSelect: 'none', cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab' }}
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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver?.(zoneId);
  };

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
    const draggableId = e.dataTransfer.getData('draggableId') || e.dataTransfer.getData('text/plain');
    if (draggableId) {
      onDrop?.(draggableId, zoneId);
    }
  };

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;

    const handleTouchDrop = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.zoneId === zoneId) {
        onDrop?.(customEvent.detail.draggableId, zoneId);
      }
    };

    const handleTouchDragEnter = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.zoneId === zoneId) {
        setIsDragOver(true);
        onDragOver?.(zoneId);
      }
    };

    const handleTouchDragLeave = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.zoneId === zoneId) {
        setIsDragOver(false);
        onDragLeave?.(zoneId);
      }
    };

    zone.addEventListener('touchdrop', handleTouchDrop);
    zone.addEventListener('touchdragenter', handleTouchDragEnter);
    zone.addEventListener('touchdragleave', handleTouchDragLeave);

    return () => {
      zone.removeEventListener('touchdrop', handleTouchDrop);
      zone.removeEventListener('touchdragenter', handleTouchDragEnter);
      zone.removeEventListener('touchdragleave', handleTouchDragLeave);
    };
  }, [zoneId, onDrop, onDragOver, onDragLeave]);

  return (
    <div
      ref={zoneRef}
      data-drop-zone="true"
      data-zone-id={zoneId}
      className={`${className} ${isDragOver ? activeClassName : ''}`}
      onDragEnter={handleDragEnter}
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
