import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbsProps {
  className?: string;
  items?: { label: string; path?: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '', items }) => {
  const location = useLocation();
  
  // If no items are provided, generate them based on the current path
  const breadcrumbItems = items || generateBreadcrumbItems(location.pathname);
  
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Home
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              {item.path ? (
                <Link 
                  to={item.path} 
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-white md:ml-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-300 md:ml-2">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumb items based on path
const generateBreadcrumbItems = (pathname: string): { label: string; path?: string }[] => {
  const paths = pathname.split('/').filter(Boolean);
  
  if (paths.length === 0) return [];
  
  return paths.map((path, index) => {
    // Create the full path up to this segment
    const fullPath = `/${paths.slice(0, index + 1).join('/')}`;
    
    // Format the path name to be more readable
    let label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Special case for IDs
    if (/^[0-9a-f]{24}$/.test(path) || /^[0-9a-zA-Z]{8,}$/.test(path)) {
      label = 'Details';
    }
    
    // Don't make the current page clickable
    const isLastItem = index === paths.length - 1;
    
    return {
      label,
      path: isLastItem ? undefined : fullPath
    };
  });
};

export default Breadcrumbs; 