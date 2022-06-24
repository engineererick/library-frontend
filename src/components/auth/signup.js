import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../api/requests';
import Swal from 'sweetalert2';

const SignUp = ({ from }) => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const OnSubmit = async data => {
        const email = data.email;
        const password = data.password;
        const cpassword = data.confirmPassword;
        const fullName = data.fullName;

        if(password !== cpassword){
          Swal.fire('Error', 'Passwords did not match', 'error');
          return;
        }

        const response = await signUp(email, password, fullName, from);
        if(response.remote === "success") {
            await Swal.fire('Success', 'Account created successfully', 'success');
            if(from !== 'admin') navigate("/signin");
        }
        else{
            Swal.fire('Error', response.errors.errors, 'error');
        }
    }

    return (
        <div className={ 
                from === 'admin' ? 
                'min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-2' : 
                "min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
            }
        >
            <div className="max-w-md w-full space-y-8">
                {
                    from !== 'admin' && (
                        <div>
                            <img className="mx-auto h-20 w-auto" src="https://www.svgrepo.com/show/31136/books.svg" alt="Workflow" />
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create new account</h2>
                        </div>
                    )
                }
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(OnSubmit)}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input 
                                id="email-address" 
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Password" 
                                {...register("password")}
                            />
                        </div>
                        <div className='pt-3'>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirm password</label>
                            <input 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                type="password" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Confirm password" 
                                {...register("confirmPassword")}
                            />
                        </div>
                        <div className='pt-3'>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                id="fullName" 
                                name="fullName" 
                                type="fullName" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Full name" 
                                {...register("fullName")}
                            />
                        </div>
                    </div>
                    <div className='flex'>
                        {
                            from !== 'admin' && (
                                <div className='w-1/2 mr-2'>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/signin')}
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )
                        }
                        
                        <div className={from === 'admin' ? 'w-full' : 'w-1/2'}>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                { from === 'admin' ? 'Create' : 'Sign up' }
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;