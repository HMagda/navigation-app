'use client';

import Image from 'next/image';




interface NavigationItemProps {
    item: {
        id: string;
        label: string;
        url?: string;
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

    return (
        <div>
            <div
                className='flex justify-between items-center w-[1168px] bg-white border border-borderColor rounded-lg p-4 h-menuItemHeight'
                
            >
                <div className='flex items-center space-x-4'>
                    <Image
                        src='/icons/move.svg'
                        alt='Move'
                        width={16}
                        height={16}
                        className='cursor-pointer'
                    />
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

                <div className='flex space-x-4 justify-between items-center bg-white border border-borderColor rounded-lg p-4 h-buttonHeight'>
                    <button
                        onClick={() => {
                            onDelete(item.id)
                        }}
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
                <div className='pl-6 border-l-2 border-borderColor'>
                    <ul>
                        {item.children.map((child) => (
                            <li key={child.id}>
                                <NavigationItem
                                    item={child}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onAddSubmenu={onAddSubmenu}
                                    form={form}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

