import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBookById } from '../../api/requests';
import { parseJWT } from '../jwt/parseJWT';
import Swal from 'sweetalert2';
import { updateBook } from '../../api/requests';
import { useForm } from 'react-hook-form';

export const EditBook = () => {
    const { state: { id }} = useLocation();
    const navigate = useNavigate();
    const { register, setValue, handleSubmit, reset } = useForm();
    const [book, setBook] = useState({});
    const [role, setRole] = useState('');
    const [cover, setCover] = useState('');

    useEffect(() => {
        if(parseJWT().role !== 'admin') navigate(-1);
        setRole(parseJWT().role);
        getBookDetails();
    }, []);

    const getBookDetails = async () => {
        const response = await getBookById(id);
        if(response.remote === 'success'){
            setValue('title', response.data.title);
            setValue('yearofpublication', response.data.yearofpublication);
            setValue('author', response.data.author);
            setValue('category', response.data.category);
            setCover(response.data.cover);
            setBook(response.data);
        }
    }

    const OnSubmit = async data => {
        if(data.cover[0]?.size > 10485760){
            Swal.fire('Error', 'File should be less than 10MB', 'error');
            return;
        }
        const title = data.title;
        const yearofpublication = data.yearofpublication;
        const author = data.author;
        const category = data.category;
        const _cover = data.cover.length > 0 ? await convertToBase64(data.cover[0]) : cover;
        const available = book.available;
        const user = book.user;
        const token = localStorage.getItem('session-token');

        if(data.cover.length === 0){
            const response = await updateBook(id, title, yearofpublication, author, category, _cover, available, user, token);
            if(response.remote === 'success'){
                Swal.fire('Success', 'Book updated successfully', 'success');
                navigate('/app/');
            }
        }
        else{
            getImageDimensions(data.cover[0], async callback => {
                const { width, height } = callback;
                if(width > 612 || height > 720){
                    Swal.fire('Error', 'Image should be less than 612 x 720', 'error');
                    return;
                }
                const response = await updateBook(id, title, yearofpublication, author, category, _cover, available, user, token);
                if(response.remote === "success") {
                    Swal.fire('Success', 'Book updated successfully', 'success');
                    navigate(-1);
                }
                else{
                    Swal.fire('Error', response.errors.errors, 'error');
                }
            });
        }
    }

    const getImageDimensions = (file, callback) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const dimensions = {
                width: img.width,
                height: img.height
            }
            URL.revokeObjectURL(img.src);
            callback(dimensions);
        }
    }

    const convertToBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const updateCover = async event => {
        if(event.target.files[0].size > 10485760){
            Swal.fire('Error', 'File should be less than 10MB', 'error');
            reset({
                cover: book.cover
            });
            return;
        }

        getImageDimensions(event.target.files[0], async callback => {
            const { width, height } = callback;
            if(width > 612 || height > 720){
                Swal.fire('Error', 'Image should be less than 612 x 720', 'error');
                reset({
                    cover: book.cover
                });
                return;
            }
            const newCover = await convertToBase64(event.target.files[0]);
            const _book = book;
            _book.cover = newCover;
            setCover(newCover);
            setBook(_book);
        });
    }

    return (
        <div className="bg-white">
        <div className="pt-6">
            <div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4 lg:border-r lg:border-gray-300">
                <img
                    src={cover}
                    alt={book.title}
                    style={{ height: '600px', objectFit: 'contain' }}
                    className="w-full h-full object-center object-cover"
                />
            </div>
            <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
                <div className="mt-4 lg:mt-0 lg:row-span-3 ">
                    <div className='mt-10 grid grid-cols-12'>
                        <div className='col-span-12'>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input 
                                id="title" 
                                name="title" 
                                type="text" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 " 
                                placeholder="Title" 
                                {...register("title")}
                            />
                        </div>
                    </div>
                    <div className='mt-5 grid grid-cols-12'>
                        <div className='col-span-12'>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                            <input 
                                id="author" 
                                name="author" 
                                type="text" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Author" 
                                {...register("author")}
                            />
                        </div>
                    </div>
                    <div className="mt-5 grid grid-cols-12">
                        <div className='col-span-12'>
                            <label htmlFor="yearofpublication" className="block text-sm font-medium text-gray-700">Year of publication</label>
                            <input 
                                id="yearofpublication" 
                                name="yearofpublication" 
                                type="date" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Year of publication" 
                                {...register("yearofpublication")}
                            />
                        </div>
                    </div>
                    <div className="mt-5 grid grid-cols-12">
                        <div className='col-span-12'>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <input 
                                id="category" 
                                name="category" 
                                type="text" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Category" 
                                {...register("category")}
                            />
                        </div>
                    </div>
                    <div className="mt-5 grid grid-cols-12">
                        <div className='col-span-12'>
                            <label htmlFor="cover" className="block text-sm font-medium text-gray-700">Cover</label>
                            <input 
                                id="cover" 
                                name="cover" 
                                type="file" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10" 
                                accept="image/png, image/gif, image/jpeg"
                                {...register("cover")}
                                onChange={updateCover}
                            />
                        </div>
                    </div>
                {
                    role === 'admin' && (
                    <div className="mt-10 grid lg:grid-cols-5 xs:grid-cols-12 place-items-center">
                        {
                        book.available ? (
                            <div className='sm:col-span-5 xs:col-span-12 mx-auto flex-shrink-0 flex items-center justify-center w-full h-full rounded-full bg-green-300 sm:mx-0'>
                            <p className='font-bold text-gray-900'>Available</p>
                            </div>
                        ) :
                        (
                            <div className='sm:col-span-5 xs:col-span-12 mx-auto flex-shrink-0 flex items-center justify-center w-full h-full rounded-full bg-red-300 sm:mx-0'>
                            <p className='font-bold text-gray-900'>Not available</p>
                            </div>
                        )
                        }
                    </div>
                    )
                }
                <div className='mt-10 lg:grid lg:grid-cols-2'>
                    {
                    role === 'admin' && (
                        <React.Fragment>
                        <div className='lg:mr-2'>
                            <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mt-10 w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                            Cancel
                            </button>
                        </div>
                        <div className='lg:ml-2'>
                            <button
                            type="button"
                            onClick={handleSubmit(OnSubmit)}
                            className="mt-10 w-full bg-red-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                            Update
                            </button>
                        </div>
                        </React.Fragment>
                    )
                    }
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}
