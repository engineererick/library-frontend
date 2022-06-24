import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { addBook } from '../../api/requests';
import Swal from 'sweetalert2';

const AddBook = () => {
    const { register, handleSubmit, reset } = useForm();
    const [added, setAdded] = React.useState(false);

    const OnSubmit = async data => {
        if(data.cover[0].size > 10485760){
            Swal.fire('Error', 'File should be less than 10MB', 'error');
            return;
        }

        const title = data.title;
        const yearofpublication = data.yearofpublication;
        const author = data.author;
        const category = data.category;
        const cover = await convertToBase64(data.cover[0]);
        const token = localStorage.getItem('session-token');

        getImageDimensions(data.cover[0], async callback => {
            const { width, height } = callback;
            if(width > 612 || height > 720){
                Swal.fire('Error', 'Image should be less than 612 x 720', 'error');
                return;
            }
            const response = await addBook(title, yearofpublication, author, category, cover, token);
            if(response.remote === "success") {
                Swal.fire('Success', 'Book added successfully', 'success');
                setAdded(true);
            }
            else{
                Swal.fire('Error', response.errors.errors, 'error');
            }
        });
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

    useEffect(() => {
        reset({
            title: '',
            yearofpublication: '',
            author: '',
            category: '',
            cover: ''
        });
    }, [added]);

    return (
        <div className="min-h-full flex items-center justify-center pt-2 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(OnSubmit)}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input 
                                id="title" 
                                name="title" 
                                type="text" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Title" 
                                {...register("title")}
                            />
                        </div>
                        <div className='pt-3'>
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
                        <div className='pt-3'>
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
                        <div className='pt-3'>
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
                        <div className='pt-3'>
                            <label htmlFor="cover" className="block text-sm font-medium text-gray-700">Cover</label>
                            <input 
                                id="cover" 
                                name="cover" 
                                type="file" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                accept="image/png, image/gif, image/jpeg"
                                {...register("cover")}
                            />
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='w-full'>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Add book
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBook;