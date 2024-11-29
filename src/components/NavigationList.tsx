'use client';

import React from 'react';
import {
    DndContext,
    closestCenter,
    useDraggable,
    useDroppable,
    DragOverlay,
    rectSortingStrategy,
    SortableContext,
    arrayMove,
} from '@dnd-kit/core';
import NavigationItem from './NavigationItem';

interface NavigationItemProps {
    id: string;
    label: string;
    url?: string;
    children?: NavigationItemProps[];
    form?: (id?: string) => false | React.JSX.Element;
}

interface NavigationListProps {
    items: NavigationItemProps[];
    onEdit: (item: NavigationItemProps) => void;
    onDelete: (id: string) => void;
    onAddSubmenu: (parentId: string) => void;
    form: () => false | React.JSX.Element;
}

export default function NavigationList({
    items,
    onEdit,
    onDelete,
    onAddSubmenu,
    form,
}: NavigationListProps) {

    // const [activeId, setActiveId] = useState<string | null>(null);

    // const handleDragStart = (event: any) => {
    //     setActiveId(event.active.id);
    // };

    // const handleDragEnd = (event: any) => {
    //     const { active, over } = event;

    //     if (active && over && active.id !== over.id) {
    //         const oldIndex = items.findIndex((item) => item.id === active.id);
    //         const newIndex = items.findIndex((item) => item.id === over.id);

    //         if (oldIndex !== -1 && newIndex !== -1) {
    //             const reorderedItems = arrayMove(items, oldIndex, newIndex);
    //             onReorder(reorderedItems);
    //         }
    //     }

    //     setActiveId(null);
    // };

    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>
                    <NavigationItem
                        item={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onAddSubmenu={onAddSubmenu}
                        form={form}
                    />
                </li>
            ))}
        </ul>
    );
}

