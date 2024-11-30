'use client';

import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import Image from 'next/image';

interface FormProps {
    defaultValues?: {
        label: string;
        url?: string;
    };
    onSubmit: (data: {label: string; url?: string}) => void;
    onCancel: () => void;
}

export default function Form({defaultValues, onSubmit, onCancel}: FormProps) {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({defaultValues});

    const handleFormSubmit: SubmitHandler<{label: string; url?: string}> = (
        data
    ) => onSubmit(data);

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className='border border-borderColorPrimary rounded-lg p-6 space-y-4 m-containerMargin relative bg-white'
        >
            {/* Trash Icon */}
            <button
                type='button'
                onClick={onCancel}
                className='absolute top-4 right-4'
            >
                <Image
                    src='/icons/trash.svg'
                    alt='Delete'
                    width={24}
                    height={24}
                />
            </button>

            <div>
                <label className='block text-sm font-medium text-gray-700'>
                    Nazwa
                </label>
                <input
                    {...register('label', {required: 'Nazwa jest wymagana'})}
                    className='w-full border border-borderColorPrimary rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none'
                    placeholder='np. Promocje'
                />
                {errors.label && (
                    <p className='text-sm text-red-500 mt-1'>
                        {errors.label.message}
                    </p>
                )}
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700'>
                    Link
                </label>
                <input
                    {...register('url')}
                    className='w-full border border-borderColorPrimary rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none'
                    placeholder='Wklej lub wyszukaj'
                />
            </div>
            <div className='flex justify-start space-x-4'>
                <button
                    type='button'
                    onClick={onCancel}
                    className='px-4 py-2 text-buttonText font-buttonText border border-borderColorPrimary rounded-lg hover:bg-gray-100 h-buttonHeight'
                >
                    Anuluj
                </button>
                <button
                    type='submit'
                    className='px-4 py-2 text-secondaryText border-buttonBorder rounded-lg h-buttonHeight'
                >
                    Dodaj
                </button>
            </div>
        </form>
    );
}
