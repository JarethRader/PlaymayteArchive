import * as React from 'react';
import { Link } from 'react-router-dom';
import { logoUrl } from '../App';

type homeState = {
  _mounted: boolean;
};

export class Home extends React.Component<{}, homeState> {
  componentDidMount() {
    this.setState({ _mounted: true });
  }

  componentWillUnmount() {
    this.setState({ _mounted: false });
  }

  render() {
    return (
      <div className='grid grid-cols-1 min-h-screen app assistant-font'>
        <div className='grid grid-cols-2 h-24 h-8 content-center'>
          <div className='container object-center w-1/2'>
            <div className='h-12 w-32'>
              <h1 className='text-black border-white text-center'>
                <div className='w-64 h-12'>
                  <img src={logoUrl} alt='Logo' />
                </div>
              </h1>
            </div>
          </div>
          <div className='flex justify-end container object-center w-5/6'>
            <Link
              className='bg-white px-6 py-3 rounded hover:bg-gray-300 shadow-2xl content-center border-gray-300 border-2'
              to='/login'>
              Login
            </Link>
          </div>
        </div>
        <div className='h-64 grid content-center'>
          <div className='container object-center mx-auto'>
            <div className='grid grid-cols-1'>
              <div className='flex justify-center'>
                <div className='grid grid-row-3'>
                  <div
                    className='font-bold text-center'
                    style={{ fontSize: '125px' }}>
                    <h1 className='text-white stroke'>Find Your Playmayte</h1>
                  </div>
                  <div className='grid grid-cols-1'>
                    <Link
                      className='bg-white px-8 py-4 mx-auto hover:bg-gray-300 border-gray-300 border-2'
                      to='/login'>
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
