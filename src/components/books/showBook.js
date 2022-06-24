import React, { useEffect, useState, Fragment, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBookById } from '../../api/requests';
import { CalendarIcon, UserIcon, CollectionIcon } from '@heroicons/react/outline';
import { parseJWT } from '../jwt/parseJWT';
import Swal from 'sweetalert2';
import { deleteBook, borrowBook,unBorrowBook } from '../../api/requests';
import LendBook from './lendBook';

export const ShowBook = () => {
  const { state: { id }} = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useState({});
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setRole(parseJWT().role);
    setUserId(parseJWT().id);
    getBookDetails();
  }, []);

  const getBookDetails = async () => {
    const response = await getBookById(id);
    if(response.remote === 'success') setBook(response.data);
  }

  const deleteBookAction = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'blue',
      confirmButtonText: 'Yes, delete it!'
    }).then(async result => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('session-token');
        const userId = book.user;
        const response = await deleteBook(id, userId, token);
        if(response?.remote === 'success') {
          await Swal.fire(
            'Deleted!',
            'The book has been deleted.',
            'success'
          );
          navigate('/app/');
        }
        else{
          await Swal.fire(
            'Error!',
            'The book could not be deleted.',
            'error'
          );
        }
      }
    });
  }

  const borrowBookAction = async () => {
    const token = localStorage.getItem('session-token');
    const response = await borrowBook(id, parseJWT().id, token);
    if(response.remote === 'success') {
      await Swal.fire(
        'Borrowed!',
        'The book has been borrowed.',
        'success'
      );
      navigate('/app/');
    }
    else{
      await Swal.fire(
        'Error!',
        'The book could not be borrowed.',
        'error'
      );
    }
  }

  const unBorrowBookAction = async () => {
    const token = localStorage.getItem('session-token');
    const response = await unBorrowBook(id, parseJWT().id, token);
    if(response.remote === 'success') {
      await Swal.fire(
        'Borrowed!',
        'The book has been unborrowed.',
        'success'
      );
      navigate('/app/');
    }
    else{
      await Swal.fire(
        'Error!',
        'The book could not be unborrowed.',
        'error'
      );
    }
  }

  const lendBookAction = async () => {
    setShowModal(true);
  }

  return (
    <div className="bg-white">
      <div className="pt-6">
        <div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4 lg:border-r lg:border-gray-300">
            <img
              src={book.cover}
              alt={book.title}
              style={{ height: '600px', objectFit: 'contain' }}
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
            <div className="lg:col-span-2 lg:pr-8">
              <h1 className="text-4xl text-center font-extrabold tracking-tight text-gray-900">{book.title}</h1>
            </div>
            <div className="mt-4 lg:mt-0 lg:row-span-3 ">
              <div className='mt-10 grid lg:grid-cols-5 xs:grid-cols-12 place-items-center'>
                <div className='sm:col-span-1 xs:col-span-12'>
                  <UserIcon className="h-10 w-10" aria-hidden="true" />
                </div>
                <div className='sm:col-span-4 xs:col-span-12'>
                  <p className="text-3xl text-gray-900 hidden lg:block">
                    Author: {book.author}
                  </p>
                  <p className="text-3xl text-gray-900 block lg:hidden">
                    {book.author}
                  </p>
                </div>
              </div>
              <div className="mt-10 grid lg:grid-cols-5 xs:grid-cols-12 place-items-center">
                <div className='sm:col-span-1 xs:col-span-12'>
                  <CollectionIcon className="h-10 w-10" aria-hidden="true" />
                </div>
                <div className='sm:col-span-4 xs:col-span-12 lg:pl-6'>
                  <p className="text-3xl text-gray-900 hidden lg:block">
                    Category: {book.category}
                  </p>
                  <p className="text-3xl text-gray-900 block lg:hidden">
                    {book.category}
                  </p>
                </div>
              </div>
              <div className="mt-10 grid lg:grid-cols-5 xs:grid-cols-12 place-items-center">
                <div className='sm:col-span-1 xs:col-span-12'>
                  <CalendarIcon className="h-10 w-10" aria-hidden="true" />
                </div>
                <div className='sm:col-span-4 xs:col-span-12 lg:pl-5'>
                  <p className="text-3xl text-gray-900 hidden lg:block">
                    Year: {book.yearofpublication}
                  </p>
                  <p className="text-3xl text-gray-900 block lg:hidden">
                    {book.yearofpublication}
                  </p>
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
                          onClick={() => navigate(`/app/book/edit/${book._id}`, { state: { id: book._id } })}
                          className="mt-10 w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Edit
                        </button>
                      </div>
                      <div className='lg:ml-2 lg:mr-2'>
                        <button
                          type="button"
                          onClick={deleteBookAction}
                          className="mt-10 w-full bg-red-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Delete
                        </button>
                      </div>
                    </React.Fragment>
                  ) 
                }
              </div>
              <div className='mt-10 lg:grid lg:grid-cols-2'>
                  {
                    (role === 'admin' && book.available === true) && (
                      <div className={'col-span-1'}>
                        <button
                          type="button"
                          onClick={lendBookAction}
                          disabled={!book.available}
                          style={ book.available === false ? { backgroundColor: '#ccc', cursor: 'no-drop' } : {}}
                          className="mt-10 w-full border bg-orange-600 border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Lend
                        </button>
                      </div>
                    )
                  }
                  {
                    book.user !== '' ?
                     book.user === userId && (
                      <div className={ role === 'admin' ? 'lg:ml-2 col-span-2' : 'col-span-2' }>
                        <button
                          type="button"
                          onClick={unBorrowBookAction}
                          className="mt-10 w-full bg-yellow-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Unborrow
                        </button>
                      </div>
                     )
                    : (
                      <div className={ role === 'admin' ? 'lg:ml-2 col-span-1' : 'col-span-2' }>
                        <button
                          type="button"
                          onClick={borrowBookAction}
                          className="mt-10 w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Borrow
                        </button>
                      </div>
                    )
                  }
                </div>
            </div>
          </div>
        </div>
        {
          showModal === true && (
            <LendBook bookId={book._id} setShow={setShowModal} />
          )
        }
      </div>
    </div>
  )
}
