import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationList from '@/components/NavigationList';

describe('NavigationList Component', () => {
    const mockItems = [
        {
            id: '1',
            label: 'Home',
            url: 'https://example.com',
            parentId: null,
            children: [],
        },
        {
            id: '2',
            label: 'About',
            url: 'https://example.com/about',
            parentId: null,
            children: [],
        },
    ];

    const onEditMock = jest.fn();
    const onDeleteMock = jest.fn();
    const onAddSubmenuMock = jest.fn();
    const onReorderMock = jest.fn();
    const formMock: (id?: string) => false | React.JSX.Element = jest
        .fn()
        .mockImplementation(() => false);

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders a list of navigation items correctly', () => {
        render(
            <NavigationList
                items={mockItems}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                onReorder={onReorderMock}
            />
        );

        expect(screen.getByText(/^Home$/i)).toBeInTheDocument();
        expect(screen.getByText(/^About$/i)).toBeInTheDocument();
    });

    test("calls onEdit when an item's Edit button is clicked", () => {
        render(
            <NavigationList
                items={mockItems}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                onReorder={onReorderMock}
            />
        );

        fireEvent.click(screen.getAllByRole('button', {name: /Edytuj/i})[0]);
        expect(onEditMock).toHaveBeenCalledWith(mockItems[0]);
    });

    test("calls onDelete when an item's Delete button is clicked", () => {
        render(
            <NavigationList
                items={mockItems}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                onReorder={onReorderMock}
            />
        );

        fireEvent.click(screen.getAllByRole('button', {name: /Usuń/i})[1]);
        expect(onDeleteMock).toHaveBeenCalledWith(mockItems[1].id);
    });

    test("calls onAddSubmenu when an item's Add Menu Item button is clicked", () => {
        render(
            <NavigationList
                items={mockItems}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                onReorder={onReorderMock}
            />
        );

        fireEvent.click(
            screen.getAllByRole('button', {name: /Dodaj pozycję menu/i})[0]
        );
        expect(onAddSubmenuMock).toHaveBeenCalledWith(mockItems[0].id);
    });

    test('calls onReorder when items are reordered', () => {
        render(
            <NavigationList
                items={mockItems}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
                onAddSubmenu={onAddSubmenuMock}
                form={formMock}
                onReorder={onReorderMock}
            />
        );

        const newOrder = [mockItems[1], mockItems[0]];
        onReorderMock(newOrder);

        expect(onReorderMock).toHaveBeenCalledWith(newOrder);
    });
});
