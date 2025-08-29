import React, { useEffect } from 'react';

/**
 * A wrapper component that disables scrolling on the body element.
 * @param {object} props
 * @param {React.ReactNode} props.children - The child components to render.
 */
const StaticPageWrapper = ({ children }) => {
  useEffect(() => {
    // When the component mounts, add a class to the body to disable scrolling.
    document.body.classList.add('static-page-active');

    // Return a cleanup function that runs when the component unmounts.
    return () => {
      document.body.classList.remove('static-page-active');
    };
  }, []);

  return <>{children}</>;
};

export default StaticPageWrapper;
