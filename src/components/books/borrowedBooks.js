import React, { Fragment, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { allBorrowedBooks } from '../../api/requests';
import { parseJWT } from '../jwt/parseJWT';

const BorrowedBooks = () => {
    const { state: { id }} = useLocation();
    const navigate = useNavigate();
    const [books, setBooks] = React.useState([]);

    useEffect(() => {
        getAllBooks();
    }, []);

    const getAllBooks = async () => {
        const token = localStorage.getItem('session-token');
        const response = await allBorrowedBooks(id, token);
        setBooks(response.data);
    }

    return (
        <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {books && books.map( book => (
                <a key={book._id} className="group">
                <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                    <img
                    onClick={() => navigate(`/app/book/${book._id}`, { state: { id: book._id } })}
                    src={book.cover}
                    alt={book.title}
                    style={{ height: '280px', objectFit: 'contain' }}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                    />
                </div>
                <div className='text-center'>
                    <h3 className="pt-1 lg:border-t lg:border-gray-300 mt-4 font-medium text-gray-900">{book.title}</h3>
                    <p className="mt-1 text-lg text-sm text-gray-700">Category: {book.category}</p>
                </div>
                </a>
            ))}
            </div>
        </div>
        </div>
    )
};

export default BorrowedBooks;