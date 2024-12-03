import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationItem from '@/components/NavigationItem';

describe('NavigationItem Component', () => {
    const mockItem = {
        id: '1',
        label: 'Home',
        url: 'https://example.com',
        parentId: null,
        children: [],
    };

    const onEditMock = jest.fn();
    const onDeleteMock = jest.fn();
    const onAddSubmenuMock = jest.fn();
    const formMock: (id?: string) => false | React.JSX.Element = jest
        .fn()
        .mockImplementation(() => false);

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with given props', () => {
        render(
            <NavigationItem
                item={mockItem}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                hasParent={false}
            />
        );

        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/https:\/\/example\.com/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Usuń/i})).toBeInTheDocument();
        expect(
            screen.getByRole('button', {name: /Edytuj/i})
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', {name: /Dodaj pozycję menu/i})
        ).toBeInTheDocument();
    });

    test('calls onEdit when Edit button is clicked', () => {
        render(
            <NavigationItem
                item={mockItem}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                hasParent={false}
            />
        );

        fireEvent.click(screen.getByRole('button', {name: /Edytuj/i}));
        expect(onEditMock).toHaveBeenCalledWith(mockItem);
    });

    test('calls onDelete when Delete button is clicked', () => {
        render(
            <NavigationItem
                item={mockItem}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                hasParent={false}
            />
        );

        fireEvent.click(screen.getByRole('button', {name: /Usuń/i}));
        expect(onDeleteMock).toHaveBeenCalledWith(mockItem.id);
    });

    test('calls onAddSubmenu when Add Menu Item button is clicked', () => {
        render(
            <NavigationItem
                item={mockItem}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                hasParent={false}
            />
        );

        fireEvent.click(
            screen.getByRole('button', {name: /Dodaj pozycję menu/i})
        );
        expect(onAddSubmenuMock).toHaveBeenCalledWith(mockItem.id);
    });

    test('has draggable attributes set for drag-and-drop', () => {
        render(
            <NavigationItem
                item={mockItem}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                hasParent={false}
            />
        );

        const dragHandle = screen.getByAltText('Move').closest('div');
        expect(dragHandle).toHaveAttribute('role', 'button');
        expect(dragHandle).toHaveAttribute('tabindex', '0');
        expect(dragHandle).toHaveAttribute('aria-roledescription', 'sortable');
    });
});
