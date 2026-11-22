import { Link } from '@inertiajs/react';
import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ title, subTitle, breadcrumbItems }) {
    return (
        <div className="mb-3">
            <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400 list-none p-0 m-0 flex-wrap">
                    {breadcrumbItems?.map((item, index) => (
                        <React.Fragment key={index}>
                            <li className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                {item.href ? (
                                    <Link href={item.href} className="hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span>{item.label}</span>
                                )}
                            </li>
                            {index < breadcrumbItems.length - 1 && (
                                <li className="text-gray-400 dark:text-gray-600">
                                    <ChevronRight className="w-4 h-4" />
                                </li>
                            )}
                        </React.Fragment>
                    ))}
                    {subTitle && (
                        <>
                            {breadcrumbItems?.length > 0 && (
                                <li className="text-gray-400 dark:text-gray-600">
                                    <ChevronRight className="w-4 h-4" />
                                </li>
                            )}
                            <li className="text-primary-600 dark:text-primary-400 font-medium" aria-current="page">
                                {subTitle}
                            </li>
                        </>
                    )}
                </ol>
            </nav>
        </div>
    );
}