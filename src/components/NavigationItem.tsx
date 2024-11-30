import React from 'react';
import Image from 'next/image';
import {
    useSortable,
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

interface NavigationItemProps {
    item: {
        id: string;
        label: string;
        url?: string;
        parentId: string | null;
        children?: NavigationItemProps['item'][];
    };
    onEdit: (item: NavigationItemProps['item']) => void;
    onDelete: (id: string) => void;
    onAddSubmenu: (parentId: string) => void;
    form: (id?: string) => false | React.JSX.Element;
}

export default function NavigationItem({
    item,
    onEdit,
    onDelete,
    onAddSubmenu,
    form,
}: NavigationItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const indentClass = item.parentId ? 'pl-6' : '';

    return (
        <li ref={setNodeRef} style={style}>
            <div className={`${indentClass}`}>
                <div className='flex justify-between items-center bg-white border border-borderColor rounded-lg p-4 h-menuItemHeight'>
                    <div className='flex items-center space-x-4'>
                        <div
                            {...listeners}
                            {...attributes}
                            className='cursor-pointer'
                        >
                            <Image
                                src='/icons/move.svg'
                                alt='Move'
                                width={16}
                                height={16}
                                className='cursor-pointer'
                            />
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-labelColor'>
                                {item.label}
                            </p>
                            {item.url && (
                                <a
                                    href={item.url}
                                    className='text-sm text-urlColor hover:underline'
                                >
                                    {item.url}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className='flex space-x-4 items-center bg-white border border-borderColorPrimary rounded-lg p-4 h-buttonHeight'>
                        <button
                            onClick={() => onDelete(item.id)}
                            className='flex items-center text-sm font-semibold text-buttonText hover:underline'
                        >
                            Usuń
                        </button>

                        <button
                            onClick={() => onEdit(item)}
                            className='flex items-center text-sm font-semibold text-buttonText hover:underline'
                        >
                            Edytuj
                        </button>

                        <button
                            onClick={() => onAddSubmenu(item.id)}
                            className='flex items-center text-sm font-semibold text-buttonText hover:underline'
                        >
                            Dodaj pozycję menu
                        </button>
                    </div>
                </div>

                {form(item.id)}

                {item.children && item.children.length > 0 && (
                    <SortableContext
                        items={item.children.map((child) => child.id)}
                        strategy={rectSortingStrategy}
                    >
                        <ul>
                            {item.children.map((child) => (
                                <NavigationItem
                                    key={child.id}
                                    item={child}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onAddSubmenu={onAddSubmenu}
                                    form={form}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                )}
            </div>
        </li>
    );
}
