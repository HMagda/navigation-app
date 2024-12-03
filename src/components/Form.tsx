'use client';

import React from 'react';
import {useForm, SubmitHandler, UseFormRegister} from 'react-hook-form';
import Image from 'next/image';

interface FormData {
    label: string;
    url?: string;
}

interface FormProps {
    defaultValues?: FormData;
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
}

interface InputFieldProps {
    id: keyof FormData;
    label: string;
    placeholder: string;
    register: UseFormRegister<FormData>;
    required?: boolean;
    error?: string;
    icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    label,
    placeholder,
    register,
    required = false,
    error,
    icon,
}) => (
    <div className='mr-[64px]'>
        <label
            htmlFor={`${id}-input`}
            className='block text-sm font-medium mb-2 text-buttonText'
        >
            {label}
        </label>
        <div className='relative'>
            <input
                id={`${id}-input`}
                placeholder={placeholder}
                {...register(
                    id,
                    required ? {required: `${label} jest wymagana`} : {}
                )}
                className={`w-full border border-borderColorPrimary rounded-lg p-2 ${
                    icon ? 'pl-9' : ''
                } focus:ring-primary focus:border-primary`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            {icon && (
                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                    {icon}
                </div>
            )}
        </div>
        {error && (
            <p id={`${id}-error`} className='text-sm text-red-500 mt-1'>
                {error}
            </p>
        )}
    </div>
);

const FormButtons: React.FC<{
    onCancel: () => void;
}> = ({onCancel}) => (
    <div className='flex justify-start space-x-2'>
        <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 text-buttonText font-buttonText border border-borderColorPrimary rounded-lg hover:bg-gray-100 h-buttonHeight'
        >
            Anuluj
        </button>
        <button
            type='submit'
            className='px-4 py-2 text-buttonText text-secondaryText font-buttonText border border-buttonBorder rounded-lg h-buttonHeight hover:bg-gray-100'
        >
            Dodaj
        </button>
    </div>
);

const DeleteButton: React.FC<{onCancel: () => void}> = ({onCancel}) => (
    <button
        type='button'
        onClick={onCancel}
        className='absolute top-6 right-8 p-2 hover:bg-gray-200 rounded-full'
        aria-label='Delete'
    >
        <Image src='/icons/trash.svg' alt='Delete' width={20} height={20} />
    </button>
);

export default function Form({defaultValues, onSubmit, onCancel}: FormProps) {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({defaultValues});

    const onSubmitHandler: SubmitHandler<FormData> = (data) => {
        onSubmit(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className='relative border border-borderColorPrimary rounded-lg p-6 space-y-4 bg-white'
            noValidate
        >
            <DeleteButton onCancel={onCancel} />

            <InputField
                id='label'
                label='Nazwa'
                placeholder='np. Promocje'
                register={register}
                required
                error={errors.label?.message}
            />

            <InputField
                id='url'
                label='Link'
                placeholder='Wklej lub wyszukaj'
                register={register}
                error={errors.url?.message}
                icon={
                    <Image
                        src='/icons/search.svg'
                        alt='Search'
                        width={16}
                        height={16}
                    />
                }
            />

            <FormButtons onCancel={onCancel} />
        </form>
    );
}
