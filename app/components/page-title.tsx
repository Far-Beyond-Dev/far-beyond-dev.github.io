import React, { ReactNode } from 'react';

interface PageTitleProps {
    children: ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
    return (
        <div className="dark:bg-black bg-white dark:bg-dot-white/[0.3] bg-dot-black/[0.2] relative grid items-start">
            <div className="h-[21.4rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
                <h1 className="text-3xl lg:text-5xl font-bold align-text-bottom text-white absolute bottom-20">
                    {children}
                </h1>
                <div className="w-[40rem] absolute bottom-10">
                    {/* Gradients */}
                    <div className="absolute inset-x-20 bottom-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div className="absolute inset-x-20 bottom-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                    <div className="absolute inset-x-60 bottom-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div className="absolute inset-x-60 bottom-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
                </div>
            </div>
        </div>
    );
}
