import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { allBooksByCategory, allCategories } from '../../api/requests';
import { parseJWT } from '../jwt/parseJWT';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [limits, setLimits] = useState([4, 8, 16]);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    getCategories();
    getAllBooksByCategory(selected, page);
  }, []);

  const getCategories = async () => {
    const response = await allCategories();
    if(response.remote === 'success') setCategories(response.data); 
  }

  const getAllBooksByCategory = async (category, page) => { 
    const token = localStorage.getItem('session-token');
    const response = await allBooksByCategory(token, parseJWT().role, category, limit, page);
    if(response.remote === 'success' && response.data.docs.length > 0) {
      setBooks(response.data.docs);
      setPage(response.data.page);
      setLimit(response.data.limit);
      setPrevPage(response.data.prevPage);
      setNextPage(response.data.nextPage);
    }
  }

  useEffect(() => {
    getAllBooksByCategory(selected, page);
  }, [selected]);

  const nextPageAction = () => {
    if(nextPage !== null)
      getAllBooksByCategory(selected, nextPage);
  }

  const prevPageAction = () => {
    if(prevPage !== null)
      getAllBooksByCategory(selected, prevPage);
  }

  const newLimit = (event) => {
    const newLimit = event.target.value;
    setPage(1);
    setLimit(newLimit);
  }

  useEffect(() => {
    getAllBooksByCategory(selected, page);
  }, [limit]);

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-1 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <div className='sm:col-span-1 xs:col-span-12'>
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium text-gray-700">Filter by category</Listbox.Label>
                <div className="mt-1 relative">
                  <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <span className="flex items-center">
                      <span className="ml-3 block truncate">{selected}</span>
                    </span>
                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {categories.map( category => (
                        <Listbox.Option
                          key={category}
                          className={({ active }) =>
                            classNames(
                              active ? 'text-white bg-indigo-600' : 'text-gray-900',
                              'cursor-default select-none relative py-2 pl-3 pr-9'
                            )
                          }
                          value={category}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                <span
                                  className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                >
                                  {category}
                                </span>
                              </div>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? 'text-white' : 'text-indigo-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
      </div>
        <div className="grid grid-cols-1 mt-10 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {
              books && books.map( book => (
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
              ))
          }
        </div>
        <div className="mt-10 flex-1 flex justify-end">
        <select 
          className="relative inline-flex bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          name="limit"
          value={limit}
          onChange={newLimit}
        >
          {
            limits.map( limit => (
              <option key={limit} value={limit}>{limit}</option>
            ))
          }
        </select>
          <a
              onClick={prevPageAction}
              disabled={prevPage === null ? true : false}
              style={{ cursor: prevPage === null ? 'not-allowed' : 'pointer' }}
              className="ml-3 relative cursor-pointer inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              <span className="block text-sm font-small text-gray-700">Prev</span>
            </a>
          <a
              onClick={nextPageAction}
              disabled={nextPage === null ? true : false}
              style={{ cursor: nextPage === null ? 'not-allowed' : 'pointer' }}
              className="ml-3 cursor-pointer relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="block text-sm font-small text-gray-700">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>
        </div>
      </div>
    </div>
  )
};

export default Home;