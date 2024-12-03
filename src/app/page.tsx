'use client';

import React, {useState, useCallback} from 'react';
import NavigationList from '../components/NavigationList';
import Form from '../components/Form';
import Image from 'next/image';
import {v4 as uuidv4} from 'uuid';

interface NavigationItem {
    id: string;
    label: string;
    url?: string;
    parentId: string | null;
    children?: NavigationItem[];
}

const updateItemById = (
    items: NavigationItem[],
    id: string,
    data: Omit<NavigationItem, 'id' | 'parentId'>
): NavigationItem[] =>
    items.map((item) => {
        if (item.id === id) {
            return {...item, ...data};
        }
        if (item.children) {
            return {...item, children: updateItemById(item.children, id, data)};
        }
        return item;
    });

const addSubmenu = (
    items: NavigationItem[],
    parentId: string,
    newItem: NavigationItem
): NavigationItem[] =>
    items.map((item) => {
        if (item.id === parentId) {
            return {...item, children: [...(item.children || []), newItem]};
        }
        if (item.children) {
            return {
                ...item,
                children: addSubmenu(item.children, parentId, newItem),
            };
        }
        return item;
    });

const deleteRecursive = (
    items: NavigationItem[],
    id: string
): NavigationItem[] =>
    items
        .filter((item) => item.id !== id)
        .map((item) => ({
            ...item,
            children: item.children
                ? deleteRecursive(item.children, id)
                : undefined,
        }))
        .filter((item) => item !== undefined) as NavigationItem[];

export default function Home() {
    const [items, setItems] = useState<NavigationItem[]>([]);
    const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
    const [parentForSubmenu, setParentForSubmenu] = useState<string | null>(
        null
    );
    const [isFormVisible, setFormVisible] = useState(false);

    const handleAddOrEditItem = useCallback(
        (data: Omit<NavigationItem, 'id' | 'parentId'>) => {
            if (editingItem) {
                const updatedItems = updateItemById(
                    items,
                    editingItem.id,
                    data
                );
                setItems(updatedItems);
                setEditingItem(null);
            } else if (parentForSubmenu) {
                const newItem: NavigationItem = {
                    id: uuidv4(),
                    parentId: parentForSubmenu,
                    ...data,
                };
                const updatedItems = addSubmenu(
                    items,
                    parentForSubmenu,
                    newItem
                );
                setItems(updatedItems);
                setParentForSubmenu(null);
            } else {
                const newItem: NavigationItem = {
                    id: uuidv4(),
                    parentId: null,
                    ...data,
                };
                setItems((prevItems) => [...prevItems, newItem]);
            }
            setFormVisible(false);
        },
        [editingItem, parentForSubmenu, items]
    );

    const handleDeleteItem = useCallback(
        (id: string) => {
            const updatedItems = deleteRecursive(items, id);
            setItems(updatedItems);
        },
        [items]
    );

    const handleReorder = useCallback((reorderedItems: NavigationItem[]) => {
        setItems(reorderedItems);
    }, []);

    const handleShowForm = useCallback(
        (item?: NavigationItem, parentId?: string) => {
            if (item) {
                setEditingItem(item);
            } else if (parentId) {
                setParentForSubmenu(parentId);
            } else {
                setEditingItem(null);
                setParentForSubmenu(null);
            }
            setFormVisible(true);
        },
        []
    );

    const handleCancelForm = useCallback(() => {
        setEditingItem(null);
        setParentForSubmenu(null);
        setFormVisible(false);
    }, []);

    const getForm = useCallback(
        (id?: string): false | JSX.Element => {
            let shouldViewForm = false;

            if (editingItem && editingItem.id === id) {
                shouldViewForm = true;
            } else if (parentForSubmenu && parentForSubmenu === id) {
                shouldViewForm = true;
            } else if (!editingItem && !parentForSubmenu && id === undefined) {
                shouldViewForm = true;
            }

            if (!shouldViewForm || !isFormVisible) return false;

            const paddingClass = parentForSubmenu
                ? 'py-[20px] pr-[24px] pl-[64px]'
                : 'py-4 px-6';

            return (
                <div className={`bg-cardBackground ${paddingClass}`}>
                    <Form
                        defaultValues={editingItem || undefined}
                        onSubmit={handleAddOrEditItem}
                        onCancel={handleCancelForm}
                    />
                </div>
            );
        },
        [
            editingItem,
            parentForSubmenu,
            isFormVisible,
            handleAddOrEditItem,
            handleCancelForm,
        ]
    );

    return (
        <div className='flex items-center justify-center min-h-screen py-[30px] px-[24px]'>
            <div className='border border-borderColorSecondary rounded-default bg-cardBackground w-[1168px]'>
                {items.length === 0 && !isFormVisible ? (
                    <EmptyState onAdd={() => handleShowForm()} />
                ) : (
                    <>
                        {items.length > 0 && (
                            <>
                                <NavigationList
                                    items={items}
                                    onEdit={handleShowForm}
                                    onDelete={handleDeleteItem}
                                    onAddSubmenu={(parentId) =>
                                        handleShowForm(undefined, parentId)
                                    }
                                    form={getForm}
                                    onReorder={handleReorder}
                                />
                                {getForm()}
                                <Footer onAdd={() => handleShowForm()} />
                            </>
                        )}
                        {isFormVisible && items.length === 0 && (
                            <Form
                                defaultValues={editingItem || undefined}
                                onSubmit={handleAddOrEditItem}
                                onCancel={handleCancelForm}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

interface EmptyStateProps {
    onAdd: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({onAdd}) => (
    <div className='text-center flex flex-col items-center justify-center m-containerMargin p-6 md:p-8'>
        <h1 className='text-[16px] font-semibold text-labelColor mb-2'>
            Menu jest puste
        </h1>
        <p className='text-urlColor text-[14px] mb-6'>
            W tym menu nie ma jeszcze żadnych linków
        </p>
        <button
            onClick={onAdd}
            className='flex items-center bg-primary text-white px-buttonPaddingX py-buttonPaddingY rounded-default hover:secondaryText'
        >
            <Image
                src='/icons/plus-circle.svg'
                alt='Add'
                width={20}
                height={20}
                className='mr-2'
                style={{width: 20, height: 20}}
            />
            Dodaj pozycję menu
        </button>
    </div>
);

interface FooterProps {
    onAdd: () => void;
}

const Footer: React.FC<FooterProps> = ({onAdd}) => (
    <div className='flex justify-start items-center border border-borderColorSecondary rounded-b-lg p-4 h-[80px] bg-mainBackground'>
        <button
            onClick={onAdd}
            className='flex justify-center items-center border border-borderColorPrimary text-sm font-semibold text-buttonText bg-white rounded-lg h-buttonHeight w-[169px] hover:bg-gray-100'
        >
            Dodaj pozycję menu
        </button>
    </div>
);
