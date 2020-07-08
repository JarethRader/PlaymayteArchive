/**
 * @Author Jareth Rader
 * @desc This is the 404 page that is displayed if a
 * user tries to navigate to a nonexistant route on the site
 */

import * as React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div
      className='grid grid-cols-1 content-center'
      style={{
        minHeight: '100vh',
        background: '#dedede',
        backgroundImage: 'linear-gradient(90deg, #efd5ff 0%, #515ada 100%)',
      }}>
      <div className='container'>
        <div className='container content-center'>
          <div className='col-md-12 text-center assistant-font text-lg'>
            <span className='text-6xl'>404</span>
            <div>The page you are looking for was not found.</div>
            <Link
              to='/'
              className='text-white hover:text-gray-200 hover:underline cursor-pointer'>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
