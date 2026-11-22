
import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '@/Components/Layouts/AuthLayout';
import Button from '@/Components/UI/Button';
import FormInput from '@/Components/UI/FormInput';
import toast from 'react-hot-toast';
import { useAuth } from '@/Hooks/useAuth';

export default function Login() {
    const { isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset
    } = useForm({
        login: 'superadmin',
        password: 'password123',
        remember: false,
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.visit(route('dashboard'));
        }
    }, [isAuthenticated]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onError: (errors) => {
                toast.error(
                    errors.login ||
                    'Invalid email/username or password!'
                );
            },
            onSuccess: () => {
                toast.success('Login successful! Welcome back.');
                reset('password');
            },
        });
    };

    return (
        <>
            <Head title="Sign In" />

            <AuthLayout
                title="Welcome to ERP SaaS!"
                subtitle="Sign in to manage your multi-tenant business management system."
            >
                <div className="max-w-md mx-auto w-full">

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Sign In
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <FormInput
                            label="Email or Username"
                            name="login"
                            type="text"
                            value={data.login}
                            onChange={(value) =>
                                setData('login', value)
                            }
                            error={errors.login}
                            icon={Mail}
                            placeholder="Enter username"
                            required
                            autoComplete="username"
                        />

                        <FormInput
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(value) =>
                                setData('password', value)
                            }
                            error={errors.password}
                            icon={Lock}
                            placeholder="Enter password"
                            required
                            autoComplete="current-password"
                            showPassword={showPassword}
                            onTogglePassword={() =>
                                setShowPassword(!showPassword)
                            }
                        />

                        <div className="flex items-center justify-between">

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData(
                                            'remember',
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-600"
                                />

                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Remember Me
                                </span>
                            </label>

                            <a
                                href="#"
                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                Forgot Password?
                            </a>

                        </div>

                        <Button
                            type="submit"
                            isLoading={processing}
                            className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500 py-3 text-base"
                        >
                            Sign In
                        </Button>

                    </form>
                </div>
            </AuthLayout>
        </>
    );
}
