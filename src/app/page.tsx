'use client';

import React, {useState} from 'react';
import NavigationList from '../components/NavigationList';
import Form from '../components/Form';
import Image from 'next/image';
import {v4 as uuidv4} from 'uuid';

interface NavigationItem {
    id: string;
    label: string;
    url?: string;
    children?: NavigationItem[];
}

export default function Home() {
    const [items, setItems] = useState<NavigationItem[]>([]);
    const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
    const [parentForSubmenu, setParentForSubmenu] = useState<string | null>(
        null
    );
    const [isFormVisible, setFormVisible] = useState(false);

    const handleAddOrEditItem = (data: Omit<NavigationItem, 'id'>) => {
        if (editingItem) {
            const updateItemById = (items: NavigationItem[], id: string): NavigationItem[] => {
                return items.map(item => {
                    if (item.id === id) {
                        return { ...item, ...data };
                    } else if (item.children) {
                        return { ...item, children: updateItemById(item.children, id) };
                    } else {
                        return item;
                    }
                });
            };
    
            setItems(prevItems => updateItemById(prevItems, editingItem.id));
            setEditingItem(null);
        } else if (parentForSubmenu) {
            setItems((prevItems) => {
                const addSubmenu = (node: NavigationItem): NavigationItem => {
                    if (node.id === parentForSubmenu) {
                        return {
                            ...node,
                            children: [
                                ...(node.children || []),
                                {id: uuidv4(), ...data},
                            ],
                        };
                    }
                    return {
                        ...node,
                        children: node.children
                            ? node.children.map(addSubmenu)
                            : [],
                    };
                };
                return prevItems.map(addSubmenu);
            });
            setParentForSubmenu(null);
        } else {
            setItems([...items, {id: uuidv4(), ...data}]);
        }
        setFormVisible(false);
    };

    const handleDeleteItem = (id: string) => {
        const deleteRecursive = (items: NavigationItem[]) =>
            items.filter((item) => {
                if (item.id === id) return false;
                if (item.children)
                    item.children = deleteRecursive(item.children);
                return true;
            });
        setItems(deleteRecursive(items));
    };

    const handleShowForm = (item?: NavigationItem, parentId?: string) => {
        if (item) {
            setEditingItem(item);
        } else if (parentId) {
            setParentForSubmenu(parentId);
        } else {
            setParentForSubmenu(null);
            setEditingItem(null);
        }
        setFormVisible(true);
    };

    const getForm = (id?: string) => {
        let viewForm = false;

        if(editingItem) {
            if (editingItem.id === id) {
                viewForm = true;
            }
        } else if (parentForSubmenu) {
            if (parentForSubmenu === id) {
                viewForm = true;
            }
        } else if (id === undefined) {
            viewForm = true;
        }

        return viewForm && isFormVisible && (
            <div className='p-4 bg-[#F9FAFB]'>
            <Form
      
                defaultValues={editingItem || undefined}
                onSubmit={handleAddOrEditItem}
                onCancel={() => {
                    setEditingItem(null);
                    setParentForSubmenu(null);
                    setFormVisible(false);
                }}
            />
            </div>
        )
    }

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='border border-borderColor rounded-default bg-[#EAECF0] w-[1168px]'>
                {/* When the list is empty */}
                {items.length === 0 &&
                    (!isFormVisible ? (
                        <div className='text-center flex flex-col items-center justify-center m-containerMargin p-6 md:p-8'>
                            <h1 className='text-[16px] font-semibold text-labelColor mb-2'>
                                Menu jest puste
                            </h1>
                            <p className='text-urlColor text-[14px] mb-6'>
                                W tym menu nie ma jeszcze żadnych linków
                            </p>
                            <button
                                onClick={() => handleShowForm()}
                                className='flex items-center bg-primary text-white px-buttonPaddingX py-buttonPaddingY rounded-default hover:bg-purple-600'
                            >
                                <Image
                                    src='/icons/plus-circle.svg'
                                    alt='Add'
                                    width={20}
                                    height={20}
                                    className='mr-2'
                                />
                                Dodaj pozycję menu
                            </button>
                        </div>
                    ) : (
                        // Display the form without extra padding
                        <Form
                            defaultValues={editingItem || undefined}
                            onSubmit={handleAddOrEditItem}
                            onCancel={() => {
                                setEditingItem(null);
                                setParentForSubmenu(null);
                                setFormVisible(false);
                            }}
                        />
                    ))}

                {/* When the list has items */}
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
                        />

                        {getForm()}

                        <div className='flex justify-start items-center border border-borderColor rounded-lg p-4 h-[80px]'>
                            <button
                                onClick={() => handleShowForm()}
                                className='flex justify-center items-center text-sm font-semibold text-buttonText hover:underline bg-white rounded-lg h-buttonHeight w-[169px]'
                            >
                                Dodaj pozycję menu
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
