import React, {memo, ReactElement} from 'react';
import Image from 'next/image';
import {
    useSortable,
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

interface NavigationItemType {
    id: string;
    label: string;
    url?: string;
    parentId: string | null;
    children?: NavigationItemType[];
}

interface NavigationItemProps {
    item: NavigationItemType;
    onEdit: (item: NavigationItemType) => void;
    onDelete: (id: string) => void;
    onAddSubmenu: (parentId: string) => void;
    form: (id?: string) => false | ReactElement;
    isFirstParent?: boolean;
    hasParent: boolean;
}

const ActionButtons: React.FC<{
    onEdit: () => void;
    onDelete: () => void;
    onAddSubmenu: () => void;
}> = ({onEdit, onDelete, onAddSubmenu}) => (
    <div className='flex items-center bg-white border border-borderColorPrimary rounded-lg'>
        <button
            onClick={onDelete}
            className='flex items-center text-sm font-semibold text-buttonText hover:bg-gray-100 px-4 py-2 border-r border-borderColorPrimary rounded-l-lg h-buttonHeight'
        >
            Usuń
        </button>
        <button
            onClick={onEdit}
            className='flex items-center text-sm font-semibold text-buttonText hover:bg-gray-100 px-4 py-2 border-r border-borderColorPrimary h-buttonHeight'
        >
            Edytuj
        </button>
        <button
            onClick={onAddSubmenu}
            className='flex items-center text-sm font-semibold text-buttonText hover:bg-gray-100 px-4 py-2 rounded-r-lg h-buttonHeight'
        >
            Dodaj pozycję menu
        </button>
    </div>
);

const NavigationItem: React.FC<NavigationItemProps> = ({
    item,
    onEdit,
    onDelete,
    onAddSubmenu,
    form,
    isFirstParent = false,
    hasParent,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: item.id});

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const indentClass = hasParent ? 'pl-[64px]' : '';
    let roundedClasses = '';
    if (isFirstParent) {
        roundedClasses += ' rounded-t-lg';
    }
    if (hasParent) {
        roundedClasses += ' rounded-bl-lg';
    }

    return (
        <li ref={setNodeRef} style={style}>
            <div className={indentClass}>
                <div
                    className={`flex justify-between items-center bg-white border border-borderColor p-4${roundedClasses}`}
                >
                    <div className='flex items-center space-x-4'>
                        <div
                            {...listeners}
                            {...attributes}
                            className='cursor-grab active:cursor-grabbing'
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
                                    className='text-sm text-urlColor hover:bg-gray-100'
                                >
                                    {item.url}
                                </a>
                            )}
                        </div>
                    </div>

                    <ActionButtons
                        onDelete={() => onDelete(item.id)}
                        onEdit={() => onEdit(item)}
                        onAddSubmenu={() => onAddSubmenu(item.id)}
                    />
                </div>

                {form(item.id)}

                {item.children && item.children.length > 0 && (
                    <SortableContext
                        items={item.children.map((child) => child.id)} // Ensure consistency here
                        strategy={rectSortingStrategy}
                    >
                          <ul>
                            {item.children.map((child) => (
                                <MemoizedNavigationItem
                                    key={child.id}
                                    item={child}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onAddSubmenu={onAddSubmenu}
                                    form={form}
                                    isFirstParent={false}
                                    hasParent={true}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                )}
            </div>
        </li>
    );
};

const MemoizedNavigationItem = memo(NavigationItem);

export default MemoizedNavigationItem;
