import React from 'react';
import { Route, Routes } from "react-router-dom";
import { AdminIndex } from '../admin/admin';
import BorrowedBooks from '../books/borrowedBooks';
import { EditBook } from '../books/editBook';
import { ShowBook } from '../books/showBook';
import Home from '../home';
import Navbar from '../navbar/navbar';

export const Layout = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route index element={<Home />} />

                <Route path='/admin' element={<AdminIndex />} />

                <Route path='/book/:id' element={<ShowBook />} />
                <Route path='/book/edit/:id' element={<EditBook />} />
                <Route path='/books/borrowed/:id' element={<BorrowedBooks />} />
            </Routes>
        </>
    );
}
