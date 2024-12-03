import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Home from '@/app/page';

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid'),
}));

describe('Home Page', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('renders correctly with no items', () => {
        render(<Home />);

        expect(screen.getByText(/Menu jest puste/i)).toBeInTheDocument();

        expect(
            screen.getByRole('button', {name: /Dodaj pozycję menu/i})
        ).toBeInTheDocument();
    });

    test('shows the form when "Dodaj pozycję menu" is clicked', async () => {
        render(<Home />);

        const addButton = screen.getByRole('button', {
            name: /Dodaj pozycję menu/i,
        });
        await userEvent.click(addButton);

        expect(await screen.findByLabelText(/Nazwa/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Link/i)).toBeInTheDocument();

        expect(
            await screen.findByRole('button', {name: /Dodaj/i})
        ).toBeInTheDocument();
    });

    test('adds a new navigation item through the form', async () => {
        render(<Home />);

        const addButton = screen.getByRole('button', {
            name: /Dodaj pozycję menu/i,
        });
        await userEvent.click(addButton);

        const nameInput = await screen.findByLabelText(/Nazwa/i);
        const urlInput = await screen.findByLabelText(/Link/i);
        const submitButton = screen.getByRole('button', {name: /Dodaj/i});

        await userEvent.type(nameInput, 'Dashboard');
        await userEvent.type(urlInput, 'https://dashboard.example.com');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/^Dashboard$/i)).toBeInTheDocument();
            expect(
                screen.getByText(/^https:\/\/dashboard\.example\.com$/i)
            ).toBeInTheDocument();
        });

        expect(screen.queryByLabelText(/Nazwa/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/Link/i)).not.toBeInTheDocument();
    });

    test('deletes an existing navigation item', async () => {
        render(<Home />);

        const addButton = screen.getByRole('button', {
            name: /Dodaj pozycję menu/i,
        });
        await userEvent.click(addButton);

        const nameInput = await screen.findByLabelText(/Nazwa/i);
        const urlInput = await screen.findByLabelText(/Link/i);
        const submitButton = screen.getByRole('button', {name: /Dodaj/i});

        await userEvent.type(nameInput, 'Dashboard');
        await userEvent.type(urlInput, 'https://dashboard.example.com');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/^Dashboard$/i)).toBeInTheDocument();
        });

        const deleteButton = screen.getByRole('button', {name: /Usuń/i});
        await userEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByText(/^Dashboard$/i)).not.toBeInTheDocument();
        });
    });
});
