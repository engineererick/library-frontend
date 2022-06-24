import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { signIn } from '../../api/requests';

const SignIn = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const OnSubmit = async data => {
        const email = data.email;
        const password = data.password;

        const response = await signIn(email, password);
        if(response.remote === "success") {
            localStorage.setItem("session-token", response.data);
            navigate("/app/");
        }
        else{
            Swal.fire('Error', response.errors.errors, 'error');
        }
    }

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <img className="mx-auto h-20 w-auto" src="https://www.svgrepo.com/show/31136/books.svg" alt="Workflow" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(OnSubmit)}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input 
                                id="email" 
                                name="email" 
                                type="email" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Email address" 
                                {...register("email")}
                            />
                        </div>
                        <div className='pt-3'>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Password" 
                                {...register("password")}
                            />
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='w-1/2 mr-2'>
                            <button
                                type="button"
                                onClick={() => navigate('/signup')}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign up
                            </button>
                        </div>
                        <div className='w-1/2'>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Sign in
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignIn;