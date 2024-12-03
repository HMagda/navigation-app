import React from 'react';
import userEvent from '@testing-library/user-event';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import Form from '@/components/Form';

describe('Form Component', () => {
    const onSubmitMock = jest.fn();
    const onCancelMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders form with default values', () => {
        render(
            <Form
                defaultValues={{
                    label: 'Test Label',
                    url: 'https://example.com',
                }}
                onSubmit={onSubmitMock}
                onCancel={onCancelMock}
            />
        );

        expect(screen.getByLabelText(/Nazwa/i)).toHaveValue('Test Label');
        expect(screen.getByLabelText(/Link/i)).toHaveValue(
            'https://example.com'
        );
    });

    test('submits data correctly', async () => {
        render(<Form onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        await userEvent.type(screen.getByLabelText(/Nazwa/i), 'New Label');
        await userEvent.type(
            screen.getByLabelText(/Link/i),
            'https://newlink.com'
        );
        await userEvent.click(screen.getByText(/Dodaj/i));

        await waitFor(() => {
            expect(onSubmitMock).toHaveBeenCalledWith({
                label: 'New Label',
                url: 'https://newlink.com',
            });
        });
    });

    test('shows validation error when label is empty', async () => {
        render(<Form onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        fireEvent.click(screen.getByText(/Dodaj/i));

        expect(
            await screen.findByText(/Nazwa jest wymagana/i)
        ).toBeInTheDocument();
        expect(onSubmitMock).not.toHaveBeenCalled();
    });

    test('calls onCancel when "Anuluj" button is clicked', () => {
        render(<Form onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        fireEvent.click(screen.getByText(/Anuluj/i));

        expect(onCancelMock).toHaveBeenCalled();
    });
});
