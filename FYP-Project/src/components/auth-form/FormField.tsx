import React from 'react'

type FormFieldProps = {
    id: string,
    label: string,
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    type,
    value,
    onChange,
    placeholder,
}) => (
    <div className="mb-4">
            <label className="block text-gray-300 mb-1" htmlFor={id}>{label}</label>
            <input
            id={id}
            className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 transition"
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            />
    </div>
);
