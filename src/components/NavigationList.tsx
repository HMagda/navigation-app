import React, {useState} from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import NavigationItem from './NavigationItem';
import useThrottle from '@/app/useThrottle';

type Position = 'before' | 'after';

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

const findItemById = (
    items: NavigationItemType[],
    id: string
): NavigationItemType | null => {
    const directMatch = items.find((item) => item.id === id);
    if (directMatch) return directMatch;

    return items.reduce<NavigationItemType | null>((result, item) => {
        if (result) return result;
        return item.children ? findItemById(item.children, id) : null;
    }, null);
};

const isDescendant = (
    source: NavigationItemType,
    target: NavigationItemType
): boolean => {
    if (!source.children?.length) return false;

    return source.children.some(
        (child) => child.id === target.id || isDescendant(child, target)
    );
};

const removeItemById = (
    items: NavigationItemType[],
    id: string
): NavigationItemType[] => {
    return items
        .filter((item) => item.id !== id)
        .map((item) => ({
            ...item,
            ...(item.children && {
                children: removeItemById(item.children, id),
            }),
        }));
};

const insertItem = (
    items: NavigationItemType[],
    parentId: string | null,
    itemToInsert: NavigationItemType,
    targetId: string,
    position: Position
): NavigationItemType[] => {
    if (parentId === null) {
        const index = items.findIndex((item) => item.id === targetId);
        if (index === -1) return [...items, itemToInsert];

        const newItems = [...items];
        newItems.splice(
            position === 'before' ? index : index + 1,
            0,
            itemToInsert
        );
        return newItems;
    }

    return items.map((item) => {
        if (item.id !== parentId) {
            return item.children
                ? {
                      ...item,
                      children: insertItem(
                          item.children,
                          parentId,
                          itemToInsert,
                          targetId,
                          position
                      ),
                  }
                : item;
        }

        const children = item.children || [];
        if (!targetId) return {...item, children: [...children, itemToInsert]};

        const targetIndex = children.findIndex(
            (child) => child.id === targetId
        );
        if (targetIndex === -1)
            return {...item, children: [...children, itemToInsert]};

        const newChildren = [...children];
        newChildren.splice(
            position === 'before' ? targetIndex : targetIndex + 1,
            0,
            itemToInsert
        );
        return {...item, children: newChildren};
    });
};

const setSiblingsInItems = (
    items: NavigationItemType[],
    parentId: string | null,
    newSiblings: NavigationItemType[]
): NavigationItemType[] => {
    if (parentId === null) return newSiblings;

    return items.map((item) => {
        if (item.id === parentId) {
            return {...item, children: newSiblings};
        }

        return item.children
            ? {
                  ...item,
                  children: setSiblingsInItems(
                      item.children,
                      parentId,
                      newSiblings
                  ),
              }
            : item;
    });
};

const isValidMove = (
    items: NavigationItemType[],
    itemId: string,
    targetId: string
): {itemToMove: NavigationItemType; targetItem: NavigationItemType} | null => {
    const itemToMove = findItemById(items, itemId);
    const targetItem = findItemById(items, targetId);

    if (!itemToMove || !targetItem || isDescendant(itemToMove, targetItem)) {
        return null;
    }

    return {itemToMove, targetItem};
};

const moveItemInTree = (
    items: NavigationItemType[],
    itemId: string,
    targetId: string
): NavigationItemType[] => {
    const result = isValidMove(items, itemId, targetId);
    if (!result) return items;

    const {itemToMove, targetItem} = result;
    return itemToMove.parentId === targetItem.parentId
        ? moveItemWithinParent(items, itemToMove, targetItem)
        : moveItemToNewParent(items, itemToMove, targetItem);
};

const moveItemWithinParent = (
    items: NavigationItemType[],
    itemToMove: NavigationItemType,
    targetItem: NavigationItemType
): NavigationItemType[] => {
    const parentId = itemToMove.parentId;
    const siblings = parentId
        ? findItemById(items, parentId)?.children ?? []
        : items;

    const [itemIndex, targetIndex] = [
        siblings.findIndex((item) => item.id === itemToMove.id),
        siblings.findIndex((item) => item.id === targetItem.id),
    ];

    if (itemIndex === -1 || targetIndex === -1) return items;

    const newSiblings = [...siblings];
    newSiblings.splice(itemIndex, 1);
    newSiblings.splice(targetIndex, 0, itemToMove);

    return setSiblingsInItems(items, parentId, newSiblings);
};

const moveItemToNewParent = (
    items: NavigationItemType[],
    itemToMove: NavigationItemType,
    targetItem: NavigationItemType
): NavigationItemType[] => {
    const newParentId = targetItem.parentId;
    const endPosition: Position =
        itemToMove.parentId === targetItem.id ? 'before' : 'after';

    const updatedItemToMove = {
        ...itemToMove,
        parentId: newParentId,
    };

    return insertItem(
        removeItemById(items, itemToMove.id),
        newParentId,
        updatedItemToMove,
        targetItem.id,
        endPosition
    );
};

const NavigationList: React.FC<NavigationListProps> = ({
    items,
    onEdit,
    onDelete,
    onAddSubmenu,
    form,
    onReorder,
}) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = useThrottle((event: DragOverEvent) => {
        const {active, over} = event;
        if (!active?.id || !over?.id || active.id === over.id) return;

        const newItems = moveItemInTree(
            items,
            active.id as string,
            over.id as string
        );
        onReorder(newItems);
    }, 200);

    const handleDragEnd = () => {
        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <ul style={{listStyleType: 'none', paddingLeft: 0}}>
                    {items.map((item) => (
                        <NavigationItem
                            key={`nav-item-${item.id}`}
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddSubmenu={onAddSubmenu}
                            form={form}
                            isFirstParent={true}
                            hasParent={false}
                        />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
};

export default NavigationList;
