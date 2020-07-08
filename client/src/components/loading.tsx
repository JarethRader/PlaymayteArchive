import React from 'react';

export class Loading extends React.PureComponent {
  render() {
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
              <span>...Loading</span>
              <div className='mx-auto'>
                <div className='lds-roller'>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
