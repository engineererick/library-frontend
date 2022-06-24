import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { XIcon, UserIcon, AtSymbolIcon, BookOpenIcon  } from '@heroicons/react/outline';
import { allUsersNonAdmin, borrowBook } from '../../api/requests';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function LendBook({ bookId, setShow }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true)
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState({});

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const token = localStorage.getItem('token');
        const response = await allUsersNonAdmin(token);
        if(response.remote === 'success'){
            setUsers(response.data);
        }
    }

    const borrowBookAction = async () => {
        const token = localStorage.getItem('session-token');
        const response = await borrowBook(bookId, selected._id, token);
        if(response.remote === 'success') {
          await Swal.fire(
            'Borrowed!',
            'The book has been lended.',
            'success'
          );
          navigate('/app/');
        }
        else{
          await Swal.fire(
            'Error!',
            'The book could not be lended.',
            'error'
          );
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { setOpen(false); setShow(false) }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={() => {setOpen(false); setShow(false)}}
                                            >
                                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <Dialog.Title className="text-lg font-medium text-gray-900"> Lend book to an user </Dialog.Title>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="absolute inset-0 px-4 sm:px-6">
                                                <div className="h-full p-2" aria-hidden="true">
                                                    <Listbox value={selected} onChange={setSelected}>
                                                        {
                                                            ({ _open }) => (
                                                                <React.Fragment>
                                                                    <Listbox.Label className="block ml-1 pb-2 text-sm font-medium text-gray-700">Assigned to</Listbox.Label>
                                                                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                                                                        <span className="flex items-center">
                                                                            <span className="ml-3 block truncate">{selected.fullName}</span>
                                                                        </span>
                                                                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                        </span>
                                                                    </Listbox.Button>
                                                                    <Transition
                                                                        show={_open}
                                                                        as={Fragment}
                                                                        leave="transition ease-in duration-100"
                                                                        leaveFrom="opacity-100"
                                                                        leaveTo="opacity-0"
                                                                    >
                                                                        <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                                                            {
                                                                                users.map(user => (
                                                                                    <Listbox.Option
                                                                                        key={user._id}
                                                                                        className={({ active }) =>
                                                                                            classNames(
                                                                                                active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                                                                'cursor-default select-none relative py-2'
                                                                                            )
                                                                                        }
                                                                                        value={user}
                                                                                    >
                                                                                        {({ selected, active }) => (
                                                                                        <>
                                                                                            <div className="flex items-center">
                                                                                                <span
                                                                                                    className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                                                                >
                                                                                                    {user.fullName}
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
                                                                                ))
                                                                            }
                                                                        </Listbox.Options>
                                                                    </Transition>
                                                                </React.Fragment>
                                                            )
                                                        }
                                                    </Listbox>
                                                    {
                                                        Object.keys(selected).length > 0 && (
                                                            <div className='pt-5 ml-1'>
                                                                <h3 className='text-2xl text-center font-bold text-gray-900 pb-2'>
                                                                    User details
                                                                </h3>
                                                                <div className='pt-4 border-t border-gray-300'>
                                                                    <div className='mt-2 grid lg:grid-cols-5 xs:grid-cols-12 place-items-center'>
                                                                        <div className='sm:col-span-1 xs:col-span-12'>
                                                                            <UserIcon className="h-10 w-10" aria-hidden="true" />
                                                                        </div>
                                                                        <div className='sm:col-span-4 xs:col-span-12'>
                                                                            <p className="text-3xl text-gray-900">
                                                                                { selected.fullName }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className='mt-10 grid lg:grid-cols-5 xs:grid-cols-12 place-items-center'>
                                                                        <div className='sm:col-span-1 xs:col-span-12'>
                                                                            <AtSymbolIcon className="h-10 w-10" aria-hidden="true" />
                                                                        </div>
                                                                        <div className='sm:col-span-4 xs:col-span-12'>
                                                                            <p className="text-2xl text-gray-900">
                                                                                { selected.email }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className='mt-10 grid lg:grid-cols-5 xs:grid-cols-12 place-items-center'>
                                                                        <div className='sm:col-span-1 xs:col-span-12'>
                                                                            <BookOpenIcon className="h-10 w-10" aria-hidden="true" />
                                                                        </div>
                                                                        <div className='sm:col-span-4 xs:col-span-12'>
                                                                            <p className="text-2xl text-gray-900">
                                                                                { selected.books.length } books
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className='mt-10 grid lg:grid-cols-4 xs:grid-cols-12 place-items-center pb-2'>
                                                                        <div className='mt-3 xs:ml-1 mr-1 sm:col-span-2 xs:col-span-12 w-full'>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => { setOpen(false); setShow(false) }}
                                                                                className="w-full bg-red-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                        </div>
                                                                        <div className='mt-3 ml-1 xs:mr-1 sm:col-span-2 xs:col-span-12 w-full'>
                                                                            <button
                                                                                type="button"
                                                                                onClick={borrowBookAction}
                                                                                className="w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                            >
                                                                                Lend
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}