import { X } from 'lucide-react';
import React, { useState } from 'react'

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}


export default function LoginModel( {isOpen, onClose}: LoginModalProps ) {

    if (!isOpen) return null;
    
  return (
    <>
    {/* Overlay */}
        <div 
            className='flex inset-0 bg-black/60 z-40'
            onClick={onClose}
        />

        {/* Model */}
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div
                className='bg-white rounded-2xl w-full max-w-md relative shadow-2xl'
                onClick={(e) => e.stopPropagation()}
            >
                {/* CloseBTN */}
                <button
                    onClick={onClose} 
                    className='absolute righ-4 top-4 p-2 hover:bg-gray-100 rounded-full'
                >
                    <X size={20} className='text-gray-600' />
                </button>
                <div className='p-6 border-b'>
                    <h2 className='text-2xl font-bold text-gray-800'>
                        Login
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                <div className='p-6 space-y-4'>
                    <div>
                        <label className='text-sm font-medium text-gray-700'>
                            Email
                        </label>
                        <input
                            type='email'
                            className='w-full mt-1 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 p-6'
                            placeholder='Enter your Email'
                         />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700'>
                            Password
                        </label>
                        <input 
                            type='password'
                            className='w-full mt-1 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 p-6'
                            placeholder='Enter the Password'
                        />
                    </div>
                </div>
                
            </div>
        </div>
    </>
  )
}
