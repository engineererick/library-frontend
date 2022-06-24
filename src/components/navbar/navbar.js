import React, { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { parseJWT } from '../jwt/parseJWT';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
};

const Navbar = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setId(parseJWT().id);
    setRole(parseJWT().role);
    setFullName(parseJWT().fullName);
  }, [])

  const handleLogOut = () => {
    localStorage.removeItem('session-token');
    navigate('/signin');
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center" onClick={() => navigate('/app/')}>
                  <img
                    className="block lg:hidden h-10 w-auto"
                    src="https://www.svgrepo.com/show/31136/books.svg"
                    alt="Library"
                  />
                  <img
                    className="hidden lg:block h-10 w-auto cursor-pointer"
                    src="https://www.svgrepo.com/show/31136/books.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <a
                        key='homeA'
                        onClick={() => navigate('/app/')}
                        className={
                            classNames(
                                'text-white hover:bg-gray-700 hover:text-white',
                                'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                            )
                        }
                        aria-current={'page'}
                    >
                        Home
                    </a>
                    {
                        role === 'admin' && (
                          <a
                              key='adminA'
                              onClick={() => navigate('/app/admin')}
                              className={
                                  classNames(
                                      'text-white hover:bg-gray-700 hover:text-white',
                                      'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                                  )
                              }
                          >
                              Admin
                          </a>
                        )
                    }
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <label
                    className='text-white hidden lg:block'
                >
                    Welcome, <b>{fullName}</b>
                </label>
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <img
                        className="h-10 w-12 rounded-full"
                        src="https://images.unsplash.com/photo-1605345981660-ab44e036a21d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1688&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => navigate('/app/books/borrowed/' + id, { state: { id: id }} )}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Borrowed books
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={handleLogOut}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                    key='homeA'
                    onClick={() => navigate('/app/')}
                    className={
                        classNames(
                            'text-white hover:bg-gray-700 hover:text-white',
                            'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                        )
                    }
                    aria-current={'page'}
                >
                    Home
                </a>
                {
                    role === 'admin' && (
                        <a
                            key='adminA'
                            onClick={() => navigate('/app/admin')}
                            className={
                                classNames(
                                    'text-white hover:bg-gray-700 hover:text-white',
                                    'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                                )
                            }
                        >
                            Admin
                        </a>
                    )
                }
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
};

export default Navbar;