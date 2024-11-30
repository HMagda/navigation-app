import React, {useState} from 'react';
import {
    DndContext,
    closestCenter,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {SortableContext, rectSortingStrategy} from '@dnd-kit/sortable';
import NavigationItem from './NavigationItem';

interface NavigationItemType {
    id: string;
    label: string;
    url?: string;
    parentId: string | null;
    children?: NavigationItemType[];
}

interface NavigationListProps {
    items: NavigationItemType[];
    onEdit: (item: NavigationItemType) => void;
    onDelete: (id: string) => void;
    onAddSubmenu: (parentId: string) => void;
    form: (id?: string) => false | React.JSX.Element;
    onReorder: (items: NavigationItemType[]) => void;
}

export default function NavigationList({
    items,
    onEdit,
    onDelete,
    onAddSubmenu,
    form,
    onReorder,
}: NavigationListProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    const flattenedItems = flattenItems(items);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const {active, over} = event;

        if (active && over && active.id !== over.id) {
            const newItems = moveItemInTree(items, active.id, over.id);
            onReorder(newItems);
        }

        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
        >
            <SortableContext
                items={items.map((item) => item.id)}
                strategy={rectSortingStrategy}
            >
                <ul>
                    {items.map((item) => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddSubmenu={onAddSubmenu}
                            form={form}
                        />
                    ))}
                </ul>
            </SortableContext>

            <DragOverlay>
                {activeId ? (
                    <div className='p-4 bg-white shadow rounded-lg'>
                        {
                            flattenedItems.find((item) => item.id === activeId)
                                ?.label
                        }
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// Helper functions

function flattenItems(items: NavigationItemType[]): NavigationItemType[] {
    const flatList: NavigationItemType[] = [];

    function recurse(items: NavigationItemType[]) {
        for (const item of items) {
            flatList.push(item);
            if (item.children && item.children.length > 0) {
                recurse(item.children);
            }
        }
    }

    recurse(items);
    return flatList;
}

function findItemById(
    items: NavigationItemType[],
    id: string
): NavigationItemType | null {
    for (const item of items) {
        if (item.id === id) {
            return item;
        }
        if (item.children) {
            const found = findItemById(item.children, id);
            if (found) return found;
        }
    }
    return null;
}

function moveItemInTree(
    items: NavigationItemType[],
    itemId: string,
    targetId: string
): NavigationItemType[] {
    const itemToMove = findItemById(items, itemId);
    const targetItem = findItemById(items, targetId);

    if (!itemToMove || !targetItem) return items;

    if (itemToMove.parentId === targetItem.parentId) {
        // Same parent, reorder within the same siblings
        return moveItemWithinParent(items, itemToMove, targetItem);
    } else {
        // Different parents, move item to new parent's children
        // Handle moving to new parent if needed
        return moveItemToNewParent(items, itemToMove, targetItem);
    }
}

function moveItemWithinParent(
    items: NavigationItemType[],
    itemToMove: NavigationItemType,
    targetItem: NavigationItemType
): NavigationItemType[] {
    const parentId = itemToMove.parentId;

    const siblings = parentId
        ? findItemById(items, parentId)?.children || []
        : items;

    const itemIndex = siblings.findIndex((item) => item.id === itemToMove.id);
    const targetIndex = siblings.findIndex((item) => item.id === targetItem.id);

    if (itemIndex === -1 || targetIndex === -1) return items;

    const newSiblings = [...siblings];
    newSiblings.splice(itemIndex, 1);
    newSiblings.splice(targetIndex, 0, itemToMove);

    const newItems = setSiblingsInItems(items, parentId, newSiblings);
    return newItems;
}

function setSiblingsInItems(
    items: NavigationItemType[],
    parentId: string | null,
    newSiblings: NavigationItemType[]
): NavigationItemType[] {
    if (parentId === null) {
        return newSiblings;
    } else {
        return items.map((item) => {
            if (item.id === parentId) {
                return {...item, children: newSiblings};
            } else if (item.children) {
                return {
                    ...item,
                    children: setSiblingsInItems(
                        item.children,
                        parentId,
                        newSiblings
                    ),
                };
            } else {
                return item;
            }
        });
    }
}

function moveItemToNewParent(
    items: NavigationItemType[],
    itemToMove: NavigationItemType,
    targetItem: NavigationItemType
): NavigationItemType[] {
    // Remove item from its current location
    let newItems = removeItemById(items, itemToMove.id);

    const newParentId = targetItem.parentId;

    // Update the parentId of the item being moved
    const updatedItemToMove = {...itemToMove, parentId: newParentId};

    // Insert the item into the new parent's children
    newItems = insertItem(
        newItems,
        newParentId,
        updatedItemToMove,
        targetItem.id,
        'after' // or 'before', depending on desired behavior
    );

    return newItems;
}

function removeItemById(
    items: NavigationItemType[],
    id: string
): NavigationItemType[] {
    return items
        .filter((item) => item.id !== id)
        .map((item) => {
            if (item.children) {
                return {...item, children: removeItemById(item.children, id)};
            }
            return item;
        });
}

function insertItem(
    items: NavigationItemType[],
    parentId: string | null,
    itemToInsert: NavigationItemType,
    targetId: string,
    position: 'before' | 'after'
): NavigationItemType[] {
    if (parentId === null) {
        const index = items.findIndex((item) => item.id === targetId);
        const newItems = [...items];
        if (index !== -1) {
            const insertIndex = position === 'before' ? index : index + 1;
            newItems.splice(insertIndex, 0, itemToInsert);
        } else {
            newItems.push(itemToInsert);
        }
        return newItems;
    } else {
        return items.map((item) => {
            if (item.id === parentId) {
                const children = item.children ? [...item.children] : [];
                const index = children.findIndex(
                    (child) => child.id === targetId
                );
                if (index !== -1) {
                    const insertIndex =
                        position === 'before' ? index : index + 1;
                    children.splice(insertIndex, 0, itemToInsert);
                } else {
                    children.push(itemToInsert);
                }
                return {...item, children};
            } else if (item.children) {
                return {
                    ...item,
                    children: insertItem(
                        item.children,
                        parentId,
                        itemToInsert,
                        targetId,
                        position
                    ),
                };
            }
            return item;
        });
    }
}
